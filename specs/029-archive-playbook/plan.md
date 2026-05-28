# Implementation Plan: Archive & Unarchive Playbook

**Branch**: `029-archive-playbook` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/029-archive-playbook/spec.md`

## Summary

Allow admins/owners to archive and unarchive playbooks, toggling the existing `is_archived` boolean column on the `playbooks` table. Archived playbooks are hidden from the Active tab, rendered read-only on the detail page with an "Archived" badge, and prevented from starting new runs. Both actions are recorded in the changelog. The implementation follows the established archive-spec (027) pattern: idempotent PATCH endpoints, optimistic UI updates, role-guarded actions, and transactional changelog recording.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `playbooks` table -- `is_archived` column already exists; no migration required)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service + SPA
**Performance Goals**: API read <500ms p95, API write <1000ms p95
**Constraints**: `org_id` on all tenant queries, run immutability untouched
**Scale/Scope**: 3 new API routes (archive, unarchive, archive-info), 1 new use case, 3 new UI hooks, updated list/detail pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** -- Feature assigned to **Authoring** context. All domain logic in `packages/domains/authoring/`. No cross-domain imports. Use cases consume port interfaces only. API routes in `apps/api/src/routes/authoring.ts`. UI hooks in `packages/domains/authoring/src/ui/hooks/`. Dual entry-point consumer rules respected (`apps/api` imports logic only; `apps/app` imports both logic + `/ui`). | PASS |
| II | **Code Quality & Simplicity** -- Hexagonal architecture maintained: use case is pure TypeScript, no infrastructure deps. Composition root wires `PlaybookRepository` port to Kysely adapter. `AUTHOR_PLAYBOOK_ARCHIVED` error code follows taxonomy. HTTP status codes only in API error handler. Named exports. `org_id` in all queries. No premature abstractions -- reuses existing `update()` repository method for `isArchived` toggle. | PASS |
| III | **Testing Discipline** -- Unit tests: archive/unarchive use case logic (idempotency, role rejection, already-archived no-op). Integration tests: archive/unarchive endpoints (happy path, member rejection with `AUTH_ROLE_INSUFFICIENT`, `org_id` boundary, write rejection on archived playbook). No state machine changes; no immutability guard changes. E2E: archive from list, unarchive from archived tab. | PASS |
| IV | **UX Consistency** -- Archived playbook detail renders read-only (consistent with archived spec pattern). Confirmation dialog before archive (destructive-feeling action). Role guards: "Archive"/"Unarchive" not rendered for members in UI. Playbook editor: no polling (per constitution table). Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain hooks accept `queryKey`/`invalidateKeys` params. | PASS |
| V | **Run Immutability** -- Feature does NOT touch run data. Runs are immutable snapshots. Archiving a playbook does not affect any existing runs. The only run-adjacent interaction is querying active run count for the confirmation dialog (read-only). No middleware guard changes needed. | PASS (N/A) |
| VI | **Domain Errors** -- New error code `AUTHOR_PLAYBOOK_ARCHIVED` registered in `packages/shared/src/errors/codes.ts`. Domain error class `PlaybookArchivedError` created in `packages/domains/authoring/src/errors/`. Unit tests assert correct error codes for: write to archived playbook, member attempting archive/unarchive. | PASS |
| VII | **Observability (OTel)** -- Manual OTel span on archive/unarchive route handlers via `getSpan(request)` with attributes: `playbook.id`, `playbook.isArchived`, `org.id`. DB queries use existing Kysely instrumentation. No custom spans needed beyond route-level (single UPDATE query, no complex orchestration like SnapshotService). | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/029-archive-playbook/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/shared/src/errors/codes.ts                          # Add AUTHOR_PLAYBOOK_ARCHIVED
packages/shared/src/schemas/playbooks.ts                     # Add 'archived'/'unarchived' to playbook history actions

packages/domains/authoring/src/
├── errors/playbook-archived-error.ts                        # New domain error class
├── use-cases/archive-playbook.ts                            # New use case (archive + unarchive)
├── ports/playbook-repository.ts                             # Existing -- no changes needed (update already accepts isArchived)
└── ui/
    ├── hooks/use-archive-playbook.ts                        # New mutation hook
    ├── hooks/use-unarchive-playbook.ts                      # New mutation hook
    ├── hooks/use-playbook-archive-info.ts                   # New query hook (active run count)
    └── components/ArchivePlaybookDialog.tsx                  # Confirmation dialog component

apps/api/src/
├── routes/authoring.ts                                      # Add PATCH .../archive, PATCH .../unarchive, GET .../archive-info (run count via API-layer orchestration, no domain port)
├── routes/execution.ts                                      # Add archived-playbook check on run creation
└── shared/middleware/archived-playbook-guard.ts              # New preHandler guard for playbook write routes

apps/app/src/
├── api/query-keys.ts                                        # No changes needed (playbookKeys.list filters handle archived)
├── routes/(org)/playbooks/index.tsx                          # Add Archived tab, conditionally render action menus
└── routes/(org)/playbooks/$playbookId.tsx                    # Add read-only mode, Archived badge, archive/unarchive actions
```

**Structure Decision**: Standard monorepo hexagonal layout. All domain logic in `packages/domains/authoring/`, API routes in `apps/api/src/routes/authoring.ts`, UI composition in `apps/app/src/routes/`. No new packages or structural changes.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
