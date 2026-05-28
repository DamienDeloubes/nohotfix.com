# Feature Specification: Organization Onboarding

**Feature Branch**: `003-org-onboarding`
**Created**: 2026-03-05
**Status**: Draft
**Input**: User description: "Create the next stop in the onboarding flow after the WorkOS sign up. After the WorkOS signup the user will be either redirected to the apps/app root page for the first organization they created or will be shown a required Organization creation form (onboarding) where the user will need to fill in an organization name. After the user has created the organization they will be redirected to the apps/app root page under that organization. When the user has created an account but stopped creating an organization and signs in, they will always first need to create an organization before entering the apps/app dashboard."

## Clarifications

### Session 2026-03-05

- Q: How does organization context appear in URLs? → A: Org identifier in URL path (e.g., `/<org-slug>/dashboard`)
- Q: Are duplicate organization names allowed? → A: Duplicate names allowed; user must provide a unique slug separately
- Q: What role does the organization creator receive? → A: "owner" role, distinct from admin
- Q: What are the slug format constraints? → A: Lowercase letters, numbers, and hyphens (no leading/trailing hyphen), 3-50 characters

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Creates Organization After Signup (Priority: P1)

A new user completes the WorkOS signup process and arrives in the application for the first time. Since they have no organization, they are presented with a required organization creation form. The form asks for an organization name and a unique URL slug. After submitting the form, the organization is created and the user is redirected to the application dashboard at `/<org-slug>/dashboard`.

**Why this priority**: This is the core happy path. Without organization creation, no user can access the dashboard. Every new user must go through this flow.

**Independent Test**: Can be fully tested by signing up a new user, verifying the onboarding form appears, filling in an organization name and slug, submitting, and confirming the user lands on the dashboard at the org-scoped URL.

**Acceptance Scenarios**:

1. **Given** a newly signed-up user with no organizations, **When** they are redirected from WorkOS signup, **Then** they see the organization creation form (not the dashboard).
2. **Given** the user is on the organization creation form, **When** they enter a valid organization name and unique slug and submit, **Then** the organization is created and they are redirected to `/<org-slug>/dashboard`.
3. **Given** the user is on the organization creation form, **When** they submit without entering an organization name or slug, **Then** they see a validation error and the form is not submitted.
4. **Given** the user is on the organization creation form, **When** they enter a slug that is already taken, **Then** they see a validation error indicating the slug is unavailable.

---

### User Story 2 - Returning User Without Organization Is Blocked From Dashboard (Priority: P1)

A user who previously created an account but abandoned the onboarding flow before creating an organization signs back in. Instead of reaching the dashboard, they are redirected to the organization creation form. They cannot bypass this step.

**Why this priority**: This enforces the business rule that organization creation is mandatory. Without this guard, users could end up in a broken state with no org context.

**Independent Test**: Can be tested by creating a user account (via WorkOS), skipping organization creation, signing out, signing back in, and verifying the user is redirected to the organization creation form.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no organizations, **When** they attempt to access any dashboard route, **Then** they are redirected to the organization creation form.
2. **Given** an authenticated user with no organizations, **When** they try to navigate directly to a dashboard URL, **Then** they are redirected to the organization creation form.

---

### User Story 3 - Returning User With Organization Goes Directly to Dashboard (Priority: P2)

A user who already has an organization signs in and is taken directly to the dashboard under their first organization. They skip the onboarding form entirely.

**Why this priority**: This ensures existing users are not disrupted by the onboarding guard. It completes the routing logic for all user states.

**Independent Test**: Can be tested by signing in as a user who already has an organization and verifying they land on the dashboard at `/<org-slug>/dashboard` without seeing the onboarding form.

**Acceptance Scenarios**:

1. **Given** an authenticated user with at least one organization, **When** they sign in, **Then** they are redirected to `/<org-slug>/dashboard` for their first organization (by creation date).
2. **Given** an authenticated user with at least one organization, **When** they navigate to the application root, **Then** they see their organization dashboard (not the onboarding form).

---

### Edge Cases

- What happens when a user submits an organization name that is extremely long? The system enforces a 100-character limit and shows a validation error.
- What happens if the organization creation request fails (e.g., network error)? The user sees an error message and can retry without losing their input.
- What happens if a user has multiple organizations? They are directed to the dashboard of their first organization (by creation date). Multi-org switching is out of scope for this feature.
- What happens if the user's session expires while on the onboarding form? They are redirected to the sign-in page and upon signing back in, return to the onboarding form.
- What happens if a user enters a slug that is already taken? The system shows an inline validation error indicating the slug is unavailable before form submission.
- What happens if a slug contains invalid characters (uppercase, special chars, leading/trailing hyphens)? The system shows a validation error describing the allowed format.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST check whether the authenticated user belongs to at least one organization after sign-in.
- **FR-002**: System MUST redirect users with no organizations to the organization creation form before granting access to any dashboard route.
- **FR-003**: System MUST display an organization creation form requiring an organization name field and a unique URL slug field.
- **FR-004**: System MUST validate that the organization name is not empty and does not exceed 100 characters.
- **FR-005**: System MUST validate that the slug contains only lowercase letters, numbers, and hyphens, does not start or end with a hyphen, and is between 3 and 50 characters.
- **FR-006**: System MUST validate that the slug is globally unique across all organizations.
- **FR-007**: System MUST create the organization and associate the user with the "owner" role upon form submission.
- **FR-008**: System MUST redirect the user to `/<org-slug>/dashboard` after successful organization creation.
- **FR-009**: System MUST redirect authenticated users who already have at least one organization directly to `/<org-slug>/dashboard` for their first organization (by creation date).
- **FR-010**: System MUST prevent unauthenticated users from accessing the organization creation form (redirect to sign-in).
- **FR-011**: System MUST persist the organization so it survives page refreshes and subsequent sign-ins.
- **FR-012**: System MUST scope all dashboard routes under the organization slug in the URL path (e.g., `/<org-slug>/...`).

### Key Entities

- **Organisation**: Represents a tenant workspace. Key attributes: name (display name, up to 100 characters, duplicates allowed), slug (URL identifier, globally unique, 3-50 characters, lowercase alphanumeric and hyphens). Each user must belong to at least one organisation to access the application.
- **Membership**: Represents the relationship between a user and an organisation. The creator receives the "owner" role, which is the highest privilege level and distinct from "admin."

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of new users complete organization creation within 60 seconds of arriving at the onboarding form.
- **SC-002**: 100% of users without an organization are prevented from accessing dashboard routes.
- **SC-003**: Users who already have an organization reach the dashboard within 2 seconds of sign-in (no unnecessary onboarding detour).
- **SC-004**: Organization creation form submission succeeds on the first attempt for 99% of users (assuming valid input and unique slug).

## Assumptions

- The existing `organisations` and `memberships` database tables (from the schema) will be used for storing organization data. A `slug` column will need to be added to the `organisations` table if not already present.
- WorkOS handles all authentication; this feature only handles the post-authentication routing and organization creation.
- Multi-organization support (switching between orgs, creating additional orgs) is out of scope. This feature handles only the initial mandatory organization creation.
- The user's "first organization" is determined by the earliest creation timestamp.
- The "owner" role is the highest privilege level; permission differences between "owner" and "admin" will be defined in a future feature.
