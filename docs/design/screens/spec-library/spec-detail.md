# Screen: Spec Detail / Editor (Library)

_Domain: Spec Library_
_Route: `/spec-library/[id]`_
_Roles: Admin only_

---

## Purpose

The full view and edit surface for a single spec accessed from the library. Shows all spec fields, the list of playbooks this spec is linked to, and the spec's change history. Edits made here update the library entry directly — but in v1, library edits do not auto-propagate to linked chapters (sync goes chapters → library, not the reverse).

---

## Key UI Components

**Page Header:**
- Back link: "← Spec Library" → [Spec Library](spec-library.md)
- Spec title (large, inline editable)
- Status badge: "Active" or "Archived"
- Spec action menu (three-dot icon):
  - "Archive spec" (or "Unarchive" if currently archived) → confirmation prompt
  - "View change history" → opens Change History Panel

**Spec Fields (all inline editable for Admins):**
- Title (required)
- System under test (required)
- Severity (select: Critical / High / Medium / Low)
- Preconditions (rich text, optional)
- Description (rich text, optional)
- Test steps (ordered list — each step has Instruction + Expected outcome; can add, remove, reorder via drag handle)
- Expected result (rich text, optional)
- Tester notes (plain text, optional — internal hint, not visible in audit trail)

**Artifact Requirements Section:**
- List of all configured artifact requirements for this spec
- Each requirement shown with: type badge (File / Table / Measured Value / URL), label, and configuration summary
- "Add artifact requirement" button — opens an inline form per type:
  - **File Upload:** file type selector, minimum count, optional label
  - **Table:** column builder (name, data type, required/optional flag per column), minimum row count, optional label
  - **Measured Value:** label, unit, optional threshold + operator
  - **URL:** optional label
- Existing requirements can be edited (expand inline) or deleted (remove button)

**Linked Playbooks Section:**
- Heading: "Used in [N] playbook(s)"
- List of playbook names + section names where this spec is linked
- Each entry is a link → [Playbook Editor](../playbooks/playbook-editor.md) scrolled to the relevant section

**"Save" button:**
- Saves all field changes directly to the library entry
- Note: does not propagate to linked chapters (v1 constraint — library edits stay in the library)
- "Discard changes" link to revert unsaved edits

---

## User Actions

- Edit any spec field
- Add, edit, or remove artifact requirements
- Save changes to the library entry
- Discard unsaved changes
- Archive or unarchive the spec
- View change history for the spec
- Navigate to linked playbooks / sections

---

## Navigation Flow

**How you get here:**
- Clicking a spec row in [Spec Library](spec-library.md)
- "View in library" from the spec action menu in [Playbook Editor](../playbooks/playbook-editor.md)

**Where this screen leads:**
- "← Spec Library" → [Spec Library](spec-library.md)
- Linked playbook link → [Playbook Editor](../playbooks/playbook-editor.md)

---

## Data Displayed

- All spec fields (current values)
- All configured artifact requirements
- Linked playbooks and sections
- Spec status (Active / Archived)

---

## Modals / Sub-views

**Archive Confirmation Prompt:**
- Message: _"Archive this spec? It will be hidden from library search. Playbook sections already using this spec are unaffected."_
- Actions: "Cancel", "Archive"

**Change History Panel:**
- Slide-in panel or tabbed view
- Heading: "Change history — [Spec title]"
- Chronological list (newest first): timestamp, actor name, field changed, previous value, new value
- Sync-triggered changes noted: "Synced from [Playbook name] — [Section name]"
- Read-only

---

## States

**Normal (active spec):** All fields editable; Archive action available.

**Archived spec:** All fields visible but read-only; "Unarchive" action available; editing requires unarchiving first (or edit is blocked with a note: "Unarchive this spec to edit it").

**Unsaved changes:** Visual indicator (e.g., "Unsaved changes" label near the Save button) when edits have been made but not saved.

**Loading:** Skeleton fields while the spec data loads.

---

## Notes

- This is distinct from the inline expansion panel in the Playbook Editor; this screen is the full-page library view for a spec
- Table artifact requirement: the column builder allows adding multiple columns per requirement; each column has name, type (Text / Number / Pass-Fail), and a Required / Optional toggle

---

## Relevant Features

- [Spec Library](../../features/must-have/spec-library.md)
- [Artifact-Gated Spec Execution](../../features/must-have/artifact-gated-spec-execution.md)
- [Playbook and Spec Change History](../../features/should-have/playbook-spec-change-history.md)
