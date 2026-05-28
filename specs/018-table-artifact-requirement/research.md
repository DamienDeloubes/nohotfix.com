# Research: Table Artifact Requirement

**Feature**: 018-table-artifact-requirement
**Date**: 2026-03-10

## No External Unknowns

The table artifact type introduces no technology unknowns. It extends the existing discriminated union pattern established by features 014-017. The complexity is structural (column definitions + row data) rather than technological.

## Decision Log

### D-001: Table schema extends existing discriminated union — no new API endpoints

**Decision**: The `TableArtifactRequirementSchema` is added as the sixth variant of the `ArtifactRequirementSchema` discriminated union. No new API endpoints. The table data (columns + rows) is stored inline in the `artifact_requirements` JSONB array.

**Rationale**: Per `docs/development/spec-configuration.md`, the table artifact stores column definitions and row data as part of the requirement definition. The existing `spec_library.artifact_requirements` JSONB column handles arbitrary JSON structures. The 5-column × 50-row maximum (250 cells max) keeps the JSONB payload well within PostgreSQL limits.

**Alternatives considered**:

- Separate `artifact_requirement_tables` table with FK: Rejected — breaks the single-JSONB pattern used by all other types. Adds migration, joins, and snapshot complexity. The data volume is bounded (max ~250 cells per table, max 10 tables per spec).

### D-002: MeasuredValueUnit type must be created in packages/shared

**Decision**: Create a `MeasuredValueUnit` Zod enum (`ms`, `s`, `%`, `MB`, `GB`, `req/s`) in `packages/shared/src/schemas/specs.ts` for use in table column definitions.

**Rationale**: This type does not currently exist in packages/shared. The run-time artifact layer (`apps/api/src/routes/execution.ts`) uses `z.string().nullable()` for measured units, but the authoring layer needs a constrained enum for the column definition. Creating it in specs.ts keeps it alongside the artifact requirement schemas.

**Alternatives considered**:

- Use `z.string()` without constraints: Rejected — the spec explicitly lists a fixed set of 6 units. Enum validation catches invalid units at both client and server.
- Import from the execution/artifacts schema: Rejected — that schema doesn't constrain to the fixed set and lives in a different domain layer.

### D-003: Column definition and cell value schemas are nested in the table schema

**Decision**: Define `TableColumnDefSchema` and cell value validation as nested schemas within the table artifact requirement definition. These are not standalone shared types — they exist only in the context of table artifact requirements.

**Rationale**: Column definitions and cell values are structurally part of the table artifact requirement. They have no meaning outside that context. Nesting avoids polluting the shared types namespace.

**Alternatives considered**:

- Top-level shared schemas for columns/cells: Rejected — these types are only used by the table artifact requirement. No other feature needs them.

### D-004: Table value object delegates to column/cell value objects

**Decision**: Create the following value objects in the Authoring domain:

- `TableArtifactRequirement` — the aggregate with columns + rows
- `TableColumnDef` — column definition (name, type, readOnly, unit, tolerancePercentage)
- No separate cell value object — cell validation is handled by the `TableArtifactRequirement.create()` factory based on column type

**Rationale**: Columns are structural definitions that need validation (name required, type valid, unit required for measured_value). Cell values are primitive types validated against their column's type — a separate value object adds complexity without benefit. The factory method validates cell-column consistency during creation.

**Alternatives considered**:

- Cell value objects: Rejected — cells are primitives (string | number | boolean | null | {expectedValue, measuredValue}). A value object wrapping a primitive adds no validation value beyond what the factory already does.

### D-005: No new error codes needed

**Decision**: Reuse existing error codes: `AUTHOR_ARTIFACT_LABEL_INVALID` (label validation), `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (structural validation including column/row constraints).

**Rationale**: The table type's validation errors fall into two categories: (1) label/description validation — already covered by existing value objects and error codes, and (2) structural validation (missing columns, too many rows, cell-column mismatch) — these are artifact requirement composition errors, covered by `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. The error message distinguishes the specific issue (e.g., "Table columns must be between 1 and 5", "Row cell count does not match column count").

**Alternatives considered**:

- New `AUTHOR_TABLE_*` error codes: Rejected — the errors are all variations of "artifact requirement is invalid" with different messages. The existing code is sufficient with descriptive messages.

### D-006: Column name max length set to 100 characters

**Decision**: Column names are limited to 100 characters after trimming. This resolves the deferred A-009 assumption from the spec.

**Rationale**: Column names appear as table headers in both the authoring preview and execution view. 100 characters is generous for a header label while preventing abuse. This aligns with similar UI label constraints in the platform.

**Alternatives considered**:

- 200 chars (same as artifact label): Rejected — column headers need to fit in table cells. 200 chars would cause layout issues.
- 50 chars: Rejected — too restrictive for descriptive headers like "Expected API response time (p95)".

### D-007: Form component architecture for table

**Decision**: Create `TableArtifactForm.tsx` as a single component managing the full table configuration (label, description, required, columns, rows). Column management and row editing are handled inline — no separate modals or multi-step flows.

**Rationale**: The table form is more complex than other artifact forms but should remain a single cohesive section within the artifact requirements list. Modals would break the inline editing pattern established by other types. The bounded constraints (max 5 columns, 50 rows) keep the inline form manageable.

**Alternatives considered**:

- Modal for table configuration: Rejected — breaks the inline pattern. All other artifact forms are inline within the list.
- Separate column manager + row editor components: Will use internal sub-components as needed for code organization, but the parent `TableArtifactForm.tsx` is the entry point.

### D-008: Display badge color for table type

**Decision**: Use purple/violet for the "Table" badge in `ArtifactRequirementsDisplay.tsx`. The existing colors are: Text=indigo, File=blue, Checkbox=green, URL=amber.

**Rationale**: Purple/violet is the remaining warm-cool color that provides good visual distinction from all four existing badge colors. It conveys structure/organization, fitting for a tabular data type.

**Alternatives considered**:

- Red/pink: Rejected — red has negative connotations (error, danger).
- Teal/cyan: Acceptable alternative but purple is more distinctive from the existing blue (file).
