# Quickstart: App Logout

**Feature**: 002-app-logout | **Date**: 2026-03-05

## Prerequisites

- Running dev environment: `pnpm turbo run dev` (starts apps/api on :3001, apps/app on :5173, apps/web on :3000)
- Logged-in session in apps/app (visit `http://localhost:3001/auth/login?screen_hint=sign-in`)

## Environment Setup

Add to `apps/app/.env.local`:
```
VITE_WEB_URL=http://localhost:3000
```

Add to `apps/app/.env.example`:
```
VITE_WEB_URL=http://localhost:3000
```

## Files to Modify

| File | Change |
|------|--------|
| `apps/app/src/lib/session.ts` | Add `logout()` export function |
| `apps/app/src/components/layout/Sidebar.tsx` | Add logout button at bottom |
| `apps/app/.env.local` | Add `VITE_WEB_URL` |
| `apps/app/.env.example` | Add `VITE_WEB_URL` |

## Testing the Feature

### Manual Test
1. Log in to apps/app via `http://localhost:3001/auth/login?screen_hint=sign-in`
2. Verify you see the dashboard with the sidebar
3. Click the "Log out" button at the bottom of the sidebar
4. Verify you are redirected to `http://localhost:3000` (apps/web landing page)
5. Navigate back to `http://localhost:5173` — verify you are not authenticated (session hook returns null)

### Automated Tests
```bash
# Unit tests
pnpm --filter app test

# E2E tests (if Playwright configured)
pnpm --filter app-e2e test
```

## Key Implementation Notes

- The `POST /auth/logout` endpoint already exists in `apps/api/src/routes/auth.ts:107-110`
- Use `window.location.replace()` (not `.href`) to prevent back-button returning to unauthenticated app
- The `logout()` function should be fire-and-forget on the API call — always proceed with local cleanup even if the network request fails
- Use `queryClient.clear()` from TanStack Query to wipe all cached data
