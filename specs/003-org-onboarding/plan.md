# Implementation Plan: Organization Onboarding

**Branch**: `003-org-onboarding` | **Date**: 2026-03-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-org-onboarding/spec.md`

## Summary

Implement the mandatory organization creation step after WorkOS signup. New users without organizations are blocked from all dashboard routes and redirected to an onboarding form (name + slug). Existing users with organizations are routed directly to `/<org-slug>/dashboard`. This requires: a database migration (add `slug` column, add `owner` role), the `createOrganisation` use case implementation, new API endpoints (`POST /api/orgs`, `GET /api/orgs/check-slug`, `GET /api/users/me/orgs`), frontend route restructuring under `$orgSlug`, and an onboarding guard in the TanStack Router layout.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20
**Primary Dependencies**: Fastify 5, TanStack Router v1.91, TanStack Query v5, Kysely, react-hook-form, Zod, WorkOS SDK
**Storage**: PostgreSQL (Kysely ORM) — additive migration for `slug` + `owner` role
**Testing**: Vitest (unit + integration), Playwright (E2E in `apps/app-e2e/`)
**Target Platform**: Web SPA (apps/app on Vite) + Fastify API (apps/api)
**Project Type**: Monorepo web application (PNPM + Turborepo)
**Performance Goals**: Org creation < 1000ms p95 (write endpoint); slug check < 500ms p95 (read endpoint)
**Constraints**: API write endpoints < 1000ms p95; SPA LCP < 2.5s on simulated 4G
**Scale/Scope**: B2B SaaS, ~10k users; this feature touches 3 packages + 2 apps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Identity**. All domain logic in `packages/domains/identity/`. No cross-domain imports. `OrganisationSlug` value object, `createOrganisation` use case, and `CreateOrganisationForm` UI component all live in Identity. API routes in `apps/api/src/routes/identity.ts`. Consumer rules: `apps/api` imports domain logic only; `apps/app` imports domain UI (`/ui` subpath). | ☑ |
| II | **Code Quality & Simplicity** — Hexagonal maintained: domain entities/use cases have no Kysely/HTTP knowledge. `KyselyOrganisationRepository` implements port in `apps/api/src/adapters/`. Composition root wires repos to services. Error codes use `AUTH_ORG_SLUG_TAKEN` taxonomy. Named exports, `.js` extensions, `org_id` in all tenant queries. | ☑ |
| III | **Testing Discipline** — Unit tests: `OrganisationSlug` validation, `createOrganisation` use case (happy + duplicate slug). Integration tests: `POST /api/orgs` (happy path, duplicate slug, missing auth), `GET /api/users/me/orgs` (tenancy boundary). E2E: full onboarding flow (signup → org creation → dashboard redirect). | ☑ |
| IV | **UX Consistency** — Onboarding guard at TanStack Router `beforeLoad` in `_authenticated.tsx`. No polling needed (one-time form). Form validates inline with field-level errors. Domain UI in `packages/domains/identity/src/ui/`. | ☑ |
| V | **Run Immutability** — Feature does not touch run data. Not applicable. | ☑ N/A |

## Project Structure

### Documentation (this feature)

```text
specs/003-org-onboarding/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/db/src/
└── migrations/
    └── 002_add_org_slug_and_owner_role.ts    # New migration

packages/shared/src/
├── errors/codes.ts                           # Add AUTH_ORG_SLUG_TAKEN, AUTH_ORG_NOT_FOUND
├── schemas/
│   ├── auth.ts                               # Update SessionUserSchema role enum → add 'owner'
│   └── organisation.ts                       # New: CreateOrganisationRequestSchema, OrganisationSlugSchema, etc.
└── types/index.ts                            # Re-export new types

packages/domains/identity/src/
├── entities/
│   ├── organisation.ts                       # Add slug property + OrganisationSlug value object
│   └── value-objects/
│       ├── role.ts                           # Add 'owner' to RoleValue
│       └── organisation-slug.ts              # New value object: slug validation
├── ports/
│   └── organisation-repository.ts            # Add create(), findBySlug(), findByUserId()
├── use-cases/
│   ├── create-organisation.ts                # Implement: create org + owner membership
│   └── get-user-organisations.ts             # New: fetch orgs for a user
└── ui/
    ├── components/
    │   └── CreateOrganisationForm.tsx         # Name + slug form with validation
    └── hooks/
        ├── use-create-organisation.ts         # TanStack Query mutation hook
        ├── use-check-slug.ts                  # Debounced slug availability check
        └── use-user-organisations.ts          # Fetch user's orgs

apps/api/src/
├── adapters/repositories/
│   └── kysely-organisation-repository.ts     # Implement create(), findBySlug(), findByUserId()
├── routes/
│   └── identity.ts                           # Add POST /api/orgs, GET /api/orgs/check-slug,
│                                             #   GET /api/users/me/orgs
└── composition-root.ts                       # Wire new repository methods

apps/app/src/
├── routes/
│   ├── _authenticated.tsx                    # Add beforeLoad: org guard → redirect to /onboarding
│   ├── _authenticated/$orgSlug.tsx           # New layout: org-scoped routes
│   ├── _authenticated/$orgSlug/index.tsx     # Dashboard (moved from _authenticated/index.tsx)
│   ├── _authenticated/$orgSlug/playbooks/    # (existing routes moved under $orgSlug)
│   ├── _authenticated/$orgSlug/runs/         # (existing routes moved under $orgSlug)
│   ├── _authenticated/$orgSlug/history/      # (existing routes moved under $orgSlug)
│   ├── _authenticated/$orgSlug/spec-library/ # (existing routes moved under $orgSlug)
│   ├── _authenticated/$orgSlug/settings/     # (existing routes moved under $orgSlug)
│   └── onboarding/
│       └── create-org.tsx                    # Onboarding page composing CreateOrganisationForm
└── lib/
    └── session.ts                            # Update useSession to include orgs list
```

**Structure Decision**: Existing monorepo structure. Identity bounded context owns all new domain logic. Frontend routes restructured under `$orgSlug` dynamic segment for org-scoped URLs. Onboarding route sits outside `_authenticated` org guard (but still requires auth).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `findByUserId()` omits `org_id` in WHERE | User must discover which orgs they belong to before any org-scoped query is possible. Query filters by authenticated `user_id`, not arbitrary data. | Requiring `org_id` upfront creates a chicken-and-egg problem — user has no org context yet during onboarding. |
