# Quickstart: Organization Onboarding

## Prerequisites

- Node.js 20+, PNPM 9+
- PostgreSQL running (via `docker-compose up -d`)
- WorkOS account with configured `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`

## Local Development Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run database migration**:
   ```bash
   pnpm --filter db migrate:latest
   ```

3. **Start all services**:
   ```bash
   pnpm turbo run dev --filter=api --filter=app --filter=web
   ```
   - API: http://localhost:3001
   - App: http://localhost:5173
   - Web: http://localhost:3000

4. **Environment variables** (ensure these are set):
   - `apps/api/.env`: `DATABASE_URL`, `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`, `APP_URL=http://localhost:5173`, `COOKIE_SECRET`
   - `apps/app/.env.local`: `VITE_API_URL=http://localhost:3001`, `VITE_WEB_URL=http://localhost:3000`

## Testing the Onboarding Flow

1. Open http://localhost:5173
2. You should be redirected to WorkOS login (via apps/web)
3. After signing up, you should see the organization creation form
4. Enter an org name and slug, submit
5. You should be redirected to `/<slug>/dashboard`

## Running Tests

```bash
# Unit tests (domain logic)
pnpm --filter @nohotfix/domain-identity test

# Integration tests (API routes)
pnpm --filter api test

# E2E tests (full browser flow)
pnpm --filter app-e2e test

# All tests
pnpm turbo run test
```

## Key Files to Understand

| File | Purpose |
|------|---------|
| `packages/domains/identity/src/use-cases/create-organisation.ts` | Core use case: create org + owner membership |
| `packages/domains/identity/src/entities/value-objects/organisation-slug.ts` | Slug validation rules |
| `apps/api/src/routes/identity.ts` | API endpoints for org creation + slug check |
| `apps/app/src/routes/_authenticated.tsx` | Onboarding guard (beforeLoad) |
| `apps/app/src/routes/onboarding/create-org.tsx` | Onboarding page |
| `packages/domains/identity/src/ui/components/CreateOrganisationForm.tsx` | Form component |
