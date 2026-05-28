# Implementation Plan: URL Artifact Requirement

**Branch**: `017-url-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-url-artifact-requirement/spec.md`

## Summary

Add the "url" artifact requirement type to the spec configuration. This is the fourth artifact type (after "text", "file", and "checkbox"). It follows the same structure as the text artifact type — label, optional description, and required flag — with no type-specific configuration. The URL type represents a link to external evidence (CI pipelines, staging URLs, Sentry issues, etc.). Implementation follows the established pattern: add a Zod schema variant, create a value object, register the type in the form/display components, and add unit tests.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E — not needed for this feature)
**Target Platform**: Web (Linux server API + browser SPA)
**Project Type**: Web service + SPA (monorepo)
**Performance Goals**: Standard — no new endpoints or queries; URL type adds minimal JSONB data
**Constraints**: No database migration. No new API endpoints. Extends existing discriminated union.
**Scale/Scope**: ~12 files modified/created. Follows text artifact type pattern closely (has description field, unlike checkbox).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to **Authoring** context. All domain logic in `packages/domains/authoring/`. Zod schemas in `packages/shared/`. UI components in `packages/domains/authoring/src/ui/`. No cross-domain imports. | Pass |
| II | **Code Quality & Simplicity** — Follows established text/file/checkbox pattern exactly. Value object with private constructor + `create()`/`reconstitute()`. No new infrastructure deps. Named exports. `org_id` enforced on existing queries (no new queries). Error taxonomy used via existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. | Pass |
| III | **Testing Discipline** — Unit tests for URL value object (create, defaults, boundary, toJson, equality). Unit tests for `ArtifactRequirements.create()` with URL type. No new integration/E2E tests needed (existing create-spec integration tests cover the pipeline; URL adds no new API surface). | Pass |
| IV | **UX Consistency** — Domain UI in `packages/domains/authoring/src/ui/`. No new query keys (uses existing spec creation mutation). No polling changes. URL form matches text artifact form structure (label + description + required). | Pass |
| V | **Run Immutability** — Feature does not touch run data. Authoring-side only. | Pass (N/A) |
| VI | **Domain Errors** — No new error codes needed. URL validation reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` (empty/too-long label), `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (unknown type, >10 items). Description validation reuses existing `ArtifactDescription` value object. Unit tests will assert these codes for URL-specific paths. | Pass |
| VII | **Observability (OTel)** — No new service methods. URL data flows through existing `createLibrarySpec` use case which is already instrumented. No new DB queries. | Pass (N/A) |

## Project Structure

### Documentation (this feature)

```text
specs/017-url-artifact-requirement/
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
    specs.ts                          # Add UrlArtifactRequirementSchema + response variant
  types/
    index.ts                          # Export UrlArtifactRequirement type

packages/domains/authoring/src/
  entities/
    value-objects/
      url-artifact-requirement.ts              # NEW — UrlArtifactRequirement value object
      artifact-requirements.ts                 # MODIFY — add 'url' to discriminator
    __tests__/
      url-artifact-requirement.test.ts         # NEW — unit tests
      artifact-requirements.test.ts            # MODIFY — add url type tests
  ui/
    components/
      UrlArtifactForm.tsx                      # NEW — label + description + required toggle
      ArtifactRequirementsList.tsx             # MODIFY — add "URL" button + wire form
      ArtifactRequirementsDisplay.tsx          # MODIFY — add url type badge
      CreateSpecForm.tsx                       # MODIFY — update type union in form data mapping
```

**Structure Decision**: Standard monorepo layout. All changes within existing `packages/shared` and `packages/domains/authoring`. No new packages, no new API routes, no new database entities.

## Complexity Tracking

> No violations. This feature follows the exact same pattern as features 014 (text) and 015 (file) — it includes the optional description field, unlike 016 (checkbox).
