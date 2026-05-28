# Implementation Plan: Playbook Change History

**Branch**: `028-playbook-history` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-playbook-history/spec.md`

## Summary

Append-only changelog for all playbook mutations (15 action types), surfaced as a read-only History tab on the playbook editor/detail page. Uses the existing `changelog` table with `entity_type='playbook'`. Records one entry per mutation (one per field for metadata changes). Follows the established spec history pattern: shared types in `@releasepilot/shared`, use cases in `@releasepilot/domain-audit`, changelog writes co-transactional with mutations, removed-member detection via LEFT JOIN, and domain UI hooks accepting centralised query keys.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `changelog` table — no migration required)
**Testing**: Vitest (unit + integration)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service + SPA
**Performance Goals**: History endpoint < 500ms p95 (read endpoint SLO)
**Constraints**: All changelog writes within the same DB transaction as the mutation
**Scale/Scope**: ~15 route handler modifications, 2 new use cases, 3 new UI files, shared type additions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Audit** (use cases, types). Recording is triggered from **Authoring** routes (API-layer orchestration). Domain packages have no infrastructure deps. Dual entry-point rules respected: `@releasepilot/domain-audit` for logic, `/ui` for hooks/components. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal maintained: use cases are pure functions accepting repository ports. Composition root wires `KyselyChangelogRepository` to `ChangelogRepository` port. HTTP status codes only in error handler. Named exports. `org_id` on all changelog queries. Error taxonomy used (`AUDIT_PLAYBOOK_NOT_FOUND`). | ✅ |
| III | **Testing Discipline** — Unit tests: `record-playbook-changes` diff detection for all 15 actions, edge cases (no changes, null→value, value→null). Integration tests: history endpoint happy path + `org_id` boundary + removed member display. No E2E needed (passive read-only tab, not a critical user journey). | ✅ |
| IV | **UX Consistency** — History tab is read-only (no terminal state editing concern). No polling needed (on-demand fetch, per constitution table: playbook editor = no polling). Domain UI in `packages/domains/audit/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain hooks accept `queryKey` as parameter. | ✅ |
| V | **Run Immutability** — Feature does not touch run data. N/A. | ✅ N/A |
| VI | **Domain Errors** — New error code `AUDIT_PLAYBOOK_NOT_FOUND` for history endpoint when playbook doesn't exist. Registered in `packages/shared/src/errors/codes.ts`. Domain error class in `packages/domains/audit/src/errors/`. Unit tests assert error code. | ✅ |
| VII | **Observability (OTel)** — OTel spans on `getPlaybookChangelog` use case and `recordPlaybookChanges` use case. Custom span attributes: `playbook.id`, `changelog.action`, `changelog.entry_count`. DB query slow-annotation threshold respected. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/028-playbook-history/
├── spec.md
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
├── schemas/
│   └── playbooks.ts                          # + PLAYBOOK_HISTORY_ACTIONS, PlaybookHistoryActionSchema
├── types/
│   └── index.ts                              # + PlaybookHistoryAction, PlaybookHistoryEntry, PlaybookHistoryResponse
└── errors/
    └── codes.ts                              # + AUDIT_PLAYBOOK_NOT_FOUND

packages/domains/audit/src/
├── types.ts                                  # + PlaybookChangelogEntry type
├── ports/
│   └── changelog-repository.ts               # + findByPlaybookWithMembership()
├── use-cases/
│   ├── record-playbook-changes.ts            # NEW: diff detection for playbook metadata
│   └── get-playbook-changelog.ts             # REPLACE stub with implementation
├── errors/
│   └── index.ts                              # + AuditPlaybookNotFoundError
└── ui/
    ├── hooks/
    │   └── use-playbook-history.ts            # NEW: TanStack Query hook
    ├── components/
    │   └── PlaybookHistoryTimeline.tsx         # NEW: read-only timeline component
    └── lib/
        └── describe-playbook-history-action.ts # NEW: action → human description

apps/api/src/
├── adapters/repositories/
│   └── kysely-changelog-repository.ts         # + findByPlaybookWithMembership()
└── routes/
    ├── authoring.ts                           # + changelog recording in all 11 playbook mutation handlers
    └── audit.ts                               # + implement GET /api/orgs/:orgSlug/playbooks/:playbookId/history

apps/app/src/
├── api/
│   └── query-keys.ts                          # + playbookKeys.history()
└── routes/_authenticated/$orgSlug/
    └── playbooks/$playbookId.index.tsx         # + History tab wiring
```

**Structure Decision**: Follows existing hexagonal architecture. Audit domain owns use cases and UI. Authoring routes orchestrate recording. No new packages or structural changes.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
