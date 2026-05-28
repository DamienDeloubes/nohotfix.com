# Feature Specification: Organization Members List

**Feature Branch**: `005-org-members-list`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "Show organization members list with role-based visibility depending on the viewer's role."

## Clarifications

### Session 2026-03-06

- Q: Should this feature introduce a minimal invitations table, defer pending invitations display, or read from WorkOS? → A: Defer pending invitations display entirely — admins/owners see only confirmed members until the invite feature is built.
- Q: How should the members list be sorted? → A: By role hierarchy (owner → admin → member), then alphabetically within each role.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Any User Views Organization Members (Priority: P1)

Any logged-in user (regardless of role) navigates to the organization settings members page. They see a list of all confirmed members of the organization, showing each person's display name and role. The list is sorted by role hierarchy (owner first, then admins, then members), with alphabetical ordering within each role group. All roles see the same view — pending invitations are deferred to a future invite feature.

**Why this priority**: This is the core and only experience for this feature — every user needs to see who is in the organization. It delivers immediate value by making team composition visible.

**Independent Test**: Can be fully tested by logging in as any organization member, navigating to `/$orgSlug/settings/members`, and verifying the member list displays names and roles for all confirmed members in the correct sort order.

**Acceptance Scenarios**:

1. **Given** a logged-in user in an organization with 5 confirmed members, **When** they navigate to the members settings page, **Then** they see a list of all 5 members showing display name and role for each.
2. **Given** an organization with 1 member, **When** that member views the members page, **Then** they see themselves listed with their display name and role.
3. **Given** a logged-in user with the `admin` or `owner` role, **When** they view the members page, **Then** they see the same confirmed members list as a `member`-role user (no pending invitations section).
4. **Given** an organization with members across all three roles, **When** any user views the members page, **Then** members are sorted by role hierarchy (owner → admin → member) and alphabetically within each role group.

---

### Edge Cases

- What happens when a user's display name is not set? The system shows the user's email address as a fallback.
- What happens when the organization has a large number of members (e.g., 100+)? The list remains performant and usable; pagination or virtual scrolling may be needed for very large lists.
- What happens if the viewing user's own membership is deleted while they are on the page? The next data refresh redirects them or shows an appropriate error.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST display a list of all confirmed organization members to any authenticated user who belongs to that organization.
- **FR-002**: For each confirmed member, the system MUST show the member's display name (or email as fallback if display name is not set) and their role (owner, admin, or member).
- **FR-003**: The members list MUST be sorted by role hierarchy (owner → admin → member), then alphabetically by display name within each role group.
- **FR-004**: The system MUST only show members belonging to the organization the user is currently viewing.
- **FR-005**: The system MUST enforce that only authenticated users who are members of the organization can access the members list. Non-members must not see another organization's members.
- **FR-006**: All roles (owner, admin, member) see the same members list view. Pending invitation visibility is deferred to a future invite feature.
- **FR-007**: Inviting new users and displaying pending invitations are explicitly out of scope for this feature.

### Key Entities

- **Member**: A confirmed user in an organization. Key attributes: display name, email, role (owner/admin/member), joined date.

## Assumptions

- The existing `memberships` table (linking `users` to `organisations` with a `role`) represents confirmed members.
- Pending invitations display is deferred — no invitations table is needed for this feature.
- The members page is accessible to all authenticated members of the organization — there is no restriction on which roles can view the page itself.
- The current user's role is determined from their membership record in the organization they are viewing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Any authenticated organization member can view the full list of confirmed members within 2 seconds of navigating to the members page.
- **SC-002**: All roles see the same members list — no role-specific sections or hidden data.
- **SC-003**: 100% of member list entries display a name (display name or email fallback) and a role.
- **SC-004**: The members list correctly reflects the current organization context — no cross-organization data leakage occurs.
- **SC-005**: Members are displayed in role-hierarchy order (owner → admin → member), alphabetically within each group.
