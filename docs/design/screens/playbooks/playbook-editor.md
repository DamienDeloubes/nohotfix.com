# Screen: Playbook Editor

_Domain: Playbooks_
_Route: `/playbooks/[id]/edit`_
_Roles: Admin only (Members see a read-only equivalent without editing controls)_

---

## Purpose

The primary authoring surface for a playbook. Admins build and maintain the release checklist here — creating sections, adding or authoring specs, configuring artifact requirements, and managing the overall structure. The editor uses an inline model: everything is edited directly on the page without navigating to sub-pages or opening modals for spec content. A Preview Mode toggle lets Admins sense-check the tester experience before starting a run.

---

## Key UI Components

**Page Header:**
- Playbook name (inline editable — click to edit; press Enter or click away to save)
- Environment tag badge (editable inline)
- "Preview" toggle button (top-right) → switches to [Playbook Preview Mode](playbook-preview.md)
- Playbook action menu (three-dot icon or "..." button, top-right):
  - "Edit metadata" (name, description, environment) → opens inline edit or small form
  - "Duplicate playbook" → creates copy, navigates to duplicate's editor
  - "View change history" → opens [Change History Panel](#change-history-panel-sub-view)
  - "Archive playbook" → confirmation prompt, then redirects to [Playbook List](playbook-list.md)
- "Start a run" button (Admin can start a run directly from the editor as a shortcut) → [Start a Run](../runs/start-run.md)

**Left Panel — Section Navigation Sidebar:**
- Scrollable list of section names in the playbook
- Clicking a section name scrolls the main content area to that section
- "Add section" shortcut at the bottom of the list

**Main Content Area:**
- All sections and their specs displayed in sequence (scroll-based navigation for large playbooks)

**Section Component:**
- Section header:
  - Drag handle (six-dot icon, visible on hover) for reordering sections
  - Section name (inline editable)
  - Section action menu (three-dot icon):
    - "Rename" (or click name directly)
    - "Copy section from another playbook" → opens [Copy Section Picker sub-view](#copy-section-picker-sub-view)
    - "View change history" → opens Change History Panel scoped to this section
    - "Delete section" → confirmation prompt
- Spec list within the section (see below)
- Section footer:
  - "New spec" button → opens inline spec creation form within this section
  - "Add from library" button → opens [Library Search Picker sub-view](#library-search-picker-sub-view)
  - "Bulk insert" button → opens [Bulk Spec Insert sub-view](#bulk-spec-insert-sub-view)

**Spec Row (within a section):**
- Drag handle (six-dot icon) for reordering within section
- Spec title (click to expand the spec detail panel below)
- Severity badge (e.g., "Critical", "High", "Medium", "Low")
- System under test label
- Artifact requirement count indicator (e.g., "2 artifacts")
- Spec action menu (three-dot icon):
  - "Edit spec" (or click title)
  - "Remove from section" (removes link; spec stays in library)
  - "View in library" → navigates to [Spec Detail in Library](../spec-library/spec-detail.md)

**Spec Inline Expansion Panel** (opens when spec title is clicked):
- All spec fields, editable:
  - Title (required)
  - System under test (required)
  - Severity (select: Critical / High / Medium / Low)
  - Preconditions (rich text, optional)
  - Description (rich text, optional)
  - Test steps (ordered list, each with Instruction + Expected outcome fields; add/remove/reorder steps)
  - Expected result (rich text, optional)
  - Tester notes (plain text, optional)
  - Artifact requirements section: list of configured requirements; "Add requirement" button per artifact type (File, Table, Measured Value, URL) with per-type configuration forms
- "Save" button:
  - If editing an existing library-linked spec → triggers [Sync or Keep Local Dialog](#sync-or-keep-local-dialog-sub-view)
  - If creating a brand-new spec inline → saves to library and links automatically (no sync prompt)
- "Cancel" link to discard changes

**"Add section" button:**
- Shown below the last section and in the left panel
- Creates a new empty section with an inline editable name at the bottom of the playbook

---

## User Actions

**Section-level:**
- Add a new section
- Rename a section (inline)
- Reorder sections (drag-and-drop)
- Delete a section (with confirmation if it contains specs)
- Copy a section from another playbook
- View section / playbook change history

**Spec-level:**
- Add a new spec inline (create from scratch, linked to library on save)
- Add a spec from the library (search picker)
- Bulk insert spec titles (text paste → multiple spec shells created)
- Expand a spec to view or edit its full detail
- Save spec edits with sync or keep-local choice
- Reorder specs within a section (drag-and-drop)
- Remove a spec from the section
- View a spec in the library

**Playbook-level:**
- Edit playbook name/description/environment inline
- Switch to Preview Mode
- Duplicate playbook
- Archive playbook (with confirmation)
- View change history
- Start a run from this playbook

---

## Navigation Flow

**How you get here:**
- Clicking a playbook name in [Playbook List](playbook-list.md)
- Clicking a playbook in the Playbooks card on [Dashboard](../dashboard/dashboard-active.md)
- After creating a new playbook in [New Playbook Form](new-playbook.md)
- "Explore the playbook" from [Dashboard — New Org](../dashboard/dashboard-new-org.md) (Admin only)

**Where this screen leads:**
- "Preview" toggle → [Playbook Preview Mode](playbook-preview.md)
- "Start a run" → [Start a Run](../runs/start-run.md)
- "View in library" (spec action) → [Spec Detail](../spec-library/spec-detail.md)
- "Archive" confirmation → [Playbook List](playbook-list.md)
- Sidebar navigation → any other section of the app

---

## Data Displayed

- Playbook metadata: name, description, environment tag
- All sections in order
- All specs per section: title, severity, system under test, artifact requirement count
- Spec expanded: all configured fields, all artifact requirements

---

## Sub-views (Modals, Drawers, Panels)

### Sync or Keep Local Dialog

Triggered when saving edits to an existing library-linked spec.

- Heading: "Save changes to this spec"
- Two options:
  - **"Sync to library"** — updates the library entry and propagates to all linked chapter copies across all playbooks. Confirmation panel shows the full scope: list of all affected playbooks / sections.
    - _"Update spec in library and sync to: [list of playbook/section pairs]"_
    - Actions: "Cancel", "Sync to [N] playbook(s)"
  - **"Keep local"** — saves a local copy; decouples this spec from the library entry; the original library spec is unchanged
- "Cancel" link — discards changes, closes the dialog

### Library Search Picker

Triggered by "Add from library" in the section footer.

- Search input (search by title or system under test)
- Filterable by severity
- Result list: spec title, system under test, severity badge
- Clicking a result adds it to the section and closes the picker
- "Create new spec" shortcut at the bottom if no results match
- "Cancel" to close without adding

### Bulk Spec Insert Sub-view

Triggered by "Bulk insert" in the section footer (Admin only, should-have feature).

- Heading: "Bulk insert specs"
- Textarea: "Paste spec titles here, one per line"
- Preview of parsed titles shown below textarea in real time
- "Create [N] specs" primary button — creates shell specs for each title, links each to a new library entry
- "Cancel"

### Copy Section Picker Sub-view

Triggered by "Copy section from another playbook" in section action menu (should-have feature).

- Step 1: Dropdown to select source playbook (all active playbooks in the org, excluding the current one)
- Step 2: Dropdown or list to select a section from the chosen playbook
- Preview of spec count in selected section
- "Copy section" primary button — copies the section (and all spec links) into the current playbook at the bottom; source playbook is unchanged
- "Cancel"

### Change History Panel

Triggered by "View change history" from the playbook action menu or section action menu.

- Slide-in panel or full-page view (TBD by implementation)
- Heading: "Change history — [Playbook name]"
- Chronological list of changes (newest first):
  - Timestamp
  - Actor name
  - Change description (e.g., "Added section: Payment flows", "Renamed spec: [old] → [new]", "Spec removed from section")
- Read-only — no actions
- "Close" to dismiss

### Delete Section Confirmation Prompt

Triggered by "Delete section" in section action menu.

- Message: _"Delete this section? All [X] specs in it will be removed from this playbook. This cannot be undone."_
- Note: underlying library specs are unaffected
- Actions: "Cancel", "Delete section"

### Archive Playbook Confirmation Prompt

Triggered by "Archive playbook" in playbook action menu.

- Message: _"Archive this playbook? It will be removed from your active list. Runs already started are unaffected."_
- Actions: "Cancel", "Archive"

---

## States

**Normal (populated playbook):** Sections and specs visible; all editing controls enabled.

**Empty playbook (just created):**
- No sections yet
- Prominent "Add section" prompt in the main content area: _"Start building your playbook — add your first section."_
- "Add section" button

**Empty section (section with no specs):**
- Section visible with its name
- Section body shows: _"No specs in this section yet."_
- "New spec", "Add from library", and "Bulk insert" buttons visible in section footer

**Unsaved changes indicator:** Some visual indication (e.g., a dot next to the playbook name or "Unsaved changes" label) when a spec expansion panel has edits that have not been saved.

**Loading:** Skeleton structure while playbook data loads.

---

## Notes

- Editing the playbook template never affects in-progress runs — runs are snapshotted at start time
- Specs cannot be dragged between sections; moving requires removing from one section and adding to another
- The editor is Admin-only; Members see a read-only equivalent without editing controls (all drag handles, action menus, and "Add" buttons hidden)

---

## Relevant Features

- [Playbook Templates](../../features/must-have/playbook-templates.md)
- [Spec Library](../../features/must-have/spec-library.md)
- [Artifact-Gated Spec Execution](../../features/must-have/artifact-gated-spec-execution.md)
- [Bulk Spec Insert](../../features/should-have/bulk-spec-insert.md)
- [Copy Section from Another Playbook](../../features/should-have/copy-section-from-playbook.md)
- [Playbook and Spec Change History](../../features/should-have/playbook-spec-change-history.md)
