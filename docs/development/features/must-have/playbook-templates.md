# Feature: Playbook Templates

## Overview

Playbook Templates are the authoring layer of NoHotfix. They define what gets tested on every release — sections grouping related specs, with all artifact requirements configured. When a run is started, the playbook is snapshotted, so the template can evolve without affecting in-progress runs. Templates can be archived and duplicated to support different environments and release types.

## Complexity Assessment

- **Technical Complexity**: Medium — snapshot semantics at run-start require a reliable deep-copy mechanism that decouples the run from any subsequent template edits; the section/spec structure must support drag-and-drop reordering.
- **Design Complexity**: Medium — the playbook editor needs to handle nested structures (playbook → sections → specs) with inline editing, reordering, and linking to the spec library in a single coherent surface.
- **User Experience Complexity**: Low — the mental model of a checklist template is familiar; the snapshot behaviour (edits don't affect in-progress runs) needs clear communication but is not conceptually difficult.

## Detailed Description

### Playbook CRUD

- Create a playbook (name, description, environment label e.g. "Staging", "Production", "Hotfix")
- Edit playbook metadata
- Archive a playbook (hidden from active list, runs already started are unaffected)
- Duplicate a playbook (good for creating variants)

### Versioning (critical from day 1)

- When a Run is started, the playbook is snapshotted — the run is bound to that exact state
- Editing a playbook after a run has started does not affect in-progress runs
- No need to expose version numbers in v1, just enforce the snapshot semantics

### Playbook List View

- Show: name, environment, number of specs, last run date, active runs count
- Filter by environment tag

---

### Playbook Editor UX

The playbook editor is the primary authoring surface. It is accessible to Admins only.

#### Editor Surface Layout

The editor uses an **inline editing model** — sections and specs are edited directly on the page without navigating away or opening modals. The structure mirrors the run execution view so that playbooks look like what testers will see.

The editor is divided into:

- **Left panel (sidebar)**: section list for quick navigation within the playbook; clicking a section name scrolls to it
- **Main content area**: the playbook body, showing all sections and their specs in order

A read-only **Preview mode** toggle is available in the top-right of the editor. Preview mode renders the playbook exactly as it will appear to testers during a run — all editing controls are hidden. This allows Admins to sense-check the structure before starting a run.

#### Section Management

- **Create a section**: An "Add section" button is shown below the last section and in the left sidebar. Clicking it adds a new empty section at the bottom of the playbook with an inline editable name field. The Admin types the section name and presses Enter or clicks away to save.
- **Rename a section**: Click the section name to make it editable inline. Press Enter or click away to save.
- **Reorder sections**: Sections can be dragged to a new position using a drag handle (six-dot icon) shown on section hover. Drop targets are indicated visually between sections during drag.
- **Delete a section**: A "Delete section" option is available in the section's action menu (three-dot icon). Deleting a section also removes all spec links within it — the underlying library specs are unaffected. If the section has specs, a confirmation prompt is shown: _"Delete this section? All [X] specs in it will be removed from this playbook. This cannot be undone."_

#### Spec Management within a Section

- **Add a spec**: Two options shown in the section footer: "New spec" (Method 1 — creates inline) and "Add from library" (Method 2 — opens a search picker). See spec-library.md for full detail on both methods.
- **Reorder specs**: Specs within a section can be dragged to a new position using the same drag-handle pattern as sections. Specs cannot be dragged between sections — to move a spec to a different section, remove it from the current section and add it to the target section.
- **Remove a spec from section**: A "Remove from section" option in the spec's action menu. This removes the link — the spec remains in the library and in any other sections that use it.
- **Edit a spec**: Clicking a spec title opens it in an inline expansion panel below the spec header, showing all fields. Editing follows the Sync / Keep Local model described in spec-library.md.

#### Playbook Archive

Archiving a playbook removes it from the active playbook list and prevents new runs from being started from it.

- The "Archive" action is in the playbook settings menu (top-right of the editor and on the playbook list row)
- A confirmation prompt is shown: _"Archive this playbook? It will be removed from your active list. Runs already started are unaffected."_
- Archived playbooks appear in a separate "Archived" tab on the playbook list page
- Archived playbooks can be unarchived by an Admin at any time — no data is lost
- An archived playbook with active runs: the runs continue to completion normally; the playbook itself is simply not available for new runs

#### Playbook Duplicate

- The "Duplicate" action is in the playbook settings menu and on the playbook list row
- Creates a full copy of the playbook: same name with a " (copy)" suffix (editable immediately after creation), same sections, same spec ordering
- All spec links are preserved — the duplicate's specs are linked to the same library entries as the original. Changes to specs in the duplicate can be synced to the library (affecting all linked playbooks) or kept local.
- The duplicate starts with no run history — it is a fresh template
