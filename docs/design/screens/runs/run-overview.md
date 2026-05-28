# Screen: Run Overview

_Domain: Runs_
_Route: `/runs/[id]`_
_Roles: Admin and Member (role differences in available actions)_

---

## Purpose

The command centre for an active run. Shows the complete spec list, progress at a glance, who is working on what, and provides navigation into individual specs for execution. This is the screen testers live on throughout a release run. It is also the screen from which Admins access early termination actions (Abandonment) or monitor progress toward the Go/No-Go gate.

---

## Key UI Components

**Page Header:**
- Run name (large heading)
- State badge: `In Progress` (blue) or `Awaiting Go/No-Go` (amber)
- Playbook name + environment tag
- Started by name + start date
- Optional: target completion date (if set at run start)
- Run action menu (three-dot icon, Admin only):
  - "Abandon run" → triggers [Abandonment Flow](#abandonment-confirmation-sub-view)
- "Go/No-Go review" prominent button (shown when state is `Awaiting Go/No-Go`, Admin only) → [Go/No-Go Review Screen](go-no-go-review.md)

**Progress Summary Bar:**
- Overall progress: "X of Y specs done" (a tester-friendly label)
- Mini progress bar visualising completion percentage
- Breakdown: X Passed / Y Failed / Z Skipped / N Pending / M In Progress
- Count of failed specs highlighted if any (e.g., "2 failed" in red)

**Filter Bar:**
- Filter by spec status: All / Pending / In Progress / Passed / Failed / Skipped
- Filter by severity: All / Critical / High / Medium / Low
- Filter by assigned tester: All / Assigned to me / [Member name]
- "Assigned to me" filter is the primary shortcut for testers to find their work

**Spec List (grouped by section):**

**Section Header Row:**
- Section name
- Section assignment label (if pre-assigned): "Assigned to [name]" (muted)
- Section progress: "X of Y specs done" within this section
- Section action menu (Admin only, three-dot icon):
  - "Skip section" → triggers [Section Skip Dialog](#section-skip-dialog-sub-view)

**Spec Row (within section):**
- Spec title (click → [Spec Execution Panel](spec-execution.md))
- Severity badge
- System under test label
- State badge: `Pending` / `In Progress` / `Passed` / `Failed` / `Skipped`
- Assignment indicator:
  - Unclaimed: "Claim it" button
  - Claimed: assignee avatar + "Claimed by [name]" label (smaller style)
  - Completed: executed-by name + timestamp
- Artifact requirement count hint (e.g., "2 required artifacts") — helps testers know what to prepare

**Skipped section rendering:**
- Section header shows "Section skipped" badge (grey)
- Skip reason shown as a muted note below the section header
- All specs in the section show as `Skipped` (not individually expandable or actionable)

---

## User Actions

**Any tester (Admin and Member):**
- Click a spec title → [Spec Execution Panel](spec-execution.md)
- Claim an unclaimed spec ("Claim it" button)
- Filter the spec list by status, severity, or assignee
- View section-level progress and assignment

**Admin:**
- Skip a section (with mandatory reason) → all specs in section become Skipped
- Abandon the run (via action menu) with mandatory reason → run locked in `Abandoned` state
- Access the Go/No-Go Review screen (when state is `Awaiting Go/No-Go`)

---

## Navigation Flow

**How you get here:**
- After submitting [Start a Run](start-run.md)
- "View run" link from the Active Runs card on [Dashboard](../dashboard/dashboard-active.md)
- Clicking a run in [Active Runs List](active-runs-list.md)
- Email notification link ("view run" in the "run ready for go/no-go" email)

**Where this screen leads:**
- Click spec → [Spec Execution Panel](spec-execution.md)
- "Go/No-Go review" button → [Go/No-Go Review Screen](go-no-go-review.md)
- "Abandon run" → Abandonment Confirmation dialog → run locked → [Run Detail (Audit View)](../history/run-detail.md)
- Sidebar navigation → any other screen

---

## Data Displayed

- Run metadata: name, state, playbook, environment, started by, start date, target completion date
- Progress summary: counts by spec state
- All sections and specs from the playbook snapshot (in snapshot order)
- Per-spec: title, severity, system under test, current state, assignment, artifact requirement count

---

## Sub-views (Modals, Drawers)

### Abandonment Confirmation Sub-view

Triggered by "Abandon run" in the run action menu.

- Heading: "Abandon this run"
- Explanatory copy: _"This will permanently cancel the run. Provide a reason so the audit trail is complete. This action cannot be undone."_
- Required text area: "Reason for abandonment" (cannot be left blank; submit button disabled until reason is entered)
- Example placeholder text: _"Build pipeline failed — unrelated to test outcomes. Release postponed to next sprint."_
- Actions: "Cancel" (closes dialog, run unchanged), "Abandon run" (confirms, run moves to `Abandoned`, locked)
- On confirmation: run is immediately locked; all team members receive an abandonment email notification; user is navigated to [Run Detail (Audit View)](../history/run-detail.md) for this run

### Section Skip Dialog

Triggered by "Skip section" in the section action menu (Admin only).

- Heading: "Skip section: [Section name]"
- Explanatory copy: _"All [N] specs in this section will be marked as Skipped. This action is recorded in the audit trail."_
- Required text area: "Reason for skipping" (cannot be left blank)
- Example placeholder text: _"Payment processing not affected in this release."_
- Actions: "Cancel", "Skip section"
- On confirmation: all specs in the section immediately transition to `Skipped`; the run overview re-renders the section with the "Section skipped" indicator

---

## States

**In Progress — normal:** Spec list showing mixed states (Pending, In Progress, Passed, etc.)

**In Progress — all pending:** All specs are `Pending`; no work started yet. A helpful note at the top: "Click any spec below to start executing." (Only shown on first load if appropriate.)

**Awaiting Go/No-Go:** All specs have a terminal state (Passed / Failed / Skipped). The "Go/No-Go review" button becomes prominent. No new spec execution possible — all spec rows are read-only.

**Filtered view — no results:** "No specs match the current filters." — with a "Clear filters" link.

**Loading:** Skeleton spec rows while run data loads.

---

## Notes

- Concurrent tester support: multiple testers can be on this screen simultaneously; spec state updates from other testers are reflected on refresh (real-time updates are a v2 enhancement; v1 requires a manual refresh to see others' changes)
- The Run Overview is accessible to all org members — not just those assigned to the run; Members who are not assigned to any section can still open specs and claim them

---

## Relevant Features

- [Run Execution UI](../../features/must-have/run-execution-ui.md)
- [Tester Assignment](../../features/must-have/tester-assignment.md)
- [Section-Level Skip](../../features/should-have/section-level-skip.md)
- [Go/No-Go Decision Gate](../../features/must-have/go-no-go-decision-gate.md)
