# Implementation Plan: Organisation Settings Page

**Branch**: `006-org-settings` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-org-settings/spec.md`

## Summary

Add the Organisation Settings page — the default tab in the Settings area — where all members can view the organisation name and slug, and Owners/Admins can rename the organisation. This feature is fully contained within the **Identity** bounded context and requires no schema changes. The `OrganisationEntity.rename()` method, `OrganisationRepository.update()` port, and `KyselyOrganisationRepository.update()` adapter already exist. The `PATCH /api/orgs/:orgSlug` route is stubbed (501) and needs implementation. The frontend `/settings/general` route is a placeholder to be replaced with the real UI.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `organisations` table — no schema changes)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API server)
**Project Type**: Web service (monorepo: apps/api + apps/app + domain packages)
**Performance Goals**: API read <500ms p95, API write <1000ms p95, SPA LCP <2.5s
**Constraints**: org_id tenancy on all queries, hexagonal architecture, role-based access
**Scale/Scope**: B2B SaaS, standard load. 2 new files (use case + UI component), 4 modified files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to **Identity** context. No cross-domain imports. Domain package uses only `@releasepilot/shared` + `zod`. Use case in `packages/domains/identity/src/use-cases/`. UI component in `packages/domains/identity/src/ui/`. Consumer rules respected: `apps/api` imports logic only, `apps/app` imports logic + UI. | PASS |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained: `renameOrganisation` use case is transport-agnostic, accepts deps + input, returns DTO. Composition root wires adapter. HTTP status codes only in error handler. Named exports. `org_id` filtering via `orgScopeMiddleware`. Error taxonomy: reuses `AUTH_ORG_NAME_INVALID` (422) and `AUTH_ROLE_INSUFFICIENT` (403). | PASS |
| III | **Testing Discipline** — Unit tests: `renameOrganisation` use case (valid rename, empty name, role rejection). Integration tests: `PATCH /api/orgs/:orgSlug` happy path + role enforcement + org_id boundary. No state machine or immutability changes, so those tests are not applicable. | PASS |
| IV | **UX Consistency** — Members see read-only view (no edit affordances). Role guard not needed at router `beforeLoad` because all roles can access the page; edit permissions are handled by rendering different UI based on role. Domain UI lives in `packages/domains/identity/src/ui/`. No polling needed (on-demand fetch only, like playbook editor). | PASS |
| V | **Run Immutability** — Feature does not touch run data. Not applicable. | PASS (N/A) |
| VI | **Domain Errors** — Reuses existing `AUTH_ORG_NAME_INVALID` (422) and `AUTH_ROLE_INSUFFICIENT` (403) error codes already registered in `packages/shared/src/errors/codes.ts`. No new error codes needed. Unit tests assert correct error codes for role rejection and invalid name. | PASS |
| VII | **Observability (OTel)** — Route handler auto-instrumented by `@fastify/otel`. Custom span attributes (`org.slug`, `user.id`, `org.name.new`) added via `getSpan(request)`. Span auto-named `PATCH /api/orgs/:orgSlug` by the `requestHook`. | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/006-org-settings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # PATCH /api/orgs/:orgSlug contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/domains/identity/src/
├── use-cases/
│   └── rename-organisation.ts        # NEW — use case
├── ui/
│   ├── components/
│   │   └── OrganisationSettingsForm.tsx  # NEW — view/edit form
│   └── hooks/
│       └── use-rename-organisation.ts   # NEW — TanStack Query mutation hook
├── entities/
│   └── organisation.ts              # EXISTING — rename() already implemented
├── ports/
│   └── organisation-repository.ts   # EXISTING — update() already defined
└── errors/
    └── index.ts                     # EXISTING — reuse AUTH_ORG_NAME_INVALID, AUTH_ROLE_INSUFFICIENT

apps/api/src/
├── routes/
│   └── identity.ts                  # MODIFY — implement PATCH /api/orgs/:orgSlug (replace 501 stub)
└── adapters/repositories/
    └── kysely-organisation-repository.ts  # EXISTING — update() already implemented

apps/app/src/routes/_authenticated/$orgSlug/settings/
├── general.tsx                      # MODIFY — replace placeholder with OrganisationSettingsForm

packages/shared/src/schemas/
└── organisation.ts                  # MODIFY — add UpdateOrganisationRequestSchema
```

**Structure Decision**: Monorepo structure with Identity domain package owning all new domain logic and UI. Follows existing patterns established by `createOrganisation` use case + `CreateOrganisationForm` component.

## Complexity Tracking

> No violations. All decisions follow existing patterns with zero new abstractions.
