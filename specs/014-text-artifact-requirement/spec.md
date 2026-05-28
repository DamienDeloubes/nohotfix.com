# Feature Specification: Text Artifact Requirement

**Feature Branch**: `014-text-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add the first optional required artifact type 'Text' to the spec configuration, as defined in docs/development/spec-configuration.md."

## Clarifications

### Session 2026-03-10

- Q: Does this feature target the create form only, or also the edit form? → A: Create form only. Artifact requirement logic is reusable for edit later.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a Text Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more text artifact requirements to the spec's artifact requirements list. For each text requirement, the Admin provides a label (what text the tester should supply), an optional description (guidance for the tester), and a required flag (whether the tester must provide this text before the spec can be marked as passed). The artifact requirements section appears in the spec creation form with an "Add artifact requirement" control. The Admin selects the "Text" type and fills in the fields.

**Why this priority**: This is the core capability of the feature. Without the ability to add text artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more text artifact requirements and verifying the requirements persist through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "Text", **Then** a text artifact requirement form section appears with fields for label, description, and a required toggle.
2. **Given** an Admin has added a text artifact requirement with a label of "Paste the relevant error log output", **When** they submit the spec, **Then** the spec is created with the text artifact requirement stored in the artifact requirements list.
3. **Given** an Admin has added a text artifact requirement, **When** they toggle the required flag on, **Then** the requirement is marked as required and will block spec completion during execution if no text is provided.
4. **Given** an Admin has added a text artifact requirement, **When** they toggle the required flag off, **Then** the requirement is marked as optional and will not block spec completion during execution.
5. **Given** an Admin has not added any artifact requirements, **When** they submit the spec, **Then** the spec is created successfully with no artifact requirements (null or empty list).

---

### User Story 2 - Validate Text Artifact Requirement Fields (Priority: P1)

The system validates text artifact requirement fields during spec creation. The label is required and limited to 200 characters. The description is optional and limited to 1,000 characters. Validation is enforced on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads).

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow. Without it, malformed artifact requirements could degrade downstream execution and display experiences.

**Independent Test**: Can be tested by entering values at and beyond each field's constraints and verifying that inline errors appear, submission is prevented, and the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a text artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a text artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** an Admin has added a text artifact requirement, **When** they enter a description exceeding 1,000 characters, **Then** an inline validation error is shown on the description field indicating the maximum length.
4. **Given** an Admin has added a text artifact requirement with a valid label and no description, **When** they submit the spec, **Then** the spec is created successfully (description is optional).
5. **Given** a valid payload is submitted via the API with a text artifact requirement whose label exceeds 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.
6. **Given** a valid payload is submitted via the API with a text artifact requirement whose label is empty, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 3 - Manage Multiple Artifact Requirements (Priority: P1)

An Admin can add up to 10 artifact requirements to a single spec, remove individual requirements, and reorder them via drag-and-drop. Each requirement is assigned an explicit index (0-based) that is persisted and used as a foreign key reference during execution. When a requirement is removed or reordered, the indices are recalculated to remain contiguous and 0-based.

**Why this priority**: Managing multiple artifacts is essential for real-world specs that require more than one piece of evidence. The 10-item limit and reordering establish the foundational artifact list management that all future artifact types will share.

**Independent Test**: Can be tested by adding multiple text artifact requirements, removing one from the middle, reordering via drag-and-drop, and verifying the indices are correctly recalculated and persisted.

**Acceptance Scenarios**:

1. **Given** an Admin has added 10 artifact requirements, **When** they try to add another, **Then** the "Add artifact requirement" control is disabled with a message indicating the maximum of 10 has been reached.
2. **Given** an Admin has added 3 artifact requirements, **When** they remove the second one, **Then** the remaining requirements are re-indexed as 0 and 1.
3. **Given** an Admin has added 3 artifact requirements, **When** they drag the third requirement to the first position, **Then** the requirements are reordered and re-indexed to reflect the new order (0, 1, 2).
4. **Given** a valid payload is submitted via the API with 11 artifact requirements, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 4 - Display Text Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has text artifact requirements, the spec detail page displays them in a dedicated "Artifact Requirements" section. Each requirement shows its label, description (if provided), type ("Text"), and whether it is required or optional. Requirements are displayed in their authored order (by index).

**Why this priority**: Displaying artifact requirements on the detail page allows Admins to review what they have configured. This is essential for verification but is not blocking the creation flow.

**Independent Test**: Can be tested by creating a spec with text artifact requirements and viewing the spec detail page to verify all fields are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a spec has two text artifact requirements, **When** an Admin views the spec detail page, **Then** both requirements are displayed in order, each showing label, type ("Text"), and required/optional status.
2. **Given** a text artifact requirement has a description, **When** it is displayed on the spec detail page, **Then** the description is shown alongside the label.
3. **Given** a text artifact requirement has no description, **When** it is displayed on the spec detail page, **Then** no description placeholder or empty section is shown.
4. **Given** a spec has no artifact requirements, **When** an Admin views the spec detail page, **Then** no "Artifact Requirements" section is displayed.

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter is shown.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only description**: Treated as empty after trimming. Stored as null.
- **Duplicate labels**: Allowed. Two artifact requirements may have the same label (e.g. "Error log output" for different test phases).
- **All requirements optional**: A spec may have artifact requirements where none are marked as required. This is valid -- the artifacts are informational.
- **All requirements required**: A spec may have all artifact requirements marked as required. This is valid -- the tester must provide all of them before the spec can pass.
- **Empty artifact requirements list on submit**: If the Admin added artifact requirements and then removed them all, the spec is submitted with no artifact requirements (null).
- **Re-indexing on removal**: Removing a requirement from the middle of the list recalculates indices to remain contiguous (e.g. removing index 1 from [0, 1, 2] produces [0, 1]).
- **Concurrent validation**: Frontend and backend enforce the same rules independently. The backend is the authoritative source of truth.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**Artifact Requirements Foundation (applies to all artifact types)**

- **FR-001**: System MUST support an optional artifact requirements list on the spec, accepting up to 10 requirements.
- **FR-002**: System MUST assign each artifact requirement an explicit 0-based index that is persisted and used as a foreign key reference during execution.
- **FR-003**: System MUST recalculate indices to remain contiguous and 0-based when requirements are removed or reordered.
- **FR-004**: System MUST allow the Admin to add artifact requirements via an "Add artifact requirement" control in the spec creation form.
- **FR-005**: System MUST allow the Admin to remove individual artifact requirements from the list.
- **FR-006**: System MUST allow the Admin to reorder artifact requirements via drag-and-drop.
- **FR-007**: System MUST prevent adding more than 10 artifact requirements, with a visible message indicating the limit when reached.

**Text Artifact Requirement Type**

- **FR-008**: System MUST support the "Text" artifact requirement type, which captures free-form text input from the tester during execution.
- **FR-009**: System MUST require a label for each text artifact requirement, between 1 and 200 characters after trimming.
- **FR-010**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-011**: System MUST support an optional description field on text artifact requirements, limited to 1,000 characters.
- **FR-012**: System MUST trim leading and trailing whitespace from the description before validation and storage. Whitespace-only descriptions are normalised to null.
- **FR-013**: System MUST support a required flag on each text artifact requirement indicating whether the tester must provide text before the spec can be marked as passed during execution.
- **FR-014**: System MUST show a character counter on the label field.
- **FR-015**: System MUST show a character counter on the description field.

**Display**

- **FR-016**: System MUST display artifact requirements on the spec detail page in a dedicated "Artifact Requirements" section, ordered by index.
- **FR-017**: System MUST show each requirement's label, type ("Text"), required/optional status, and description (if provided).
- **FR-018**: System MUST hide the "Artifact Requirements" section entirely when a spec has no artifact requirements.

**Cross-Cutting Validation**

- **FR-019**: System MUST enforce all artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-020**: System MUST show inline validation errors adjacent to the offending field within the artifact requirement form section.
- **FR-021**: System MUST disable the submit button when any validation error is present (consistent with existing form validation behavior).

### Key Entities

- **Artifact Requirement (Base)**: A polymorphic entity embedded in a spec's artifact requirements list. Has an index (0-based integer), label (string, 1-200 chars), optional description (string, max 1,000 chars), required flag (boolean), and type discriminator.
- **Text Artifact Requirement**: An artifact requirement of type "text" with no type-specific configuration beyond the base fields. During execution, the tester provides free-form text (max 10,000 chars) to satisfy the requirement.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add up to 10 text artifact requirements to a spec and see them persist correctly through the create-and-view round trip.
- **SC-002**: 100% of spec creation attempts with invalid artifact requirement fields (empty label, label > 200 chars, description > 1,000 chars, > 10 requirements) are rejected by both client-side and server-side validation independently.
- **SC-003**: Character counters are visible on label and description fields, updating in real time as the Admin types.
- **SC-004**: Admins can reorder artifact requirements via drag-and-drop and the new order persists correctly with recalculated indices.
- **SC-005**: Admins can remove artifact requirements and the remaining items are re-indexed correctly.
- **SC-006**: The spec detail page displays all artifact requirements in their authored order with correct labels, types, descriptions, and required/optional status.

## Assumptions

- **A-001**: The `spec_library` table already has an `artifact_requirements` JSONB column (confirmed in the 001_initial_schema migration). No database migration is required for this feature.
- **A-002**: This feature implements the foundation for artifact requirements management (add, remove, reorder, validate base fields) along with the first concrete type ("text"). Future artifact types (file, checkbox, url, measured_value, table) will extend this foundation without re-implementing the list management logic.
- **A-003**: The artifact requirements Zod schema will be defined as a discriminated union on the `type` field, starting with only the "text" variant. Additional variants will be added as each artifact type is implemented.
- **A-004**: Drag-and-drop reordering follows the same pattern established by the test steps list (TestStepList component) in the spec creation form.
- **A-005**: The "required" flag defaults to false (optional) when a new artifact requirement is added. The Admin explicitly toggles it on when needed.
- **A-006**: Execution-side behavior (tester filling in text, enforcement gating) is out of scope. This feature covers authoring-side configuration and display only.
- **A-007**: The text artifact type has no type-specific configuration fields beyond the base fields (label, description, required). The 10,000-character limit for the tester's input is an execution-time concern, not an authoring-time concern.
- **A-008**: Artifact requirements are wired into the create form only (edit does not exist yet). Schemas and value objects are defined as reusable so they carry over automatically when the edit feature is built later (same pattern as feature 012).
