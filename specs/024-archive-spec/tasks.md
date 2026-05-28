# Tasks: Archive Spec

**Input**: Design documents from `/specs/024-archive-spec/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Required by constitution (Principle III + Mandatory Per-Feature Deliverables). Unit tests for use-case error paths and integration tests for new route handlers are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project initialization needed — existing monorepo with all infrastructure in place.

*Phase skipped — no setup tasks required.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend mutations, shared schema changes, UI primitives, hooks, and tests that ALL user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 [P] Add `'archived'` and `'unarchived'` values to `SpecHistoryActionSchema` enum in `packages/shared/src/schemas/specs.ts`
- [x] T002 [P] Add `setArchived(id: string, orgId: string, isArchived: boolean): Promise<SpecLibraryEntry | undefined>` method to `SpecLibraryRepository` port interface in `packages/domains/authoring/src/ports/spec-library-repository.ts`
- [x] T003 Implement `setArchived()` in Kysely adapter `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` — UPDATE `is_archived` and `updated_at` WHERE `id` and `org_id`, return mapped entry or undefined (depends on T002 for method signature)
- [x] T004 Replace TODO stub in `packages/domains/authoring/src/use-cases/archive-library-spec.ts` with full implementation: accept `{ specId, orgId, archive: boolean }`, call `specLibraryRepo.findById()` to verify existence (throw `AuthorSpecNotFoundError` if missing), call `specLibraryRepo.setArchived()`, return updated entry (pattern: /project:new-route)
- [x] T005 Export `archiveLibrarySpec` use case from `packages/domains/authoring/src/use-cases/index.ts` and `packages/domains/authoring/src/index.ts`
- [x] T006 Add PATCH `/api/orgs/:orgSlug/specs/:specId/archive` and PATCH `/api/orgs/:orgSlug/specs/:specId/unarchive` route handlers in `apps/api/src/routes/authoring.ts` — use `orgScopeMiddleware` + `roleGuard('admin', 'owner')` preHandlers, call `archiveLibrarySpec` use case, then call `recordChangelog` from audit domain with action `'archived'`/`'unarchived'` and `fieldChanges: null`, add `getSpan(request)` attributes for `spec.id` and `spec.action`, return full `LibrarySpec` DTO (pattern: /project:new-route)
- [x] T007 [P] Write unit tests for `archiveLibrarySpec` use case in `packages/domains/authoring/src/use-cases/__tests__/archive-library-spec.test.ts` — mock `specLibraryRepo` with `vi.fn()`; assert: (1) archive sets `isArchived=true` and returns updated entry, (2) unarchive sets `isArchived=false` and returns updated entry, (3) throws `AuthorSpecNotFoundError` when `findById()` returns undefined, (4) idempotent — archiving an already-archived spec succeeds without error
- [x] T008 [P] Write integration tests for PATCH archive/unarchive endpoints in `apps/api/src/routes/authoring.spec.ts` — use `buildApp()` + `app.inject()` pattern; assert: (1) happy path returns 200 with updated spec DTO, (2) returns 404 `AUTHOR_SPEC_NOT_FOUND` for non-existent spec, (3) returns 403 `AUTH_ROLE_INSUFFICIENT` when caller is a member, (4) `org_id` boundary — cannot archive a spec from a different org
- [x] T009 [P] Create reusable `ConfirmDialog` component in `apps/app/src/components/ui/ConfirmDialog.tsx` — accept `open`, `onConfirm`, `onCancel`, `title`, `description`, `confirmLabel`, `cancelLabel`, `variant` ('default' | 'destructive') props; render modal overlay with card, two buttons; use inline styles consistent with existing codebase patterns
- [x] T010 [P] Create `Toast` notification system in `apps/app/src/components/ui/Toast.tsx` — implement `ToastProvider` (React context), `useToast()` hook returning `{ toast(message, variant) }`, auto-dismiss after 4s, support `success` and `error` variants, positioned bottom-right; wrap app in provider in `apps/app/src/app.tsx`
- [x] T011 [P] Create `useArchiveSpec` mutation hook in `packages/domains/authoring/src/ui/hooks/use-archive-spec.ts` — PATCH to `/api/orgs/{orgSlug}/specs/{specId}/archive`, accept `orgSlug`, `specId`, `invalidateKeys` params, use `useApiMutation` from `@nohotfix/api-client`
- [x] T012 [P] Create `useUnarchiveSpec` mutation hook in `packages/domains/authoring/src/ui/hooks/use-unarchive-spec.ts` — PATCH to `/api/orgs/{orgSlug}/specs/{specId}/unarchive`, accept `orgSlug`, `specId`, `invalidateKeys` params, use `useApiMutation` from `@nohotfix/api-client`
- [x] T013 Export `useArchiveSpec`, `useUnarchiveSpec` from `packages/domains/authoring/src/ui/index.ts`
- [x] T014 [P] Update `describeHistoryAction()` utility in `packages/domains/authoring/src/ui/` to handle `'archived'` → `"Archived"` and `'unarchived'` → `"Unarchived"` action labels

**Checkpoint**: Foundation ready — backend endpoints operational, tests passing, UI primitives and hooks available. User story implementation can now begin.

---

## Phase 3: User Story 1 — Archive from Overview Table (Priority: P1) + User Story 2 — Unarchive from Archived Tab (Priority: P1) MVP

**Goal**: Admins can archive an active spec and unarchive an archived spec directly from the Spec Library overview table's three-dot action menu.

**Independent Test**: Create a spec, archive it from the Active tab action menu, verify it moves to the Archived tab. Then unarchive it from the Archived tab action menu, verify it returns to the Active tab. Verify members see no archive/unarchive options.

### Implementation

- [x] T015 [US1] [US2] Modify `SpecLibraryTable` in `packages/domains/authoring/src/ui/components/SpecLibraryTable.tsx` — replace the current View button (`&#8942;`) with a custom dropdown action menu (click-outside-to-close, inline styles) that shows: on Active tab → "View", "Edit spec", "Archive" (admin/owner only); on Archived tab → "View", "Unarchive" (admin/owner only). Accept new props: `tab` ('active' | 'archived'), `userRole` ('owner' | 'admin' | 'member'), `onArchiveClick(specId)`, `onUnarchiveClick(specId)`. Hide "Edit spec" on archived tab. Hide "Archive"/"Unarchive" for members.
- [x] T016 [US1] [US2] Wire archive and unarchive actions in overview route `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx` — import `useArchiveSpec`, `useUnarchiveSpec`, `ConfirmDialog` (from `../../components/ui/ConfirmDialog`), `useToast`; manage dialog open state and selected spec ID; render `ConfirmDialog` with title "Archive this spec?", description "Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.", confirmLabel "Archive spec", variant "destructive"; on archive confirm: call mutation with optimistic cache update (remove row from active list), show "Spec archived." success toast on success, "Failed to archive spec. Please try again." error toast on failure; on unarchive: call mutation immediately (no dialog) with optimistic cache update (remove row from archived list), show "Spec unarchived." / "Failed to unarchive spec. Please try again." toasts; pass `specKeys.lists(orgSlug)`, `specKeys.detail(orgSlug, specId)`, `specKeys.history(orgSlug, specId)` as `invalidateKeys`

**Checkpoint**: Archive from Active tab and Unarchive from Archived tab fully functional. Core MVP complete.

---

## Phase 4: User Story 3 — Archive from Spec Detail Page (Priority: P2) + User Story 4 — View and Unarchive from Archived Detail Page (Priority: P2)

**Goal**: Admins can archive a spec from its detail page (redirects to overview). Archived spec detail pages show read-only content with an "Archived" badge and an "Unarchive" button that restores the spec in-place.

**Independent Test**: View a spec's detail page, click "Archive spec", confirm → redirected to overview with success toast. Navigate to archived spec detail → see badge, no edit button, click "Unarchive" → badge gone, edit + archive buttons appear.

### Implementation

- [x] T017 [P] [US4] Modify `SpecDetail` component in `packages/domains/authoring/src/ui/components/SpecDetail.tsx` — add an `isArchived` prop; when true, render an "Archived" badge (styled inline: background #fef2f2, color #991b1b, border-radius 4px, padding 2px 8px, font-weight 600) next to the spec title in the header area
- [x] T018 [P] [US3] [US4] Create `SpecDetailActions` component in `packages/domains/authoring/src/ui/components/SpecDetailActions.tsx` — accept `isArchived`, `userRole`, `onEditClick`, `onArchiveClick`, `onUnarchiveClick` props; render: when active + admin/owner → "Edit spec" button + "Archive spec" button; when archived + admin/owner → "Unarchive" button only; when member → no action buttons. Export from `packages/domains/authoring/src/ui/index.ts`
- [x] T019 [US3] [US4] Wire actions in detail route `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.index.tsx` — replace existing inline Edit button with `SpecDetailActions`; import `useArchiveSpec`, `useUnarchiveSpec`, `ConfirmDialog` (from `../../components/ui/ConfirmDialog`), `useToast`; render `ConfirmDialog` with archive-specific copy (same as T016); on archive confirm: call mutation then navigate to `/$orgSlug/spec-library` with success toast "Spec archived."; on unarchive: call mutation immediately, invalidate spec detail query to refresh page in-place, show "Spec unarchived." toast; pass `isArchived` from spec data to `SpecDetail` and `SpecDetailActions`; pass `specKeys` as `invalidateKeys`

**Checkpoint**: All four entry points (archive from overview, archive from detail, unarchive from overview, unarchive from detail) are functional.

---

## Phase 5: User Story 5 — Changelog Recording (Priority: P2)

**Goal**: Archive and unarchive actions are recorded in the changelog and visible in the spec's history panel with correct actor, action label, and timestamp.

**Independent Test**: Archive a spec, view its history panel → "Archived" entry with admin name and timestamp. Unarchive → "Unarchived" entry appears.

### Implementation

- [x] T020 [US5] Verify changelog entries render correctly in `SpecHistoryTimeline` in `packages/domains/authoring/src/ui/components/SpecHistoryTimeline.tsx` — confirm the `describeHistoryAction()` update from T014 produces "Archived" and "Unarchived" labels. If the component filters or groups actions, ensure `'archived'` and `'unarchived'` are not excluded. No changes expected if the component renders all actions generically.

**Checkpoint**: All user stories complete. Full feature functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and quality assurance across all user stories.

- [x] T021 Verify all new service methods have OTel span attributes via `getSpan(request)` in route handlers (`apps/api/src/routes/authoring.ts`) — confirm `spec.id` and `spec.action` attributes are set on archive and unarchive endpoints
- [x] T022 Verify all error paths use domain-specific error codes — confirm `AUTHOR_SPEC_NOT_FOUND` (from `archiveLibrarySpec` use case) and `AUTH_ROLE_INSUFFICIENT` (from `roleGuard` middleware) are thrown correctly, no ad-hoc string errors
- [x] T023 Verify FR-016: navigating to the edit URL of an archived spec (`/$orgSlug/spec-library/$specId/edit`) redirects to the spec detail page — confirm existing guard in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.edit.tsx` handles this
- [x] T024 Verify FR-013: members can view archived specs on the Archived tab and on the spec detail page in read-only mode — confirm no role guard blocks member access to archived content
- [x] T025 Run `pnpm turbo run build typecheck test` to confirm full pipeline passes
- [ ] T026 Run quickstart.md verification checklist — manually test all 9 scenarios listed in `specs/024-archive-spec/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — existing project
- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories.
- **US1+US2 (Phase 3)**: Depends on Phase 2 completion
- **US3+US4 (Phase 4)**: Depends on Phase 2 completion. Can run in parallel with Phase 3.
- **US5 (Phase 5)**: Depends on Phase 2 (T014 specifically). Can run in parallel with Phases 3 and 4.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 + US2 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **US3 + US4 (P2)**: Can start after Phase 2 — no cross-story dependencies (ConfirmDialog is an app-global primitive from Phase 2)
- **US5 (P2)**: Can start after T014 (Phase 2) — independent of other stories

### Within Each Phase

- Phase 2: T001, T002, T007, T008, T009, T010, T011, T012, T014 can all run in parallel. T003 depends on T002. T004 depends on T002. T005 depends on T004. T006 depends on T004+T005. T013 depends on T011+T012.
- Phase 3: T015 → T016 (sequential within phase)
- Phase 4: T017 and T018 can run in parallel. T019 depends on T017+T018.
- Phase 5: T020 depends only on T014.

### Parallel Opportunities

```
Phase 2 (9 parallel tasks):
  T001 | T002 | T007 | T008 | T009 | T010 | T011 | T012 | T014

After Phase 2, three independent tracks:
  Track A (US1+US2): T015 → T016
  Track B (US3+US4): T017 | T018 → T019
  Track C (US5):     T020
```

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all independent foundational tasks together:
T001: Add archived/unarchived to SpecHistoryActionSchema
T002: Add setArchived() to SpecLibraryRepository port
T007: Write use-case unit tests
T008: Write route integration tests
T009: Create ConfirmDialog component
T010: Create Toast notification system
T011: Create useArchiveSpec hook
T012: Create useUnarchiveSpec hook
T014: Update describeHistoryAction utility

# Then sequential:
T003: Implement setArchived() in Kysely adapter (needs T002)
T004: Implement archive use case (needs T002)
T005: Export use case (needs T004)
T006: Add route handlers (needs T004, T005)
T013: Export hooks (needs T011, T012)
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 2: Foundational (all backend + shared + tests)
2. Complete Phase 3: US1 + US2 (overview table archive/unarchive)
3. **STOP and VALIDATE**: Archive from Active tab, unarchive from Archived tab
4. Deploy/demo if ready — core value delivered

### Incremental Delivery

1. Phase 2 → Foundation ready (tests passing)
2. Phase 3 (US1+US2) → Test independently → Deploy (MVP!)
3. Phase 4 (US3+US4) → Test independently → Deploy (detail page actions)
4. Phase 5 (US5) → Test independently → Deploy (changelog labels)
5. Phase 6 → Final quality pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are grouped in Phase 3 because they share the same `SpecLibraryTable` component
- US3 and US4 are grouped in Phase 4 because they share the same detail page
- No database migration needed — `is_archived` column already exists
- No new error codes needed — reuses `AUTHOR_SPEC_NOT_FOUND` and `AUTH_ROLE_INSUFFICIENT`
- `ConfirmDialog` and `Toast` are app-global UI primitives (not domain-specific) and live in `apps/app/src/components/ui/`; route files compose them with feature-specific copy (no domain package imports from `apps/app/`)
