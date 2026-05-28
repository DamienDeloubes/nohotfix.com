# Feature Specification: URL Artifact Requirement

**Feature Branch**: `017-url-artifact-requirement`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add the fourth optional required artifact type 'URL' to the spec configuration, as defined in docs/development/spec-configuration.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a URL Artifact Requirement to a Spec (Priority: P1)

An Admin creating a spec can add one or more URL artifact requirements to the spec's artifact requirements list. A URL artifact represents a link to external evidence (e.g. a CI pipeline run, a staging deployment, a Sentry issue, or a Loom recording). The Admin provides a label, an optional description, and a required flag. The Admin selects "URL" from the artifact type selector, which is now available alongside the existing "Text", "File", and "Checkbox" types.

**Why this priority**: This is the core capability of the feature. Without the ability to add URL artifact requirements during spec authoring, no other story delivers value.

**Independent Test**: Can be fully tested by creating a spec with one or more URL artifact requirements and verifying the requirements persist correctly through the create-and-view round trip.

**Acceptance Scenarios**:

1. **Given** an Admin is on the spec creation form, **When** they click "Add artifact requirement" and select "URL", **Then** a URL artifact requirement form section appears with fields for the label, an optional description, and a required toggle.
2. **Given** an Admin has added a URL artifact requirement with a label of "CI Pipeline URL" and a description of "Provide the GitHub Actions run URL for the main branch build", **When** they submit the spec, **Then** the spec is created with the URL artifact requirement stored in the artifact requirements list with type "url", including the label and description.
3. **Given** an Admin has added a URL artifact requirement, **When** they toggle the required flag on, **Then** the requirement is marked as required and will block spec completion during execution if the tester has not provided a valid URL.
4. **Given** an Admin has added a URL artifact requirement, **When** they toggle the required flag off, **Then** the requirement is marked as optional and will not block spec completion during execution.
5. **Given** an Admin has added URL, checkbox, file, and text artifact requirements to the same spec, **When** they submit the spec, **Then** all types are stored correctly in the artifact requirements list, each with the correct type discriminator.

---

### User Story 2 - Validate URL Artifact Requirement Fields (Priority: P1)

The system validates URL artifact requirement fields during spec creation. The label is required and limited to 200 characters. The description is optional and limited to 1,000 characters. Validation is enforced on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads).

**Why this priority**: Validation ensures data integrity and is tightly coupled with the creation flow.

**Independent Test**: Can be tested by entering values at and beyond the label and description constraints and verifying that inline errors appear, submission is prevented, and the server independently rejects out-of-bounds payloads.

**Acceptance Scenarios**:

1. **Given** an Admin has added a URL artifact requirement, **When** they leave the label empty and attempt to submit, **Then** an inline validation error is shown on the label field indicating it is required.
2. **Given** an Admin has added a URL artifact requirement, **When** they enter a label exceeding 200 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
3. **Given** an Admin has added a URL artifact requirement, **When** they enter a description exceeding 1,000 characters, **Then** an inline validation error is shown indicating the maximum length, and a character counter reflects the current length.
4. **Given** a payload is submitted via the API with a URL artifact requirement whose label exceeds 200 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.
5. **Given** a payload is submitted via the API with a URL artifact requirement whose label is empty, **When** the server processes it, **Then** the server rejects the request with a validation error.
6. **Given** a payload is submitted via the API with a URL artifact requirement whose description exceeds 1,000 characters, **When** the server processes it, **Then** the server rejects the request with a validation error.

---

### User Story 3 - Display URL Artifact Requirements on Spec Detail Page (Priority: P2)

When viewing a spec that has URL artifact requirements, the spec detail page displays them in the "Artifact Requirements" section alongside any other artifact types. Each URL requirement shows its label, type ("URL"), description (if provided), and whether it is required or optional.

**Why this priority**: Displaying URL artifact requirements allows Admins to review what they have configured. This is essential for verification but does not block the creation flow.

**Independent Test**: Can be tested by creating a spec with URL artifact requirements (with and without descriptions) and viewing the spec detail page to verify the label, description, and type indicator are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a spec has a URL artifact requirement with a description, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, description, type ("URL"), and required/optional status.
2. **Given** a spec has a URL artifact requirement without a description, **When** an Admin views the spec detail page, **Then** the requirement is displayed showing its label, type ("URL"), and required/optional status -- no empty description section is shown.
3. **Given** a spec has URL, checkbox, file, and text artifact requirements, **When** an Admin views the spec detail page, **Then** each requirement displays its correct type indicator ("URL", "Checkbox", "File", or "Text").

---

### Edge Cases

- **Label at boundary length**: 200 characters accepted; 201 rejected. A visible character counter helps the Admin stay within limits.
- **Description at boundary length**: 1,000 characters accepted; 1,001 rejected. A visible character counter helps the Admin stay within limits.
- **Whitespace-only label**: Treated as empty after trimming. Validation rejects it as missing.
- **Whitespace-only description**: Treated as empty after trimming. Normalized to null before storage.
- **Duplicate labels**: Allowed. Two URL artifact requirements may have the same label (e.g. two separate CI pipeline links for different environments).
- **Mixed artifact types**: A spec may have a combination of URL, checkbox, file, and text artifact requirements. They share the same ordered list and are subject to the same 10-item maximum.
- **All URL requirements optional**: Valid. The links are informational.
- **All URL requirements required**: Valid. The tester must provide all URLs before the spec can pass.
- **Empty description submitted via API**: Treated equivalently to omitted description. Normalized to null.
- **URL type has no type-specific configuration**: Unlike measured_value or table, the URL type has no additional fields beyond label, description, and required. It follows the same simple pattern as the text artifact type.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

**URL Artifact Requirement Type**

- **FR-001**: System MUST support the "URL" artifact requirement type, which represents a link to external evidence that the tester provides during execution.
- **FR-002**: System MUST require a label for each URL artifact requirement, between 1 and 200 characters after trimming. The label describes what URL to provide (e.g. "CI Pipeline URL").
- **FR-003**: System MUST trim leading and trailing whitespace from the label before validation and storage.
- **FR-004**: URL artifact requirements MUST support an optional description field, limited to 1,000 characters after trimming, providing guidance on what link is expected (e.g. "Provide the GitHub Actions run URL for the main branch build").
- **FR-005**: System MUST trim leading and trailing whitespace from the description before validation and storage. Empty or whitespace-only descriptions MUST be normalized to null.
- **FR-006**: System MUST support a required flag on each URL artifact requirement indicating whether the tester must provide a valid URL before the spec can be marked as passed during execution.
- **FR-007**: System MUST show a character counter on the label field.
- **FR-008**: System MUST show a character counter on the description field.

**Type Selection**

- **FR-009**: System MUST offer "URL" as a selectable option in the artifact type selector, alongside the existing "Text", "File", and "Checkbox" options.
- **FR-010**: System MUST display an appropriate icon or visual indicator to distinguish the "URL" type from other types in both the creation form and the spec detail page.

**Display**

- **FR-011**: System MUST display URL artifact requirements on the spec detail page showing label, type ("URL"), description (if provided), and required/optional status.
- **FR-012**: System MUST NOT display an empty description section for URL artifact requirements that have no description.
- **FR-013**: System MUST display the correct type indicator ("URL") to visually distinguish URL requirements from other artifact types.

**Validation**

- **FR-014**: System MUST enforce all URL artifact requirement validation rules on both the frontend (inline errors, preventing submission) and the backend (rejecting invalid payloads with appropriate error codes).
- **FR-015**: System MUST show inline validation errors adjacent to the relevant field within the URL artifact requirement form section.

### Key Entities

- **URL Artifact Requirement**: An artifact requirement of type "url" with no type-specific configuration fields. It has a label (required), an optional description, and a required flag. During execution, the tester provides a URL which the system validates as a valid URL format -- no pattern restrictions are enforced. The system validates format only; it does not check URL reachability.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can add URL artifact requirements to a spec and see them persist correctly through the create-and-view round trip, including label, description, and required status.
- **SC-002**: 100% of spec creation attempts with invalid URL artifact requirement fields (empty label, label > 200 chars, description > 1,000 chars) are rejected by both client-side and server-side validation independently.
- **SC-003**: Character counters are visible on both the label and description fields, updating in real time as the Admin types.
- **SC-004**: The spec detail page displays URL artifact requirements with the correct "URL" type indicator, labels, descriptions (when present), and required/optional status.
- **SC-005**: Admins can mix URL, checkbox, file, and text artifact requirements in the same spec, with each type correctly identified and persisted.
- **SC-006**: The URL artifact requirement form section shows a label field, a description field, and a required toggle.

## Assumptions

- **A-001**: The artifact requirements foundation (add, remove, reorder, validate base fields, 10-item limit, drag-and-drop) was established in feature 014 (Text Artifact Requirement). This feature extends that foundation by adding the "url" variant to the discriminated union -- it does not re-implement list management.
- **A-002**: The `spec_library.artifact_requirements` JSONB column already exists (confirmed in 001_initial_schema migration). No database migration is required.
- **A-003**: The artifact requirements Zod schema is a discriminated union on the `type` field. This feature adds the "url" variant alongside the existing "text", "file", and "checkbox" variants.
- **A-004**: The URL artifact type has no type-specific configuration fields. The `UrlArtifactRequirement` interface extends `BaseArtifactRequirement` with only `type: 'url'`. It includes the optional description from the base, unlike checkbox which excludes it.
- **A-005**: The "required" flag defaults to false (optional) when a new URL artifact requirement is added, consistent with other artifact type behavior.
- **A-006**: Execution-side behavior (tester providing a URL, system validating URL format, enforcement gating) is out of scope. This feature covers authoring-side configuration and display only.
- **A-007**: This feature targets the create form only (edit does not exist yet), consistent with the pattern established in features 014, 015, and 016.
- **A-008**: URL format validation during execution (not authoring) will validate that the provided value is a syntactically valid URL. No pattern restrictions (e.g. requiring specific domains) are applied. URL reachability is not checked.
