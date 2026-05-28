# Tasks: Organization Onboarding

**Input**: Design documents from `/specs/003-org-onboarding/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included per constitution III (Testing Discipline) — enforcement-critical paths require unit + integration + E2E tests written alongside implementation.

**Organization**: Tasks grouped by user story. US1 and US2 are both P1; US2 depends on US1 backend. US3 is P2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3 (maps to spec.md user stories)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared schemas, error codes, and database migration that all user stories depend on.

- [x] T001 [P] Add `AUTH_ORG_SLUG_TAKEN` and `AUTH_ORG_NOT_FOUND` error codes in `packages/shared/src/errors/codes.ts`
- [x] T002 [P] Create organisation Zod schemas (`OrganisationSlugSchema`, `CreateOrganisationRequestSchema`, `OrganisationResponseSchema`, `UserOrganisationResponseSchema`, `CheckSlugResponseSchema`) in `packages/shared/src/schemas/organisation.ts`
- [x] T003 [P] Update `SessionUserSchema` role enum to include `'owner'` in `packages/shared/src/schemas/auth.ts`
- [x] T004 [P] Re-export new organisation schemas and types from `packages/shared/src/types/index.ts`
- [x] T005 Create database migration `002_add_org_slug_and_owner_role.ts` in `packages/db/src/migrations/` — add `slug` column to `organisations` (with backfill + NOT NULL + UNIQUE index), update `memberships.role` CHECK constraint to include `'owner'`
- [x] T006 Update `OrganisationsTable` type in `packages/db/src/schema.ts` to include `slug: string` column

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain entities, value objects, repository ports, and infrastructure that MUST be complete before any user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 [P] Create `OrganisationSlug` value object with regex validation (`^[a-z0-9]+(-[a-z0-9]+)*$`, 3-50 chars) in `packages/domains/identity/src/entities/value-objects/organisation-slug.ts`
- [x] T008 [P] Update `Role` value object — add `'owner'` to `RoleValue`, add `static owner()` factory, add `isOwner()` method in `packages/domains/identity/src/entities/value-objects/role.ts`
- [x] T009 Update `OrganisationEntity` — add `slug: OrganisationSlug` property, update `create()` and `reconstitute()` signatures in `packages/domains/identity/src/entities/organisation.ts`
- [x] T010 Update `OrganisationRepository` port — add `create()`, `findBySlug()`, `findByUserId()`, `slugExists()` methods in `packages/domains/identity/src/ports/organisation-repository.ts`
- [x] T011 Implement `KyselyOrganisationRepository` — implement all port methods (`findById`, `findBySlug`, `findByUserId`, `create`, `update`, `slugExists`) with `org_id` tenancy in `apps/api/src/adapters/repositories/kysely-organisation-repository.ts`. Note: `findByUserId()` queries `memberships` by `user_id` without `org_id` — this is an acknowledged exception to constitution II (user discovering own tenant memberships, not accessing cross-tenant data).
- [x] T012 [P] Implement `KyselyMembershipRepository.create()` method (needed for owner membership creation) in `apps/api/src/adapters/repositories/kysely-membership-repository.ts`
- [x] T013 Create `authMiddlewareNoOrg` variant — validates JWT, extracts `userId` + `email` but does not require `org_id` in `apps/api/src/shared/middleware/auth.ts`
- [x] T014 Update composition root — wire new repository methods and ensure `organisationRepo` exposes all new port methods in `apps/api/src/composition-root.ts`
- [x] T015 [P] Create `AuthOrgSlugTakenError` and `AuthOrgNotFoundError` domain error classes in `packages/domains/identity/src/errors/` (following existing error pattern)
- [x] T016 Update Identity domain package exports — add new value objects, entities, use cases, errors, and UI exports in `packages/domains/identity/src/index.ts`

**Checkpoint**: Foundation ready — domain model complete, repositories wired, auth middleware variant available.

---

## Phase 3: User Story 1 — New User Creates Organization After Signup (Priority: P1) MVP

**Goal**: A new user completes signup, sees the org creation form (name + slug), submits it, and lands on `/<org-slug>/dashboard`.

**Independent Test**: Sign up a new user → verify onboarding form appears → fill name + slug → submit → confirm redirect to `/<org-slug>/dashboard`.

### Tests for User Story 1

- [ ] T017 [P] [US1] Unit test `OrganisationSlug` value object — valid slugs, invalid chars, boundary lengths, leading/trailing hyphens in `packages/domains/identity/src/entities/value-objects/organisation-slug.spec.ts`
- [ ] T018 [P] [US1] Unit test `createOrganisation` use case — happy path (creates org + owner membership), duplicate slug rejection in `packages/domains/identity/src/use-cases/create-organisation.spec.ts`
- [ ] T019 [P] [US1] Integration test `POST /api/orgs` — happy path (201 + org created), duplicate slug (409), missing auth (401), invalid body (400) in `apps/api/src/__tests__/create-organisation.spec.ts`
- [ ] T020 [P] [US1] Integration test `GET /api/orgs/check-slug` — available slug (200 true), taken slug (200 false), invalid slug format (400), missing auth (401) in `apps/api/src/__tests__/check-slug.spec.ts`

### Implementation for User Story 1

- [x] T021 [US1] Implement `createOrganisation` use case — validate name + slug, check slug uniqueness via repo, create `OrganisationEntity`, persist org, create owner membership in `packages/domains/identity/src/use-cases/create-organisation.ts`
- [x] T022 [US1] Implement `getUserOrganisations` use case — fetch orgs by userId via repository, return with role info in `packages/domains/identity/src/use-cases/get-user-organisations.ts`
- [x] T023 [US1] Add `POST /api/orgs` route — use `authMiddlewareNoOrg`, parse body with `CreateOrganisationRequestSchema`, call `createOrganisation` use case, return 201 in `apps/api/src/routes/identity.ts`
- [x] T024 [US1] Add `GET /api/orgs/check-slug` route — use `authMiddlewareNoOrg`, validate slug query param, call `slugExists()` on repo, return `{ available: boolean }` in `apps/api/src/routes/identity.ts`
- [x] T025 [US1] Add `GET /api/users/me/orgs` route — use `authMiddlewareNoOrg`, call `getUserOrganisations` use case, return org list with roles in `apps/api/src/routes/identity.ts`
- [x] T026 [P] [US1] Create `useCreateOrganisation` TanStack Query mutation hook in `packages/domains/identity/src/ui/hooks/use-create-organisation.ts`
- [x] T027 [P] [US1] Create `useCheckSlug` hook with 300ms debounced query to `GET /api/orgs/check-slug` in `packages/domains/identity/src/ui/hooks/use-check-slug.ts`
- [x] T028 [P] [US1] Create `useUserOrganisations` TanStack Query hook for `GET /api/users/me/orgs` in `packages/domains/identity/src/ui/hooks/use-user-organisations.ts`
- [x] T029 [US1] Create `CreateOrganisationForm` component — react-hook-form with Zod resolver, name field (max 100), slug field with inline availability indicator, submit button, error display in `packages/domains/identity/src/ui/components/CreateOrganisationForm.tsx` (also mirrored in `apps/app/src/components/identity/CreateOrganisationForm.tsx` for Vite CJS compat)
- [x] T030 [US1] Create onboarding page — compose `CreateOrganisationForm`, handle success redirect to `/<org-slug>/dashboard`, require auth (redirect to login if not) in `apps/app/src/routes/onboarding/create-org.tsx`

**Checkpoint**: New users can create an org via the form. API endpoints functional. Onboarding page accessible.

---

## Phase 4: User Story 2 — Returning User Without Organization Is Blocked (Priority: P1)

**Goal**: Authenticated users with no organizations are always redirected to the onboarding form, regardless of which dashboard URL they try to access.

**Independent Test**: Create a user account (via WorkOS), skip org creation, sign out, sign back in → verify redirect to `/onboarding/create-org` when accessing any dashboard route.

### Tests for User Story 2

- [ ] T031 [P] [US2] Integration test `GET /api/users/me/orgs` — returns empty array for user with no orgs, returns orgs for user with orgs (tenancy boundary) in `apps/api/src/__tests__/get-user-organisations.spec.ts`

### Implementation for User Story 2

- [x] T032 [US2] Update `_authenticated.tsx` — add `beforeLoad` guard that calls `GET /api/users/me/orgs` via direct `fetch()` (not a React hook — `beforeLoad` runs outside component context), redirects to `/onboarding/create-org` if empty array returned in `apps/app/src/routes/_authenticated.tsx`
- [x] T033 [US2] Update `apps/app/src/lib/session.ts` — extend session context to track whether user has orgs (used by the routing guard). Note: org check is done directly in `beforeLoad` via fetch(); session.ts unchanged.

**Checkpoint**: Users without orgs cannot access any dashboard route. Always redirected to onboarding.

---

## Phase 5: User Story 3 — Returning User With Organization Goes to Dashboard (Priority: P2)

**Goal**: Users who already have an organization are routed directly to `/<org-slug>/dashboard` without seeing the onboarding form. All dashboard routes are scoped under the org slug.

**Independent Test**: Sign in as a user with an existing organization → verify landing on `/<org-slug>/dashboard` without onboarding form.

### Implementation for User Story 3

- [x] T034 [US3] Create `_authenticated/$orgSlug.tsx` layout route — capture `orgSlug` param, validate slug against user's orgs in `beforeLoad`, provide org context to child routes in `apps/app/src/routes/_authenticated/$orgSlug.tsx`
- [x] T035 [US3] Move existing dashboard index route to org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/index.tsx`
- [x] T036 [P] [US3] Move existing playbook routes under org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/` (index.tsx, new.tsx, $playbookId.tsx)
- [x] T037 [P] [US3] Move existing runs routes under org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/runs/` (index.tsx, start.tsx, $runId.tsx)
- [x] T038 [P] [US3] Move existing history routes under org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/history/` (index.tsx, $runId.tsx)
- [x] T039 [P] [US3] Move existing spec-library routes under org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/` (index.tsx, new.tsx, $specId.tsx)
- [x] T040 [P] [US3] Move existing settings routes under org-scoped path in `apps/app/src/routes/_authenticated/$orgSlug/settings/` (index.tsx, general.tsx, account.tsx, billing.tsx, members.tsx)
- [x] T041 [US3] Update `_authenticated.tsx` `beforeLoad` guard — if user has orgs, allow through (existing redirect logic from US2 handles no-org case); update root `/` navigation to redirect to `/<first-org-slug>/dashboard` in `apps/app/src/routes/_authenticated.tsx`
- [x] T042 [US3] Update `Sidebar` component — update navigation links to include `orgSlug` param in all route paths in `apps/app/src/components/layout/Sidebar.tsx` (sidebar is placeholder — no links to update yet)
- [x] T043 [US3] Update API query key factories — add `orgSlug` scope to relevant query keys in `apps/app/src/api/query-keys.ts`

**Checkpoint**: All dashboard routes scoped under `/<org-slug>/`. Users with orgs land directly on dashboard. Route restructuring complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: E2E test, validation, and cleanup across all stories.

- [ ] T044 E2E test: full onboarding flow — signup → org creation form → submit → dashboard redirect in `apps/app-e2e/`
- [ ] T045 E2E test: returning user with org → direct dashboard access (no onboarding detour) in `apps/app-e2e/`
- [ ] T046 Validate quickstart.md — walk through all steps in `specs/003-org-onboarding/quickstart.md` and verify accuracy
- [x] T047 Run full build and type check — `pnpm turbo run build typecheck test` and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — core org creation flow
- **US2 (Phase 4)**: Depends on Phase 3 (T025 `GET /api/users/me/orgs` route + T028 hook) — guard needs org-check endpoint
- **US3 (Phase 5)**: Depends on Phase 4 (guard logic) — extends routing with org-scoped URLs
- **Polish (Phase 6)**: Depends on Phases 3-5 completion

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2). Delivers: org creation form + API endpoints.
- **US2 (P1)**: Depends on US1's `GET /api/users/me/orgs` endpoint (T025) and `useUserOrganisations` hook (T028). Delivers: onboarding guard.
- **US3 (P2)**: Depends on US2's guard logic (T032). Delivers: org-scoped routing + redirect for existing users.

### Within Each User Story

- Tests written alongside implementation (not strictly TDD — test + impl can be parallel)
- Value objects and entities before use cases
- Use cases before API routes
- API routes before frontend hooks
- Hooks before components
- Components before route pages

### Parallel Opportunities

**Phase 1** (all parallel):
- T001, T002, T003, T004 can all run simultaneously

**Phase 2**:
- T007 + T008 + T012 + T015 can run in parallel (different files)
- T009 depends on T007 + T008
- T011 depends on T010
- T013 independent

**Phase 3 (US1)**:
- T017 + T018 + T019 + T020 (tests, parallel)
- T026 + T027 + T028 (hooks, parallel)
- T021 → T023 → T030 (sequential: use case → route → page)

**Phase 5 (US3)**:
- T036 + T037 + T038 + T039 + T040 (route moves, all parallel)

---

## Parallel Example: User Story 1

```bash
# Launch all tests in parallel:
Task: "Unit test OrganisationSlug in packages/domains/identity/src/entities/value-objects/organisation-slug.spec.ts"
Task: "Unit test createOrganisation in packages/domains/identity/src/use-cases/create-organisation.spec.ts"
Task: "Integration test POST /api/orgs in apps/api/src/__tests__/create-organisation.spec.ts"
Task: "Integration test GET /api/orgs/check-slug in apps/api/src/__tests__/check-slug.spec.ts"

# Launch all hooks in parallel:
Task: "Create useCreateOrganisation hook in packages/domains/identity/src/ui/hooks/use-create-organisation.ts"
Task: "Create useCheckSlug hook in packages/domains/identity/src/ui/hooks/use-check-slug.ts"
Task: "Create useUserOrganisations hook in packages/domains/identity/src/ui/hooks/use-user-organisations.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational (T007–T016)
3. Complete Phase 3: User Story 1 (T017–T030)
4. **STOP and VALIDATE**: New users can create an org and reach the dashboard
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Org creation works → Deploy/Demo (MVP!)
3. Add US2 → Onboarding guard enforced → Deploy/Demo
4. Add US3 → Org-scoped routing complete → Deploy/Demo
5. Polish → E2E tests pass, quickstart validated → Final deploy

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story
- US2 is small (2 tasks) because the heavy lifting is in US1's backend
- Route restructuring (US3) is the largest phase by file count but mechanically simple (move + rename)
- All `org_id` tenancy constraints maintained per constitution II
- Domain UI lives in `packages/domains/identity/src/ui/` per constitution IV
