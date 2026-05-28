# Feature Specification: File Artifact Requirement

**Feature Branch**: `015-file-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add a new artifact type 'File' to the spec configuration, as defined in docs/development/spec-configuration.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a File Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more file artifact requirements to the spec's artifact requirements list. For each file requirement, the Admin provides a label describing what file the tester should upload (e.g. "Screenshot of the confirmation page"), an optional description with guidance for the tester, and a required flag indicating whether the tester must upload a file before the spec can be marked as passed. The Admin selects "File" from the artifact type selector, which is now available alongside the existing "Text" type.

**Why this priority**: This is the core capability of the feature. Without the ability to add file artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more file artifact requirements and verifying the requirements persist correctly through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "File", **Then** a file artifact requirement form section appears with fields for label, description, and a required toggle.
2. **Given** an Admin has added a file artifact requirement with a label of "Screenshot of the confirmation page", **When** they submit the spec, **Then** the spec is created with the file artifact requirement stored in the artifact requirements list with type "file".
3. **Given** an Admin has added a file artifact requirement, **When** they toggle the required flag on, **Then** the requirement is marked as required and will block spec completion during execution if no file is uploaded.
4. **Given** an Admin has added a file artifact requirement, **When** they toggle the required flag off, **Then** the requirement is marked as optional and will not block spec completion during execution.
5. **Given** an Admin has added both file and text artifact requirements to the same spec, **When** they submit the spec, **Then** both types are stored correctly in the artifact requirements list, each with the correct type discriminator.

---

### User Story 2 - Validate File Artifact Requirement Fields (Priority: P1)

The system validates file artifact requirement fields during spec creation. The label is required and limited to 200 characters. The description is optional and limited to 1,000 characters. Validation is enforced on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads). These validation rules are identical to the base artifact requirement rules established by the text artifact type.

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow.

**Independent Test**: Can be tested by entering values at and beyond each field's constraints and verifying that inline errors appear, submission is prevented, and the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a file artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a file artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** an Admin has added a file artifact requirement, **When** they enter a description exceeding 1,000 characters, **Then** an inline validation error is shown on the description field indicating the maximum length.
4. **Given** an Admin has added a file artifact requirement with a valid label and no description, **When** they submit the spec, **Then** the spec is created successfully (description is optional).
5. **Given** a payload is submitted via the API with a file artifact requirement whose label exceeds 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 3 - Display File Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has file artifact requirements, the spec detail page displays them in the "Artifact Requirements" section alongside any other artifact types. Each file requirement shows its label, description (if provided), type ("File"), and whether it is required or optional.

**Why this priority**: Displaying file artifact requirements allows Admins to review what they have configured. This is essential for verification but does not block the creation flow.

**Independent Test**: Can be tested by creating a spec with file artifact requirements and viewing the spec detail page to verify all fields are displayed correctly with the "File" type indicator.

**Acceptance Scenarios**:

1. **Given** a spec has a file artifact requirement, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, type ("File"), and required/optional status.
2. **Given** a file artifact requirement has a description, **When** it is displayed on the spec detail page, **Then** the description is shown alongside the label.
3. **Given** a file artifact requirement has no description, **When** it is displayed on the spec detail page, **Then** no description placeholder or empty section is shown.
4. **Given** a spec has both file and text artifact requirements, **When** an Admin views the spec detail page, **Then** each requirement displays its correct type indicator ("File" or "Text").

---

### User Story 4 - Communicate File Upload Constraints to the Author (Priority: P2)

When an Admin adds a file artifact requirement, the form communicates that file uploads are subject to system-enforced constraints (10 MB max file size and a global set of allowed file extensions). These constraints are not configurable per requirement -- they are informational context so the Admin understands what the tester will experience.

**Why this priority**: Informing the author about upload constraints reduces confusion and helps them write better guidance in the description field. However, the constraints themselves are system-global and do not change the authoring data model.

**Independent Test**: Can be tested by adding a file artifact requirement and verifying that the constraint information is displayed in the form.

**Acceptance Scenarios**:

1. **Given** an Admin has added a file artifact requirement, **When** the form section is displayed, **Then** a note is shown indicating the system-enforced file size limit (10 MB) and that only certain file types are accepted.
2. **Given** an Admin reads the constraint note, **When** they write a description for the requirement, **Then** they can provide additional guidance specific to their use case (e.g. "Upload a PNG screenshot").

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter is shown.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only description**: Treated as empty after trimming. Stored as null.
- **Duplicate labels**: Allowed. Two file artifact requirements may have the same label.
- **Mixed artifact types**: A spec may have a combination of file and text artifact requirements. They share the same ordered list and are subject to the same 10-item maximum.
- **All file requirements optional**: Valid. The artifacts are informational.
- **All file requirements required**: Valid. The tester must upload all files before the spec can pass.
- **File type has no type-specific configuration**: Unlike measured_value or table, the file type has no additional fields beyond the base (label, description, required). File size limits and allowed extensions are system-global, not configurable per requirement.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**File Artifact Requirement Type**

- **FR-001**: System MUST support the "File" artifact requirement type, which requires the tester to upload a file during execution as evidence.
- **FR-002**: System MUST require a label for each file artifact requirement, between 1 and 200 characters after trimming.
- **FR-003**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-004**: System MUST support an optional description field on file artifact requirements, limited to 1,000 characters.
- **FR-005**: System MUST trim leading and trailing whitespace from the description before validation and storage. Whitespace-only descriptions are normalised to null.
- **FR-006**: System MUST support a required flag on each file artifact requirement indicating whether the tester must upload a file before the spec can be marked as passed during execution.
- **FR-007**: System MUST show a character counter on the label field.
- **FR-008**: System MUST show a character counter on the description field.

**Type Selection**

- **FR-009**: System MUST offer "File" as a selectable option in the artifact type selector, alongside the existing "Text" option.
- **FR-010**: System MUST display an appropriate icon or visual indicator to distinguish the "File" type from other types in both the creation form and the spec detail page.

**Constraint Communication**

- **FR-011**: System MUST display a note on the file artifact requirement form section informing the Admin that file uploads are subject to a system-enforced 10 MB size limit and a global set of allowed file extensions.
- **FR-012**: The constraint note MUST be informational only and not introduce any author-configurable fields for file size or extension restrictions.

**Display**

- **FR-013**: System MUST display file artifact requirements on the spec detail page showing label, type ("File"), required/optional status, and description (if provided).
- **FR-014**: System MUST display the correct type indicator ("File") to visually distinguish file requirements from other artifact types.

**Validation**

- **FR-015**: System MUST enforce all file artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-016**: System MUST show inline validation errors adjacent to the offending field within the file artifact requirement form section.

### Key Entities

- **File Artifact Requirement**: An artifact requirement of type "file" with no type-specific configuration fields beyond the base fields (label, description, required). File upload constraints (10 MB max size, allowed extensions) are system-global and not stored per requirement. During execution, the tester uploads a file via a presigned URL to satisfy the requirement.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add file artifact requirements to a spec and see them persist correctly through the create-and-view round trip.
- **SC-002**: 100% of spec creation attempts with invalid file artifact requirement fields (empty label, label > 200 chars, description > 1,000 chars) are rejected by both client-side and server-side validation independently.
- **SC-003**: Character counters are visible on label and description fields, updating in real time as the Admin types.
- **SC-004**: The spec detail page displays file artifact requirements with the correct "File" type indicator, labels, descriptions, and required/optional status.
- **SC-005**: Admins can mix file and text artifact requirements in the same spec, with each type correctly identified and persisted.
- **SC-006**: The file artifact requirement form section displays the system-enforced upload constraint note (10 MB, allowed extensions).

## Assumptions

- **A-001**: The artifact requirements foundation (add, remove, reorder, validate base fields, 10-item limit, drag-and-drop) was established in feature 014 (Text Artifact Requirement). This feature extends that foundation by adding the "file" variant to the discriminated union -- it does not re-implement list management.
- **A-002**: The `spec_library.artifact_requirements` JSONB column already exists (confirmed in 001_initial_schema migration). No database migration is required.
- **A-003**: The artifact requirements Zod schema is a discriminated union on the `type` field. This feature adds the "file" variant alongside the existing "text" variant.
- **A-004**: The file artifact type has no type-specific configuration fields. The `FileArtifactRequirement` interface extends `BaseArtifactRequirement` with only `type: 'file'`.
- **A-005**: File upload constraints (10 MB max, allowed extensions) are system-global constants. They are not stored in the artifact requirement and are not configurable by the author.
- **A-006**: Execution-side behavior (presigned URL generation, file upload, file storage, file size/extension enforcement) is out of scope. This feature covers authoring-side configuration and display only.
- **A-007**: The "required" flag defaults to false (optional) when a new file artifact requirement is added, consistent with the text artifact type behavior.
- **A-008**: This feature targets the create form only (edit does not exist yet), consistent with the pattern established in feature 014.
