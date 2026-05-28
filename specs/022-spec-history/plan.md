# Implementation Plan: Spec History

**Branch**: `022-spec-history` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-spec-history/spec.md`

## Summary

Add a complete audit trail for spec changes by leveraging the existing `changelog` table. When a spec is created or updated, the system records granular per-field history entries. A new read endpoint and frontend "History" tab on the spec detail page display the timeline. No database migration is required — the existing schema fully supports this feature.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `changelog` table — no schema changes)
**Testing**: Vitest (unit + integration)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service + SPA
**Performance Goals**: History endpoint < 500ms p95; timeline renders < 2s for 500 entries
**Constraints**: All changelog queries MUST include `org_id`; append-only writes
**Scale/Scope**: Typical spec accumulates < 100 history entries; upper bound ~500

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Audit** (history recording + retrieval). Cross-domain coordination via API-layer orchestration (route handler calls Authoring use case then Audit use case). No cross-domain imports. Domain packages depend only on `@nohotfix/shared`. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained: change detection is a pure function in Audit domain; Kysely query lives in adapter. Composition root wires repos. `org_id` on all changelog queries. Error taxonomy used (reuses `AUTHOR_SPEC_NOT_FOUND`). Named exports. | ✅ |
| III | **Testing Discipline** — Unit tests: `recordSpecChanges` change detection (all action types + no-op). Integration tests: history endpoint happy path + `org_id` boundary + removed member display. No state machine or immutability changes. | ✅ |
| IV | **UX Consistency** — History tab is read-only (no edit affordances). No polling needed (on-demand fetch per constitution table — history is not time-critical). Domain UI in `packages/domains/authoring/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain hooks accept `queryKey` as parameter. | ✅ |
| V | **Run Immutability** — Feature does NOT touch run data. No immutability guard changes needed. | ✅ N/A |
| VI | **Domain Errors** — No new error codes needed. Reuses `AUTHOR_SPEC_NOT_FOUND` (404) for history of non-existent spec. No new error paths introduced (history recording failures are logged, not user-facing). | ✅ |
| VII | **Observability (OTel)** — OTel spans on: `getSpecChangelog` use case, `recordSpecChanges` use case. Kysely queries auto-instrumented. Slow query annotation follows existing patterns. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/022-spec-history/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # API contract for history endpoint
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/
├── schemas/
│   └── specs.ts                          # ADD: SpecHistoryEntrySchema, SpecHistoryResponseSchema
└── types/
    └── specs.ts                          # ADD: SpecHistoryEntry, SpecHistoryAction types

packages/domains/audit/src/
├── types.ts                              # ADD: SpecHistoryAction type, SpecChangelogEntry interface
├── use-cases/
│   ├── record-spec-changes.ts            # NEW: change detection + multi-entry recording
│   └── get-spec-changelog.ts             # IMPLEMENT: currently a stub
└── ports/
    └── changelog-repository.ts           # ADD: findBySpecWithMembership method

packages/domains/authoring/src/
└── ui/
    ├── components/
    │   └── SpecHistoryTimeline.tsx        # NEW: timeline display component
    └── hooks/
        └── use-spec-history.ts           # NEW: TanStack Query hook

apps/api/src/
├── routes/
│   └── authoring.ts                      # ADD: GET .../history endpoint; call recordSpecChanges on update
└── adapters/
    └── repositories/
        └── kysely-changelog-repository.ts # ADD: findBySpecWithMembership (LEFT JOIN memberships)

apps/app/src/
├── api/
│   └── query-keys.ts                     # ADD: specKeys.history(orgSlug, specId)
└── routes/_authenticated/$orgSlug/spec-library/
    └── $specId.tsx                        # MODIFY: add History tab with tab state management
```

**Structure Decision**: Follows the existing monorepo hexagonal architecture. Write-side logic (change detection) lives in the Audit domain package. Read-side query lives in the Kysely adapter. Frontend components live in the Authoring domain UI package (since the History tab is part of the spec detail page, owned by Authoring). The route handler orchestrates across both domains.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
