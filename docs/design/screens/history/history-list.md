# Screen: Run History List

_Domain: History_
_Route: `/history`_
_Roles: Admin and Member (all users can view history)_

---

## Purpose

The filterable, paginated list of all completed and abandoned runs in the organisation. Gives teams a searchable audit log of every release decision made — with enough information per row to understand the outcome without needing to open each run. Clicking any row opens the full, read-only [Run Detail (Audit View)](run-detail.md).

---

## Key UI Components

**Page Header:**
- Heading: "Run History"
- No create actions — this is a read-only surface

**Filter and Sort Bar:**
- Filter by playbook (dropdown of all playbooks, including archived ones that have runs)
- Filter by status: All / Go / No-Go / Abandoned
- Filter by environment (dropdown populated from the org's playbook tags)
- Filter by date range (completion date — from/to date pickers)
- Filter by decision maker (dropdown of org members who have recorded decisions)
- Sort by: Completion date (default: newest first) / Start date
- "Clear filters" link when any filter is active

**Runs Table:**

| Column | Description |
|---|---|
| Run name | Linked to [Run Detail (Audit View)](run-detail.md) |
| Playbook | Playbook name |
| Environment | Environment tag badge |
| Status | Final state badge: `Go` (green) / `No-Go` (red) / `Abandoned` (grey) |
| Decision maker | Admin who recorded the go/no-go or triggered abandonment |
| Started by | User who started the run |
| Start date | When the run was created |
| Completion date | When the terminal state was recorded |
| Spec summary | e.g., "12 passed, 2 failed, 1 skipped"; blank for Abandoned runs |

**Pagination:**
- Standard page controls (Previous / Next, page number indicator)
- Page size: 25 rows per page (default)

---

## User Actions

- Apply filters (playbook, status, environment, date range, decision maker)
- Clear filters
- Change sort order
- Click a run name → [Run Detail (Audit View)](run-detail.md)
- Paginate through results

---

## Navigation Flow

**How you get here:**
- Clicking "History" in the sidebar
- "View" link from the Recent Runs card on [Dashboard](../dashboard/dashboard-active.md)
- Email notification links (go/no-go decision and abandonment emails) navigate directly to [Run Detail](run-detail.md), bypassing this list screen

**Where this screen leads:**
- Click run row → [Run Detail (Audit View)](run-detail.md)

---

## Data Displayed

- All completed and abandoned runs: run name, playbook, environment, status, decision maker, started by, start date, completion date, spec summary

---

## Modals / Sub-views

None.

---

## States

**Populated:** Table with paginated run list.

**No results matching filters:** "No runs match your current filters." + "Clear filters" link.

**Empty history (new org, no completed runs):** "No completed runs yet. Runs will appear here after a go/no-go decision or abandonment."

**Loading:** Skeleton table rows.

---

## Notes

- Abandoned runs are included in this list and filterable by Status: Abandoned; their spec summary column is blank (no complete pass/fail summary)
- Archived playbooks still appear in the playbook filter if they have associated run history
- The date filter applies to completion date by default — this is the most relevant date for compliance queries ("show me all runs completed in Q4")

---

## Relevant Features

- [Run History & Audit Trail](../../features/must-have/run-history-audit-trail.md)
- [Run Immutability](../../features/must-have/run-immutability.md)
