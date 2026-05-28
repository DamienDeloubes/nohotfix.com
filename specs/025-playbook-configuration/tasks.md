# Tasks: Playbook & Sections Configuration

**Input**: Design documents from `/specs/025-playbook-configuration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Unit tests for all use case error paths + integration tests for API routes (constitution §3 compliance).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migration, schema updates, error codes, Zod schemas, domain type changes

- [x] T001 Create migration 007 to make `section_id` nullable on `playbook_specs` and add composite index in `packages/db/src/migrations/007_nullable_playbook_spec_section_id.ts` (pattern: /project:migrate)
- [x] T002 Update `PlaybookSpecsTable.section_id` to `string | null` in `packages/db/src/schema.ts`
- [x] T003 [P] Register 3 new error codes (`AUTHOR_SECTION_NOT_FOUND`, `AUTHOR_PLAYBOOK_NAME_INVALID`, `AUTHOR_PLAYBOOK_SPEC_DUPLICATE`) in `packages/shared/src/errors/codes.ts`
- [x] T004 [P] Add `ReorderSectionsRequestSchema`, `ReorderSpecsRequestSchema`, and `AddSpecFromLibraryRequestSchema` Zod schemas to `packages/shared/src/schemas/playbooks.ts` — update `AddSpecFromLibraryRequestSchema` to include optional `sectionId` field; export new types from `packages/shared/src/types/index.ts` and `packages/shared/src/index.ts`
- [x] T005 [P] Update `PlaybookSpec.sectionId` to `string | null` and add `PlaybookWithCounts` interface in `packages/domains/authoring/src/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain errors, port extensions, repository implementations, transaction support

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create 3 domain error classes (`AuthorSectionNotFoundError`, `AuthorPlaybookNameInvalidError`, `AuthorPlaybookSpecDuplicateError`) in `packages/domains/authoring/src/errors/index.ts` extending `DomainError` (pattern: /project:new-entity)
- [x] T007 [P] Extend `PlaybookRepository` port with `findByOrgWithCounts(orgId, includeArchived?)` in `packages/domains/authoring/src/ports/playbook-repository.ts`
- [x] T008 [P] Extend `PlaybookSpecRepository` port with `findByPlaybook()`, `findUngrouped()`, `updatePositions()`, `existsInPlaybook()`, `deleteBySectionId()` in `packages/domains/authoring/src/ports/playbook-spec-repository.ts`
- [x] T009 Implement `KyselyPlaybookRepository` (all methods: `findById`, `findByOrg`, `findByOrgWithCounts`, `create`, `update`) in `apps/api/src/adapters/repositories/kysely-playbook-repository.ts` — follow `KyselySpecLibraryRepository` pattern, ensure `org_id` on all queries
- [x] T010 Implement `KyselyPlaybookSectionRepository` (all methods: `findByPlaybook`, `create`, `update`, `delete`) in `apps/api/src/adapters/repositories/kysely-playbook-section-repository.ts` — order by `position ASC`, ensure `org_id` on all queries
- [x] T011 Implement `KyselyPlaybookSpecRepository` (all methods: `findBySection`, `findByPlaybook`, `findUngrouped`, `findByLibrarySpec`, `create`, `delete`, `updatePositions`, `existsInPlaybook`, `deleteBySectionId`) in `apps/api/src/adapters/repositories/kysely-playbook-spec-repository.ts` — handle JSONB fields with `jsonb()` helper, ensure `org_id` on all queries
- [x] T012 Extend `TransactionalRoot` interface and `createWithTransaction` factory to include `playbookRepo`, `playbookSectionRepo`, `playbookSpecRepo` in `apps/api/src/shared/lib/with-transaction.ts`

**Checkpoint**: Foundation ready — repositories, ports, errors, and schemas all in place. User story implementation can begin.

---

## Phase 3: User Story 1 — Create a Minimal Playbook (Priority: P1) MVP

**Goal**: Admin creates a playbook with name/description/environment, lands on empty editor page with ungrouped zone visible.

**Independent Test**: Create a playbook via form, verify redirect to editor, see empty ungrouped zone with "Add from library" button.

### Implementation for User Story 1

- [x] T013 [US1] Implement `createPlaybook` use case in `packages/domains/authoring/src/use-cases/create-playbook.ts` — validate name (1-255 chars), accept optional description/environmentId, set createdBy from userId, return playbook DTO (pattern: /project:new-route)
- [x] T013a [P] [US1] Unit test `createPlaybook` use case in `packages/domains/authoring/src/use-cases/__tests__/create-playbook.test.ts` — test: creates playbook with valid inputs, throws `AUTHOR_PLAYBOOK_NAME_INVALID` for empty name, throws `AUTHOR_PLAYBOOK_NAME_INVALID` for name >255 chars
- [x] T014 [US1] Implement `POST /api/orgs/:orgSlug/playbooks` route handler in `apps/api/src/routes/authoring.ts` — replace 501 stub; middleware: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`; validate with `CreatePlaybookRequestSchema`; call `createPlaybook` use case; return 201 with playbook DTO; add span attributes via `getSpan(request)` (pattern: /project:new-route)
- [x] T015 [US1] Implement `GET /api/orgs/:orgSlug/playbooks/:playbookId` route handler in `apps/api/src/routes/authoring.ts` — replace 501 stub; middleware: `[orgScopeMiddleware]`; fetch playbook + sections (ordered by position) + specs per section + ungrouped specs; return structured response per contracts/api-endpoints.md; throw `AUTHOR_PLAYBOOK_NOT_FOUND` if missing (pattern: /project:new-route)
- [x] T016 [P] [US1] Create `useCreatePlaybook` hook in `packages/domains/authoring/src/ui/hooks/useCreatePlaybook.ts` — accept `orgSlug` and `invalidateKeys`; POST to `/api/orgs/:orgSlug/playbooks`; use `useApiMutation` from `@nohotfix/api-client`
- [x] T017 [P] [US1] Create `usePlaybookDetail` hook in `packages/domains/authoring/src/ui/hooks/usePlaybookDetail.ts` — accept `orgSlug`, `playbookId`, and `queryKey`; GET `/api/orgs/:orgSlug/playbooks/:playbookId`; use `useApiQuery` from `@nohotfix/api-client`
- [x] T018 [US1] Create `CreatePlaybookForm` component in `packages/domains/authoring/src/ui/components/CreatePlaybookForm.tsx` — form with name (required, 1-255), description (optional, max 500), environment dropdown (optional, from environments list); use `react-hook-form` + `zodResolver` with `CreatePlaybookRequestSchema`; accept `onSuccess` callback and `invalidateKeys`
- [x] T019 [US1] Create `PlaybookEditor` component skeleton in `packages/domains/authoring/src/ui/components/PlaybookEditor.tsx` — accept playbook detail data; render header (name/description/environment) + ungrouped specs zone with "Add from library" button + sections zone with "Add section" button; empty state for ungrouped zone
- [x] T020 [US1] Implement `new.tsx` route page in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/new.tsx` — role guard `beforeLoad` (admin/owner only via `requireRole`); compose `CreatePlaybookForm` with `useCreatePlaybook` hook; pass `playbookKeys` from query-keys; navigate to editor on success
- [x] T021 [US1] Implement `$playbookId.tsx` route page in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/$playbookId.tsx` — compose `PlaybookEditor` with `usePlaybookDetail` hook; pass `playbookKeys.detail(orgSlug, playbookId)` as queryKey; role guard `beforeLoad` (admin/owner only); show loading state

**Checkpoint**: Admin can create a playbook and see the empty editor. Flat-checklist MVP foundation is complete.

---

## Phase 4: User Story 2 — Add Specs from Library to Playbook (Priority: P1)

**Goal**: Admin adds specs from the library to the ungrouped zone via a search picker. Duplicates prevented. Picker stays open for multi-add. Specs displayed as rows with drag handle, severity badge, system under test, and remove action.

**Independent Test**: Open editor, click "Add from library", search specs, add multiple, verify they appear in ungrouped zone, confirm already-added specs are non-selectable, remove a spec.

### Implementation for User Story 2

- [x] T022 [US2] Implement `addSpecToSection` use case in `packages/domains/authoring/src/use-cases/add-spec-to-section.ts` — accept playbookId, specLibraryId, sectionId (nullable for ungrouped), orgId; requires `specLibraryRepo` to fetch library spec data for denormalization; verify playbook exists; verify section exists (if sectionId provided); check duplicate via `existsInPlaybook`; look up library spec via `specLibraryRepo.findById`; copy all fields (title, severity, systemUnderTest, description, testSteps, preconditions, expectedResult, artifactRequirements, testerNotes) into new playbook_spec row; auto-assign position (max+1); return created playbook spec DTO
- [x] T023 [US2] Implement `removeSpecFromSection` use case in `packages/domains/authoring/src/use-cases/remove-spec-from-section.ts` — accept specId, orgId; delete playbook spec row; no confirmation needed
- [x] T024 [US2] Implement `reorderSpecs` use case in `packages/domains/authoring/src/use-cases/reorder-specs.ts` — accept playbookId, sectionId (nullable), orderedIds array, orgId; batch update positions (0, 1, 2, ...)
- [x] T022a [P] [US2] Unit test `addSpecToSection` use case in `packages/domains/authoring/src/use-cases/__tests__/add-spec-to-section.test.ts` — test: adds spec successfully, throws `AUTHOR_PLAYBOOK_NOT_FOUND` for missing playbook, throws `AUTHOR_SECTION_NOT_FOUND` for missing section, throws `AUTHOR_PLAYBOOK_SPEC_DUPLICATE` for duplicate spec, throws `AUTHOR_SPEC_NOT_FOUND` for missing library spec, copies all fields from library spec
- [x] T023a [P] [US2] Unit test `removeSpecFromSection` use case in `packages/domains/authoring/src/use-cases/__tests__/remove-spec-from-section.test.ts` — test: removes spec successfully, handles non-existent spec gracefully
- [x] T024a [P] [US2] Unit test `reorderSpecs` use case in `packages/domains/authoring/src/use-cases/__tests__/reorder-specs.test.ts` — test: reorders positions correctly (0,1,2...), throws `AUTHOR_PLAYBOOK_NOT_FOUND` for missing playbook
- [x] T025 [US2] Implement `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; middleware: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`; validate with `AddSpecFromLibraryRequestSchema`; use `withTransaction` for duplicate check + insert; return 201; add span attributes (pattern: /project:new-route)
- [x] T026 [US2] Implement `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; middleware: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`; return 204
- [x] T027 [US2] Implement `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; validate with `ReorderSpecsRequestSchema` (include `sectionId` field); return 200
- [x] T028 [P] [US2] Create `useAddSpecToPlaybook` hook in `packages/domains/authoring/src/ui/hooks/useAddSpecToPlaybook.ts` — POST to `/api/orgs/:orgSlug/playbooks/:playbookId/specs`; accept `invalidateKeys`
- [x] T029 [P] [US2] Create `useRemoveSpecFromPlaybook` hook in `packages/domains/authoring/src/ui/hooks/useRemoveSpecFromPlaybook.ts` — DELETE to `/api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId`; accept `invalidateKeys`
- [x] T030 [P] [US2] Create `useReorderSpecs` hook in `packages/domains/authoring/src/ui/hooks/useReorderSpecs.ts` — POST to `/api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder`; accept `invalidateKeys`
- [x] T031 [P] [US2] Create `useSpecLibrarySearch` hook in `packages/domains/authoring/src/ui/hooks/useSpecLibrarySearch.ts` — GET existing `/api/orgs/:orgSlug/specs?q=term` endpoint; accept `queryKey`; debounce search input (300ms)
- [x] T032 [US2] Create `SpecRow` component in `packages/domains/authoring/src/ui/components/SpecRow.tsx` — render drag handle (six-dot icon), title, severity badge (if set), system under test (if set), action menu with "Remove from playbook"; read-only (no expand on click); accept `onRemove` callback
- [x] T033 [US2] Create `SpecLibraryPicker` component in `packages/domains/authoring/src/ui/components/SpecLibraryPicker.tsx` — search input with live filtering via `useSpecLibrarySearch`; results show title + severity badge + system under test; already-added specs (by `specLibraryId`) visually marked and non-selectable; stays open after selection; empty states for no specs and no results; accept `onAdd(specLibraryId)` callback and `addedSpecLibraryIds` set; dismissable by user
- [x] T034 [US2] Integrate spec management into `PlaybookEditor` component — render `SpecRow` components in ungrouped zone ordered by position; wire "Add from library" button to open `SpecLibraryPicker` for ungrouped zone (sectionId=null); wire remove action; wire drag-and-drop reorder within ungrouped zone using `@dnd-kit`; restrict DnD to same container (no cross-zone dragging)
- [x] T035 [US2] Update `$playbookId.tsx` route page to pass spec management hooks (`useAddSpecToPlaybook`, `useRemoveSpecFromPlaybook`, `useReorderSpecs`) and `playbookKeys` invalidation keys to `PlaybookEditor`

**Checkpoint**: Admin can create a playbook and add/remove/reorder specs from the library in the ungrouped zone. Flat-checklist MVP is fully functional.

---

## Phase 5: User Story 3 — Organise Playbook with Sections (Priority: P2)

**Goal**: Admin adds named sections, renames them inline, deletes them (with confirmation if specs exist), and reorders via drag-and-drop.

**Independent Test**: Add sections, rename one, reorder via drag, delete empty section (immediate), delete section with specs (confirmation), verify structure persists.

### Implementation for User Story 3

- [x] T036 [P] [US3] Implement `createSection` use case in `packages/domains/authoring/src/use-cases/create-section.ts` — accept playbookId, name (1-255), orgId; verify playbook exists; auto-assign position (max+1); return section DTO
- [x] T037 [P] [US3] Implement `updateSection` use case in `packages/domains/authoring/src/use-cases/update-section.ts` — accept sectionId, name, orgId; verify section exists; return updated section DTO
- [x] T038 [P] [US3] Implement `deleteSection` use case in `packages/domains/authoring/src/use-cases/delete-section.ts` — accept sectionId, orgId; verify section exists; delete (DB cascade handles spec rows); return void
- [x] T039 [P] [US3] Implement `reorderSections` use case in `packages/domains/authoring/src/use-cases/reorder-sections.ts` — accept playbookId, orderedIds, orgId; batch update positions (0, 1, 2, ...)
- [x] T036a [P] [US3] Unit test `createSection` use case in `packages/domains/authoring/src/use-cases/__tests__/create-section.test.ts` — test: creates section with auto-position, throws `AUTHOR_PLAYBOOK_NOT_FOUND` for missing playbook
- [x] T037a [P] [US3] Unit test `updateSection` use case in `packages/domains/authoring/src/use-cases/__tests__/update-section.test.ts` — test: renames section, throws `AUTHOR_SECTION_NOT_FOUND` for missing section
- [x] T038a [P] [US3] Unit test `deleteSection` use case in `packages/domains/authoring/src/use-cases/__tests__/delete-section.test.ts` — test: deletes section, throws `AUTHOR_SECTION_NOT_FOUND` for missing section
- [x] T039a [P] [US3] Unit test `reorderSections` use case in `packages/domains/authoring/src/use-cases/__tests__/reorder-sections.test.ts` — test: reorders positions correctly, throws `AUTHOR_PLAYBOOK_NOT_FOUND` for missing playbook
- [x] T040 [US3] Implement `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; validate with `CreateSectionRequestSchema`; return 201 (pattern: /project:new-route)
- [x] T041 [US3] Implement `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; validate with `UpdateSectionRequestSchema`; return 200
- [x] T042 [US3] Implement `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; return 204
- [x] T043 [US3] Implement `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; validate with `ReorderSectionsRequestSchema`; return 200
- [x] T044 [P] [US3] Create `useCreateSection` hook in `packages/domains/authoring/src/ui/hooks/useCreateSection.ts` — POST to sections endpoint; accept `invalidateKeys`
- [x] T045 [P] [US3] Create `useUpdateSection` hook in `packages/domains/authoring/src/ui/hooks/useUpdateSection.ts` — PATCH to sections/:sectionId endpoint; accept `invalidateKeys`
- [x] T046 [P] [US3] Create `useDeleteSection` hook in `packages/domains/authoring/src/ui/hooks/useDeleteSection.ts` — DELETE to sections/:sectionId endpoint; accept `invalidateKeys`
- [x] T047 [P] [US3] Create `useReorderSections` hook in `packages/domains/authoring/src/ui/hooks/useReorderSections.ts` — POST to sections/reorder endpoint; accept `invalidateKeys`
- [x] T048 [US3] Create `SectionCard` component in `packages/domains/authoring/src/ui/components/SectionCard.tsx` — render drag handle (six-dot icon), inline-editable section name (click to edit, Enter/blur to save), action menu (three-dot icon) with "Delete section", spec list area with "Add from library" footer button; accept `onRename`, `onDelete`, `onAddSpec` callbacks; empty section shows placeholder; confirmation dialog for non-empty section deletion ("Delete this section? All N specs...")
- [x] T049 [US3] Integrate section management into `PlaybookEditor` — render `SectionCard` components below ungrouped zone ordered by position; "Add section" button at bottom appends new section with focused name field; wire section drag-and-drop reorder using `@dnd-kit` (sections only, ungrouped zone fixed at top); wire create/rename/delete section hooks
- [x] T050 [US3] Update `$playbookId.tsx` to pass section hooks (`useCreateSection`, `useUpdateSection`, `useDeleteSection`, `useReorderSections`) and invalidation keys to `PlaybookEditor`

**Checkpoint**: Sections can be created, renamed, reordered, and deleted within the playbook editor. Structure persists across reloads.

---

## Phase 6: User Story 4 — Add Specs to Sections (Priority: P2)

**Goal**: Admin adds specs from library into specific sections. Specs in sections can be reordered within their section but not dragged between sections.

**Independent Test**: Create sections, add specs to each, reorder specs within a section, verify cross-playbook duplicate prevention works across sections and ungrouped zone.

### Implementation for User Story 4

- [x] T051 [US4] Update `SectionCard` to render `SpecRow` components for each spec in the section; wire "Add from library" button in section footer to open `SpecLibraryPicker` with the section's `sectionId` context; wire spec reorder drag-and-drop within the section using `@dnd-kit` (restrict to same section container)
- [x] T052 [US4] Update `SpecLibraryPicker` to accept a `targetSectionId` prop (nullable) that is passed when calling `onAdd` — the picker component itself doesn't change behaviour, but the parent passes the correct sectionId for the add-spec API call
- [x] T053 [US4] Update `PlaybookEditor` to track all added `specLibraryId` values across ungrouped zone and all sections; pass the unified set to `SpecLibraryPicker` for cross-zone duplicate prevention
- [x] T054 [US4] Update `$playbookId.tsx` to wire section-level spec management — pass `useAddSpecToPlaybook`, `useRemoveSpecFromPlaybook`, `useReorderSpecs` hooks to `SectionCard` via `PlaybookEditor`

**Checkpoint**: Full structured playbook experience — sections with specs, reordering, and duplicate prevention across all zones.

---

## Phase 7: User Story 5 — Edit Playbook Metadata Inline (Priority: P3)

**Goal**: Admin edits playbook name, description, and environment inline on the editor page. Changes save immediately on blur/Enter.

**Independent Test**: Click playbook name → edit → press Enter → verify saved. Clear name → validation error shown, previous name restored. Change environment → saved immediately.

### Implementation for User Story 5

- [x] T055 [US5] Implement `updatePlaybook` use case in `packages/domains/authoring/src/use-cases/update-playbook.ts` — accept playbookId, partial update (name, description, environmentId), orgId; validate name if provided (1-255 chars, throw `AUTHOR_PLAYBOOK_NAME_INVALID` if empty); update `updated_at`; return updated playbook DTO
- [x] T055a [P] [US5] Unit test `updatePlaybook` use case in `packages/domains/authoring/src/use-cases/__tests__/update-playbook.test.ts` — test: updates name/description/environmentId, throws `AUTHOR_PLAYBOOK_NOT_FOUND` for missing playbook, throws `AUTHOR_PLAYBOOK_NAME_INVALID` for empty name
- [x] T056 [US5] Implement `PATCH /api/orgs/:orgSlug/playbooks/:playbookId` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; validate with `UpdatePlaybookRequestSchema`; return 200 (pattern: /project:new-route)
- [x] T057 [US5] Create `useUpdatePlaybook` hook in `packages/domains/authoring/src/ui/hooks/useUpdatePlaybook.ts` — PATCH to `/api/orgs/:orgSlug/playbooks/:playbookId`; accept `invalidateKeys`
- [x] T058 [US5] Create `PlaybookEditorHeader` component in `packages/domains/authoring/src/ui/components/PlaybookEditorHeader.tsx` — inline-editable name (click to edit, Enter/blur to save, validation error on empty restores previous), inline-editable description (collapsed if empty, click to expand textarea, blur to save), environment badge (click to open dropdown of managed environments, select saves immediately); accept `onUpdate` callback
- [x] T059 [US5] Replace inline header in `PlaybookEditor` with `PlaybookEditorHeader` component; wire `useUpdatePlaybook` hook with playbook detail invalidation keys

**Checkpoint**: All metadata fields are editable inline with immediate persistence.

---

## Phase 8: User Story 6 — View Playbook List (Priority: P3)

**Goal**: All members see playbook list with name, environment, spec count, created date. Admins/owners see "+ New playbook" button and can click through to editor. Empty state shown when no playbooks exist.

**Independent Test**: Visit playbook list, verify data columns, verify empty state, verify role-based button visibility, click through to editor.

### Implementation for User Story 6

- [x] T060 [US6] Implement `GET /api/orgs/:orgSlug/playbooks` route in `apps/api/src/routes/authoring.ts` — replace 501 stub; middleware: `[orgScopeMiddleware]` (all roles); call `findByOrgWithCounts`; join environments for `environmentName`; count playbook_specs for `specCount`; return non-archived playbooks (pattern: /project:new-route)
- [x] T061 [US6] Create `usePlaybookList` hook in `packages/domains/authoring/src/ui/hooks/usePlaybookList.ts` — GET `/api/orgs/:orgSlug/playbooks`; accept `queryKey`
- [x] T062 [P] [US6] Create `PlaybookListTable` component in `packages/domains/authoring/src/ui/components/PlaybookListTable.tsx` — table with columns: name, environment (if set), spec count, created date; clickable rows navigate to editor (admin/owner) or no-op (member); accept `onRowClick` callback and `role`
- [x] T063 [P] [US6] Create `PlaybookListEmptyState` component in `packages/domains/authoring/src/ui/components/PlaybookListEmptyState.tsx` — "No playbooks yet" message with "+ New playbook" button (visible only for admin/owner); accept `onCreateClick` callback and `role`
- [x] T064 [US6] Implement `index.tsx` route page in `apps/app/src/routes/_authenticated/$orgSlug/playbooks/index.tsx` — heading "Playbooks"; "+ New playbook" button (admin/owner only, navigates to `new`); compose `PlaybookListTable` or `PlaybookListEmptyState`; use `usePlaybookList` with `playbookKeys.list(orgSlug, {})`; get role from `useOrgContext()`; admin/owner rows navigate to `$playbookId`

**Checkpoint**: Playbook list page is fully functional with role-based access, data columns, and empty state.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: OTel attributes, error verification, build validation

- [ ] T065a Integration test playbook CRUD routes in `apps/api/src/routes/__tests__/authoring-playbooks.spec.ts` — test: POST creates playbook (201), POST rejects empty name (400), GET lists playbooks with counts (200), GET detail returns sections + ungrouped specs (200), GET detail returns 404 for missing playbook, PATCH updates metadata (200), PATCH rejects empty name (400), role guard blocks member on POST/PATCH (403), org_id boundary isolation (playbook from org A not visible to org B)
- [ ] T065b Integration test section CRUD routes in `apps/api/src/routes/__tests__/authoring-sections.spec.ts` — test: POST creates section with auto-position (201), PATCH renames section (200), DELETE removes section (204), DELETE cascades spec removal, POST reorder updates positions (200), role guard blocks member (403), section not found returns 404
- [ ] T065c Integration test spec management routes in `apps/api/src/routes/__tests__/authoring-playbook-specs.spec.ts` — test: POST adds spec from library (201), POST rejects duplicate spec (409), POST with sectionId adds to section (201), DELETE removes spec (204), POST reorder updates positions (200), role guard blocks member (403), spec fields are denormalized correctly from library
- [x] T065 [P] Verify all playbook route handlers in `apps/api/src/routes/authoring.ts` add span attributes via `getSpan(request)` — at minimum: `playbook.id`, `org.slug`; section routes add `section.id`; spec routes add `spec.id`
- [x] T066 [P] Verify all new error paths use domain-specific error codes from `packages/shared/src/errors/codes.ts` — no ad-hoc string errors; `AUTHOR_PLAYBOOK_NOT_FOUND`, `AUTHOR_SECTION_NOT_FOUND`, `AUTHOR_PLAYBOOK_NAME_INVALID`, `AUTHOR_PLAYBOOK_SPEC_DUPLICATE` all used correctly
- [x] T067 [P] Export all new use cases, hooks, and components from `packages/domains/authoring/src/index.ts` and `packages/domains/authoring/src/ui/index.ts` barrel files
- [x] T068 Run `pnpm turbo run build typecheck` to verify full monorepo compiles cleanly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (migration, schema, types must exist)
- **User Stories (Phase 3+)**: All depend on Phase 2 completion (repositories and ports must be implemented)
  - US1 (Phase 3): Can start after Phase 2
  - US2 (Phase 4): Depends on US1 (editor page must exist)
  - US3 (Phase 5): Depends on US1 (editor page must exist)
  - US4 (Phase 6): Depends on US2 + US3 (spec picker + sections must exist)
  - US5 (Phase 7): Depends on US1 (editor page must exist) — can run in parallel with US2/US3
  - US6 (Phase 8): Depends on Phase 2 only (independent of editor stories)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → US1 (Create Playbook)
                                           ├→ US2 (Add Specs) → US4 (Specs in Sections)
                                           ├→ US3 (Sections)  ↗
                                           ├→ US5 (Edit Metadata) [parallel with US2/US3]
                                           └→ US6 (List Page) [parallel with US2/US3/US4/US5]
```

### Within Each User Story

- Use cases before API routes
- API routes before UI hooks
- UI hooks before components
- Components before route page integration

### Parallel Opportunities

- Phase 1: T003, T004, T005 can run in parallel
- Phase 2: T006, T007, T008 can run in parallel; T009, T010, T011 can run in parallel (after port extensions)
- US1: T016, T017 can run in parallel
- US2: T028, T029, T030, T031 can run in parallel; T032, T033 can run in parallel
- US3: T036, T037, T038, T039 can run in parallel; T044-T047 can run in parallel
- US5 and US6 can run in parallel with US2/US3
- US6: T062, T063 can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all hooks in parallel (different files, no dependencies):
Task: T028 "Create useAddSpecToPlaybook hook"
Task: T029 "Create useRemoveSpecFromPlaybook hook"
Task: T030 "Create useReorderSpecs hook"
Task: T031 "Create useSpecLibrarySearch hook"

# Launch components in parallel (different files):
Task: T032 "Create SpecRow component"
Task: T033 "Create SpecLibraryPicker component"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Create a Minimal Playbook
4. Complete Phase 4: US2 — Add Specs from Library
5. **STOP and VALIDATE**: Flat-checklist playbook is fully functional
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Admin can create playbooks (MVP skeleton)
3. US2 → Admin can populate playbooks with specs (MVP complete!)
4. US3 → Admin can organise with sections
5. US4 → Admin can add specs to sections (full structured experience)
6. US5 + US6 → Polish: inline metadata editing + list page

### Suggested MVP Scope

**US1 + US2** (Phases 1-4, tasks T001-T035): Delivers a fully functional flat-checklist playbook where admins can create playbooks and populate them with specs from the library. This is the minimum that provides real user value.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All routes exist as 501 stubs — implementation replaces stubs in-place
- All repositories exist as empty stubs — implementation fills in Kysely queries
- Query keys (`playbookKeys`) already exist in `apps/app/src/api/query-keys.ts`
- Composition root already wires playbook repos — verify but no changes needed
- No polling on playbook editor (constitution IV: single-author assumption in v1)
- Spec rows are read-only — no expand/edit in this feature
