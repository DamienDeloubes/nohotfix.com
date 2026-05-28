# Quickstart: Archive Spec

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (docker-compose up)
- `pnpm install` from repo root

## Development

```bash
# Start all services
docker-compose up -d

# Run API in dev mode
pnpm --filter api dev

# Run app in dev mode (separate terminal)
pnpm --filter app dev
```

## Key Files to Modify

### Backend (in order)

1. **Schema**: `packages/shared/src/schemas/specs.ts` — add `'archived'`, `'unarchived'` to `SpecHistoryActionSchema`
2. **Port**: `packages/domains/authoring/src/ports/spec-library-repository.ts` — add `setArchived()` method
3. **Use case**: `packages/domains/authoring/src/use-cases/archive-library-spec.ts` — replace TODO stub
4. **Adapter**: `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` — implement `setArchived()`
5. **Routes**: `apps/api/src/routes/authoring.ts` — add PATCH archive/unarchive endpoints

### Frontend (in order)

1. **UI primitives**: `apps/app/src/components/ui/Toast.tsx`, `ConfirmDialog.tsx` — new reusable components
2. **Hooks**: `packages/domains/authoring/src/ui/hooks/use-archive-spec.ts`, `use-unarchive-spec.ts`
3. **Components**: Modify `SpecLibraryTable.tsx` (action menus), `SpecDetail.tsx` (badge), new `SpecDetailActions.tsx`, `ArchiveConfirmDialog.tsx`
4. **Routes**: Modify `spec-library/index.tsx` and `$specId.index.tsx` to wire actions
5. **History**: Update `describeHistoryAction()` utility for new action types

## Testing

```bash
# Unit tests (domain use case)
pnpm --filter @nohotfix/domain-authoring test

# Integration tests (API routes)
pnpm --filter api test

# All tests
pnpm turbo run test

# Type checking
pnpm turbo run typecheck
```

## Verification Checklist

- [ ] Archive from overview table → spec moves to Archived tab
- [ ] Archive from detail page → redirect to overview, spec on Archived tab
- [ ] Unarchive from Archived tab → spec moves to Active tab
- [ ] Unarchive from archived detail page → badge removed, edit button appears
- [ ] Cancel archive confirmation → no change
- [ ] Member cannot see archive/unarchive actions
- [ ] Changelog shows "Archived" / "Unarchived" entries
- [ ] Edit URL for archived spec redirects to detail page
- [ ] Error toast on API failure with optimistic rollback
