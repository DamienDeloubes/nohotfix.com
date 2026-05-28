# Feature Specification: Create Spec

**Feature Branch**: `011-create-spec`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User description: "Create Spec — first Authoring-domain feature allowing Admins to create a new spec directly in the Spec Library."

## Clarifications

### Session 2026-03-09

- Q: Are test step "instruction" and "expected outcome" plain text or rich text? → A: Plain text — simple text fields for both.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Minimal Spec (Priority: P1)

An Admin navigates to the Spec Library and creates a new spec by entering only a title. The system assigns default values (severity: medium, all optional fields empty) and persists the spec. A changelog entry is recorded, and the Admin is redirected to the spec detail page with a success toast.

**Why this priority**: This is the minimum viable path — a spec must be creatable with the fewest possible inputs to unblock all downstream features (playbook building, execution, artifact gating). Every other story builds on this foundation.

**Independent Test**: Can be fully tested by navigating to the new spec form, entering a title, submitting, and verifying the spec appears on the detail page with correct defaults. Delivers the core value of populating the Spec Library.

**Acceptance Scenarios**:

1. **Given** an Admin is on the new spec form, **When** they enter a title and click "Create spec", **Then** the spec is created with severity defaulting to medium and all optional fields empty, a changelog entry is recorded, and the Admin is redirected to the spec detail page with a success toast.
2. **Given** an Admin is on the new spec form, **When** the title field is empty, **Then** the "Create spec" button is disabled.

---

### User Story 2 - Create a Fully Configured Spec (Priority: P1)

An Admin fills in every available field: title, system under test (selected from known values or entered as a new value), severity, rich-text preconditions, rich-text description, ordered test steps (each with instruction and expected outcome), rich-text expected result, and tester notes. The spec is created with all data persisted. The detail page renders every field correctly.

**Why this priority**: Equal to P1 because the full-field creation path validates the complete data model. If any field fails to persist or render, downstream features (execution, artifact gating) will be broken.

**Independent Test**: Can be tested by filling in every field on the new spec form, submitting, and verifying that the detail page displays all values accurately — including rich text formatting, ordered test steps, and the selected system under test.

**Acceptance Scenarios**:

1. **Given** an Admin is on the new spec form, **When** they fill in title, system under test, severity (Critical), preconditions, description, 4 test steps, expected result, and tester notes, and click "Create spec", **Then** all data is persisted and the detail page renders every field correctly.
2. **Given** an Admin is typing in the system under test field, **When** they enter a value that already exists in the organisation's known systems, **Then** the value appears as a selectable suggestion.
3. **Given** an Admin is typing in the system under test field, **When** they enter a value not yet known, **Then** the new value is accepted and saved for future reference across the organisation upon successful spec creation.

---

### User Story 3 - Manage Ordered Test Steps (Priority: P2)

An Admin adds, removes, and reorders test steps while creating a spec. Each step has an instruction and an expected outcome (both required when a step exists). Steps can be dragged to reorder, and step numbers recalculate automatically. The system enforces a maximum of 50 steps.

**Why this priority**: Test steps are the primary content of a spec during execution, but the mechanics of adding/reordering are secondary to the basic creation flow.

**Independent Test**: Can be tested by adding multiple test steps, reordering them via drag-and-drop, removing one, and verifying the final order and numbering persist correctly on the detail page.

**Acceptance Scenarios**:

1. **Given** an Admin is on the new spec form, **When** they add 3 test steps with instructions and expected outcomes, **Then** all 3 steps are persisted in the correct order.
2. **Given** an Admin has added 3 test steps, **When** they drag step 3 to position 1, **Then** the step numbers recalculate to reflect the new order (former step 3 becomes step 1, etc.).
3. **Given** an Admin has added a test step and written the instruction, **When** they leave the expected outcome blank and attempt to submit, **Then** an inline validation error appears on the expected outcome field.
4. **Given** an Admin has added 50 test steps, **When** they try to add another, **Then** the "Add step" control is disabled and a message indicates the maximum has been reached.

---

### User Story 4 - Unauthorised Access Prevention (Priority: P2)

A user with the Member role attempts to access the new spec form (via direct URL navigation). The system denies access and shows an appropriate message or redirects to a safe page.

**Why this priority**: Security enforcement is critical but is a guard rather than a user-facing workflow. It must work correctly but is less complex than the creation flows.

**Independent Test**: Can be tested by logging in as a Member-role user, navigating directly to the new spec URL, and verifying that access is denied with a clear message.

**Acceptance Scenarios**:

1. **Given** a user with the Member role, **When** they navigate to the new spec form URL, **Then** the system returns an access denied response and the user sees an appropriate error or is redirected.
2. **Given** a user with the Admin or Owner role, **When** they navigate to the new spec form URL, **Then** they see the creation form.

---

### User Story 5 - Resilient Form Behaviour (Priority: P3)

When the Admin's session expires mid-form or a network error occurs during submission, the form preserves its state so the Admin can retry without re-entering data. On session expiry, the Admin is redirected to login and can return to find their data intact. On network error, an error toast is shown and the form remains editable.

**Why this priority**: This is a quality-of-life improvement. The core creation flow works without it, but losing a complex spec form due to a transient error would be a frustrating experience.

**Independent Test**: Can be tested by filling in the form, simulating a network failure on submit, and verifying the form data is preserved and the error is communicated. For session expiry: filling in the form, letting the session expire, verifying redirect to login, logging back in, and checking form data is recoverable.

**Acceptance Scenarios**:

1. **Given** an Admin has filled in the spec form and a network error occurs on submit, **When** the request fails, **Then** an error toast is shown and all form data remains intact for retry.
2. **Given** an Admin has filled in the spec form and their session has expired, **When** they attempt to submit, **Then** they are redirected to login and after re-authenticating, their form data is recoverable.

---

### Edge Cases

- **Title at boundary length**: 500 characters accepted; 501 rejected. Frontend enforces character limit with visible counter.
- **Empty rich text fields**: An "empty" rich text editor may produce a structural object with no meaningful content. The system normalises this to empty/null on storage. On read, empty values are returned and the frontend initialises with an empty editor.
- **Test steps at maximum (50)**: 50 steps accepted; adding beyond 50 is blocked at the frontend with a visible message. The backend enforces the same ceiling.
- **Duplicate titles**: Allowed — specs are identified by unique ID, not title. No unique constraint on title.
- **Concurrent creation by two admins**: No conflict — each creation produces an independent spec with its own unique ID.
- **Rich text with embedded content**: Rich text may contain images, links, tables, or other embedded nodes. Stored as-is. Rendering must not introduce cross-site scripting vulnerabilities.
- **Special characters in title and system under test**: Unicode, emoji, and HTML entities are accepted and stored as-is. Displayed as plain text (no HTML interpretation).
- **Test step reordering**: When steps are reordered, step numbers recalculate automatically based on array position. No gaps or duplicates in numbering.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST allow Admins (owner or admin role) to create a new spec in the organisation's Spec Library.
- **FR-002**: System MUST require a title (1-500 characters) for every spec. All other fields are optional.
- **FR-003**: System MUST support the following optional fields on a spec: system under test, severity (critical / high / medium / low), preconditions (rich text), description (rich text), test steps (ordered list), expected result (rich text), and tester notes (plain text).
- **FR-004**: System MUST default severity to "medium" when not explicitly set by the user.
- **FR-005**: System MUST provide a combobox for "system under test" that suggests values previously used within the organisation. When the user enters a value not yet known, the system MUST accept it and make it available for future suggestions upon successful spec creation.
- **FR-006**: Each test step MUST contain an instruction (plain text) and an expected outcome (plain text). Both fields are required when a test step is present.
- **FR-007**: System MUST support up to 50 test steps per spec. Adding beyond 50 MUST be prevented.
- **FR-008**: System MUST allow test steps to be reordered via drag-and-drop. Step numbering MUST recalculate automatically based on position.
- **FR-009**: System MUST normalise empty rich text fields to null/empty on storage. On read, null values MUST be returned so the frontend can initialise an empty editor.
- **FR-010**: System MUST record a changelog entry upon successful spec creation, capturing the actor, the action ("created"), and the entity reference.
- **FR-011**: System MUST redirect the Admin to the spec detail page with a success toast after creation.
- **FR-012**: System MUST deny spec creation to users with the Member role, returning an appropriate access-denied error.
- **FR-013**: System MUST disable the submit button until all required fields (title) are filled and all present test steps have both instruction and expected outcome.
- **FR-014**: System MUST preserve form state on network errors, allowing retry without re-entering data.
- **FR-015**: System SHOULD preserve form state when the session expires, enabling recovery after re-authentication.

### Key Entities

- **Spec (Library Entry)**: A reusable testing instruction belonging to an organisation's centralised library. Key attributes: title, system under test, severity, preconditions (rich text), description (rich text), ordered test steps, expected result (rich text), tester notes, archived status, creator, timestamps. Identified by a unique ID. Belongs to exactly one organisation. Created by exactly one user (Admin).
- **Test Step**: An ordered sub-element of a spec containing a plain-text instruction (what to do) and a plain-text expected outcome (what should happen). Position is implicit from order within the step list.
- **System Under Test**: A free-text label representing the application, component, or system being tested. Values are shared across the organisation for consistency (autocomplete from historical values) but are not a controlled vocabulary — new values are accepted freely.
- **Changelog Entry**: An audit record capturing who did what to which entity and when. For spec creation, records the actor, the "created" action, and the spec entity reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create a minimal spec (title only) in under 30 seconds from form load to confirmation.
- **SC-002**: Admins can create a fully configured spec (all fields, 4+ test steps) in under 5 minutes from form load to confirmation.
- **SC-003**: 100% of spec creation attempts by Member-role users are denied with a clear access-denied message.
- **SC-004**: Form state is preserved on network errors — Admins can retry submission without any data loss.
- **SC-005**: All previously used "system under test" values within the organisation appear as suggestions when typing in the field.
- **SC-006**: Every successful spec creation produces exactly one changelog entry visible in the audit trail.
- **SC-007**: Rich text fields (preconditions, description, expected result) preserve formatting (bold, italic, lists, links) through the create-and-view round trip.
- **SC-008**: Test step reordering correctly persists — the detail page displays steps in the order set by the Admin, not the order they were originally added.

## Assumptions

- **A-001**: The existing `spec_library` table schema is sufficient and requires no migration for this feature. Artifact requirements field exists in the table but is out of scope for this feature.
- **A-002**: "System under test" suggestions are derived from distinct values already stored in existing specs within the same organisation. No separate lookup table is required.
- **A-003**: Rich text fields use TipTap JSON format, consistent with the project's existing rich text approach.
- **A-004**: The spec detail page (view/read) is a prerequisite for the redirect after creation. A minimal read-only detail view is included in scope as the redirect target, but full editing capabilities are a separate feature.
- **A-005**: The changelog "created" action does not need field-level change tracking (field_changes can be null for creation events). Only the fact of creation is recorded.
- **A-006**: Scope excludes: editing specs, archiving specs, listing/searching specs, linking specs to playbooks, and configuring artifact requirements. These are separate features.
