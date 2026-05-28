# Implementation Plan: Organization Members List

**Branch**: `005-org-members-list` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-org-members-list/spec.md`

## Summary

Display a read-only list of confirmed organization members on the settings members page. Each entry shows display name (or email fallback) and role. The list is sorted by role hierarchy (owner → admin → member), then alphabetically within each group. All roles see the same view. No pending invitations (deferred). The feature spans the Identity bounded context: a new use case, repository query implementation, API route handler, and domain UI component with TanStack Query hook.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React
**Storage**: PostgreSQL (existing `memberships` + `users` tables — no schema changes)
**Testing**: Vitest (unit + integration)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo)
**Performance Goals**: API read < 500ms p95 (constitution); page load < 2s (spec SC-001)
**Constraints**: `org_id` mandatory on all tenant queries; domain logic infrastructure-free
**Scale/Scope**: Small feature — 1 use case, 1 route, 1 UI component, 1 hook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Identity** (owns users, organisations, memberships, roles). No cross-domain imports needed. Use case in `packages/domains/identity/`, UI in `packages/domains/identity/src/ui/`, adapter in `apps/api/src/adapters/`. Dual entry-point rules: `apps/api` imports logic only, `apps/app` imports UI only. | ☑ |
| II | **Code Quality & Simplicity** — Hexagonal architecture: use case depends on `MembershipRepository` port (already defined). Repository adapter implements the port with Kysely. Route handler is a thin controller calling the use case via `request.server.root`. `org_id` enforced in the query WHERE clause. Named exports throughout. | ☑ |
| III | **Testing Discipline** — Unit test for the `listOrgMembers` use case (sort order, name fallback). Integration test for `GET /api/orgs/:orgId/members` (happy path + org_id boundary — verifying no cross-org leakage). No state machines or enforcement paths involved. | ☑ |
| IV | **UX Consistency** — Read-only list (no terminal states apply). No role guard needed (all roles can view). No polling (on-demand fetch per constitution table — members page is not in the polling table, analogous to "Run history list"). Domain UI in `packages/domains/identity/src/ui/`. | ☑ |
| V | **Run Immutability** — Feature does not touch run data. N/A. | ☑ |
| VI | **Domain Errors** — No new error codes needed. Existing errors cover: `AUTH_ORG_NOT_FOUND` (if org doesn't exist), `AUTH_TOKEN_*` (auth failures). The list endpoint is a simple read with no novel error paths beyond auth + org resolution. | ☑ |
| VII | **Observability (OTel)** — Route handler auto-instrumented by `@fastify/otel`. Custom span attributes (`org.id`, `members.count`) added via `getSpan(request)`. No new service methods requiring manual spans. | ☑ |

## Project Structure

### Documentation (this feature)

```text
specs/005-org-members-list/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # GET /api/orgs/:orgId/members contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/domains/identity/src/
├── use-cases/
│   └── list-org-members.ts          # NEW: use case
├── ports/
│   └── membership-repository.ts     # EXISTING: findByOrg already defined, needs enriched return type
└── ui/
    ├── components/
    │   └── MembersList.tsx           # NEW: presentational component
    └── hooks/
        └── use-org-members.ts        # NEW: TanStack Query hook

apps/api/src/
├── routes/
│   └── identity.ts                  # MODIFY: implement GET /api/orgs/:orgId/members stub
└── adapters/repositories/
    └── kysely-membership-repository.ts  # MODIFY: implement findByOrg with JOIN

packages/shared/src/
└── schemas/
    └── organisation.ts              # MODIFY: add OrgMemberResponseSchema

apps/app/src/routes/_authenticated/$orgSlug/settings/
└── members.tsx                      # MODIFY: compose MembersList component
```

**Structure Decision**: Follows existing monorepo hexagonal architecture. All changes are within the Identity context. No new packages or directories beyond what the domain UI pattern requires.

## Complexity Tracking

> No constitution violations. All principles pass without justification needed.
