# Feature Specification: Archive Spec

**Feature Branch**: `024-archive-spec`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Admins and owners can archive and unarchive specs from the Spec Library. Archiving hides a spec from the Active tab, makes it read-only, and records the action in the changelog. Unarchiving restores the spec to active status."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Archive a Spec from the Overview Table (Priority: P1)

An admin or owner is on the Spec Library overview page viewing the Active tab. They open the three-dot action menu on a spec row and click "Archive". A confirmation dialog appears asking them to confirm the action. Upon confirmation, the spec row is removed from the Active tab (optimistic update), a success toast appears ("Spec archived."), and the spec becomes visible on the Archived tab. A changelog entry is recorded with the action "archived".

**Why this priority**: Archiving from the overview table is the primary and most common entry point for retiring specs. Without this, admins have no way to declutter the active library.

**Independent Test**: Can be fully tested by creating a spec, archiving it from the overview table, and verifying it moves to the Archived tab. Delivers immediate value by enabling library management.

**Acceptance Scenarios**:

1. **Given** an admin is on the Active tab of the Spec Library overview, **When** they click "Archive" in a spec's action menu and confirm, **Then** the spec row disappears from the Active tab, a "Spec archived." toast appears, and the spec is visible on the Archived tab.
2. **Given** an admin opens the archive confirmation dialog, **When** they click "Cancel", **Then** the dialog closes and the spec remains active on the Active tab.
3. **Given** a member is on the Active tab, **When** they open a spec's action menu, **Then** the "Archive" option is not present — only "View" and "Edit spec" are shown.

---

### User Story 2 - Unarchive a Spec from the Archived Tab (Priority: P1)

An admin or owner is on the Spec Library overview page viewing the Archived tab. They open the three-dot action menu on an archived spec row and click "Unarchive". The action executes immediately (no confirmation dialog). The spec row is removed from the Archived tab (optimistic update), a success toast appears ("Spec unarchived."), and the spec is visible on the Active tab. A changelog entry is recorded with the action "unarchived".

**Why this priority**: Unarchiving is the complement of archiving — without it, archiving is irreversible, which undermines user confidence and adoption.

**Independent Test**: Can be fully tested by navigating to the Archived tab, unarchiving a spec, and verifying it appears on the Active tab.

**Acceptance Scenarios**:

1. **Given** an admin is on the Archived tab, **When** they click "Unarchive" in a spec's action menu, **Then** the spec row disappears from the Archived tab, a "Spec unarchived." toast appears, and the spec is visible on the Active tab.
2. **Given** a member is on the Archived tab, **When** they open a spec's action menu, **Then** the "Unarchive" option is not present — only "View" is shown.

---

### User Story 3 - Archive a Spec from the Spec Detail Page (Priority: P2)

An admin or owner is viewing a spec on the spec detail page. An "Archive spec" button is visible in the page header actions area (next to "Edit spec"). They click it, confirm in the dialog, and are redirected to the Spec Library overview page (Active tab). A success toast appears ("Spec archived.") and the spec is visible on the Archived tab.

**Why this priority**: Provides a secondary, contextual entry point for archiving. Less common than the overview table path but important for admins who discover a spec is outdated while viewing it.

**Independent Test**: Can be tested by viewing a spec's detail page, clicking "Archive spec", confirming, and verifying the redirect and archived state.

**Acceptance Scenarios**:

1. **Given** an admin is viewing an active spec's detail page, **When** they click "Archive spec" and confirm, **Then** they are redirected to the Spec Library overview (Active tab), a "Spec archived." toast appears, and the spec is on the Archived tab.
2. **Given** a member is viewing an active spec's detail page, **Then** the "Archive spec" button is not rendered.

---

### User Story 4 - View and Unarchive from Archived Spec Detail Page (Priority: P2)

An admin or owner navigates to the detail page of an archived spec. The page renders all fields in read-only mode with an "Archived" badge in the header. The "Edit spec" button is not rendered. An "Unarchive" button is visible. Clicking "Unarchive" immediately restores the spec: the badge disappears, "Edit spec" and "Archive spec" buttons appear, and a success toast shows "Spec unarchived."

**Why this priority**: Enables admins to review an archived spec's content and restore it in-context without returning to the overview table.

**Independent Test**: Can be tested by navigating to an archived spec's detail page, verifying read-only state and badge, clicking "Unarchive", and verifying the spec returns to active state.

**Acceptance Scenarios**:

1. **Given** an admin views an archived spec's detail page, **Then** the page shows all fields read-only, an "Archived" badge, and an "Unarchive" button; the "Edit spec" button is not rendered.
2. **Given** an admin clicks "Unarchive" on an archived spec's detail page, **When** the action succeeds, **Then** the badge disappears, "Edit spec" and "Archive spec" buttons appear, and a "Spec unarchived." toast is shown.
3. **Given** a member views an archived spec's detail page, **Then** they see the content read-only with the "Archived" badge but the "Unarchive" button is not rendered.

---

### User Story 5 - Changelog Recording for Archive and Unarchive (Priority: P2)

Every archive and unarchive action creates a changelog entry capturing the acting user, the action ("archived" or "unarchived"), and the timestamp. These entries are visible in the spec's history panel.

**Why this priority**: Audit trail is essential for team accountability, but the feature delivers user value even before changelog entries are visible.

**Independent Test**: Can be tested by archiving and unarchiving a spec, then viewing the spec's history panel to verify the entries appear with the correct actor, action, and timestamp.

**Acceptance Scenarios**:

1. **Given** an admin archives a spec, **When** they view the spec's history panel, **Then** a new entry shows the admin's name, the action "Archived", and the timestamp.
2. **Given** an admin unarchives a spec, **When** they view the spec's history panel, **Then** a new entry shows the admin's name, the action "Unarchived", and the timestamp.

---

### Edge Cases

- **Admin navigates to the edit URL of an archived spec**: They are redirected to the spec detail page (read-only archived view). No edit actions are available.
- **Archived spec does not appear in Active tab search or filters**: The Active tab list always filters by non-archived specs. Archived specs only appear on the Archived tab.
- **Archive and unarchive in rapid succession**: Each action is recorded as a separate changelog entry. No deduplication or collapsing is applied.
- **Two admins archive the same spec simultaneously**: Both API calls set the spec to archived (idempotent write). Two changelog entries are recorded. The spec ends up archived — consistent final state.
- **Two admins — one archives while the other views the spec detail page**: The viewing admin's page does not update in real time. If they click "Edit spec", they are redirected to the spec detail page showing the archived state.
- **Archive or unarchive API call fails**: The optimistic update is rolled back. An error toast appears ("Failed to archive spec. Please try again." or "Failed to unarchive spec. Please try again."). The spec remains in its previous state.
- **Member calls archive/unarchive API directly**: The API returns an authorization error. The frontend never renders the actions for members.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: Admins and owners MUST be able to archive an active spec from the Spec Library overview table via the three-dot action menu.
- **FR-002**: Admins and owners MUST be able to archive an active spec from the spec detail page via an "Archive spec" button in the header actions area.
- **FR-003**: The system MUST display a confirmation dialog before archiving a spec, with the title "Archive this spec?" and options to "Cancel" or "Archive spec".
- **FR-004**: After a successful archive, the system MUST remove the spec from the Active tab (optimistic update) and display a "Spec archived." success toast.
- **FR-005**: After archiving from the spec detail page, the system MUST redirect the user to the Spec Library overview page (Active tab).
- **FR-006**: Admins and owners MUST be able to unarchive a spec from the Archived tab of the overview table via the three-dot action menu.
- **FR-007**: Admins and owners MUST be able to unarchive a spec from the archived spec's detail page via an "Unarchive" button in the header actions area.
- **FR-008**: Unarchive MUST execute immediately without a confirmation dialog.
- **FR-009**: After a successful unarchive, the system MUST move the spec to the Active tab (optimistic update) and display a "Spec unarchived." success toast.
- **FR-010**: Unarchiving from the spec detail page MUST update the page in-place: remove the "Archived" badge, show "Edit spec" and "Archive spec" buttons, and hide the "Unarchive" button.
- **FR-011**: The spec detail page for an archived spec MUST display all fields in read-only mode, show an "Archived" badge in the header, hide the "Edit spec" button, and show an "Unarchive" button (for admins/owners only).
- **FR-012**: Members MUST NOT see the "Archive", "Unarchive", or "Archive spec" actions — these MUST not be rendered in the UI for member-role users.
- **FR-013**: Members MUST be able to view archived specs (read-only) on the Archived tab and on the spec detail page.
- **FR-014**: The system MUST record a changelog entry for every archive action (action: "archived") and every unarchive action (action: "unarchived"), including the acting user and timestamp.
- **FR-015**: The backend MUST enforce role-based authorization for archive and unarchive endpoints, returning an appropriate error if a member-role user attempts the action.
- **FR-016**: Navigating to the edit URL of an archived spec MUST redirect to the spec detail page.
- **FR-017**: The Active tab list MUST always filter out archived specs (filter by `is_archived = false`).
- **FR-018**: If the archive or unarchive API call fails, the system MUST roll back any optimistic update and display an appropriate error toast.

### Key Entities

- **Spec (spec_library)**: The core entity being archived/unarchived. Key attribute: `is_archived` (boolean, default false). When archived, the spec is hidden from the Active tab, rendered read-only, and cannot be edited.
- **Changelog**: Records archive and unarchive events. Key attributes: acting user, action type ("archived" / "unarchived"), timestamp. No field-level changes are recorded for these actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can archive a spec from either the overview table or the detail page in under 5 seconds (including confirmation dialog interaction).
- **SC-002**: Admins can unarchive a spec from either the Archived tab or the archived spec detail page in under 3 seconds (no confirmation step).
- **SC-003**: Archived specs never appear on the Active tab regardless of search queries or filters applied.
- **SC-004**: 100% of archive and unarchive actions produce a corresponding changelog entry visible in the spec's history panel.
- **SC-005**: Members never see archive or unarchive actions in the UI, and direct API calls from members are rejected.
- **SC-006**: Optimistic UI updates for archive and unarchive are visually reflected within 200ms of user action, with rollback on failure.

## Assumptions

- The `is_archived` column already exists on the `spec_library` table with a default value of `false`.
- The Spec Library overview page already renders Active and Archived tabs — this feature wires up the mutations that drive those tabs.
- Playbook linking is not yet implemented, so there is no need to check whether a spec is linked to a playbook before archiving.
- Runs are snapshotted at start time and are immutable — archiving a spec has no effect on active or completed runs.
- Real-time updates across browser sessions are out of scope for v1 (no live push when another admin archives/unarchives).

## Out of Scope

- Blocking archive when a spec is linked to a playbook (playbook linking not yet implemented).
- Spec deletion (permanent removal).
- Any impact on active or completed runs (runs are snapshotted and immutable).
- Real-time cross-session updates when another user archives or unarchives a spec.
