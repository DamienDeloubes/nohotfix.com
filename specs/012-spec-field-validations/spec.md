# Feature Specification: Spec Field Validations

**Feature Branch**: `012-spec-field-validations`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add validations to spec input fields (title, preconditions, description, testSteps, expectedResult, testerNotes) and implement + validate estimatedDurationMinutes and tags. Artifact requirements out of scope."

## Clarifications

### Session 2026-03-10

- Q: What character limits should apply to test step instruction and expected outcome fields? → A: 500 characters each.
- Q: Should validations target the create form only, or also build the edit form? → A: Create form only. Validation rules are defined as reusable, carrying over when editing is built later.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Text Field Validation Enforcement (Priority: P1)

An Admin creating a spec receives immediate inline feedback when text-based field constraints are violated. Title is validated for length (1–200 characters, trimmed). Rich text fields (preconditions, description, expected result) are validated against their respective plain-text character limits (5,000 / 10,000 / 5,000). Tester notes are validated for length (max 2,000 characters, trimmed). Validation is enforced both in the form (preventing submission) and on the server (rejecting invalid payloads).

**Why this priority**: Text field validation is the most fundamental data integrity safeguard. Without it, oversized content can degrade storage, rendering, and downstream execution experiences. Title validation is especially critical since it's the only required field.

**Independent Test**: Can be fully tested by entering values at and beyond each field's character limit and verifying that the form shows inline errors, prevents submission, and that the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec form, **When** they enter a title exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and the form cannot be submitted.
2. **Given** an Admin is on the spec form, **When** they enter a title with only whitespace, **Then** the title is treated as empty after trimming and the form shows a "title required" error.
3. **Given** an Admin enters preconditions exceeding 5,000 plain-text characters, **When** they attempt to submit, **Then** the form shows an inline error on the preconditions field with a character count indicator.
4. **Given** an Admin enters a description exceeding 10,000 plain-text characters, **When** they attempt to submit, **Then** the form shows an inline error on the description field.
5. **Given** an Admin enters an expected result exceeding 5,000 plain-text characters, **When** they attempt to submit, **Then** the form shows an inline error on the expected result field.
6. **Given** an Admin enters tester notes exceeding 2,000 characters, **When** they attempt to submit, **Then** the form shows an inline error on the tester notes field.
7. **Given** a valid payload is submitted via the API with a title longer than 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 2 - Test Steps Validation (Priority: P1)

An Admin adding test steps to a spec receives validation feedback on the step content and count. Each test step requires an instruction (plain text). The expected outcome field is optional per step. The maximum number of steps is 50. The form prevents adding steps beyond the limit and shows an inline error if a step's instruction is empty.

**Why this priority**: Test steps are the core operational content of a spec. Malformed or excessive steps directly break the execution flow.

**Acceptance Scenarios**:

1. **Given** an Admin has added a test step, **When** they leave the instruction field empty and attempt to submit, **Then** an inline validation error appears on the instruction field.
2. **Given** an Admin has added a test step with an instruction but no expected outcome, **When** they submit, **Then** the spec is created successfully (expected outcome is optional).
3. **Given** an Admin enters an instruction exceeding 500 characters, **When** they attempt to submit, **Then** the form shows an inline error on the instruction field.
4. **Given** an Admin enters an expected outcome exceeding 500 characters, **When** they attempt to submit, **Then** the form shows an inline error on the expected outcome field.
5. **Given** an Admin has added 50 test steps, **When** they try to add another, **Then** the "Add step" control is disabled with a message indicating the maximum has been reached.
6. **Given** a valid payload is submitted via the API with 51 test steps, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 3 - Estimated Duration Implementation and Validation (Priority: P2)

An Admin can set an estimated duration (in minutes) for a spec. The field accepts an integer between 1 and 999. The duration is optional. When set, it is displayed on the spec detail page.

**Why this priority**: Estimated duration enables time planning at playbook level, but specs are fully functional without it. It adds operational planning value without blocking core workflows.

**Independent Test**: Can be tested by creating specs with and without estimated durations, verifying the value persists and displays correctly, and confirming boundary values (0, 1, 999, 1000) are handled properly.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec form, **When** they enter an estimated duration of 30, **Then** the value is accepted and persisted.
2. **Given** an Admin is on the spec form, **When** they leave the estimated duration empty, **Then** the spec is created with no duration (null).
3. **Given** an Admin enters an estimated duration of 0, **When** they attempt to submit, **Then** the form shows a validation error indicating the minimum is 1.
4. **Given** an Admin enters an estimated duration of 1000, **When** they attempt to submit, **Then** the form shows a validation error indicating the maximum is 999.
5. **Given** an Admin enters a non-integer value (e.g. 2.5 or "abc"), **When** they attempt to submit, **Then** the form shows a validation error indicating the field requires a whole number.
6. **Given** a valid payload is submitted via the API with estimatedDurationMinutes of 0 or 1000, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 4 - Tags Implementation and Validation (Priority: P2)

An Admin can add tags to a spec via a combobox that suggests existing tags used within the organisation. Tags are auto-transformed to kebab-case on input. A maximum of 10 tags are allowed per spec, each with a maximum of 30 characters. Duplicate tags (after kebab-case transformation) are silently deduplicated.

**Why this priority**: Tags enable categorisation and filtering of specs in the library. This is valuable for organisation but not required for core spec creation or execution workflows.

**Independent Test**: Can be tested by adding tags with mixed casing (verifying kebab-case transform), adding duplicate tags (verifying deduplication), testing the 10-tag and 30-character limits, and verifying tag suggestions from existing specs.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec form, **When** they type "Smoke Test" in the tags field, **Then** the value is auto-transformed to "smoke-test".
2. **Given** an Admin has added 10 tags, **When** they try to add another, **Then** the tag input is disabled with a message indicating the maximum has been reached.
3. **Given** an Admin enters a tag exceeding 30 characters, **When** they confirm the tag, **Then** the form shows a validation error indicating the maximum tag length.
4. **Given** an Admin enters "smoke-test" twice, **When** the second entry is confirmed, **Then** the duplicate is silently ignored (only one instance is kept).
5. **Given** existing specs in the organisation have tags, **When** the Admin begins typing in the tags field, **Then** matching existing tags appear as selectable suggestions.
6. **Given** a valid payload is submitted via the API with 11 tags, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### Edge Cases

- **Title at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Rich text character counting**: Character limits apply to extracted plain text, not the underlying JSON structure. Formatting markup is excluded from the count.
- **Empty rich text with formatting artifacts**: A rich text editor may produce a structural JSON object with no meaningful text. The system normalises this to null on storage. Character count for such content is zero.
- **Whitespace-only title**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only tester notes**: Treated as empty after trimming. Stored as null.
- **Estimated duration with leading zeros**: "007" is accepted as integer 7.
- **Tags with special characters**: Characters that cannot be represented in kebab-case (e.g. emoji, punctuation other than hyphens) are stripped during transformation. If the resulting tag is empty, it is rejected.
- **Tag case sensitivity**: "API-Test", "api-test", and "API-TEST" all resolve to "api-test" and are considered duplicates.
- **Test step with empty instruction after trimming**: Treated as missing. Validation rejects it.
- **Concurrent validation**: Frontend and backend enforce the same rules independently. The backend is the authoritative source of truth.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**Title Validation**

- **FR-001**: System MUST require a title between 1 and 200 characters (after trimming) for every spec.
- **FR-002**: System MUST trim leading and trailing whitespace from the title before validation and storage.
- **FR-003**: System MUST show a visible character counter on the title field.

**Rich Text Field Validation**

- **FR-004**: System MUST validate preconditions against a maximum of 5,000 plain-text characters (extracted from rich text content).
- **FR-005**: System MUST validate description against a maximum of 10,000 plain-text characters (extracted from rich text content).
- **FR-006**: System MUST validate expected result against a maximum of 5,000 plain-text characters (extracted from rich text content).
- **FR-007**: System MUST show a character counter on each rich text field, counting plain-text characters only.
- **FR-008**: System MUST normalise empty rich text documents (no meaningful text content) to null on storage.

**Tester Notes Validation**

- **FR-009**: System MUST validate tester notes against a maximum of 2,000 characters (after trimming).
- **FR-010**: System MUST trim leading and trailing whitespace from tester notes before validation and storage.
- **FR-011**: System MUST normalise whitespace-only tester notes to null on storage.

**Test Steps Validation**

- **FR-012**: System MUST require a non-empty instruction (after trimming) for every test step that is present.
- **FR-013**: System MUST validate test step instruction against a maximum of 500 characters.
- **FR-014**: System MUST treat the expected outcome field as optional for each test step.
- **FR-015**: System MUST validate test step expected outcome against a maximum of 500 characters when provided.
- **FR-016**: System MUST enforce a maximum of 50 test steps per spec.
- **FR-017**: System MUST prevent adding steps beyond 50 in the form, with a visible message indicating the limit.

**Estimated Duration (new field)**

- **FR-018**: System MUST support an optional estimated duration field on the spec, expressed as a whole number of minutes.
- **FR-019**: System MUST validate estimated duration as an integer between 1 and 999 (inclusive) when provided.
- **FR-020**: System MUST display estimated duration on the spec detail page when set.
- **FR-021**: ~~System MUST exclude specs without an estimated duration from any duration sum calculations.~~ *Deferred — duration sum calculations belong to the playbook/section feature, not individual spec creation. Will be addressed when playbook-level duration aggregation is implemented.*

**Tags (new field)**

- **FR-022**: System MUST support an optional tags field on the spec, accepting up to 10 tags.
- **FR-023**: System MUST enforce a maximum of 30 characters per tag.
- **FR-024**: System MUST auto-transform tag values to kebab-case on input.
- **FR-025**: System MUST silently deduplicate tags that are identical after kebab-case transformation.
- **FR-026**: System MUST provide a combobox for tags that suggests existing tags used within the organisation (same pattern as the system under test combobox).
- **FR-027**: System MUST display tags on the spec detail page.

**Cross-Cutting Validation**

- **FR-028**: System MUST enforce all validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-029**: System MUST show inline validation errors adjacent to the offending field, not only as a top-level form error.
- **FR-030**: System MUST disable the submit button when any validation error is present.

### Key Entities

- **Spec (Library Entry)**: Extended with two new optional fields — `estimatedDurationMinutes` (integer 1–999 or null) and `tags` (array of kebab-case strings, max 10, each max 30 chars, or empty array).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of spec creation attempts with out-of-bounds field values are rejected by both client-side validation and server-side validation independently.
- **SC-002**: Character counters are visible on all length-constrained fields (title, preconditions, description, expected result, tester notes), updating in real time as the user types.
- **SC-003**: Admins can add estimated duration and tags to a spec and see the values persist correctly through the create-and-view round trip.
- **SC-004**: Tag suggestions from existing specs in the organisation appear within 1 second of the user beginning to type.
- **SC-005**: Kebab-case transformation of tags is immediate and visible to the Admin before submission.
- **SC-006**: Admins attempting to exceed any field limit (character count, step count, tag count, duration range) receive a clear inline error message that specifies the constraint.

## Assumptions

- **A-001**: The `spec_library` table already has `estimated_duration_minutes` and `tags` columns (or a migration will be added as part of this feature if they do not yet exist). This is an implementation concern — the spec does not prescribe the storage mechanism.
- **A-002**: Rich text character counting uses the same plain-text extraction logic across frontend and backend (e.g. stripping all formatting to get raw text length).
- **A-003**: The kebab-case transformation for tags follows standard conventions: lowercase, replace spaces and underscores with hyphens, strip non-alphanumeric characters except hyphens, collapse consecutive hyphens.
- **A-004**: Tag suggestions are derived from distinct tag values already stored in existing specs within the same organisation (same pattern as system under test suggestions). No separate tags lookup table is required.
- **A-005**: The title maximum length is updated from the 500-character limit in the 011-create-spec implementation to 200 characters as specified in the spec-configuration document. This is a deliberate alignment with the canonical field definition.
- **A-006**: Scope excludes artifact requirements validation — this will be a separate feature.
- **A-007**: The expected outcome field on test steps is optional, aligning with the spec-configuration document which defines it as optional. If the current implementation requires it, this feature updates the validation to make it optional.
- **A-008**: Validations are wired into the create form only (edit does not exist yet). Validation rules are defined as reusable schemas so they carry over automatically when the edit feature is built later.
