# Tasks: User Settings Page

**Input**: Design documents from `/specs/007-user-settings/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Register new error codes and update shared Zod schemas before any domain/adapter work begins.

- [x] T001 [P] Register error codes `AUTH_USER_FIRST_NAME_INVALID`, `AUTH_USER_LAST_NAME_INVALID`, `AUTH_USER_NOT_FOUND` in `packages/shared/src/errors/codes.ts`
- [x] T002 [P] Update `packages/shared/src/schemas/auth.ts`: replace `UpdateDisplayNameRequestSchema` with `UpdateUserProfileRequestSchema` (firstName: trim, min 1, max 50; lastName: trim, min 1, max 50) AND update `SessionUserSchema` to replace `displayName` with `firstName` and `lastName` (both optional strings)
- [x] T003 [P] Update `OrgMemberResponseSchema` to replace `displayName` with `firstName` and `lastName` (both nullable strings) in `packages/shared/src/schemas/organisation.ts`
- [x] T004 Update type exports in `packages/shared/src/types/index.ts` and `packages/shared/src/index.ts` to replace `UpdateDisplayNameRequest` with `UpdateUserProfileRequest`

---

## Phase 2: Foundational (Blocking Prerequisites — includes US5: Schema Migration)

**Purpose**: Database migration, Kysely schema, value objects, entity, ports, adapters — MUST complete before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Database & Schema

- [x] T006 Create migration `packages/db/src/migrations/002_user_first_last_name.ts`: add `first_name` and `last_name` TEXT columns, backfill `first_name` from `display_name`, drop `display_name` (pattern: /project:migrate)
- [x] T007 Update `UsersTable` interface in `packages/db/src/schema.ts`: replace `display_name: string | null` with `first_name: string | null` and `last_name: string | null`

### Domain Layer — Value Objects & Entity

- [x] T008 [P] Create `FirstName` value object in `packages/domains/identity/src/entities/value-objects/first-name.ts` (private constructor, `.create()` validates non-empty after trim + max 50 chars, throws `AuthUserFirstNameInvalidError`) (pattern: /project:new-entity)
- [x] T009 [P] Create `LastName` value object in `packages/domains/identity/src/entities/value-objects/last-name.ts` (private constructor, `.create()` validates non-empty after trim + max 50 chars, throws `AuthUserLastNameInvalidError`) (pattern: /project:new-entity)
- [x] T010 [P] Create domain error classes `AuthUserFirstNameInvalidError`, `AuthUserLastNameInvalidError`, `AuthUserNotFoundError` in `packages/domains/identity/src/errors/index.ts`
- [x] T011 Delete `packages/domains/identity/src/entities/value-objects/display-name.ts` and remove its export from `packages/domains/identity/src/entities/value-objects/index.ts`; add exports for `FirstName` and `LastName`
- [x] T012 Update `UserEntity` in `packages/domains/identity/src/entities/user.ts`: replace `displayName: DisplayName | null` with `firstName: FirstName | null` and `lastName: LastName | null`; update `create()`, `reconstitute()`, and `updateProfile()` methods

### Domain Layer — Ports

- [x] T013 [P] Update `UserRepository` interface in `packages/domains/identity/src/ports/repositories.ts`: replace `displayName` with `firstName`/`lastName` in `upsertByWorkosId()` and `update()` signatures
- [x] T014 [P] Update `MemberWithUserDto` in `packages/domains/identity/src/ports/membership-repository.ts`: replace `displayName: string | null` with `firstName: string | null` and `lastName: string | null`

### Infrastructure Adapters

- [x] T015 Update `KyselyUserRepository` in `apps/api/src/adapters/repositories/kysely-user-repository.ts`: replace all `display_name` references with `first_name`/`last_name`; update `toEntity()` to use `FirstName`/`LastName` value objects; update `upsertByWorkosId()` and `update()` implementations
- [x] T016 Update `KyselyMembershipRepository` in `apps/api/src/adapters/repositories/kysely-membership-repository.ts`: update `findMembersWithUsers()` to SELECT `u.first_name, u.last_name`, update ORDER BY, update DTO mapping
- [x] T017 Update `AuthUser` interface in `apps/api/src/shared/middleware/auth.ts`: replace `displayName?: string` with `firstName?: string` and `lastName?: string`

### Domain Exports

- [x] T018 Update barrel exports in `packages/domains/identity/src/index.ts` to export new value objects, errors, and (upcoming) use case

### Unit Tests — Foundational

- [x] T019 [P] Write unit tests for `FirstName` value object in `packages/domains/identity/src/entities/__tests__/first-name.test.ts` (valid creation, empty rejection, whitespace rejection, max length rejection, equality, toString)
- [x] T020 [P] Write unit tests for `LastName` value object in `packages/domains/identity/src/entities/__tests__/last-name.test.ts` (same cases as FirstName)
- [x] T021 Update `UserEntity` tests in `packages/domains/identity/src/entities/__tests__/user.test.ts`: replace all `displayName`/`DisplayName` references with `firstName`/`lastName`/`FirstName`/`LastName`
- [x] T022 Delete `packages/domains/identity/src/entities/__tests__/display-name.test.ts`

**Checkpoint**: Database migrated, schema updated, domain layer fully converted from `displayName` to `firstName`/`lastName`. Build and typecheck should pass.

---

## Phase 3: User Story 4 — Capture First and Last Name at Signup (Priority: P1)

**Goal**: Update the signup/user-resolution flow to store `firstName` and `lastName` separately from WorkOS profile instead of concatenating into `displayName`.

**Independent Test**: Complete a signup flow and verify that `first_name` and `last_name` are stored as separate fields in the database.

### Implementation for US4

- [x] T023 [US4] Update `resolveUserFromJwt` use case in `packages/domains/identity/src/use-cases/resolve-user-from-jwt.ts`: replace `displayName` concatenation (line 44) with separate `firstName`/`lastName` from `profile.firstName`/`profile.lastName`; update `ResolveUserFromJwtOutput` to return `firstName`/`lastName` instead of `displayName`; update `toOutput()` mapper
- [x] T024 [US4] Update `syncUserFromJwt` use case in `packages/domains/identity/src/use-cases/sync-user-from-jwt.ts`: replace `displayName` param with `firstName`/`lastName`
- [x] T025 [US4] Update members response in `apps/api/src/routes/identity.ts` (GET `/api/orgs/:orgSlug/members`): replace `displayName: m.displayName` with `firstName: m.firstName, lastName: m.lastName`
- [x] T026 [US4] Update `MembersList.tsx` in `packages/domains/identity/src/ui/components/MembersList.tsx`: display `firstName + lastName` (with fallback to email when both null); use `firstName` only when `lastName` is null

### Tests for US4

- [x] T027 [US4] Update `resolveUserFromJwt` tests in `packages/domains/identity/src/use-cases/__tests__/resolve-user-from-jwt.test.ts`: update mock data and assertions for `firstName`/`lastName` instead of `displayName`
- [x] T028 [US4] Update `listOrgMembers` tests in `packages/domains/identity/src/use-cases/__tests__/list-org-members.test.ts`: update mock data for `firstName`/`lastName`
- [x] T029 [US4] Update identity route integration tests in `apps/api/src/routes/identity.spec.ts`: update mock data and assertions for members endpoint response

**Checkpoint**: Signup flow stores first/last name separately. Members list displays correctly. All existing tests pass with updated data shapes.

---

## Phase 4: User Stories 1 & 2 — Update Name + View Profile (Priority: P1) 🎯 MVP

**Goal**: Implement the User Settings page at `/$orgSlug/settings/account` where users can view their email (read-only) and edit their first/last name.

**Independent Test**: Navigate to `/$orgSlug/settings/account`, verify current name and email display. Edit first and last name, save, confirm updated values persist on reload.

### Backend — Use Case & Route

- [x] T030 [US1] Create `updateUserProfile` use case in `packages/domains/identity/src/use-cases/update-user-profile.ts`: accepts `{ userId, firstName, lastName }`, calls `userRepo.findById()` to verify user exists (throws `AuthUserNotFoundError` if missing), validates via value objects, calls `userRepo.update()`, returns DTO with `{ id, email, firstName, lastName, updatedAt }` (pattern: /project:new-route)
- [x] T031 [US2] Update `GET /api/users/me` route handler in `apps/api/src/routes/identity.ts`: replace `getCurrentUser` (which returns WorkOS profile) with `resolveUserFromJwt` to return local DB `firstName`/`lastName` and `email` — the local DB is authoritative for names after signup
- [x] T032 [US1] Implement `PATCH /api/users/me` route handler in `apps/api/src/routes/identity.ts`: replace 501 stub with `authMiddleware` → validate `UpdateUserProfileRequestSchema` → resolve internal user → call `updateUserProfile` → respond 200 with updated profile
- [x] T033 [US1] Wire `updateUserProfile` use case import in `apps/api/src/routes/identity.ts` and export from `packages/domains/identity/src/index.ts`

### Frontend — Query Keys, Hook, Component, Route

- [x] T034 [P] [US2] Add `userKeys` to `apps/app/src/api/query-keys.ts`: `me: () => ['user', 'me'] as const`
- [x] T035 [P] [US1] Create `useUpdateUserProfile` mutation hook in `packages/domains/identity/src/ui/hooks/use-update-user-profile.ts`: accepts `{ apiUrl, getAccessToken, invalidateKeys }` options; calls `PATCH /api/users/me` with `{ firstName, lastName }`; invalidates `invalidateKeys` on success
- [x] T036 [US1] Create `AccountSettingsForm` component in `packages/domains/identity/src/ui/components/AccountSettingsForm.tsx`: react-hook-form with `UpdateUserProfileRequestSchema` resolver; fields for firstName, lastName (editable), email (read-only); save button disabled when pristine or submitting; success/error feedback inline
- [x] T037 [US1] Compose `AccountSettingsForm` into `apps/app/src/routes/_authenticated/$orgSlug/settings/account.tsx`: fetch current user via `GET /api/users/me`, pass data as defaultValues; pass `userKeys.me()` as `invalidateKeys` to mutation hook

### Tests for US1 & US2

- [x] T038 [US1] Write unit tests for `updateUserProfile` use case in `packages/domains/identity/src/use-cases/__tests__/update-user-profile.test.ts`: happy path, empty firstName error, empty lastName error, whitespace-only rejection, max length rejection, user not found error
- [x] T039 [US1] Write route integration test for `PATCH /api/users/me` in `apps/api/src/routes/identity.spec.ts`: valid update → 200, empty firstName → 400 with `AUTH_USER_FIRST_NAME_INVALID`, empty lastName → 400 with `AUTH_USER_LAST_NAME_INVALID`, no auth → 401

**Checkpoint**: User Settings page fully functional — users can view profile info and update first/last name. Changes reflect immediately. All validation works.

---

## Phase 5: User Story 3 — Email & Password Change Guidance (Priority: P2)

**Goal**: Add an "Email & Password" section to the Account Settings page with explanatory text and a "View guide" button linking to releasepilot.io.

**Independent Test**: Navigate to `/$orgSlug/settings/account`, verify the Email & Password section is visible with a "View guide" button that opens the releasepilot.io guide in a new tab.

### Implementation for US3

- [x] T040 [US3] Add Email & Password guidance section to `AccountSettingsForm` component in `packages/domains/identity/src/ui/components/AccountSettingsForm.tsx`: heading "Email & Password", explanatory text "Learn how to update your email address or password", "View guide" button/link with `target="_blank"` and `rel="noopener noreferrer"` pointing to a configurable guide URL (passed as prop)
- [x] T041 [US3] Pass guide URL from `apps/app/src/routes/_authenticated/$orgSlug/settings/account.tsx` to `AccountSettingsForm` (use `import.meta.env.VITE_WEB_URL` + `/docs/account/email-password` as default path)

**Checkpoint**: Full Account Settings page complete — name editing, profile viewing, and email/password guidance all functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, verification, and documentation updates.

- [x] T042 [P] Update specs documentation: update `specs/005-org-members-list/data-model.md` and `specs/005-org-members-list/contracts/api.md` to reference `first_name`/`last_name` instead of `display_name`
- [x] T043 Verify all new error paths use domain-specific error codes from `packages/shared` (no ad-hoc string errors) — check `FirstName.create()`, `LastName.create()`, `updateUserProfile`, `PATCH /api/users/me` handler
- [x] T044 Verify OTel span attributes on `PATCH /api/users/me` route handler — confirm `getSpan(request)` adds `user.workos_id` attribute
- [x] T045 Run full build and test suite: `pnpm turbo run build typecheck test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001–T004) — BLOCKS all user stories
- **US4 (Phase 3)**: Depends on Foundational completion
- **US1 & US2 (Phase 4)**: Depends on Foundational completion; can run in parallel with US4
- **US3 (Phase 5)**: Depends on US1 & US2 (adds to the same component)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US5 (Migration)**: Embedded in Foundational phase — prerequisite for everything
- **US4 (Signup Flow)**: Can start after Foundational — independent of US1/US2/US3
- **US1 & US2 (Settings Page)**: Can start after Foundational — independent of US4
- **US3 (Email Guidance)**: Depends on US1 & US2 (adds a section to the same component)

### Within Each Phase

- Models/value objects before entity
- Entity before ports
- Ports before adapters
- Adapters before use cases
- Use cases before route handlers
- Backend before frontend
- Component before route composition

### Parallel Opportunities

- T001–T004 (Setup) can all run in parallel
- T008–T010 (value objects + errors) can run in parallel after T006–T007
- T013–T014 (ports) can run in parallel
- T019–T020 (value object tests) can run in parallel
- T034–T035 (query keys + mutation hook) can run in parallel
- US4 (Phase 3) and US1/US2 (Phase 4) can run in parallel after Foundational

---

## Parallel Example: Foundational Phase

```
# After T006–T007 (migration + schema), launch in parallel:
T008: Create FirstName value object
T009: Create LastName value object
T010: Create domain error classes

# After value objects complete, launch in parallel:
T013: Update UserRepository port
T014: Update MemberWithUserDto port
T019: Write FirstName tests
T020: Write LastName tests
```

## Parallel Example: Phase 4 (US1 & US2)

```
# After backend (T030–T033), launch in parallel:
T034: Add userKeys to query-keys.ts
T035: Create useUpdateUserProfile hook

# After hook ready:
T036: Create AccountSettingsForm component
T037: Compose into account.tsx route
```

---

## Implementation Strategy

### MVP First (US5 + US4 + US1/US2)

1. Complete Phase 1: Setup (error codes, schemas)
2. Complete Phase 2: Foundational (migration, domain layer conversion)
3. Complete Phase 3: US4 (signup flow stores names separately)
4. Complete Phase 4: US1 & US2 (settings page — view + edit)
5. **STOP and VALIDATE**: Full name editing works end-to-end
6. Complete Phase 5: US3 (email/password guidance — quick addition)

### Incremental Delivery

1. Setup + Foundational → Schema migrated, domain converted (build passes)
2. Add US4 → Signup stores first/last name (verify via DB inspection)
3. Add US1 & US2 → Settings page functional (full MVP!)
4. Add US3 → Email guidance section added (complete feature)
5. Polish → Documentation, verification, cleanup

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Test file naming: `.test.ts` for `packages/domains/*`, `.spec.ts` for `apps/api` and `apps/app`
- Domain UI components go in `packages/domains/identity/src/ui/`, NOT in `apps/app/src/`
- Query keys MUST be in `apps/app/src/api/query-keys.ts` — no inline string keys
- Domain hooks MUST accept `queryKey`/`invalidateKeys` as params — cannot import from `apps/app`
