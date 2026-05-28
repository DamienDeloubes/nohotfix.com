# Implementation Plan: User Settings Page

**Branch**: `007-user-settings` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-user-settings/spec.md`

## Summary

Replace the single `display_name` column on the `users` table with separate `first_name` and `last_name` columns. Update the signup flow (WorkOS → user creation) to store names separately. Build a User Settings page at `/$orgSlug/settings/account` where users can edit their first/last name, view their email (read-only), and follow a "View guide" link for email/password changes. Update all 30 files that reference `displayName`/`display_name` across the stack.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, WorkOS SDK
**Storage**: PostgreSQL (existing `users` table — schema migration required)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Linux server (API), Browser SPA (app)
**Project Type**: Web service + SPA (monorepo)
**Performance Goals**: API reads <500ms p95, writes <1000ms p95
**Constraints**: Pre-launch application — no backward-compatibility period needed
**Scale/Scope**: ~30 files affected across 6 packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Identity**. `UserEntity`, `UserRepository` port, use cases, and domain UI all live in `packages/domains/identity/`. No cross-domain imports needed. The account settings page route in `apps/app` composes domain UI components. Dual entry-point rules respected: `apps/api` imports logic only, `apps/app` imports logic + UI. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained: `UserEntity` updated in domain package (no infra deps); `KyselyUserRepository` adapter updated in `apps/api/src/adapters/`. Composition root wires the update-user use case. New `FirstName`/`LastName` value objects replace `DisplayName`. Error taxonomy used for validation errors. Named exports, `org_id` not applicable (user-scoped, not tenant-scoped). | ✅ |
| III | **Testing Discipline** — Unit tests: `UserEntity` create/reconstitute/updateProfile with new name fields; `FirstName`/`LastName` value object validation (empty, whitespace, max length); `updateUserProfile` use case happy + error paths. Integration tests: `PATCH /api/users/me` happy path + validation errors. No state machine changes. | ✅ |
| IV | **UX Consistency** — Account settings is a new tab in Settings area, no role guard needed (all members can edit own profile). Domain UI component `AccountSettingsForm` in `packages/domains/identity/src/ui/`. Query keys centralised: add `userKeys.me` to `query-keys.ts`. Domain hook accepts `queryKey`/`invalidateKeys` params. No polling (on-demand only). | ✅ |
| V | **Run Immutability** — Feature does not touch run data. N/A. | ✅ N/A |
| VI | **Domain Errors** — New error codes: `AUTH_USER_FIRST_NAME_INVALID`, `AUTH_USER_LAST_NAME_INVALID`, `AUTH_USER_NOT_FOUND`. Registered in `packages/shared/src/errors/codes.ts`. Domain error classes in `packages/domains/identity/src/errors/`. Unit tests assert correct codes. | ✅ |
| VII | **Observability (OTel)** — Route handler uses `getSpan(request)` for custom attributes (auto-instrumented by `@fastify/otel`). `updateUserProfile` use case is a thin function — no manual span needed beyond the auto-instrumented route span. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/007-user-settings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/db/src/
├── schema.ts                          # UPDATE: UsersTable → first_name, last_name
└── migrations/
    └── 002_user_first_last_name.ts    # NEW: migration

packages/shared/src/
├── schemas/auth.ts                    # UPDATE: SessionUserSchema, new UpdateUserProfileRequestSchema
├── schemas/organisation.ts            # UPDATE: OrgMemberResponseSchema
├── errors/codes.ts                    # UPDATE: add AUTH_USER_* error codes
├── types/index.ts                     # UPDATE: export new types
└── index.ts                           # UPDATE: re-exports

packages/domains/identity/src/
├── entities/
│   ├── user.ts                        # UPDATE: firstName/lastName props, updateProfile method
│   ├── value-objects/
│   │   ├── first-name.ts              # NEW: FirstName value object
│   │   ├── last-name.ts               # NEW: LastName value object
│   │   ├── display-name.ts            # DELETE
│   │   └── index.ts                   # UPDATE: exports
│   └── __tests__/
│       ├── user.test.ts               # UPDATE: tests
│       ├── first-name.test.ts         # NEW: tests
│       ├── last-name.test.ts          # NEW: tests
│       └── display-name.test.ts       # DELETE
├── ports/
│   ├── repositories.ts                # UPDATE: UserRepository interface
│   └── membership-repository.ts       # UPDATE: MemberWithUserDto
├── use-cases/
│   ├── resolve-user-from-jwt.ts       # UPDATE: store separate names
│   ├── sync-user-from-jwt.ts          # UPDATE: separate name params
│   ├── update-user-profile.ts         # NEW: use case for settings page
│   └── __tests__/
│       ├── resolve-user-from-jwt.test.ts  # UPDATE
│       └── update-user-profile.test.ts    # NEW
├── errors/
│   └── index.ts                       # UPDATE: add name validation errors
├── ui/
│   ├── components/
│   │   ├── MembersList.tsx            # UPDATE: firstName/lastName display
│   │   └── AccountSettingsForm.tsx     # NEW: settings form component
│   └── hooks/
│       └── use-update-user-profile.ts # NEW: mutation hook
└── index.ts                           # UPDATE: export new use case

apps/api/src/
├── adapters/repositories/
│   ├── kysely-user-repository.ts      # UPDATE: first_name/last_name
│   └── kysely-membership-repository.ts # UPDATE: first_name/last_name
├── routes/identity.ts                 # UPDATE: members response + PATCH /api/users/me
├── shared/middleware/auth.ts          # UPDATE: AuthUser type
└── composition-root.ts               # UPDATE: wire updateUserProfile use case (if needed)

apps/app/src/
├── api/query-keys.ts                  # UPDATE: add userKeys
└── routes/_authenticated/$orgSlug/settings/
    └── account.tsx                    # UPDATE: compose AccountSettingsForm
```

**Structure Decision**: Existing monorepo structure. All changes fit within the Identity bounded context. New files are value objects, one use case, one UI component, one mutation hook, one migration, and their tests.

## Complexity Tracking

No constitution violations. No complexity justification needed.
