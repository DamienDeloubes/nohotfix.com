# Quickstart: Organisation Settings Page

**Branch**: `006-org-settings` | **Date**: 2026-03-07

## Prerequisites

- Node.js 20+, pnpm 9+
- PostgreSQL running (via `docker-compose up -d`)
- `.env` files configured (see `.env.example`)

## Setup

```bash
pnpm install
pnpm turbo run build
```

## Development

```bash
# Start API server (port 3001)
pnpm --filter api dev

# Start web app (port 3000) — WorkOS auth
pnpm --filter web dev

# Start SPA (port 5173) — main app
pnpm --filter app dev
```

## Key Files to Modify/Create

### New files
1. `packages/domains/identity/src/use-cases/rename-organisation.ts` — Use case
2. `packages/domains/identity/src/ui/components/OrganisationSettingsForm.tsx` — UI component
3. `packages/domains/identity/src/ui/hooks/use-rename-organisation.ts` — Mutation hook

### Modified files
4. `apps/api/src/routes/identity.ts` — Implement GET + PATCH `/api/orgs/:orgSlug`
5. `packages/shared/src/schemas/organisation.ts` — Add `UpdateOrganisationRequestSchema`
6. `packages/domains/identity/src/use-cases/index.ts` — Export `renameOrganisation`
7. `packages/domains/identity/src/ui/index.ts` — Export new component + hook
8. `apps/app/src/routes/_authenticated/$orgSlug/settings/general.tsx` — Use `OrganisationSettingsForm`
9. `apps/app/src/routes/_authenticated/$orgSlug/settings/index.tsx` — Add redirect to `/general`

## Testing

```bash
# Unit tests (domain)
pnpm --filter @releasepilot/domain-identity test

# Integration tests (API)
pnpm --filter api test

# All tests
pnpm turbo run test
```

## Verification

1. Log in as Owner → navigate to Settings → see org name (editable) + slug (read-only) → rename → verify success toast
2. Log in as Admin → same as Owner
3. Log in as Member → navigate to Settings → see org name (read-only) + slug (read-only) → no save button
4. Attempt PATCH as Member via curl → expect 403 AUTH_ROLE_INSUFFICIENT
