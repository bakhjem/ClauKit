# Common Node.js Code Snippets

## Express Middleware Patterns

### Async wrapper — prevents missed `next(err)` calls
```ts
import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user);
}));
```

### Request logging with `pino-http`
```ts
import pinoHttp from 'pino-http';
import { logger } from './logger';

app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));
```

### `zod` validation middleware
```ts
import { z, ZodSchema } from 'zod';
import { RequestHandler } from 'express';

export function validate(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return res.status(422).json({ error: result.error.flatten() });
    }
    req[target] = result.data;
    next();
  };
}

// Usage
router.post('/users', validate(CreateUserSchema), asyncHandler(createUserHandler));
```

### JWT auth middleware
```ts
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!, { algorithms: ['HS256'] });
    (req as any).user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) return res.status(401).json({ error: 'Token expired' });
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## Fastify Route Patterns

### Plugin with `@fastify/plugin` (preserves encapsulation)
```ts
import fp from '@fastify/plugin';
import { FastifyPluginAsync } from 'fastify';

const usersPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: { id: string } }>(
    '/users/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
        response: { 200: { $ref: 'UserSchema#' } },
      },
    },
    async (request) => {
      return userService.findById(request.params.id);
    },
  );
};

export default fp(usersPlugin, { name: 'users' });
```

### Fastify JWT setup
```ts
import fastifyJwt from '@fastify/jwt';

await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET! });

// Decorate for route-level auth
fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Usage in route
fastify.get('/protected', { onRequest: [fastify.authenticate] }, async (req) => {
  return { user: req.user };
});
```

### Lifecycle hook order
```
onRequest → preParsing → preValidation → preHandler → handler → preSerialization → onSend → onResponse
```

---

## Prisma Query Patterns

### CRUD essentials
```ts
// Find one (throws if not found)
const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: { id: true, email: true, name: true } });

// Find many with filters
const users = await prisma.user.findMany({
  where: { role: 'ADMIN', deletedAt: null },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: 0,
});

// Create
const user = await prisma.user.create({ data: { email, name, passwordHash } });

// Update
const user = await prisma.user.update({ where: { id }, data: { name } });

// Soft delete
await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
```

### Static transaction (batch — atomic, no partial commit)
```ts
const [newUser, newAccount] = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.account.create({ data: accountData }),
]);
```

### Interactive transaction (sequential with logic)
```ts
const result = await prisma.$transaction(async (tx) => {
  const sender = await tx.wallet.findUniqueOrThrow({ where: { userId: senderId } });
  if (sender.balance < amount) throw new Error('Insufficient funds');

  await tx.wallet.update({ where: { userId: senderId }, data: { balance: { decrement: amount } } });
  await tx.wallet.update({ where: { userId: receiverId }, data: { balance: { increment: amount } } });
  return tx.transfer.create({ data: { senderId, receiverId, amount } });
});
```

### Cursor-based pagination (efficient for large datasets)
```ts
async function paginate(cursor?: string, take = 20) {
  const items = await prisma.post.findMany({
    take: take + 1, // fetch one extra to detect next page
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'desc' },
  });

  const hasNextPage = items.length > take;
  return {
    items: hasNextPage ? items.slice(0, take) : items,
    nextCursor: hasNextPage ? items[take - 1].id : null,
  };
}
```

---

## JWT Authentication

### Sign + verify with refresh token rotation
```ts
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export function signTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TTL,
    algorithm: 'HS256',
  });
  const refreshToken = crypto.randomBytes(40).toString('hex'); // opaque, stored in DB
  return { accessToken, refreshToken };
}

// Refresh route
app.post('/auth/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const session = await db.session.findUniqueOrThrow({ where: { token: refreshToken } });

  if (session.expiresAt < new Date()) throw new AppError('Refresh token expired', 401);

  // Rotate: invalidate old, issue new
  await db.session.delete({ where: { token: refreshToken } });
  const tokens = signTokens(session.userId, session.role);
  await db.session.create({ data: { token: tokens.refreshToken, userId: session.userId, expiresAt: addDays(7) } });

  res.json(tokens);
}));
```

---

## Rate Limiting

### `express-rate-limit` — simple, in-memory
```ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

app.use('/api/', limiter);
```

---

## Streaming

### Transform stream — uppercase example
```ts
import { Transform } from 'node:stream';

class UpperCaseTransform extends Transform {
  _transform(chunk: Buffer, _encoding: string, callback: () => void) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}
```

### `stream.pipeline` — preferred over `.pipe()`
```ts
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

// Auto-cleans up on error — no dangling streams
await pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('output.txt.gz'),
);
```

### HTTP chunked / SSE response
```ts
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});
```

---

## Worker Threads

### Simple worker pool (reuse workers)
```ts
import { Worker } from 'node:worker_threads';
import os from 'node:os';

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ data: unknown; resolve: Function; reject: Function }> = [];
  private idle: Worker[] = [];

  constructor(private workerPath: string, size = os.cpus().length) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerPath);
      w.on('message', (result) => {
        const task = this.queue.shift();
        if (task) { this.runTask(w, task); } else { this.idle.push(w); }
        // resolve current task
      });
      this.idle.push(w);
    }
  }

  run(data: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const worker = this.idle.pop();
      if (worker) this.runTask(worker, { data, resolve, reject });
      else this.queue.push({ data, resolve, reject });
    });
  }

  private runTask(worker: Worker, task: { data: unknown; resolve: Function; reject: Function }) {
    worker.once('message', task.resolve);
    worker.once('error', task.reject);
    worker.postMessage(task.data);
  }
}
```

---

## BullMQ Job Queue

### Producer + Consumer pattern
```ts
import { Queue, Worker, Job } from 'bullmq';
import { createClient } from 'redis';

const connection = { host: 'localhost', port: 6379 };

// Producer
const emailQueue = new Queue('email', { connection });

await emailQueue.add(
  'welcome-email',
  { to: user.email, name: user.name },
  { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 100 },
);

// Consumer (separate process/file)
const worker = new Worker(
  'email',
  async (job: Job) => {
    const { to, name } = job.data;
    await sendEmail({ to, subject: 'Welcome!', body: `Hi ${name}` });
    job.log(`Email sent to ${to}`);
  },
  { connection, concurrency: 5 },
);

worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Job failed'));
```
