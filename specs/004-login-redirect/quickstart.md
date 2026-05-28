# Quickstart: Login Redirect

**Feature**: 004-login-redirect
**Date**: 2026-03-06

## Prerequisites

- Node.js 20+, pnpm installed
- `apps/api/.env` with `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`, `APP_URL`, `COOKIE_SECRET`
- `apps/web/.env.local` with `NEXT_PUBLIC_API_URL` pointing to the API (default: `http://localhost:3001`)

## Local Development

```bash
# Start API server
pnpm --filter api dev

# Start marketing site (separate terminal)
pnpm --filter web dev
```

## Manual Testing

1. **Unauthenticated flow**: Open `http://localhost:3000` → click "Log in" → should redirect to WorkOS sign-in → after auth, should land on `APP_URL`
2. **Authenticated flow**: After logging in once, open `http://localhost:3000` again → click "Log in" → should redirect directly to `APP_URL` without seeing WorkOS sign-in

## Running Tests

```bash
# Integration tests (API)
pnpm --filter api test

# E2E tests (requires API + web running)
pnpm --filter web-e2e test
```

## Files Changed

| File | Change |
|------|--------|
| `apps/api/src/routes/auth.ts` | Add session-check logic to `GET /auth/login` handler |
| `apps/web/src/app/page.tsx` | Add unstyled login anchor link |
| `apps/api/src/__tests__/auth-login-redirect.spec.ts` | New integration test |
| `apps/web-e2e/login-redirect.spec.ts` | New E2E test |
