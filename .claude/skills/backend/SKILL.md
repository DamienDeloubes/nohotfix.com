# Backend Development — NoHotfix

TRIGGER: When building, modifying, or debugging API routes, middleware, plugins, repositories, adapters, or use cases in `apps/api/` or `packages/domains/`.

## Stack

- Fastify 5 + TypeScript 5.7 + Node.js 20
- Kysely (query builder, not ORM) + PostgreSQL
- WorkOS SDK (AuthKit + JWT)
- Zod (request/response validation from `@nohotfix/shared`)
- OpenTelemetry (tracing) + Sentry (error tracking)
- Pino (logging)

## Project Structure

```
apps/api/src/
  server.ts              # Fastify bootstrap, plugin registration, error handler
  config.ts              # Zod-validated env config
  composition-root.ts    # DI container: all repos + services + adapters

  routes/
    auth.ts              # OAuth flow, token refresh, logout (no auth guard)
    identity.ts          # Users, orgs, memberships
    authoring.ts         # Playbooks, specs, library
    execution.ts         # Runs, decisions, artifacts
    billing.ts           # Stripe checkout, webhooks
    audit.ts             # Changelog, history

  shared/
    middleware/
      auth.ts            # JWT validation → request.authUser
      org-scope.ts       # Slug resolution + membership guard → request.orgContext
      immutability-guard.ts  # Rejects writes to terminal runs
      subscription-guard.ts  # Blocks expired/past_due orgs
    plugins/
      db.ts              # Kysely client → fastify.db
      workos.ts          # WorkOS SDK → fastify.workos
      otel.ts            # @fastify/otel + NodeSDK init (conditional on OTEL_EXPORTER_OTLP_ENDPOINT)
      sentry.ts          # Sentry error tracking (conditional)

  adapters/
    repositories/        # Kysely implementations of domain ports
    services/            # Infrastructure adapters (WorkOS profile, presigned URLs)

packages/domains/{identity,billing,authoring,execution,audit}/src/
  entities/              # Aggregate roots + value objects
  services/              # Domain services (state machines, validators)
  use-cases/             # Business logic orchestrators
  ports/                 # Repository + adapter interfaces
  errors/                # Domain-specific error classes

packages/shared/src/
  schemas/               # Zod request/response schemas
  errors/                # DomainError base + ErrorCode enum
  types/                 # Shared TypeScript types
  constants/             # Enums and constants

packages/db/src/
  schema.ts              # Kysely Database interface (14 tables)
  client.ts              # createKyselyClient factory
  migrations/            # Numbered SQL migrations
```

## Server Bootstrap Order

Plugin registration order matters — later plugins depend on earlier ones:

1. Config (Zod parse of `process.env`)
2. `fastify.decorate('config', config)`
3. OTel plugin (conditional on `OTEL_EXPORTER_OTLP_ENDPOINT`)
4. Sentry plugin (conditional on `SENTRY_DSN`)
5. CORS
6. Helmet
7. Sensible
8. Cookie (`COOKIE_SECRET`)
9. WorkOS plugin → `fastify.workos`
10. DB plugin → `fastify.db`
11. `createCompositionRoot(fastify.db, fastify.workos)` → `fastify.decorate('root', root)`
12. Register route plugins (auth, identity, authoring, execution, billing, audit)
13. Health endpoint: `GET /health` → `{ status: 'ok', timestamp }`
14. Global error handler

## Fastify Type Augmentation

Every decorator must be declared:

```typescript
declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    root: CompositionRoot;
    db: Kysely<Database>;
    workos: WorkOS;
  }
  interface FastifyRequest {
    authUser?: AuthUser; // Set by authMiddleware (JWT claims)
    orgContext?: OrgContext; // Set by orgScopeMiddleware (slug-resolved)
  }
}

interface AuthUser {
  userId: string;
  email: string;
  displayName?: string;
}

interface OrgContext {
  orgId: string;
  orgSlug: string;
  orgName: string;
  userId: string;
  membershipId: string;
  role: 'owner' | 'admin' | 'member';
  email: string;
}
```

## Route Registration Pattern

Each route file exports an async function registered via `fastify.register()`:

```typescript
// apps/api/src/routes/identity.ts
export async function identityRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/users/me', { preHandler: [authMiddleware] }, async (request, reply) => {
    // handler body
  });
}

// apps/api/src/server.ts
await fastify.register(identityRoutes);
```

## Route Handler Rules

Route handlers are thin controllers that MUST:

- Read HTTP input (cookies, query params, body, headers)
- Validate input with Zod schemas
- Call use cases with deps from `request.server.root`
- Write HTTP output (cookies, redirects, JSON)
- Use `getSpan(request)` from `shared/lib/tracing.ts` to add custom span attributes (spans are auto-created by `@fastify/otel`)

Route handlers MUST NOT:

- Contain business logic
- Call repositories directly (use a use case instead)
- Define inline helper functions (extract to use cases or shared lib)
- Use manual `tracer.startActiveSpan` + `try/catch/finally/span.end()` tracing blocks
- Define cookie options inline (use `buildAuthCookieOptions()`)

## Route Handler Pattern

Standard structure: middleware → get span → validate → set attributes → call use-case → respond.

`@fastify/otel` auto-creates a span for each request. Use `getSpan(request)` to add custom attributes:

```typescript
import { getSpan } from '../shared/lib/tracing.js';

fastify.post('/api/orgs', { preHandler: [authMiddleware] }, async (request, reply) => {
  const span = getSpan(request);

  // 1. Validate input
  const parsed = CreateOrganisationRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    span.setAttribute('validation.passed', false);
    return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
  }

  // 2. Set span attributes
  span.setAttribute('user.workos_id', request.authUser!.userId);
  span.setAttribute('org.slug', parsed.data.slug);

  // 3. Resolve user + call use-case
  const user = await resolveUserFromJwt(
    { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
    { workosUserId: request.authUser!.userId },
  );
  const result = await createOrganisation(
    { organisationRepo: request.server.root.organisationRepo, membershipRepo: request.server.root.membershipRepo },
    { name: parsed.data.name, slug: parsed.data.slug, userId: user.id },
  );

  // 4. Respond — use case returns a shared DTO, pass through directly
  return reply.code(201).send(result);
});
```

## Middleware Application

Apply middleware via `preHandler` arrays on route options:

```typescript
// Org-scoped route (resolves slug, verifies membership):
fastify.get('/api/orgs/:orgSlug/members', { preHandler: [orgScopeMiddleware] }, handler);

// Org-scoped write to a run (add subscription + immutability checks):
fastify.patch(
  '/api/runs/:runId/specs/:specId',
  {
    preHandler: [orgScopeMiddleware, subscriptionGuard, immutabilityGuard],
  },
  handler,
);

// Non-org route (onboarding, user profile — no org context yet):
fastify.get('/api/users/me', { preHandler: [authMiddleware] }, handler);

// No auth (OAuth flow):
fastify.get('/auth/login', handler);
```

### Auth Middleware Internals (`authMiddleware`)

- Extracts `Authorization: Bearer <token>` header
- Verifies JWT with WorkOS JWKS (`jose.jwtVerify`)
- JWKS are cached in module-level variable after first fetch
- Extracts claims: `sub` (userId), `email`, `display_name`
- Decorates `request.authUser` with `{ userId, email, displayName }`
- Throws `AuthTokenMissingError`, `AuthTokenMalformedError`, `AuthTokenInvalidError`, or `AuthProviderUnavailableError`

### Org Scope Middleware Internals (`orgScopeMiddleware`)

- Calls `authMiddleware` to verify JWT
- Calls `resolveUserFromJwt` to map WorkOS user → internal user
- Calls `resolveOrgFromSlug` to resolve `:orgSlug` param → org and verify membership
- Decorates `request.orgContext` with `{ orgId, orgSlug, orgName, userId, membershipId, role, email }`
- Throws `AuthOrgNotFoundError` (404) or `AuthMembershipNotFoundError` (403) on failure

## Composition Root Access

All repositories, services, and adapters are available via `request.server.root`:

```typescript
const { organisationRepo, membershipRepo, userRepo } = request.server.root;
const org = await organisationRepo.findBySlug(slug);
```

## Use-Case Pattern

Use cases are pure async functions that accept `Deps` + `Command` interfaces and return shared DTOs (never entities):

```typescript
// packages/domains/identity/src/use-cases/create-organisation.ts
import type { OrganisationDto } from '@nohotfix/shared';

export interface CreateOrganisationDeps {
  organisationRepo: OrganisationRepository;
  membershipRepo: MembershipRepository;
}

export interface CreateOrganisationCommand {
  name: string;
  slug: string;
  userId: string;
}

export async function createOrganisation(deps: CreateOrganisationDeps, input: CreateOrganisationCommand): Promise<OrganisationDto> {
  // Validate via value objects
  OrganisationName.create(input.name);
  OrganisationSlug.create(input.slug);

  // Business rule: slug uniqueness
  if (await deps.organisationRepo.slugExists(input.slug)) {
    throw new AuthOrgSlugTakenError();
  }

  // Persist
  const org = await deps.organisationRepo.create({ name: input.name, slug: input.slug });
  await deps.membershipRepo.create({ orgId: org.id, userId: input.userId, role: 'owner' });

  // Return shared DTO — use case serializes entity fields (VOs → strings, dates → ISO strings)
  return { id: org.id, name: org.name.toString(), slug: org.slug.toString(), createdAt: org.createdAt.toISOString() };
}
```

## Repository Implementation Pattern (Kysely)

Repositories convert between DB rows (snake_case) and domain entities (value objects):

```typescript
// apps/api/src/adapters/repositories/kysely-user-repository.ts
export class KyselyUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByWorkosId(workosUserId: string): Promise<UserEntity | undefined> {
    const row = await this.db.selectFrom('users').selectAll().where('workos_user_id', '=', workosUserId).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async upsertByWorkosId(data: { workosUserId: string; email: string; displayName?: string }): Promise<UserEntity> {
    const row = await this.db
      .insertInto('users')
      .values({ workos_user_id: data.workosUserId, email: data.email, display_name: data.displayName ?? null })
      .onConflict((oc) =>
        oc.column('workos_user_id').doUpdateSet({
          email: data.email,
          display_name: data.displayName ?? null,
          updated_at: new Date().toISOString(),
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  private toEntity(row: UsersRow): UserEntity {
    return UserEntity.reconstitute({
      id: row.id,
      workosUserId: WorkosUserId.create(row.workos_user_id),
      email: Email.create(row.email),
      displayName: row.display_name ? DisplayName.create(row.display_name) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
```

### Kysely Query Patterns

```typescript
// SELECT one
db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()       // → T | undefined
db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirstOrThrow() // → T (throws)

// SELECT many
db.selectFrom('organisations').selectAll().where('id', 'in', ids).execute()       // → T[]

// SELECT specific columns
db.selectFrom('organisations').select('id').where('slug', '=', slug).executeTakeFirst()

// INSERT
db.insertInto('users').values({ ... }).returningAll().executeTakeFirstOrThrow()

// INSERT with upsert
db.insertInto('users').values({ ... })
  .onConflict((oc) => oc.column('workos_user_id').doUpdateSet({ ... }))
  .returningAll().executeTakeFirstOrThrow()

// UPDATE
db.updateTable('users').set({ display_name: name, updated_at: new Date().toISOString() })
  .where('id', '=', id).returningAll().executeTakeFirst()

// JOIN
db.selectFrom('organisations')
  .innerJoin('memberships', 'memberships.org_id', 'organisations.id')
  .where('memberships.user_id', '=', userId)
  .selectAll('organisations').execute()

// EXISTS check
const row = await db.selectFrom('organisations').select('id').where('slug', '=', slug).executeTakeFirst();
return !!row;
```

### Database Schema Types

```typescript
// packages/db/src/schema.ts
export interface UsersTable {
  id: Generated<string>; // Auto-generated UUID
  workos_user_id: string;
  email: string;
  display_name: string | null;
  created_at: ColumnType<Date, string | undefined, never>; // Select: Date, Insert: string?, Update: never
  updated_at: ColumnType<Date, string | undefined, string>; // Select: Date, Insert: string?, Update: string
}

export interface Database {
  users: UsersTable;
  organisations: OrganisationsTable;
  memberships: MembershipsTable;
  subscriptions: SubscriptionsTable;
  // ... 10 more tables
}
```

Key: Every tenant table has `org_id`. All queries MUST filter by `org_id` except cross-org user lookups.

## Error Handling

### Throwing Domain Errors

```typescript
// In use cases or services — throw domain errors with structured codes:
throw new AuthOrgSlugTakenError(); // 409
throw new ExecRunImmutableError(runId); // 403
throw new BillSubExpiredError(); // 403
throw new AuthProviderUnavailableError({ cause }); // 503
```

### Domain Error Structure

```typescript
// packages/shared/src/errors/domain-error.ts
export class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,    // e.g., 'AUTH_ORG_SLUG_TAKEN'
    message: string,
    public readonly statusCode: number, // HTTP status
    public readonly details?: Record<string, unknown>,
  ) { ... }
}

// packages/domains/identity/src/errors/index.ts
export class AuthOrgSlugTakenError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_ORG_SLUG_TAKEN, 'Organisation slug is already taken', 409);
  }
}
```

### Global Error Handler

DomainErrors are automatically caught and mapped to HTTP responses. Other errors return 500:

```typescript
fastify.setErrorHandler(async (error, _request, reply) => {
  if (error instanceof DomainError) {
    return reply.code(error.statusCode).send({
      error: error.code,
      message: error.message,
      details: error.details,
    });
  }
  fastify.log.error({ err: error }, 'Unhandled error');
  return reply.code(500).send({ error: 'SYS_INTERNAL', message: 'An internal server error occurred' });
});
```

## Input Validation

Always validate request input with Zod schemas from `@nohotfix/shared`:

```typescript
const parsed = CreateOrganisationRequestSchema.safeParse(request.body);
if (!parsed.success) {
  return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
}
const { name, slug } = parsed.data;
```

For query params:

```typescript
const slug = (request.query as { slug?: string }).slug;
const parsed = OrganisationSlugSchema.safeParse(slug);
if (!parsed.success) {
  return reply.code(400).send({ error: 'Invalid slug format' });
}
```

## Cookie Handling (Auth Routes)

Use shared constants and helper from `apps/api/src/shared/lib/auth-cookies.ts`:

```typescript
import { buildAuthCookieOptions, REFRESH_COOKIE_NAME, SID_COOKIE_NAME } from '../shared/lib/auth-cookies.js';

// Setting cookies
const cookieOpts = buildAuthCookieOptions(config.NODE_ENV === 'production');
reply.setCookie(REFRESH_COOKIE_NAME, refreshToken, cookieOpts);
reply.setCookie(SID_COOKIE_NAME, sessionId, cookieOpts);

// Reading signed cookies
const signed = request.cookies[REFRESH_COOKIE_NAME];
const unsigned = request.unsignCookie(signed!);
if (!unsigned.valid || !unsigned.value) {
  throw new AuthSessionExpiredError();
}
const refreshToken = unsigned.value;

// Clearing cookies
reply.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
reply.clearCookie(SID_COOKIE_NAME, { path: '/auth' });
```

## OTel Tracing Pattern

`@fastify/otel` auto-instruments all route handlers and lifecycle hooks. Spans are named `{METHOD} {route}` (e.g., `POST /api/orgs`, `GET /api/users/me`) via the `requestHook` in `otel.ts`.

To add custom business attributes, use `getSpan(request)` from `apps/api/src/shared/lib/tracing.ts`:

```typescript
import { getSpan } from '../shared/lib/tracing.js';

const span = getSpan(request);
span.setAttribute('user.workos_id', workosId);
span.setAttribute('org.slug', slug);
// ... call use-case ...
return reply.code(201).send(result);
```

`getSpan()` returns a no-op span when OTel is disabled, so callers never need null checks.

Do NOT use manual `tracer.startActiveSpan`, or `try/catch/finally/span.end()` in route handlers — `@fastify/otel` handles span lifecycle automatically.

## Plugin Development Pattern

Use `fastify-plugin` for plugins that should share the same encapsulation context:

```typescript
import fp from 'fastify-plugin';

async function myPlugin(fastify: FastifyInstance): Promise<void> {
  const client = new MyClient(fastify.config.MY_API_KEY);
  fastify.decorate('myClient', client);
  fastify.addHook('onClose', async () => {
    await client.destroy();
  });
  fastify.log.info('MyClient initialized');
}

export default fp(myPlugin, { name: 'my-plugin' });
```

## Resolve Internal User

Use the `resolveUserFromJwt` use case from `@nohotfix/domain-identity` to resolve a WorkOS user ID to an internal user record:

```typescript
import { resolveUserFromJwt } from '@nohotfix/domain-identity';

const user = await resolveUserFromJwt(
  { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
  { workosUserId: request.authUser!.userId },
);
```

This handles DB lookup and first-encounter fetch + upsert from WorkOS.

## Response Patterns

- **Created**: `reply.code(201).send(result)` (use case returns the DTO directly)
- **Success**: `reply.code(200).send(result)` (use case returns the DTO directly)
- **Boolean check**: `reply.code(200).send({ available: boolean })`
- **Redirect**: `reply.redirect(url)`
- **Validation error**: `reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() })`
- Dates are always serialized as ISO strings in responses

## Config (Environment Variables)

Required: `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`, `APP_URL`, `COOKIE_SECRET` (min 32 chars).
Optional: `DATABASE_URL`, `SENTRY_DSN`, `OTEL_EXPORTER_OTLP_ENDPOINT`.
Defaults: `NODE_ENV=development`, `PORT=3001`.

## Import Conventions

- Use `.js` extensions in relative imports (ESM)
- Domain packages import only from `@nohotfix/shared`
- Route handlers access repos/services via `request.server.root`
- Schemas come from `@nohotfix/shared`
- DB types come from `@nohotfix/db`
- Domain entities/errors come from `@nohotfix/domain-{context}`
