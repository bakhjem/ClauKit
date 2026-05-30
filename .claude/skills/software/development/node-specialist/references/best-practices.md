# Node.js Best Practices

## Async/Await & Promise Patterns

### Always await — never mix styles
```ts
// ❌ mixed: confusing control flow
async function bad() {
  return fetchUser().then(user => transform(user)).catch(err => log(err));
}

// ✅ consistent async/await
async function good() {
  try {
    const user = await fetchUser();
    return transform(user);
  } catch (err) {
    log(err);
    throw err;
  }
}
```

### Parallel ops with `Promise.all`
```ts
// ❌ sequential — 2x slower
const user = await db.user.findUnique({ where: { id } });
const orders = await db.order.findMany({ where: { userId: id } });

// ✅ concurrent
const [user, orders] = await Promise.all([
  db.user.findUnique({ where: { id } }),
  db.order.findMany({ where: { userId: id } }),
]);
```

### Partial failure tolerance with `Promise.allSettled`
```ts
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);
const successes = results
  .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled')
  .map(r => r.value);
```

### `AsyncLocalStorage` for request-scoped context
```ts
import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage<{ requestId: string; userId?: string }>();

// Middleware
app.use((req, res, next) => {
  requestContext.run({ requestId: crypto.randomUUID() }, next);
});

// Anywhere in the call stack — no prop-drilling
function logSomething(msg: string) {
  const ctx = requestContext.getStore();
  logger.info({ requestId: ctx?.requestId, msg });
}
```

---

## Error Handling

### Unhandled rejection handler — always add at startup
```ts
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled promise rejection');
  process.exit(1); // fail fast — supervisor will restart
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
```

### Typed `AppError` class
```ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true, // operational = expected, don't page
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}
```

### Express centralized error middleware (must be 4-arg, registered last)
```ts
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  // Unexpected error — log and return 500
  logger.error({ err, path: req.path }, 'Unexpected error');
  res.status(500).json({ error: 'Internal server error' });
}

// Register AFTER all routes
app.use(errorMiddleware);
```

### Fastify `setErrorHandler`
```ts
fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }
  request.log.error(error);
  reply.status(500).send({ error: 'Internal server error' });
});
```

---

## Security Hardening

### `helmet` — one line, 11 security headers
```ts
import helmet from 'helmet';
app.use(helmet()); // Sets: CSP, HSTS, X-Frame-Options, X-XSS-Protection, etc.
```

### Rate limiting with Redis store (distributed)
```ts
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl',
  points: 100,       // requests
  duration: 60,      // per 60 seconds
  blockDuration: 60, // block for 60s after limit reached
});

// Express middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip ?? 'unknown');
    next();
  } catch {
    res.status(429).json({ error: 'Too many requests' });
  }
});
```

### Input validation at API boundary with `zod`
```ts
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150).optional(),
});

// In route handler
const result = CreateUserSchema.safeParse(req.body);
if (!result.success) {
  throw new ValidationError(result.error.issues.map(i => i.message).join(', '));
}
const { email, name, age } = result.data; // fully typed
```

### Environment variables validated at startup
```ts
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
});

// Throws on startup if any required env var is missing/invalid
export const env = EnvSchema.parse(process.env);
```

### JWT — algorithm pinning + expiry enforcement
```ts
import jwt from 'jsonwebtoken';

// Sign
const token = jwt.sign(
  { sub: userId, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m', algorithm: 'HS256' }
);

// Verify — always pin algorithm to prevent alg:none attacks
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
} catch (err) {
  if (err instanceof jwt.TokenExpiredError) throw new AppError('Token expired', 401);
  if (err instanceof jwt.JsonWebTokenError) throw new AppError('Invalid token', 401);
  throw err;
}
```

---

## Performance

### Worker thread for CPU-bound work
```ts
// main.ts
import { Worker } from 'node:worker_threads';

function runWorker(data: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}

// worker.ts
import { workerData, parentPort } from 'node:worker_threads';
const result = heavyCpuWork(workerData);
parentPort!.postMessage(result);
```

### Cluster module — multi-core utilization
```ts
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork();
  });
} else {
  startServer(); // each worker runs its own HTTP server
}
```

### Stream-based file processing — avoid memory spikes
```ts
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline, Transform } from 'node:stream';
import { promisify } from 'node:util';

const pipelineAsync = promisify(pipeline);

await pipelineAsync(
  createReadStream('large-input.csv'),
  new Transform({
    transform(chunk, _enc, callback) {
      callback(null, processChunk(chunk));
    },
  }),
  createWriteStream('output.csv'),
);
// Peak memory ≈ highWaterMark (default 16KB), not file size
```

### `setImmediate` vs `process.nextTick`
```ts
// process.nextTick — fires BEFORE I/O events (microtask queue)
// Use: propagate errors, defer tiny work before I/O
process.nextTick(() => callback(new Error('validation failed')));

// setImmediate — fires AFTER I/O events (check phase of event loop)
// Use: break up heavy sync work to allow I/O between chunks
function processLargeArray(arr: number[], index = 0) {
  if (index >= arr.length) return;
  doWork(arr[index]);
  setImmediate(() => processLargeArray(arr, index + 1));
}
```

---

## Logging

### `pino` setup — structured, fast, low-overhead
```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  redact: ['req.headers.authorization', 'body.password', 'body.creditCard'],
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

// Log levels: trace (fine profiling) | debug (dev) | info (prod ops) | warn (degraded) | error (failures) | fatal (crash)
```

### Attach correlation ID to every log entry
```ts
import { requestContext } from './async-context';

// Wrap pino child logger with request context
export function getRequestLogger() {
  const ctx = requestContext.getStore();
  return logger.child({ requestId: ctx?.requestId, userId: ctx?.userId });
}
```

---

## Graceful Shutdown

```ts
const server = app.listen(env.PORT);

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');

  // 1. Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    // 2. Drain in-flight requests (give them up to 30s)
    await new Promise(resolve => setTimeout(resolve, 30_000));

    // 3. Close DB connections
    await prisma.$disconnect();
    await redisClient.quit();

    logger.info('Graceful shutdown complete');
    process.exit(0);
  });

  // 4. Force exit if drain takes too long
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 35_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

### Health check endpoints
```ts
// Liveness — is the process alive?
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Readiness — is the process ready to handle traffic?
app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // DB ping
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', reason: 'DB unreachable' });
  }
});
```
