# Implementation Plan: Spec Library Overview

**Branch**: `020-spec-library-overview` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-spec-library-overview/spec.md`

## Summary

Build a paginated, searchable, sortable, filterable spec library overview page. The backend extends the existing Authoring context with a list endpoint supporting server-side search (trigram-indexed), severity filtering, multi-column sorting, and offset/limit pagination. The frontend adds URL-synced state via TanStack Router search params, a domain table component with sort indicators, severity badges, tag pills, and empty/error states. No database migration required — all needed columns and indexes already exist.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `spec_library` table — no migration)
**Testing**: Vitest (unit + integration)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo: API + SPA)
**Performance Goals**: List endpoint <500ms p95 for 500 specs with search/filter/sort
**Constraints**: Fixed page size 25, offset/limit pagination, server-side search/sort/filter
**Scale/Scope**: <500 specs per org (typical B2B SaaS)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to Authoring context. Port interface in `packages/domains/authoring/src/ports/`. Use case in `packages/domains/authoring/src/use-cases/`. UI components in `packages/domains/authoring/src/ui/`. No cross-domain imports. Domain package imports only `@nohotfix/shared` and `zod`. Dual entry-point consumer rules: `apps/api` imports logic only; `apps/app` imports both logic and UI. | PASS |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained: domain use case is transport-agnostic (accepts query params object, returns DTO). Repository port is an interface; Kysely adapter implements it in `apps/api/src/adapters/`. Composition root wires adapter to port. HTTP status codes only in error handler. Named exports. `org_id` mandatory in all queries. Error taxonomy used. Naming conventions followed (kebab-case files, PascalCase components). | PASS |
| III | **Testing Discipline** — Unit tests for use case (search escaping, pagination math, sort mapping). Integration tests for API endpoint (happy path, search, filter, sort, pagination, empty results, org_id boundary, invalid params). No state machine or immutability concerns for this read-only feature. | PASS |
| IV | **UX Consistency** — Domain UI in `packages/domains/authoring/src/ui/`. Route file composes domain components. Query keys centralised in `apps/app/src/api/query-keys.ts` — existing `specKeys.list(orgSlug, filters)` factory already supports filter params. Domain hooks accept `queryKey` param. No polling needed (on-demand fetch, like "Run history list" in constitution table). Error states surface recovery actions. Loading states on all async ops. | PASS |
| V | **Run Immutability** — Feature does not touch run data. Not applicable. | N/A |
| VI | **Domain Errors** — No new domain error codes needed. List endpoint returns empty results for no-match scenarios (not errors). Existing system error codes (`SYS_DATABASE`, `SYS_INTERNAL`) cover infrastructure failures. Validation failures use standard 400 responses. | PASS |
| VII | **Observability (OTel)** — List use case will have OTel span via `@fastify/otel` auto-instrumentation on the route. Custom span attributes: `org.slug`, `search.term`, `filter.severity`, `filter.tab`, `sort.column`, `sort.order`, `result.total`. DB query spans annotated automatically by Kysely adapter. Slow query threshold (>100ms) respected. | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/020-spec-library-overview/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api.md           # API contract
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
  schemas/
    specs.ts                          # + ListSpecsRequestSchema, SpecListItemSchema, SpecListResultSchema

packages/domains/authoring/src/
  ports/
    spec-library-repository.ts        # + list() method on existing interface
  use-cases/
    list-library-specs.ts             # NEW — list use case
    list-library-specs.test.ts        # NEW — unit tests
  ui/
    hooks/
      use-spec-list.ts               # NEW — TanStack Query hook
    components/
      SpecLibraryTable.tsx            # NEW — table with sort headers, rows, action menus
      SpecSearchBar.tsx               # NEW — debounced search input with clear button
      SeverityFilterDropdown.tsx      # NEW — severity dropdown
      SeverityBadge.tsx               # NEW — colour-coded badge
      TagPills.tsx                    # NEW — tag pills with overflow
      SpecLibraryPagination.tsx       # NEW — pagination controls
      SpecLibraryEmptyState.tsx       # NEW — empty/no-results/error states

apps/api/src/
  adapters/repositories/
    kysely-spec-library-repository.ts # + list() implementation
  routes/
    authoring.ts                      # + GET /api/orgs/:orgSlug/specs endpoint
    authoring.spec.ts                 # + integration tests for list endpoint

apps/app/src/
  api/
    query-keys.ts                     # Already has specKeys.list(orgSlug, filters) — no changes needed
  routes/_authenticated/$orgSlug/
    spec-library/
      index.tsx                       # UPDATE — add validateSearch, compose domain components
```

**Structure Decision**: Extends existing Authoring context packages. No new packages or contexts created. All new files follow the established hexagonal architecture layout.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
