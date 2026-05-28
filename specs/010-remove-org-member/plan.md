# Implementation Plan: Remove Organization Member

**Branch**: `010-remove-org-member` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-remove-org-member/spec.md`

## Summary

Allow admins/owners to remove members from the organization (hard delete of membership record), and allow any non-owner member to remove themselves (leave). The feature completes existing stubs in the `removeMember` use case, the DELETE route, and the repository `delete()` method. One new error code (`AUTH_OWNER_CANNOT_BE_REMOVED`) is needed. No schema migration required.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `memberships` table — no schema changes)
**Testing**: Vitest (unit + integration), Playwright (E2E if warranted)
**Target Platform**: Web (SPA + API server)
**Project Type**: Web service (monorepo: apps/api + apps/app + packages/domains)
**Performance Goals**: API write < 1000ms p95; UI update < 3s from confirmation
**Constraints**: org_id tenancy on all queries; hard delete (not soft); owner protection
**Scale/Scope**: B2B SaaS, standard load; 3 files modified, ~5 new files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature lives entirely in **Identity** context. No cross-domain imports. Domain pkg (`@releasepilot/domain-identity`) depends only on `@releasepilot/shared` and `zod`. UI subpath exports hook; API imports logic subpath only. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal maintained: use case is pure function accepting `Deps` + `Command`; repository port in domain, Kysely adapter in `apps/api/src/adapters/`. HTTP status codes only in global error handler. All queries include `org_id`. Error taxonomy codes used. Named exports. | ✅ |
| III | **Testing Discipline** — Unit tests for `removeMember` use case covering: happy path, owner protection, self-removal, member-removes-other rejection, not-found. Integration tests for DELETE endpoint covering: happy path, 403, 404, org_id boundary. | ✅ |
| IV | **UX Consistency** — Confirmation dialog before destructive action. Remove action hidden from non-admins and from owner row. Domain UI in `packages/domains/identity/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Hook accepts `invalidateKeys` parameter. No polling changes needed. | ✅ |
| V | **Run Immutability** — Feature does not touch run data. N/A. | ✅ N/A |
| VI | **Domain Errors** — New error code `AUTH_OWNER_CANNOT_BE_REMOVED` registered in `packages/shared/src/errors/codes.ts`. Domain error class in `packages/domains/identity/src/errors/`. Existing codes reused: `AUTH_ROLE_INSUFFICIENT`, `AUTH_TARGET_NOT_FOUND`. Unit tests assert each error path. | ✅ |
| VII | **Observability (OTel)** — Route handler uses `getSpan(request)` for custom attributes (actor, target, self-removal flag). Use case is pure — no manual spans needed (auto-instrumented by `@fastify/otel`). | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/010-remove-org-member/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # DELETE endpoint contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
├── errors/codes.ts                          # + AUTH_OWNER_CANNOT_BE_REMOVED
└── schemas/auth.ts                          # (no changes needed — DELETE has no body)

packages/domains/identity/src/
├── use-cases/
│   ├── remove-member.ts                     # Complete the stub
│   └── __tests__/
│       └── remove-member.test.ts            # Unit tests (NEW)
├── errors/index.ts                          # + AuthOwnerCannotBeRemovedError
├── ports/membership-repository.ts           # (already has delete signature)
└── ui/
    └── hooks/
        └── use-remove-member.ts             # TanStack Query mutation hook (NEW)

apps/api/src/
├── routes/identity.ts                       # Complete DELETE stub
├── routes/identity.spec.ts                  # + integration tests for DELETE
└── adapters/repositories/
    └── kysely-membership-repository.ts      # Complete delete() stub

apps/app/src/
├── api/query-keys.ts                        # (already has settingsKeys.members — reuse for invalidation)
└── routes/                                  # Wire useRemoveMember hook in member list page
```

**Structure Decision**: Existing monorepo layout with hexagonal architecture. All changes are within the Identity bounded context. No new packages or structural changes needed — completing existing stubs and adding one new hook + one new error class.

## Complexity Tracking

> No constitution violations. No complexity justification needed.
