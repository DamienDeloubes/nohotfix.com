# Feature Specification: Archive & Unarchive Spec

**Feature Branch**: `027-archive-spec`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Improve spec archive functionality — wire up archive and unarchive mutations so admins/owners can retire specs from active use and restore them later."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Archive a Spec from the Library (Priority: P1)

An admin or owner wants to retire a spec that is no longer relevant. They archive it from the Spec Library overview page via the three-dot action menu on the spec row. A confirmation dialog appears showing any playbook templates that reference the spec. Upon confirming, the spec is removed from the Active tab, removed from all referencing playbook templates, and a changelog entry is recorded.

**Why this priority**: Archiving is the core action of this feature. Without it, there is no way to retire specs from active use, and stale specs accumulate in the library and playbook templates.

**Independent Test**: Can be fully tested by archiving a spec from the overview table and verifying it moves to the Archived tab, is removed from playbook templates, and has a changelog entry.

**Acceptance Scenarios**:

1. **Given** an admin is on the Spec Library overview Active tab, **When** they open the action menu on a spec row and click "Archive", **Then** a confirmation dialog appears with the spec's playbook references (if any).
2. **Given** the confirmation dialog is open, **When** the admin clicks "Archive spec", **Then** the spec row disappears from the Active tab (optimistic update), a success toast "Spec archived." appears, and the spec appears on the Archived tab.
3. **Given** the spec is referenced by 3 active playbooks, **When** the admin confirms the archive, **Then** the spec is removed from all 3 playbook templates and the confirmation dialog lists all affected playbook names.
4. **Given** the spec is referenced by both active and archived playbooks, **When** the admin confirms the archive, **Then** the dialog shows active playbooks prominently and archived playbooks separately, and the spec is removed from all of them.
5. **Given** the spec is not referenced by any playbooks, **When** the confirmation dialog appears, **Then** it shows the standard archive message without a playbook list.

---

### User Story 2 - Unarchive a Spec (Priority: P1)

An admin or owner wants to restore a previously archived spec to active status. They can unarchive from the spec detail page or from the Archived tab action menu. Unarchiving is immediate (no confirmation dialog) and restores the spec to active status with full editing capabilities. The spec is not automatically re-added to any playbooks it was previously removed from.

**Why this priority**: Unarchiving is the complement to archiving and is essential to make archiving a safe, reversible action. Without it, archiving would be effectively a soft-delete with no recovery path.

**Independent Test**: Can be fully tested by unarchiving an archived spec and verifying it returns to the Active tab, becomes editable, and has a changelog entry.

**Acceptance Scenarios**:

1. **Given** an admin is viewing an archived spec's detail page, **When** they click "Unarchive", **Then** the "Archived" badge disappears, the "Edit spec" and "Archive spec" buttons appear, and a success toast "Spec unarchived." appears.
2. **Given** an admin is on the Archived tab of the Spec Library overview, **When** they open the action menu on an archived spec and click "Unarchive", **Then** the spec row disappears from the Archived tab and appears on the Active tab.
3. **Given** a spec was previously removed from 3 playbooks when archived, **When** the admin unarchives it, **Then** the spec is NOT re-added to those playbooks automatically — the admin must add it back manually.
4. **Given** unarchive is triggered, **When** the action completes, **Then** a changelog entry with action "Unarchived" is recorded with the acting user and timestamp.

---

### User Story 3 - Archive from Spec Detail Page (Priority: P2)

An admin or owner is viewing a spec on its detail page and wants to archive it directly from there. They click "Archive spec" in the page header, see the same confirmation dialog, and upon confirming are redirected to the Spec Library overview (Active tab) with a success toast.

**Why this priority**: This is a secondary entry point that improves the user experience by allowing archiving from the detail page without navigating back to the overview. The core archive logic is shared with Story 1.

**Independent Test**: Can be fully tested by navigating to a spec detail page, clicking "Archive spec", confirming, and verifying the redirect to the overview page with success toast.

**Acceptance Scenarios**:

1. **Given** an admin is on the spec detail page, **When** they click "Archive spec" in the header actions area, **Then** the confirmation dialog appears with the same content as the overview entry point.
2. **Given** the admin confirms the archive from the detail page, **When** the action succeeds, **Then** they are redirected to the Spec Library overview Active tab with a success toast "Spec archived."

---

### User Story 4 - View Archived Spec (Priority: P2)

Any user (admin, owner, or member) navigates to an archived spec's detail page. The page renders all spec content in read-only mode with an "Archived" badge in the header. Admins and owners see an "Unarchive" button; members see no action buttons. The spec history panel is visible and includes the archive changelog entry.

**Why this priority**: Viewing archived specs is important for reference and audit purposes. It enables teams to review retired specs without restoring them.

**Independent Test**: Can be fully tested by navigating to an archived spec's detail page and verifying read-only rendering, badge display, and role-appropriate action buttons.

**Acceptance Scenarios**:

1. **Given** an admin navigates to an archived spec's detail page, **When** the page loads, **Then** all spec fields are displayed in read-only mode, an "Archived" badge appears in the header, and an "Unarchive" button is visible.
2. **Given** a member navigates to an archived spec's detail page, **When** the page loads, **Then** the spec is displayed read-only with the "Archived" badge, but no "Unarchive" button is rendered.
3. **Given** an archived spec, **When** any user views its detail page, **Then** the "Edit spec" button is not rendered.

---

### User Story 5 - Confirmation Dialog with Playbook Impact (Priority: P2)

When an admin initiates an archive, the confirmation dialog dynamically shows which playbook templates will be affected. The dialog content varies based on whether the spec is referenced by active playbooks, archived playbooks, both, or neither. When more than 3 playbooks are listed, the first 3 names are shown with a count of the remainder.

**Why this priority**: The confirmation dialog is critical for informed decision-making but depends on the core archive action (Story 1) being implemented first.

**Independent Test**: Can be tested by archiving specs with varying playbook reference counts and verifying the dialog content matches each scenario.

**Acceptance Scenarios**:

1. **Given** a spec is referenced by 5 active playbooks, **When** the confirmation dialog appears, **Then** it shows the first 3 playbook names followed by "and 2 others."
2. **Given** a spec is referenced by 2 active and 1 archived playbook, **When** the dialog appears, **Then** it shows "This spec will be removed from 2 playbooks: [names]." and "Also from 1 archived playbook: [name]."
3. **Given** a spec is referenced only by archived playbooks, **When** the dialog appears, **Then** it shows "This spec will be removed from N archived playbooks: [names]."
4. **Given** the admin clicks "Cancel" on the confirmation dialog, **When** the dialog closes, **Then** no changes are made — the spec and all playbook references remain intact.

---

### User Story 6 - Role-Based Access Control (Priority: P3)

Members cannot archive or unarchive specs. The "Archive" and "Unarchive" action menu items in the overview table and the corresponding buttons on the detail page are not rendered for members. If a member attempts to call the archive or unarchive endpoints directly, the system rejects the request.

**Why this priority**: Role enforcement is essential for security but is a cross-cutting concern that builds on the existing role system. The UI already conditionally renders based on role.

**Independent Test**: Can be tested by logging in as a member and verifying that archive/unarchive UI elements are absent and direct API calls are rejected.

**Acceptance Scenarios**:

1. **Given** a member is on the Spec Library overview Active tab, **When** they open the action menu on a spec, **Then** only "View" is shown — no "Archive" option.
2. **Given** a member is on the Archived tab, **When** they open the action menu on an archived spec, **Then** only "View" is shown — no "Unarchive" option.
3. **Given** a member attempts to call the archive endpoint directly, **When** the request is processed, **Then** the system returns an authorization error.

---

### Edge Cases

- What happens when a spec is the only spec in a playbook section? The spec is removed, leaving the section empty. The playbook remains valid — empty sections are allowed. The playbook does not auto-archive.
- What happens when an admin navigates directly to the edit URL of an archived spec? They are redirected to the spec detail page (read-only archived view).
- What happens when two admins archive the same spec simultaneously? Both requests succeed (idempotent). Two changelog entries are recorded. The spec ends up archived — consistent final state.
- What happens when an admin archives and immediately unarchives a spec? Each action is recorded as a separate changelog entry. Playbook removals from the archive are not reversed by unarchiving.
- What happens when the archive API call fails? The optimistic UI update is rolled back. An error toast appears: "Failed to archive spec. Please try again." All playbook references remain intact.
- What happens when the unarchive API call fails? The optimistic UI update is rolled back. An error toast appears: "Failed to unarchive spec. Please try again." The spec remains archived.
- What happens when another admin archives a spec while someone is viewing its detail page? The viewing admin's page does not update in real time. On next data fetch, the page reflects the archived state.
- What happens when an archived spec's ID is included in an Active tab query? The Active tab always filters by non-archived status — the archived spec is excluded.
- What happens when adding specs to a playbook? Only active (non-archived) specs appear in the "Add from library" picker. Archived specs are excluded.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow admins and owners to archive a spec, setting it to archived status and recording the action in the changelog.
- **FR-002**: System MUST allow admins and owners to unarchive a spec, restoring it to active status and recording the action in the changelog.
- **FR-003**: System MUST remove an archived spec from all playbook templates (both active and archived playbooks) that reference it, atomically with the archive action.
- **FR-004**: System MUST NOT automatically re-add a spec to playbook templates when it is unarchived — the admin restores playbook references manually.
- **FR-005**: System MUST display a confirmation dialog before archiving that lists all playbook templates referencing the spec, grouped by active and archived playbooks.
- **FR-006**: When more than 3 playbook names would be listed in a group, the system MUST show the first 3 names followed by "and N others."
- **FR-007**: System MUST NOT display a confirmation dialog for the unarchive action — unarchive executes immediately.
- **FR-008**: System MUST NOT render archive or unarchive UI controls (buttons, menu items) for members.
- **FR-009**: System MUST reject archive and unarchive requests from members at the API level with an authorization error.
- **FR-010**: System MUST display an "Archived" badge on the spec detail page when the spec is archived.
- **FR-011**: System MUST NOT render the "Edit spec" button on the detail page of an archived spec.
- **FR-012**: System MUST redirect users who navigate to the edit URL of an archived spec to the spec's detail page.
- **FR-013**: System MUST exclude archived specs from the Active tab of the Spec Library and from the "Add from library" picker when building playbooks.
- **FR-014**: System MUST display archived specs only on the Archived tab of the Spec Library overview.
- **FR-015**: When archiving from the spec detail page, the system MUST redirect the admin to the Spec Library overview (Active tab) after a successful archive.
- **FR-016**: System MUST show a success toast after each archive ("Spec archived.") and unarchive ("Spec unarchived.") action.
- **FR-017**: System MUST use optimistic updates when archiving or unarchiving from the overview table, rolling back the UI if the API call fails.
- **FR-018**: System MUST display an error toast if the archive or unarchive API call fails ("Failed to archive spec. Please try again." / "Failed to unarchive spec. Please try again.").
- **FR-019**: Archive and unarchive operations MUST be idempotent — archiving an already-archived spec or unarchiving an already-active spec succeeds without error.

### Key Entities

- **Spec (spec_library)**: A test specification in the library. Has an `is_archived` status (boolean, default false). When archived, it is hidden from active views, excluded from playbook pickers, and rendered read-only.
- **Playbook Template (playbooks + playbook_specs)**: A collection of specs organized into sections. References to archived specs are removed atomically during the archive action.
- **Changelog Entry (changelog)**: An audit record of actions taken on a spec. Archive and unarchive actions are recorded with the acting user, action type, and timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can archive a spec from either the overview table or the detail page in under 3 clicks (action menu/button + confirm).
- **SC-002**: Admins can unarchive a spec in a single click (no confirmation dialog).
- **SC-003**: 100% of playbook template references to an archived spec are removed atomically — no stale references remain after archiving.
- **SC-004**: Archived specs never appear on the Active tab, in search results on the Active tab, or in the "Add from library" playbook picker.
- **SC-005**: Every archive and unarchive action produces a changelog entry visible in the spec's history panel.
- **SC-006**: Members cannot trigger archive or unarchive actions through any path (UI or direct API call).
- **SC-007**: The confirmation dialog accurately reflects the current playbook references at the time of the action — no stale or missing playbook names.

## Assumptions

- The `is_archived` column already exists on the `spec_library` table with a default of `false`.
- The Spec Library overview page already renders Active and Archived tabs — this feature wires up the mutations that drive those tabs.
- The existing role system (admin, owner, member) is in place and the API already supports role-based guards.
- Runs are immutable snapshots created at run start time and are not affected by archiving or unarchiving specs.
- There is no real-time push mechanism in v1 — other users' views update on the next data fetch (page refresh or navigation).
- The existing edit-spec feature already handles the redirect from the edit URL of an archived spec to the detail page.
