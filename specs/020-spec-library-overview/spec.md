# Feature Specification: Spec Library Overview

**Feature Branch**: `020-spec-library-overview`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Spec Library Overview page for browsing, searching, filtering, and managing specs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Spec Library (Priority: P1)

An admin navigates to the Spec Library page to review the organisation's specs. The page loads a paginated table of all active specs sorted by most recently updated. The admin scans titles, severity badges, system-under-test labels, and tags. They click a row to view a spec's detail page.

**Why this priority**: This is the foundational interaction — without a browsable table of specs, no other library functionality (search, filter, sort) has context. It delivers immediate value by giving admins a single place to see all specs.

**Independent Test**: Can be fully tested by loading the page with seed data and verifying the table renders with correct columns, default sort order, pagination, and row-click navigation.

**Acceptance Scenarios**:

1. **Given** the org has 30 active specs, **When** the admin navigates to `/:orgSlug/spec-library`, **Then** the table displays the first 25 specs sorted by last updated (descending), with "Showing 1–25 of 30 specs" and enabled "Next" button.
2. **Given** the org has 30 active specs and the admin is on page 1, **When** the admin clicks "Next", **Then** page 2 loads showing specs 26–30, the "Previous" button is enabled, and the "Next" button is disabled.
3. **Given** the table is showing active specs, **When** the admin clicks a row, **Then** the browser navigates to the spec detail page (`/:orgSlug/spec-library/:specId`).
4. **Given** the table is showing specs, **When** the admin views a spec with a title longer than 80 characters, **Then** the title is truncated with an ellipsis and the full title is visible on hover.
5. **Given** a spec has 5 tags, **When** the table renders that row, **Then** 3 tag pills are visible plus a "+2 more" badge, and hovering the badge reveals the full tag list.

---

### User Story 2 - Search for Specs (Priority: P2)

An admin types a search term into the search bar to find specs by title or system under test. Results update after a short debounce delay, pagination resets, and the search term persists in the URL for shareability and refresh resilience.

**Why this priority**: Search is the most common way admins locate a specific spec in a growing library. Without search, admins must manually paginate through all specs.

**Independent Test**: Can be fully tested by entering a search term, verifying the table filters to matching results, confirming pagination resets to page 1, and checking the URL contains the search query parameter.

**Acceptance Scenarios**:

1. **Given** the admin is on the Spec Library page with 50 active specs, **When** they type "login" and wait 300ms, **Then** the table updates to show only specs whose title or system under test contains "login", and pagination resets to page 1.
2. **Given** the search bar contains "login", **When** the admin clicks the clear button (×), **Then** the search is cleared, the table returns to the unfiltered default-sorted view, and the `q` parameter is removed from the URL.
3. **Given** the admin has searched for "api", **When** they copy the URL and open it in a new tab, **Then** the new tab shows the same search results with "api" pre-filled in the search bar.
4. **Given** the admin types rapidly ("a", "ap", "api") within 300ms, **When** the debounce period elapses, **Then** only one request fires for the final term "api".

---

### User Story 3 - Filter by Severity (Priority: P3)

An admin selects a severity level from the dropdown to narrow the spec list to only specs of that severity. The filter works in combination with search and persists in the URL.

**Why this priority**: Severity filtering lets admins focus on critical or high-priority specs, especially during release readiness reviews. It builds on browse and search.

**Independent Test**: Can be fully tested by selecting a severity from the dropdown, verifying only specs of that severity appear, and confirming the filter persists in the URL.

**Acceptance Scenarios**:

1. **Given** the library has specs of all severity levels, **When** the admin selects "Critical" from the severity dropdown, **Then** only Critical specs are displayed and the URL contains `severity=critical`.
2. **Given** a severity filter is active, **When** the admin also types a search term, **Then** both filters apply simultaneously (additive filtering).
3. **Given** severity is set to "High" and a search term is active, **When** the admin switches severity back to "All", **Then** only the search filter remains active.

---

### User Story 4 - Sort by Column (Priority: P4)

An admin clicks a column header to sort the table by that column. Clicking the same header cycles through ascending, descending, and default sort. The sort state persists in the URL.

**Why this priority**: Sorting lets admins organise the library by different dimensions (alphabetical, severity level, recency). It enhances browsability but requires browse, search, and filter to already work.

**Independent Test**: Can be fully tested by clicking column headers and verifying the table re-orders correctly, sort indicators display, and the URL reflects the sort state.

**Acceptance Scenarios**:

1. **Given** the default sort is last updated descending, **When** the admin clicks the "Title" header, **Then** the table sorts by title ascending, an up-arrow indicator appears on the Title header, and the URL contains `sort=title&order=asc`.
2. **Given** the table is sorted by title ascending, **When** the admin clicks "Title" again, **Then** the sort changes to title descending with a down-arrow indicator.
3. **Given** the table is sorted by title descending, **When** the admin clicks "Title" a third time, **Then** the sort resets to the default (last updated descending) and the sort/order parameters are removed from the URL.
4. **Given** the admin changes the sort, **When** the table re-renders, **Then** pagination resets to page 1.
5. **Given** the admin sorts by Severity ascending, **When** the table renders, **Then** specs are ordered Low → Medium → High → Critical.

---

### User Story 5 - Switch Between Active and Archived Tabs (Priority: P5)

An admin switches between the "Active" and "Archived" tabs to view specs in different lifecycle states. Switching tabs resets all filters, search, sort, and pagination to defaults.

**Why this priority**: Tab switching is important for lifecycle management but is less frequently used than browsing, searching, or filtering active specs.

**Independent Test**: Can be fully tested by clicking the Archived tab, verifying archived specs display, and confirming that search/filter/sort/pagination reset.

**Acceptance Scenarios**:

1. **Given** the admin is on the Active tab with a search term and severity filter applied, **When** they click the "Archived" tab, **Then** the table shows archived specs, the search bar is cleared, severity is reset to "All", sort is reset to default, and pagination is reset to page 1.
2. **Given** the admin is on the Archived tab, **When** they click "Active", **Then** the table shows active specs with all defaults restored.
3. **Given** the admin is on the Archived tab, **When** the URL is `?tab=archived`, **Then** refreshing the page loads the Archived view.

---

### User Story 6 - Create a New Spec from the Library (Priority: P6)

An admin clicks the "+ New spec" button in the page header. The button navigates to the new spec creation form. After saving, the admin returns to the library and the new spec appears (most recently updated).

**Why this priority**: This is a navigation action that depends on the create-spec feature (011-create-spec) already existing. The library page just needs the button and correct routing.

**Independent Test**: Can be fully tested by clicking "+ New spec" and verifying navigation to the creation form route.

**Acceptance Scenarios**:

1. **Given** the admin is on the Spec Library page, **When** they click "+ New spec", **Then** the browser navigates to `/:orgSlug/spec-library/new`.

---

### User Story 7 - Handle Empty and Error States (Priority: P7)

The system displays appropriate messaging when the library is empty, search yields no results, or an API error occurs. These states guide the user with clear messaging and actionable options.

**Why this priority**: Empty and error states are essential for a polished experience but are not the primary interaction path. They depend on the core browse/search/filter flows being implemented first.

**Independent Test**: Can be fully tested by simulating empty data, no-result searches, and API failures, then verifying the correct message and action buttons appear.

**Acceptance Scenarios**:

1. **Given** the org has no specs at all, **When** the admin loads the Spec Library page, **Then** an empty state message is displayed: "No specs yet. Create your first spec or start building a playbook — specs you create there will appear here automatically." with a "+ New spec" button.
2. **Given** the admin searches for a term that matches no specs, **When** the results load, **Then** the table body shows "No specs match your search. Try a different term or clear the filter." with a "Clear search" link.
3. **Given** a search term and severity filter are both active and yield no results, **When** the admin clicks "Clear search", **Then** both the search term and severity filter are cleared.
4. **Given** the admin is on the Archived tab with no archived specs, **When** the tab loads, **Then** the table body shows "No archived specs."
5. **Given** the API call fails, **When** the error occurs, **Then** an inline error banner shows "Failed to load specs. Please try again." with a "Retry" button, and any previously loaded results remain visible.
6. **Given** the admin navigates to `?page=999` and only 6 pages exist, **When** the page loads, **Then** the UI shows "No specs on this page" and the pagination allows navigating to valid pages.

---

### Edge Cases

- What happens when a spec title contains special HTML characters? They must be rendered safely (escaped) to prevent display issues.
- What happens when the admin types SQL-significant characters (`%`, `_`, `\`) in the search bar? Characters are escaped server-side before being used in queries.
- What happens when two admins are viewing the library and one archives a spec? The other admin sees stale data until the next polling cycle or page refresh (stale-while-revalidate is acceptable for v1).
- What happens if the total spec count changes between paginated requests? The page indicator may briefly show inconsistent numbers; this is acceptable for offset-based pagination in v1.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST display a paginated table of specs belonging to the current organisation, showing Title, System under test, Severity, Tags, and Last updated columns.
- **FR-002**: System MUST paginate results with a fixed page size of 25 rows, displaying "Previous"/"Next" controls and a page indicator ("Showing X–Y of Z specs", "Page X of Y").
- **FR-003**: System MUST default-sort specs by last updated date in descending order (most recent first).
- **FR-004**: System MUST support server-side search across spec title and system-under-test fields, with a 300ms debounce on input and case-insensitive matching.
- **FR-005**: System MUST support single-select severity filtering with options: All (default), Critical, High, Medium, Low.
- **FR-006**: System MUST support single-column sorting on Title, System under test, Severity, and Last updated columns, cycling through ascending → descending → default on repeated clicks.
- **FR-007**: System MUST define severity sort order as: Critical > High > Medium > Low (ascending = Low first).
- **FR-008**: System MUST display an "Active" and "Archived" tab, where Active shows non-archived specs and Archived shows archived specs.
- **FR-009**: System MUST reset search, severity filter, sort, and pagination to defaults when the tab is switched.
- **FR-010**: System MUST persist all filter, search, sort, and pagination state in URL query parameters (`tab`, `q`, `severity`, `sort`, `order`, `page`).
- **FR-011**: System MUST reset pagination to page 1 whenever search, filter, or sort changes.
- **FR-012**: System MUST navigate to the spec detail page when a table row is clicked.
- **FR-013**: System MUST provide a three-dot action menu on each row with a "View" action on both Active and Archived tabs.
- **FR-014**: System MUST provide a "+ New spec" button in the page header that navigates to the spec creation form.
- **FR-015**: System MUST truncate spec titles longer than approximately 80 characters with an ellipsis, showing the full title on hover.
- **FR-016**: System MUST display a maximum of 3 tag pills per row, with a "+N more" badge for additional tags, showing the full list on hover.
- **FR-017**: System MUST display an empty state with guidance message and "+ New spec" action when no specs exist.
- **FR-018**: System MUST display a "no results" state with a "Clear search" action when search and/or filters yield no results.
- **FR-019**: System MUST display an inline error banner with a "Retry" action when an API call fails, keeping any previously loaded results visible (stale-while-revalidate).
- **FR-020**: System MUST escape special characters in search input (`%`, `_`, `\`) server-side before using them in queries.
- **FR-021**: System MUST show a loading indicator (spinner in search input) when a request is in flight.
- **FR-022**: System MUST display severity as a colour-coded badge: Critical (red), High (orange), Medium (yellow), Low (grey).
- **FR-023**: System MUST handle deep-links to invalid pages (e.g., `?page=999`) gracefully by showing a message and allowing navigation to valid pages.

### Key Entities

- **Spec**: A test specification belonging to an organisation, with attributes including title, system under test, severity level (Critical/High/Medium/Low), tags, archived status, and timestamps (created, last updated).
- **Organisation**: The tenant that owns a collection of specs. All spec queries are scoped to the current organisation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can locate a specific spec via search in under 5 seconds (type query, scan results, click).
- **SC-002**: The spec list loads and renders within 2 seconds on initial page load for libraries with up to 500 specs.
- **SC-003**: 100% of filter, search, sort, and pagination state survives a full page refresh (URL state fidelity).
- **SC-004**: Users can share a filtered/sorted view via URL and the recipient sees the identical view.
- **SC-005**: All empty states (no specs, no results, no archived specs) display clear guidance with actionable next steps.
- **SC-006**: Users can browse through a library of 500+ specs using pagination without performance degradation.
- **SC-007**: 95% of users can successfully find and navigate to a specific spec on their first attempt without requiring help documentation.

## Assumptions

- The `spec_library` table and its existing GIN trigram index (`idx_specs_org_title`) are available and sufficient for search performance.
- The existing severity enum values (Critical, High, Medium, Low) are already stored in the database.
- Tag data is stored as part of the spec record (no separate tags table join required for display).
- The spec detail page and spec creation form (011-create-spec) are either already implemented or will be implemented as separate features; this feature handles navigation to them but not their content.
- Playbook usage count column is intentionally excluded from v1 of this overview page to reduce scope; it may be added later.
- Page size of 25 is fixed and not user-configurable in v1.
