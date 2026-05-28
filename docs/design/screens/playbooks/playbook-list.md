# Screen: Playbook List

_Domain: Playbooks_
_Route: `/playbooks`_
_Roles: Admin (full access), Member (read-only, can view but not edit)_

---

## Purpose

The master list of all playbooks in the organisation. Gives Admins oversight of all active and archived playbooks, entry points to edit them, and quick actions to create, duplicate, or archive. Members can view this list but their interactions are read-only.

---

## Key UI Components

**Page Header:**
- Heading: "Playbooks"
- "New playbook" primary button (Admin only) → [New Playbook Form](new-playbook.md)

**Tab Bar:**
- "Active" tab (default) — all playbooks not archived
- "Archived" tab — archived playbooks

**Playbook List (Active tab):**
- Table or card list of all active playbooks
- Per-row fields:
  - Playbook name (linked — click opens Playbook Editor for Admin, read-only view for Member)
  - Environment tag badge (e.g., "Staging", "Production", "Hotfix")
  - Spec count
  - Last run date
  - Active runs count (number of in-progress runs started from this playbook)
- Filter bar: filter by environment tag
- Per-row action menu (Admin only, three-dot icon):
  - "Open" → [Playbook Editor](playbook-editor.md)
  - "Duplicate" → creates a copy, navigates to the duplicated playbook's editor
  - "Archive" → shows confirmation prompt, then moves to Archived tab

**Playbook List (Archived tab):**
- Same table structure as Active tab
- Per-row action menu (Admin only):
  - "Unarchive" → moves back to Active tab immediately
- No "New playbook" button in this tab context

---

## User Actions

**Admin:**
- Create a new playbook
- Open a playbook to edit it
- Duplicate a playbook
- Archive a playbook (with confirmation)
- Unarchive a playbook (from Archived tab)
- Filter by environment tag
- Switch between Active and Archived tabs

**Member:**
- View the playbook list
- Click a playbook name to view it in read-only mode (no editor)

---

## Navigation Flow

**How you get here:**
- Clicking "Playbooks" in the sidebar from any screen
- "View all playbooks" link from the Playbooks card on the [Dashboard](../dashboard/dashboard-active.md)

**Where this screen leads:**
- Click playbook name / "Open" → [Playbook Editor](playbook-editor.md) (Admin) or read-only view (Member)
- "New playbook" → [New Playbook Form](new-playbook.md)
- "Duplicate" → same as clicking the new duplicate's name → [Playbook Editor](playbook-editor.md) for the new copy

---

## Data Displayed

- All active playbooks: name, environment, spec count, last run date, active runs count
- Archived playbooks: same fields

---

## Modals / Sub-views

**Archive Confirmation Prompt (inline or modal):**
- Triggered by "Archive" in the row action menu
- Message: _"Archive this playbook? It will be removed from your active list. Runs already started are unaffected."_
- Actions: "Cancel", "Archive"

---

## States

**Active tab with playbooks:** Standard table view.

**Active tab empty (no active playbooks):** Empty state — "No active playbooks. Create one to get started." + "New playbook" button.

**Archived tab with entries:** Standard table of archived playbooks.

**Archived tab empty:** "No archived playbooks."

**Loading:** Skeleton rows or spinner while the list fetches.

---

## Relevant Features

- [Playbook Templates](../../features/must-have/playbook-templates.md)
