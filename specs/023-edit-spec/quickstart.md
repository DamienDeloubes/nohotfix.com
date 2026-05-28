# Quickstart: Edit Spec

## Prerequisites

- Node.js 20+, pnpm
- PostgreSQL running (via `docker compose up -d`)
- `.env` files configured (see `.env.example`)

## Development Setup

```bash
# Install dependencies
pnpm install

# Start database
docker compose up -d

# Run migrations
pnpm --filter db migrate

# Start API (port 3001)
pnpm --filter api dev

# Start app (port 5173)
pnpm --filter app dev
```

## Key Files to Modify

### 1. Shared Schemas (packages/shared)
- `src/schemas/specs.ts` — Add `UpdateLibrarySpecRequestSchema`, extend `SPEC_HISTORY_ACTIONS`

### 2. Authoring Domain (packages/domains/authoring)
- `src/use-cases/update-library-spec.ts` — New use case (create file)
- `src/ui/components/SpecForm.tsx` — Extract shared form component (create file)
- `src/ui/components/CreateSpecForm.tsx` — Refactor to wrap SpecForm
- `src/ui/components/EditSpecForm.tsx` — New wrapper with initialValues (create file)
- `src/ui/hooks/use-update-spec.ts` — New mutation hook (create file)

### 3. Audit Domain (packages/domains/audit)
- `src/use-cases/record-spec-changes.ts` — Extend SpecSnapshot and detection logic

### 4. API Routes (apps/api)
- `src/routes/authoring.ts` — Add PUT handler

### 5. App Routes (apps/app)
- `src/routes/_authenticated/$orgSlug/spec-library/$specId.tsx` — Add "Edit spec" button
- `src/routes/_authenticated/$orgSlug/spec-library/$specId.edit.tsx` — New edit route (create file)
- `src/routes/_authenticated/$orgSlug/spec-library/index.tsx` — Add "Edit spec" to row actions

## Testing

```bash
# Run all tests
pnpm turbo run test

# Run specific domain tests
pnpm --filter @nohotfix/domain-authoring test
pnpm --filter @nohotfix/domain-audit test

# Run API integration tests
pnpm --filter api test

# Type check
pnpm turbo run typecheck
```

## Verification Checklist

1. Navigate to spec detail page as admin → "Edit spec" button visible
2. Navigate as member → "Edit spec" button NOT visible
3. Click "Edit spec" → form pre-populated with current values
4. Modify title, save → redirected to detail page with new title
5. Check history tab → "changed title from X to Y" entry
6. Open edit page, make changes, click Cancel → no changes saved
7. Open edit page, make changes, click browser back → confirmation dialog
8. Navigate to edit URL for archived spec → redirected to detail page
9. Navigate to edit URL as member → redirected to detail page
