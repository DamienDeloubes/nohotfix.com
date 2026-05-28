# Feature Specification: Organisation Settings Page

**Feature Branch**: `006-org-settings`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "I want to create a page where the user can view and edit the organisation's basic metadata — primarily the team/company name. Both Owners, Admins and Members can see this page; only Owners and Admins can make changes. This is the top-level tab in the Settings area and the default destination when navigating to Settings. The slug is also shown but cannot be edited."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Organisation Details (Priority: P1)

As any organisation member (Owner, Admin, or Member), I want to see my organisation's name and slug on the Settings page so I can confirm I am in the correct workspace and reference the organisation's identifier.

**Why this priority**: Viewing organisation details is the foundational capability — every role needs it, and the page must render correctly before any editing can occur.

**Independent Test**: Can be fully tested by navigating to Settings and verifying the organisation name and slug are displayed. Delivers immediate value by giving users visibility into their organisation identity.

**Acceptance Scenarios**:

1. **Given** a logged-in user who is a Member of an organisation, **When** they navigate to the Settings area, **Then** they land on the Organisation Settings tab by default and see the organisation's current name and slug displayed.
2. **Given** a logged-in user who is an Owner of an organisation, **When** they navigate to the Settings area, **Then** they land on the Organisation Settings tab by default and see the organisation's current name and slug displayed.
3. **Given** any logged-in organisation member, **When** they view the Organisation Settings page, **Then** the slug is displayed as read-only (no edit control is available for it).

---

### User Story 2 - Edit Organisation Name (Priority: P1)

As an Owner or Admin, I want to update my organisation's display name so that it reflects the current team or company identity.

**Why this priority**: Editing the name is the core write operation of this feature and the primary reason the page exists beyond read-only viewing.

**Independent Test**: Can be fully tested by an Owner or Admin changing the organisation name, saving, and confirming the updated name persists and displays correctly on reload.

**Acceptance Scenarios**:

1. **Given** a logged-in Owner or Admin on the Organisation Settings page, **When** they modify the organisation name and save, **Then** the new name is persisted and displayed immediately.
2. **Given** a logged-in Owner or Admin, **When** they attempt to save an empty or whitespace-only organisation name, **Then** the system displays a validation error and does not save the change.
3. **Given** a logged-in Owner or Admin, **When** they save a valid new name, **Then** the updated name is reflected across the application wherever the organisation name appears.

---

### User Story 3 - Permission Enforcement for Members (Priority: P1)

As a Member (non-admin, non-owner), I should be able to view the organisation details but must not be able to modify them, so that only authorised users can change the organisation identity.

**Why this priority**: Permission enforcement is critical for data integrity and security — it must ship alongside the edit capability.

**Independent Test**: Can be fully tested by logging in as a Member, navigating to Organisation Settings, and confirming that the name field is read-only or the save action is unavailable.

**Acceptance Scenarios**:

1. **Given** a logged-in Member on the Organisation Settings page, **When** they view the page, **Then** the organisation name field is not editable (e.g., no input field or save button is presented).
2. **Given** a logged-in Member, **When** they attempt to update the organisation name via any means, **Then** the system rejects the request and returns an authorisation error.

---

### Edge Cases

- What happens when two Admins/Owners edit the organisation name simultaneously? The last save wins; the user sees the most recent value on next load.
- What happens when the organisation name is very long? The system enforces a maximum character limit (assumed 100 characters) and shows a validation message if exceeded.
- What happens if the user's session expires while editing? The save request fails with a session-expired error and the user is prompted to re-authenticate.
- What happens if the user navigates to Settings for an organisation they are no longer a member of? The system returns a not-found or access-denied response.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: The Settings area MUST have an Organisation Settings tab that serves as the default (first) tab when a user navigates to Settings.
- **FR-002**: The Organisation Settings page MUST display the organisation's current name in an editable field for Owners and Admins.
- **FR-003**: The Organisation Settings page MUST display the organisation's current name in a read-only format for Members.
- **FR-004**: The Organisation Settings page MUST display the organisation's slug in a read-only format for all roles (Owner, Admin, Member).
- **FR-005**: Owners and Admins MUST be able to update the organisation name and save the change.
- **FR-006**: The system MUST validate the organisation name before saving: it must not be empty, must not be whitespace-only, and must not exceed 100 characters.
- **FR-007**: The system MUST reject organisation name update requests from users with the Member role and return an authorisation error.
- **FR-008**: After a successful name update, the system MUST persist the change and reflect the updated name on the current page without requiring a full page reload.
- **FR-009**: The system MUST provide clear feedback to the user on save success (confirmation message) and save failure (error message with reason).

### Key Entities

- **Organisation**: The team or company entity. Key attributes relevant to this feature: name (editable display name, max 100 characters) and slug (unique, read-only identifier).
- **Membership**: The relationship between a user and an organisation, including the user's role (Owner, Admin, or Member) which determines edit permissions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their organisation name and slug within 2 seconds of navigating to Settings.
- **SC-002**: Owners and Admins can update the organisation name and see the change reflected in under 3 seconds.
- **SC-003**: 100% of update attempts by Members are blocked with a clear authorisation message.
- **SC-004**: 95% of users can locate and update the organisation name on the first attempt without external guidance.

## Assumptions

- The organisation name has a maximum length of 100 characters. This is a reasonable default for display names.
- The slug was set at organisation creation time and is intentionally immutable to preserve URL stability and external references.
- The Settings area may have additional tabs in the future (e.g., Members, Billing), but this feature only concerns the Organisation Settings tab.
- "Last write wins" is acceptable for concurrent edits given the low frequency and low risk of organisation name changes.
- The save action provides inline feedback (success/error) rather than navigating to a different page.
