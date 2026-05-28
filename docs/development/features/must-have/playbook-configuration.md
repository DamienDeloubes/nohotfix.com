# Feature: Playbook & Sections Configuration

_Last updated: 2026-03-11_

## Overview

This feature covers the foundational playbook authoring experience: creating playbooks, organising them with sections, and populating them with specs from the spec library. A playbook is a reusable template defining what needs to be tested before a release. Sections are optional groupings within a playbook. Specs can live inside a section or ungrouped at the top level. Environment is an optional default set at the playbook level (from the org's managed environments list) that will be required and overridable at run creation.

### Playbook List Page

- **Route**: `/:orgSlug/playbooks`
- **Access**: Owner, Admin, and Member can view the playbooks

#### Page Layout

- Heading: "Playbooks"
- Primary action button: "+ New playbook" → navigates to `/:orgSlug/playbooks/new`. Only visible for admin and owner roles
- List of playbooks showing: name, environment (if set), number of specs, created date
- Clicking a playbook row navigates to the playbook editor. This is only for the admin and owner role. When a member clicks on it they can preview it, but that is implemented in another feature so out of scope.

#### Empty State

A simple "No playbooks yet" message with the create button is sufficient.

---

### Create Playbook

- **Route**: `/:orgSlug/playbooks/new`
- **Access**: Owner, Admin only

#### Form Fields

| Field               | Type                            | Required | Notes                                                                                                     |
| ------------------- | ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| Name                | Text input                      | Yes      | 1-255 chars                                                                                               |
| Description         | Textarea                        | No       | Free text, maximum 500 chars                                                                              |
| Default Environment | Dropdown (managed environments) | No       | Populated from org's managed environments, explain that this can be overridden when running the playbook. |

- On submit: playbook is created and user is redirected to the playbook editor page.
- The playbook starts empty — no sections, no specs.

---

### Playbook Editor

- **Route**: `/:orgSlug/playbooks/:playbookId`
- **Access**: Admin only

The editor is a single page where the admin builds up the playbook structure. All editing happens inline.

#### Header

- Playbook name (inline-editable on click)
- Environment badge (shows current environment, clickable to change)
- Description (inline-editable, collapsed by default if empty)

#### Content Area Structure

The content area shows two zones:

1. **Ungrouped specs** — specs with no section, displayed at the top of the content area
2. **Sections** — ordered list of sections, each containing its own ordered specs

```
┌──────────────────────────────────────┐
│ [Ungrouped specs]                    │
│   Spec A                             │
│   Spec B                             │
│   + Add from library                 │
│                                      │
│ ── Section: API Tests ────────────── │
│   Spec C                             │
│   Spec D                             │
│   + Add from library                 │
│                                      │
│ ── Section: UI Tests ─────────────── │
│   Spec E                             │
│   + Add from library                 │
│                                      │
│ + Add section                        │
└──────────────────────────────────────┘
```

---

### Section Management

#### Adding a Section

- "Add section" button at the bottom of the content area
- Clicking it appends a new section with an inline-editable name field, focused and ready for typing
- Press Enter or click away to save
- Validation: name required, 1-255 chars

#### Renaming a Section

- Click the section name to make it editable inline
- Press Enter or click away to save

#### Deleting a Section

- Action menu (three-dot icon) on the section header → "Delete section"
- If the section contains specs, confirmation prompt: "Delete this section? All [X] specs in it will be removed from this playbook. The specs remain in the spec library."
- If the section is empty, delete immediately without confirmation
- Deleting a section does NOT delete the underlying library specs — it only removes them from this playbook

#### Reordering Sections

- Drag handle (six-dot icon) on section header
- Sections can be dragged to a new position among other sections
- Ungrouped specs zone always stays at the top and is not draggable

---

### Spec Management

#### Adding a Spec from Library

- "Add from library" button appears in two places:
  - In the ungrouped specs zone (adds spec without a section)
  - In each section footer (adds spec to that section)
- Clicking opens a **search picker**:
  - Search input with live filtering by spec title
  - Results show: title, severity badge, system under test
  - Clicking a result adds the spec to the playbook
  - Already-added specs are visually marked and non-selectable (prevent duplicates within the same playbook)
  - Picker will be dismissable by user, shouldnt close when the user picks a spec.

#### Removing a Spec

- Action menu on spec row → "Remove from playbook"
- No confirmation needed — the spec remains in the library
- Removing a spec from a section does not affect other playbooks using the same library spec

#### Reordering Specs

- Drag handle on each spec row
- Specs can be reordered within their section (or within the ungrouped zone)
- Specs **cannot** be dragged between sections or between ungrouped and a section in this phase
- To move a spec to a different section: remove from current location, add again in the target section

#### Spec Display in the Editor

Each spec row in the editor shows:

- Drag handle
- Title
- Severity badge (if set)
- System under test (if set)
- Action menu (remove)

Spec rows are **read-only in this phase** — clicking does not expand to show full details. The spec is a reference to the library entry. To edit spec content, the admin goes to the spec library.

---

### Playbook Metadata Editing

All metadata fields are editable inline on the editor page:

- **Name**: click to edit, Enter to save. Required, 1-255 chars.
- **Description**: click to edit, Enter/blur to save. Optional.
- **Environment**: dropdown, change saved immediately. Optional.

---

## Happy Paths

1. **Create a minimal playbook**: Admin clicks "+ New playbook" → enters name "Hotfix Deploy" → submits → lands on empty editor → adds 3 specs from library to ungrouped zone → done. A simple flat checklist.

2. **Create a structured playbook**: Admin creates "Sprint Release" playbook with environment "Staging" → adds section "Backend" → adds 5 API specs from library → adds section "Frontend" → adds 3 UI specs → reorders "Frontend" above "Backend" → done.

3. **Mixed structure**: Admin creates a playbook → adds 2 ungrouped specs (quick sanity checks) → adds a section "Deep Regression" with 10 specs → the playbook has both ungrouped and sectioned specs.

4. **Edit existing playbook**: Admin opens a playbook → renames a section → removes a spec that's no longer relevant → adds a new spec from library → reorders specs within a section.

5. **Change environment**: Admin opens a playbook → clicks the environment badge → selects "Production" from dropdown → saved immediately.

## Unhappy Paths

1. **Empty playbook name**: Admin tries to save a playbook with no name → validation error, field highlighted, not saved.

2. **Duplicate spec in playbook**: Admin tries to add a spec that's already in the playbook (in any section or ungrouped) → spec is shown as already-added in the picker and cannot be selected again.

3. **Delete section with specs**: Admin deletes a section containing 5 specs → confirmation dialog warns about the 5 specs being removed → admin confirms → section and spec references removed, library specs untouched.

4. **No specs in library**: Admin clicks "Add from library" but the spec library is empty → picker shows empty state: "No specs in the library. Create specs in the Spec Library first."

5. **Search yields no results**: Admin searches for "performance" in the spec picker but no specs match → "No specs found matching 'performance'."

## Edge Cases

1. **Large playbook**: A playbook with 10+ sections and 100+ specs — editor must remain performant. Drag-and-drop should work smoothly. Consider virtualisation if performance degrades.

2. **Concurrent editing**: Two admins edit the same playbook simultaneously. Last write wins at the field level. No real-time collaboration in v1 — if conflicts occur, the last save persists and the other admin sees the updated state on next fetch.

3. **Library spec archived after being added to playbook**: When a spec is archived in the library, it is removed from all playbook templates that reference it (both active and archived playbooks). The spec's data remains in the library on the Archived tab, and any runs already started are unaffected (snapshotted). See [Archive Spec](archive-spec.md) for full details.

4. **Section with no specs**: Perfectly valid. An empty section can exist as a placeholder the admin plans to fill later.

5. **Ungrouped specs zone when empty**: The zone is always visible (with the "Add from library" button) even when empty, so the admin always has the option to add ungrouped specs.

6. **Reorder with single item**: Reordering when there's only one section or one spec in a section — drag handle is present but reorder is a no-op.

7. **Playbook with only ungrouped specs**: Valid. Not all playbooks need sections. The playbook functions as a flat checklist.

8. **Playbook with only sections (no ungrouped specs)**: Also valid. The ungrouped zone just shows its "Add from library" button.

---

## Out of Scope (future phases)

- Inline spec creation (create spec directly in playbook, not from library)
- Preview playbook
- Archive / unarchive playbook
- Duplicate playbook
- Delete playbook
- Bulk insert specs (paste multiple titles)
- Copy section from another playbook
- Sync / detach library-linked specs (edit propagation)
- Change history panel
- Preview mode (read-only tester view)
- Spec inline expansion (view/edit full spec details in the editor)
- Drag specs between sections
- Onboarding / guided empty states
