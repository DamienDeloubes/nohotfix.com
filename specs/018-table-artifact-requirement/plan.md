# Implementation Plan: Table Artifact Requirement

**Branch**: `018-table-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-table-artifact-requirement/spec.md`

## Summary

Add the "table" artifact requirement type to the spec configuration. This is the sixth and final artifact type (after "text", "file", "checkbox", "url", and the future "measured_value"). The table type is the most complex artifact type — it allows authors to define structured tabular data with 1-5 columns (text, number, boolean, measured_value) and 1-50 rows. Text and number columns can be read-only (author-set) or fillable by the tester. Boolean columns are always fillable. Measured_value columns have author-set expected values and tester-filled measured values with optional column-level tolerance. Implementation follows the established pattern: add Zod schema variants, create value objects (TableColumnDef + TableArtifactRequirement), register the type in the form/display components, and add unit tests.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E — not needed for this feature)
**Target Platform**: Web (Linux server API + browser SPA)
**Project Type**: Web service + SPA (monorepo)
**Performance Goals**: Standard — no new endpoints or queries; table type adds moderate JSONB data (max 5 cols × 50 rows = 250 cells)
**Constraints**: No database migration. No new API endpoints. Extends existing discriminated union. Max payload bounded by column/row limits.
**Scale/Scope**: ~15 files modified/created. Most complex artifact type but follows established patterns. New value objects: TableColumnDef + TableArtifactRequirement. New form component: TableArtifactForm.tsx (significantly larger than other artifact forms).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to **Authoring** context. All domain logic in `packages/domains/authoring/`. Zod schemas in `packages/shared/`. UI components in `packages/domains/authoring/src/ui/`. No cross-domain imports. | Pass |
| II | **Code Quality & Simplicity** — Follows established artifact type pattern. Value objects with private constructor + `create()`/`reconstitute()`. New `TableColumnDef` value object justified by column-level validation complexity (type-specific rules for readOnly, unit, tolerancePercentage). No new infrastructure deps. Named exports. `org_id` enforced on existing queries (no new queries). Error taxonomy used via existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. | Pass |
| III | **Testing Discipline** — Unit tests for TableColumnDef (all 4 column types, type-specific validation, boundaries). Unit tests for TableArtifactRequirement (create, cell-column consistency, boundary, toJson, equality). Unit tests for `ArtifactRequirements.create()` with table type. No new integration/E2E tests needed (existing create-spec integration tests cover the pipeline; table adds no new API surface). | Pass |
| IV | **UX Consistency** — Domain UI in `packages/domains/authoring/src/ui/`. No new query keys (uses existing spec creation mutation). No polling changes. Table form is inline within artifact requirements list (consistent with other types). Spec detail page shows read-only table preview with visual distinction between read-only and fillable cells. | Pass |
| V | **Run Immutability** — Feature does not touch run data. Authoring-side only. | Pass (N/A) |
| VI | **Domain Errors** — No new error codes needed. Table validation reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` (empty/too-long label), `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (structural validation: column/row constraints, cell-column mismatch, missing units). Error messages are descriptive. Unit tests will assert these codes for table-specific error paths. | Pass |
| VII | **Observability (OTel)** — No new service methods. Table data flows through existing `createLibrarySpec` use case which is already instrumented. No new DB queries. | Pass (N/A) |

## Project Structure

### Documentation (this feature)

```text
specs/018-table-artifact-requirement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
  schemas/
    specs.ts                          # Add MeasuredValueUnitSchema, TableColumnDefSchema,
                                      #   CellValueSchema, TableArtifactRequirementSchema
                                      #   + response variants
  types/
    index.ts                          # Export TableArtifactRequirement, TableColumnDef,
                                      #   MeasuredValueUnit, CellValue types

packages/domains/authoring/src/
  entities/
    value-objects/
      table-column-def.ts                        # NEW — column definition value object
      table-artifact-requirement.ts              # NEW — table artifact value object
      artifact-requirements.ts                   # MODIFY — add 'table' to discriminator
    __tests__/
      table-column-def.test.ts                   # NEW — column def unit tests
      table-artifact-requirement.test.ts         # NEW — table artifact unit tests
      artifact-requirements.test.ts              # MODIFY — add table type tests
  ui/
    components/
      TableArtifactForm.tsx                      # NEW — full table config form
      ArtifactRequirementsList.tsx               # MODIFY — add "Table" button + wire form
      ArtifactRequirementsDisplay.tsx            # MODIFY — add table badge + table preview
      CreateSpecForm.tsx                         # MODIFY — update type union + payload mapping
```

**Structure Decision**: Standard monorepo layout. All changes within existing `packages/shared` and `packages/domains/authoring`. No new packages, no new API routes, no new database entities. New value object `TableColumnDef` justified by column-level validation complexity.

## Complexity Tracking

> No violations. This feature follows the established artifact type pattern. The additional value object (`TableColumnDef`) is justified by the type-specific validation rules (readOnly only for text/number, unit required for measured_value, tolerancePercentage only for measured_value). The form component (`TableArtifactForm.tsx`) is more complex than other artifact forms but the complexity is inherent to the table's structure (column management + row editing) — not architectural over-engineering.
