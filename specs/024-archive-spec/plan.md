# Implementation Plan: Archive Spec

**Branch**: `024-archive-spec` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/024-archive-spec/spec.md`

## Summary

Enable admins and owners to archive and unarchive specs in the Spec Library. Archiving sets `is_archived = true` on the existing `spec_library` column, hides the spec from the Active tab, renders it read-only, and records a changelog entry. Unarchiving reverses the operation. The backend needs two new PATCH endpoints (archive/unarchive) with role guards and changelog recording. The frontend needs action menus with archive/unarchive options, a confirmation dialog for archive, toast notifications, an "Archived" badge on the detail page, and optimistic mutation hooks.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `spec_library` and `changelog` tables — no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service + SPA
**Performance Goals**: API read <500ms p95, write <1000ms p95; optimistic UI <200ms
**Constraints**: `org_id` on all queries; role-based access (admin/owner only for mutations)
**Scale/Scope**: Standard B2B SaaS load; 2 new API endpoints, ~8 modified/new frontend components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Authoring** (spec lifecycle). Cross-context dependency: **Audit** (changelog recording via API-layer orchestration, not direct import). Domain packages import only `@nohotfix/shared`. Consumer rules: `apps/api` imports domain logic only; `apps/app` imports both logic and UI. | PASS |
| II | **Code Quality & Simplicity** — Hexagonal architecture maintained: new use case `archiveLibrarySpec` is transport-agnostic; repository port extended with no infrastructure deps in domain package. Composition root wires adapters. Error taxonomy: reuses `AUTHOR_SPEC_ARCHIVED` (409) and `AUTHOR_SPEC_NOT_FOUND` (404). `org_id` enforced on all queries. Named exports only. | PASS |
| III | **Testing Discipline** — Unit tests: archive/unarchive use case (valid transitions, already-archived idempotency, not-found, role check). Integration tests: PATCH endpoints happy path + `org_id` boundary + role enforcement. No state machine changes. E2E: archive from overview table + unarchive from detail page. | PASS |
| IV | **UX Consistency** — Archived specs rendered read-only (no edit affordances). Role guards: archive/unarchive actions not rendered for members (conditional render, not route-level guard since members can view archived specs). No polling changes (on-demand fetch). Domain UI in `packages/domains/authoring/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Mutation hooks accept `invalidateKeys`. | PASS |
| V | **Run Immutability** — Feature does not touch run data. Archiving a spec has no effect on existing runs (runs are snapshotted at start time). N/A. | PASS |
| VI | **Domain Errors** — No new error codes needed. The archive use case throws `AUTHOR_SPEC_NOT_FOUND` (404) when spec doesn't exist; `AUTH_ROLE_INSUFFICIENT` (403) is enforced by `roleGuard` middleware. `AUTHOR_SPEC_ARCHIVED` (409) already exists for the separate update-spec path and is unaffected. Unit tests will assert correct error codes for each error path. | PASS |
| VII | **Observability (OTel)** — New `archiveLibrarySpec` and `unarchiveLibrarySpec` use cases will have auto-instrumented route spans via `@fastify/otel`. Custom span attributes: `spec.id`, `spec.action` (archive/unarchive), `org.slug`. No manual spans needed beyond route-level auto-instrumentation + `getSpan(request)` for attributes. | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/024-archive-spec/
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
  schemas/specs.ts                          # MODIFY: add "archived"/"unarchived" to SpecHistoryActionSchema

packages/domains/authoring/src/
  use-cases/archive-library-spec.ts         # MODIFY: replace TODO stub with implementation
  ports/spec-library-repository.ts          # MODIFY: add setArchived() method to port interface

packages/domains/authoring/src/ui/
  hooks/use-archive-spec.ts                 # NEW: archive mutation hook
  hooks/use-unarchive-spec.ts               # NEW: unarchive mutation hook
  components/SpecLibraryTable.tsx            # MODIFY: add action menu with Archive/Unarchive
  components/SpecDetail.tsx                  # MODIFY: add Archived badge
  components/SpecDetailActions.tsx           # NEW: header action buttons (Archive/Unarchive/Edit)
  index.ts                                  # MODIFY: export new hooks and components

apps/api/src/
  routes/authoring.ts                       # MODIFY: add PATCH archive/unarchive endpoints
  adapters/repositories/
    kysely-spec-library-repository.ts       # MODIFY: implement setArchived()

apps/app/src/
  api/query-keys.ts                         # No changes needed (existing keys sufficient)
  routes/_authenticated/$orgSlug/
    spec-library/index.tsx                  # MODIFY: wire archive/unarchive actions to table
    spec-library/$specId.index.tsx          # MODIFY: wire SpecDetailActions with archive/unarchive
    spec-library/$specId.edit.tsx           # MODIFY: redirect on archived spec (already handled)
  app.tsx                                   # MODIFY: wrap with ToastProvider
  components/ui/Toast.tsx                   # NEW: toast notification component (app-global primitive)
  components/ui/ConfirmDialog.tsx           # NEW: reusable confirm dialog (app-global primitive)
```

**Structure Decision**: Follows the existing monorepo hexagonal architecture. Domain use case and repository port in `packages/domains/authoring/`. UI components and hooks in `packages/domains/authoring/src/ui/`. Route wiring in `apps/app/src/routes/`. API routes in `apps/api/src/routes/`. App-global UI primitives (Toast, ConfirmDialog) in `apps/app/src/components/ui/`.

## Complexity Tracking

> No constitution violations. No complexity justification needed.
