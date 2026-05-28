# Screen: Playbook Preview Mode

_Domain: Playbooks_
_Route: `/playbooks/[id]/preview` (or a toggled view state within the editor)_
_Roles: Admin only_

---

## Purpose

A read-only rendering of the playbook exactly as testers will see it during a run. Allows Admins to sense-check the structure, content, and completeness of the playbook before starting a run. All editing controls are hidden; the layout mirrors the Run Overview and Spec Execution Panel so Admins can verify the tester experience is clear.

---

## Key UI Components

**Page Header:**
- Playbook name (read-only)
- Environment tag badge
- "Back to editor" button (exits Preview Mode, returns to [Playbook Editor](playbook-editor.md))
- "Start a run" button → [Start a Run](../runs/start-run.md)

**Content Area:**
- All sections listed in order
- Each section header: section name (read-only)
- Each spec row within a section:
  - Spec title
  - Severity badge
  - System under test label
  - Artifact requirement summary (e.g., "Requires: 2 screenshots, 1 measured value")
  - Expand control → shows full spec detail (description, preconditions, test steps, expected result, artifact requirement details, tester notes)
- No drag handles, no action menus, no edit controls — clean read-only view

---

## User Actions

- Expand a spec to read its full detail
- Return to the editor
- Start a run directly from preview

---

## Navigation Flow

**How you get here:**
- Clicking "Preview" toggle button in the [Playbook Editor](playbook-editor.md)

**Where this screen leads:**
- "Back to editor" → [Playbook Editor](playbook-editor.md)
- "Start a run" → [Start a Run](../runs/start-run.md)

---

## Data Displayed

- All playbook content exactly as configured: all sections, all specs with all fields
- Artifact requirements displayed in their configured form (labels, types, minimum counts)

---

## Modals / Sub-views

None — this is a purely read-only surface.

---

## States

**Normal:** Full playbook content rendered read-only.

**Empty playbook:** "This playbook has no sections yet." — with a "Back to editor" prompt.

---

## Notes

- Preview mode is specifically designed to help Admins catch configuration errors (e.g., a spec with no test steps but also no description, unclear artifact requirement labels) before testers encounter them in a live run
- The visual layout should match the run execution view as closely as possible to make sense-checking effective

---

## Relevant Features

- [Playbook Templates](../../features/must-have/playbook-templates.md)
- [Run Execution UI](../../features/must-have/run-execution-ui.md)
