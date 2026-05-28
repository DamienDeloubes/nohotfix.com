# Tasks: Spec Library Overview

**Input**: Design documents from `/specs/020-spec-library-overview/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Integration tests for the API endpoint are included (constitutionally required for route handlers). Domain unit tests included for use case logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared Zod schemas and types that backend and frontend both consume

- [x] T001 Add `ListSpecsRequestSchema`, `SpecListItemSchema`, and `SpecListResultSchema` to `packages/shared/src/schemas/specs.ts`. `ListSpecsRequestSchema` validates query params: `tab` (enum active/archived, default active), `q` (string, max 200, optional), `severity` (enum critical/high/medium/low, optional), `sort` (enum title/system/severity/updated, default updated), `order` (enum asc/desc, default desc), `page` (number, min 1, default 1). `SpecListItemSchema` has fields: id (string), title (string), systemUnderTest (string|null), severity (string|null), tags (string[]), updatedAt (string). `SpecListResultSchema` wraps items array + total, page, pageSize (25), totalPages. Export inferred types `ListSpecsRequest`, `SpecListItem`, `SpecListResult` from `packages/shared/src/index.ts`

---

## Phase 2: Foundational (Backend — Blocking Prerequisites)

**Purpose**: API endpoint that serves ALL frontend user stories. Must complete before any frontend work begins.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `list()` method signature to the `SpecLibraryRepository` interface in `packages/domains/authoring/src/ports/spec-library-repository.ts`. Method signature: `list(params: { orgId: string; isArchived: boolean; search?: string; severity?: string; sort: string; order: string; limit: number; offset: number }): Promise<{ items: SpecLibraryEntry[]; total: number }>`. The items returned should only include list-view columns (id, title, system_under_test, severity, tags, updated_at) — not rich text JSONB fields (pattern: /project:new-route)
- [x] T003 Create `listLibrarySpecs` use case in `packages/domains/authoring/src/use-cases/list-library-specs.ts`. Define `ListLibrarySpecsDeps` (specLibraryRepo: SpecLibraryRepository) and `ListLibrarySpecsQuery` (orgId, tab, search, severity, sort, order, page). Use case computes offset from page (offset = (page-1)*25), maps tab to isArchived boolean, escapes search special chars (`%`, `_`, `\` → `\%`, `\_`, `\\`), calls repo.list(), returns `SpecListResult` DTO with items mapped to camelCase + ISO date strings, plus total/page/pageSize/totalPages. Export from `packages/domains/authoring/src/index.ts`
- [x] T004 [P] Create unit test in `packages/domains/authoring/src/use-cases/__tests__/list-library-specs.test.ts`. Test: offset calculation (page 1→0, page 3→50), search character escaping (`%`→`\%`, `_`→`\_`, `\`→`\\`), tab-to-isArchived mapping (active→false, archived→true), totalPages calculation (0 items→0, 25→1, 26→2, 50→2, 51→3), empty search string treated as undefined, DTO mapping (snake_case dates→ISO strings, null systemUnderTest preserved)
- [x] T005 Implement `list()` method in `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts`. Build Kysely query: SELECT only list columns (id, title, system_under_test, severity, tags, updated_at) FROM spec_library WHERE org_id = $orgId AND is_archived = $isArchived. Conditionally add: ILIKE search on title OR system_under_test (using `%${escapedSearch}%` pattern), severity equality filter. For sort: map 'title'→title, 'system'→system_under_test, 'updated'→updated_at, 'severity'→CASE expression (null→0, low→1, medium→2, high→3, critical→4). Apply ORDER BY + LIMIT + OFFSET. Run a parallel COUNT query with same WHERE conditions. Return `{ items, total }`
- [x] T006 Add `GET /api/orgs/:orgSlug/specs` route handler in `apps/api/src/routes/authoring.ts`, replacing the existing stub. Apply `orgScopeMiddleware` preHandler (no role restriction — all members can view). Parse query params with `ListSpecsRequestSchema.safeParse()`. Use `getSpan(request)` to set attributes: `org.slug`, `search.term`, `filter.severity`, `filter.tab`, `sort.column`, `sort.order`, `result.total`. Call `listLibrarySpecs` use case with deps from `request.server.root`. Return 200 with result DTO (pattern: /project:new-route)
- [x] T007 [P] Add integration tests for `GET /api/orgs/:orgSlug/specs` in `apps/api/src/routes/authoring.spec.ts`. Tests: (1) returns 200 with paginated list of active specs (default params), (2) returns only archived specs when tab=archived, (3) filters by severity, (4) searches by title substring, (5) searches by system_under_test substring, (6) sorts by title ascending, (7) sorts by severity descending (critical first), (8) returns page 2 with correct offset, (9) returns empty items array and total=0 when no matches, (10) returns 400 for invalid params (negative page, unknown sort column), (11) enforces org_id tenant boundary (specs from other org not returned), (12) accessible by member role (not admin-only)

**Checkpoint**: Backend API ready. `GET /api/orgs/:orgSlug/specs?tab=active&q=login&severity=critical&sort=title&order=asc&page=1` returns paginated results.

---

## Phase 3: User Story 1 — Browse the Spec Library (Priority: P1) MVP

**Goal**: Admin navigates to the Spec Library page and sees a paginated table of active specs sorted by last updated, with severity badges, tags, and row-click navigation.

**Independent Test**: Load the page with seed data; verify table renders columns, default sort, pagination controls, and row click navigates to detail page.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `useSpecList` hook in `packages/domains/authoring/src/ui/hooks/use-spec-list.ts`. Accept options: `{ apiUrl, getAccessToken, orgSlug, queryKey, params: { tab, q, severity, sort, order, page } }`. Fetch `GET /api/orgs/${orgSlug}/specs` with query params. Return TanStack `useQuery` result with `staleTime: 30_000`, `retry: 1`, `enabled: !!orgSlug`. Parse response with `SpecListResultSchema`. Export from `packages/domains/authoring/src/ui/index.ts`
- [x] T009 [P] [US1] Create `SeverityBadge.tsx` in `packages/domains/authoring/src/ui/components/SeverityBadge.tsx`. Accept `severity: 'critical' | 'high' | 'medium' | 'low' | null`. Render a styled span with colour-coded background: critical=red, high=orange, medium=yellow, low=grey. Display severity label text. Render "—" if null. Use inline styles following project convention
- [x] T010 [P] [US1] Create `TagPills.tsx` in `packages/domains/authoring/src/ui/components/TagPills.tsx`. Accept `tags: string[]`. Display up to 3 tags as small pill spans (inline-block, border-radius, small font). If more than 3, show a "+N more" badge. Full tag list shown on hover via `title` attribute on the overflow badge
- [x] T011 [P] [US1] Create `SpecLibraryPagination.tsx` in `packages/domains/authoring/src/ui/components/SpecLibraryPagination.tsx`. Accept `{ page, totalPages, total, pageSize, onPageChange }`. Render "Showing X–Y of Z specs" text, "Previous" button (disabled on page 1), "Next" button (disabled on last page), "Page X of Y" indicator. Call `onPageChange(newPage)` on button clicks
- [x] T012 [US1] Create `SpecLibraryTable.tsx` in `packages/domains/authoring/src/ui/components/SpecLibraryTable.tsx`. Accept `{ items: SpecListItem[], isLoading, onRowClick, sort, order, onSortChange }`. Render HTML table with columns: Title, System under test, Severity, Tags, Last updated. Title column: truncate with CSS `max-width` + `text-overflow: ellipsis` at ~80ch, full title in `title` attribute. System under test: show "—" if null. Severity: render `SeverityBadge`. Tags: render `TagPills`. Last updated: display as relative time (e.g., "2 hours ago", "3 days ago") — use a simple helper function. Rows have `cursor: pointer` and `onClick` → `onRowClick(item.id)`. Include a three-dot action menu (right-aligned) with "View" option. Show a loading spinner overlay when `isLoading` is true. Note: column headers are rendered as plain text in this task; sort indicators (arrows) and click-to-sort interaction are added in T019 (US4). React JSX auto-escapes HTML entities in spec titles — no manual sanitisation needed
- [x] T013 [US1] Update `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Add TanStack Router `validateSearch` with Zod schema for all URL params (tab, q, severity, sort, order, page — matching `ListSpecsRequestSchema` defaults). Use `Route.useSearch()` to read search params. Use `Route.useNavigate()` to update search params on filter/sort/page changes. Instantiate `useSpecList` hook with `specKeys.list(orgSlug, searchParams)` as queryKey. Compose page: header with "Spec Library" title, `SpecLibraryTable`, `SpecLibraryPagination`. Wire `onRowClick` to navigate to `/$orgSlug/spec-library/$specId`. Wire `onPageChange` to update `page` URL param (reset to 1 on other changes)
- [x] T014 [US1] Export all new UI components and hooks from `packages/domains/authoring/src/ui/index.ts` barrel file

**Checkpoint**: Browsing the spec library works — paginated table with severity badges, tag pills, relative timestamps, and row-click navigation.

---

## Phase 4: User Story 2 — Search for Specs (Priority: P2)

**Goal**: Admin types a search term and the table filters to matching specs with 300ms debounce, URL persistence, and a clear button.

**Independent Test**: Type a search term, verify table filters, confirm URL contains `?q=...`, refresh and verify search persists.

### Implementation for User Story 2

- [x] T015 [P] [US2] Create `SpecSearchBar.tsx` in `packages/domains/authoring/src/ui/components/SpecSearchBar.tsx`. Accept `{ value, onChange, isLoading }`. Render an input with placeholder "Search by title or system under test...". Implement 300ms debounce: maintain local input state, call `onChange(debouncedValue)` after 300ms of no typing. Show a clear button (×) when input has content; clicking it calls `onChange('')` immediately (no debounce). Show a small spinner icon inside the input when `isLoading` is true. Export from UI barrel
- [x] T016 [US2] Integrate `SpecSearchBar` into `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Place below tabs, left-aligned in the search/filter bar. Wire `value` to search params `q`, wire `onChange` to update `q` param and reset `page` to 1

**Checkpoint**: Search works — debounced, URL-synced, clearable, search term survives refresh and is shareable.

---

## Phase 5: User Story 3 — Filter by Severity (Priority: P3)

**Goal**: Admin selects a severity from a dropdown to narrow results. Filter combines additively with search and persists in URL.

**Independent Test**: Select "Critical" from dropdown, verify only critical specs shown, confirm URL contains `?severity=critical`.

### Implementation for User Story 3

- [x] T017 [P] [US3] Create `SeverityFilterDropdown.tsx` in `packages/domains/authoring/src/ui/components/SeverityFilterDropdown.tsx`. Accept `{ value, onChange }`. Render a `<select>` with options: All (value=""), Critical, High, Medium, Low. Call `onChange(selectedValue)` on change. Export from UI barrel
- [x] T018 [US3] Integrate `SeverityFilterDropdown` into `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Place right-aligned in the search/filter bar (same row as search). Wire `value` to search params `severity`, wire `onChange` to update `severity` param and reset `page` to 1

**Checkpoint**: Severity filter works — additive with search, URL-synced, resets pagination.

---

## Phase 6: User Story 4 — Sort by Column (Priority: P4)

**Goal**: Admin clicks column headers to cycle sort (ascending → descending → default). Active sort shows arrow indicator. Sort persists in URL.

**Independent Test**: Click "Title" header, verify ascending sort + arrow indicator + URL params. Click again for descending. Click third time for reset to default.

### Implementation for User Story 4

- [x] T019 [US4] Add sort interaction to `SpecLibraryTable.tsx` in `packages/domains/authoring/src/ui/components/SpecLibraryTable.tsx`. Make Title, System under test, Severity, and Last updated headers clickable. Show sort indicator arrow (↑ ascending, ↓ descending) on the active sort column. On header click: if column is not current sort → set sort=column, order=asc; if column is current and asc → set order=desc; if column is current and desc → reset to default (sort=updated, order=desc). Call `onSortChange({ sort, order })`. The `onSortChange` prop already exists from T012; wire it in the route file to update URL params `sort` and `order` and reset `page` to 1

**Checkpoint**: Column sorting works — three-state cycling, visual indicator, URL-synced, resets pagination.

---

## Phase 7: User Story 5 — Switch Between Active and Archived Tabs (Priority: P5)

**Goal**: Admin switches between Active and Archived tabs. Switching resets all filters, search, sort, and pagination to defaults.

**Independent Test**: Click "Archived" tab, verify archived specs display with all filters reset. Click "Active" to restore defaults.

### Implementation for User Story 5

- [x] T020 [US5] Add tab bar to `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Render two tab buttons ("Active" and "Archived") above the search/filter bar. Active tab is visually highlighted. On tab click: navigate with `tab` param set and ALL other params reset to defaults (remove q, severity, sort, order, page from URL). Use `Route.useNavigate()` with explicit param reset

**Checkpoint**: Tabs work — switching resets all state, URL-synced, correct data loads per tab.

---

## Phase 8: User Story 6 — Create a New Spec (Priority: P6)

**Goal**: Admin clicks "+ New spec" button in the page header and navigates to the creation form.

**Independent Test**: Click "+ New spec", verify navigation to `/:orgSlug/spec-library/new`.

### Implementation for User Story 6

- [x] T021 [US6] Add "+ New spec" button to the page header in `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Render as a primary-styled button/link right-aligned in the page header row (next to "Spec Library" heading). Use TanStack Router `Link` component to navigate to `/$orgSlug/spec-library/new`

**Checkpoint**: Create button navigates to the existing spec creation form.

---

## Phase 9: User Story 7 — Handle Empty and Error States (Priority: P7)

**Goal**: System shows appropriate messaging for empty library, no search results, empty archived tab, API errors, and invalid page numbers.

**Independent Test**: Simulate each empty/error condition and verify the correct message and action buttons appear.

### Implementation for User Story 7

- [x] T022 [P] [US7] Create `SpecLibraryEmptyState.tsx` in `packages/domains/authoring/src/ui/components/SpecLibraryEmptyState.tsx`. Accept `{ variant, onClearSearch, onCreateSpec }`. Support variants: (1) 'empty-library' — "No specs yet. Create your first spec or start building a playbook — specs you create there will appear here automatically." with a "+ New spec" button calling `onCreateSpec`; (2) 'no-results' — "No specs match your search. Try a different term or clear the filter." with a "Clear search" link calling `onClearSearch`; (3) 'no-archived' — "No archived specs."; (4) 'invalid-page' — "No specs on this page." with pagination still visible; (5) 'error' — "Failed to load specs. Please try again." with a "Retry" button (accept `onRetry` prop). Export from UI barrel
- [x] T023 [US7] Integrate `SpecLibraryEmptyState` into `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`. Determine variant based on state: if query error → 'error' with refetch as retry; if total=0 and no search/filter active → 'empty-library' (active tab) or 'no-archived' (archived tab); if total=0 and search/filter active → 'no-results' with clear handler that resets q and severity params; if page > totalPages and totalPages > 0 → 'invalid-page'. Show stale data behind error banner (keepPreviousData/placeholderData in TanStack Query)

**Checkpoint**: All empty and error states display correct messages with actionable next steps.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Verification, cleanup, and cross-cutting improvements

- [x] T024 Verify OTel span attributes on the list endpoint in `apps/api/src/routes/authoring.ts` — confirm `org.slug`, `search.term`, `filter.severity`, `filter.tab`, `sort.column`, `sort.order`, `result.total` are set on the auto-created span via `getSpan(request)`
- [x] T025 Verify all new exports: use case exported from `packages/domains/authoring/src/index.ts`, all UI components and hooks exported from `packages/domains/authoring/src/ui/index.ts`, shared schemas and types exported from `packages/shared/src/index.ts`
- [x] T026 Run full validation: `pnpm turbo run build typecheck test` — all packages must pass. Verify `pnpm --filter @releasepilot/domain-authoring test` runs use case tests. Verify `pnpm --filter api test` runs integration tests

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (shared schemas) — BLOCKS all frontend user stories
- **User Stories (Phase 3–9)**: All depend on Phase 2 completion (backend API must exist)
  - US1 (Browse) must complete before US2–US7 (all frontend stories build on the base page)
  - US2 (Search), US3 (Filter), US4 (Sort), US5 (Tabs), US6 (Create) can proceed in parallel after US1
  - US7 (Empty/error states) can proceed in parallel after US1
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — establishes the page, table, pagination, and URL state framework
- **US2 (P2)**: After US1 — adds search bar to the existing page
- **US3 (P3)**: After US1 — adds severity filter to the existing page
- **US4 (P4)**: After US1 — adds sort interaction to the existing table
- **US5 (P5)**: After US1 — adds tab bar to the existing page
- **US6 (P6)**: After US1 — adds button to the existing page header
- **US7 (P7)**: After US1 — adds empty/error states to the existing page

### Within Each User Story

- Component creation tasks marked [P] can run in parallel
- Integration into the route file depends on component creation
- Route file changes within a story are sequential (same file)

### Parallel Opportunities

- T004 (unit tests) and T005 (adapter) can run in parallel in Phase 2
- T006 and T007 can run in parallel in Phase 2
- T008, T009, T010, T011 can all run in parallel in US1 (different files)
- After US1 completes: US2, US3, US4, US5, US6, US7 can all be worked on in parallel by different developers
- Within US7: T022 (component) is independent of T023 (integration)

---

## Parallel Example: Phase 2 (Foundational)

```
# Sequential: T001 (schemas) → T002 (port) → T003 (use case) → T005 (adapter) → T006 (route)
# Parallel within sequential chain:
#   T004 (unit tests) in parallel with T005 (adapter)
#   T007 (integration tests) in parallel with T006 (route) — or after

Sequence: T001 → T002 → T003 → [T004 | T005] → T006 → T007
```

## Parallel Example: User Story 1

```
# Launch all components in parallel:
Task T008: "Create useSpecList hook"
Task T009: "Create SeverityBadge component"
Task T010: "Create TagPills component"
Task T011: "Create SpecLibraryPagination component"

# Then sequentially:
Task T012: "Create SpecLibraryTable (depends on T009, T010)"
Task T013: "Update route file (depends on T008, T011, T012)"
Task T014: "Export from barrel (depends on all above)"
```

## Parallel Example: After US1 completes

```
# All these can run in parallel (different feature slices):
Developer A: US2 (T015 → T016)
Developer B: US3 (T017 → T018)
Developer C: US4 (T019)
Developer D: US5 (T020) + US6 (T021)
Developer E: US7 (T022 → T023)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T007) — full backend API
3. Complete Phase 3: US1 (T008–T014) — browsable paginated table
4. **STOP and VALIDATE**: Table renders with correct columns, default sort, pagination, row click
5. Deploy/demo if ready — a functional spec library overview

### Incremental Delivery

1. Setup + Foundational → API ready
2. US1 (Browse) → Paginated table works → **Deploy (MVP!)**
3. US2 (Search) → Search works → Deploy
4. US3 (Filter) → Severity filter works → Deploy
5. US4 (Sort) → Column sorting works → Deploy
6. US5 (Tabs) → Active/Archived toggle works → Deploy
7. US6 (Create) → Navigation button works → Deploy
8. US7 (Empty states) → Polish empty/error states → Deploy
9. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No database migration required — existing schema has all needed columns and indexes
- No new error codes required — list endpoint returns empty results, not errors
- Existing `specKeys.list(orgSlug, filters)` query key factory in `apps/app/src/api/query-keys.ts` already supports filter objects — no changes needed
- `validateSearch` in TanStack Router is the idiomatic way to sync URL state — this is the first route in the project to use it
- All UI components use inline styles following the existing project convention (no shadcn installed)
