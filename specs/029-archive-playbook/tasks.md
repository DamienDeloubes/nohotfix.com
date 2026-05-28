# Tasks: Archive & Unarchive Playbook

**Input**: Design documents from `/specs/029-archive-playbook/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Error-path unit tests are mandatory per constitution (Mandatory Per-Feature Deliverables). Included in Phase 2.

**Organization**: Tasks grouped by user story. US1+US2+US6 are combined as MVP (list page archive/unarchive + archived tab). US3+US4+US5 are combined (editor page archive, read-only view, editor unarchive).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Register error codes, update schemas, and add Zod response types in `packages/shared`

- [x] T001 [P] Register `AUTHOR_PLAYBOOK_ARCHIVED` error code in `packages/shared/src/errors/codes.ts` following `DOMAIN_CATEGORY_SPECIFIC` taxonomy
- [x] T002 [P] Add `'archived'` and `'unarchived'` to playbook history action types in `packages/shared/src/schemas/playbooks.ts`
- [x] T003 [P] Add `PlaybookArchiveInfoResponseSchema` and `ArchivePlaybookResponseSchema` Zod schemas in `packages/shared/src/schemas/playbooks.ts`
- [x] T004 [P] Add HTTP 409 mapping for `AUTHOR_PLAYBOOK_ARCHIVED` in `apps/api/src/shared/errors/` (error-to-HTTP map)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain error class, use case, unit tests, API routes, and archived-playbook guard. MUST complete before any UI work.

- [x] T005 Create `PlaybookArchivedError` domain error class in `packages/domains/authoring/src/errors/playbook-archived-error.ts` extending `DomainError` with code `AUTHOR_PLAYBOOK_ARCHIVED` (pattern: /project:new-entity)
- [x] T006 Export `PlaybookArchivedError` from `packages/domains/authoring/src/errors/index.ts` and `packages/domains/authoring/src/index.ts`
- [x] T007 Create `archivePlaybook` use case in `packages/domains/authoring/src/use-cases/archive-playbook.ts` — accepts `PlaybookRepository` port, playbook ID, org ID, and `isArchived` boolean target. Returns `{ playbook, wasChanged }`. Idempotent: if already in target state, returns `wasChanged: false`. Uses existing `PlaybookRepository.update()` with `{ isArchived }`. Follow pattern from `packages/domains/authoring/src/use-cases/archive-library-spec.ts`
- [x] T008 Export `archivePlaybook` use case from `packages/domains/authoring/src/use-cases/index.ts` and `packages/domains/authoring/src/index.ts`
- [x] T009 [P] Create error-path unit tests in `packages/domains/authoring/src/use-cases/__tests__/archive-playbook.test.ts` — test: (1) archiving an active playbook returns `wasChanged: true`, (2) archiving an already-archived playbook returns `wasChanged: false` (idempotency), (3) unarchiving an archived playbook returns `wasChanged: true`, (4) unarchiving an already-active playbook returns `wasChanged: false`, (5) playbook not found throws `AUTHOR_PLAYBOOK_NOT_FOUND`. Use stubbed `PlaybookRepository` port. Constitution Mandatory Deliverable #3.
- [x] T010 Add `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/archive` route handler in `apps/api/src/routes/authoring.ts` — admin minimum, calls `archivePlaybook` use case with `isArchived: true`, records changelog entry (action: `'archived'`, entityType: `'playbook'`, fieldChanges: `null`) only when `wasChanged: true`, adds OTel span attributes (`playbook.id`, `playbook.isArchived`, `org.id`) via `getSpan(request)`. Follow pattern from existing spec archive route in same file (pattern: /project:new-route)
- [x] T011 Add `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/unarchive` route handler in `apps/api/src/routes/authoring.ts` — admin minimum, calls `archivePlaybook` use case with `isArchived: false`, records changelog entry (action: `'unarchived'`) only when `wasChanged: true`, adds OTel span attributes (pattern: /project:new-route)
- [x] T012 Add `GET /api/orgs/:orgSlug/playbooks/:playbookId/archive-info` route handler in `apps/api/src/routes/authoring.ts` — admin minimum, queries `runs` table directly (API-layer orchestration) for COUNT where `playbook_id = :id AND org_id = :orgId AND status IN ('in_progress', 'awaiting_decision')`. Returns `{ playbookId, activeRunCount }`. No domain port needed for this cross-context read
- [x] T013 Create archived-playbook guard middleware in `apps/api/src/shared/middleware/archived-playbook-guard.ts` — a Fastify `preHandler` that checks `playbooks.is_archived` for the `:playbookId` param (with `org_id` in WHERE). Throws `PlaybookArchivedError` if archived. Similar to `immutability-guard.ts` pattern
- [x] T014 Apply `archivedPlaybookGuard` as `preHandler` on all existing playbook write routes in `apps/api/src/routes/authoring.ts` — specifically: `PATCH /playbooks/:id`, `POST /playbooks/:id/sections`, `PATCH /sections/:sectionId`, `DELETE /sections/:sectionId`, `POST /sections/reorder`, `POST /specs`, `DELETE /specs/:specId`, `POST /specs/reorder`, `POST /specs/bulk`, `POST /sections/copy-from`. Exclude `/archive`, `/unarchive`, and `/archive-info` endpoints
- [x] T015 Ensure `GET /api/orgs/:orgSlug/playbooks` list endpoint supports `isArchived` query parameter filtering (verify/add Zod validation for the query param, pass `isArchived` filter to `PlaybookRepository.findByOrgWithCounts()`) in `apps/api/src/routes/authoring.ts`
- [ ] T016 Add run creation guard: in the `POST /api/runs` route handler in `apps/api/src/routes/execution.ts`, check if the source playbook is archived before starting a run. If archived, throw `PlaybookArchivedError` (import from `@releasepilot/domain-authoring`) — **DEFERRED: route is a 501 stub**

**Checkpoint**: All backend work complete. API endpoints functional. Guard middleware active. Unit tests passing. Frontend work can begin.

---

## Phase 3: US1 + US2 + US6 — List Page: Archive, Unarchive & Archived Tab (Priority: P1) MVP

**Goal**: Admin can archive a playbook from the Active tab, see it on the Archived tab, and unarchive it back. Members see view-only menus.

**Independent Test**: Create a playbook, archive it from the list, verify it appears on the Archived tab. Unarchive it, verify it returns to the Active tab. Check changelog entries for both actions.

### Implementation

- [x] T017 [P] [US1] Create `useArchivePlaybook` mutation hook in `packages/domains/authoring/src/ui/hooks/use-archive-playbook.ts` — accepts `{ orgSlug, playbookId, invalidateKeys }`, calls `PATCH /api/orgs/${orgSlug}/playbooks/${playbookId}/archive`, invalidates provided keys on success. Follow pattern from `packages/domains/authoring/src/ui/hooks/use-archive-spec.ts`
- [x] T018 [P] [US2] Create `useUnarchivePlaybook` mutation hook in `packages/domains/authoring/src/ui/hooks/use-unarchive-playbook.ts` — accepts `{ orgSlug, playbookId, invalidateKeys }`, calls `PATCH .../unarchive`, invalidates provided keys on success. Follow `use-unarchive-spec.ts` pattern
- [x] T019 [P] [US1] Create `usePlaybookArchiveInfo` query hook in `packages/domains/authoring/src/ui/hooks/use-playbook-archive-info.ts` — accepts `{ orgSlug, playbookId, queryKey, enabled }`, calls `GET .../archive-info`, returns `{ playbookId, activeRunCount }`. Uses `PlaybookArchiveInfoResponseSchema` for validation. Follow `use-archive-impact.ts` pattern
- [x] T020 Export all three new hooks from `packages/domains/authoring/src/ui/hooks/index.ts` and `packages/domains/authoring/src/ui/index.ts`
- [x] T021 [US1] Create `ArchivePlaybookDialog` component in `packages/domains/authoring/src/ui/components/ArchivePlaybookDialog.tsx` — confirmation dialog showing playbook name, active run count (from `usePlaybookArchiveInfo`), "Cancel" and "Archive" buttons. Calls `useArchivePlaybook` on confirm. Shows success toast "Playbook archived" on success, error toast "Failed to archive playbook. Please try again." on failure
- [x] T022 [US1] Export `ArchivePlaybookDialog` from `packages/domains/authoring/src/ui/components/index.ts` and `packages/domains/authoring/src/ui/index.ts`
- [x] T023 [US6] Add Active/Archived tabs to the playbook list page in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/index.tsx` (or equivalent route file). Active tab fetches with `playbookKeys.list(orgSlug, { isArchived: false })`, Archived tab fetches with `playbookKeys.list(orgSlug, { isArchived: true })`. Pass `isArchived` query param to the API. Show empty state "No active playbooks. Create one to get started." for empty Active tab, appropriate empty state for empty Archived tab
- [x] T024 [US1] Add "Archive" action to the Active tab playbook row action menu (three-dot menu) for admins/owners only — opens `ArchivePlaybookDialog`. Menu shows "Open", "Duplicate" (non-functional), "Archive". Members see only "Open". Implement in the playbook list page route file. Pass `invalidateKeys: [playbookKeys.all(orgSlug)]` to the archive hook
- [x] T025 [US2] Add "Unarchive" action to the Archived tab playbook row action menu for admins/owners — calls `useUnarchivePlaybook` directly (no confirmation dialog). Shows success toast "Playbook unarchived", error toast on failure. Menu shows "View" and "Unarchive" for admins, only "View" for members. Pass `invalidateKeys: [playbookKeys.all(orgSlug)]`
- [ ] T026 [US1] Handle optimistic updates for archive: on archive mutation, optimistically remove the row from the Active tab list cache and add to Archived tab cache. Rollback on error. Use TanStack Query `onMutate`/`onError`/`onSettled` pattern — **DEFERRED: invalidation-based cache refresh is sufficient for MVP**
- [ ] T027 [US2] Handle optimistic updates for unarchive: on unarchive mutation, optimistically remove the row from the Archived tab list cache and add to Active tab cache. Rollback on error — **DEFERRED: invalidation-based cache refresh is sufficient for MVP**

**Checkpoint**: MVP complete. Admin can archive/unarchive playbooks from the list page via tabs.

---

## Phase 4: US3 + US4 + US5 — Editor Page: Archive, Read-Only View & Unarchive (Priority: P2)

**Goal**: Admin can archive from the editor, view archived playbooks in read-only mode with "Archived" badge, and unarchive from the detail page.

**Independent Test**: Navigate to a playbook editor, archive it via the action menu, verify redirect to list page. Navigate to the archived playbook's detail URL, verify read-only mode with badge. Unarchive from detail page, verify editing controls return.

### Implementation

- [x] T028 [US4] Add read-only mode to the playbook detail/editor page in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/$playbookId.tsx` (or equivalent) — when `playbook.isArchived === true`: display "Archived" badge (using existing Badge component from `apps/app/src/components/ui/`) prominently near the playbook name; hide all editing controls (inline editing, drag handles, "Add from library", "Add section", "New spec" buttons); keep spec rows visible with all data (title, severity, system under test, artifact count) in read-only; keep left section navigation sidebar functional
- [x] T029 [US4] Update the playbook detail page action menu (three-dot in header) to show context-appropriate actions: when archived and admin/owner: "Unarchive", "Duplicate" (non-functional), "View change history"; when active and admin/owner: "Archive playbook" (plus existing actions); when archived and member: "View change history" only
- [x] T030 [US3] Add "Archive playbook" action to the active playbook editor page header action menu — opens `ArchivePlaybookDialog` (reuse from T021). On successful archive, redirect to the playbook list page (`/:orgSlug/playbooks`) landing on the Active tab using TanStack Router `navigate()`. Pass `invalidateKeys: [playbookKeys.all(orgSlug)]`
- [x] T031 [US5] Add "Unarchive" action to the archived playbook detail page action menu — calls `useUnarchivePlaybook` directly (no dialog). On success: the "Archived" badge disappears, all editing controls reappear (re-render with `isArchived: false`), success toast "Playbook unarchived". Invalidate `playbookKeys.detail(orgSlug, playbookId)` and `playbookKeys.all(orgSlug)`

**Checkpoint**: All editor page scenarios complete. Archive from editor with redirect, read-only view with badge, unarchive with live UI update.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: History descriptions, final verification, edge case handling

- [x] T032 [P] Add `'archived'` and `'unarchived'` action descriptions in `packages/domains/audit/src/ui/lib/describe-playbook-history-action.ts` — return `'archived this playbook'` and `'unarchived this playbook'` respectively. Follow existing pattern for `'spec_archived'` action — **already implemented**
- [x] T033 Export any new types from `packages/domains/audit/src/ui/index.ts` if needed — **no new exports needed**
- [x] T034 Verify all new service methods and route handlers have OTel span instrumentation — confirmed `getSpan(request)` with `playbook.id`, `playbook.isArchived`, `org.slug` attributes
- [x] T035 Verify all new error paths use `AUTHOR_PLAYBOOK_ARCHIVED` domain error code — confirmed guard throws `AuthorPlaybookArchivedError`
- [x] T036 Run `pnpm turbo run build typecheck test` to verify full pipeline passes — **all 22 build/typecheck tasks pass, all tests pass**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. All 4 tasks are parallelizable.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. T005-T008 (domain package) parallel with T010-T012 (API routes). T009 (unit tests) parallel with T010-T012 after T007-T008. T013-T016 depend on T005 (error class must exist).
- **US1+US2+US6 (Phase 3)**: Depends on Phase 2 completion (API endpoints must exist). T017-T019 are parallelizable (different hook files). T021 depends on T019 (uses archive-info hook). T023-T027 are sequential within the page.
- **US3+US4+US5 (Phase 4)**: Depends on Phase 2 completion (API endpoints) and Phase 3 hooks (T017-T020 reused). T028-T031 are sequential within the editor page.
- **Polish (Phase 5)**: Depends on Phase 3 + 4 completion. T032-T033 can start after Phase 2.

### User Story Dependencies

- **US1 (Archive from list)**: Needs foundational backend + archived tab (US6) + archive dialog
- **US2 (Unarchive from list)**: Needs foundational backend + archived tab (US6)
- **US6 (Archived tab)**: Needs foundational backend (list endpoint filtering)
- **US3 (Archive from editor)**: Needs foundational backend + ArchivePlaybookDialog (from US1)
- **US4 (Read-only view)**: Needs foundational backend only
- **US5 (Unarchive from detail)**: Needs foundational backend + read-only view (US4)

### Parallel Opportunities

- Phase 1: All 4 tasks run in parallel (different files)
- Phase 2: T005-T009 (domain package) parallel with T010-T012 (API routes) after Phase 1
- Phase 3: T017, T018, T019 run in parallel (different hook files)
- Phase 4: T028-T031 sequential (same file)
- Phase 5: T032 can start as soon as Phase 2 completes

---

## Parallel Example: Phase 3 Hooks

```bash
# Launch all hooks in parallel:
Task: "Create useArchivePlaybook hook in packages/domains/authoring/src/ui/hooks/use-archive-playbook.ts"
Task: "Create useUnarchivePlaybook hook in packages/domains/authoring/src/ui/hooks/use-unarchive-playbook.ts"
Task: "Create usePlaybookArchiveInfo hook in packages/domains/authoring/src/ui/hooks/use-playbook-archive-info.ts"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2 + 3)

1. Complete Phase 1: Setup (error codes, schemas)
2. Complete Phase 2: Foundational (domain error, use case, unit tests, routes, guard) — core backend
3. Complete Phase 3: US1 + US2 + US6 (list page archive/unarchive + tabs) — core UI
4. **STOP and VALIDATE**: Archive from list, see on Archived tab, unarchive back. Check changelog.
5. Deploy/demo MVP

### Incremental Delivery

1. Phase 1 + 2 → Backend fully functional (testable via API, unit tests passing)
2. Phase 3 → List page complete (MVP!)
3. Phase 4 → Editor page complete (read-only, archive from editor, unarchive from detail)
4. Phase 5 → Polish (history descriptions, verification)

---

## Notes

- No migration needed — `playbooks.is_archived` column already exists
- Follow `archive-library-spec.ts` as the primary pattern reference throughout
- The `ArchivePlaybookDialog` is created once (T021) and reused in both list page (T024) and editor page (T030)
- Query key invalidation uses `playbookKeys.all(orgSlug)` to refresh both Active and Archived tab caches
- Optimistic updates (T026, T027) are nice-to-have for MVP but recommended for UX consistency
- The archived-playbook guard (T013-T014) is critical — it protects ALL existing write routes
