# Feature: Spec Library Overview Page

_Last updated: 2026-03-10_

## Overview

The Spec Library Overview is the primary surface for admins to browse, search, filter, and manage every spec in the organisation. It renders a paginated table of all active (or archived) specs with live search, column sorting, severity filtering, and row-level actions. This page is the entry point for all library-level spec management — creating, viewing, editing, and archiving specs.

## Complexity Assessment

- **Technical Complexity**: Medium — requires a server-side paginated list endpoint with search (trigram index), multi-column sorting, severity filtering, and a playbook usage count subquery; the frontend needs URL-synced filter/sort/page state and optimistic archive/unarchive mutations.
- **Design Complexity**: Low — standard table pattern with search, filters, and pagination; the main design challenge is keeping the UI scannable when specs have long titles or many tags.
- **User Experience Complexity**: Low — familiar list-page pattern; the key UX decision is making search, filter, and sort feel instant and ensuring the empty/no-results states guide the user clearly.

---

## Detailed Description

### Access

- **Route**: `/:orgSlug/spec-library`
- **Roles**: Anyone can view.

---

### Page Layout

**Page header:**

- Heading: "Spec Library"
- Primary action button: "+ New spec" → navigates to the new spec form (`/:orgSlug/spec-library/new`)

**Tab bar:**

- "Active" (default) — all specs where `is_archived = false`
- "Archived" — all specs where `is_archived = true`

**Search and filter bar** (below tabs, above table):

- Search input (left-aligned)
- Severity filter dropdown (right-aligned)

**Table** (main content area):

- Column headers with sort controls
- Paginated rows
- Row-level action menu

**Pagination controls** (below table):

- Page size: 25 rows (fixed, not user-configurable in v1)
- "Previous" / "Next" buttons with current page indicator (e.g. "Page 2 of 5")

---

### Table Columns

| Column            | Content                                                           | Sortable | Default sort         | Notes                                                                              |
| ----------------- | ----------------------------------------------------------------- | -------- | -------------------- | ---------------------------------------------------------------------------------- |
| Title             | Spec title (linked — click navigates to spec detail)              | Yes      | —                    | Truncated with ellipsis at ~80 chars. Full title shown on hover (title attribute). |
| System under test | The system/component being tested                                 | Yes      | —                    | Displays "—" if null.                                                              |
| Severity          | Badge: Critical (red), High (orange), Medium (yellow), Low (grey) | Yes      | —                    | Badge uses colour + label.                                                         |
| Tags              | Tag pills (max 3 visible + "+N more" overflow)                    | No       | —                    | Tags displayed as small pills.                                                     |
| Last updated      | Relative time (e.g. "2 hours ago", "3 days ago")                  | Yes      | Descending (default) | -                                                                                  |

**Default sort**: Last updated, descending (most recently edited specs first).

Only one column can be sorted at a time. Clicking a column header cycles: ascending → descending → default (last updated desc).

---

### Search

**Behaviour:**

- Searches across `title` and `system_under_test` fields
- Server-side search using the existing GIN trigram index (`idx_specs_org_title`)
- Debounced: 300ms after the user stops typing before firing the request
- Minimum query length: 1 character (no minimum — even single characters return results)
- Case-insensitive
- Search is scoped to the active tab (Active or Archived)
- Resets pagination to page 1 on every new search

**Search input:**

- Placeholder text: "Search by title or system under test..."
- Clear button (×) appears when the input has content
- Clearing the search restores the unfiltered, default-sorted list

**URL sync:**

- The search term is persisted in the URL query string (`?q=...`) so that searches are shareable and survive page refreshes

---

### Filters

**Severity filter:**

- Dropdown with options: All (default), Critical, High, Medium, Low
- Single-select — only one severity can be active at a time
- Combining with search: filters are additive — search narrows by text, severity narrows by level. Both apply simultaneously
- Resets pagination to page 1 when changed
- Persisted in URL query string (`?severity=critical`)

**Tab (Active / Archived):**

- Acts as a top-level filter on `is_archived`
- Switching tabs resets search, severity filter, sort, and pagination to defaults
- Persisted in URL query string (`?tab=archived`), defaults to `active`

---

### Sorting

**Sortable columns**: Title, System under test, Severity, Last updated.

**Behaviour:**

- Click a column header to sort by that column ascending
- Click the same header again to toggle to descending
- Click a third time to reset to default sort (Last updated desc)
- Active sort column shows a visual indicator (arrow icon: ↑ ascending, ↓ descending)
- Sorting is server-side (the API returns pre-sorted results)
- Resets pagination to page 1 when changed
- Persisted in URL query string (`?sort=title&order=asc`)

**Severity sort order**: Critical > High > Medium > Low (ascending = Low first, descending = Critical first).

---

### Row Actions

Each row has a three-dot action menu (right-aligned) with context-dependent options.

**Active tab actions:**

- "View" → navigates to spec detail page (`/:orgSlug/spec-library/:specId`)
<!-- - "Archive" → opens archive confirmation dialog -->

**Archived tab actions:**

- "View" → navigates to spec detail page

**Row click:**

- Clicking anywhere on a row (outside the action menu) navigates to the spec detail page
- Cursor shows `pointer` on row hover

---

### Pagination

- Server-side offset/limit pagination
- Fixed page size: 25 rows
- Controls: "Previous" and "Next" buttons + page indicator ("Page X of Y")
- "Previous" is disabled on page 1; "Next" is disabled on the last page
- Total count is returned by the API and displayed: "Showing 1–25 of 142 specs"
- Pagination resets to page 1 when search, filter, sort, or tab changes
- Current page is persisted in URL query string (`?page=2`)

---

### URL State

All filter, search, sort, and pagination state is synced to the URL query string. This means:

- Searches and filtered views are shareable via URL
- Browser back/forward navigation works correctly
- Page refresh preserves the current view state

**Query parameters:**
| Param | Values | Default |
|---|---|---|
| `tab` | `active`, `archived` | `active` |
| `q` | any string | (empty) |
| `severity` | `critical`, `high`, `medium`, `low` | (empty = all) |
| `sort` | `title`, `system`, `severity`, `updated` | `updated` |
| `order` | `asc`, `desc` | `desc` |
| `page` | positive integer | `1` |

---

## Happy Paths

**HP-1: Browse the spec library**
Admin navigates to the Spec Library page. The table loads with all active specs sorted by last updated (descending). The admin scans titles, severity badges, and playbook usage counts. They click a row to view the spec detail.

**HP-2: Search for a spec**
Admin types "login" into the search bar. After 300ms, the table updates to show only specs whose title or system under test contain "login". Results are highlighted and pagination resets to page 1.

**HP-3: Filter by severity**
Admin selects "Critical" from the severity dropdown. The table shows only critical specs. The admin combines this with a search term to further narrow results.

**HP-4: Sort by title**
Admin clicks the "Title" column header. The table re-sorts alphabetically (A→Z). They click again to reverse (Z→A).

**HP-5: Create a new spec from the library**
Admin clicks "+ New spec". They are navigated to the new spec form. After saving, they return to the library and the new spec appears at the top (most recently updated).

**HP-6: Share a filtered view**
Admin searches for "api" and filters by "High" severity. They copy the URL (`/:orgSlug/spec-library?q=api&severity=high`) and share it with another admin. The recipient opens the link and sees the same filtered view.

**HP-7: Paginate through a large library**
Admin's org has 200+ specs. The table shows 25 per page with "Showing 1–25 of 213 specs". Admin clicks "Next" to browse subsequent pages. The page indicator updates accordingly.

---

## Unhappy Paths & Edge Cases

**UH-1: No specs exist (empty library)**
A brand-new org (after the demo playbook seeds initial specs) will see the demo specs. In the true edge case where all demo specs have been deleted: the table body is replaced by an empty state illustration with the message "No specs yet. Create your first spec or start building a playbook — specs you create there will appear here automatically." and a "+ New spec" action button.

**UH-2: Search returns no results**
Admin types a search term that matches nothing. The table body shows: "No specs match your search. Try a different term or clear the filter." with a "Clear search" link that resets the search input and filter.

**UH-3: Archived tab is empty**
Admin switches to the Archived tab but no specs have been archived. The table body shows: "No archived specs."

**UH-4: Search combined with filter yields no results**
Admin has a search term and a severity filter active, but no specs match both. Same empty state as UH-2, but the "Clear search" link clears both the search term and the severity filter.

**UH-5: Network error during search/filter/sort**
If the API call fails, the table shows an inline error banner: "Failed to load specs. Please try again." with a "Retry" button that re-fires the same request. The previous results remain visible (stale-while-revalidate).

**UH-6: Deep-linking to an invalid page**
Admin navigates to `?page=999` but there are only 6 pages. The API returns an empty result set for that offset. The UI shows "No specs on this page" and the pagination resets to show the valid page range. Clicking "Previous" navigates to the last valid page.

**UH-7: Rapid search input (debounce)**
Admin types quickly, changing the search term multiple times within 300ms. Only the final debounced value fires an API request. Intermediate keystrokes do not trigger queries. A subtle loading indicator (spinner in the search input) shows when a request is in flight.

**UH-8: Long spec title or many tags**
Titles longer than ~80 characters are truncated with ellipsis; full title is available on hover. Specs with more than 3 tags show the first 3 as pills and a "+N more" badge; full tag list is shown on hover.

**UH-9: Special characters in search**
Search input is sanitized before being sent to the API. Characters like `%`, `_`, and `\` (which have meaning in SQL LIKE/trigram queries) are escaped server-side. The user can search for any string without causing errors.
