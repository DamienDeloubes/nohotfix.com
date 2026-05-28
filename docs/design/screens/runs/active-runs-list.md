# Screen: Active Runs List

_Domain: Runs_
_Route: `/runs`_
_Roles: Admin (all runs), Member (filtered to assigned/claimed runs)_

---

## Purpose

A dedicated list of all runs currently in an active state — either `In Progress` or `Awaiting Go/No-Go`. Gives Admins full oversight of all parallel release work in the org, and gives Members quick access to the runs where they have active responsibilities. Completed and abandoned runs are in [Run History](../history/history-list.md), not here.

---

## Key UI Components

**Page Header:**
- Heading: "Active Runs"
- "New run" primary button (Admin only) → [Start a Run](start-run.md)

**Filter Bar:**
- Filter by: playbook, environment tag, state (`In Progress` / `Awaiting Go/No-Go`), assigned member
- Member view: default to "My runs" filter (runs where they are pre-assigned or have claimed specs)

**Runs List:**
- Each row shows:
  - Run name (linked → [Run Overview](run-overview.md))
  - Playbook name
  - Environment tag badge
  - Started by (name)
  - Start date
  - Progress indicator: "X of Y specs done" (with a small progress bar)
  - State badge: `In Progress` (blue) or `Awaiting Go/No-Go` (amber)
  - Assignment summary: e.g., "3 sections pre-assigned"
- Sorted by start date descending (newest first) by default

---

## User Actions

**Admin:**
- Start a new run
- Click a run name → [Run Overview](run-overview.md)
- Filter by playbook, environment, state, or assigned member

**Member:**
- Click a run name → [Run Overview](run-overview.md)
- Toggle between "My runs" and "All runs" filter

---

## Navigation Flow

**How you get here:**
- Clicking "Runs" in the sidebar
- "View all active runs" link from the Active Runs card on [Dashboard](../dashboard/dashboard-active.md)

**Where this screen leads:**
- Click run row → [Run Overview](run-overview.md)
- "New run" → [Start a Run](start-run.md)

---

## Data Displayed

- All active runs (Admin) or filtered active runs (Member)
- Per-run: name, playbook, environment, start date, progress, state, assignment summary

---

## Modals / Sub-views

None.

---

## States

**Populated:** List of active runs.

**Empty (Admin — no active runs):**
_"No active runs right now. Start one from any playbook."_
"New run" button.

**Empty (Member — no assigned runs):**
_"You're not assigned to any active runs right now."_
"View all runs" link to show the unfiltered list.

**Loading:** Skeleton rows.

---

## Relevant Features

- [Run Execution UI](../../features/must-have/run-execution-ui.md)
- [Tester Assignment](../../features/must-have/tester-assignment.md)
