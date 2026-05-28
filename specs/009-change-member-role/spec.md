# Feature Specification: Change Member Role

**Feature Branch**: `009-change-member-role`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User description: "Allow authorized users to change the role of other organization members."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Promote or Demote a Member (Priority: P1)

An admin or owner navigates to the organization members list, selects a member, and changes their role (e.g., member to admin, or admin to member). The system validates permissions, updates the role, and reflects the change immediately in the members list.

**Why this priority**: This is the core value of the feature — enabling role management within an organization. Without this, teams cannot delegate administrative responsibilities or adjust access levels as the organization evolves.

**Independent Test**: Can be fully tested by logging in as an admin, navigating to the members list, changing a member's role, and verifying the updated role displays correctly.

**Acceptance Scenarios**:

1. **Given** a user with the admin role views the members list, **When** they change a member's role from "member" to "admin", **Then** the member's role is updated to "admin" and the change is reflected in the members list immediately.
2. **Given** a user with the owner role views the members list, **When** they change an admin's role to "member", **Then** the admin's role is updated to "member" and the change is reflected in the members list immediately.
3. **Given** a user with the admin role views the members list, **When** they attempt to change a role, **Then** they see role options limited to "admin" and "member" (not "owner").

---

### User Story 2 - Transfer Ownership (Priority: P2)

The current owner navigates to the members list, selects a member, and transfers ownership to them. The selected member becomes the new owner, and the previous owner is automatically demoted to admin. Only one owner exists at any time.

**Why this priority**: Ownership transfer is essential for organizational continuity (e.g., when the founder leaves or delegates), but happens infrequently compared to regular role changes.

**Independent Test**: Can be fully tested by logging in as the owner, transferring ownership to another member, and verifying the new owner has owner privileges while the previous owner is demoted to admin.

**Acceptance Scenarios**:

1. **Given** a user with the owner role views the members list, **When** they transfer ownership to a member, **Then** the target member becomes owner and the previous owner is demoted to admin.
2. **Given** a user with the owner role views the members list, **When** they transfer ownership to an admin, **Then** the target admin becomes owner and the previous owner is demoted to admin.
3. **Given** the ownership transfer completes, **When** the members list is viewed, **Then** exactly one member has the owner role.

---

### User Story 3 - Unauthorized Role Change Prevented (Priority: P1)

When a user without sufficient permissions attempts to change a member's role, the system rejects the request with a clear error message. This applies to members trying any role change, and admins trying to assign the owner role.

**Why this priority**: Authorization enforcement is equally critical as the happy path — preventing privilege escalation is a security requirement.

**Independent Test**: Can be fully tested by logging in as a member, attempting to change another member's role, and verifying the action is rejected with an appropriate error.

**Acceptance Scenarios**:

1. **Given** a user with the member role views the members list, **When** they attempt to change another member's role, **Then** the role change control is not available to them.
2. **Given** a user with the admin role views the members list, **When** they attempt to assign the owner role to a member, **Then** the request is rejected with a permission error.
3. **Given** a user with the owner role, **When** they attempt to change their own role without transferring ownership, **Then** the request is rejected to prevent an ownerless organization.

---

### Edge Cases

- What happens when the target user is not a member of the organization? The request is rejected with a not-found error.
- What happens when the requested role is the same as the target's current role? The request is rejected as a no-op with a validation error.
- What happens when an admin tries to change the owner's role? The request is rejected — only the owner can modify the owner role (via transfer).
- What happens when concurrently two admins try to change the same member's role? The last write wins; both requests succeed individually, and the final role reflects whichever completed last.
- What happens when an admin demotes themselves? The system shows a confirmation dialog warning they will lose admin access. If confirmed, the demotion proceeds.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow admins and owners to change a member's role to "admin" or "member".
- **FR-002**: System MUST allow only the current owner to transfer ownership to another member.
- **FR-003**: When ownership is transferred, the system MUST atomically promote the target to owner and demote the previous owner to admin.
- **FR-004**: System MUST reject role change requests from users with the "member" role (403 — AUTH_ROLE_INSUFFICIENT).
- **FR-005**: System MUST reject role change requests where the target user is not a member of the organization (404).
- **FR-006**: System MUST reject role change requests where the target already has the requested role (400 — same role).
- **FR-007**: System MUST reject any attempt by non-owners to assign the "owner" role (403 — AUTH_ROLE_INSUFFICIENT).
- **FR-008**: System MUST reject any attempt by the owner to change their own role without transferring ownership to another member.
- **FR-009**: System MUST prevent admins from modifying the owner's role.
- **FR-010**: The members list MUST immediately reflect role changes after a successful update.
- **FR-011**: Role change controls MUST only be visible to users with admin or owner roles.
- **FR-012**: The owner role option MUST only be available to the current owner (for transfer purposes).
- **FR-013**: The system MUST display a confirmation dialog before executing an ownership transfer. The transfer proceeds only if the user confirms.
- **FR-014**: The system MUST display a confirmation dialog when an admin attempts to demote themselves, warning they will lose admin access. The demotion proceeds only if the user confirms.

### Key Entities

- **Membership**: Represents the relationship between a user and an organization. Key attributes: user, organization, role (owner/admin/member), join date. A user has exactly one membership per organization.
- **Role**: A value assigned to a membership. Three levels with a clear hierarchy: owner (highest) > admin > member. Exactly one owner exists per organization at all times.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authorized users can change a member's role in under 3 seconds (from click to visible confirmation).
- **SC-002**: 100% of unauthorized role change attempts are rejected with an appropriate error message.
- **SC-003**: Ownership transfer atomically updates both the new and previous owner's roles — no organization ever has zero or more than one owner.
- **SC-004**: Role changes are reflected in the members list without requiring a page refresh.

## Clarifications

### Session 2026-03-09

- Q: Should ownership transfer require a confirmation step? → A: Yes — a simple confirmation dialog ("Are you sure you want to transfer ownership?") is required before executing the transfer.
- Q: Can an admin change another admin's role? → A: Yes — admins can change any non-owner member's role, including demoting peer admins.
- Q: Can an admin demote themselves? → A: Yes, with a confirmation dialog warning they will lose admin access.

## Assumptions

- The existing three-role hierarchy (owner > admin > member) is sufficient; no new roles are needed.
- The previous owner is demoted to "admin" (not "member") upon ownership transfer, preserving their administrative capabilities.
- No confirmation dialog is required for standard role changes (promote/demote). Ownership transfer requires a simple confirmation dialog before execution.
- No email notification is sent when a user's role is changed (notifications may be added in a future feature).
- Audit logging of role changes is handled by the existing changelog/audit infrastructure.
