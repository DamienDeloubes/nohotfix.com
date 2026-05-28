# Backend Architecture -- NoHotfix v1

_Extracted from [docs/development/technical-architecture.md](./technical-architecture.md). See also: [Domain Architecture](./domain-architecture.md) for bounded context internals, [Database Design](./database-diagram.md) for schema details, [Coding Architecture](./coding-architecture.md) for conventions._

---

## Overview

The backend is a **Fastify 5** application deployed to DigitalOcean App Platform. After the domain package extraction (ADR-010), the API is a **thin adapter layer** -- it wires domain use cases to HTTP routes and injects infrastructure implementations of repository ports.

**Key principle**: The API layer (`apps/api`) contains zero business logic. All business rules, state machines, validation, and orchestration live in the domain packages (`packages/domains/*`). The API is responsible only for:

1. HTTP request parsing and validation (Zod schemas)
2. Authentication and authorization (WorkOS JWT, RBAC)
3. Dependency injection (composition root wiring domain ports to Kysely adapters)
4. Error-to-HTTP mapping (DomainError -> HTTP status code)
5. Cross-domain orchestration (coordinating multiple domain use cases in a single request)

### Directory Structure

```
apps/api/
|-- package.json
|-- tsconfig.json
|-- Dockerfile
|-- vitest.config.ts
|-- src/
    |-- server.ts                     # Fastify server entry point, plugin registration
    |-- config.ts                     # Environment validation with Zod
    |-- composition-root.ts           # Dependency wiring (domain services + Kysely adapters)
    |-- adapters/                     # Infrastructure implementations of domain ports
    |   |-- repositories/             # Kysely implementations of repository interfaces
    |   |   |-- identity.ts           # KyselyOrganisationRepo, KyselyUserRepo, etc.
    |   |   |-- billing.ts
    |   |   |-- authoring.ts
    |   |   |-- execution.ts
    |   |   |-- audit.ts
    |   |   |-- index.ts              # Barrel export for all repositories
    |   |-- services/                 # Infrastructure service implementations
    |       |-- presigned-url-adapter.ts   # DO Spaces implementation of StoragePort
    |       |-- index.ts
    |-- routes/                       # Fastify route handlers (thin controllers)
    |   |-- identity.ts
    |   |-- billing.ts
    |   |-- authoring.ts
    |   |-- execution.ts
    |   |-- audit.ts
    |   |-- index.ts                  # Barrel export for all routes
    |-- shared/
        |-- plugins/                  # Fastify plugins (DB, OTel, Sentry)
        |   |-- db.ts
        |   |-- otel.ts              # @fastify/otel + NodeSDK init
        |   |-- sentry.ts
        |-- middleware/               # Auth, immutability guard, subscription guard
        |   |-- auth.ts
        |   |-- immutability-guard.ts
        |   |-- subscription-guard.ts
        |-- lib/                      # API-specific utilities
        |   |-- pagination.ts
        |   |-- presigned-urls.ts
        |-- errors/                   # API-layer error utilities
            |-- sys-errors.ts
            |-- index.ts
```

---

## Fastify Server Structure

The server is assembled in `apps/api/src/server.ts` through a plugin-based architecture:

```typescript
// apps/api/src/server.ts (actual code)
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { DomainError } from '@nohotfix/shared';
import Fastify from 'fastify';

import { createCompositionRoot } from './composition-root.js';
import { parseConfig } from './config.js';

async function buildServer() {
  const config = parseConfig();

  const fastify = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Decorate config early so all plugins can access it
  fastify.decorate('config', config);

  // Infrastructure plugins (order matters)
  await fastify.register(otelPlugin);
  await fastify.register(sentryPlugin);
  await fastify.register(cors, {
    origin: ['https://nohotfix.com', 'https://app.nohotfix.com', ...(config.NODE_ENV !== 'production' ? ['http://localhost:5173', 'http://localhost:3000'] : [])],
    credentials: true,
  });
  await fastify.register(helmet);
  await fastify.register(sensible);
  await fastify.register(dbPlugin);

  // Composition root -- wire domain services with infrastructure adapters
  const root = createCompositionRoot(fastify.db);
  fastify.decorate('root', root);

  // Domain routes
  await fastify.register(identityRoutes);
  await fastify.register(billingRoutes);
  await fastify.register(authoringRoutes);
  await fastify.register(executionRoutes);
  await fastify.register(auditRoutes);

  // Health check
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Global error handler
  fastify.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }
    fastify.log.error({ err: error }, 'Unhandled error');
    return reply.code(500).send({
      error: 'SYS_INTERNAL',
      message: 'An internal server error occurred',
    });
  });

  return fastify;
}
```

### Type Augmentation

The Fastify instance is augmented with typed decorators:

```typescript
// apps/api/src/server.ts
declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    root: CompositionRoot;
  }
  interface FastifyRequest {
    user: {
      userId: string;
      orgId: string;
      role: 'admin' | 'member';
      email: string;
      displayName?: string;
    };
  }
}
```

---

## Plugin Registration Order

Plugins are registered in a specific order to ensure correct lifecycle dependencies:

```
1. Infrastructure plugins (registered first):
   |-- config plugin           # Validates env vars via Zod, decorates fastify with config
   |-- otel plugin             # @fastify/otel instrumentation + NodeSDK init
   |-- sentry plugin           # Sentry error handler, enriches with trace context
   |-- cors plugin             # @fastify/cors with allowed origins
   |-- helmet plugin           # @fastify/helmet security headers
   |-- sensible plugin         # @fastify/sensible (httpErrors, etc.)
   |-- database plugin         # Creates Kysely instance, decorates fastify with db

2. Composition root setup:
   |-- domain wiring           # Creates use case instances with adapter injections

3. Route plugins (thin controllers, one per bounded context):
   |-- identity routes         # /api/orgs/*, /api/users/*
   |-- billing routes          # /api/billing/*, /api/webhooks/stripe
   |-- authoring routes        # /api/playbooks/*, /api/specs/*, /api/sections/*
   |-- execution routes        # /api/runs/*, /api/run-specs/*, /api/artifacts/*
   |-- audit routes            # /api/history/*, /api/changelog/*

4. Global hooks:
   |-- onRequest: auth check (all routes except /api/webhooks/*)
   |-- onRequest: org context injection (sets org_id from JWT)
   |-- onResponse: request logging with trace context
   |-- onError: structured error serialization + Sentry capture
```

### Lifecycle Hooks

| Hook         | Purpose                                                         |
| ------------ | --------------------------------------------------------------- |
| `onRequest`  | JWT validation, subscription enforcement, request context setup |
| `preHandler` | Route-specific authorization (role checks, immutability guard)  |
| `onError`    | Error serialization to structured JSON, Sentry event capture    |
| `onResponse` | Request duration logging, metrics recording                     |

### Graceful Shutdown

```typescript
const gracefulShutdown = async (signal: string) => {
  server.log.info({ signal }, 'Received shutdown signal');
  await server.close();
  process.exit(0);
};

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
```

---

## Composition Root

The composition root (`apps/api/src/composition-root.ts`) is the single place where domain services are wired with infrastructure adapters. It creates all repository implementations and domain service instances:

```typescript
// apps/api/src/composition-root.ts (actual code, abbreviated)
export function createCompositionRoot(db: Kysely<Database>): CompositionRoot {
  // Repositories (Kysely adapters implementing domain port interfaces)
  const organisationRepo = new KyselyOrganisationRepository(db);
  const userRepo = new KyselyUserRepository(db);
  const membershipRepo = new KyselyMembershipRepository(db);
  const subscriptionRepo = new KyselySubscriptionRepository(db);
  const stripeWebhookEventRepo = new KyselyStripeWebhookEventRepository(db);
  const playbookRepo = new KyselyPlaybookRepository(db);
  const playbookSectionRepo = new KyselyPlaybookSectionRepository(db);
  const playbookSpecRepo = new KyselyPlaybookSpecRepository(db);
  const specLibraryRepo = new KyselySpecLibraryRepository(db);
  const runRepo = new KyselyRunRepository(db);
  const runSectionRepo = new KyselyRunSectionRepository(db);
  const runSpecRepo = new KyselyRunSpecRepository(db);
  const runSpecArtifactRepo = new KyselyRunSpecArtifactRepository(db);
  const changelogRepo = new KyselyChangelogRepository(db);

  // Infrastructure adapters
  const presignedUrlAdapter = new PresignedUrlAdapter();

  // Domain services (pure domain logic, injected with repositories)
  const membershipService = new MembershipService(membershipRepo);
  const runStateMachine = new RunStateMachine();
  const specStateMachine = new SpecStateMachine();
  const snapshotService = new SnapshotService();
  // ... all other services

  return {
    organisationRepo,
    userRepo,
    membershipRepo /* ... */,
    membershipService,
    runStateMachine,
    specStateMachine /* ... */,
    presignedUrlAdapter,
  };
}
```

The composition root is created once at server startup and decorated onto the Fastify instance as `fastify.root`. Route handlers access it via `request.server.root`.

### CompositionRoot Interface

```typescript
export interface CompositionRoot {
  // 14 Repositories
  organisationRepo: KyselyOrganisationRepository;
  userRepo: KyselyUserRepository;
  membershipRepo: KyselyMembershipRepository;
  subscriptionRepo: KyselySubscriptionRepository;
  stripeWebhookEventRepo: KyselyStripeWebhookEventRepository;
  playbookRepo: KyselyPlaybookRepository;
  playbookSectionRepo: KyselyPlaybookSectionRepository;
  playbookSpecRepo: KyselyPlaybookSpecRepository;
  specLibraryRepo: KyselySpecLibraryRepository;
  runRepo: KyselyRunRepository;
  runSectionRepo: KyselyRunSectionRepository;
  runSpecRepo: KyselyRunSpecRepository;
  runSpecArtifactRepo: KyselyRunSpecArtifactRepository;
  changelogRepo: KyselyChangelogRepository;

  // Domain services
  membershipService: MembershipService;
  onboardingService: OnboardingService;
  subscriptionStateService: SubscriptionStateService;
  trialService: TrialService;
  specSyncService: SpecSyncService;
  snapshotService: SnapshotService;
  runStateMachine: RunStateMachine;
  specStateMachine: SpecStateMachine;
  artifactGateService: ArtifactGateService;
  decisionService: DecisionService;
  sectionSkipService: SectionSkipService;
  changelogService: ChangelogService;

  // Infrastructure adapters
  presignedUrlAdapter: PresignedUrlAdapter;
}
```

---

## Middleware

### Auth Middleware (`apps/api/src/shared/middleware/auth.ts`)

Applied to all routes except `/api/webhooks/*`. Validates JWT and populates `request.authUser`:

```typescript
export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthTokenMissingError();
  }

  const token = authHeader.slice(7);
  // Validate JWT with WorkOS JWKS endpoint (cached, refreshed on key rotation)
  // Extract sub (user ID), email from JWT claims
  // Decorate request.authUser with { userId, email, displayName }
}
```

**Auth flow steps:**

1. Extract `Authorization: Bearer <token>` from request header
2. Fetch WorkOS JWKS (cached, refreshed on key rotation)
3. Validate JWT signature, expiry, and issuer
4. Extract `sub` (user ID), `email`, `display_name` from JWT claims
5. Decorate `request.authUser` with `{ userId, email, displayName }`

### Org Scope Middleware (`apps/api/src/shared/middleware/org-scope.ts`)

Applied to all org-scoped routes (`:orgSlug` in URL). Chains auth verification, user resolution, slug-to-org resolution, and membership verification:

1. Calls `authMiddleware` to verify JWT and set `request.authUser`
2. Calls `resolveUserFromJwt` to map WorkOS user ID → internal user (upserts on first encounter)
3. Calls `resolveOrgFromSlug` to resolve the slug → org and verify the user is a member
4. Decorates `request.orgContext` with `{ orgId, orgSlug, orgName, userId, membershipId, role, email }`
5. All downstream queries use `request.orgContext.orgId` for tenant scoping

### RBAC Strategy

Two roles only: `admin` and `member`. Role is stored in WorkOS and reflected in the JWT. Route-level role checks are applied via a `requireRole('admin')` preHandler hook. Admin is a superset of Member.

| Action                          | Admin | Member |
| ------------------------------- | ----- | ------ |
| Create/edit playbooks           | Yes   | No     |
| Manage spec library             | Yes   | No     |
| Start a run                     | Yes   | Yes    |
| Execute specs (pass/fail/skip)  | Yes   | Yes    |
| Make go/no-go decision          | Yes   | No     |
| Abandon a run                   | Yes   | No     |
| Manage org settings and members | Yes   | No     |
| Access billing                  | Yes   | No     |

### Immutability Guard (`apps/api/src/shared/middleware/immutability-guard.ts`)

A preHandler hook applied to all write routes under `/api/runs/*`. Rejects writes to completed runs:

```typescript
export async function immutabilityGuard(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const { runId } = request.params as { runId?: string };
  if (!runId) return;

  const db = request.server.db;
  const run = await db.selectFrom('runs').select(['status']).where('id', '=', runId).where('org_id', '=', request.orgContext!.orgId).executeTakeFirst();

  if (run && TERMINAL_RUN_STATUSES.has(run.status)) {
    throw new ExecRunImmutableError(runId);
  }
}
```

This is layer 1 of the **3-layer immutability enforcement**:

1. **Middleware**: Immutability guard rejects the request before it reaches the handler
2. **Service**: Domain services independently verify run state before mutations (in domain packages)
3. **Database trigger** (planned): A PostgreSQL trigger on `run_specs`, `run_spec_artifacts` that prevents UPDATE/INSERT when the parent run is terminal

### Subscription Guard (`apps/api/src/shared/middleware/subscription-guard.ts`)

A preHandler hook on all routes except `/api/webhooks/*`, `/api/billing/*`, and `/api/users/me`. Fetches the org's subscription state and rejects with `BILL_SUB_EXPIRED` (403) if the org is in `past_due` or `expired` state.

### Input Validation

All API input is validated using Zod schemas from `packages/shared`. Fastify's schema validation hook uses Zod-to-JSON-Schema for OpenAPI compatibility. Request body, query params, and path params each have a dedicated schema.

---

## Route Handlers

Route handlers are **thin controllers** -- one file per bounded context. Route files contain NO business logic -- only HTTP plumbing. Each handler:

1. Parses and validates input (Zod schemas from `@nohotfix/shared`)
2. Calls domain use case functions with deps from the composition root
3. Serializes and returns the response
4. Uses `getSpan(request)` from `shared/lib/tracing.ts` to add custom attributes to the auto-instrumented span (provided by `@fastify/otel`)
5. Uses shared cookie helpers from `shared/lib/auth-cookies.ts` (no inline cookie option literals)

### Identity Routes (`apps/api/src/routes/identity.ts`)

| Method   | Path                                        | Purpose                              | Role  |
| -------- | ------------------------------------------- | ------------------------------------ | ----- |
| `GET`    | `/api/orgs/:orgSlug`                        | Get org details                      | Any   |
| `PATCH`  | `/api/orgs/:orgSlug`                        | Rename org                           | Admin |
| `GET`    | `/api/orgs/:orgSlug/members`                | List members and pending invitations | Any   |
| `POST`   | `/api/orgs/:orgSlug/members/invite`         | Send invitation                      | Admin |
| `PATCH`  | `/api/orgs/:orgSlug/members/:memberId/role` | Change role                          | Admin |
| `DELETE` | `/api/orgs/:orgSlug/members/:memberId`      | Remove member                        | Admin |
| `GET`    | `/api/users/me`                             | Current user profile                 | Any   |
| `PATCH`  | `/api/users/me`                             | Update display name                  | Any   |

### Billing Routes (`apps/api/src/routes/billing.ts`)

| Method | Path                        | Purpose                        | Role                                 |
| ------ | --------------------------- | ------------------------------ | ------------------------------------ |
| `POST` | `/api/billing/checkout`     | Create Stripe Checkout session | Admin                                |
| `POST` | `/api/billing/portal`       | Create Stripe Portal session   | Admin                                |
| `GET`  | `/api/billing/subscription` | Current subscription status    | Admin                                |
| `POST` | `/api/webhooks/stripe`      | Stripe webhook receiver        | Unauthenticated (signature-verified) |

### Authoring Routes (`apps/api/src/routes/authoring.ts`)

| Method             | Path                                                                  | Purpose                            | Role        |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------- | ----------- |
| `GET/POST`         | `/api/playbooks`                                                      | List / create playbooks            | Any / Admin |
| `GET/PATCH/DELETE` | `/api/playbooks/:id`                                                  | Get / update / archive playbook    | Any / Admin |
| `POST`             | `/api/playbooks/:id/duplicate`                                        | Duplicate playbook                 | Admin       |
| `POST`             | `/api/playbooks/:id/sections`                                         | Add section                        | Admin       |
| `PATCH/DELETE`     | `/api/playbooks/:playbookId/sections/:sectionId`                      | Update / delete section            | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/reorder`                         | Reorder sections                   | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/:sectionId/specs`                | Add spec to section                | Admin       |
| `DELETE`           | `/api/playbooks/:playbookId/sections/:sectionId/specs/:specId`        | Remove spec                        | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/:sectionId/specs/reorder`        | Reorder specs                      | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/:sectionId/specs/bulk`           | Bulk insert                        | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/copy-from`                       | Copy section from another playbook | Admin       |
| `GET/POST`         | `/api/specs`                                                          | List / create library specs        | Any / Admin |
| `GET/PATCH`        | `/api/specs/:id`                                                      | Get / update library spec          | Any / Admin |
| `POST`             | `/api/specs/:id/sync`                                                 | Sync to library from chapter edit  | Admin       |
| `POST`             | `/api/playbooks/:playbookId/sections/:sectionId/specs/:specId/detach` | Detach from library ("Keep local") | Admin       |

### Execution Routes (`apps/api/src/routes/execution.ts`)

| Method   | Path                                                         | Purpose                                  | Role  |
| -------- | ------------------------------------------------------------ | ---------------------------------------- | ----- |
| `POST`   | `/api/runs`                                                  | Start a new run                          | Any   |
| `GET`    | `/api/runs`                                                  | List active runs                         | Any   |
| `GET`    | `/api/runs/:id`                                              | Run overview (sections, specs, progress) | Any   |
| `POST`   | `/api/runs/:id/decision`                                     | Record go/no-go/abandon                  | Admin |
| `POST`   | `/api/runs/:runId/sections/:sectionId/skip`                  | Skip section                             | Any   |
| `PATCH`  | `/api/runs/:runId/specs/:specId/open`                        | Mark spec as in-progress                 | Any   |
| `POST`   | `/api/runs/:runId/specs/:specId/claim`                       | Claim spec                               | Any   |
| `DELETE` | `/api/runs/:runId/specs/:specId/claim`                       | Unclaim spec                             | Any   |
| `POST`   | `/api/runs/:runId/specs/:specId/result`                      | Record pass/fail/skip                    | Any   |
| `POST`   | `/api/runs/:runId/specs/:specId/artifacts/presign`           | Get presigned upload URL                 | Any   |
| `POST`   | `/api/runs/:runId/specs/:specId/artifacts`                   | Record artifact metadata                 | Any   |
| `PUT`    | `/api/runs/:runId/specs/:specId/artifacts/:artifactId/table` | Save table data                          | Any   |
| `PUT`    | `/api/runs/:runId/specs/:specId/artifacts/:artifactId/value` | Save measured value                      | Any   |
| `PUT`    | `/api/runs/:runId/specs/:specId/artifacts/:artifactId/url`   | Save URL value                           | Any   |

### Audit Routes (`apps/api/src/routes/audit.ts`)

| Method | Path                           | Purpose                                 | Role |
| ------ | ------------------------------ | --------------------------------------- | ---- |
| `GET`  | `/api/history`                 | Paginated run history list with filters | Any  |
| `GET`  | `/api/history/:runId`          | Full read-only run detail               | Any  |
| `GET`  | `/api/playbooks/:id/changelog` | Playbook change history                 | Any  |
| `GET`  | `/api/specs/:id/changelog`     | Spec change history                     | Any  |

---

## Error Handling

### Error-to-HTTP Mapping

The API's global error handler maps `DomainError` subclasses to HTTP responses. This mapping is the **ONLY place** that assigns HTTP status codes -- domain packages know nothing about HTTP:

```typescript
// apps/api/src/lib/error-handler.ts
const HTTP_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.AUTH_SESSION_EXPIRED]: 401,
  [ErrorCode.AUTH_ROLE_INSUFFICIENT]: 403,
  [ErrorCode.AUTH_LAST_ADMIN]: 409,
  [ErrorCode.BILL_SUB_EXPIRED]: 403,
  [ErrorCode.BILL_WEBHOOK_INVALID]: 422,
  [ErrorCode.BILL_WEBHOOK_DUPLICATE]: 409,
  [ErrorCode.AUTHOR_PLAYBOOK_NOT_FOUND]: 404,
  [ErrorCode.AUTHOR_SPEC_ARCHIVED]: 409,
  [ErrorCode.AUTHOR_SYNC_CONFLICT]: 409,
  [ErrorCode.EXEC_RUN_IMMUTABLE]: 403,
  [ErrorCode.EXEC_RUN_INVALID_TRANSITION]: 409,
  [ErrorCode.EXEC_SPEC_ARTIFACTS_INCOMPLETE]: 400,
  [ErrorCode.EXEC_DECISION_JUSTIFICATION_REQUIRED]: 400,
  [ErrorCode.SYS_INTERNAL]: 500,
  [ErrorCode.SYS_DATABASE]: 500,
};
```

### Error Response Format

All error responses follow a consistent JSON structure:

```json
{
  "error": "EXEC_RUN_IMMUTABLE",
  "message": "Run run_01DEF is in a terminal state and cannot be modified",
  "details": { "runId": "run_01DEF" }
}
```

### Sentry Integration

- `DomainError` instances with `statusCode >= 500` are sent to Sentry
- `DomainError.code` is used as the Sentry fingerprint for deterministic grouping
- Sentry events include the OTel `traceId` as a tag for cross-reference with distributed traces
- Sentry performance monitoring is disabled -- OTel handles traces and metrics

See [Logging and OpenTelemetry](#logging-and-opentelemetry) for full observability details.

---

## Background Jobs and Event Handling

v1 uses **synchronous, in-process event handling**. No external job queue. Domain events are emitted by use cases and handled by an in-memory EventEmitter in `apps/api`:

| Event                           | Handler                       |
| ------------------------------- | ----------------------------- |
| `RunAdvancedToAwaitingDecision` | Triggers email to all admins  |
| `DecisionRecorded`              | Triggers email to all members |
| `RunAbandoned`                  | Triggers email to all members |
| `OrganisationCreated`           | Triggers demo playbook seed   |
| `InvoicePaymentFailed`          | Triggers email to admin       |

_Rationale_: A job queue (e.g., BullMQ + Redis) adds infrastructure complexity not justified for 4 email triggers. If email delivery becomes unreliable, Resend's built-in retry handles transient failures. A queue will be introduced in v2 if event volume or reliability requirements grow.

### Event Wiring Example

```typescript
// apps/api/src/event-bus.ts
eventBus.on('execution.decision_recorded', async (event) => {
  // Call audit domain use case to record changelog
  await auditUseCases.recordRunDecision(event.payload);
  // Call email service to notify members
  await emailService.sendDecisionNotification(event.payload);
});
```

---

## API Versioning

v1 does not use URL-based API versioning (no `/v1/` prefix). The API is **internal** to the NoHotfix frontend applications -- there is no public API.

When a public API is introduced (v2+), versioning will be added as a URL prefix (`/api/v1/`, `/api/v2/`). Breaking changes before public API are managed via frontend/backend co-deployment.

_Rationale_: Versioning adds overhead with no consumer to protect in v1. The frontend and backend are deployed together and share types via `packages/shared`.

---

## Logging and OpenTelemetry

### OTel SDK Setup

The OpenTelemetry SDK is initialized in `apps/api/src/shared/plugins/otel.ts` using `@fastify/otel`. The plugin is registered before all other plugins and routes to ensure full request coverage. If `OTEL_EXPORTER_OTLP_ENDPOINT` is not set, OTel is skipped entirely:

```typescript
import FastifyOtelInstrumentation from '@fastify/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

const fastifyInstrumentation = new FastifyOtelInstrumentation({
  requestHook(span, request) {
    const route = request.routeOptions?.url ?? request.url;
    span.updateName(`${request.method} ${route}`);
  },
});

const sdk = new NodeSDK({
  serviceName: 'nohotfix-api',
  traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
  instrumentations: [fastifyInstrumentation],
});

sdk.start();
await fastify.register(fastifyInstrumentation.plugin());
```

### Instrumentation Targets

| Target                | Instrumentation                                        | What is Captured                                                                     |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Fastify routes**    | `@fastify/otel` (auto)                                 | Route name (`METHOD /path`), handler duration, lifecycle hooks                       |
| **Lifecycle hooks**   | `@fastify/otel` (auto)                                 | preHandler, onSend, onResponse — each hook gets its own child span                   |
| **Custom attributes** | `getSpan(request)` from `shared/lib/tracing.ts`        | Business context: `org.id`, `user.id`, `validation.passed`, etc.                     |
| **Custom spans**      | Manual instrumentation via `@opentelemetry/api` tracer | `SnapshotService.deepCopy`, `ArtifactGateService.evaluate`, `DecisionService.record` |

### Adding Custom Attributes to Spans

Route handlers and middleware access the auto-created span via `getSpan(request)` from `shared/lib/tracing.ts`. This helper handles the case where OTel is disabled (returns a no-op span):

```typescript
import { getSpan } from '../shared/lib/tracing.js';

fastify.get('/api/orgs/:orgSlug', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
  const span = getSpan(request);
  span.setAttribute('org.slug', request.orgContext!.orgSlug);
  span.setAttribute('user.id', request.orgContext!.userId);

  const org = await request.server.root.organisationRepo.findById(request.orgContext!.orgId);
  return reply.send(org);
});
```

### Trace Context Propagation

- Incoming HTTP requests: W3C Trace Context headers (`traceparent`, `tracestate`) are extracted automatically by `@fastify/otel`
- Logs: Every structured log entry includes `traceId` and `spanId` from the active span context
- Sentry events: Enriched with `traceId` for correlation

### Structured Log Format

All logs are emitted as structured JSON via Pino (Fastify's default logger):

```json
{
  "level": "info",
  "time": "2026-03-03T10:15:30.000Z",
  "msg": "Run decision recorded",
  "traceId": "abc123def456",
  "spanId": "789ghi012",
  "userId": "user_01ABC",
  "orgId": "org_01XYZ",
  "runId": "run_01DEF",
  "decision": "go",
  "service": "nohotfix-api",
  "environment": "production"
}
```

Log fields are injected via a Pino serializer that reads from the OTel active span and the Fastify request context.

### Metrics -- Key SLIs/SLOs

| SLI                       | Metric Name                        | Type                         | Target SLO                     |
| ------------------------- | ---------------------------------- | ---------------------------- | ------------------------------ |
| API availability          | `http.server.request.count`        | Counter                      | 99.9% non-5xx responses        |
| API latency (p95)         | `http.server.request.duration`     | Histogram                    | < 500ms reads, < 1000ms writes |
| Run snapshot duration     | `nohotfix.snapshot.duration`       | Histogram                    | < 2000ms (p99)                 |
| Artifact upload presign   | `nohotfix.presign.duration`        | Histogram                    | < 200ms (p99)                  |
| Stripe webhook processing | `nohotfix.webhook.stripe.duration` | Histogram                    | < 5000ms                       |
| DB query latency (p95)    | `db.client.operation.duration`     | Histogram                    | < 100ms                        |
| Active runs per org       | `nohotfix.runs.active`             | Gauge                        | Informational                  |
| Decision rate             | `nohotfix.decisions.count`         | Counter (go/no_go/abandoned) | Informational                  |

### Exporter Configuration

```bash
# Environment variables
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318   # Local: OTel Collector
OTEL_SERVICE_NAME=nohotfix-api
OTEL_RESOURCE_ATTRIBUTES=deployment.environment=production,service.version=1.0.0
```

| Environment   | Exporter Target                                                |
| ------------- | -------------------------------------------------------------- |
| `development` | Local OTel Collector -> Jaeger (traces) + Prometheus (metrics) |
| `staging`     | Hosted backend (separate environment label)                    |
| `production`  | Hosted observability backend                                   |

### Sentry Configuration

```typescript
// apps/api/src/shared/plugins/sentry.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0, // Disabled -- OTel handles tracing
  beforeSend(event) {
    const span = trace.getActiveSpan();
    if (span) {
      event.tags = { ...event.tags, traceId: span.spanContext().traceId };
    }
    return event;
  },
});
```

### Local Development Observability

`docker-compose.yml` includes:

| Service        | Image                                  | Port      | UI                       |
| -------------- | -------------------------------------- | --------- | ------------------------ |
| PostgreSQL     | `postgres:16`                          | 5432      | --                       |
| OTel Collector | `otel/opentelemetry-collector-contrib` | 4317/4318 | --                       |
| Jaeger         | `jaegertracing/all-in-one`             | 16686     | `http://localhost:16686` |

---

## System Components and Communication

| Pattern               | From          | To             | Protocol              | Purpose                             |
| --------------------- | ------------- | -------------- | --------------------- | ----------------------------------- |
| REST API calls        | Browser (SPA) | Fastify API    | HTTPS / JSON          | All authenticated application data  |
| Presigned PUT uploads | Browser (SPA) | DO Spaces      | HTTPS (S3 protocol)   | Direct file upload, bypassing API   |
| JWT validation        | Fastify API   | WorkOS         | HTTPS (JWKS endpoint) | Token verification on every request |
| Stripe webhooks       | Stripe        | Fastify API    | HTTPS (POST)          | Subscription lifecycle events       |
| Transactional email   | Fastify API   | Resend         | HTTPS                 | Email notifications (4 triggers)    |
| WorkOS API calls      | Fastify API   | WorkOS         | HTTPS                 | Org management, invitation send     |
| Auth callback         | WorkOS        | Next.js app    | HTTPS (redirect)      | OAuth callback after authentication |
| OTLP export           | Fastify API   | OTel Collector | gRPC / HTTP           | Traces, metrics, logs               |

### Hosting

| Component         | Target                                               |
| ----------------- | ---------------------------------------------------- |
| Fastify API       | DigitalOcean App Platform                            |
| PostgreSQL        | DigitalOcean Managed PostgreSQL (EU: Frankfurt FRA1) |
| DO Spaces         | DigitalOcean Spaces (EU)                             |
| Next.js (landing) | Vercel (`nohotfix.com`)                              |
| React SPA (app)   | Vercel (`app.nohotfix.com`)                          |
