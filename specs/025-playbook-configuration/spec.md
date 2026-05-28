# Feature Specification: Playbook & Sections Configuration

**Feature Branch**: `025-playbook-configuration`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Playbook and sections configuration — creating playbooks, organising with sections, and populating with specs from the spec library"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Minimal Playbook (Priority: P1)

An admin navigates to the playbook list page and creates a new playbook by providing a name. After creation, they land on the empty playbook editor where they can immediately start adding specs from the library. This is the foundational flow — without playbook creation, nothing else in this feature works.

**Why this priority**: Creating a playbook is the prerequisite for all other functionality. A playbook with ungrouped specs is the simplest viable configuration (flat checklist).

**Independent Test**: Can be fully tested by creating a playbook, adding specs from library to the ungrouped zone, and verifying the playbook persists across page reloads. Delivers a usable flat-checklist playbook.

**Acceptance Scenarios**:

1. **Given** an admin on the playbook list page, **When** they click "+ New playbook", **Then** they are navigated to the create playbook form.
2. **Given** the create form is open, **When** the admin enters a valid name (1-255 chars) and submits, **Then** the playbook is created and the admin is redirected to the playbook editor page.
3. **Given** the create form is open, **When** the admin optionally fills in a description (max 500 chars) and selects a default environment, **Then** these fields are saved with the playbook.
4. **Given** the playbook editor is open for a new playbook, **When** the admin views the page, **Then** the content area is empty with only the ungrouped zone showing an "Add from library" button.

---

### User Story 2 - Add Specs from Library to Playbook (Priority: P1)

An admin opens the playbook editor and clicks "Add from library" to open a search picker. They search for specs by title, see results with severity badge and system under test, and click to add specs to the playbook. Already-added specs are visually marked and non-selectable. The picker stays open so the admin can add multiple specs in one session.

**Why this priority**: Adding specs is the core action that gives a playbook its content. Without specs, a playbook is an empty shell with no testing value.

**Independent Test**: Can be tested by opening a playbook editor, using the spec picker to search and add specs, verifying specs appear in the playbook, and confirming duplicates are prevented.

**Acceptance Scenarios**:

1. **Given** an admin on the playbook editor, **When** they click "Add from library" in the ungrouped zone, **Then** a search picker opens showing all available specs.
2. **Given** the picker is open, **When** the admin types in the search field, **Then** results are filtered live by spec title.
3. **Given** the picker shows results, **When** the admin clicks a spec, **Then** the spec is added to the playbook and the picker remains open.
4. **Given** a spec is already in the playbook (in any zone), **When** the picker displays that spec, **Then** it is visually marked as "already added" and cannot be selected again.
5. **Given** the spec library is empty, **When** the admin opens the picker, **Then** an empty state message reads "No specs in the library. Create specs in the Spec Library first."
6. **Given** the admin searches for a term with no matches, **When** results are filtered, **Then** a message reads "No specs found matching '[search term]'."

---

### User Story 3 - Organise Playbook with Sections (Priority: P2)

An admin adds named sections to a playbook to group related specs together. They can rename sections inline, delete sections (with confirmation if specs exist), and reorder sections via drag-and-drop. Sections provide organisational structure but are optional — a playbook works fine without them.

**Why this priority**: Sections add organisational value but are not required for a functional playbook. A flat checklist (ungrouped specs only) already delivers testing value.

**Independent Test**: Can be tested by creating sections, renaming them, reordering them, and deleting them (with and without contained specs), then verifying the playbook structure persists.

**Acceptance Scenarios**:

1. **Given** the playbook editor, **When** the admin clicks "Add section", **Then** a new section is appended with an inline-editable name field, focused and ready for typing.
2. **Given** a new section name field is focused, **When** the admin types a name (1-255 chars) and presses Enter or clicks away, **Then** the section is saved with that name.
3. **Given** an existing section, **When** the admin clicks the section name, **Then** it becomes editable inline; saving on Enter or blur.
4. **Given** a section with no specs, **When** the admin selects "Delete section" from the action menu, **Then** the section is deleted immediately without confirmation.
5. **Given** a section with 5 specs, **When** the admin selects "Delete section", **Then** a confirmation prompt reads "Delete this section? All 5 specs in it will be removed from this playbook. The specs remain in the spec library." and the admin must confirm to proceed.
6. **Given** multiple sections exist, **When** the admin drags a section by its drag handle, **Then** the section moves to the new position among other sections; the ungrouped zone remains fixed at the top.

---

### User Story 4 - Add Specs to Sections (Priority: P2)

An admin adds specs from the library into specific sections using the "Add from library" button within each section. Each section has its own spec picker that adds specs to that section. Specs within a section can be reordered via drag-and-drop but cannot be dragged between sections.

**Why this priority**: Depends on both the spec picker (P1) and section management (P2). Completes the structured playbook experience.

**Independent Test**: Can be tested by creating sections, adding specs to each section, reordering specs within a section, and verifying the structure persists.

**Acceptance Scenarios**:

1. **Given** a section in the playbook editor, **When** the admin clicks "Add from library" in that section's footer, **Then** the picker opens and selected specs are added to that specific section.
2. **Given** a spec is already in the ungrouped zone, **When** the admin opens the picker for a section, **Then** that spec is shown as "already added" and cannot be selected.
3. **Given** multiple specs in a section, **When** the admin drags a spec by its handle, **Then** the spec is reordered within that section only.
4. **Given** a spec in a section, **When** the admin selects "Remove from playbook" from the action menu, **Then** the spec is removed from the section without confirmation.

---

### User Story 5 - Edit Playbook Metadata Inline (Priority: P3)

An admin edits the playbook name, description, and default environment directly on the editor page without navigating away. Changes are saved immediately on blur or Enter.

**Why this priority**: Metadata editing is a refinement flow. The admin can set these during creation; inline editing is a convenience for later adjustments.

**Independent Test**: Can be tested by editing each metadata field (name, description, environment) on the editor and verifying changes persist on page reload.

**Acceptance Scenarios**:

1. **Given** the playbook editor header, **When** the admin clicks the playbook name, **Then** it becomes editable inline; saving on Enter or blur.
2. **Given** the admin clears the name field, **When** they attempt to save (blur/Enter), **Then** a validation error is shown and the previous name is restored.
3. **Given** the description is collapsed (empty), **When** the admin clicks it, **Then** it expands to an editable textarea; saving on blur.
4. **Given** the environment badge, **When** the admin clicks it, **Then** a dropdown of managed environments appears and selecting one saves immediately.

---

### User Story 6 - View Playbook List (Priority: P3)

All organisation members can view the list of playbooks. The list shows each playbook's name, environment, spec count, and created date. Admins/owners can click through to the editor; members see a preview (out of scope for this feature). An empty state is shown when no playbooks exist.

**Why this priority**: The list page is a navigation aid. The core value is in the editor, but the list is needed for discoverability and access.

**Independent Test**: Can be tested by verifying the list page loads, shows correct playbook data, handles empty state, and respects role-based access for the create button and click-through behaviour.

**Acceptance Scenarios**:

1. **Given** an organisation with playbooks, **When** any member visits the playbooks page, **Then** they see a list showing each playbook's name, environment (if set), number of specs, and created date.
2. **Given** the playbook list, **When** an admin or owner clicks a playbook row, **Then** they are navigated to the playbook editor.
3. **Given** a member role user, **When** they click a playbook row, **Then** they see a read-only preview (out of scope — not implemented in this feature; clicking may do nothing or navigate to a placeholder).
4. **Given** no playbooks exist, **When** any user visits the list page, **Then** an empty state shows "No playbooks yet" with the "+ New playbook" button (visible only to admin/owner).
5. **Given** a member role user, **When** they view the list page, **Then** the "+ New playbook" button is not visible.

---

### Edge Cases

- What happens when a playbook has 10+ sections and 100+ specs? The editor must remain performant; drag-and-drop should work smoothly.
- What happens when two admins edit the same playbook simultaneously? Last write wins at the field level. No real-time collaboration — the other admin sees updated state on next fetch.
- What happens when a library spec is archived after being added to a playbook? The spec still appears in the playbook. Behaviour is handled by future archive/sync features.
- What happens when a section has no specs? It remains valid as a placeholder.
- What happens when only ungrouped specs exist (no sections)? The playbook functions as a flat checklist.
- What happens when only sections exist (no ungrouped specs)? The ungrouped zone still shows its "Add from library" button.
- What happens when there is only one section or one spec? Drag handle is present but reorder is a no-op.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow admins and owners to create a playbook with a required name (1-255 chars), optional description (max 500 chars), and optional default environment (selected from org's managed environments).
- **FR-002**: System MUST redirect the admin to the playbook editor page after successful playbook creation.
- **FR-003**: System MUST display the playbook editor with two content zones: an ungrouped specs zone (always at the top) and an ordered list of sections below it.
- **FR-004**: System MUST allow admins to add specs from the spec library via a search picker that filters by spec title with live results showing title, severity badge, and system under test.
- **FR-005**: System MUST prevent duplicate specs within a single playbook — specs already added (in any zone or section) are visually marked and non-selectable in the picker.
- **FR-006**: System MUST keep the spec picker open after selecting a spec so the admin can add multiple specs in one session.
- **FR-007**: System MUST allow admins to add named sections to a playbook with inline-editable names (1-255 chars, required).
- **FR-008**: System MUST allow admins to rename sections inline (click to edit, save on Enter or blur).
- **FR-009**: System MUST allow admins to delete sections — immediately if empty, with a confirmation prompt if the section contains specs.
- **FR-010**: System MUST NOT delete library specs when a section is deleted or a spec is removed from a playbook.
- **FR-011**: System MUST allow admins to reorder sections via drag-and-drop; the ungrouped zone is fixed at the top and cannot be moved.
- **FR-012**: System MUST allow admins to reorder specs within their section (or ungrouped zone) via drag-and-drop.
- **FR-013**: System MUST NOT allow dragging specs between sections or between the ungrouped zone and a section.
- **FR-014**: System MUST allow admins to remove a spec from the playbook without confirmation.
- **FR-015**: System MUST display each spec row with: drag handle, title, severity badge (if set), system under test (if set), and an action menu with "Remove from playbook".
- **FR-016**: System MUST allow inline editing of playbook metadata (name, description, environment) on the editor page with immediate save on blur or Enter.
- **FR-017**: System MUST validate that the playbook name is not empty; if cleared, show a validation error and restore the previous name.
- **FR-018**: System MUST display a playbook list page showing each playbook's name, environment (if set), number of specs, and created date.
- **FR-019**: System MUST show the "+ New playbook" button only to admin and owner roles.
- **FR-020**: System MUST allow admin and owner roles to click through from the list to the playbook editor.
- **FR-021**: System MUST show an empty state ("No playbooks yet" with create button for admin/owner) when no playbooks exist.
- **FR-022**: System MUST show an empty state in the spec picker when the library is empty or no search results match.
- **FR-023**: System MUST show the "Add from library" button in both the ungrouped zone and each section footer.

### Key Entities

- **Playbook**: A reusable release-testing template with a name, optional description, and optional default environment. Contains an ordered collection of sections and ungrouped specs.
- **Section**: A named grouping within a playbook. Contains an ordered list of spec references. Sections themselves are ordered within the playbook.
- **Playbook Spec**: A reference linking a library spec to a specific position in a playbook (either ungrouped or within a section). Stores ordering position and a snapshot copy of spec content at add time; links back to the spec library via `specLibraryId`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create a new playbook and have it appear on the list page within 3 seconds end-to-end.
- **SC-002**: Admins can add specs from the library to a playbook using the search picker, with search results appearing as the admin types (within 300ms perceived latency).
- **SC-003**: Admins can create, rename, reorder, and delete sections without page reloads or navigation away from the editor.
- **SC-004**: The playbook editor remains responsive (no perceptible lag in interactions) with playbooks containing up to 10 sections and 100 specs.
- **SC-005**: All playbook changes (spec additions/removals, section changes, metadata edits) persist correctly across page reloads.
- **SC-006**: Role-based access is enforced: members can view the list but cannot create playbooks or access the editor; admins and owners have full access.
- **SC-007**: Duplicate specs within a single playbook are prevented — admins cannot accidentally add the same spec twice.

## Assumptions

- The spec library already exists and contains specs that can be referenced (features 011, 014, 015 are implemented or in progress).
- Managed environments are already available from a prior feature (021-managed-environments) and can be fetched for the dropdown.
- The existing `playbooks`, `playbook_sections`, and `playbook_specs` database tables exist from the initial schema migration and support the required data model.
- Role-based access control (owner, admin, member) is already implemented via the existing role guard middleware.
- The `@dnd-kit` library is already available in the frontend for drag-and-drop functionality.
- Spec rows in the playbook editor are read-only — clicking does not expand to show details. Editing spec content requires navigating to the spec library.
- Member click-through to a read-only preview is out of scope and will be handled by a separate feature.
