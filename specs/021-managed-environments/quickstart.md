# Quickstart: Managed Environments

**Branch**: `021-managed-environments` | **Date**: 2026-03-11

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (via `docker compose up -d`)
- `pnpm install` at repo root

## Development Commands

```bash
# Start all services
pnpm turbo run dev

# Run migrations (after adding new migration)
pnpm --filter db migrate

# Type check
pnpm turbo run typecheck

# Run tests
pnpm turbo run test

# Lint
pnpm turbo run lint
```

## Implementation Order

1. **packages/shared** — Add error codes + Zod schemas
2. **packages/db** — Migration (new table + seed + playbooks column change) + schema types
3. **packages/domains/identity** — Entity, value object, port, use cases, errors
4. **apps/api** — Repository adapter, composition root wiring, route handlers
5. **packages/domains/identity/ui** — TanStack Query hooks
6. **apps/app** — Settings page route + query keys

## Key Files to Create/Modify

### New Files
- `packages/db/src/migrations/006_create_environments_table.ts`
- `packages/shared/src/schemas/environments.ts`
- `packages/domains/identity/src/entities/environment.ts`
- `packages/domains/identity/src/entities/environment-name.ts` (value object)
- `packages/domains/identity/src/ports/environment-repository.ts`
- `packages/domains/identity/src/use-cases/list-environments.ts`
- `packages/domains/identity/src/use-cases/create-environment.ts`
- `packages/domains/identity/src/use-cases/rename-environment.ts`
- `packages/domains/identity/src/use-cases/delete-environment.ts`
- `packages/domains/identity/src/use-cases/reorder-environments.ts`
- `apps/api/src/adapters/repositories/kysely-environment-repository.ts`
- `packages/domains/identity/src/ui/hooks/use-environments.ts`
- `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx`

### Modified Files
- `packages/shared/src/errors/codes.ts` — add 4 error codes
- `packages/db/src/schema.ts` — add EnvironmentsTable, update PlaybooksTable
- `packages/domains/identity/src/errors/index.ts` — add 4 error classes
- `apps/api/src/composition-root.ts` — wire environment repository
- `apps/api/src/routes/identity.ts` — add environment route handlers
- `apps/app/src/api/query-keys.ts` — add environment keys
- `packages/domains/identity/src/use-cases/create-organisation.ts` — seed defaults on org creation

## Testing Strategy

- **Unit tests**: Entity create/reconstitute, value object validation, use case logic (mock repository)
- **Integration tests**: API endpoints (happy path + error paths + org_id tenancy boundary)
- No E2E tests needed — settings page is not a critical user journey
