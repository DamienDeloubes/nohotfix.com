# Quickstart: Create Spec

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (or `docker compose up -d`)
- `apps/api/.env` with `DATABASE_URL`, `WORKOS_*` vars
- `apps/app/.env.local` with `VITE_API_URL`, `VITE_WEB_URL`

## Development Setup

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm --filter @nohotfix/db migrate

# Start API + App concurrently
pnpm turbo run dev --filter=api --filter=app
```

API runs on `http://localhost:3001`, App on `http://localhost:5173`.

## Implementation Order

1. **Shared layer** — Update Zod schemas and error codes in `packages/shared/`
2. **Domain layer** — Entity, value objects, use-case in `packages/domains/authoring/`
3. **Adapter layer** — Kysely repository implementation in `apps/api/src/adapters/`
4. **API layer** — Route handlers in `apps/api/src/routes/authoring.ts`
5. **UI layer** — Components in `packages/domains/authoring/src/ui/`, routes in `apps/app/`

## Key Files to Edit

| Layer | File | Action |
|-------|------|--------|
| Shared | `packages/shared/src/errors/codes.ts` | Add `AUTHOR_SPEC_NOT_FOUND` |
| Shared | `packages/shared/src/schemas/specs.ts` | Extend `CreateLibrarySpecRequestSchema` with rich text + test steps |
| Domain | `packages/domains/authoring/src/entities/spec-library-entry.ts` | New entity |
| Domain | `packages/domains/authoring/src/value-objects/spec-title.ts` | New VO |
| Domain | `packages/domains/authoring/src/value-objects/severity.ts` | New VO |
| Domain | `packages/domains/authoring/src/value-objects/test-step.ts` | New VO |
| Domain | `packages/domains/authoring/src/use-cases/create-library-spec.ts` | Implement |
| Domain | `packages/domains/authoring/src/ports/spec-library-repository.ts` | Add `findDistinctSystemsUnderTest` |
| Domain | `packages/domains/authoring/src/errors/index.ts` | Add `AuthorSpecNotFoundError` |
| Adapter | `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts` | Implement `create`, `findById`, `findDistinctSystemsUnderTest` |
| API | `apps/api/src/routes/authoring.ts` | Implement 3 endpoints |
| UI | `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` | New form |
| UI | `packages/domains/authoring/src/ui/components/SpecDetail.tsx` | New detail view |
| Route | `apps/app/src/routes/_authenticated/$orgSlug/spec-library/new.tsx` | Wire form |
| Route | `apps/app/src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx` | Wire detail |

## Testing

```bash
# Unit tests (domain)
pnpm --filter @nohotfix/domain-authoring test

# Integration tests (API)
pnpm --filter api test

# All tests
pnpm turbo run test

# Type check
pnpm turbo run typecheck
```

## Verification Checklist

- [ ] POST /api/orgs/:orgSlug/specs returns 201 with all fields
- [ ] GET /api/orgs/:orgSlug/specs/:specId returns 200 with correct data
- [ ] GET /api/orgs/:orgSlug/specs/systems-under-test returns distinct values
- [ ] Member role gets 403 on all spec endpoints
- [ ] Changelog entry created on spec creation
- [ ] Frontend form submits and redirects to detail page
- [ ] Rich text round-trips correctly (create → view)
- [ ] Test steps persist in correct order
- [ ] System under test combobox shows suggestions
