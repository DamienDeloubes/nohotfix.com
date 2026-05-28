# Feature Specification: Invite Members

**Feature Branch**: `008-invite-members`
**Created**: 2026-03-08
**Status**: Draft
**Input**: User description: "Owners and Admins can invite people by email to join the organization."

## Clarifications

### Session 2026-03-08

- Q: Should pending invites be stored in the existing `memberships` table (with nullable user_id) or in a separate `invites` table? → A: Separate `invites` table — invite data lives independently; membership row created only on acceptance.
- Q: When resending an invite, should the token be regenerated (invalidating the old link) or kept the same? → A: Regenerate token on resend — old link stops working, only the latest email link is valid.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Invites a New Member (Priority: P1)

An Owner or Admin opens the organisation members settings page, enters an email address, selects a role (Admin or Member), and sends the invite. An invite record is created immediately and the invitee appears in the members list with a pending status. A confirmation toast is shown. An invite email is sent via Resend containing a signed, time-limited link.

**Why this priority**: This is the core happy-path flow. Without it, no invites can be sent and the organisation remains single-user.

**Independent Test**: Can be fully tested by submitting the invite form and verifying the invite appears in the members list with pending status and that the email is dispatched.

**Acceptance Scenarios**:

1. **Given** a logged-in Owner or Admin on the members settings page, **When** they enter a valid email, select "Member" role, and click "Send invite", **Then** an invite record is created, the invitee appears in the members list with pending status, and a success toast is shown.
2. **Given** a logged-in Owner or Admin on the members settings page, **When** they enter a valid email and select "Admin" role, **Then** the invite is sent with the Admin role assigned.
3. **Given** an invite is created successfully, **When** the email is dispatched via Resend, **Then** the email contains an "Accept invite to [org name]" button linking to a unique, signed invite URL that expires after 7 days.
4. **Given** a valid invite is created, **When** email delivery fails (Resend returns an error), **Then** an error toast is shown to the inviter and the invite record is rolled back (deleted).

---

### User Story 2 - Invitee Accepts an Invite (Priority: P1)

A person clicks the invite link in their email. If they don't have an account, they are taken to a signup flow where their email is pre-filled and locked; after completing signup, the invite is marked accepted, a membership row is created, and they are redirected to the org dashboard. If they already have an account, they are taken to login, the invite is accepted, a membership is created, and they are redirected to the org dashboard. No separate org creation step occurs.

**Why this priority**: Invite acceptance is the other half of the core flow — invites are useless without a functioning acceptance path.

**Independent Test**: Can be tested by clicking a valid invite link, completing signup or login, and verifying the user lands on the org dashboard with an active membership.

**Acceptance Scenarios**:

1. **Given** a new user clicks a valid, non-expired invite link, **When** they complete the WorkOS signup flow, **Then** a user account is created, the invite is marked accepted, a membership row is created, and they are redirected to the org dashboard.
2. **Given** a new user clicks a valid invite link, **When** the signup flow is presented, **Then** the email field is pre-filled with the invited email and cannot be changed.
3. **Given** an existing user clicks a valid invite link, **When** they authenticate via WorkOS login, **Then** the invite is marked accepted, a membership row is created, and they are redirected to the org dashboard.
4. **Given** the accepting user's WorkOS account email does not match the invited email, **When** they attempt to accept the invite, **Then** the acceptance is rejected with a clear error message.

---

### User Story 3 - Resend and Revoke Pending Invites (Priority: P2)

An Owner or Admin views the members list and sees pending invite rows with "Resend" and "Revoke" actions. They can resend the invite email (subject to rate limits) or revoke the invite entirely.

**Why this priority**: Manages the lifecycle of pending invites — important for usability but not blocking the core send/accept flow.

**Independent Test**: Can be tested by creating a pending invite, then using the Resend and Revoke actions and verifying correct behaviour and rate limit enforcement.

**Acceptance Scenarios**:

1. **Given** a pending invite row in the members list, **When** the invite was sent less than 5 minutes ago, **Then** the "Resend" button is visible but disabled.
2. **Given** a pending invite row where the last send was more than 5 minutes ago, **When** the Owner/Admin clicks "Resend", **Then** a new token is generated (invalidating the previous link), a new invite email is sent, the 7-day expiry resets, and the resend cooldown resets to 15 minutes.
3. **Given** a pending invite row where the last resend was less than 15 minutes ago, **When** the Owner/Admin attempts to resend, **Then** the action is blocked (button disabled, and the server also rejects the request).
4. **Given** an Owner or Admin clicks "Revoke" on a pending invite, **When** they confirm, **Then** the invite is marked as revoked, removed from the members list, and the invite link becomes invalid.

---

### User Story 4 - Expired, Revoked, and Already-Accepted Links (Priority: P2)

Users clicking invite links that are expired, revoked, or already accepted see appropriate feedback screens rather than confusing errors.

**Why this priority**: Error handling for edge cases — required for a complete experience but not the core flow.

**Independent Test**: Can be tested by clicking various invalid invite links and verifying the correct screen is displayed.

**Acceptance Scenarios**:

1. **Given** an invite link that has expired (older than 7 days), **When** the invitee clicks it, **Then** they see an "Invite expired — contact your org admin" screen.
2. **Given** an invite link that has been revoked, **When** the invitee clicks it, **Then** they see an "Invite no longer valid" screen.
3. **Given** an invite that has already been accepted, **When** the invitee clicks the link again, **Then** they are redirected to the org dashboard (no error).

---

### Edge Cases

- What happens when an Owner/Admin invites an email that is already an active member? An error message is shown (not silently deduped).
- What happens when an Owner/Admin invites an email that already has a pending invite? An error message is shown (not silently deduped).
- What happens when an Owner/Admin tries to invite themselves? Validation blocks the action with an error message.
- What happens when a Member (non-admin) tries to send an invite? The invite form is not visible and the server rejects the request.
- What happens when multiple invites are revoked or resent in quick succession? Rate limiting and idempotent revocation prevent inconsistent state.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow Owners and Admins to invite users by email with a role of Admin or Member.
- **FR-002**: System MUST validate the invite email format and reject self-invites (inviter's own email).
- **FR-003**: System MUST reject invites to emails that are already active members or already have a pending invite, showing an explicit error message.
- **FR-004**: System MUST create an invite record upon successful invite submission. The invite is stored separately from memberships; a membership row is only created when the invite is accepted.
- **FR-005**: System MUST send an invite email via Resend using the existing `MemberInvite` template, containing an "Accept invite to [org name]" button with a unique, signed invite URL.
- **FR-006**: Invite URLs MUST expire after 7 days from creation.
- **FR-007**: System MUST roll back (delete) the invite record if email delivery fails, and show an error toast to the inviter.
- **FR-008**: System MUST display a success toast upon successful invite creation and email dispatch.
- **FR-009**: Pending invites displayed in the members list MUST show "Resend" and "Revoke" actions.
- **FR-010**: "Resend" MUST be disabled for 5 minutes after the initial invite send and for 15 minutes after each subsequent resend. This rate limit MUST be enforced on both frontend and backend. Resending MUST regenerate the invite token (invalidating the previous link) and reset the 7-day expiry.
- **FR-011**: "Revoke" MUST mark the invite as revoked, invalidating the invite link.
- **FR-012**: Invite acceptance MUST bind to the email string — the accepting user's account email MUST match the invited email.
- **FR-013**: The signup/login flow for invite acceptance MUST pre-fill and lock the email field so the invitee cannot register with a different address.
- **FR-014**: When a new user accepts an invite, the system MUST create their account, mark the invite as accepted, create a membership row, and redirect to the org dashboard — without a separate org creation step.
- **FR-015**: When an existing user accepts an invite, the system MUST mark the invite as accepted, create a membership row, and redirect them to the org dashboard.
- **FR-016**: Expired invite links MUST show an "Invite expired — contact your org admin" screen.
- **FR-017**: Revoked invite links MUST show an "Invite no longer valid" screen.
- **FR-018**: Already-accepted invite links MUST redirect to the org dashboard without error.
- **FR-019**: Only Owners and Admins may create, resend, or revoke invites. Members MUST NOT see the invite form or have access to invite actions.

### Key Entities

- **Invite**: A standalone entity (separate from memberships) representing a pending invitation. Key attributes: organisation reference, invited email address, assigned role (Admin or Member), invite token (unique cryptographic string), token expiry timestamp (7 days from creation), reference to the user who sent the invite, last-sent timestamp for rate limiting resends, and status (`pending`, `accepted`, `revoked`). One invite per email per organisation at a time. On acceptance, the invite is marked `accepted` and a membership row is created.
- **Membership**: Unchanged — continues to represent active org members only. A new membership row is created when an invite is accepted. No schema changes to the existing `memberships` table.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Owners and Admins can complete the invite flow (enter email, select role, send) in under 30 seconds.
- **SC-002**: Invitees receiving the email can accept the invite and land on the org dashboard in under 2 minutes (new account) or under 1 minute (existing account).
- **SC-003**: 100% of expired, revoked, or email-mismatch invite attempts are blocked with a clear, user-facing message.
- **SC-004**: Resend rate limits are enforced with zero bypass — no user can resend more frequently than the defined intervals.
- **SC-005**: Failed email delivery results in immediate rollback of the invite record with zero orphaned pending invites.
- **SC-006**: Duplicate invite attempts (already member or already pending) are rejected 100% of the time with an explicit error — never silently deduped.

## Assumptions

- Invites are stored in a new, separate `invites` table. The existing `memberships` table is unchanged — a membership row is only created when an invite is accepted.
- The invite token is a cryptographically random string stored in the database, with expiry tracked via a dedicated column.
- The email template (`MemberInvite`) already exists and will be updated to include the org name in the button text.
- The invite acceptance route is hosted on the web app, which handles the auth flow and redirects.
- Seat limits based on subscription tier (Free = 1 seat, Growth = 10, Scale = 40) are enforced at invite creation time, but the billing/subscription check is an existing concern outside this feature's scope.
