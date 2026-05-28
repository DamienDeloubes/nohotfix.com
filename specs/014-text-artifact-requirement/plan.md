# Implementation Plan: Text Artifact Requirement

**Branch**: `014-text-artifact-requirement` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-text-artifact-requirement/spec.md`

## Summary

Add the "Text" artifact requirement type to spec configuration — the first concrete artifact type in NoHotfix. This implements the foundational artifact requirements list management (add, remove, reorder, validate, max 10) plus the text-specific type (label, description, required flag). Changes span `packages/shared` (Zod schemas + types), `packages/domains/authoring` (value objects, entity, use case, errors, UI components), and `apps/api` (route handler). No database migration required — `artifact_requirements` JSONB column already exists.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing)
**Storage**: PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web application (SPA + API)
**Project Type**: web-service + SPA
**Performance Goals**: Standard — no special perf concerns for this feature
**Constraints**: Max 10 artifact requirements per spec, label max 200 chars, description max 1,000 chars
**Scale/Scope**: Standard CRUD + validation, 4 new value objects, 2 new error codes, 1 Zod schema addition, 3 new UI components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                    | Check  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| I   | **Bounded Context Integrity** — Feature assigned to **Authoring** context; no cross-domain imports; domain pkg depends only on `@nohotfix/shared` + `zod`; dual entry-point consumer rules respected (API imports logic only, app imports logic + UI)        | ✅     |
| II  | **Code Quality & Simplicity** — Hexagonal architecture maintained; domain VOs are infrastructure-free; ports in `src/ports/`; composition root wires adapters; `org_id` on all queries; error taxonomy used; naming conventions followed                     | ✅     |
| III | **Testing Discipline** — Unit tests for all value objects (valid + invalid inputs, boundary conditions); integration tests for POST spec endpoint with artifact requirements; no enforcement-critical paths affected (execution not in scope)                | ✅     |
| IV  | **UX Consistency** — Domain UI components in `packages/domains/authoring/src/ui/`; query keys centralised; domain hooks accept `queryKey`/`invalidateKeys` params; inline validation with field-level errors; no polling needed (spec creation is on-demand) | ✅     |
| V   | **Run Immutability** — Feature does NOT touch run data. Artifact requirements are configured at authoring time; snapshot to runs happens via existing `SnapshotService`. No immutability guard changes needed.                                               | ✅ N/A |
| VI  | **Domain Errors** — Two new error codes: `AUTHOR_ARTIFACT_LABEL_INVALID`, `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`. Registered in `packages/shared/src/errors/codes.ts`. Error classes in `packages/domains/authoring/src/errors/`.                            | ✅     |
| VII | **Observability (OTel)** — No new service methods (use case reuses existing `createLibrarySpec`). Auto-instrumented via `@fastify/otel`. Span attributes already set for `spec.id`.                                                                          | ✅     |

## Project Structure

### Documentation (this feature)

```text
specs/014-text-artifact-requirement/
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
├── schemas/specs.ts                            # Add TextArtifactRequirementSchema + ArtifactRequirementSchema
├── errors/codes.ts                             # Add AUTHOR_ARTIFACT_LABEL_INVALID, AUTHOR_ARTIFACT_REQUIREMENTS_INVALID
└── types/index.ts                              # Add ArtifactRequirement type export

packages/domains/authoring/src/
├── entities/
│   ├── spec-library-entry.ts                   # Update: typed artifactRequirements, validate in create()
│   └── value-objects/
│       ├── artifact-label.ts                   # NEW: 1-200 chars, trimmed
│       ├── artifact-description.ts             # NEW: max 1,000 chars, trimmed, whitespace→null
│       ├── text-artifact-requirement.ts        # NEW: type='text', label + description + required
│       ├── artifact-requirements.ts            # NEW: collection VO, max 10, re-indexing
│       └── index.ts                            # Update: re-export new VOs
├── errors/index.ts                             # Add AuthorArtifactLabelInvalidError, AuthorArtifactRequirementsInvalidError
├── use-cases/
│   └── create-library-spec.ts                  # Update: accept + pass through artifactRequirements
└── ui/
    └── components/
        ├── ArtifactRequirementsList.tsx         # NEW: list management (add/remove/reorder, max 10)
        ├── TextArtifactForm.tsx                 # NEW: label + description + required toggle fields
        ├── ArtifactRequirementsDisplay.tsx      # NEW: read-only display for spec detail page
        ├── CreateSpecForm.tsx                   # Update: add ArtifactRequirementsList section
        └── SpecDetail.tsx                       # Update: render ArtifactRequirementsDisplay

apps/api/src/
└── routes/authoring.ts                         # Update: pass artifactRequirements from parsed body to use case

apps/api/src/adapters/repositories/
└── kysely-spec-library-repository.ts           # Already handles JSONB — serialises artifactRequirements to JSON
```

**Structure Decision**: All changes fit within the existing Authoring bounded context. No new contexts, packages, or structural changes. The hexagonal architecture is maintained: value objects validate domain rules, the entity orchestrates creation, the use case wires dependencies, and the route handler is a thin controller.
