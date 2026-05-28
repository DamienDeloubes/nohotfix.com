# Implementation Plan: Spec Field Validations

**Branch**: `012-spec-field-validations` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-spec-field-validations/spec.md`

## Summary

Add field-level validation to the spec creation form for all text fields (title, preconditions, description, expectedResult, testerNotes, testSteps) per the constraints in `docs/development/spec-configuration.md`. Implement two new fields — `estimatedDurationMinutes` (integer 1–999) and `tags` (max 10 kebab-case strings, each max 30 chars) — with full backend + frontend validation. All validations are enforced at both the Zod schema layer (API boundary) and the domain entity layer (value objects), with inline error feedback on the frontend form.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, TipTap
**Storage**: PostgreSQL (migration required: 2 new columns on `spec_library`)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo: API + SPA)
**Performance Goals**: API write endpoints < 1000ms p95; inline validation < 50ms
**Constraints**: Create form only (editing is a separate feature). Artifact requirements out of scope.
**Scale/Scope**: Single bounded context (Authoring). ~15 files modified/created.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                                                                                                                                                                                                             | Check |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| I   | **Bounded Context Integrity** — Feature assigned to Authoring context. No cross-domain imports. Shared utilities (`tiptap-text.ts`, `kebab-case.ts`) live in `packages/shared`. Domain package depends only on `@nohotfix/shared` and `zod`. Dual entry-point rules respected (entity logic in root, UI components in `/ui`).                                                                                                                     | ☑     |
| II  | **Code Quality & Simplicity** — Hexagonal Architecture maintained: validation logic in value objects (domain layer), Zod at API boundary, adapters in `apps/api/src/adapters/`. Composition root is the wiring point. Error taxonomy used for all validation errors. Named exports, `org_id` on all queries. No premature abstractions — shared utilities created because they're used in 3+ locations (frontend counter, backend validation, tests). | ☑     |
| III | **Testing Discipline** — Unit tests for all new/modified value objects (valid + invalid inputs, boundary values). Unit tests for `extractPlainTextLength()` and `toKebabCase()`. Integration tests for API validation rejection (each field). Frontend component tests for character counters and inline errors.                                                                                                                                      | ☑     |
| IV  | **UX Consistency** — Inline field-level errors (FR-029). Character counters on all constrained fields. Tags combobox follows system-under-test pattern. Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain UI in `packages/domains/authoring/src/ui/`. No polling needed (form-based feature).                                                                                                                                        | ☑     |
| V   | **Run Immutability** — Feature does not touch run data. Not applicable.                                                                                                                                                                                                                                                                                                                                                                               | ☑ N/A |
| VI  | **Domain Errors** — 5 new error codes registered in `packages/shared/src/errors/codes.ts`: `AUTHOR_SPEC_TITLE_INVALID`, `AUTHOR_SPEC_STEP_INVALID`, `AUTHOR_SPEC_DURATION_INVALID`, `AUTHOR_SPEC_TAGS_INVALID`, `AUTHOR_SPEC_FIELD_TOO_LONG`. Domain error classes in `packages/domains/authoring/src/errors/`. Existing generic `Error` throws in SpecTitle and TestStep VOs converted to domain errors.                                             | ☑     |
| VII | **Observability (OTel)** — No new service methods introduced (validation happens in entity layer, not services). Existing OTel instrumentation on the create-spec route handler covers the flow. No additional spans needed — validation is synchronous and sub-millisecond.                                                                                                                                                                          | ☑     |

## Project Structure

### Documentation (this feature)

```text
specs/012-spec-field-validations/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api.md           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
├── schemas/
│   └── specs.ts                          # Modified: updated constraints + new fields
├── errors/
│   └── codes.ts                          # Modified: 5 new AUTHOR_SPEC_* codes
└── lib/
    ├── tiptap-text.ts                    # New: extractPlainTextLength()
    └── kebab-case.ts                     # New: toKebabCase()

packages/db/src/
├── schema.ts                             # Modified: SpecLibraryTable + 2 columns
└── migrations/
    └── 003_spec_estimated_duration_and_tags.ts  # New: migration

packages/domains/authoring/src/
├── entities/
│   ├── spec-library-entry.ts             # Modified: new fields + rich text validation
│   └── value-objects/
│       ├── spec-title.ts                 # Modified: max 200, domain error
│       ├── test-step.ts                  # Modified: char limits, domain error
│       ├── estimated-duration.ts         # New: integer 1–999 VO
│       ├── spec-tag.ts                   # New: single tag VO
│       └── spec-tags.ts                  # New: tag collection VO
├── errors/
│   └── index.ts                          # Modified: 5 new error classes
├── use-cases/
│   └── create-library-spec.ts            # Modified: pass new fields
├── ports/
│   └── spec-library-repository.ts        # Modified: new fields in interface
└── ui/
    ├── components/
    │   ├── CreateSpecForm.tsx             # Modified: counters, duration, tags, errors
    │   ├── SpecDetail.tsx                 # Modified: display duration + tags
    │   └── TagsCombobox.tsx              # New: tags input component
    └── hooks/
        └── use-tags-suggestions.ts       # New: fetch tag suggestions

apps/api/src/
├── routes/
│   └── authoring.ts                      # Modified: tags endpoint + new fields
└── adapters/
    └── repositories/
        └── kysely-spec-library-repository.ts  # Modified: new columns
```

**Structure Decision**: All changes fit within the existing hexagonal architecture. Authoring is the sole bounded context. Shared utilities go in `packages/shared/src/lib/` since they're consumed by both domain and UI layers.

## Complexity Tracking

No constitution violations. No complexity justification needed.
