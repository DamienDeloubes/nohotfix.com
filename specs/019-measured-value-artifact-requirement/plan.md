# Implementation Plan: Measured Value Artifact Requirement

**Branch**: `019-measured-value-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-measured-value-artifact-requirement/spec.md`

## Summary

Add the "measured_value" artifact requirement type to the spec configuration. This is the fifth artifact type (after "text", "file", "checkbox", and "url") and the final standalone type before all six types from `docs/development/spec-configuration.md` are complete. Unlike the simpler types, measured_value has four type-specific configuration fields: `unit` (from a fixed set of 6 values), `expectedValue` (required finite number), `tolerancePercentage` (optional positive number), and `toleranceDescription` (optional, max 1,000 chars). The form includes conditional UI — the tolerance description field is shown only when a tolerance percentage is entered. Implementation follows the established pattern: add Zod schema variants, create a value object with type-specific validation, register the type in the form/display components, and add unit tests.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E — not needed for this feature)
**Target Platform**: Web (Linux server API + browser SPA)
**Project Type**: Web service + SPA (monorepo)
**Performance Goals**: Standard — no new endpoints or queries; measured_value type adds minimal JSONB data
**Constraints**: No database migration. No new API endpoints. Extends existing discriminated union. `MeasuredValueUnitSchema` already exists in `packages/shared/src/schemas/specs.ts` (created by table feature 018).
**Scale/Scope**: ~14 files modified/created. More complex than URL/checkbox (has 4 type-specific fields + conditional UI) but simpler than table. Follows established artifact type pattern.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Check      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| I   | **Bounded Context Integrity** — Feature assigned to **Authoring** context. All domain logic in `packages/domains/authoring/`. Zod schemas in `packages/shared/`. UI components in `packages/domains/authoring/src/ui/`. No cross-domain imports.                                                                                                                                                                                                                                                                                            | Pass       |
| II  | **Code Quality & Simplicity** — Follows established artifact type pattern. Value object with private constructor + `create()`/`reconstitute()`. Two new value objects: `MeasuredValueUnit` (validates the fixed unit set) and `MeasuredValueArtifactRequirement` (validates all type-specific fields). No new infrastructure deps. Named exports. `org_id` enforced on existing queries (no new queries). Error taxonomy used via existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.                      | Pass       |
| III | **Testing Discipline** — Unit tests for MeasuredValueUnit value object (valid units, invalid units). Unit tests for MeasuredValueArtifactRequirement (create with all fields, create without tolerance, boundary values for expectedValue, invalid tolerance, tolerance description without tolerance, toJson, equality). Unit tests for `ArtifactRequirements.create()` with measured_value type. No new integration/E2E tests needed (existing create-spec integration tests cover the pipeline; measured_value adds no new API surface). | Pass       |
| IV  | **UX Consistency** — Domain UI in `packages/domains/authoring/src/ui/`. No new query keys (uses existing spec creation mutation). No polling changes. Measured value form has conditional UI (tolerance description shown only when tolerance percentage is entered) — follows React controlled component patterns.                                                                                                                                                                                                                         | Pass       |
| V   | **Run Immutability** — Feature does not touch run data. Authoring-side only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Pass (N/A) |
| VI  | **Domain Errors** — No new error codes needed. Measured value validation reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` (empty/too-long label), `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (invalid unit, missing expectedValue, invalid tolerance, etc.). Description and tolerance description validation reuses existing `ArtifactDescription` value object. Unit tests will assert these codes for measured-value-specific error paths.                                                                                                    | Pass       |
| VII | **Observability (OTel)** — No new service methods. Measured value data flows through existing `createLibrarySpec` use case which is already instrumented. No new DB queries.                                                                                                                                                                                                                                                                                                                                                                | Pass (N/A) |

## Project Structure

### Documentation (this feature)

```text
specs/019-measured-value-artifact-requirement/
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
    specs.ts                          # Add MeasuredValueArtifactRequirementSchema
                                      #   + response variant. Add to both discriminated unions.
                                      #   MeasuredValueUnitSchema already exists (from 018).
  types/
    index.ts                          # Export MeasuredValueArtifactRequirement type

packages/domains/authoring/src/
  entities/
    value-objects/
      measured-value-unit.ts                         # NEW — MeasuredValueUnit value object
      measured-value-artifact-requirement.ts          # NEW — MeasuredValueArtifactRequirement value object
      artifact-requirements.ts                       # MODIFY — add 'measured_value' to discriminator
      index.ts                                       # MODIFY — export new value objects
    __tests__/
      measured-value-unit.test.ts                    # NEW — unit tests
      measured-value-artifact-requirement.test.ts    # NEW — unit tests
      artifact-requirements.test.ts                  # MODIFY — add measured_value type tests
  ui/
    components/
      MeasuredValueArtifactForm.tsx                  # NEW — form with unit selector, expected value,
                                                     #   tolerance percentage, conditional tolerance description
      ArtifactRequirementsList.tsx                   # MODIFY — add "Measured Value" button + wire form,
                                                     #   update ArtifactFormData union, update validation,
                                                     #   update handleAdd default form data
      ArtifactRequirementsDisplay.tsx                # MODIFY — add measured_value type badge + display
      CreateSpecForm.tsx                             # MODIFY — update type union + payload mapping
```

**Structure Decision**: Standard monorepo layout. All changes within existing `packages/shared` and `packages/domains/authoring`. No new packages, no new API routes, no new database entities. New value objects `MeasuredValueUnit` and `MeasuredValueArtifactRequirement` justified by type-specific validation (unit enum, expectedValue finiteness, tolerance constraints, tolerance description conditional normalization).

## Complexity Tracking

> No violations. This feature follows the established artifact type pattern. The `MeasuredValueUnit` value object is justified by the need to validate a fixed unit set shared with the table type's measured_value columns. The form component has conditional UI (tolerance description visibility) but this is standard React state management, not architectural complexity.
