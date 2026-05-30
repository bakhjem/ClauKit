# Node.js Framework Patterns

## Express.js

### Application structure
```
src/
├── app.ts              # Express app + middleware stack
├── server.ts           # HTTP server + graceful shutdown
├── routes/             # express.Router() modules
│   ├── users.ts
│   └── auth.ts
├── controllers/        # Route handlers (thin layer)
├── services/           # Business logic
├── repositories/       # Data access (Prisma / raw queries)
├── middleware/         # Custom middleware
│   ├── authenticate.ts
│   ├── validate.ts
│   └── error.ts
└── lib/
    ├── logger.ts
    └── prisma.ts
```

### Router modularization
```ts
// routes/users.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/async-handler';
import { CreateUserSchema } from '../schemas/user';
import * as userController from '../controllers/users';

const router = Router();

router.get('/', authenticate, asyncHandler(userController.list));
router.post('/', validate(CreateUserSchema), asyncHandler(userController.create));
router.get('/:id', authenticate, asyncHandler(userController.getOne));

export default router;

// app.ts
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorMiddleware); // MUST be last
```

### Production checklist
```ts
// Disable fingerprinting
app.disable('x-powered-by');

// Trust proxy (for correct IP behind load balancer / nginx)
app.set('trust proxy', 1);

// Compression
import compression from 'compression';
app.use(compression());

// Body parsing limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

---

## Fastify

### Plugin encapsulation model
```ts
// Each plugin gets its own scope — decorators / hooks don't leak unless using fp()
import Fastify from 'fastify';

const app = Fastify({ logger: true });

// Public routes (no auth)
await app.register(async (instance) => {
  instance.get('/health', async () => ({ status: 'ok' }));
});

// Protected routes (auth applied to entire scope)
await app.register(async (instance) => {
  instance.addHook('onRequest', instance.authenticate);
  await instance.register(usersPlugin, { prefix: '/users' });
  await instance.register(ordersPlugin, { prefix: '/orders' });
}, { prefix: '/api/v1' });
```

### Schema-first validation (JSON Schema / `@fastify/ajv-compiler`)
```ts
// Shared schema registered once
fastify.addSchema({
  $id: 'UserSchema',
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
  },
});

// Route uses $ref — validated + serialized automatically (faster than JSON.stringify)
fastify.post<{ Body: CreateUserDto }>(
  '/users',
  {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
        },
      },
      response: { 201: { $ref: 'UserSchema#' } },
    },
  },
  async (request, reply) => {
    const user = await userService.create(request.body);
    return reply.status(201).send(user);
  },
);
```

### Lifecycle hooks
```
onRequest          → preParsing         → preValidation
    → preHandler   → handler            → preSerialization
    → onSend       → onResponse         (→ onError on failure)
```

### vs Express trade-offs
| Aspect | Fastify | Express |
|---|---|---|
| Throughput | ~65k req/s | ~35k req/s |
| Validation | Built-in (JSON Schema) | Manual (`zod`, `joi`) |
| Plugin system | Encapsulated scopes | Global middleware |
| TypeScript | First-class | Via `@types/express` |
| Ecosystem | Growing | Mature / massive |
| Learning curve | Moderate | Low |

**Choose Fastify when:** high throughput, schema validation at the edge, new greenfield project.
**Choose Express when:** maximum ecosystem access, existing team familiarity, flexible middleware.

---

## NestJS

### Module / Controller / Service structure
```ts
// users.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

// users.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
```

### Dependency injection — custom providers
```ts
// Token-based injection for interface abstraction
export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

@Module({
  providers: [
    { provide: EMAIL_SERVICE, useClass: SendGridEmailService },
  ],
})
export class NotificationsModule {}

// In consumer
constructor(@Inject(EMAIL_SERVICE) private emailService: IEmailService) {}
```

### Guards / Interceptors / Pipes
```ts
// Guard — authorization
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    const user = ctx.switchToHttp().getRequest().user;
    return roles?.includes(user.role) ?? true;
  }
}

// Interceptor — response transformation
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(_ctx: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(map(data => ({ data })));
  }
}

// Pipe — validation
// Use built-in ValidationPipe with class-validator DTOs
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

### Config with `@nestjs/config`
```ts
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
  }),
}),

// In service
constructor(private config: ConfigService) {}
const secret = this.config.getOrThrow<string>('JWT_SECRET');
```

### Microservice transport (NestJS)
```ts
// TCP transport
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { host: 'localhost', port: 3001 },
});

// Redis transport
{ transport: Transport.REDIS, options: { host: 'localhost', port: 6379 } }

// RabbitMQ
{ transport: Transport.RMQ, options: { urls: ['amqp://localhost:5672'], queue: 'orders_queue' } }
```

---

## GraphQL Servers

### Apollo Server 4 + Express
```ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      user: req.user,
      dataloaders: createDataloaders(), // new loaders per request!
    }),
  }),
);
```

### DataLoader for N+1 prevention
```ts
import DataLoader from 'dataloader';

// Create per-request (not singleton — stale cache otherwise)
function createDataloaders() {
  return {
    userById: new DataLoader<string, User>(async (ids) => {
      const users = await prisma.user.findMany({ where: { id: { in: [...ids] } } });
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) ?? new Error(`User ${id} not found`));
    }),
  };
}

// In resolver
const user = await context.dataloaders.userById.load(post.authorId);
```

### Subscriptions with `graphql-ws`
```ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useServer({ schema }, wsServer);
```

### Schema-first vs code-first
| Approach | Tool | Best for |
|---|---|---|
| Schema-first | `graphql-tag`, Apollo | Teams with frontend/backend split — SDL as contract |
| Code-first | `@nestjs/graphql` + `@ObjectType` | TypeScript-first, prefer auto-generated SDL |

---

## Framework Selection Guide

| Framework | Throughput | Type safety | DI | Ecosystem | Best for |
|---|:---:|:---:|:---:|:---:|---|
| **Express** | ⭐⭐⭐ | Manual | No | Massive | Existing codebases, prototypes, max flexibility |
| **Fastify** | ⭐⭐⭐⭐⭐ | Good | No | Growing | High-throughput APIs, schema validation at edge |
| **NestJS** | ⭐⭐⭐⭐ | Excellent | ✅ | Good | Enterprise, large teams, multiple transports |
| **GraphQL** | ⭐⭐⭐ | Excellent | Varies | Good | Multiple clients, complex data graphs, rapid iteration |

**Decision heuristic:**
- Need max flexibility or prototyping quickly → **Express**
- Need max throughput (fintech, gaming, IoT) → **Fastify**
- Large team, enterprise TypeScript project, microservices → **NestJS**
- Frontend clients need flexible querying, mobile + web + external → **GraphQL**
- Serverless (AWS Lambda, Vercel) → **Express** (smallest cold start) or **Fastify** (built-in serverless plugins)
