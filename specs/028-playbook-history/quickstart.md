# Quickstart: Playbook Change History

**Branch**: `028-playbook-history` | **Date**: 2026-03-12

## Prerequisites

- Node.js 20+, PNPM 9+
- PostgreSQL running (via `docker compose up -d`)
- `pnpm install` completed

## Local Development

```bash
# Start database
docker compose up -d

# Run migrations (if needed)
pnpm --filter @releasepilot/db db:migrate

# Start API + App in dev mode
pnpm turbo run dev --filter=api --filter=app
```

## Key Files to Modify

### 1. Shared types (start here)
- `packages/shared/src/schemas/playbooks.ts` — Add `PLAYBOOK_HISTORY_ACTIONS` and Zod schemas
- `packages/shared/src/types/index.ts` — Add `PlaybookHistoryAction`, `PlaybookHistoryEntry`, `PlaybookHistoryResponse`
- `packages/shared/src/errors/codes.ts` — Add `AUDIT_PLAYBOOK_NOT_FOUND`

### 2. Audit domain use cases
- `packages/domains/audit/src/types.ts` — Add `PlaybookChangelogEntry`
- `packages/domains/audit/src/ports/changelog-repository.ts` — Add `findByPlaybookWithMembership()`
- `packages/domains/audit/src/use-cases/record-playbook-changes.ts` — NEW: metadata diff detection
- `packages/domains/audit/src/use-cases/get-playbook-changelog.ts` — Replace stub

### 3. Repository adapter
- `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` — Add `findByPlaybookWithMembership()`

### 4. Route handlers (bulk of the work)
- `apps/api/src/routes/authoring.ts` — Add `recordChangelog()` / `recordPlaybookChanges()` calls in all 11 playbook mutation handlers
- `apps/api/src/routes/audit.ts` — Implement `GET /api/orgs/:orgSlug/playbooks/:playbookId/history`

### 5. Frontend
- `apps/app/src/api/query-keys.ts` — Add `playbookKeys.history()`
- `packages/domains/audit/src/ui/hooks/use-playbook-history.ts` — NEW
- `packages/domains/audit/src/ui/components/PlaybookHistoryTimeline.tsx` — NEW
- `packages/domains/audit/src/ui/lib/describe-playbook-history-action.ts` — NEW

## Build & Test

```bash
# Build all packages
pnpm turbo run build

# Run all tests
pnpm turbo run test

# Run specific domain tests
pnpm --filter @releasepilot/domain-audit test

# Typecheck
pnpm turbo run typecheck
```

## Testing Strategy

- **Unit tests**: `packages/domains/audit/src/use-cases/__tests__/record-playbook-changes.test.ts` — test diff detection for all 15 action types
- **Unit tests**: `packages/domains/audit/src/ui/lib/__tests__/describe-playbook-history-action.test.ts` — test human-readable descriptions
- **Integration tests**: `apps/api/src/__tests__/playbook-history.spec.ts` — test endpoint, `org_id` boundary, removed member display
