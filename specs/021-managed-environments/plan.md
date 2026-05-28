# Implementation Plan: Managed Environments

**Branch**: `021-managed-environments` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-managed-environments/spec.md`

## Summary

Introduce org-level managed environments (Production, Acceptance, Test) as a new `environments` table with full CRUD on an admin-only settings page. Environments are seeded on org creation and via migration for existing orgs. They serve as the single source of truth for environment labels across playbooks and (future) runs. The feature lives in the Identity bounded context and follows the standard hexagonal architecture pattern.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL (new `environments` table, migration to `playbooks` table)
**Testing**: Vitest (unit + integration)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo)
**Performance Goals**: API reads <500ms p95, writes <1000ms p95 (per constitution)
**Constraints**: org_id tenancy on all queries, case-insensitive uniqueness
**Scale/Scope**: ~3-20 environments per org, 1 new settings page, 4 API endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Assigned to **Identity** context. No cross-domain imports. Domain package depends only on `@nohotfix/shared` + `zod`. UI hooks in `packages/domains/identity/src/ui/`. Dual entry-point consumer rules respected: API imports logic only, app imports both. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal Architecture: entity + value object + port in domain package; Kysely adapter in `apps/api/src/adapters/`. Composition root wires repository. HTTP status codes only in error handler. Named exports. `org_id` on all queries. Error taxonomy codes registered. | ✅ |
| III | **Testing Discipline** — Unit tests: EnvironmentName value object validation (valid + invalid), EnvironmentEntity create/reconstitute, use case logic with mocked repos (duplicate name, delete guard). Integration tests: all API endpoints (happy path + error paths + org_id boundary). No E2E needed (settings page, not critical user journey). | ✅ |
| IV | **UX Consistency** — Admin role guard at TanStack Router `beforeLoad` for settings/environments route. No polling needed (single-author settings page). Domain UI hooks in `packages/domains/identity/src/ui/hooks/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Hooks accept `queryKey`/`invalidateKeys` params. Confirmation dialog on delete. | ✅ |
| V | **Run Immutability** — Feature does not touch run data. Environment reference on runs is read-only (future feature). No immutability guard needed. | ✅ N/A |
| VI | **Domain Errors** — 4 new error codes: `AUTH_ENV_NOT_FOUND`, `AUTH_ENV_NAME_DUPLICATE`, `AUTH_ENV_NAME_INVALID`, `AUTH_ENV_IN_USE`. Registered in `packages/shared/src/errors/codes.ts`. Domain error classes in `packages/domains/identity/src/errors/`. Unit tests assert correct codes for each error path. | ✅ |
| VII | **Observability (OTel)** — Route handlers auto-instrumented by `@fastify/otel`. Custom span attributes: `environment.id`, `environment.name`, `org.id`. Use `getSpan(request)` pattern. No manual span lifecycle management. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/021-managed-environments/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research decisions
├── data-model.md        # Entity and table design
├── quickstart.md        # Development setup
├── contracts/
│   └── api.md           # API endpoint contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
├── errors/
│   └── codes.ts                          # + 4 new AUTH_ENV_* error codes
└── schemas/
    └── environments.ts                   # NEW: Zod schemas (DTO, request, reorder)

packages/db/src/
├── schema.ts                             # + EnvironmentsTable, update PlaybooksTable
└── migrations/
    └── 006_create_environments_table.ts  # NEW: table + indexes + seed existing orgs

packages/domains/identity/src/
├── entities/
│   ├── environment.ts                    # NEW: EnvironmentEntity (create/reconstitute)
│   └── environment-name.ts              # NEW: EnvironmentName value object
├── ports/
│   └── environment-repository.ts         # NEW: port interface
├── use-cases/
│   ├── create-environment.ts             # NEW
│   ├── rename-environment.ts             # NEW
│   ├── delete-environment.ts             # NEW
│   ├── reorder-environments.ts           # NEW
│   ├── list-environments.ts              # NEW
│   └── create-organisation.ts            # MODIFIED: seed default environments
├── errors/
│   └── index.ts                          # + 4 new error classes
└── ui/
    └── hooks/
        └── use-environments.ts           # NEW: TanStack Query hooks

apps/api/src/
├── adapters/
│   └── repositories/
│       └── kysely-environment-repository.ts  # NEW
├── composition-root.ts                       # MODIFIED: wire environment repo
└── routes/
    └── identity.ts                           # MODIFIED: + environment endpoints

apps/app/src/
├── api/
│   └── query-keys.ts                         # + environmentKeys factory
└── routes/_authenticated/$orgSlug/settings/
    └── environments.tsx                      # NEW: settings page
```

**Structure Decision**: Standard monorepo hexagonal pattern. Domain logic (entity, value object, ports, use cases) in `packages/domains/identity/`. Infrastructure adapter (Kysely repository) in `apps/api/src/adapters/`. Thin route handlers in `apps/api/src/routes/identity.ts`. Frontend hooks in domain UI package, settings page in app routes.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
