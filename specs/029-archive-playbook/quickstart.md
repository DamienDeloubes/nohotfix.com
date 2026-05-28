# Quickstart: Archive & Unarchive Playbook

**Branch**: `029-archive-playbook` | **Date**: 2026-03-12

## Prerequisites

- Local dev environment running (`pnpm dev`)
- PostgreSQL with migrations applied (`pnpm db:migrate`)
- At least one playbook created in the test org

## Key Reference Files

| What | Path |
|------|------|
| Archive-spec use case (pattern) | `packages/domains/authoring/src/use-cases/archive-library-spec.ts` |
| Archive-spec route (pattern) | `apps/api/src/routes/authoring.ts` (search for `/archive`) |
| Archive-spec UI hooks (pattern) | `packages/domains/authoring/src/ui/hooks/use-archive-spec.ts` |
| Playbook repository port | `packages/domains/authoring/src/ports/playbook-repository.ts` |
| Playbook Kysely adapter | `apps/api/src/adapters/repositories/authoring.ts` (search for `KyselyPlaybookRepository`) |
| Error codes | `packages/shared/src/errors/codes.ts` |
| Playbook schemas | `packages/shared/src/schemas/playbooks.ts` |
| Query keys | `apps/app/src/api/query-keys.ts` |
| Composition root | `apps/api/src/composition-root.ts` |
| Playbook list page | `apps/app/src/routes/(org)/playbooks/index.tsx` (or similar) |
| Playbook detail page | `apps/app/src/routes/(org)/playbooks/$playbookId.tsx` (or similar) |
| Describe playbook history action | `packages/domains/audit/src/ui/lib/describe-playbook-history-action.ts` |

## Implementation Order

1. **Error code + schema updates** (packages/shared) -- foundation for types
2. **Domain error class** (packages/domains/authoring) -- `PlaybookArchivedError`
3. **Use case** (packages/domains/authoring) -- `archivePlaybook` / `unarchivePlaybook`
4. **API routes** (apps/api) -- PATCH archive/unarchive + GET archive-info + archived guard on write routes
5. **UI hooks** (packages/domains/authoring/ui) -- mutation + query hooks
6. **UI components** (packages/domains/authoring/ui) -- `ArchivePlaybookDialog`
7. **Page updates** (apps/app) -- Archived tab, read-only detail, action menus
8. **History action descriptions** (packages/domains/audit/ui) -- handle 'archived'/'unarchived'
9. **Tests** -- unit, integration, E2E

## Verification Commands

```bash
# Type check
pnpm turbo run typecheck

# Unit + integration tests
pnpm turbo run test

# Build all
pnpm turbo run build

# Full CI check
pnpm turbo run build typecheck test
```

## Gotchas

- The `playbooks.is_archived` column already exists -- no migration needed
- The `PlaybookRepository.update()` already accepts `isArchived` -- no port changes needed
- The archive-spec pattern is the primary reference; follow it closely for consistency
- Remember to guard ALL existing playbook write routes against archived state, not just the new ones
- The `runs` table query for active count is a cross-context read -- do it in the route handler (API-layer orchestration), not in a domain use case
- Changelog entries use `field_changes: null` for archive/unarchive (no field diffs)
- Idempotent: archiving an already-archived playbook returns `wasChanged: false` and does NOT create a duplicate changelog entry
