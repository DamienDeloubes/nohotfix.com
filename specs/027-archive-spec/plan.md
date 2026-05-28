# Implementation Plan: Archive & Unarchive Spec

**Branch**: `027-archive-spec` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/027-archive-spec/spec.md`

## Summary

Enhance the existing archive/unarchive spec functionality to atomically remove archived specs from all playbook templates (active and archived), add a pre-archive endpoint that returns affected playbook names for the confirmation dialog, make archive/unarchive idempotent, and update the frontend confirmation dialog to display playbook impact information.

The core infrastructure (endpoints, use case, repository, hooks, UI tabs) already exists. This plan focuses on the **delta**: playbook cascade removal, impact preview endpoint, idempotency, and confirmation dialog enhancements.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod
**Storage**: PostgreSQL (existing `spec_library`, `playbook_specs`, `playbooks`, `changelog` tables — no migration)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo)
**Performance Goals**: Standard B2B SaaS — archive endpoint <1000ms p95 (write), impact preview <500ms p95 (read)
**Constraints**: Archive + playbook removal must be atomic (single transaction); no migration required
**Scale/Scope**: Typical org has <100 specs, <20 playbooks — no pagination needed for impact preview

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Authoring**. Archive use case lives in `packages/domains/authoring/`. Playbook spec removal uses existing ports within the same context. Changelog recording crosses to **Audit** via API-layer orchestration (existing pattern). No new cross-domain imports. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal architecture maintained: new `removeByLibrarySpecId` port method on PlaybookSpecRepository; Kysely adapter in `apps/api/src/adapters/`. Composition root already wires all needed repos. Named exports, `org_id` on all queries, error taxonomy used. | ✅ |
| III | **Testing Discipline** — Unit tests for updated `archiveLibrarySpec` use case (happy + error paths). Integration tests for archive endpoint covering playbook cascade, idempotency, and `org_id` boundary. Frontend component tests for dialog content variants. | ✅ |
| IV | **UX Consistency** — Destructive action (archive) has confirmation dialog. Terminal archived state is visually distinct (badge + read-only). Role guards at route level via `roleGuard({ minimum: 'admin' })`. Query keys centralised in `apps/app/src/api/query-keys.ts`. Domain hooks accept `invalidateKeys`. | ✅ |
| V | **Run Immutability** — Feature does NOT touch run data. Runs are snapshotted at start time and are immutable. Archive only affects playbook templates. | ✅ N/A |
| VI | **Domain Errors** — Existing error codes: `AUTHOR_SPEC_NOT_FOUND`, `AUTHOR_SPEC_ARCHIVED`. No new error codes needed — archive/unarchive of already-archived/already-active spec becomes idempotent (no error). | ✅ |
| VII | **Observability (OTel)** — Existing archive/unarchive route handlers already have span attributes. The `withTransaction` wrapper already creates a `db.transaction` span. New `removeByLibrarySpecId` query inherits DB-level tracing. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/027-archive-spec/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/domains/authoring/src/
  use-cases/
    archive-library-spec.ts       # MODIFY — add playbook removal + idempotency
    get-archive-impact.ts         # NEW — return affected playbook names
  ports/
    playbook-spec-repository.ts   # MODIFY — add removeByLibrarySpecId method
  ui/
    hooks/
      use-archive-impact.ts       # NEW — TanStack Query hook for impact preview
    ArchiveConfirmDialog.tsx       # NEW — extracted confirmation dialog component

packages/shared/src/
  schemas/
    specs.ts                      # MODIFY — add ArchiveImpactResponseSchema

apps/api/src/
  routes/
    authoring.ts                  # MODIFY — add impact preview endpoint, update archive handler
  adapters/repositories/
    kysely-playbook-spec-repository.ts  # MODIFY — add removeByLibrarySpecId

apps/app/src/
  routes/_authenticated/$orgSlug/
    spec-library/index.tsx        # MODIFY — use new ArchiveConfirmDialog with impact data
    spec-library/$specId.index.tsx  # MODIFY — use new ArchiveConfirmDialog, fix redirect to Active tab
    spec-library/$specId/edit.tsx   # MODIFY — redirect to detail page instead of error state

  api/
    query-keys.ts                 # MODIFY — add specKeys.impact factory, add playbookKeys invalidation
```

**Structure Decision**: All changes fit within the existing monorepo structure. New files are minimal — one use case, one schema, one hook, one UI component. The rest is modification of existing files.

## Complexity Tracking

No constitution violations. No complexity justification needed.
