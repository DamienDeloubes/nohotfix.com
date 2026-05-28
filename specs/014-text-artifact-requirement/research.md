# Research: Text Artifact Requirement

**Feature**: 014-text-artifact-requirement
**Date**: 2026-03-10

## No NEEDS CLARIFICATION Items

All technical context was resolved from existing codebase patterns and the canonical `docs/development/spec-configuration.md` document. No unknowns require research.

## Design Decisions

### 1. Zod Schema Strategy: Discriminated Union

**Decision**: Define artifact requirements as a Zod discriminated union on the `type` field, starting with only the `text` variant.

**Rationale**: Discriminated unions provide type-safe validation and serialization. Adding future artifact types (file, checkbox, url, measured_value, table) requires only adding new variants to the union — no structural changes to the schema architecture.

**Alternatives considered**:

- `z.unknown()` (current) — No validation, no type safety. Rejected because this feature explicitly requires typed validation.
- Separate schemas per type without union — Rejected because it prevents validating the list as a whole (mixed types in a single array).

### 2. Value Object Granularity

**Decision**: Four new value objects: `ArtifactLabel`, `ArtifactDescription`, `TextArtifactRequirement`, `ArtifactRequirements` (collection).

**Rationale**: Follows established patterns (`SpecTitle`, `SpecTag`, `SpecTags`). Each VO encapsulates a single validation concern. The collection VO handles max-10 enforcement and re-indexing, mirroring `SpecTags` which handles max-10 and deduplication.

**Alternatives considered**:

- Single monolithic validator — Rejected; violates existing VO patterns and makes individual field validation non-reusable.
- Validate only at Zod schema level (no VOs) — Rejected; backend must validate independently per constitution (FR-019), and VOs provide the domain-layer validation.

### 3. Error Code Naming

**Decision**: Two new error codes:

- `AUTHOR_ARTIFACT_LABEL_INVALID` — label empty, too long, or whitespace-only after trim
- `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` — exceeds max 10, or contains structurally invalid requirement

**Rationale**: Follows `DOMAIN_CATEGORY_SPECIFIC` taxonomy. Mirrors existing patterns: `AUTHOR_SPEC_TITLE_INVALID`, `AUTHOR_SPEC_TAGS_INVALID`.

**Alternatives considered**:

- `AUTHOR_ARTIFACT_DESCRIPTION_INVALID` as a third code — Rejected; description validation failure is a subcategory of `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (structurally invalid requirement). Keeping codes minimal avoids enum bloat.

### 4. JSONB Storage Format

**Decision**: Store artifact requirements as a JSON array in the existing `artifact_requirements` JSONB column. Each element includes `index`, `type`, `label`, `description`, `required`. The array is stored as-is (no envelope versioning).

**Rationale**: The column already exists. The `docs/development/spec-configuration.md` schema defines the shape. No migration needed. Envelope versioning (like rich text's `{ version: 1, doc: ... }`) is unnecessary here because the discriminated union `type` field already provides forwards-compatible extensibility.

**Alternatives considered**:

- Normalised table (`artifact_requirements` with FK to `spec_library`) — Rejected; JSONB is already the design decision (column exists), and artifact requirements are always read/written as a whole unit.
- Versioned envelope — Rejected; discriminated union provides adequate extensibility.

### 5. Drag-and-Drop Library

**Decision**: Reuse `@dnd-kit` already installed for `TestStepList`.

**Rationale**: Same library, same patterns. `ArtifactRequirementsList` will follow the identical `DndContext` + `SortableContext` + `arrayMove` approach.

### 6. UI Component Composition

**Decision**: Three new components:

- `ArtifactRequirementsList` — manages the list (add/remove/reorder), renders a type picker and delegates to type-specific forms
- `TextArtifactForm` — fields for a single text requirement (label input, description textarea, required toggle)
- `ArtifactRequirementsDisplay` — read-only rendering on spec detail page

**Rationale**: Separation allows future artifact types to add their own form components (e.g., `FileArtifactForm`, `MeasuredValueArtifactForm`) while `ArtifactRequirementsList` handles the shared list management concerns. `ArtifactRequirementsDisplay` is separate from the form to keep the detail page lightweight.
