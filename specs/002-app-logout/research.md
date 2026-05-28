# Research: App Logout

**Feature**: 002-app-logout | **Date**: 2026-03-05

## R1: How does WorkOS session termination work in this project?

**Decision**: Call the existing `POST /auth/logout` endpoint on `apps/api`, which clears the `__rp_refresh` signed httpOnly cookie.

**Rationale**: The project uses a custom OAuth flow through `apps/api` (not the WorkOS AuthKit Next.js SDK). The API already has a `POST /auth/logout` route at `apps/api/src/routes/auth.ts:107-110` that clears the `__rp_refresh` cookie. No additional WorkOS SDK calls are needed — clearing the refresh cookie prevents future token refreshes, effectively terminating the session.

**Alternatives considered**:
- Calling WorkOS `revokeSession` API: Not necessary. The refresh token becomes useless once the cookie is cleared, and the short-lived JWT access token will expire naturally. WorkOS does not provide a server-side session revocation for this OAuth flow.
- Using WorkOS AuthKit Next.js `signOut()` in apps/web: Not applicable. Auth flows go through apps/api, not apps/web.

## R2: What needs to be cleared client-side in apps/app?

**Decision**: Clear three things: (1) in-memory `accessToken` variable in `session.ts`, (2) TanStack Query cache for `['session']` key, (3) call `POST /auth/logout` with `credentials: 'include'` to clear the refresh cookie.

**Rationale**: The session state in `apps/app` is split between an in-memory module variable (`accessToken` in `session.ts:15`) and a signed httpOnly cookie (`__rp_refresh` on the API domain). Both must be cleared. The TanStack Query cache must be invalidated to prevent stale session data from being displayed.

**Alternatives considered**:
- Clearing all cookies via `document.cookie`: Not possible — the refresh cookie is httpOnly and on a different domain (API). Must go through the API endpoint.
- Using `queryClient.resetQueries()`: Would work but `queryClient.clear()` is simpler and ensures no stale auth-related data remains.

## R3: Where should the logout button be placed?

**Decision**: In the Sidebar component (`apps/app/src/components/layout/Sidebar.tsx`) at the bottom of the sidebar.

**Rationale**: The Sidebar is currently a placeholder and is the natural location for navigation actions including logout. Placing it at the bottom follows common SaaS conventions (VS Code, Slack, Linear all place user/logout actions at the sidebar bottom). The Sidebar is a layout component in `apps/app/src/components/layout/` which is the correct location per constitution principle IV.

**Alternatives considered**:
- Header user menu dropdown: No header component exists yet. Creating one just for logout would be over-engineering.
- Standalone floating button: Poor UX, not a standard pattern.

## R4: How to redirect to apps/web landing page?

**Decision**: Use `window.location.href = webUrl` where `webUrl` comes from `VITE_WEB_URL` environment variable. This is a full-page navigation to a different origin.

**Rationale**: `apps/app` (e.g., `app.releasepilot.io`) and `apps/web` (e.g., `releasepilot.io`) are different origins. TanStack Router only controls in-app navigation. A cross-origin redirect requires `window.location.href` assignment. The `VITE_WEB_URL` env var follows the existing pattern of `VITE_API_URL`.

**Alternatives considered**:
- Hardcoding the URL: Violates env-based configuration. Different in dev vs prod.
- Using `window.location.replace()`: Would work but prevents back-button to the app (which is actually desired — you can't go back to an authenticated page after logout). Either approach is acceptable; `replace()` is slightly better for security.

**Updated decision**: Use `window.location.replace(webUrl)` to prevent back-button navigation to the (now unauthenticated) app.
