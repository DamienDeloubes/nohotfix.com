# Implementation Plan: Edit Spec

**Branch**: `023-edit-spec` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-edit-spec/spec.md`

## Summary

Enable admins and owners to edit existing specs in the Spec Library. Adds a PUT endpoint for updating specs, an `updateLibrarySpec` use case in the Authoring domain, extends the `recordSpecChanges` use case in the Audit domain to detect changes in additional fields (system_under_test, severity, preconditions, test_steps, expected_result, tester_notes), extracts a shared `SpecForm` component from the existing `CreateSpecForm`, and adds an edit route with role-based guards and unsaved-changes protection.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, TipTap, @dnd-kit
**Storage**: PostgreSQL (existing `spec_library` and `changelog` tables — no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service + SPA
**Performance Goals**: API write <1000ms p95, read <500ms p95
**Constraints**: `org_id` on all tenant queries; role enforcement at both API and frontend levels
**Scale/Scope**: Single new route, one new use case, form component refactor, extended history tracking

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Authoring** (spec editing). Cross-context call to **Audit** (changelog recording) via API-layer orchestration in the route handler (same pattern as create spec). No cross-domain imports. Domain packages depend only on `@releasepilot/shared` and `zod`. Dual entry-point rules respected: `apps/api` imports logic only, `apps/app` imports both logic and UI. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained: new `updateLibrarySpec` use case is transport-agnostic; repository port already has `update()` method; composition root wires adapters. HTTP status codes only in error handler. Named exports. `org_id` in all queries. Error taxonomy followed (`AUTHOR_*` codes). | ✅ |
| III | **Testing Discipline** — Unit tests: `updateLibrarySpec` use case validation, `recordSpecChanges` extended field detection. Integration tests: PUT endpoint happy path, role enforcement (member rejection), archived spec rejection, `org_id` boundary. No state machine changes, so no transition tests needed. | ✅ |
| IV | **UX Consistency** — Role guard at TanStack Router `beforeLoad` for edit route (redirect members to detail page). Domain UI in `packages/domains/authoring/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. New `useUpdateSpec` hook accepts `queryKey`/`invalidateKeys`. No polling needed (single-author edit page). Unsaved changes confirmation dialog on navigation away. | ✅ |
| V | **Run Immutability** — Feature does NOT touch run data. Editing a spec in the library has no effect on runs or playbook specs (out of scope). No immutability guard needed. | ✅ N/A |
| VI | **Domain Errors** — New error code needed: `AUTHOR_ROLE_INSUFFICIENT` (or reuse existing `AUTH_ROLE_INSUFFICIENT`). Existing codes reused: `AUTHOR_SPEC_NOT_FOUND`, `AUTHOR_SPEC_ARCHIVED`, `AUTHOR_SPEC_TITLE_INVALID`, `AUTHOR_SPEC_STEP_INVALID`, etc. Unit tests will assert correct error codes for role rejection, archived spec, and validation failures. | ✅ |
| VII | **Observability (OTel)** — Route handler uses `getSpan(request)` for custom attributes (auto-instrumented by `@fastify/otel`). `updateLibrarySpec` use case is pure (no manual spans needed). Changelog recording follows existing pattern. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/023-edit-spec/
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
├── schemas/specs.ts                          # Add UpdateLibrarySpecRequestSchema, extend SPEC_HISTORY_ACTIONS
└── errors/codes.ts                           # Verify existing AUTHOR_* codes sufficient

packages/domains/authoring/src/
├── use-cases/
│   └── update-library-spec.ts                # NEW: UpdateLibrarySpecDeps, UpdateLibrarySpecCommand
├── ports/
│   └── spec-library-repository.ts            # EXISTING: update() method already defined
└── ui/
    ├── components/
    │   ├── SpecForm.tsx                       # NEW: extracted shared form (from CreateSpecForm)
    │   ├── CreateSpecForm.tsx                 # MODIFY: thin wrapper around SpecForm
    │   └── EditSpecForm.tsx                   # NEW: thin wrapper around SpecForm with initialValues
    └── hooks/
        └── use-update-spec.ts                # NEW: useApiMutation for PUT

packages/domains/audit/src/
└── use-cases/
    └── record-spec-changes.ts                # MODIFY: extend SpecSnapshot + detectFieldChanges for new fields

apps/api/src/
└── routes/
    └── authoring.ts                          # MODIFY: add PUT /api/orgs/:orgSlug/specs/:specId

apps/app/src/
├── routes/_authenticated/$orgSlug/spec-library/
│   ├── $specId.tsx                            # MODIFY: add "Edit spec" button (admin/owner only)
│   ├── $specId.edit.tsx                       # NEW: edit route with beforeLoad role guard
│   └── index.tsx                              # MODIFY: add "Edit spec" to row action menu (admin/owner only)
└── api/
    └── query-keys.ts                          # EXISTING: no changes needed (specKeys.detail already exists)
```

**Structure Decision**: Monorepo web application following established hexagonal architecture. Changes span three packages (`shared`, `authoring`, `audit`) and two apps (`api`, `app`). No new packages or structural changes.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
