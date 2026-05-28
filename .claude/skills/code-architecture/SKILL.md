# Code Architecture — NoHotfix

TRIGGER: When making structural decisions, adding new bounded contexts, defining entities/value objects, deciding where code should live, or reviewing dependency rules.

## Architectural Pattern

Hexagonal Architecture (Ports & Adapters) inside a modular monolith. Domain logic has ZERO knowledge of HTTP, Fastify, databases, or infrastructure. Infrastructure implements domain-defined port interfaces.

## 5 DDD Bounded Contexts

Each context is an independent package under `packages/domains/`:

| Context       | Package            | Owns                                             |
| ------------- | ------------------ | ------------------------------------------------ |
| **Identity**  | `domain-identity`  | Users, organisations, memberships, roles         |
| **Billing**   | `domain-billing`   | Subscriptions, Stripe webhooks, trial management |
| **Authoring** | `domain-authoring` | Playbooks, specs, spec library, snapshot/sync    |
| **Execution** | `domain-execution` | Runs, state machines, artifact management        |
| **Audit**     | `domain-audit`     | Changelog tracking                               |

Each domain package exports:

- **Entities** — Aggregate roots with business logic (private constructor, `.create()` + `.reconstitute()`)
- **Value Objects** — Immutable types with static `.create()` validation (e.g., `Email`, `Role`, `OrganisationSlug`)
- **Domain Services** — Stateless logic (e.g., `RunStateMachine`, `SnapshotService`, `ArtifactGateService`)
- **Ports** — Repository + adapter interfaces (TypeScript interfaces only, no implementation)
- **Domain Errors** — Extend shared `DomainError` with structured error codes
- **Domain Events** — Event types for cross-domain coordination

## Dependency Rules (enforced by ESLint)

```
domains/* → @nohotfix/shared ONLY (domain logic); peer-dep on @nohotfix/api-client (UI hooks)
apps/api  → domain logic packages (NOT /ui)
apps/app  → domain logic + UI packages + @nohotfix/api-client
```

Domains NEVER depend on each other — cross-domain communication uses events or API-layer orchestration.

## Entity Pattern

```typescript
class OrganisationEntity {
  private constructor(private readonly props: OrganisationProps) {}

  static create(params: CreateParams): OrganisationEntity {
    // validate via value objects, return new instance
  }

  static reconstitute(props: OrganisationProps): OrganisationEntity {
    // from DB, no validation — accepts already-constructed VOs
  }

  rename(newName: string): OrganisationEntity {
    // return new instance, don't mutate
  }
}
```

Rules:

- Private constructor, always use `.create()` or `.reconstitute()`
- Mutation methods return **new instances** (immutable)
- `.create()` validates via value objects; `.reconstitute()` trusts persistence layer
- Use cases return DTOs, never leak entities past the boundary

## Value Object Pattern

```typescript
class OrganisationSlug {
  private constructor(readonly value: string) {}

  static create(raw: string): OrganisationSlug {
    if (!SLUG_REGEX.test(raw)) throw new AuthOrgSlugInvalidError();
    return new OrganisationSlug(raw.trim());
  }

  equals(other: OrganisationSlug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

Rules:

- Private constructor + static `.create()` with validation
- `equals()` for structural comparison
- `toString()` returning underlying value
- Never mutated, always immutable

## Port Interface Pattern

Ports are TypeScript interfaces defined in domain packages. Infrastructure implements them in `apps/api/adapters/`.

```typescript
// packages/domains/identity/src/ports/user-repository.ts
export interface UserRepository {
  findById(id: string): Promise<UserEntity | undefined>;
  findByWorkosId(workosUserId: string): Promise<UserEntity | undefined>;
  upsertByWorkosId(data: { workosUserId: string; email: string; displayName?: string }): Promise<UserEntity>;
}

// packages/domains/execution/src/ports/storage-port.ts
export interface StoragePort {
  generatePresignedPutUrl(key: string, contentType: string): Promise<string>;
}
```

## Route Handler Contract

Route handlers in `apps/api/src/routes/` are thin controllers. Their responsibilities:

1. Parse HTTP input (cookies, query params, body, path params)
2. Validate input with Zod schemas from `@nohotfix/shared`
3. Call domain use cases with deps from `request.server.root`
4. Write HTTP output (cookies, redirects, JSON responses)

Prohibitions:

- No business logic (belongs in use cases)
- No direct repository access (use a use case)
- No inline helper functions (extract to use cases or `shared/lib/`)
- No manual tracing boilerplate — `@fastify/otel` auto-instruments routes; use `getSpan(request)` for custom attributes
- No inline cookie option literals (use `buildAuthCookieOptions()` from `shared/lib/auth-cookies.ts`)

## State Machines

**Run**: `in_progress` → `awaiting_decision` → (`go` | `no_go` | `abandoned`)
**Spec**: `pending` → `in_progress` → (`passed` | `failed` | `skipped`)

Terminal states are irreversible. Checked by `RunStateMachine.isTerminal()` / `SpecStateMachine.isTerminal()`.

## Run Immutability (3-layer enforcement)

1. **Middleware** (`immutability-guard.ts`): preHandler rejects writes to terminal runs
2. **Service**: validates state before mutation
3. **DB trigger** (planned): last-resort enforcement

## Cross-Domain Communication

1. **Domain Events** (async, decoupled): Published by use cases, handled by event bus in API layer
2. **Orchestration** (sync, explicit): Route handler coordinates multiple domain use cases in a single request

## Error Taxonomy

Format: `DOMAIN_CATEGORY_SPECIFIC`

- `AUTH_*` (13 codes): SESSION*EXPIRED, TOKEN*\*, ROLE_INSUFFICIENT, LAST_ADMIN, ORG_SLUG_TAKEN, etc.
- `BILL_*` (3): SUB_EXPIRED, WEBHOOK_INVALID, WEBHOOK_DUPLICATE
- `AUTHOR_*` (8): PLAYBOOK_NOT_FOUND, SPEC_NOT_FOUND, SPEC_ARCHIVED, SYNC_CONFLICT, SPEC_TITLE_INVALID, SPEC_STEP_INVALID, SPEC_DURATION_INVALID, SPEC_TAGS_INVALID, SPEC_FIELD_TOO_LONG, ARTIFACT_LABEL_INVALID, ARTIFACT_REQUIREMENTS_INVALID
- `EXEC_*` (4): RUN_IMMUTABLE, RUN_INVALID_TRANSITION, SPEC_ARTIFACTS_INCOMPLETE, DECISION_JUSTIFICATION_REQUIRED
- `SYS_*` (2): INTERNAL, DATABASE

Domain errors are mapped to HTTP status codes ONLY at the API layer (see backend skill for implementation).

## Database Design Decisions

- 14 tables across 5 contexts (see `packages/db/src/schema.ts`)
- UUID primary keys, `created_at` / `updated_at` timestamps
- JSONB for: TipTap rich text, test steps, artifact requirements, table data, changelog field_changes
- Multi-tenancy: application-layer filtering by `org_id` (not RLS in v1)
- Soft-delete: `is_archived` flag on specs/playbooks only (runs are immutable forever)
- Migrations in `packages/db/src/migrations/`

## Naming Conventions

| What                           | Convention                            | Example                                                 |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------- |
| Directories/files              | kebab-case                            | `org-guard.ts`                                          |
| React components               | PascalCase.tsx                        | `CreateOrganisationForm.tsx`                            |
| Entity classes                 | PascalCase + `Entity` suffix          | `OrganisationEntity`, `UserEntity`                      |
| Entity props interfaces        | PascalCase + `Props` suffix           | `OrganisationProps`, `UserProps`                        |
| Value Objects                  | PascalCase, no suffix                 | `Email`, `Role`, `OrganisationSlug`                     |
| Use-case input interfaces      | PascalCase + `Command` suffix         | `CreateOrganisationCommand`, `UpdateUserProfileCommand` |
| Use-case dependency interfaces | PascalCase + `Deps` suffix            | `CreateOrganisationDeps`, `UpdateUserProfileDeps`       |
| Use-case return types          | Shared `*Dto` from `@nohotfix/shared` | `OrganisationDto`, `UpdateUserProfileDto`               |
| Zod request schemas            | PascalCase + `RequestSchema` suffix   | `CreateOrganisationRequestSchema`                       |
| Zod DTO schemas                | PascalCase + `DtoSchema` suffix       | `OrganisationDtoSchema`, `UserDtoSchema`                |
| Repository interfaces          | PascalCase + `Repository` suffix      | `OrganisationRepository`, `UserRepository`              |
| Variables/functions            | camelCase                             | `getAccessToken`                                        |
| Types/interfaces               | PascalCase                            | `AuthContext`                                           |
| Error codes                    | DOMAIN_CATEGORY_SPECIFIC              | `EXEC_RUN_IMMUTABLE`                                    |
| DB columns/tables              | snake_case                            | `org_id`, `run_specs`                                   |
| Test files (API/app)           | `*.spec.ts`                           | `auth.spec.ts`                                          |
| Test files (domains)           | `*.test.ts`                           | `email.test.ts`                                         |

## Observability Strategy

- OpenTelemetry: `@fastify/otel` auto-instruments routes + hooks, custom attributes via `getSpan(request)`, W3C Trace Context propagation
- Sentry: errors >= 500, error.code as fingerprint, traceId tagged
- Pino logger: `pino-pretty` in dev, plain in prod
