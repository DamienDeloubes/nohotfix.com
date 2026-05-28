# Quickstart: Spec Library Overview

**Branch**: `020-spec-library-overview` | **Date**: 2026-03-10

## Prerequisites

- Node.js 20+, pnpm installed
- PostgreSQL running locally (or via `docker-compose up db`)
- `apps/api/.env.local` and `apps/app/.env.local` configured

## Setup

```bash
pnpm install
pnpm --filter @nohotfix/db run migrate  # Ensure migrations are up to date
```

## Development

```bash
# Terminal 1: Start API
pnpm --filter api dev

# Terminal 2: Start App
pnpm --filter app dev
```

## Key Files to Implement

### Backend (Authoring Context)

1. **Port extension**: `packages/domains/authoring/src/ports/spec-library-repository.ts`
   - Add `list()` method to existing `SpecLibraryRepository` interface

2. **Use case**: `packages/domains/authoring/src/use-cases/list-library-specs.ts`
   - New use case for listing specs with search/filter/sort/pagination

3. **Adapter**: `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts`
   - Implement `list()` method with Kysely query builder

4. **Shared schemas**: `packages/shared/src/schemas/specs.ts`
   - Add `ListSpecsRequestSchema` and `SpecListResultSchema`

5. **Route**: `apps/api/src/routes/authoring.ts`
   - Replace stub `GET /api/orgs/:orgSlug/specs` with list endpoint

### Frontend (Authoring UI)

6. **Domain hook**: `packages/domains/authoring/src/ui/hooks/use-spec-list.ts`
   - TanStack Query hook for the list endpoint

7. **Domain components**: `packages/domains/authoring/src/ui/components/`
   - `SpecLibraryTable.tsx` — table with rows, sort headers, action menus
   - `SpecSearchBar.tsx` — debounced search input
   - `SeverityFilterDropdown.tsx` — severity filter select
   - `SeverityBadge.tsx` — colour-coded severity badge
   - `TagPills.tsx` — tag display with overflow
   - `SpecLibraryPagination.tsx` — page controls
   - `SpecLibraryEmptyState.tsx` — empty/no-results/error states

8. **Route file**: `apps/app/src/routes/_authenticated/$orgSlug/spec-library/index.tsx`
   - Update with `validateSearch`, compose domain components

## Testing

```bash
# Unit tests (domain logic)
pnpm --filter @nohotfix/domain-authoring test

# Integration tests (API routes)
pnpm --filter api test

# Type check
pnpm turbo run typecheck
```

## API Testing (Manual)

```bash
# List active specs (default)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/orgs/my-org/specs"

# Search + filter
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/orgs/my-org/specs?q=login&severity=critical&sort=title&order=asc&page=1"

# Archived specs
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/orgs/my-org/specs?tab=archived"
```
