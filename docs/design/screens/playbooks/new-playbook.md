# Screen: New Playbook Form

_Domain: Playbooks_
_Route: `/playbooks/new`_
_Roles: Admin only_

---

## Purpose

A focused form for creating a new playbook. Collects the essential metadata — name, optional description, and environment label — before opening the Playbook Editor where sections and specs are built. Keeping this as a separate step prevents the editor from opening to a fully blank state without any context.

---

## Key UI Components

- Page heading: "New playbook"
- Playbook name input (required, max ~100 characters)
- Description input (optional, short text — not rich text; used as a brief summary)
- Environment label input (optional free text, e.g., "Staging", "Production", "Hotfix") — or a short-text field the Admin types into freely
- "Create playbook" primary button
- "Cancel" link → returns to [Playbook List](playbook-list.md)

---

## User Actions

- Enter playbook name (required)
- Enter optional description
- Enter optional environment label
- Submit to create the playbook and open the editor
- Cancel to return to the playbook list

---

## Navigation Flow

**How you get here:**
- "New playbook" button on [Playbook List](playbook-list.md)
- "New playbook" quick action on [Dashboard](../dashboard/dashboard-active.md)
- "Build your own playbook" link on [Dashboard — New Org](../dashboard/dashboard-new-org.md)

**Where this screen leads:**
- Successful creation → [Playbook Editor](playbook-editor.md) for the newly created playbook (with an empty section prompt)
- "Cancel" → [Playbook List](playbook-list.md)

---

## Data Displayed

- No pre-populated data; all fields are empty on arrival

---

## Modals / Sub-views

None.

---

## States

**Default:** All fields empty.

**Validation error:** Name field empty on submit — inline error "Playbook name is required."

**Loading:** "Create playbook" button shows spinner while the record is created.

---

## Notes

- After creation, the playbook is immediately in `Active` state
- The Admin lands in the Playbook Editor with a prompt to add the first section
- Environment label is free text — no predefined list; Admins type whatever makes sense for their team

---

## Relevant Features

- [Playbook Templates](../../features/must-have/playbook-templates.md)
