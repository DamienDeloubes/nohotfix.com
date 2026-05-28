# Feature Specification: Remove Organization Member

**Feature Branch**: `010-remove-org-member`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User description: "Allow organization admins/owners to remove a member from the organization by deleting their membership record."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remove a Member from the Organization (Priority: P1)

An admin or owner navigates to the organization members list, clicks a "Remove" action on a member's row, sees a confirmation dialog ("Are you sure you want to remove {name}?"), confirms, and the membership is deleted. The member immediately disappears from the list and loses access to the organization.

**Why this priority**: This is the core value of the feature — enabling admins to manage team composition by removing members who should no longer have access.

**Independent Test**: Can be fully tested by logging in as an admin, navigating to the members list, clicking "Remove" on a member, confirming, and verifying the member is no longer listed and can no longer access the organization.

**Acceptance Scenarios**:

1. **Given** a user with the admin role views the members list, **When** they click "Remove" on a member row, **Then** a confirmation dialog appears asking "Are you sure you want to remove {name}?".
2. **Given** the confirmation dialog is shown, **When** the admin confirms the removal, **Then** the membership is deleted, the member disappears from the list, and the removed user loses access to the organization immediately.
3. **Given** the confirmation dialog is shown, **When** the admin cancels, **Then** no action is taken and the dialog closes.
4. **Given** a user with the owner role views the members list, **When** they remove a member, **Then** the removal proceeds identically to an admin-initiated removal.

---

### User Story 2 - Owner Cannot Be Removed (Priority: P1)

When any user views the members list, the owner's row does not display a "Remove" action. If an API request attempts to remove the owner, it is rejected. The owner role must be transferred to another member before the current owner's membership can be removed.

**Why this priority**: Preventing accidental or unauthorized owner removal is critical to organizational integrity — an ownerless organization cannot be managed.

**Independent Test**: Can be fully tested by verifying the owner row has no "Remove" button, and that a direct API call to remove the owner returns a rejection error.

**Acceptance Scenarios**:

1. **Given** any user views the members list, **When** they look at the owner's row, **Then** no "Remove" action is available.
2. **Given** an admin sends an API request to remove the owner, **When** the system processes the request, **Then** it is rejected with an authorization error.

---

### User Story 3 - Self-Removal / Leave Organization (Priority: P2)

Any organization member (regardless of role) can remove themselves from the organization. After confirmation, their membership is deleted and they are redirected out of the organization context (e.g., to an organization selector or home page). The owner is the only exception — they must transfer ownership before leaving.

**Why this priority**: Self-removal is a valid use case (e.g., leaving a team), but less common than removing other members.

**Independent Test**: Can be fully tested by logging in as any non-owner user, removing themselves, confirming, and verifying they are redirected away from the organization and can no longer access it.

**Acceptance Scenarios**:

1. **Given** any non-owner user views the members list, **When** they click "Leave" on their own row, **Then** a confirmation dialog appears warning they will lose access to the organization.
2. **Given** the user confirms self-removal, **When** the removal completes, **Then** the user is redirected out of the organization context.
3. **Given** the user is the last admin (but not the owner), **When** they remove themselves, **Then** the removal is allowed (the owner remains to manage the organization).
4. **Given** a user with the member role views the members list, **When** they look at other members' rows, **Then** no "Remove" action is available — only a "Leave" action on their own row.

---

### User Story 4 - Unauthorized Removal Prevented (Priority: P1)

When a user with the "member" role views the members list, no "Remove" action is visible on any row. If a member-level user sends a direct API request to remove someone, it is rejected with a permission error.

**Why this priority**: Authorization enforcement is a security requirement and equally critical as the happy path.

**Independent Test**: Can be fully tested by logging in as a member, verifying no "Remove" buttons appear, and sending a direct API request to confirm it is rejected.

**Acceptance Scenarios**:

1. **Given** a user with the member role views the members list, **When** they look at any member's row, **Then** no "Remove" action is available.
2. **Given** a user with the member role sends an API request to remove a member, **When** the system processes the request, **Then** it is rejected with AUTH_ROLE_INSUFFICIENT.

---

### Edge Cases

- What happens when the target membership doesn't exist (already removed or invalid ID)? The system returns a 404 error.
- What happens when the request targets a membership belonging to a different organization? The system returns a 404 error (does not leak existence).
- What happens when the target is a pending invite rather than an accepted member? Removal only applies to accepted memberships. Pending invites are managed through the existing invite revocation feature.
- What happens when two admins try to remove the same member simultaneously? The first request succeeds; the second returns a 404 (membership already deleted).

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow admins and owners to remove any non-owner member from the organization by deleting their membership record.
- **FR-002**: System MUST display a confirmation dialog before executing a member removal, showing the member's name in the message.
- **FR-003**: System MUST reject removal requests from users with the "member" role when targeting other members (403 — AUTH_ROLE_INSUFFICIENT). Members MAY remove themselves (leave the organization).
- **FR-004**: System MUST reject any attempt to remove the user with the "owner" role. The owner role must be transferred first before the user can be removed.
- **FR-005**: System MUST return a 404 error when the target membership does not exist or belongs to a different organization.
- **FR-006**: System MUST immediately remove the deleted member from the members list without requiring a page refresh.
- **FR-007**: The "Remove" action MUST only be visible to users with admin or owner roles.
- **FR-008**: The "Remove" action MUST NOT be displayed on the owner's row for any user.
- **FR-009**: When a user removes themselves (leave), the system MUST redirect them out of the organization context after the removal completes.
- **FR-010**: Removal MUST only apply to accepted memberships, not pending invites.
- **FR-011**: Any non-owner user MUST be able to remove themselves from the organization (leave), regardless of their role.
- **FR-012**: The owner MUST NOT be able to remove themselves. Ownership must be transferred first.

### Key Entities

- **Membership**: Represents the relationship between a user and an organization. Key attributes: user, organization, role (owner/admin/member). This feature deletes the membership record entirely (hard delete).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authorized users can remove a member in under 3 seconds (from confirmation to visible list update).
- **SC-002**: 100% of unauthorized removal attempts are rejected with an appropriate error message.
- **SC-003**: Removed members lose access to the organization immediately — no stale access after removal.
- **SC-004**: The owner can never be removed without first transferring ownership — zero ownerless organizations result from this feature.

## Clarifications

### Session 2026-03-09

- Q: Can a user with the "member" role remove themselves (leave the org voluntarily)? → A: Yes — members can remove themselves (leave), but cannot remove others.

## Assumptions

- Removing a member is a hard delete of the membership record (not soft delete).
- No email notification is sent to the removed member (notifications may be added in a future feature).
- Audit logging of member removal is handled by the existing changelog/audit infrastructure.
- After self-removal, the user is redirected to the organization selector or home page.
- The "Remove" action appears as a button or menu item in the same member row actions area used by the change-role feature.
