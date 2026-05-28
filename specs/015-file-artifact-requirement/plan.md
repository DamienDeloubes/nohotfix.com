# Implementation Plan: File Artifact Requirement

**Branch**: `015-file-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-file-artifact-requirement/spec.md`

## Summary

Add the "File" artifact requirement type to the spec configuration authoring flow. This extends the discriminated union established in feature 014 (Text Artifact) by adding a `file` variant. The file type has no type-specific configuration fields -- it shares the same base fields (label, description, required) as text. The key difference is a UI constraint note informing authors about system-enforced file upload limits (10 MB, allowed extensions). No database migration required.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL -- existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo: apps/api, apps/app, packages/*)
**Performance Goals**: Standard (no new performance-critical paths)
**Constraints**: None beyond existing constitution standards
**Scale/Scope**: Extends existing artifact requirements system with one new type variant

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** -- Primary context: **Authoring**. All domain logic in `packages/domains/authoring/`. No cross-domain imports. Zod schemas in `packages/shared/`. UI components in domain package `/ui` subpath. Consumer rules respected (apps/api imports logic only, apps/app imports both). | ✅ |
| II | **Code Quality & Simplicity** -- Hexagonal architecture maintained. File artifact VO follows same pattern as TextArtifactRequirement (private constructor, `.create()`, `.toJson()`). No new infrastructure deps in domain package. Named exports. Error taxonomy used. | ✅ |
| III | **Testing Discipline** -- Unit tests for FileArtifactRequirement VO. Update ArtifactRequirements collection tests to cover file type. Integration tests for API create/read round-trip with file artifacts. No new state machines or enforcement paths. | ✅ |
| IV | **UX Consistency** -- Domain UI in `packages/domains/authoring/src/ui/`. No new query keys needed (artifacts are part of spec detail payload). No polling changes. Type selector extends existing pattern. | ✅ |
| V | **Run Immutability** -- Feature does not touch run data. Authoring-side only. Existing snapshot flow will copy file artifact requirements automatically (JSONB deep copy). | ✅ N/A |
| VI | **Domain Errors** -- No new error codes needed. Existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` cover file type validation (same base field rules). `ArtifactRequirements.create()` already throws on unknown type -- adding 'file' to the allowed set is all that's needed. | ✅ |
| VII | **Observability (OTel)** -- No new service methods. Existing `createLibrarySpec` use case handles artifact requirements generically. No additional spans needed. | ✅ N/A |

## Project Structure

### Documentation (this feature)

```text
specs/015-file-artifact-requirement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/schemas/
  specs.ts                            # MODIFY: Add FileArtifactRequirementSchema to discriminated union

packages/domains/authoring/src/
  entities/value-objects/
    file-artifact-requirement.ts      # NEW: FileArtifactRequirement VO
    artifact-requirements.ts          # MODIFY: Accept type 'file', create FileArtifactRequirement
  entities/__tests__/
    file-artifact-requirement.test.ts # NEW: Unit tests for FileArtifactRequirement VO
    artifact-requirements.test.ts     # MODIFY: Add file type test cases

packages/domains/authoring/src/ui/components/
  FileArtifactForm.tsx                # NEW: File artifact form with constraint note
  ArtifactRequirementsList.tsx        # MODIFY: Add 'File' to type selector, render FileArtifactForm
  ArtifactRequirementsDisplay.tsx     # MODIFY: Show 'File' badge for file type
```

**Structure Decision**: Follows the established monorepo hexagonal architecture. All changes are within the Authoring bounded context. The file type mirrors the text type pattern exactly, with a new VO, form component, and schema variant.

## Complexity Tracking

> No constitution violations. No complexity justification needed.
