# Feature Specification: Measured Value Artifact Requirement

**Feature Branch**: `019-measured-value-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add the final optional required artifact type 'measured_value' to the spec configuration, as defined in docs/development/spec-configuration.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a Measured Value Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more measured value artifact requirements to the spec's artifact requirements list. A measured value represents a numeric measurement with an expected value and optional tolerance for visual pass/fail indication (e.g. "Homepage API response time" expecting 200ms with +/-10% tolerance). The Admin selects "Measured Value" from the artifact type selector, which is now available alongside the existing "Text", "File", "Checkbox", and "URL" types.

After selecting "Measured Value", the Admin sees additional type-specific fields beyond the standard label, description, and required toggle: a unit selector (from a fixed set: ms, s, %, MB, GB, req/s), an expected value numeric input, an optional tolerance percentage, and an optional tolerance description explaining where the baseline comes from.

**Why this priority**: This is the core capability of the feature. Without the ability to add measured value artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more measured value artifact requirements (with and without tolerance) and verifying the requirements persist correctly through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "Measured Value", **Then** a measured value artifact requirement form section appears with fields for label, optional description, required toggle, unit selector, expected value, optional tolerance percentage, and optional tolerance description.
2. **Given** an Admin has added a measured value artifact requirement with label "Homepage API response time", unit "ms", expected value 200, tolerance percentage 10, and tolerance description "Based on last quarter's P95 average", **When** they submit the spec, **Then** the spec is created with the measured value artifact requirement stored correctly with all configured fields.
3. **Given** an Admin has added a measured value artifact requirement with label "Error rate" and unit "%" and expected value 0.5 but no tolerance, **When** they submit the spec, **Then** the requirement is stored with tolerancePercentage and toleranceDescription as null.
4. **Given** an Admin has added a measured value artifact requirement, **When** they toggle the required flag on, **Then** the requirement is marked as required and will block spec completion during execution if the tester has not provided a measured value.
5. **Given** an Admin has added a measured value artifact requirement, **When** they toggle the required flag off, **Then** the requirement is marked as optional and will not block spec completion during execution.
6. **Given** an Admin has added measured value, URL, checkbox, file, and text artifact requirements to the same spec, **When** they submit the spec, **Then** all types are stored correctly in the artifact requirements list, each with the correct type discriminator.

---

### User Story 2 - Validate Measured Value Artifact Requirement Fields (Priority: P1)

The system validates all measured value artifact requirement fields during spec creation. The label is required (1-200 characters). The description is optional (max 1,000 characters). The unit is required and must be one of the fixed set. The expected value is required and must be a finite number. The tolerance percentage is optional but when provided must be a positive finite number. The tolerance description is optional (max 1,000 characters) and only relevant when a tolerance percentage is set. Validation is enforced on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads).

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow.

**Independent Test**: Can be tested by entering values at and beyond field constraints and verifying that inline errors appear, submission is prevented, and the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a measured value artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a measured value artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** an Admin has added a measured value artifact requirement, **When** they enter a description exceeding 1,000 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
4. **Given** an Admin has added a measured value artifact requirement, **When** they do not select a unit, **Then** an inline validation error is shown indicating the unit is required.
5. **Given** an Admin has added a measured value artifact requirement, **When** they leave the expected value empty, **Then** an inline validation error is shown indicating the expected value is required.
6. **Given** an Admin has added a measured value artifact requirement, **When** they enter a non-numeric value in the expected value field, **Then** an inline validation error is shown indicating a valid number is required.
7. **Given** an Admin has added a measured value artifact requirement, **When** they enter a negative tolerance percentage, **Then** an inline validation error is shown indicating the tolerance must be a positive number.
8. **Given** an Admin has added a measured value artifact requirement, **When** they enter a tolerance percentage of 0, **Then** an inline validation error is shown indicating the tolerance must be greater than zero.
9. **Given** a payload is submitted via the API with a measured value artifact requirement whose label exceeds 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.
10. **Given** a payload is submitted via the API with a measured value artifact requirement missing the unit field, **When** the server processes it, **Then** the server rejects the request with a validation error.
11. **Given** a payload is submitted via the API with a measured value artifact requirement whose unit is not in the allowed set, **When** the server processes it, **Then** the server rejects the request with a validation error.
12. **Given** a payload is submitted via the API with a measured value artifact requirement whose expected value is NaN or Infinity, **When** the server processes it, **Then** the server rejects the request with a validation error.
13. **Given** a payload is submitted via the API with a measured value artifact requirement whose tolerance percentage is negative or zero, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 3 - Display Measured Value Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has measured value artifact requirements, the spec detail page displays them in the "Artifact Requirements" section alongside any other artifact types. Each measured value requirement shows its label, type ("Measured Value"), unit, expected value, tolerance (if configured), tolerance description (if provided), description (if provided), and whether it is required or optional.

**Why this priority**: Displaying measured value artifact requirements allows Admins to review what they have configured. This is essential for verification but does not block the creation flow.

**Independent Test**: Can be tested by creating a spec with measured value artifact requirements (with and without tolerance, with and without descriptions) and viewing the spec detail page to verify all fields are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a spec has a measured value artifact requirement with label "API response time", unit "ms", expected value 200, tolerance percentage 10, and tolerance description "P95 baseline", **When** an Admin views the spec detail page, **Then** the requirement displays all fields: label, type ("Measured Value"), unit, expected value, tolerance percentage, tolerance description, and required/optional status.
2. **Given** a spec has a measured value artifact requirement without tolerance configured, **When** an Admin views the spec detail page, **Then** the requirement displays label, type, unit, expected value, and required/optional status -- no tolerance section is shown.
3. **Given** a spec has a measured value artifact requirement without a description, **When** an Admin views the spec detail page, **Then** no empty description section is shown.
4. **Given** a spec has measured value, URL, checkbox, file, and text artifact requirements, **When** an Admin views the spec detail page, **Then** each requirement displays its correct type indicator.

---

### User Story 4 - Conditional Tolerance Description Field (Priority: P3)

The tolerance description field is only relevant when a tolerance percentage is configured. The form adapts to show or hide the tolerance description based on whether a tolerance percentage has been entered, reducing clutter when tolerance is not used.

**Why this priority**: This is a UX refinement that improves the authoring experience but is not required for basic functionality.

**Independent Test**: Can be tested by toggling the tolerance percentage field between empty and populated states and verifying the tolerance description field appears/disappears accordingly.

**Acceptance Scenarios**:

1. **Given** an Admin has added a measured value artifact requirement, **When** the tolerance percentage field is empty, **Then** the tolerance description field is hidden.
2. **Given** an Admin has added a measured value artifact requirement, **When** they enter a tolerance percentage value, **Then** the tolerance description field becomes visible.
3. **Given** an Admin has entered both a tolerance percentage and tolerance description, **When** they clear the tolerance percentage field, **Then** the tolerance description field is hidden and its value is cleared.

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter helps the Admin stay within limits.
- **Tolerance description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter helps the Admin stay within limits.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only description**: Treated as empty after trimming. Normalized to null before storage.
- **Whitespace-only tolerance description**: Treated as empty after trimming. Normalized to null before storage.
- **Duplicate labels**: Allowed. Two measured value artifact requirements may have the same label.
- **Mixed artifact types**: A spec may have a combination of measured value, URL, checkbox, file, and text artifact requirements. They share the same ordered list and are subject to the same 10-item maximum.
- **Expected value of zero**: Valid. Zero is a legitimate expected value (e.g. 0% error rate).
- **Negative expected value**: Valid. Negative numbers are legitimate expected values (e.g. temperature readings, relative changes).
- **Very large expected value**: Valid as long as it is a finite number. The system does not impose min/max bounds on the expected value.
- **Decimal expected value**: Valid. The field accepts floating-point numbers (e.g. 0.5% error rate, 99.9% uptime).
- **Tolerance percentage of 100 or above**: Valid. A tolerance of 100 means the measured value can be anywhere from 0 to 2x the expected value. Values above 100 are uncommon but not prohibited.
- **Tolerance without tolerance description**: Valid. The description is optional context.
- **Tolerance description without tolerance**: Not possible via the UI (field is hidden). If submitted via API, the tolerance description is silently discarded since it has no meaning without a tolerance percentage.
- **All measured value requirements optional**: Valid. The measurements are informational.
- **All measured value requirements required**: Valid. The tester must provide all measured values before the spec can pass.
- **Unit display**: The unit is displayed alongside the expected value in the detail view (e.g. "200 ms", "99.9 %", "1,000 req/s") for clarity.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**Measured Value Artifact Requirement Type**

- **FR-001**: System MUST support the "measured_value" artifact requirement type, which represents a numeric measurement with an expected value and optional tolerance for visual pass/fail indication during execution.
- **FR-002**: System MUST require a label for each measured value artifact requirement, between 1 and 200 characters after trimming. The label describes what is being measured (e.g. "Homepage API response time").
- **FR-003**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-004**: Measured value artifact requirements MUST support an optional description field, limited to 1,000 characters after trimming, providing guidance on what should be measured and how.
- **FR-005**: System MUST trim leading and trailing whitespace from the description before validation and storage. Empty or whitespace-only descriptions MUST be normalized to null.
- **FR-006**: System MUST support a required flag on each measured value artifact requirement indicating whether the tester must provide a measured value before the spec can be marked as passed during execution.

**Type-Specific Fields**

- **FR-007**: System MUST require a unit for each measured value artifact requirement, selected from a fixed set: ms, s, %, MB, GB, req/s.
- **FR-008**: System MUST present the unit as a dropdown/selector with the six allowed values. No free-text entry for units.
- **FR-009**: System MUST require an expected value for each measured value artifact requirement. The expected value must be a finite number (not NaN, not Infinity). Zero, negative numbers, and decimal values are all valid.
- **FR-010**: Measured value artifact requirements MUST support an optional tolerance percentage. When provided, it must be a positive finite number greater than zero.
- **FR-011**: Measured value artifact requirements MUST support an optional tolerance description, limited to 1,000 characters after trimming, explaining where the tolerance baseline comes from (e.g. "Based on last quarter's P95 average").
- **FR-012**: System MUST trim leading and trailing whitespace from the tolerance description before validation and storage. Empty or whitespace-only tolerance descriptions MUST be normalized to null.
- **FR-013**: When a tolerance percentage is not set, the tolerance description MUST be discarded (normalized to null) regardless of what value was provided.

**Character Counters**

- **FR-014**: System MUST show a character counter on the label field.
- **FR-015**: System MUST show a character counter on the description field.
- **FR-016**: System MUST show a character counter on the tolerance description field (when visible).

**Type Selection**

- **FR-017**: System MUST offer "Measured Value" as a selectable option in the artifact type selector, alongside the existing "Text", "File", "Checkbox", and "URL" options.
- **FR-018**: System MUST display a distinct color badge (rose/pink) to distinguish the "Measured Value" type from other artifact types in the spec detail page, consistent with the existing badge pattern (Text=indigo, File=blue, Checkbox=green, URL=amber, Table=purple).

**Conditional UI**

- **FR-019**: System MUST hide the tolerance description field when no tolerance percentage is entered.
- **FR-020**: System MUST show the tolerance description field when a tolerance percentage is entered.
- **FR-021**: System MUST clear the tolerance description value when the tolerance percentage is removed.

**Display**

- **FR-022**: System MUST display measured value artifact requirements on the spec detail page showing label, type ("Measured Value"), unit, expected value, tolerance percentage (if configured), tolerance description (if provided), description (if provided), and required/optional status.
- **FR-023**: System MUST NOT display an empty description section for measured value artifact requirements that have no description.
- **FR-024**: System MUST NOT display tolerance information for measured value artifact requirements that have no tolerance configured.
- **FR-025**: System MUST display the unit alongside the expected value for clarity (e.g. "200 ms", "99.9 %").

**Validation**

- **FR-026**: System MUST enforce all measured value artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-027**: System MUST show inline validation errors adjacent to the relevant field within the measured value artifact requirement form section.

### Key Entities

- **Measured Value Artifact Requirement**: An artifact requirement of type "measured_value" with type-specific configuration fields: unit (required, from fixed set), expectedValue (required, finite number), tolerancePercentage (optional, positive number), and toleranceDescription (optional, max 1,000 chars). It also has a label (required), optional description, and required flag from the base. During execution, the tester provides a measuredValue (finite number). When tolerance is configured, the system shows a green/red color indicator based on whether the measured value falls within the tolerance range. Out-of-tolerance values are informational warnings only -- they do not block the tester from passing or failing the spec.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add measured value artifact requirements to a spec and see them persist correctly through the create-and-view round trip, including all type-specific fields (unit, expected value, tolerance percentage, tolerance description).
- **SC-002**: 100% of spec creation attempts with invalid measured value artifact requirement fields (empty label, missing unit, invalid unit, missing expected value, non-finite expected value, non-positive tolerance percentage) are rejected by both client-side and server-side validation independently.
- **SC-003**: Character counters are visible on the label, description, and tolerance description fields, updating in real time as the Admin types.
- **SC-004**: The spec detail page displays measured value artifact requirements with the correct "Measured Value" type indicator, unit, expected value, tolerance information (when configured), and required/optional status.
- **SC-005**: Admins can mix measured value, URL, checkbox, file, and text artifact requirements in the same spec, with each type correctly identified and persisted.
- **SC-006**: The tolerance description field is hidden when no tolerance percentage is entered and appears when a tolerance percentage is provided.

## Assumptions

- **A-001**: The artifact requirements foundation (add, remove, reorder, validate base fields, 10-item limit, drag-and-drop) was established in feature 014 (Text Artifact Requirement). This feature extends that foundation by adding the "measured_value" variant to the discriminated union -- it does not re-implement list management.
- **A-002**: The `spec_library.artifact_requirements` JSONB column already exists (confirmed in 001_initial_schema migration). No database migration is required.
- **A-003**: The artifact requirements Zod schema is a discriminated union on the `type` field. This feature adds the "measured_value" variant alongside the existing "text", "file", "checkbox", and "url" variants.
- **A-004**: The "required" flag defaults to false (optional) when a new measured value artifact requirement is added, consistent with other artifact type behavior.
- **A-005**: Execution-side behavior (tester providing a measured value, green/red tolerance display, out-of-tolerance warnings in run overview and go/no-go decision screen) is out of scope. This feature covers authoring-side configuration and display only.
- **A-006**: This feature targets the create form only (edit does not exist yet), consistent with the pattern established in features 014-018.
- **A-007**: The fixed unit set (ms, s, %, MB, GB, req/s) is not configurable by the Admin. If additional units are needed in the future, they will be added to the system-level fixed set.
- **A-008**: This is the final artifact type to be added to the spec configuration. After this feature, all six types defined in docs/development/spec-configuration.md (file, text, checkbox, url, measured_value, table) will be available.
