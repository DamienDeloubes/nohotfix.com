# Feature Specification: Checkbox Artifact Requirement

**Feature Branch**: `016-checkbox-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add the third optional required artifact type 'Checkbox' to the spec configuration, as defined in docs/development/spec-configuration.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a Checkbox Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more checkbox artifact requirements to the spec's artifact requirements list. A checkbox is a simple boolean confirmation -- the label itself is the confirmation statement (e.g. "I ran the E2E tests for the NKC funnels"). The Admin provides a label and a required flag. There is no description field for checkbox requirements because the label serves as both the identifier and the guidance. The Admin selects "Checkbox" from the artifact type selector, which is now available alongside the existing "Text" and "File" types.

**Why this priority**: This is the core capability of the feature. Without the ability to add checkbox artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more checkbox artifact requirements and verifying the requirements persist correctly through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "Checkbox", **Then** a checkbox artifact requirement form section appears with a field for the label and a required toggle -- no description field is shown.
2. **Given** an Admin has added a checkbox artifact requirement with a label of "I verified this in staging", **When** they submit the spec, **Then** the spec is created with the checkbox artifact requirement stored in the artifact requirements list with type "checkbox".
3. **Given** an Admin has added a checkbox artifact requirement, **When** they toggle the required flag on, **Then** the requirement is marked as required and will block spec completion during execution if the tester has not checked the checkbox.
4. **Given** an Admin has added a checkbox artifact requirement, **When** they toggle the required flag off, **Then** the requirement is marked as optional and will not block spec completion during execution.
5. **Given** an Admin has added checkbox, file, and text artifact requirements to the same spec, **When** they submit the spec, **Then** all types are stored correctly in the artifact requirements list, each with the correct type discriminator.

---

### User Story 2 - Validate Checkbox Artifact Requirement Fields (Priority: P1)

The system validates checkbox artifact requirement fields during spec creation. The label is required and limited to 200 characters. There is no description field to validate. Validation is enforced on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads).

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow.

**Independent Test**: Can be tested by entering values at and beyond the label constraint and verifying that inline errors appear, submission is prevented, and the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a checkbox artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a checkbox artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** a payload is submitted via the API with a checkbox artifact requirement whose label exceeds 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.
4. **Given** a payload is submitted via the API with a checkbox artifact requirement whose label is empty, **When** the server processes it, **Then** the server rejects the request with a validation error.
5. **Given** a payload is submitted via the API with a checkbox artifact requirement that includes a description field, **When** the server processes it, **Then** the server ignores the description field (checkbox requirements do not have descriptions).

---

### User Story 3 - Display Checkbox Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has checkbox artifact requirements, the spec detail page displays them in the "Artifact Requirements" section alongside any other artifact types. Each checkbox requirement shows its label, type ("Checkbox"), and whether it is required or optional. No description is displayed because checkbox requirements do not have one.

**Why this priority**: Displaying checkbox artifact requirements allows Admins to review what they have configured. This is essential for verification but does not block the creation flow.

**Independent Test**: Can be tested by creating a spec with checkbox artifact requirements and viewing the spec detail page to verify the label and type indicator are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a spec has a checkbox artifact requirement, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, type ("Checkbox"), and required/optional status.
2. **Given** a spec has checkbox, file, and text artifact requirements, **When** an Admin views the spec detail page, **Then** each requirement displays its correct type indicator ("Checkbox", "File", or "Text").
3. **Given** a checkbox artifact requirement is displayed, **When** the Admin reviews it, **Then** no description section is shown (checkbox requirements have no description).

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Duplicate labels**: Allowed. Two checkbox artifact requirements may have the same label (e.g. two separate confirmation statements for different environments).
- **Mixed artifact types**: A spec may have a combination of checkbox, file, and text artifact requirements. They share the same ordered list and are subject to the same 10-item maximum.
- **All checkbox requirements optional**: Valid. The confirmations are informational.
- **All checkbox requirements required**: Valid. The tester must check all boxes before the spec can pass.
- **Description field in API payload**: If a description field is included in a checkbox artifact requirement payload, the server ignores it. Checkbox requirements do not persist descriptions.
- **Checkbox type has no type-specific configuration**: Unlike measured_value or table, the checkbox type has no additional fields beyond label and required. It is the simplest artifact type.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**Checkbox Artifact Requirement Type**

- **FR-001**: System MUST support the "Checkbox" artifact requirement type, which represents a boolean confirmation that the tester checks during execution.
- **FR-002**: System MUST require a label for each checkbox artifact requirement, between 1 and 200 characters after trimming. The label is the confirmation statement itself (e.g. "I verified this in staging").
- **FR-003**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-004**: Checkbox artifact requirements MUST NOT have a description field. The label serves as both the identifier and the guidance.
- **FR-005**: System MUST support a required flag on each checkbox artifact requirement indicating whether the tester must check the checkbox before the spec can be marked as passed during execution.
- **FR-006**: System MUST show a character counter on the label field.

**Type Selection**

- **FR-007**: System MUST offer "Checkbox" as a selectable option in the artifact type selector, alongside the existing "Text" and "File" options.
- **FR-008**: System MUST display an appropriate icon or visual indicator to distinguish the "Checkbox" type from other types in both the creation form and the spec detail page.

**Display**

- **FR-009**: System MUST display checkbox artifact requirements on the spec detail page showing label, type ("Checkbox"), and required/optional status.
- **FR-010**: System MUST NOT display a description section for checkbox artifact requirements on the spec detail page.
- **FR-011**: System MUST display the correct type indicator ("Checkbox") to visually distinguish checkbox requirements from other artifact types.

**Validation**

- **FR-012**: System MUST enforce all checkbox artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-013**: System MUST show inline validation errors adjacent to the label field within the checkbox artifact requirement form section.

### Key Entities

- **Checkbox Artifact Requirement**: An artifact requirement of type "checkbox" with no type-specific configuration fields and no description field. The label is the confirmation statement. During execution, the tester checks the checkbox (boolean true) to satisfy the requirement. The checkbox must be checked (true) for a required checkbox artifact to be considered fulfilled.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add checkbox artifact requirements to a spec and see them persist correctly through the create-and-view round trip.
- **SC-002**: 100% of spec creation attempts with invalid checkbox artifact requirement fields (empty label, label > 200 chars) are rejected by both client-side and server-side validation independently.
- **SC-003**: A character counter is visible on the label field, updating in real time as the Admin types.
- **SC-004**: The spec detail page displays checkbox artifact requirements with the correct "Checkbox" type indicator, labels, and required/optional status -- with no description section shown.
- **SC-005**: Admins can mix checkbox, file, and text artifact requirements in the same spec, with each type correctly identified and persisted.
- **SC-006**: The checkbox artifact requirement form section shows only a label field and required toggle -- no description field is present.

## Assumptions

- **A-001**: The artifact requirements foundation (add, remove, reorder, validate base fields, 10-item limit, drag-and-drop) was established in feature 014 (Text Artifact Requirement). This feature extends that foundation by adding the "checkbox" variant to the discriminated union -- it does not re-implement list management.
- **A-002**: The `spec_library.artifact_requirements` JSONB column already exists (confirmed in 001_initial_schema migration). No database migration is required.
- **A-003**: The artifact requirements Zod schema is a discriminated union on the `type` field. This feature adds the "checkbox" variant alongside the existing "text" and "file" variants.
- **A-004**: The checkbox artifact type has no type-specific configuration fields. The `CheckboxArtifactRequirement` interface extends `BaseArtifactRequirement` with only `type: 'checkbox'` and explicitly excludes the optional description field present in the base.
- **A-005**: The "required" flag defaults to false (optional) when a new checkbox artifact requirement is added, consistent with other artifact type behavior.
- **A-006**: Execution-side behavior (tester checking the checkbox, enforcement gating requiring `true` value) is out of scope. This feature covers authoring-side configuration and display only.
- **A-007**: This feature targets the create form only (edit does not exist yet), consistent with the pattern established in features 014 and 015.
- **A-008**: When a checkbox artifact requirement is submitted via the API with a description field present, the server silently strips the description rather than rejecting the payload. This provides forward-compatibility if clients include it by mistake.
