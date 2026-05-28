# Tasks: Spec History

**Input**: Design documents from `/specs/022-spec-history/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec. Test tasks omitted.

**Organization**: Tasks grouped by user story. US2 (write side) before US1 (read side) because recording must exist before display.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared types, schemas, and Audit domain type definitions needed by all stories

- [X] T001 [P] Add `SpecHistoryAction` type and `SpecHistoryEntry` DTO interface to `packages/shared/src/types/specs.ts`. Action values: `created`, `title_changed`, `description_updated`, `tags_changed`, `duration_changed`, `artifact_added`, `artifact_removed`, `artifact_modified`. DTO fields: `id`, `action`, `fieldChanges`, `actorName`, `isRemovedMember`, `createdAt`
- [X] T002 [P] Add `SpecHistoryEntrySchema` and `SpecHistoryResponseSchema` Zod schemas to `packages/shared/src/schemas/specs.ts` per contracts/api.md. Export from `packages/shared/src/index.ts`
- [X] T003 [P] Add `SpecChangelogEntry` interface to `packages/domains/audit/src/types.ts` (domain-internal read model with `isRemovedMember: boolean`). Import `SpecHistoryAction` from `@nohotfix/shared` — do NOT redefine it locally

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Changelog repository method and composition root wiring that MUST be complete before any user story

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `findBySpecWithMembership(orgId: string, specId: string): Promise<SpecChangelogEntry[]>` method to the `ChangelogRepository` port interface in `packages/domains/audit/src/ports/changelog-repository.ts`
- [X] T005 Implement `findBySpecWithMembership` in `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` using LEFT JOIN on `memberships` table per data-model.md read query. Must include `org_id` in WHERE clause, order by `created_at DESC`, and map `is_removed_member` boolean
- [X] T006 Export updated port and types from `packages/domains/audit/src/index.ts` barrel file

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 2 — Record Granular Field Changes on Save (Priority: P1) MVP

**Goal**: When a spec is created or updated, record one changelog entry per changed field with action type and old/new values

**Independent Test**: Edit a spec (change title and tags in one save), then query the changelog table to verify two separate entries were created with the same timestamp

### Implementation for User Story 2

- [X] T007 [US2] Create `recordSpecChanges` use case in `packages/domains/audit/src/use-cases/record-spec-changes.ts`. Accept old spec state, new spec state, actor info, and shared timestamp. Compare fields (title, description, tags, estimated_duration_minutes) and call `recordChangelog()` once per detected change. Skip no-op saves (no entries if nothing changed). Use `SpecHistoryAction` types for action values. For description, only detect change (no old/new content stored). Note: This use case will be wired into the PATCH /api/orgs/:orgSlug/specs/:specId route handler when `updateLibrarySpec` is implemented (currently a stub in a separate feature scope). Until then, only the `created` action is exercised via the existing POST route
- [X] T008 [US2] Export `recordSpecChanges` from `packages/domains/audit/src/use-cases/index.ts` and `packages/domains/audit/src/index.ts`
- [X] T009 [US2] Verify the existing POST spec creation route in `apps/api/src/routes/authoring.ts` already records a `created` changelog entry via `recordChangelog()` with correct `actor_name` from `request.orgContext`. No code changes needed — this satisfies FR-001. The PATCH update route wiring of `recordSpecChanges` is deferred until `updateLibrarySpec` is implemented (separate feature scope)

**Checkpoint**: `recordSpecChanges` use case is complete and unit-testable. Spec creation already records a "created" changelog entry (FR-001 satisfied). FR-002 through FR-013 integration is deferred until `updateLibrarySpec` PATCH route is implemented.

---

## Phase 4: User Story 1 — View Spec Change History (Priority: P1)

**Goal**: Any organisation member can navigate to a "History" tab on the spec detail page and see a reverse-chronological timeline of all changes

**Independent Test**: Create a spec (triggering a "created" entry), then navigate to the spec detail page History tab and verify the timeline shows the creation entry with actor name, action description, and relative timestamp

### Implementation for User Story 1

- [X] T010 [US1] Implement `getSpecChangelog` use case in `packages/domains/audit/src/use-cases/get-spec-changelog.ts` (currently a stub). Accept `orgId`, `specId`, and `changelogRepo` dep. Call `findBySpecWithMembership`. Return array of `SpecChangelogEntry` DTOs. Replace "Removed member" in `actorName` when `isRemovedMember` is true
- [X] T011 [US1] Export `getSpecChangelog` from `packages/domains/audit/src/use-cases/index.ts` and `packages/domains/audit/src/index.ts`
- [X] T012 [US1] Add `GET /api/orgs/:orgSlug/specs/:specId/history` route handler in `apps/api/src/routes/authoring.ts`. Use `orgScopeMiddleware` preHandler (all roles). Verify spec exists via `specLibraryRepo.findById` (throw `AUTHOR_SPEC_NOT_FOUND` if missing). Call `getSpecChangelog` use case. Return `{ entries }` response per contracts/api.md. Add OTel span attributes for `spec.id` (pattern: /project:new-route)
- [X] T013 [P] [US1] Add `specKeys.history(orgSlug: string, specId: string)` to `apps/app/src/api/query-keys.ts` following the existing hierarchical pattern: `[...specKeys.details(orgSlug), specId, 'history']`
- [X] T014 [P] [US1] Create `useSpecHistory` hook in `packages/domains/authoring/src/ui/hooks/use-spec-history.ts`. Accept `orgSlug`, `specId`, and `queryKey` as parameters (query key centralisation policy). Use `useApiQuery` from `@nohotfix/api-client` to fetch from `/api/orgs/${orgSlug}/specs/${specId}/history`. Validate response with `SpecHistoryResponseSchema`
- [X] T015 [US1] Create `SpecHistoryTimeline.tsx` component in `packages/domains/authoring/src/ui/components/`. Accept `entries` array prop typed as `SpecHistoryEntry[]`. Render reverse-chronological list with: actor name (or "Removed member"), human-readable action description, and relative timestamp. Use inline styles matching existing component patterns. Action descriptions: "created this spec", "changed title from 'X' to 'Y'", "updated description", "changed tags from 'a, b' to 'a, c'", "changed estimated duration from X to Y minutes", "added artifact requirement 'Label'", "removed artifact requirement 'Label'", "modified artifact requirement 'Label'". Show empty state message for specs with no history
- [X] T016 [US1] Add "History" tab to spec detail route in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx`. Add tab state management (default: "details" tab). Use same inline-style tab pattern from spec library index page (active/archived tabs). When "History" tab is active, render `SpecHistoryTimeline` via `useSpecHistory` hook, passing `specKeys.history(orgSlug, specId)` as query key. Keep existing spec detail content in "Details" tab
- [X] T017 [US1] Export `SpecHistoryTimeline` and `useSpecHistory` from `packages/domains/authoring/src/ui/index.ts` (or appropriate barrel file)

**Checkpoint**: History tab is visible on spec detail page. Shows "created" entry for newly created specs. Timeline displays actor name, action, and relative time.

---

## Phase 5: User Story 3 — Record Artifact Requirement Changes (Priority: P2)

**Goal**: When an admin adds, removes, or modifies artifact requirements on a spec, the system records granular changelog entries with artifact label and old/new state

**Independent Test**: Add an artifact requirement to a spec, modify it, then remove it. Navigate to History tab and verify three distinct entries appear.

### Implementation for User Story 3

- [X] T018 [US3] Extend `recordSpecChanges` in `packages/domains/audit/src/use-cases/record-spec-changes.ts` to detect artifact requirement changes. Compare old and new `artifact_requirements` JSONB arrays by label. Detect: additions (label exists in new but not old → `artifact_added`), removals (label exists in old but not new → `artifact_removed`), modifications (same label, different config → `artifact_modified`). Store artifact label in `field_changes.artifact.old/new` per data-model.md payloads

**Checkpoint**: All artifact requirement changes (add/remove/modify) are recorded as changelog entries alongside field changes.

---

## Phase 6: User Story 4 — Display Removed Members in History (Priority: P3)

**Goal**: When a history entry was created by a user who has been removed from the organisation, display "Removed member" instead of their name

**Independent Test**: Have a user make a spec change, remove that user from the org, then view the spec history and verify "Removed member" appears

### Implementation for User Story 4

- [X] T019 [US4] Verify `SpecHistoryTimeline.tsx` in `packages/domains/authoring/src/ui/components/` correctly renders "Removed member" when `isRemovedMember` is `true` on an entry. Style the "Removed member" text distinctly (e.g. muted/italic) to differentiate from active member names. This should already work from T015 — verify and add styling if needed

**Checkpoint**: Removed members display correctly in the history timeline with distinct visual treatment.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories

- [X] T020 Verify all new service methods (`recordSpecChanges`, `getSpecChangelog`) have OTel span instrumentation following existing `SnapshotService`/`ArtifactGateService` patterns in `packages/domains/audit/src/use-cases/`
- [X] T021 Verify no ad-hoc string errors — all error paths use domain error codes from `packages/shared/src/errors/codes.ts`. Confirm `AUTHOR_SPEC_NOT_FOUND` is reused correctly in the history endpoint. Verify no DELETE endpoint or scheduled cleanup targets changelog entries (FR-018: permanent retention)
- [X] T022 Verify `org_id` is included in all changelog queries in `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` (tenant isolation)
- [X] T023 Run `pnpm turbo run build typecheck test` to confirm everything compiles and passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. All T001-T003 are parallel
- **Foundational (Phase 2)**: Depends on Phase 1 (T003 for types). T004-T006 are sequential
- **US2 (Phase 3)**: Depends on Phase 2. T007 depends on T004 (repository port)
- **US1 (Phase 4)**: Depends on Phase 2. Can run in parallel with US2 (read side is independent of write side). T010-T012 are sequential; T013-T014 can parallel with T010-T012; T015 depends on T014; T016 depends on T013+T015
- **US3 (Phase 5)**: Depends on US2 (extends `recordSpecChanges`)
- **US4 (Phase 6)**: Depends on US1 (extends timeline rendering). Minimal work — mostly verification
- **Polish (Phase 7)**: Depends on all stories complete

### User Story Dependencies

- **US2 (P1)**: Can start after Phase 2 — no dependency on other stories
- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 (read side fetches existing changelog data)
- **US3 (P2)**: Depends on US2 (extends the `recordSpecChanges` function)
- **US4 (P3)**: Depends on US1 (extends the `SpecHistoryTimeline` component). Near-zero work if T015 is implemented correctly

### Within Each User Story

- Types/schemas before use cases
- Use cases before route handlers
- Route handlers before frontend hooks
- Hooks before components
- Components before route page integration

### Parallel Opportunities

- T001, T002, T003 (Phase 1) — all different files
- T013, T014 (US1) — query keys and hook are in different packages
- US1 and US2 can proceed in parallel after Phase 2

---

## Parallel Example: Phase 1 Setup

```text
# Launch all setup tasks together:
Task T001: "Add SpecHistoryAction type to packages/shared/src/types/specs.ts"
Task T002: "Add Zod schemas to packages/shared/src/schemas/specs.ts"
Task T003: "Add domain types to packages/domains/audit/src/types.ts"
```

## Parallel Example: US1 Backend + Frontend

```text
# After T012 (route handler), launch frontend tasks in parallel:
Task T013: "Add query key to apps/app/src/api/query-keys.ts"
Task T014: "Create useSpecHistory hook in packages/domains/authoring/src/ui/hooks/"
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup (shared types)
2. Complete Phase 2: Foundational (repository method)
3. Complete Phase 3: US2 — Record field changes (write side)
4. Complete Phase 4: US1 — View history (read side + frontend)
5. **STOP and VALIDATE**: Create a spec, verify "created" entry appears in History tab
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US2 (record changes) → Test via DB queries (MVP write side)
3. Add US1 (view history) → Test via browser → Deploy (MVP complete!)
4. Add US3 (artifact changes) → Test via browser → Deploy
5. Add US4 (removed members) → Test via browser → Deploy
6. Each story adds value without breaking previous stories

---

## Notes

- No database migration required — reuses existing `changelog` table
- `updateLibrarySpec` use case is currently a stub (TODO). The `recordSpecChanges` use case is ready but won't be exercised for field updates until the update use case is implemented. The `created` action is already working from the existing create flow.
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
