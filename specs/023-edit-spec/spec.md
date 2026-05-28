# Feature Specification: Edit Spec

**Feature Branch**: `023-edit-spec`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Admins and owners can edit an existing spec in the Spec Library. The edit page reuses the create spec form, pre-populated with current values. Two entry points: spec detail page button and overview table row action menu. Members cannot edit specs."

## Clarifications

### Session 2026-03-11

- Q: Should the backend API independently enforce role-based authorization (rejecting edit requests from members), or is frontend-only enforcement sufficient? → A: Backend MUST reject edit requests from members with an authorization error (defense in depth).
- Q: Should the system warn admins when navigating away from the edit page with unsaved changes? → A: Show a browser confirmation dialog ("You have unsaved changes") when navigating away with pending changes (both browser-level and in-app navigation).
- Q: What is the history granularity for complex fields (test steps, artifact requirements)? → A: One history entry per column change. For artifact requirements, the entry must include details about which specific artifact was added, removed, or modified.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit Spec from Detail Page (Priority: P1)

An admin or owner views a spec on the spec detail page, clicks the "Edit spec" button, and is navigated to the edit page. The edit form is pre-populated with the spec's current values. They modify one or more fields (title, system under test, severity, preconditions, description, test steps, expected result, artifact requirements, tester notes) and click "Save". They are redirected to the spec detail page showing the updated values. A history entry is recorded for each changed field.

**Why this priority**: This is the core editing flow — without it, specs cannot be modified after creation.

**Independent Test**: Can be fully tested by creating a spec, navigating to its detail page, clicking "Edit spec", changing a field, saving, and verifying the update on the detail page.

**Acceptance Scenarios**:

1. **Given** an admin on a spec detail page, **When** they click "Edit spec", **Then** they are navigated to `/:orgSlug/spec-library/:specId/edit` with the form pre-populated with the spec's current values.
2. **Given** an admin on the edit page with modified fields, **When** they click "Save", **Then** changes are persisted and they are redirected to the spec detail page showing the updated values.
3. **Given** an admin on the edit page with modified fields, **When** they click "Save", **Then** one history entry is recorded per changed field.
4. **Given** an admin on the edit page who has made no changes, **When** they click "Save", **Then** they are redirected to the spec detail page and no history entries are created.

---

### User Story 2 - Edit Spec from Overview Table (Priority: P1)

An admin or owner is on the Spec Library overview page, opens the three-dot action menu on a spec row, and clicks "Edit spec". They are navigated to the same edit page, pre-populated with the spec's current values. The editing flow is identical to entry point 1.

**Why this priority**: This is an equally important entry point that enables quick editing without navigating to the detail page first.

**Independent Test**: Can be fully tested by navigating to the Spec Library overview, opening a row action menu, clicking "Edit spec", modifying a field, saving, and verifying the update.

**Acceptance Scenarios**:

1. **Given** an admin on the Spec Library overview page, **When** they open the row action menu for a spec and click "Edit spec", **Then** they are navigated to `/:orgSlug/spec-library/:specId/edit` with the form pre-populated.
2. **Given** the admin on the edit page (entered from overview table), **When** they save changes, **Then** the behaviour is identical to editing from the detail page.

---

### User Story 3 - Cancel Editing (Priority: P2)

An admin opens the edit page, optionally makes changes, and clicks "Cancel". They are redirected to the spec detail page with no changes persisted.

**Why this priority**: Cancel is essential for a safe editing experience but is secondary to the core save flow.

**Independent Test**: Can be tested by opening the edit page, making changes, clicking "Cancel", and verifying no changes were saved.

**Acceptance Scenarios**:

1. **Given** an admin on the edit page with unsaved changes, **When** they click "Cancel", **Then** they are redirected to the spec detail page and no changes are persisted.
2. **Given** an admin on the edit page with no changes, **When** they click "Cancel", **Then** they are redirected to the spec detail page.

---

### User Story 4 - Edit Test Steps (Priority: P2)

An admin edits test steps on the edit page: adding new steps, removing existing steps, and reordering steps via drag and drop. Step numbers recalculate automatically. The behaviour is identical to the create spec form.

**Why this priority**: Test step management is a key part of the spec editing experience but builds on the core edit flow.

**Independent Test**: Can be tested by opening the edit page, adding/removing/reordering steps, saving, and verifying on the detail page.

**Acceptance Scenarios**:

1. **Given** an admin on the edit page, **When** they click "Add step" and fill in the instruction and expected outcome, **Then** the new step appears in the correct position.
2. **Given** an admin on the edit page, **When** they remove an existing step and save, **Then** the step no longer appears on the spec detail page.
3. **Given** an admin on the edit page, **When** they drag step 3 to position 1 and save, **Then** the spec detail page shows the new step order with recalculated step numbers.

---

### User Story 5 - Edit Artifact Requirements (Priority: P2)

An admin edits artifact requirements on the edit page: adding new requirements, editing existing ones, and removing requirements. The behaviour is identical to the create spec form.

**Why this priority**: Artifact requirements are part of spec content management but are secondary to the core edit flow.

**Independent Test**: Can be tested by opening the edit page, adding/editing/removing artifact requirements, saving, and verifying on the detail page.

**Acceptance Scenarios**:

1. **Given** an admin on the edit page, **When** they add a new artifact requirement and save, **Then** the requirement appears on the spec detail page.
2. **Given** an admin on the edit page, **When** they remove an existing artifact requirement and save, **Then** the requirement no longer appears on the spec detail page.

---

### User Story 6 - Member Access Restriction (Priority: P1)

Members (non-admin, non-owner) cannot access the edit functionality. The "Edit spec" button is hidden from the spec detail page, the "Edit spec" action is hidden from the row action menu, and direct URL navigation redirects to the spec detail page. The backend API independently rejects edit requests from members with an authorization error (defense in depth).

**Why this priority**: Role-based access control is critical for data integrity and must be enforced from day one.

**Independent Test**: Can be tested by logging in as a member and verifying the edit button/action is not visible, and that direct URL access redirects.

**Acceptance Scenarios**:

1. **Given** a member on the spec detail page, **When** the page renders, **Then** the "Edit spec" button is not displayed.
2. **Given** a member on the Spec Library overview page, **When** they open the row action menu, **Then** the "Edit spec" action is not displayed.
3. **Given** a member who navigates directly to `/:orgSlug/spec-library/:specId/edit`, **When** the page loads, **Then** they are redirected to the spec detail page.

---

### User Story 7 - Archived Spec Protection (Priority: P2)

If an admin navigates to the edit URL for an archived spec, they are redirected to the spec detail page. Archived specs cannot be edited.

**Why this priority**: Protects archived spec integrity, but is a guard rail rather than a primary flow.

**Independent Test**: Can be tested by navigating to the edit URL of an archived spec and verifying the redirect.

**Acceptance Scenarios**:

1. **Given** an admin who navigates to the edit URL of an archived spec, **When** the page loads, **Then** they are redirected to the spec detail page for that spec.

---

### Edge Cases

- What happens when the admin clears a required field (e.g. title)? The "Save" button is disabled and an inline validation error is shown — consistent with create form behaviour.
- What happens when a test step has a missing instruction or expected outcome? The "Save" button is disabled and an inline validation error is shown on the incomplete field.
- What happens when the admin tries to add a 51st test step? The "Add step" control is disabled and a message indicates the maximum of 50 steps has been reached.
- What happens when two admins edit the same spec simultaneously? Last save wins — no conflict detection or merge in v1.
- What happens when a save fails due to a network or server error? The admin stays on the edit page with all unsaved changes intact and an error message is displayed so they can retry.
- What happens when the admin's session expires mid-edit? On save attempt, they are redirected to login. Form state is preserved so they can recover changes after re-authenticating.
- What happens when the admin has unsaved changes? A visual indicator (e.g. "Unsaved changes") is shown near the Save button.
- What happens when the admin navigates away with unsaved changes (browser back, closing tab, clicking a nav link)? A confirmation dialog warns them about unsaved changes before leaving.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST provide an edit page at `/:orgSlug/spec-library/:specId/edit` that displays the same form as the create spec form, pre-populated with the spec's current values.
- **FR-002**: System MUST allow admins and owners to navigate to the edit page via an "Edit spec" button on the spec detail page.
- **FR-003**: System MUST allow admins and owners to navigate to the edit page via an "Edit spec" action in the row action menu on the Spec Library overview table.
- **FR-004**: System MUST allow all spec fields to be edited at once: title, system under test, severity, preconditions, description, test steps, expected result, artifact requirements, and tester notes.
- **FR-005**: System MUST apply the same field validations on the edit form as on the create form (required fields, field length limits, test step limits, etc.).
- **FR-006**: System MUST support adding, removing, and reordering test steps via drag and drop on the edit page — identical to the create form behaviour.
- **FR-007**: System MUST support adding, editing, and removing artifact requirements on the edit page — identical to the create form behaviour.
- **FR-008**: System MUST persist changes directly to the `spec_library` entry when the admin clicks "Save".
- **FR-009**: System MUST record one history entry per changed column when a spec is saved with modifications. For test steps, a single "test_steps changed" entry is sufficient. For artifact requirements, the history entry MUST include details about which specific artifact was added, removed, or modified.
- **FR-010**: System MUST NOT create history entries when a spec is saved with no modifications (no-op save).
- **FR-011**: System MUST redirect the admin to the spec detail page after a successful save.
- **FR-012**: System MUST redirect the admin to the spec detail page when they click "Cancel", with no changes persisted.
- **FR-013**: System MUST hide the "Edit spec" button on the spec detail page from members (non-admin, non-owner roles).
- **FR-014**: System MUST hide the "Edit spec" action from the row action menu on the Spec Library overview table for members.
- **FR-015**: System MUST redirect members who navigate directly to the edit URL to the spec detail page.
- **FR-016**: System MUST redirect admins who navigate to the edit URL for an archived spec to the spec detail page.
- **FR-017**: System MUST display an unsaved changes indicator near the Save button when the form has been modified.
- **FR-018**: System MUST keep the admin on the edit page with all unsaved changes intact when a save fails, and display an error message.
- **FR-019**: System MUST disable the "Save" button and show inline validation errors when required fields are empty or field constraints are violated.
- **FR-020**: System MUST reject edit requests from members at the backend API level with an authorization error, independent of frontend enforcement (defense in depth).
- **FR-021**: System MUST show a confirmation dialog when the admin attempts to navigate away from the edit page (browser back button, closing tab, or in-app navigation) while unsaved changes exist.

### Key Entities

- **Spec (spec_library)**: The specification being edited. Key attributes: title, system under test, severity, preconditions, description, test steps, expected result, artifact requirements, tester notes, archived status.
- **Changelog**: History entries recording column-level changes to a spec. Each entry captures which column changed and is linked to the spec. For artifact requirements, entries include specifics about which artifact was added, removed, or modified.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can open the edit page, modify any spec field, and save in under 30 seconds for a single-field change.
- **SC-002**: All field validations on the edit form match the create form — zero validation discrepancies between the two forms.
- **SC-003**: Members never see edit entry points and are always redirected when attempting direct URL access — 100% enforcement.
- **SC-004**: History entries are recorded only for fields that actually changed — zero false-positive history entries on no-op saves.
- **SC-005**: Unsaved changes are preserved across save failures — zero data loss from transient errors.
- **SC-006**: Archived specs cannot be edited — 100% enforcement via redirect.

## Assumptions

- The edit form reuses the existing create spec form component, pre-populated with current values rather than building a separate form.
- "Last write wins" is acceptable for concurrent edits in v1 — no optimistic concurrency control or conflict detection.
- The history/changelog system already exists from feature 022-spec-history and records per-field changes.
- No propagation to playbooks — editing a spec in the library does not affect any playbook that references it.
- The existing spec detail page and Spec Library overview table already support conditional rendering based on user role.

## Out of Scope

- Editing a spec from within a playbook section.
- Archiving/unarchiving specs.
- Spec deletion.
- Sync/propagation of spec changes to playbook specs.
- Conflict detection or merge for concurrent edits.
