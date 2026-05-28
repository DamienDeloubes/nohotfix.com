# Quickstart: Archive & Unarchive Spec

**Branch**: `027-archive-spec` | **Date**: 2026-03-12

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (via `docker-compose up -d`)
- `.env` files configured (`apps/api/.env`, `apps/app/.env.local`)

## Setup

```bash
git checkout 027-archive-spec
pnpm install
pnpm turbo run build typecheck
```

## Development

```bash
# Start API + App concurrently
pnpm --filter api dev &
pnpm --filter app dev &
```

## Key Files to Modify

### Backend (in order of implementation)

1. **Port**: `packages/domains/authoring/src/ports/playbook-spec-repository.ts`
   - Add `removeByLibrarySpecId(specLibraryId: string, orgId: string): Promise<number>`

2. **Adapter**: `apps/api/src/adapters/repositories/kysely-playbook-spec-repository.ts`
   - Implement `removeByLibrarySpecId` — bulk DELETE

3. **Use case (new)**: `packages/domains/authoring/src/use-cases/get-archive-impact.ts`
   - Query playbook_specs → playbooks to find affected playbook names

4. **Use case (modify)**: `packages/domains/authoring/src/use-cases/archive-library-spec.ts`
   - Add idempotency check
   - Add playbook spec removal via `playbook-spec-repository.removeByLibrarySpecId`

5. **Shared schema**: `packages/shared/src/schemas/specs.ts`
   - Add `ArchiveImpactResponseSchema`

6. **Route**: `apps/api/src/routes/authoring.ts`
   - Add GET `/specs/:specId/archive-impact`
   - Update PATCH archive handler to pass `playbookSpecRepo` to use case

### Frontend (in order of implementation)

7. **Query keys**: `apps/app/src/api/query-keys.ts`
   - Add `specKeys.impact(orgSlug, specId)`

8. **Hook (new)**: `packages/domains/authoring/src/ui/hooks/use-archive-impact.ts`
   - TanStack Query hook for the impact endpoint

9. **Component (new)**: `packages/domains/authoring/src/ui/ArchiveConfirmDialog.tsx`
   - Extracted dialog with playbook impact display

10. **Routes**: Update spec library index + detail page to use new dialog component

## Testing

```bash
# Unit tests (domain)
pnpm --filter @releasepilot/domain-authoring test

# Integration tests (API)
pnpm --filter api test

# Type check
pnpm turbo run typecheck
```

## Verification Checklist

- [ ] Archive a spec not referenced by any playbook → generic confirmation, spec moves to Archived tab
- [ ] Archive a spec referenced by 2 active playbooks → dialog shows playbook names, specs removed from playbooks
- [ ] Archive a spec referenced by active + archived playbooks → dialog groups them separately
- [ ] Unarchive a spec → no confirmation dialog, spec returns to Active tab, NOT re-added to playbooks
- [ ] Archive from detail page → redirects to Active tab of spec library
- [ ] Member cannot see Archive/Unarchive buttons
- [ ] Navigate to edit URL of archived spec → redirected to detail page
