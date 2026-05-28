# Feature Specification: User Settings Page

**Feature Branch**: `007-user-settings`
**Created**: 2026-03-08
**Status**: Draft
**Input**: User description: "I want to create a settings page for the user. The page doesn't do a whole lot, you can update your first name and last name. But not more, if you want to update your email or password you will be redirected to a guide hosted on nohotfix.com."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Update Name (Priority: P1)

As a logged-in user, I want to update my first name and last name on a User Settings page so that my profile reflects my current identity across the application.

**Why this priority**: This is the core and only editable functionality of the page — the primary reason it exists.

**Independent Test**: Can be fully tested by navigating to User Settings, changing first and/or last name, saving, and confirming the updated name persists on reload and appears wherever the user's name is displayed.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the User Settings page, **When** they modify their first name and/or last name and save, **Then** the updated name is persisted and displayed immediately without a full page reload.
2. **Given** a logged-in user, **When** they attempt to save with an empty first name, **Then** the system displays a validation error and does not save.
3. **Given** a logged-in user, **When** they attempt to save with an empty last name, **Then** the system displays a validation error and does not save.
4. **Given** a logged-in user, **When** they save a valid name, **Then** the updated name is reflected across the application wherever the user's name appears (e.g., navigation header, member lists).

---

### User Story 2 - View Current Profile Information (Priority: P1)

As a logged-in user, I want to see my current first name, last name, and email address on the User Settings page so that I can verify my account information.

**Why this priority**: The page must display current data before any editing can occur. Users also need to see their email to know which account they are managing.

**Independent Test**: Can be fully tested by navigating to User Settings and verifying first name, last name, and email are displayed with correct current values.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they navigate to the User Settings page, **Then** they see their current first name, last name, and email address.
2. **Given** a logged-in user, **When** they view the User Settings page, **Then** the email address is displayed as read-only (not editable on this page).

---

### User Story 3 - Email & Password Change Guidance (Priority: P2)

As a logged-in user who wants to change their email or password, I want to be directed to a guide on nohotfix.com so that I can learn how to make those changes through the appropriate channel.

**Why this priority**: This is a secondary but important informational feature that sets expectations and prevents confusion about what can be changed on this page.

**Independent Test**: Can be fully tested by navigating to User Settings, locating the "Email & Password" section, and confirming the "View guide" button links to the correct nohotfix.com help page.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the User Settings page, **When** they look at the Email & Password section, **Then** they see explanatory text such as "Learn how to update your email address or password" and a "View guide" button.
2. **Given** a logged-in user, **When** they click the "View guide" button, **Then** they are taken to the nohotfix.com guide page (opens in a new tab).

---

### User Story 4 - Capture First and Last Name at Signup (Priority: P1)

As a new user signing up, I want to provide my first name and last name during registration so that my identity is correctly stored from the start.

**Why this priority**: The data model must support separate first and last name fields before the settings page can display and edit them. Capturing this at signup ensures all new users have complete name data from day one.

**Independent Test**: Can be fully tested by completing the signup flow and verifying that first name and last name are captured and stored as separate fields.

**Acceptance Scenarios**:

1. **Given** a new user going through the signup flow, **When** they complete registration, **Then** the system stores their first name and last name as separate fields (sourced from the identity provider).
2. **Given** an existing user who signed up before this change and has only a single display name, **When** they log in or visit User Settings, **Then** the system handles the legacy data gracefully (e.g., the existing display name is shown in the first name field, and last name is left empty for the user to fill in).

---

### User Story 5 - Schema Migration from Display Name to First/Last Name (Priority: P1)

As the system, the user data model must replace the single display name field with separate first name and last name fields so that the application can properly address users and display their names in appropriate contexts.

**Why this priority**: This is a prerequisite for all other stories — without the data model change, neither the settings page nor the signup flow can store first/last name separately.

**Independent Test**: Can be verified by running the migration and confirming the new fields exist, the old display name data is preserved in the first name field as a fallback, and no data is lost.

**Acceptance Scenarios**:

1. **Given** the existing user data with a single display name, **When** the migration runs, **Then** new first name and last name fields are added, the old display name value is copied to the first name field, and last name defaults to empty.
2. **Given** the migration has run, **When** a new user signs up, **Then** their first name and last name are stored in the new separate fields.
3. **Given** the migration has run, **When** any part of the application displays a user's name, **Then** it uses the first name and last name fields (not the old display name).

---

### Edge Cases

- What happens when a user's first name or last name contains special characters (accents, hyphens, apostrophes)? The system accepts Unicode characters and common name punctuation.
- What happens when a user enters very long names? The system enforces a maximum character limit (50 characters per field) and shows a validation message if exceeded.
- What happens if the user's session expires while editing? The save request fails with a session-expired error and the user is prompted to re-authenticate.
- What happens when a user submits a form with no changes? The save button is disabled when no changes have been made, or the system accepts the request gracefully without error.
- What happens if the first name or last name contains only whitespace? The system treats whitespace-only input as empty and rejects it with a validation error.
- What happens for existing users who only have a display name after migration? Their display name is placed in the first name field; last name is empty. On their next visit to User Settings, they can fill in their last name.
- What happens if the identity provider does not supply separate first/last name during signup? The system uses whatever name the provider supplies as the first name and leaves last name empty for the user to complete later.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

#### User Settings Page

- **FR-001**: The application MUST provide a User Settings page as a tab ("Account") within the existing org-scoped Settings area, accessible to any authenticated user at `/$orgSlug/settings/account`.
- **FR-002**: The User Settings page MUST display the user's current first name and last name in editable fields.
- **FR-003**: The User Settings page MUST display the user's email address in a read-only format.
- **FR-004**: Users MUST be able to update their first name and last name and save the changes.
- **FR-005**: The system MUST validate name fields before saving: each field must not be empty, must not be whitespace-only, and must not exceed 50 characters.
- **FR-006**: After a successful name update, the system MUST persist the change and reflect the updated name on the current page without requiring a full page reload.
- **FR-007**: The system MUST provide clear feedback to the user on save success (confirmation message) and save failure (error message with reason).
- **FR-008**: The User Settings page MUST include an "Email & Password" section with explanatory text and a "View guide" button that links to a guide page on nohotfix.com (opens in a new tab).

#### Data Model & Migration

- **FR-009**: The system MUST store first name and last name as separate fields for the user, replacing the single display name field.
- **FR-010**: The system MUST migrate existing user data by copying the current display name value into the first name field and setting last name to empty.
- **FR-011**: The system MUST remove the old display name field after migration, and all application code that previously referenced it MUST be updated to use first name and last name.

#### Signup Flow Update

- **FR-012**: The signup flow MUST capture and store the user's first name and last name as separate fields (sourced from the identity provider when available).
- **FR-013**: If the identity provider supplies a single combined name, the system MUST store it in the first name field and leave last name empty for the user to complete later.
- **FR-014**: All existing application surfaces that display a user's name (navigation, member lists, etc.) MUST be updated to use the first name and last name fields. When last name is empty, surfaces MUST display first name only.

### Key Entities

- **User**: The authenticated individual. Key attributes relevant to this feature: first name (required, max 50 characters), last name (optional at the data level/nullable, max 50 characters, required only when saving from the User Settings page), and email (read-only on the settings page).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view their profile information (name, email) within 2 seconds of navigating to User Settings.
- **SC-002**: Users can update their first and last name and see the change reflected in under 3 seconds.
- **SC-003**: 95% of users can locate and update their name on the first attempt without external guidance.
- **SC-004**: 100% of "View guide" button clicks successfully navigate to the nohotfix.com help page.
- **SC-005**: 100% of new signups have first name stored as a separate field from day one.
- **SC-006**: 100% of existing users retain their name data after migration with no data loss.

## Clarifications

### Session 2026-03-08

- Q: Where does the User Settings page live in the navigation — separate page via user avatar menu, or a tab within the existing org-scoped Settings area? → A: It is a tab within the existing org-scoped Settings area, routed at `/$orgSlug/settings/account`.
- Q: Should migrated users with empty last names be forced to complete it, or is last name optional at the data level? → A: Last name is optional at the data level (nullable). FR-005 validation requiring non-empty last name only applies when explicitly saving from the User Settings page. Users with empty last names can use the app normally.
- Q: Should name changes in NoHotfix sync back to WorkOS, or is the local database the sole authority? → A: Local-only. Names are seeded from WorkOS at signup but managed locally thereafter. No sync back to WorkOS.

## Assumptions

- The "View guide" link destination URL on nohotfix.com will be created separately (content/marketing concern) and is not part of this feature's scope.
- First name and last name each have a maximum length of 50 characters.
- The User Settings page is an "Account" tab within the existing org-scoped Settings area (alongside Organisation Settings from 006). It is routed at `/$orgSlug/settings/account`.
- Although the page is nested under an org slug, it edits user-level data — every authenticated member of the organisation can manage their own name regardless of role.
- WorkOS (the identity provider) supplies first and last name fields that can be extracted during signup. If only a single name is provided, it is treated as first name. After signup, NoHotfix's local database is the sole authority for user names — no bidirectional sync with WorkOS.
- The old display name column will be dropped after migration. There is no need for a backward-compatibility period since this is a pre-launch application.
- Last name is optional at the data level (nullable) to handle identity providers that may not supply it and to avoid blocking migrated users. It is only required when the user explicitly saves from the User Settings page.
