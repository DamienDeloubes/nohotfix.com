# Feature Specification: Archive & Unarchive Playbook

**Feature Branch**: `029-archive-playbook`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Archive and unarchive a playbook to retire inactive playbooks without permanent deletion"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Archive a Playbook from the List Page (Priority: P1)

An admin or owner navigates to the Playbook list page on the Active tab, opens the three-dot action menu on a playbook row, and clicks "Archive". A confirmation dialog appears showing how many runs are currently in progress for that playbook. After confirming, the playbook row disappears from the Active tab (optimistic update), a success toast displays "Playbook archived", and the playbook appears on the Archived tab. A changelog entry is recorded with the action "archived".

**Why this priority**: This is the primary entry point for archiving and the most common way admins will retire playbooks. It delivers the core value of decluttering the active playbook list.

**Independent Test**: Can be fully tested by creating a playbook, archiving it from the list, and verifying it moves to the Archived tab with a changelog entry recorded.

**Acceptance Scenarios**:

1. **Given** an admin is on the Active tab of the Playbook list page with at least one playbook, **When** they open the action menu and click "Archive", **Then** a confirmation dialog appears showing the playbook name and the count of in-progress runs.
2. **Given** the confirmation dialog is open, **When** the admin clicks "Archive", **Then** the dialog closes, the playbook row is removed from the Active tab, a success toast "Playbook archived" appears, and the playbook is visible on the Archived tab.
3. **Given** the confirmation dialog is open, **When** the admin clicks "Cancel", **Then** the dialog closes and no changes occur.
4. **Given** a member is on the Active tab, **When** they open the action menu on a playbook row, **Then** "Archive" is not present in the menu.

---

### User Story 2 - Unarchive a Playbook from the Archived Tab (Priority: P1)

An admin or owner navigates to the Archived tab on the Playbook list page, opens the three-dot action menu on an archived playbook, and clicks "Unarchive". No confirmation dialog is shown (unarchiving is non-destructive). The playbook row disappears from the Archived tab (optimistic update), a success toast displays "Playbook unarchived", and the playbook reappears on the Active tab. A changelog entry is recorded with the action "unarchived".

**Why this priority**: Unarchiving is the complement of archiving and equally critical. Without it, archiving would be irreversible, defeating its purpose as a non-destructive retirement mechanism.

**Independent Test**: Can be fully tested by archiving a playbook, then unarchiving it from the Archived tab, and verifying it returns to the Active tab with a changelog entry.

**Acceptance Scenarios**:

1. **Given** an admin is on the Archived tab with at least one archived playbook, **When** they open the action menu and click "Unarchive", **Then** the playbook row disappears from the Archived tab, a success toast "Playbook unarchived" appears, and the playbook is visible on the Active tab.
2. **Given** a member is on the Archived tab, **When** they open the action menu, **Then** "Unarchive" is not present; only "View" is shown.

---

### User Story 3 - Archive a Playbook from the Editor Page (Priority: P2)

An admin or owner is on the playbook editor page and opens the playbook action menu (three-dot icon in the header). They click "Archive playbook". The same confirmation dialog appears. After confirming, the admin is redirected to the Playbook list page (Active tab) and a success toast "Playbook archived" appears. A changelog entry is recorded.

**Why this priority**: This is a secondary entry point that provides convenience when an admin is already viewing a playbook and decides to archive it.

**Independent Test**: Can be fully tested by navigating to a playbook editor, archiving from the header menu, and verifying redirect to the list page with the playbook on the Archived tab.

**Acceptance Scenarios**:

1. **Given** an admin is on the playbook editor page, **When** they open the action menu and click "Archive playbook", **Then** a confirmation dialog appears.
2. **Given** the confirmation dialog is shown on the editor page, **When** the admin confirms, **Then** they are redirected to the Playbook list page (Active tab), a success toast appears, and the playbook is on the Archived tab.

---

### User Story 4 - View an Archived Playbook in Read-Only Mode (Priority: P2)

An admin, owner, or member navigates to an archived playbook's detail page (either via the Archived tab or by direct URL). The page renders in read-only mode with an "Archived" badge displayed prominently near the playbook name. All editing controls are hidden (no inline editing, no drag handles, no "Add from library", no "Add section", no "New spec"). Spec rows remain visible with all data (title, severity, system under test, artifact count) but are read-only. The left section navigation sidebar remains functional.

**Why this priority**: Viewing archived playbooks is essential for reference. Admins need to review retired playbooks to understand past configurations or decide whether to unarchive.

**Independent Test**: Can be fully tested by archiving a playbook and navigating to its detail page, verifying the "Archived" badge is shown and all edit controls are hidden.

**Acceptance Scenarios**:

1. **Given** an archived playbook exists, **When** any user navigates to its detail page, **Then** the page renders in read-only mode with an "Archived" badge near the playbook name.
2. **Given** a user is viewing an archived playbook's detail page, **When** they inspect the page, **Then** all editing controls (inline editing, drag handles, "Add from library", "Add section", "New spec") are hidden.
3. **Given** an admin is viewing an archived playbook's detail page, **When** they open the action menu, **Then** they see "Unarchive", "Duplicate", and "View change history" (Duplicate is visible but non-functional for now).

---

### User Story 5 - Unarchive from the Archived Playbook Detail Page (Priority: P2)

An admin or owner is viewing an archived playbook's detail page. They click "Unarchive" in the playbook action menu. No confirmation dialog is shown. The "Archived" badge disappears, all editing controls reappear, and a success toast "Playbook unarchived" is shown. A changelog entry is recorded.

**Why this priority**: Provides a convenient in-context unarchive action when an admin is already reviewing an archived playbook.

**Independent Test**: Can be fully tested by viewing an archived playbook's detail page, clicking "Unarchive", and verifying the badge disappears and editing controls return.

**Acceptance Scenarios**:

1. **Given** an admin is viewing an archived playbook's detail page, **When** they click "Unarchive" in the action menu, **Then** the "Archived" badge disappears, editing controls reappear, a success toast "Playbook unarchived" appears, and a changelog entry is recorded.

---

### User Story 6 - Archived Tab on Playbook List Page (Priority: P2)

The Playbook list page has two tabs: Active and Archived. The Archived tab displays all archived playbooks in the same table format as the Active tab (name, environment, spec count). Admin/owner action menus show "View" and "Unarchive". Member action menus show only "View".

**Why this priority**: The Archived tab is the primary interface for discovering and managing archived playbooks. It supports both viewing and unarchiving workflows.

**Independent Test**: Can be fully tested by archiving a playbook and switching to the Archived tab, verifying the table layout and role-appropriate action menus.

**Acceptance Scenarios**:

1. **Given** archived playbooks exist, **When** a user switches to the Archived tab, **Then** they see all archived playbooks in a table with columns for name, environment, and spec count.
2. **Given** no archived playbooks exist, **When** a user switches to the Archived tab, **Then** an appropriate empty state is shown.

---

### Edge Cases

- **Archive the only active playbook**: Allowed. The Active tab shows the empty state: "No active playbooks. Create one to get started."
- **Archive a playbook with in-progress runs**: The confirmation dialog shows the count of in-progress runs. After archiving, runs continue normally (they are immutable snapshots). No new runs can be started from the archived playbook.
- **Concurrent archiving by two admins**: Both API calls set the playbook to archived (idempotent). Both succeed. Two changelog entries are recorded. Final state is consistent.
- **One admin archives while another is editing**: The editing admin's page does not update in real-time. The API rejects writes to archived playbooks with a clear error. On next page load, the editor renders in read-only mode.
- **Archive/unarchive API call fails**: Optimistic update is rolled back. An error toast is shown: "Failed to archive playbook. Please try again." or "Failed to unarchive playbook. Please try again."
- **Rapid archive/unarchive**: Each action creates a separate changelog entry. No deduplication or rate limiting.
- **Specs archived while playbook is archived**: When individual specs are archived in the library, they are removed from all playbooks (including archived ones). When the playbook is later unarchived, it comes back without those removed specs.
- **Unarchiving a playbook does not re-add previously removed specs**: Specs removed due to spec archival are not restored. The admin must re-add them manually.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow admins and owners to archive a playbook from the playbook list page action menu.
- **FR-002**: System MUST allow admins and owners to archive a playbook from the playbook editor page action menu.
- **FR-003**: System MUST display a confirmation dialog before archiving, showing the playbook name and the count of in-progress runs associated with that playbook.
- **FR-004**: System MUST remove the archived playbook from the Active tab and display it on the Archived tab after successful archiving.
- **FR-005**: System MUST redirect the user to the Playbook list page (Active tab) when archiving from the editor page.
- **FR-006**: System MUST allow admins and owners to unarchive a playbook from the Archived tab action menu.
- **FR-007**: System MUST allow admins and owners to unarchive a playbook from the archived playbook detail page action menu.
- **FR-008**: System MUST execute unarchive immediately without a confirmation dialog.
- **FR-009**: System MUST restore the unarchived playbook to the Active tab and remove it from the Archived tab.
- **FR-010**: System MUST render archived playbooks in read-only mode on the detail page, with an "Archived" badge near the playbook name and all editing controls hidden.
- **FR-011**: System MUST NOT render the "Archive" action for members in any context (list page or editor).
- **FR-012**: System MUST NOT render the "Unarchive" action for members in any context.
- **FR-013**: System MUST reject archive and unarchive API calls from members with an appropriate authorization error.
- **FR-014**: System MUST record a changelog entry for each archive and unarchive action, capturing the acting user, the action type ("archived" or "unarchived"), and the timestamp.
- **FR-015**: System MUST NOT affect any existing runs when a playbook is archived or unarchived. Runs are immutable snapshots.
- **FR-016**: System MUST NOT archive, modify, or hide any specs in the spec library when a playbook is archived.
- **FR-017**: System MUST prevent starting new runs from an archived playbook.
- **FR-018**: System MUST use optimistic updates on the frontend for both archive and unarchive actions, with rollback on failure and appropriate error toasts.
- **FR-019**: System MUST display the Archived tab on the Playbook list page, showing archived playbooks in the same table format as the Active tab (name, environment, spec count).
- **FR-020**: System MUST show the action menu on the archived playbook detail page with "Unarchive", "Duplicate", and "View change history" for admins/owners. "Duplicate" is visible but non-functional in this feature.
- **FR-021**: System MUST keep the left section navigation sidebar functional on the archived playbook detail page.
- **FR-022**: System MUST handle concurrent archive operations idempotently (setting archived status is a safe, repeatable operation).

### Key Entities

- **Playbook**: Existing entity. Gains an archive status that determines whether it appears on the Active or Archived tab. Archive status controls read-only rendering and prevents new run creation.
- **Changelog**: Existing entity. Records archive and unarchive actions with actor identity, action type, and timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can archive a playbook from either entry point (list page or editor) and see the playbook move to the Archived tab within 1 second of confirmation.
- **SC-002**: Admins can unarchive a playbook from either entry point (Archived tab or detail page) and see the playbook return to the Active tab within 1 second.
- **SC-003**: 100% of archive and unarchive actions are recorded in the changelog with correct actor, action, and timestamp.
- **SC-004**: Members never see archive or unarchive actions in any UI context, and API calls from members are rejected.
- **SC-005**: All in-progress runs continue unaffected after their parent playbook is archived, with zero data loss or state changes to any run.
- **SC-006**: No specs in the spec library are affected by archiving or unarchiving a playbook.
- **SC-007**: Archived playbook detail pages render in read-only mode with zero editable controls visible and the "Archived" badge displayed.

## Assumptions

- The `playbooks` table already has or will gain an archive status column to track archive state.
- The existing changelog infrastructure supports recording "archived" and "unarchived" action types for playbooks.
- The Playbook list page already supports or will support a tab-based UI (Active / Archived).
- The existing playbook editor page can conditionally render in read-only mode based on the playbook's archive status.
- The "Duplicate" action in the archived playbook action menu is a placeholder visible to admins/owners but non-functional until a separate feature implements it.
- The API rejects writes (edits, new run creation) to archived playbooks with a clear error, enforcing the read-only contract server-side.
