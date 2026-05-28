# Tasks: Edit Spec

**Input**: Design documents from `/specs/023-edit-spec/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Constitution-mandated error-path unit tests and integration tests included per Mandatory Per-Feature Deliverables.

**Organization**: Tasks grouped by user story. US4 (test steps) and US5 (artifact requirements) are covered by form extraction in US1 — the shared `SpecForm` inherits all behavior from `CreateSpecForm`. US6 (member access restriction) is distributed across US1/US2 tasks (role checks are built into each entry point). US7 (archived spec protection) is built into the edit route and PUT handler.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No new packages, migrations, or project structure changes required. This phase is empty.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared schema changes, use case, and API route that ALL user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 [P] Add `UpdateLibrarySpecRequestSchema` and extend `SPEC_HISTORY_ACTIONS` with 6 new actions (`system_under_test_changed`, `severity_changed`, `preconditions_updated`, `test_steps_updated`, `expected_result_updated`, `tester_notes_updated`) in `packages/shared/src/schemas/specs.ts`. Export `UpdateLibrarySpecRequestSchema` type from `packages/shared/src/index.ts`
- [x] T001a [P] Verify `AUTH_ROLE_INSUFFICIENT` error code exists in `packages/shared/src/errors/codes.ts` and `AuthRoleInsufficientError` class exists in `packages/domains/identity/src/errors/`. If missing, register the error code and create the class extending `DomainError` with status 403. Export from `packages/domains/identity/src/index.ts` (pattern: /project:new-entity)
- [x] T002 [P] Extend `SpecSnapshot` interface with 6 new fields (`systemUnderTest`, `severity`, `preconditions`, `testSteps`, `expectedResult`, `testerNotes`) and add detection logic for each in `detectFieldChanges` function in `packages/domains/audit/src/use-cases/record-spec-changes.ts`. For JSONB fields (`preconditions`, `testSteps`, `expectedResult`) use `JSON.stringify` comparison. For string fields (`systemUnderTest`, `severity`, `testerNotes`) use direct comparison. No `fieldChanges` detail for JSONB/text fields — only for `system_under_test_changed` and `severity_changed`
- [x] T003 [P] Extend `describeHistoryAction` with display strings for 6 new action types in `packages/domains/authoring/src/ui/lib/describe-history-action.ts`. For `system_under_test_changed` and `severity_changed`, show old/new values from `fieldChanges`. For others, show descriptive text only (e.g., "updated preconditions", "updated test steps")
- [x] T004 Create `updateLibrarySpec` use case in `packages/domains/authoring/src/use-cases/update-library-spec.ts`. Define `UpdateLibrarySpecDeps` (needs `specLibraryRepo: SpecLibraryRepository`) and `UpdateLibrarySpecCommand` (same fields as create minus `id`, `orgId`, `createdBy` — these are path/context params). Use case: validate via entity, call `specLibraryRepo.update(id, orgId, data)`, return `LibrarySpec` DTO. Export from `packages/domains/authoring/src/index.ts` (pattern: /project:new-route)
- [x] T005 Add `PUT /api/orgs/:orgSlug/specs/:specId` route handler in `apps/api/src/routes/authoring.ts`. Middleware: `orgScopeMiddleware`. Handler: (1) check `request.orgContext.role` is admin or owner — throw `AuthRoleInsufficientError` if member (FR-020), (2) validate body with `UpdateLibrarySpecRequestSchema`, (3) fetch existing spec — throw `AuthorSpecNotFoundError` if not found, (4) throw `AuthorSpecArchivedError` if `isArchived` (FR-016/US7), (5) build old `SpecSnapshot` from existing spec, (6) call `updateLibrarySpec` use case, (7) build new `SpecSnapshot` from result, (8) call `recordSpecChanges` with old/new snapshots, (9) return 200 with updated spec. Add OTel span attributes: `org.slug`, `spec.id` (pattern: /project:new-route)

- [x] T005a [P] Create unit tests for `updateLibrarySpec` use case in `packages/domains/authoring/src/use-cases/__tests__/update-library-spec.test.ts`. Test: (1) successful update returns DTO, (2) spec not found throws `AuthorSpecNotFoundError`, (3) archived spec throws `AuthorSpecArchivedError`, (4) invalid title throws `AuthorSpecTitleInvalidError`. Mock `specLibraryRepo` via `vi.fn()`
- [x] T005b [P] Create unit tests for extended `detectFieldChanges` in `packages/domains/audit/src/use-cases/__tests__/record-spec-changes.test.ts`. Test: (1) `system_under_test_changed` detected with old/new values, (2) `severity_changed` detected with old/new values, (3) `preconditions_updated` detected via JSON comparison, (4) `test_steps_updated` detected via JSON comparison, (5) `expected_result_updated` detected, (6) `tester_notes_updated` detected, (7) no entries when snapshots are identical (no-op), (8) existing artifact detection still works
- [x] T005c [P] Create integration test for PUT `/api/orgs/:orgSlug/specs/:specId` in `apps/api/src/routes/authoring.spec.ts`. Test: (1) 200 on valid admin update, (2) 403 with `AUTH_ROLE_INSUFFICIENT` when member calls endpoint, (3) 404 with `AUTHOR_SPEC_NOT_FOUND` for non-existent spec, (4) 403 with `AUTHOR_SPEC_ARCHIVED` for archived spec, (5) 400 on invalid body. Use `buildApp()` + `app.inject()` pattern with mocked repos

**Checkpoint**: Foundation ready — shared schemas extended, use case created, API endpoint available, error-path tests passing.

---

## Phase 3: User Story 1 — Edit Spec from Detail Page (Priority: P1) MVP

**Goal**: Admin clicks "Edit spec" on a spec detail page, edits fields in a pre-populated form, saves, and is redirected to the detail page with updated values and history entries.

**Independent Test**: Create a spec, navigate to detail page, click "Edit spec", change title, save. Verify detail page shows new title and history tab shows "changed title" entry.

### Implementation for User Story 1

- [x] T006 [US1] Extract shared `SpecForm` component from existing `CreateSpecForm` into `packages/domains/authoring/src/ui/components/SpecForm.tsx`. Props: `initialValues` (optional, for edit mode), `onSubmit` (callback receiving form data), `onCancel` (optional callback — renders a Cancel button next to Submit when provided), `submitLabel` (string, e.g., "Create" or "Save"), `isSubmitting` (boolean), `orgSlug` (for suggestions queries), `storageKey` (optional, for session draft recovery), `systemSuggestions` (string array), `tagsQueryKey` (readonly unknown array). Move ALL form logic (validation, test step management, artifact requirements, rich text editors, drag-and-drop) into this component. Export from `packages/domains/authoring/src/ui/index.ts`
- [x] T007 [US1] Refactor `CreateSpecForm` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` as a thin wrapper around `SpecForm`. Pass `submitLabel="Create"`, `onSubmit` calling `useCreateSpec` mutation, `storageKey` for draft recovery, and no `initialValues`. Verify existing create spec flow still works after refactor
- [x] T008 [P] [US1] Create `useUpdateSpec` mutation hook in `packages/domains/authoring/src/ui/hooks/use-update-spec.ts`. Use `useApiMutation` for `PUT /api/orgs/{orgSlug}/specs/{specId}`. Accept `orgSlug`, `specId`, and `invalidateKeys` as parameters. Export from `packages/domains/authoring/src/ui/index.ts`
- [x] T009 [US1] Create `EditSpecForm` component in `packages/domains/authoring/src/ui/components/EditSpecForm.tsx`. Props: `orgSlug`, `specId`, `initialValues` (the existing spec data), `invalidateKeys`, `onSuccess` callback. Wraps `SpecForm` with `submitLabel="Save"`, calls `useUpdateSpec` mutation on submit, no `storageKey` (no draft recovery for edits). Pass `onCancel` to SpecForm that navigates to `/$orgSlug/spec-library/$specId` (FR-012). Display error message on mutation failure, keeping form state intact (FR-018). Export from `packages/domains/authoring/src/ui/index.ts`
- [x] T010 [US1] Create edit route at `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.edit.tsx`. In `beforeLoad`: check role via `requireRole(role, { minimum: 'admin' })` — redirect to `/$orgSlug/spec-library/$specId` if member (US6/FR-015). In component: fetch spec via `useSpecDetail` with `specKeys.detail(orgSlug, specId)`, redirect to detail page if spec is archived (US7/FR-016), render `EditSpecForm` with `initialValues` from fetched spec, pass `invalidateKeys={[specKeys.detail(orgSlug, specId), specKeys.lists(orgSlug), specKeys.history(orgSlug, specId)]}`, `onSuccess` navigates to `/$orgSlug/spec-library/$specId`
- [x] T011 [US1] Add "Edit spec" button to spec detail page in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx`. Conditionally render based on `requireRole(role, { minimum: 'admin' })` — hidden for members (US6/FR-013). Button navigates to `/$orgSlug/spec-library/$specId/edit`

**Checkpoint**: Core edit flow complete. Admin can edit a spec from the detail page, save, and see updated values + history entries. Members cannot see or access the edit page.

---

## Phase 4: User Story 2 — Edit Spec from Overview Table (Priority: P1)

**Goal**: Admin clicks "Edit spec" in the row action menu on the Spec Library overview table and is navigated to the edit page.

**Independent Test**: Navigate to Spec Library overview, open row action menu, click "Edit spec". Verify navigation to edit page with pre-populated form.

### Implementation for User Story 2

- [x] T012 [US2] Add "Edit spec" action to the row action menu in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx` (or in the `SpecLibraryTable` component if the menu is defined there). Conditionally render based on `requireRole(role, { minimum: 'admin' })` — hidden for members (US6/FR-014). Action navigates to `/$orgSlug/spec-library/$specId/edit`

**Checkpoint**: Both entry points (detail page button + overview table menu) are functional.

---

## Phase 5: User Story 3 — Cancel Editing + Unsaved Changes Protection (Priority: P2)

**Goal**: Admin can cancel editing (redirect to detail page, no changes saved). Unsaved changes trigger a confirmation dialog on navigation away.

**Independent Test**: Open edit page, make changes, click Cancel — verify no changes saved. Make changes, click browser back — verify confirmation dialog appears.

### Implementation for User Story 3

- [x] T013 [US3] Add unsaved changes detection to `SpecForm` in `packages/domains/authoring/src/ui/components/SpecForm.tsx`. Track dirty state by deep-comparing current form values against `initialValues` (when provided). Show "Unsaved changes" indicator near the submit button when dirty (FR-017). Register `beforeunload` event listener when dirty for browser-level navigation (FR-021). Use TanStack Router's `useBlocker` hook when dirty for in-app SPA navigation (FR-021). Ensure Cancel button always navigates to the detail page without triggering the blocker

**Checkpoint**: Cancel and unsaved changes protection complete. US4 (test steps) and US5 (artifact requirements) are already functional via `SpecForm` inheriting all behavior from the extracted `CreateSpecForm`. US6 (member access restriction) is enforced at backend (T005), frontend route (T010), detail page button (T011), and overview menu (T012). US7 (archived spec protection) is enforced at backend (T005) and frontend route (T010).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, exports, and cleanup.

- [x] T014 [P] Verify all new exports are registered: `updateLibrarySpec` from `packages/domains/authoring/src/index.ts`, `useUpdateSpec` from `packages/domains/authoring/src/ui/index.ts`, `EditSpecForm` and `SpecForm` from `packages/domains/authoring/src/ui/index.ts`, `UpdateLibrarySpecRequestSchema` from `packages/shared/src/index.ts`
- [x] T015 [P] Verify all new error paths use domain-specific error codes: `AUTH_ROLE_INSUFFICIENT` for member rejection in PUT handler, `AUTHOR_SPEC_NOT_FOUND` for missing spec, `AUTHOR_SPEC_ARCHIVED` for archived spec. No ad-hoc string errors
- [x] T016 [P] Verify OTel span attributes are set in the PUT route handler via `getSpan(request)`: `org.slug`, `spec.id`. No manual `tracer.startActiveSpan` — `@fastify/otel` auto-instruments
- [x] T017 Run `pnpm turbo run build typecheck test` to verify everything compiles and passes. Verify `pnpm --filter app dev` generates the new route in `routeTree.gen.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion. T006→T007 (extract then refactor). T008 is parallel (different file). T009 depends on T006+T008. T010 depends on T009. T011 is parallel with T010
- **US2 (Phase 4)**: Depends on Phase 3 (edit route must exist). Single task
- **US3 (Phase 5)**: Depends on T006 (SpecForm must exist). Single task
- **Polish (Phase 6)**: Depends on all story phases being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2. Core story — must complete first
- **US2 (P1)**: Depends on US1 (edit route must exist for navigation target)
- **US3 (P2)**: Depends on US1 (SpecForm must exist). Can run parallel with US2
- **US4 (P2)**: No dedicated tasks — covered by SpecForm extraction in US1 (T006)
- **US5 (P2)**: No dedicated tasks — covered by SpecForm extraction in US1 (T006)
- **US6 (P1)**: No dedicated phase — distributed across T005 (backend), T010 (route guard), T011 (detail button), T012 (menu)
- **US7 (P2)**: No dedicated phase — distributed across T005 (backend), T010 (route redirect)

### Within Phase 2 (Foundational)

```
T001  ─┐
T001a ─┤
T002  ─┼── all [P] parallel (different files)
T003  ─┘
T004  ── depends on T001 (uses UpdateLibrarySpecRequestSchema types)
T005  ── depends on T001, T001a, T002, T004 (uses schema, error class, snapshot, use case)
T005a ─┐
T005b ─┼── all [P] parallel, depend on T004/T002/T005 respectively
T005c ─┘
```

### Within Phase 3 (US1)

```
T006 ── extract SpecForm (first)
T007 ── depends on T006 (refactor CreateSpecForm)
T008 ── parallel (different file, no deps on T006)
T009 ── depends on T006 + T008 (composes SpecForm + useUpdateSpec)
T010 ── depends on T009 (uses EditSpecForm)
T011 ── parallel with T010 (different file)
```

---

## Parallel Opportunities

### Phase 2 (Foundational)

```
Parallel group 1:
  T001: UpdateLibrarySpecRequestSchema + SPEC_HISTORY_ACTIONS (shared schemas)
  T001a: AUTH_ROLE_INSUFFICIENT error class (identity domain)
  T002: SpecSnapshot + detectFieldChanges (audit domain)
  T003: describeHistoryAction (authoring UI lib)

Sequential after group 1:
  T004: updateLibrarySpec use case (needs T001)
  T005: PUT route handler (needs T001, T001a, T002, T004)

Parallel group 1b (after T004, T002, T005):
  T005a: updateLibrarySpec unit tests
  T005b: detectFieldChanges unit tests
  T005c: PUT route integration tests
```

### Phase 3 (US1)

```
Sequential start:
  T006: Extract SpecForm

Parallel group 2 (after T006):
  T007: Refactor CreateSpecForm
  T008: useUpdateSpec hook

Sequential (after T007 + T008):
  T009: EditSpecForm

Parallel group 3 (after T009):
  T010: Edit route
  T011: Edit spec button on detail page
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 2: Foundational (T001-T005)
2. Complete Phase 3: US1 (T006-T011)
3. **STOP and VALIDATE**: Test core edit flow end-to-end
4. Deploy/demo if ready

### Incremental Delivery

1. Phase 2 (Foundational) → schemas + use case + route ready
2. Phase 3 (US1) → core edit from detail page → **MVP**
3. Phase 4 (US2) → add overview table entry point
4. Phase 5 (US3) → add cancel + unsaved changes protection
5. Phase 6 (Polish) → verify exports, errors, OTel, build

### Total Task Summary

- **21 tasks** total
- Phase 2 (Foundational): 9 tasks (5 implementation + 1 error class + 3 tests)
- Phase 3 (US1): 6 tasks
- Phase 4 (US2): 1 task
- Phase 5 (US3): 1 task
- Phase 6 (Polish): 4 tasks
- US4, US5, US6, US7: covered by tasks in other phases (no dedicated tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US4 (test steps) and US5 (artifact requirements) have no dedicated tasks because `SpecForm` inherits all behavior from the extracted `CreateSpecForm`
- US6 (member access restriction) is enforced at 4 points: backend PUT handler (T005), frontend route guard (T010), detail page button visibility (T011), overview menu visibility (T012)
- US7 (archived spec protection) is enforced at 2 points: backend PUT handler (T005), frontend route redirect (T010)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
