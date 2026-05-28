# Tasks: Archive & Unarchive Spec

**Input**: Design documents from `/specs/027-archive-spec/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Error-path unit tests and integration tests included per constitution §Mandatory Per-Feature Deliverables.

**Organization**: Tasks are grouped by user story. Backend foundational work is in Phase 2 since all frontend stories depend on the updated API.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project setup needed — all infrastructure exists. This phase is a no-op.

**Checkpoint**: Ready to proceed to foundational changes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend port, adapter, schema, use-case, and route changes that ALL frontend user stories depend on.

**⚠️ CRITICAL**: No user story frontend work can begin until this phase is complete.

- [X] T001 [P] Add `removeByLibrarySpecId(specLibraryId: string, orgId: string): Promise<number>` method to PlaybookSpecRepository port interface in `packages/domains/authoring/src/ports/playbook-spec-repository.ts`
- [X] T002 [P] Add `ArchiveImpactResponseSchema` (Zod schema with `specId`, `activePlaybooks`, `archivedPlaybooks` arrays of `{ id, name }`) and `ArchiveImpactResponse` type to `packages/shared/src/schemas/specs.ts`, export from `packages/shared/src/index.ts`
- [X] T003 Implement `removeByLibrarySpecId` in `apps/api/src/adapters/repositories/kysely-playbook-spec-repository.ts` — bulk `DELETE FROM playbook_specs WHERE spec_library_id = ? AND org_id = ?`, return affected row count (depends on T001)
- [X] T004 Add `findPlaybooksReferencingSpec(specLibraryId: string, orgId: string): Promise<{ id: string; name: string; isArchived: boolean }[]>` method to PlaybookSpecRepository port in `packages/domains/authoring/src/ports/playbook-spec-repository.ts` — needed by the impact preview use case (depends on T001, same port file)
- [X] T005 Implement `findPlaybooksReferencingSpec` in `apps/api/src/adapters/repositories/kysely-playbook-spec-repository.ts` — JOIN `playbook_specs` → `playbooks`, SELECT DISTINCT `p.id, p.name, p.is_archived`, filter by `spec_library_id` and `org_id`, ORDER BY `p.name` (depends on T004)
- [X] T006 Create `getArchiveImpact` use case in `packages/domains/authoring/src/use-cases/get-archive-impact.ts` — accepts `{ playbookSpecRepo: PlaybookSpecRepository, specLibraryRepo: SpecLibraryRepository }` deps and `{ specId, orgId }` command. Validates spec exists (throws `AuthorSpecNotFoundError` if not). Calls `findPlaybooksReferencingSpec`, splits results into `activePlaybooks` and `archivedPlaybooks` arrays. Returns `ArchiveImpactResponse`. Export from `packages/domains/authoring/src/index.ts` (depends on T002, T004, T005)
- [X] T007 Modify `archiveLibrarySpec` use case in `packages/domains/authoring/src/use-cases/archive-library-spec.ts` — (1) Add `playbookSpecRepo: PlaybookSpecRepository` to deps interface. (2) Add idempotency: if `existing.isArchived === command.archive`, return current state as `LibrarySpec` immediately (no DB write, no changelog, no playbook removal). (3) When archiving (`archive: true`), call `playbookSpecRepo.removeByLibrarySpecId(specId, orgId)` after `setArchived`. Return `{ spec: LibrarySpec; wasChanged: boolean }` from the use case. When `existing.isArchived === command.archive`, return `{ spec: <current LibrarySpec>, wasChanged: false }`. Route handlers (T009, T010) skip changelog recording when `wasChanged` is `false`. (depends on T001, T003)
- [X] T008 Add GET `/api/orgs/:orgSlug/specs/:specId/archive-impact` endpoint in `apps/api/src/routes/authoring.ts` — middleware: `[authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`. Call `getArchiveImpact` use case with `{ playbookSpecRepo, specLibraryRepo }` from `request.server.root`. Set span attributes for `spec.id` and `org.slug`. Return 200 with `ArchiveImpactResponse`. (pattern: /project:new-route) (depends on T006)
- [X] T009 Update PATCH `/api/orgs/:orgSlug/specs/:specId/archive` handler in `apps/api/src/routes/authoring.ts` — pass `playbookSpecRepo: txRoot.playbookSpecRepo` to `archiveLibrarySpec` deps inside the `withTransaction` block. Handle idempotency: if use case signals no change, skip changelog recording and return current state directly. (depends on T007)
- [X] T010 Update PATCH `/api/orgs/:orgSlug/specs/:specId/unarchive` handler in `apps/api/src/routes/authoring.ts` — add idempotency: before calling `archiveLibrarySpec`, check if spec is already active. If so, return current state (200 OK) without changelog entry. No playbook restoration logic needed. (depends on T007)
- [X] T010a [P] Write unit tests for `getArchiveImpact` in `packages/domains/authoring/src/use-cases/__tests__/get-archive-impact.test.ts` — test: (1) spec not found throws `AuthorSpecNotFoundError`, (2) spec with no playbook refs returns empty arrays, (3) spec with mixed active/archived playbooks splits correctly. Mock `SpecLibraryRepository` and `PlaybookSpecRepository` via `vi.fn()`. (depends on T006)
- [X] T010b [P] Write unit tests for modified `archiveLibrarySpec` in `packages/domains/authoring/src/use-cases/__tests__/archive-library-spec.test.ts` — test: (1) spec not found throws `AuthorSpecNotFoundError`, (2) already-archived spec returns `wasChanged: false` (idempotency), (3) active spec archives and calls `removeByLibrarySpecId`, (4) already-active spec on unarchive returns `wasChanged: false`. Mock `SpecLibraryRepository` and `PlaybookSpecRepository` via `vi.fn()`. (depends on T007)
- [X] T011 Add `specKeys.impact` factory to `apps/app/src/api/query-keys.ts` — `impact: (orgSlug: string, specId: string) => [...specKeys.details(orgSlug), specId, 'impact'] as const`. Also verify `playbookKeys` exists for invalidation on archive success.

**Checkpoint**: Foundation ready — all backend endpoints updated, shared schema defined, query keys in place. Frontend user story implementation can now begin.

---

## Phase 3: User Story 1 + User Story 5 — Archive from Library with Playbook Impact Dialog (Priority: P1+P2) 🎯 MVP

**Goal**: Admin can archive a spec from the Spec Library overview via the action menu. A confirmation dialog shows affected playbook names grouped by active/archived status, with overflow truncation at 3 names. On confirm, the spec is archived and removed from all playbook templates atomically.

**Independent Test**: Archive a spec from the overview table → verify dialog shows correct playbook names → confirm → spec moves to Archived tab, removed from playbooks, changelog entry recorded.

### Implementation

- [X] T012 [P] [US1] Create `useArchiveImpact` hook in `packages/domains/authoring/src/ui/hooks/use-archive-impact.ts` — TanStack Query hook using `useApiQuery` that calls `GET /api/orgs/${orgSlug}/specs/${specId}/archive-impact`. Accept `{ orgSlug, specId, queryKey, enabled }` options. Only fetch when `enabled` is true (dialog is open). Export from `packages/domains/authoring/src/ui/hooks/index.ts` or barrel file.
- [X] T013 [P] [US1] Create `ArchiveConfirmDialog.tsx` component in `packages/domains/authoring/src/ui/ArchiveConfirmDialog.tsx` — accepts props: `{ open, onConfirm, onCancel, specTitle, orgSlug, specId, queryKey }`. When `open` is true, fetches impact data via `useArchiveImpact`. Renders dialog with 4 content variants: (a) no playbooks, (b) active only, (c) archived only, (d) active + archived. Truncates playbook names at 3 per group with "and N others." suffix. Shows loading state while impact data loads. "Cancel" and "Archive spec" buttons. Export from `packages/domains/authoring/src/ui/index.ts`.
- [X] T014 [US1] Update `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx` — replace existing inline archive confirmation dialog with the new `ArchiveConfirmDialog` component. Pass `specKeys.impact(orgSlug, specId)` as `queryKey`. On archive success, invalidate `specKeys.lists(orgSlug)` AND playbook-related query keys (playbook list counts may have changed). Keep existing optimistic update and error toast logic.
- [X] T015 [US1] Wire playbook query key invalidation on archive success in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx` — after archive mutation succeeds, also invalidate `playbookKeys.lists(orgSlug)` (or equivalent) so playbook views reflect the removed specs. Verify the correct playbook key factory exists in `apps/app/src/api/query-keys.ts`.

**Checkpoint**: Admin can archive a spec from the overview table with a dynamic confirmation dialog showing affected playbooks. Spec is removed from Active tab and from all playbook templates. Success toast and changelog entry.

---

## Phase 4: User Story 2 — Unarchive a Spec (Priority: P1)

**Goal**: Admin can unarchive a spec from the Archived tab action menu or from the spec detail page. No confirmation dialog. Spec returns to active status. Not re-added to playbooks.

**Independent Test**: Unarchive a spec → verify it appears on Active tab, becomes editable, changelog entry recorded, NOT re-added to any playbooks.

### Implementation

- [X] T016 [US2] Verify unarchive from Archived tab action menu in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx` — confirm the existing `useUnarchiveSpec` hook fires correctly with `invalidateKeys: [specKeys.lists(orgSlug)]`. Verify optimistic update removes spec from Archived tab. Verify success toast "Spec unarchived." appears. Verify error toast on failure. No code changes expected if already working; document any fixes needed.
- [X] T017 [US2] Verify unarchive from spec detail page in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.index.tsx` — confirm the "Unarchive" button calls the mutation, the "Archived" badge disappears, and "Edit spec" + "Archive spec" buttons appear. Verify success toast. Verify the page transitions to active state without a full reload.

**Checkpoint**: Unarchive works from both entry points. Spec returns to Active tab and becomes editable. No playbook restoration.

---

## Phase 5: User Story 3 — Archive from Spec Detail Page (Priority: P2)

**Goal**: Admin can archive a spec directly from the spec detail page header. Same confirmation dialog as the overview. On confirm, redirect to Spec Library overview Active tab.

**Independent Test**: Navigate to spec detail page → click "Archive spec" → see dialog with playbook impact → confirm → redirected to Spec Library Active tab with success toast.

### Implementation

- [X] T018 [US3] Update `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.index.tsx` — replace inline archive confirmation dialog with `ArchiveConfirmDialog` component. Pass `specKeys.impact(orgSlug, specId)` as `queryKey`. On archive success, navigate to `/$orgSlug/spec-library` with `search: { tab: 'active' }` (fix: current code navigates to `tab: 'archived'`). Invalidate `specKeys.lists(orgSlug)`, `specKeys.detail(orgSlug, specId)`, `specKeys.history(orgSlug, specId)`, and playbook list keys.

**Checkpoint**: Archive from detail page works with same dialog and playbook impact info. Redirects to Active tab.

---

## Phase 6: User Story 4 — View Archived Spec (Priority: P2)

**Goal**: Any user can view an archived spec's detail page. Page renders read-only with "Archived" badge. Admins see "Unarchive" button; members see no action buttons. Edit page redirects to detail page.

**Independent Test**: Navigate to archived spec detail → verify read-only, badge, role-appropriate buttons. Navigate to edit URL of archived spec → verify redirect to detail page.

### Implementation

- [X] T019 [US4] Verify archived spec detail page state in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.index.tsx` — confirm: (1) "Archived" badge is displayed when `spec.isArchived` is true, (2) "Edit spec" button is NOT rendered for archived specs, (3) "Unarchive" button IS rendered for admins/owners, (4) "Unarchive" button is NOT rendered for members, (5) spec history panel is visible with archive changelog entry. Document any fixes needed.
- [X] T020 [US4] Update `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId/edit.tsx` (or equivalent edit route) — replace the error message "Archived specs cannot be edited." with a redirect to the spec detail page `/$orgSlug/spec-library/$specId`. Use `navigate()` or `throw redirect()` in `beforeLoad` if the spec is archived.

**Checkpoint**: Archived specs are viewable read-only with proper badge and role-based buttons. Edit URL redirects to detail page.

---

## Phase 7: User Story 6 — Role-Based Access Control (Priority: P3)

**Goal**: Members cannot archive or unarchive specs. UI elements are hidden. API rejects direct calls.

**Independent Test**: Log in as member → verify no Archive/Unarchive actions in UI → attempt direct API call → verify 403 rejection.

### Implementation

- [X] T021 [US6] Verify member access restrictions in overview table — in `packages/domains/authoring/src/ui/SpecLibraryTable.tsx`, confirm the action menu conditionally renders: members see only "View", admins/owners see "View" + "Edit spec" + "Archive" (on Active tab) or "View" + "Unarchive" (on Archived tab). No code changes expected if existing role checks are correct; document any fixes.
- [X] T022 [US6] Verify member access restrictions on detail page — in `packages/domains/authoring/src/ui/SpecDetailActions.tsx`, confirm: members see no "Archive spec" or "Unarchive" buttons. Admins/owners see appropriate buttons based on `isArchived` state. No code changes expected; document any fixes.
- [X] T023 [US6] Verify API-level role enforcement — confirm both PATCH `/archive` and PATCH `/unarchive` endpoints and GET `/archive-impact` endpoint have `roleGuard({ minimum: 'admin' })` in their `preHandler` middleware arrays in `apps/api/src/routes/authoring.ts`. Already set in existing code; verify the new impact endpoint also has it (T008).

**Checkpoint**: Members are fully excluded from archive/unarchive actions at both UI and API levels.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories

- [X] T023a Write integration tests for archive/unarchive endpoints in `apps/api/src/routes/authoring.spec.ts` — test: (1) PATCH archive returns 200 and removes playbook_specs, (2) PATCH archive on already-archived spec returns 200 idempotently (no duplicate changelog), (3) PATCH unarchive on already-active spec returns 200 idempotently, (4) GET archive-impact returns grouped playbooks, (5) member role gets 403 on all three endpoints. Use `buildApp()` + `app.inject()` with mocked repos.
- [X] T024 Verify all new service methods have OTel span instrumentation — confirm `getArchiveImpact` use case inherits tracing via the route handler's auto-instrumented span. Confirm the `removeByLibrarySpecId` Kysely query inherits DB-level tracing from the `withTransaction` wrapper.
- [X] T025 Verify all error paths use domain-specific error codes — confirm `AuthorSpecNotFoundError` is thrown in `getArchiveImpact` for missing specs. Confirm `AUTH_ROLE_INSUFFICIENT` is returned by `roleGuard` for member access. No ad-hoc string errors.
- [X] T026 Run quickstart.md verification checklist — manually verify all 7 items in `specs/027-archive-spec/quickstart.md` Verification Checklist section.
- [X] T027 Run `pnpm turbo run build typecheck test` to confirm everything compiles and passes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No-op — project already exists
- **Foundational (Phase 2)**: No external dependencies — can start immediately. BLOCKS all frontend user stories.
- **US1+US5 (Phase 3)**: Depends on Phase 2 completion — MVP delivery target
- **US2 (Phase 4)**: Depends on Phase 2 completion — can run in parallel with Phase 3
- **US3 (Phase 5)**: Depends on Phase 3 (reuses `ArchiveConfirmDialog` component)
- **US4 (Phase 6)**: Depends on Phase 2 completion — can run in parallel with Phases 3-5
- **US6 (Phase 7)**: Depends on Phase 2 completion — can run in parallel with Phases 3-6
- **Polish (Phase 8)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1+US5 (P1+P2)**: Archive from library + dialog — starts after Phase 2. No dependencies on other stories.
- **US2 (P1)**: Unarchive — starts after Phase 2. Independent of US1 (backend idempotency is in Phase 2).
- **US3 (P2)**: Archive from detail page — depends on US1 (shares `ArchiveConfirmDialog`).
- **US4 (P2)**: View archived spec — starts after Phase 2. Independent of other stories.
- **US6 (P3)**: Role-based access — starts after Phase 2. Independent verification.

### Within Phase 2 (Foundational)

```
T001 (port: removeByLibrarySpecId) ──→ T003 (adapter) ──→ T007 (use case) ──→ T009 (archive route)
T004 (port: findPlaybooksReferencing) → T005 (adapter) → T006 (impact use case) → T008 (impact route)
T002 (shared schema) ──→ T006 (impact use case)
T007 ──→ T010 (unarchive route)
T011 (query keys) — independent, can run in parallel with all above
```

### Parallel Opportunities

**Phase 2**:
- T001 + T002 + T011 can run in parallel (different files)
- T004 runs after T001 (same port file)
- T003 + T005 can run in parallel after their respective port tasks
- T006 runs after T002, T004, T005
- T007 runs after T001, T003
- T010a + T010b can run in parallel after T006, T007 respectively

**Phase 3-7** (after Phase 2):
- Phase 3 (US1+US5) and Phase 4 (US2) can run in parallel
- Phase 6 (US4) and Phase 7 (US6) can run in parallel with everything
- Phase 5 (US3) must wait for Phase 3 (ArchiveConfirmDialog component)

---

## Parallel Example: Phase 2 Foundational

```bash
# Batch 1 — all parallel (different files):
Task T001: "Add removeByLibrarySpecId to PlaybookSpecRepository port"
Task T002: "Add ArchiveImpactResponseSchema to shared schemas"
Task T011: "Add specKeys.impact to query-keys.ts"

# Batch 1b — after T001 (same port file):
Task T004: "Add findPlaybooksReferencingSpec to PlaybookSpecRepository port"

# Batch 2 — after Batch 1 (adapter implementations):
Task T003: "Implement removeByLibrarySpecId in Kysely adapter"
Task T005: "Implement findPlaybooksReferencingSpec in Kysely adapter"

# Batch 3 — after Batch 2 (use cases):
Task T006: "Create getArchiveImpact use case"
Task T007: "Modify archiveLibrarySpec use case"

# Batch 4 — after Batch 3 (routes):
Task T008: "Add GET archive-impact endpoint"
Task T009: "Update PATCH archive handler"
Task T010: "Update PATCH unarchive handler"
```

## Parallel Example: Frontend Stories

```bash
# After Phase 2 completes — these can run in parallel:
Task T012 + T013: "Create useArchiveImpact hook + ArchiveConfirmDialog component"
Task T016 + T017: "Verify unarchive flows (US2)"
Task T019: "Verify archived spec detail page (US4)"
Task T021 + T022 + T023: "Verify role-based access (US6)"

# After Phase 3 completes (needs ArchiveConfirmDialog):
Task T018: "Update detail page archive to use ArchiveConfirmDialog (US3)"
```

---

## Implementation Strategy

### MVP First (Phase 2 + US1+US5)

1. Complete Phase 2: Foundational backend changes
2. Complete Phase 3: Archive from library with playbook impact dialog
3. **STOP and VALIDATE**: Archive a spec, verify playbook removal, dialog variants, changelog
4. Deploy/demo if ready — this delivers the core value

### Incremental Delivery

1. Phase 2 → Backend foundation ready
2. Phase 3 (US1+US5) → Archive with dialog → MVP!
3. Phase 4 (US2) → Unarchive → Feature is bidirectional
4. Phase 5 (US3) → Archive from detail page → Improved UX
5. Phase 6 (US4) → View archived + edit redirect → Complete read experience
6. Phase 7 (US6) → RBAC verification → Security sign-off
7. Phase 8 → Polish → Ship

---

## Notes

- Most existing infrastructure is reused — this feature is primarily modifications and enhancements, not greenfield
- No database migration needed — `is_archived` column and all tables already exist
- T001 and T004 both modify the same port file (`playbook-spec-repository.ts`) — T004 runs after T001 (not parallel)
- The `ArchiveConfirmDialog` component is the largest new piece of frontend work
- Idempotency changes (T007, T009, T010) are critical for FR-019 and concurrent admin scenarios
