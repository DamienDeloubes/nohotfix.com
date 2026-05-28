# Quickstart: Spec History

**Branch**: `022-spec-history` | **Date**: 2026-03-11

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (via `docker-compose up -d`)
- `pnpm install` from repo root

## What This Feature Adds

1. **Change detection** — When a spec is updated, the system compares old vs new state and records one changelog entry per changed field
2. **History endpoint** — `GET /api/orgs/:orgSlug/specs/:specId/history` returns all changelog entries for a spec
3. **History tab** — A "History" tab on the spec detail page displays a chronological timeline of changes

## Key Files to Modify

### Backend (Write Side)
- `packages/domains/audit/src/use-cases/record-spec-changes.ts` — NEW: change detection logic
- `packages/domains/audit/src/types.ts` — Add `SpecHistoryAction` type
- `apps/api/src/routes/authoring.ts` — Call `recordSpecChanges` after spec updates

### Backend (Read Side)
- `packages/domains/audit/src/use-cases/get-spec-changelog.ts` — Implement (currently stub)
- `packages/domains/audit/src/ports/changelog-repository.ts` — Add `findBySpecWithMembership` method
- `apps/api/src/adapters/repositories/kysely-changelog-repository.ts` — Implement LEFT JOIN query
- `apps/api/src/routes/authoring.ts` — Add `GET .../history` endpoint

### Shared
- `packages/shared/src/schemas/specs.ts` — Add `SpecHistoryEntrySchema`, `SpecHistoryResponseSchema`
- `packages/shared/src/types/` — Add `SpecHistoryEntry` type

### Frontend
- `apps/app/src/api/query-keys.ts` — Add `specKeys.history(orgSlug, specId)`
- `packages/domains/authoring/src/ui/components/SpecHistoryTimeline.tsx` — NEW: timeline component
- `packages/domains/authoring/src/ui/hooks/use-spec-history.ts` — NEW: query hook
- `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx` — Add History tab

## No Migration Required

The existing `changelog` table supports all spec history needs. No schema changes.

## Testing

```bash
# Run all tests
pnpm turbo run test

# Run specific domain tests
pnpm --filter @nohotfix/domain-audit test
pnpm --filter @nohotfix/domain-authoring test

# Run API integration tests
pnpm --filter api test
```
