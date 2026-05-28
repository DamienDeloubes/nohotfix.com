# Screen: Start a Run

_Domain: Runs_
_Route: `/playbooks/[id]/run/new`_
_Roles: Admin and Member (both can start runs)_

---

## Purpose

The run creation form. Captures the metadata for the new run and provides an optional section-level tester pre-assignment step. On submission, the playbook is snapshotted and the run begins — the run is immediately live and visible to all team members.

---

## Key UI Components

**Page Header:**
- Heading: "Start a run"
- Back link → [Active Runs List](active-runs-list.md) or calling context

**Step 1 — Run Details:**
- Playbook selector (required):
  - Dropdown of all active playbooks in the org
  - Pre-selected if arriving from a specific playbook context
  - Shows playbook name and environment tag in the dropdown
- Run name input (required, e.g., "Release 4.2.1 — Staging")
  - Auto-suggested value (optional): `[Playbook name] — [date]` — editable
- Description / release notes (optional, free text — good for linking to PRs, release tickets, or brief context)
- Target completion date (optional, date picker)

**Step 2 — Tester Pre-Assignment (optional, Admin only):**
- Shown only after Step 1 fields are valid
- Subheading: "Assign sections to team members (optional)"
- Brief explanation: "Pre-assignment communicates who is responsible for each section. It's not a hard lock — anyone can still work on any section."
- Section list (from the selected playbook snapshot):
  - One row per section
  - Section name (read-only)
  - Spec count label
  - Member dropdown: "Unassigned" (default) or any org member (Admins and Members in the dropdown)
- "Skip assignment" option / note that the entire step is optional
- Member view: Step 2 is not shown to Members — they cannot pre-assign sections

**Form Actions:**
- "Start run" primary button — creates the run, applies the snapshot, applies any pre-assignments, navigates to [Run Overview](run-overview.md)
- "Cancel" → returns to calling context

---

## User Actions

**Admin:**
- Select a playbook (if not pre-selected)
- Enter run name (required)
- Add optional description and target completion date
- Pre-assign sections to team members (optional)
- Start the run

**Member:**
- Select a playbook (if not pre-selected)
- Enter run name (required)
- Add optional description and target completion date
- Start the run (no pre-assignment step)

---

## Navigation Flow

**How you get here:**
- "New run" button on [Active Runs List](active-runs-list.md)
- "New run" quick action on [Dashboard](../dashboard/dashboard-active.md)
- "Start a run" quick action on [Dashboard](../dashboard/dashboard-active.md) (Member version)
- "Start a run from this playbook" on [Dashboard — New Org](../dashboard/dashboard-new-org.md)
- "Start a run" button in [Playbook Editor](../playbooks/playbook-editor.md) or [Playbook Preview](../playbooks/playbook-preview.md)

**Where this screen leads:**
- Successful submission → [Run Overview](run-overview.md) for the newly created run
- "Cancel" → calling context (playbook editor, active runs list, or dashboard)

---

## Data Displayed

- List of active playbooks (for the playbook selector)
- Playbook's sections and spec counts (for the pre-assignment table, loaded after playbook selection)
- Org members list (for assignment dropdowns)

---

## Modals / Sub-views

None — single-page form.

---

## States

**Default:** Playbook selector open (or pre-selected), run name empty.

**After playbook selection (Admin):** Pre-assignment section list populates below.

**Validation errors:**
- Playbook not selected: "Please select a playbook."
- Run name empty: "Run name is required."

**No active playbooks (edge case):**
- Playbook dropdown shows: "No active playbooks. Create one first."
- "Start run" button is disabled
- "Create playbook" shortcut shown (Admin only)

**Loading (after submit):** "Starting run..." spinner on the button while snapshot is created and run record is initialised.

---

## Notes

- The playbook is snapshotted at the instant the run is created — any edits to the playbook template after this moment have no effect on this run
- Pre-assignment is visible immediately in the [Run Overview](run-overview.md) once the run starts; no notifications are sent for pre-assignment in v1
- Both Admins and Members can start runs — no Admin gate on run creation

---

## Relevant Features

- [Run Execution UI](../../features/must-have/run-execution-ui.md)
- [Tester Assignment](../../features/must-have/tester-assignment.md)
- [Playbook Templates](../../features/must-have/playbook-templates.md)
