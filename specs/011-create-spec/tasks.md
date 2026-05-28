# Tasks: Create Spec

**Input**: Design documents from `/specs/011-create-spec/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Constitution §Mandatory Per-Feature Deliverables requires error-path unit tests. Test tasks included.

**Organization**: Tasks grouped by user story. Backend foundation shared across US1+US2 (both P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — monorepo and database table already exist. Skipped.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, domain model, backend endpoints, and repository implementations that ALL user stories depend on.

**CRITICAL**: No user story UI work can begin until this phase is complete.

### Shared Layer

- [X] T001 [P] Register `AUTHOR_SPEC_NOT_FOUND` error code in `packages/shared/src/errors/codes.ts` following `DOMAIN_CATEGORY_SPECIFIC` taxonomy
- [X] T002 [P] Update `CreateLibrarySpecRequestSchema` in `packages/shared/src/schemas/specs.ts` to add `preconditions` (z.unknown optional), `description` (z.unknown optional), `testSteps` (z.array of `{ instruction: z.string().min(1), expectedOutcome: z.string().min(1) }` max 50, optional), and `expectedResult` (z.unknown optional)
- [X] T003 [P] Add `TestStepSchema` (z.object with instruction + expectedOutcome), `SystemsUnderTestResponseSchema`, and DTO types to `packages/shared/src/schemas/specs.ts`

### Domain Layer (Authoring)

- [X] T004 [P] Create `SpecTitle` value object in `packages/domains/authoring/src/entities/value-objects/spec-title.ts` — validates 1-500 chars, trimmed (pattern: /new-entity)
- [X] T005 [P] Create `Severity` value object in `packages/domains/authoring/src/entities/value-objects/severity.ts` — validates enum critical/high/medium/low, default medium (pattern: /new-entity)
- [X] T006 [P] Create `TestStep` value object in `packages/domains/authoring/src/entities/value-objects/test-step.ts` — validates non-empty instruction + expectedOutcome (pattern: /new-entity)
- [X] T007 [P] Add `AuthorSpecNotFoundError` class in `packages/domains/authoring/src/errors/index.ts` extending `DomainError` with 404 status (pattern: /new-entity)
- [X] T008 Update `SpecLibraryEntry` type in `packages/domains/authoring/src/types.ts` to include all missing fields: `systemUnderTest`, `preconditions`, `expectedResult`, `testerNotes`
- [X] T009 Create `SpecLibraryEntryEntity` in `packages/domains/authoring/src/entities/spec-library-entry.ts` with private constructor, `create()` (validates via VOs, normalises empty rich text to null, defaults severity to medium), and `reconstitute()` factories (pattern: /new-entity)
- [X] T010 Update `SpecLibraryRepository` port in `packages/domains/authoring/src/ports/spec-library-repository.ts` to add `findDistinctSystemsUnderTest(orgId: string): Promise<string[]>` method
- [X] T011 Implement `createLibrarySpec` use-case in `packages/domains/authoring/src/use-cases/create-library-spec.ts` — accepts `Deps` (specLibraryRepo) + `Command` (orgId, createdBy, title, optional fields), validates via entity `create()`, calls repo, returns `LibrarySpecDto`
- [X] T012 Re-export all new entities, VOs, use-cases, errors from `packages/domains/authoring/src/index.ts`

### Unit Tests (Domain)

- [X] T012a [P] Unit test SpecTitle VO in `packages/domains/authoring/src/entities/__tests__/spec-title.test.ts` — valid (1 char, 500 chars), invalid (empty, 501 chars, whitespace-only after trim)
- [X] T012b [P] Unit test Severity VO in `packages/domains/authoring/src/entities/__tests__/severity.test.ts` — valid (all 4 values), invalid (unknown string), default (undefined → medium)
- [X] T012c [P] Unit test TestStep VO in `packages/domains/authoring/src/entities/__tests__/test-step.test.ts` — valid pair, missing instruction, missing expectedOutcome, empty strings
- [X] T012d [P] Unit test SpecLibraryEntryEntity.create() in `packages/domains/authoring/src/entities/__tests__/spec-library-entry.test.ts` — minimal (title only, defaults severity), full fields, empty rich text → null normalisation, >50 test steps rejected
- [X] T012e [P] Unit test createLibrarySpec use-case in `packages/domains/authoring/src/use-cases/__tests__/create-library-spec.test.ts` — success path (repo.create called), propagates VO validation errors

### Domain Layer (Audit)

- [X] T013 Implement `appendChangelog` use-case in `packages/domains/audit/src/use-cases/record-changelog.ts` if not already implemented — accepts `Deps` (changelogRepo) + `Command` (orgId, entityType, entityId, action, actorId, actorName, fieldChanges?)

### Adapter Layer

- [X] T014 Implement `KyselySpecLibraryRepository.create()` in `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` — INSERT into spec_library with org_id tenancy, return entity via `reconstitute()` (pattern: /new-route)
- [X] T015 Implement `KyselySpecLibraryRepository.findById()` in `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` — SELECT with org_id + id, return entity or undefined
- [X] T016 Implement `KyselySpecLibraryRepository.findDistinctSystemsUnderTest()` in `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` — SELECT DISTINCT system_under_test WHERE org_id = ? AND system_under_test IS NOT NULL, ORDER BY alphabetically
- [X] T017 Implement `KyselyChangelogRepository.append()` in `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` if not already implemented — INSERT into changelog with all fields

### API Layer

- [X] T018 Implement `POST /api/orgs/:orgSlug/specs` route handler in `apps/api/src/routes/authoring.ts` — orgScopeMiddleware, role check (admin/owner or throw AuthRoleInsufficientError), Zod validation, call createLibrarySpec + appendChangelog, getSpan attributes (spec.id, org.slug), return 201 (pattern: /new-route)
- [X] T019 Implement `GET /api/orgs/:orgSlug/specs/:specId` route handler in `apps/api/src/routes/authoring.ts` — orgScopeMiddleware, role check, call findById or throw AuthorSpecNotFoundError, return 200 (pattern: /new-route)
- [X] T020 Implement `GET /api/orgs/:orgSlug/specs/systems-under-test` route handler in `apps/api/src/routes/authoring.ts` — orgScopeMiddleware, role check, call findDistinctSystemsUnderTest, return `{ systems: string[] }` (pattern: /new-route)
- [X] T021 Wire any new dependencies in `apps/api/src/composition-root.ts` (changelog repo if newly implemented)

### Integration Tests (API)

- [X] T021a [P] Integration test POST /api/orgs/:orgSlug/specs in `apps/api/src/routes/__tests__/authoring-specs.spec.ts` — 201 with valid body, 400 with empty title, 400 with >50 test steps, 403 for member role
- [X] T021b [P] Integration test GET /api/orgs/:orgSlug/specs/:specId in `apps/api/src/routes/__tests__/authoring-specs.spec.ts` — 200 for existing spec, 404 with AUTHOR_SPEC_NOT_FOUND for invalid UUID, 403 for member role
- [X] T021c [P] Integration test GET /api/orgs/:orgSlug/specs/systems-under-test in `apps/api/src/routes/__tests__/authoring-specs.spec.ts` — 200 with sorted distinct values, 200 with empty array when no specs

**Checkpoint**: All backend endpoints functional and tested. Can test via curl/Postman. User story UI work can begin.

---

## Phase 3: User Story 1 - Create a Minimal Spec (Priority: P1) MVP

**Goal**: Admin can create a spec with just a title, see it on a detail page with correct defaults (severity: medium).

**Independent Test**: Navigate to new spec form, enter title, submit, verify redirect to detail page showing title + severity "medium".

### Implementation for User Story 1

- [X] T022 [P] [US1] Create `useCreateSpec` mutation hook in `packages/domains/authoring/src/ui/hooks/use-create-spec.ts` — accepts `apiUrl`, `getAccessToken`, `orgSlug`, `invalidateKeys`; POSTs to `/api/orgs/:orgSlug/specs`; returns mutation object
- [X] T023 [P] [US1] Create `useSpecDetail` query hook in `packages/domains/authoring/src/ui/hooks/use-spec-detail.ts` — accepts `apiUrl`, `getAccessToken`, `orgSlug`, `specId`, `queryKey`; GETs `/api/orgs/:orgSlug/specs/:specId`
- [X] T024 [US1] Create `CreateSpecForm` component in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` — react-hook-form + zodResolver with CreateLibrarySpecRequestSchema, title field with character counter (max 500), severity select (defaulting to medium), submit button disabled when title empty, `onSuccess` callback for navigation
- [X] T025 [US1] Create `SpecDetail` component in `packages/domains/authoring/src/ui/components/SpecDetail.tsx` — read-only view rendering all spec fields (title, severity, system under test, rich text fields via TipTap read-only, test steps list, tester notes); handles null fields gracefully
- [X] T026 [US1] Wire `new.tsx` route in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/new.tsx` — compose CreateSpecForm, pass `specKeys` from `apps/app/src/api/query-keys.ts`, navigate to detail page on success with toast
- [X] T027 [US1] Wire `$specId.tsx` route in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx` — compose SpecDetail, pass `specKeys.detail()` query key
- [X] T028 [US1] Re-export all hooks and components from `packages/domains/authoring/src/ui/index.ts`

**Checkpoint**: Admin can create a minimal spec (title only) and see the detail page. Severity defaults to medium. Changelog recorded.

---

## Phase 4: User Story 2 - Create a Fully Configured Spec (Priority: P1)

**Goal**: Admin can fill in all fields including rich text (TipTap), system under test combobox, test steps, and tester notes.

**Independent Test**: Fill every field, submit, verify detail page renders all content including formatted rich text and ordered test steps.

### Implementation for User Story 2

- [X] T029 [P] [US2] Create `useSystemsUnderTest` query hook in `packages/domains/authoring/src/ui/hooks/use-systems-under-test.ts` — accepts `apiUrl`, `getAccessToken`, `orgSlug`, `queryKey`; GETs `/api/orgs/:orgSlug/specs/systems-under-test`
- [X] T030 [P] [US2] Create `SystemUnderTestCombobox` component in `packages/domains/authoring/src/ui/components/SystemUnderTestCombobox.tsx` — accepts suggestions array + onChange; filters as user types; allows free-text entry for new values
- [X] T031 [US2] Add TipTap rich text editor fields to `CreateSpecForm` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` — preconditions, description, expected result; each with TipTap editor instance; empty editors normalised on submit
- [X] T032 [US2] Add test step input section to `CreateSpecForm` — "Add step" button, each step with instruction + expected outcome text inputs; step numbering from array index; inline validation (both fields required when step present)
- [X] T033 [US2] Add system under test combobox and tester notes textarea to `CreateSpecForm`
- [X] T034 [US2] Extend submit button disabled state in `CreateSpecForm` to also check: all present test steps have both instruction and expected outcome filled
- [X] T035 [US2] Update `SpecDetail` component to render TipTap rich text fields using TipTap read-only mode (no dangerouslySetInnerHTML)
- [X] T036 [US2] Add `specKeys.systemsUnderTest(orgSlug)` to `apps/app/src/api/query-keys.ts` and pass to combobox hook in `new.tsx` route
- [X] T037 [US2] Re-export new components from `packages/domains/authoring/src/ui/index.ts`

**Checkpoint**: Admin can create a fully configured spec with all fields. Rich text round-trips correctly. System under test combobox shows suggestions.

---

## Phase 5: User Story 3 - Manage Ordered Test Steps (Priority: P2)

**Goal**: Admin can add, remove, and reorder test steps via drag-and-drop. Max 50 steps enforced.

**Independent Test**: Add 3 steps, drag step 3 to position 1, remove step 2, submit, verify detail page shows correct order.

### Implementation for User Story 3

- [X] T038 [US3] Extract `TestStepList` component in `packages/domains/authoring/src/ui/components/TestStepList.tsx` — drag-and-drop sortable list (e.g., @dnd-kit/sortable), step number auto-recalculation from array index, remove button per step
- [X] T039 [US3] Integrate `TestStepList` into `CreateSpecForm` replacing the basic step inputs from T032
- [X] T040 [US3] Enforce 50-step maximum in `TestStepList` — disable "Add step" button at 50, show message
- [X] T041 [US3] Add inline validation to `TestStepList` — show error on expected outcome field when instruction is filled but expected outcome is empty (on blur or submit attempt)

**Checkpoint**: Test steps are fully manageable with drag-and-drop, validation, and max limit.

---

## Phase 6: User Story 4 - Unauthorised Access Prevention (Priority: P2)

**Goal**: Member-role users are denied access to spec library routes at both frontend and backend layers.

**Independent Test**: Log in as Member, navigate to /spec-library/new, verify redirect or access denied message.

### Implementation for User Story 4

- [X] T042 [US4] Add role guard in `beforeLoad` of `apps/app/src/routes/_authenticated/$orgSlug/spec-library/new.tsx` — check orgContext.role, redirect Members to dashboard or show access denied
- [X] T043 [US4] Add role guard in `beforeLoad` of `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx` — same pattern as T042

**Checkpoint**: Members cannot access spec library pages. Backend already enforces via role check in T018/T019/T020.

---

## Phase 7: User Story 5 - Resilient Form Behaviour (Priority: P3)

**Goal**: Form state preserved on network errors and recoverable after session expiry.

**Independent Test**: Fill form, simulate network error, verify toast + data intact. Fill form, let session expire, re-auth, verify data restored.

### Implementation for User Story 5

- [X] T044 [US5] Add error toast on mutation failure in `CreateSpecForm` — use `onError` callback to display error message, form state naturally preserved by React
- [X] T045 [US5] Add `sessionStorage` auto-save to `CreateSpecForm` — debounced save on field changes (500ms), restore on mount if data exists, clear on successful submit

**Checkpoint**: Form is resilient to network errors and session expiry.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories.

- [X] T046 Verify all 3 route handlers in `apps/api/src/routes/authoring.ts` use `getSpan(request)` for OTel custom attributes (`spec.id`, `org.slug`, `user.id`)
- [X] T047 Verify `AUTHOR_SPEC_NOT_FOUND` error code is used in GET /:specId handler (no ad-hoc string errors)
- [X] T047a Verify all domain error paths have unit test coverage — SpecTitle/Severity/TestStep validation failures, AuthorSpecNotFoundError thrown by GET handler, role-insufficient 403 from all 3 routes
- [X] T048 Run `pnpm turbo run build typecheck test` to confirm all packages compile and pass
- [X] T049 Run quickstart.md verification checklist to validate all acceptance criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — project already initialised
- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories.
- **User Stories (Phase 3-7)**: All depend on Phase 2 completion
  - US1 (Phase 3): No dependencies on other stories
  - US2 (Phase 4): Depends on US1 (extends CreateSpecForm + SpecDetail)
  - US3 (Phase 5): Depends on US2 (replaces test step inputs with sortable list)
  - US4 (Phase 6): Independent — can run in parallel with US2/US3
  - US5 (Phase 7): Depends on US1 (adds to CreateSpecForm)
- **Polish (Phase 8)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: Foundation only — MVP slice
- **US2 (P1)**: US1 (extends the form and detail components)
- **US3 (P2)**: US2 (replaces basic step inputs)
- **US4 (P2)**: Foundation only — can parallel with US2/US3/US5
- **US5 (P3)**: US1 (adds persistence to form)

### Within Phase 2 (Foundational)

- T001-T003 (shared layer) can run in parallel
- T004-T007 (VOs + errors) can run in parallel, depend on T001
- T008-T012 (entity + use-case + exports) depend on T004-T007
- T012a-T012e (unit tests) depend on T004-T011 (test what they implement), can run in parallel with each other
- T013 (audit) can run in parallel with T008-T012
- T014-T017 (repos) depend on T008-T010
- T018-T020 (routes) depend on T011, T014-T017
- T021 (composition root) depends on T017
- T021a-T021c (integration tests) depend on T018-T021 (test the wired routes)

### Parallel Opportunities

```text
# Phase 2 — Parallel group 1 (shared + VOs):
T001, T002, T003, T004, T005, T006, T007

# Phase 2 — Parallel group 2 (unit tests, once VOs + entity done):
T012a, T012b, T012c, T012d, T012e

# Phase 2 — Parallel group 3 (repos, once entity done):
T014, T015, T016, T017

# Phase 2 — Parallel group 4 (integration tests, once routes wired):
T021a, T021b, T021c

# Phase 3 — Parallel group (hooks):
T022, T023

# Phase 4 — Parallel group (combobox + hook):
T029, T030

# Phase 6 — Parallel with Phase 4/5 (independent):
T042, T043
```

---

## Parallel Example: Foundation Phase

```text
# Launch shared layer + value objects in parallel:
T001: Register AUTHOR_SPEC_NOT_FOUND error code
T002: Update CreateLibrarySpecRequestSchema
T003: Add TestStepSchema + DTO types
T004: Create SpecTitle value object
T005: Create Severity value object
T006: Create TestStep value object
T007: Add AuthorSpecNotFoundError class

# Then entity + use-case (sequential):
T008: Update SpecLibraryEntry type
T009: Create SpecLibraryEntryEntity
T010: Update SpecLibraryRepository port
T011: Implement createLibrarySpec use-case
T012: Re-export from index.ts

# Then unit tests (parallel):
T012a-T012e: VO + entity + use-case tests

# Then repos + routes (sequential):
T014-T017: Implement Kysely repos
T018-T020: Implement route handlers
T021: Wire composition root

# Then integration tests (parallel):
T021a-T021c: Route integration tests
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (all backend)
2. Complete Phase 3: User Story 1 (basic form + detail page)
3. **STOP and VALIDATE**: Create a spec with title only, verify detail page
4. Deploy/demo if ready — core value delivered

### Incremental Delivery

1. Foundation → Backend complete
2. Add US1 → Minimal creation flow (MVP!)
3. Add US2 → Rich text + combobox + all fields
4. Add US3 → Drag-and-drop test steps
5. Add US4 → Role guards (can be done earlier in parallel)
6. Add US5 → Form resilience
7. Polish → OTel, error verification, build check

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundation together
2. Once Foundation done:
   - Developer A: US1 → US2 → US3 (form progression)
   - Developer B: US4 (role guards, independent)
   - Developer C: US5 (form resilience, after US1 merges)
3. All stories integrate cleanly — shared backend, independent UI layers

---

## Notes

- No migration needed — `spec_library` and `changelog` tables already exist
- TipTap is a new frontend dependency — will need `@tiptap/react`, `@tiptap/starter-kit` packages
- Drag-and-drop (US3) will need `@dnd-kit/core` + `@dnd-kit/sortable` packages
- Backend role check is in every route handler (T018-T020), not a separate middleware
- Changelog integration uses API-layer orchestration (route handler calls both domains)
- Query keys: use existing `specKeys` factory in `apps/app/src/api/query-keys.ts`; add `systemsUnderTest` key in T036
