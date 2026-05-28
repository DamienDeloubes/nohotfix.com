# Research: URL Artifact Requirement

**Feature**: 017-url-artifact-requirement
**Date**: 2026-03-10

## No Unknowns

The URL artifact type introduces no technical unknowns. It follows the exact same pattern as the text artifact type (label + optional description + required flag) and all patterns are established by features 014 (text), 015 (file), and 016 (checkbox).

## Decision Log

### D-001: URL type mirrors text artifact structure

**Decision**: The `UrlArtifactRequirementSchema` includes `label`, `description` (optional), and `required` — identical to the text and file artifact types.

**Rationale**: Per `docs/development/spec-configuration.md`, the URL artifact has a label, optional description, and required flag. No type-specific configuration fields. This makes it structurally identical to the text artifact type.

**Alternatives considered**:

- Add URL-specific fields (e.g., URL pattern validation): Rejected — the spec-configuration.md explicitly states "no pattern restrictions" for URL validation. URL format validation happens at execution time (when the tester provides a URL), not at authoring time.

### D-002: Reuse existing error codes

**Decision**: No new error codes. URL validation reuses `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.

**Rationale**: The URL type has no type-specific validation beyond label (via `ArtifactLabel` value object) and description (via `ArtifactDescription` value object). Both are shared with text and file types. The `ArtifactRequirements.create()` factory already handles unknown types via `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. Adding the URL case to the discriminator is sufficient.

**Alternatives considered**:

- New `AUTHOR_URL_*` error codes: Rejected — no URL-specific error scenarios exist at authoring time.

### D-003: Form component structure

**Decision**: Create a `UrlArtifactForm.tsx` component with label input, description textarea, and required toggle — matching the text artifact form layout.

**Rationale**: URL artifact requirements have the same form fields as text artifacts. The placeholder text will differ (e.g., label: "e.g. CI Pipeline URL", description: "e.g. Provide the GitHub Actions run URL for the main branch build") to guide authors toward URL-appropriate labels.

**Alternatives considered**:

- Reuse `TextArtifactForm` with a prop for type label: Rejected — while structurally similar, a dedicated component is cleaner and consistent with the pattern established for all other types. Each type has its own form component with appropriate placeholder text.

### D-004: Display type badge color

**Decision**: Use a distinct color for the "URL" badge in `ArtifactRequirementsDisplay.tsx`, differentiating it from "Text" (indigo), "File" (blue), and "Checkbox" (green).

**Rationale**: Visual distinction helps authors quickly identify artifact types in the list. A warm color like amber/orange is a natural choice for URL/link semantics, as it's the remaining unused color in the palette.

**Alternatives considered**:

- Same color as text: Rejected — defeats the purpose of type badges.

### D-005: No URL validation at authoring time

**Decision**: The authoring form does not validate that the label or description contain valid URLs. URL format validation only applies at execution time when the tester provides the actual URL value.

**Rationale**: The label is a description of what URL to provide (e.g., "CI Pipeline URL"), not a URL itself. The description is guidance text. Neither field should contain a URL at authoring time.

**Alternatives considered**:

- Validate label contains "URL": Rejected — unnecessary restriction. Authors should have freedom in naming.
