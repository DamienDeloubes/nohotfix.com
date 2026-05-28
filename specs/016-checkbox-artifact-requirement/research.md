# Research: Checkbox Artifact Requirement

**Feature**: 016-checkbox-artifact-requirement
**Date**: 2026-03-10

## No Unknowns

The checkbox artifact type is the simplest in the system and introduces no technical unknowns. All patterns are established by features 014 (text) and 015 (file).

## Decision Log

### D-001: No description field on checkbox schema

**Decision**: The `CheckboxArtifactRequirementSchema` omits the `description` field entirely (not optional — absent).

**Rationale**: Per the spec-configuration.md, checkbox's label IS the confirmation statement. A description would be redundant. The base `BaseArtifactRequirement` interface in spec-configuration.md has `description?: string`, but the `CheckboxArtifactRequirement` interface explicitly does not include it. The Zod schema should not accept a description field.

**Alternatives considered**:
- Accept and strip description: Rejected — cleaner to not accept it at all in the schema. If a client sends `description`, Zod's `.strip()` (default behavior for object schemas) will silently drop it. No need for explicit stripping logic.

### D-002: Reuse existing error codes

**Decision**: No new error codes. Checkbox validation reuses `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.

**Rationale**: The checkbox type has no type-specific validation beyond the label (which uses `ArtifactLabel` value object, same as text/file). The `ArtifactRequirements.create()` factory already handles unknown types via `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. Adding the checkbox case to the discriminator is sufficient.

**Alternatives considered**:
- New `AUTHOR_CHECKBOX_*` error codes: Rejected — no checkbox-specific error scenarios exist.

### D-003: Form component structure

**Decision**: Create a `CheckboxArtifactForm.tsx` component with only label input + required toggle. No description textarea.

**Rationale**: Follows the pattern of `TextArtifactForm.tsx` and `FileArtifactForm.tsx` but simpler. The component renders a label input with character counter (200 max) and a required checkbox. The file info box is also absent (no system constraints to communicate).

**Alternatives considered**:
- Reuse TextArtifactForm with description hidden: Rejected — cleaner to have a dedicated component. The form is trivially small and maintaining a "hide description" prop would add unnecessary conditional logic.

### D-004: Display type badge color

**Decision**: Use a distinct color for the "Checkbox" badge in `ArtifactRequirementsDisplay.tsx`, differentiating it from "Text" (indigo) and "File" (blue).

**Rationale**: Visual distinction helps authors quickly identify artifact types in the list. Green is a natural choice for checkbox/confirmation semantics.

**Alternatives considered**:
- Same color as text: Rejected — defeats the purpose of type badges.

### D-005: Server-side description handling

**Decision**: Zod schema strips unknown fields by default. If a client sends `{ type: 'checkbox', label: '...', description: 'foo' }`, the description is silently dropped during parsing.

**Rationale**: This is Zod's default behavior with `.object()` schemas (`.strip()` mode). No explicit handling needed. The `CheckboxArtifactRequirementSchema` simply doesn't declare a `description` field.

**Alternatives considered**:
- Reject payloads with description: Rejected — overly strict; breaks forward-compatibility.
- Accept and persist description: Rejected — contradicts the spec and wastes storage.
