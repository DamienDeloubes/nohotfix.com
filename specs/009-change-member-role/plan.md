# Implementation Plan: Change Member Role

**Branch**: `009-change-member-role` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-change-member-role/spec.md`

## Summary

Allow admins and owners to change organisation member roles (promote/demote between admin and member), and allow owners to transfer ownership atomically. The feature implements a currently-stubbed use case, completes TODO repository methods, upgrades the existing 501 PATCH endpoint to a working handler, and adds a role-change UI to the existing MembersList component.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `memberships` table — no schema changes)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo: apps/api + apps/app + packages/domains)
**Performance Goals**: Role change completes in under 3 seconds end-to-end (SC-001)
**Constraints**: Exactly one owner per org at all times; ownership transfer must be atomic
**Scale/Scope**: Standard B2B SaaS load; single PATCH endpoint + UI update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to **Identity** context. No cross-domain imports. Domain package (`@nohotfix/domain-identity`) depends only on `@nohotfix/shared` + `zod`. Dual entry-point consumer rules respected: `apps/api` imports logic only; `apps/app` imports logic + UI. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal architecture maintained: use case is transport-agnostic; repository port defined in domain, Kysely adapter in `apps/api/src/adapters/`. Composition root wires dependencies. Error taxonomy codes follow `AUTH_*` convention. `org_id` included in all queries. Named exports, kebab-case files, PascalCase components. | ✅ |
| III | **Testing Discipline** — Unit tests: use case business rules (all 5 error paths + 2 happy paths + ownership transfer atomicity). Integration tests: PATCH endpoint happy path + auth rejection + org_id boundary. No state machine or immutability affected. | ✅ |
| IV | **UX Consistency** — Role change controls hidden from members via role check. Confirmation dialogs for ownership transfer (FR-013) and admin self-demotion (FR-014). Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain hooks accept `queryKey`/`invalidateKeys` params. Domain UI in `packages/domains/identity/src/ui/`. | ✅ |
| V | **Run Immutability** — Feature does not touch run data. Not applicable. | ✅ N/A |
| VI | **Domain Errors** — 3 new error codes: `AUTH_ROLE_SAME`, `AUTH_OWNER_SELF_DEMOTE`, `AUTH_TARGET_NOT_FOUND` registered in `packages/shared/src/errors/codes.ts`. Domain error classes in `packages/domains/identity/src/errors/`. Existing codes reused: `AUTH_ROLE_INSUFFICIENT`, `AUTH_LAST_ADMIN`. Unit tests assert each error path. | ✅ |
| VII | **Observability (OTel)** — Use case service method emits OTel span via `getSpan(request)` in route handler with attributes: `org.id`, `target.membership_id`, `role.from`, `role.to`, `role.is_transfer`. DB queries use standard Kysely patterns (auto-instrumented). | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/009-change-member-role/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
├── errors/
│   └── codes.ts                          # Add 3 new error codes
└── schemas/
    └── organisation.ts                   # Add ChangeMemberRoleRequestSchema

packages/domains/identity/src/
├── errors/
│   └── index.ts                          # Add 3 new domain error classes
├── use-cases/
│   └── change-member-role.ts             # Replace TODO stub with full implementation
├── ports/
│   └── membership-repository.ts          # Add findByOrgAndId(), transferOwnership(); update updateRole() to include orgId
└── ui/
    ├── components/
    │   └── MembersList.tsx               # Add role change dropdown + confirmation dialogs
    └── hooks/
        └── use-change-member-role.ts     # New mutation hook

apps/api/src/
├── routes/
│   └── identity.ts                       # Implement PATCH /api/orgs/:orgSlug/members/:memberId/role
└── adapters/repositories/
    └── kysely-membership-repository.ts   # Implement findByOrgAndId(), updateRole(orgId, id, role), countAdmins(), transferOwnership()

apps/app/src/
└── api/
    └── query-keys.ts                     # No changes needed (settingsKeys.members already exists)
```

**Structure Decision**: All changes fit within the existing monorepo structure. No new packages, directories, or architectural changes required. The feature primarily completes existing TODO stubs and replaces a 501 endpoint with working implementation.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
