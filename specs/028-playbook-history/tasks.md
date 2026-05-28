# Tasks: Playbook Change History

**Input**: Design documents from `/specs/028-playbook-history/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks excluded. Add test phases if needed later.

**Organization**: Tasks grouped by user story. US1–US4 are P1 (MVP), US5–US6 are P2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared types, schemas, error codes, and port extensions that all user stories depend on

- [x] T001 [P] Add `PLAYBOOK_HISTORY_ACTIONS` array, `PlaybookHistoryActionSchema`, `PlaybookHistoryEntrySchema`, and `PlaybookHistoryResponseSchema` to `packages/shared/src/schemas/playbooks.ts`
- [x] T002 [P] Add `PlaybookHistoryAction`, `PlaybookHistoryEntry`, `PlaybookHistoryResponse` type exports to `packages/shared/src/types/index.ts`
- [x] T003 [P] Register `AUDIT_PLAYBOOK_NOT_FOUND` error code in `packages/shared/src/errors/codes.ts` following `DOMAIN_CATEGORY_SPECIFIC` taxonomy
- [x] T004 [P] Add `PlaybookChangelogEntry` type to `packages/domains/audit/src/types.ts`
- [x] T005 [P] Create `AuditPlaybookNotFoundError` domain error class in `packages/domains/audit/src/errors/` extending `DomainError` (pattern: /project:new-entity)
- [x] T006 Add `findByPlaybookWithMembership(orgId: string, playbookId: string): Promise<PlaybookChangelogEntry[]>` to `ChangelogRepository` port interface in `packages/domains/audit/src/ports/changelog-repository.ts`
- [x] T007 Implement `findByPlaybookWithMembership()` in `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` (LEFT JOIN on memberships, compute `isRemovedMember`, order by `created_at DESC`)
- [x] T008 Export new types, error class, and port changes from `packages/domains/audit/src/index.ts` barrel

**Checkpoint**: Shared infrastructure ready — user story implementation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core use cases that multiple user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Implement `getPlaybookChangelog` use case in `packages/domains/audit/src/use-cases/get-playbook-changelog.ts` — replace stub; accept `ChangelogRepository` port + `{orgId, playbookId}`; call `findByPlaybookWithMembership()`; return `PlaybookChangelogEntry[]` (pattern: /project:new-route)
- [x] T010 Implement `recordPlaybookChanges` use case in `packages/domains/audit/src/use-cases/record-playbook-changes.ts` — accept `ChangelogRepository` port + `PlaybookSnapshot` (old/new); compare fields (name, description, environmentId); emit one `recordChangelog` call per changed field with correct action and `field_changes` shape
- [x] T011 Export `getPlaybookChangelog` and `recordPlaybookChanges` from `packages/domains/audit/src/use-cases/index.ts` and `packages/domains/audit/src/index.ts`
- [x] T012 Implement GET `/api/orgs/:orgSlug/playbooks/:playbookId/history` route in `apps/api/src/routes/audit.ts` — middleware: `[authMiddleware, orgScopeMiddleware]` (no role guard); verify playbook exists (throw `AUDIT_PLAYBOOK_NOT_FOUND` if not); call `getPlaybookChangelog`; return `PlaybookHistoryResponse`. Pagination deferred — return all entries matching existing spec history pattern (pattern: /project:new-route)
- [x] T013 Add `playbookKeys.history(orgSlug, playbookId)` to `apps/app/src/api/query-keys.ts` following existing factory pattern

**Checkpoint**: History endpoint functional, changelog recording infrastructure ready

---

## Phase 3: User Story 1 — View Playbook Change History (Priority: P1) MVP

**Goal**: Users can open the History tab on a playbook and see a read-only timeline of all changes

**Independent Test**: Create a playbook, make edits, open History tab, verify entries appear in reverse chronological order with correct actor and description

### Implementation for User Story 1

- [x] T014 [P] [US1] Create `describePlaybookHistoryAction()` helper in `packages/domains/audit/src/ui/lib/describe-playbook-history-action.ts` — map each of 15 action types to human-readable strings using `fieldChanges` data (e.g., "changed name from 'X' to 'Y'", "added section 'Regression'", "reordered specs in 'Smoke'"). Handle removed members with "Removed member" fallback. Follow pattern in `packages/domains/authoring/src/ui/lib/describe-history-action.ts`
- [x] T015 [P] [US1] Create `usePlaybookHistory` hook in `packages/domains/audit/src/ui/hooks/use-playbook-history.ts` — accept `{orgSlug, playbookId, queryKey}`; call `GET /api/orgs/${orgSlug}/playbooks/${playbookId}/history`; validate with `PlaybookHistoryResponseSchema`; `staleTime: 5min`, `retry: false`. Follow pattern in `packages/domains/authoring/src/ui/hooks/use-spec-history.ts`
- [x] T016 [US1] Create `PlaybookHistoryTimeline` component in `packages/domains/audit/src/ui/components/PlaybookHistoryTimeline.tsx` — render timeline of `PlaybookHistoryEntry[]` (newest first); use `describePlaybookHistoryAction()` for descriptions; show actor name (or "Removed member" when `isRemovedMember`); show relative timestamp; handle empty state and loading state. Follow pattern in `packages/domains/authoring/src/ui/components/SpecHistoryTimeline.tsx`
- [x] T017 [US1] Export `usePlaybookHistory`, `PlaybookHistoryTimeline`, and `describePlaybookHistoryAction` from `packages/domains/audit/src/ui/index.ts`
- [x] T018 [US1] Wire History tab into playbook detail page at `apps/app/src/routes/_authenticated/$orgSlug/playbooks/$playbookId.index.tsx` — add "History" tab; pass `playbookKeys.history(orgSlug, playbookId)` as `queryKey` to `usePlaybookHistory`; render `PlaybookHistoryTimeline`

**Checkpoint**: History tab visible and rendering entries. Recording not yet wired (entries will be empty until US2+ complete)

---

## Phase 4: User Story 2 — Record Metadata Changes (Priority: P1)

**Goal**: Playbook name, description, and environment changes are recorded in the changelog with old/new values

**Independent Test**: Change a playbook's name, check History tab for "changed name from 'X' to 'Y'" entry

### Implementation for User Story 2

- [x] T019 [US2] Add changelog recording to `POST /api/orgs/:orgSlug/playbooks` in `apps/api/src/routes/authoring.ts` — after `createPlaybook()`, call `recordChangelog()` with action `created`, `entityType: 'playbook'`, actor info from `request.orgContext`
- [x] T020 [US2] Add changelog recording to `PATCH /api/orgs/:orgSlug/playbooks/:playbookId` in `apps/api/src/routes/authoring.ts` — before `updatePlaybook()`, fetch current playbook state as old snapshot; after update, call `recordPlaybookChanges()` with old/new snapshots to detect and record per-field changes (`name_changed`, `description_updated`, `environment_changed`). For `environment_changed`, resolve environment names from `environmentRepo` to populate `{oldId, oldName, newId, newName}`

**Checkpoint**: Creating and editing playbook metadata produces history entries visible in History tab

---

## Phase 5: User Story 3 — Record Section Changes (Priority: P1)

**Goal**: Section add, rename, remove, and reorder mutations are captured in the changelog

**Independent Test**: Add a section, rename it, delete it, verify three entries in History tab

### Implementation for User Story 3

- [x] T021 [P] [US3] Add changelog recording to `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections` in `apps/api/src/routes/authoring.ts` — after `createSection()`, call `recordChangelog()` with action `section_added`, `fieldChanges: { sectionId, name }`
- [x] T022 [P] [US3] Add changelog recording to `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` in `apps/api/src/routes/authoring.ts` — before `updateSection()`, fetch current section name; after update, if name changed, call `recordChangelog()` with action `section_renamed`, `fieldChanges: { sectionId, old, new }`
- [x] T023 [P] [US3] Add changelog recording to `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` in `apps/api/src/routes/authoring.ts` — before `deleteSection()`, fetch section name and count specs in section; after delete, call `recordChangelog()` with action `section_removed`, `fieldChanges: { sectionId, name, specCount }`
- [x] T024 [US3] Add changelog recording to `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder` in `apps/api/src/routes/authoring.ts` — after `reorderSections()`, call `recordChangelog()` with action `sections_reordered`, `fieldChanges: { orderedIds }`

**Checkpoint**: All section mutations produce history entries

---

## Phase 6: User Story 4 — Record Spec Assignment Changes (Priority: P1)

**Goal**: Spec add, remove, and reorder within playbooks are captured with spec title and section context

**Independent Test**: Add a library spec to a section, remove it, verify both entries with correct spec title and section name

### Implementation for User Story 4

- [x] T025 [P] [US4] Add changelog recording to `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs` in `apps/api/src/routes/authoring.ts` — after `addSpecToSection()`, resolve spec title from library and section name (if sectionId provided); call `recordChangelog()` with action `spec_added`, `fieldChanges: { specLibraryId, specTitle, sectionId, sectionName }`
- [x] T026 [P] [US4] Add changelog recording to `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId` in `apps/api/src/routes/authoring.ts` — before `removeSpecFromSection()`, fetch the playbook spec record to get `specLibraryId` and `sectionId`; resolve spec title and section name; after delete, call `recordChangelog()` with action `spec_removed`, `fieldChanges: { specLibraryId, specTitle, sectionId, sectionName }`
- [x] T027 [US4] Add changelog recording to `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder` in `apps/api/src/routes/authoring.ts` — after `reorderSpecs()`, resolve section name if `sectionId` provided; call `recordChangelog()` with action `specs_reordered`, `fieldChanges: { sectionId, sectionName, orderedIds }`

**Checkpoint**: Full P1 MVP complete — all core playbook mutations are tracked and visible in the History tab

---

## Phase 7: User Story 5 — Distinguish Archived vs Manually Removed Specs (Priority: P2)

**Goal**: When a library spec is archived and auto-removed from playbooks, the history shows "archived" (not "removed"), attributed to the archiving user

**Independent Test**: Archive a library spec referenced in a playbook, check playbook History tab for "spec archived" entry

### Implementation for User Story 5

- [x] T028 [US5] Modify spec archive route handler (`PATCH /api/orgs/:orgSlug/specs/:specId/archive`) in `apps/api/src/routes/authoring.ts` — BEFORE calling `archiveLibrarySpec()` (which removes specs from playbooks), use `getArchiveImpact()` to capture all affected playbooks with their section context (sectionId + sectionName) and spec title; then call `archiveLibrarySpec()`; then for each previously captured playbook, call `recordChangelog()` with action `spec_archived`, `entityType: 'playbook'`, `entityId: playbookId`, `fieldChanges: { specLibraryId, specTitle, sectionId, sectionName }`, actor = the user who triggered the archive. Order matters: section/spec data is unavailable after the archive mutation deletes the references

**Checkpoint**: Archived specs produce distinct "spec archived" entries in each affected playbook's history

---

## Phase 8: User Story 6 — Record Playbook Archive and Unarchive (Priority: P2)

**Goal**: Archiving and unarchiving a playbook records lifecycle events in its history

**Independent Test**: Archive and unarchive a playbook, verify both entries in History tab

### Implementation for User Story 6

- [x] T029 [US6] (DEFERRED — playbook archive/unarchive routes do not exist yet; changelog recording will be added when those routes are implemented) Add changelog recording to playbook archive/unarchive handlers in `apps/api/src/routes/authoring.ts` — after archive/unarchive mutation, call `recordChangelog()` with action `archived` or `unarchived`, `entityType: 'playbook'`, actor info from `request.orgContext`

**Checkpoint**: All 15 action types are now tracked

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Verification and quality assurance across all user stories

- [x] T030 Verify all 11 route handlers in `apps/api/src/routes/authoring.ts` record changelog entries within the same database transaction as their mutations (FR-012)
- [x] T031 [P] Add OTel span instrumentation to `getPlaybookChangelog` and `recordPlaybookChanges` use cases — add custom span attributes: `playbook.id`, `changelog.action`, `changelog.entry_count`. Follow `SnapshotService`/`ArtifactGateService` span naming pattern
- [x] T032 [P] Verify all new error paths use `AUDIT_PLAYBOOK_NOT_FOUND` domain error code (no ad-hoc string errors)
- [x] T033 Run `pnpm turbo run build typecheck test` to confirm everything compiles and passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2. Provides the History tab UI — visible but empty until recording is wired
- **US2 (Phase 4)**: Depends on Phase 2. Can run in parallel with US1
- **US3 (Phase 5)**: Depends on Phase 2. Can run in parallel with US1/US2
- **US4 (Phase 6)**: Depends on Phase 2. Can run in parallel with US1/US2/US3
- **US5 (Phase 7)**: Depends on Phase 2. Can run in parallel with US1–US4
- **US6 (Phase 8)**: Depends on Phase 2. Can run in parallel with US1–US5
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1**: Independent (UI only — reads from history endpoint)
- **US2**: Independent (writes to changelog via playbook create/update routes)
- **US3**: Independent (writes to changelog via section routes)
- **US4**: Independent (writes to changelog via spec-in-playbook routes)
- **US5**: Independent (extends existing spec archive route)
- **US6**: Independent (extends existing playbook archive route)

### Within Each User Story

- Types/schemas before use cases
- Use cases before route handlers
- Route handlers before UI wiring
- All Phase 1 + 2 tasks must be complete first

### Parallel Opportunities

- T001–T005 can all run in parallel (different files)
- T014–T015 can run in parallel (different UI files)
- T021–T023 can run in parallel (same file but different route handlers, independent logic)
- T025–T026 can run in parallel (different route handlers)
- US1–US6 can all run in parallel after Phase 2 (if team capacity allows)

---

## Parallel Example: Phase 1 Setup

```bash
# All setup tasks in parallel (different files):
T001: PLAYBOOK_HISTORY_ACTIONS in packages/shared/src/schemas/playbooks.ts
T002: Type exports in packages/shared/src/types/index.ts
T003: Error code in packages/shared/src/errors/codes.ts
T004: PlaybookChangelogEntry in packages/domains/audit/src/types.ts
T005: AuditPlaybookNotFoundError in packages/domains/audit/src/errors/
```

## Parallel Example: User Story 1

```bash
# UI tasks in parallel (different files):
T014: describePlaybookHistoryAction in packages/domains/audit/src/ui/lib/
T015: usePlaybookHistory hook in packages/domains/audit/src/ui/hooks/
# Then sequentially:
T016: PlaybookHistoryTimeline component (depends on T014 + T015)
T017: Barrel exports
T018: Route page wiring
```

---

## Implementation Strategy

### MVP First (US1–US4, Phases 1–6)

1. Complete Phase 1: Setup (shared types, error codes, port extension)
2. Complete Phase 2: Foundational (use cases, history endpoint, query keys)
3. Complete Phase 3: US1 — History tab UI
4. Complete Phases 4–6: US2–US4 — Wire changelog recording in all core mutation routes
5. **STOP and VALIDATE**: All P1 stories functional, 12 of 15 action types tracked
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. US1 (History tab) → Visible but empty tab → Demo UI
3. US2 (Metadata) → "created", "name_changed", "description_updated", "environment_changed" visible
4. US3 (Sections) → "section_added/renamed/removed/reordered" visible
5. US4 (Specs) → "spec_added/removed", "specs_reordered" visible → Full MVP
6. US5 (Archive distinction) → "spec_archived" distinct from "spec_removed"
7. US6 (Playbook lifecycle) → "archived", "unarchived" complete → All 15 actions

---

## Notes

- No database migration needed — reuses existing `changelog` table
- All changelog writes MUST be in the same DB transaction as their mutation (FR-012)
- The `recordChangelog` use case from audit domain is already wired via composition root
- Environment name resolution for `environment_changed` requires looking up the environment by ID before recording
- Section name denormalization (FR-016) requires resolving section name before recording spec-level actions
- The `spec_archived` flow (US5) is the most complex — it crosses the authoring→audit context boundary via API-layer orchestration
