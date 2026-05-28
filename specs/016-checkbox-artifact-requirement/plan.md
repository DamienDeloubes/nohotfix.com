# Implementation Plan: Checkbox Artifact Requirement

**Branch**: `016-checkbox-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-checkbox-artifact-requirement/spec.md`

## Summary

Add the "checkbox" artifact requirement type to the spec configuration. This is the third artifact type (after "text" and "file") and the simplest — it has no description field, no type-specific configuration, and represents a boolean confirmation statement. Implementation follows the established pattern: add a Zod schema variant, create a value object, register the type in the form/display components, and add unit tests.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E — not needed for this feature)
**Target Platform**: Web (Linux server API + browser SPA)
**Project Type**: Web service + SPA (monorepo)
**Performance Goals**: Standard — no new endpoints or queries; checkbox type adds minimal JSONB data
**Constraints**: No database migration. No new API endpoints. Extends existing discriminated union.
**Scale/Scope**: ~12 files modified/created. Smallest artifact type implementation.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to **Authoring** context. All domain logic in `packages/domains/authoring/`. Zod schemas in `packages/shared/`. UI components in `packages/domains/authoring/src/ui/`. No cross-domain imports. | ✅ |
| II | **Code Quality & Simplicity** — Follows established file/text pattern exactly. Value object with private constructor + `create()`/`reconstitute()`. No new infrastructure deps. Named exports. `org_id` enforced on existing queries (no new queries). Error taxonomy used via existing `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. | ✅ |
| III | **Testing Discipline** — Unit tests for checkbox value object (create, defaults, boundary, toJson, equality). Unit tests for `ArtifactRequirements.create()` with checkbox type. No new integration/E2E tests needed (existing create-spec integration tests cover the pipeline; checkbox adds no new API surface). | ✅ |
| IV | **UX Consistency** — Domain UI in `packages/domains/authoring/src/ui/`. No new query keys (uses existing spec creation mutation). No polling changes. Checkbox form is simpler than text/file (no description field). | ✅ |
| V | **Run Immutability** — Feature does not touch run data. Authoring-side only. | ✅ N/A |
| VI | **Domain Errors** — No new error codes needed. Checkbox validation reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` (empty/too-long label) and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (unknown type, >10 items). Unit tests will assert these codes for checkbox-specific paths. | ✅ |
| VII | **Observability (OTel)** — No new service methods. Checkbox data flows through existing `createLibrarySpec` use case which is already instrumented. No new DB queries. | ✅ N/A |

## Project Structure

### Documentation (this feature)

```text
specs/016-checkbox-artifact-requirement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
  schemas/
    specs.ts                          # Add CheckboxArtifactRequirementSchema + response variant
  types/
    index.ts                          # Export CheckboxArtifactRequirement type

packages/domains/authoring/src/
  entities/
    value-objects/
      checkbox-artifact-requirement.ts           # NEW — CheckboxArtifactRequirement value object
      artifact-requirements.ts                   # MODIFY — add 'checkbox' to discriminator
    __tests__/
      checkbox-artifact-requirement.test.ts      # NEW — unit tests
      artifact-requirements.test.ts              # MODIFY — add checkbox type tests
  ui/
    components/
      CheckboxArtifactForm.tsx                   # NEW — label + required toggle (no description)
      ArtifactRequirementsList.tsx               # MODIFY — add "Checkbox" button + wire form
      ArtifactRequirementsDisplay.tsx            # MODIFY — add checkbox type badge
      CreateSpecForm.tsx                         # MODIFY — update type union in form data mapping
```

**Structure Decision**: Standard monorepo layout. All changes within existing `packages/shared` and `packages/domains/authoring`. No new packages, no new API routes, no new database entities.

## Complexity Tracking

> No violations. This feature follows the exact same pattern as features 014 (text) and 015 (file) with reduced complexity (no description field).
