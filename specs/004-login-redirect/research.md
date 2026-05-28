# Research: Login Redirect

**Feature**: 004-login-redirect
**Date**: 2026-03-06

## R1: Session Detection Strategy (Cross-Domain)

**Decision**: Check for existing refresh token cookie in the `/auth/login` route handler before redirecting to WorkOS.

**Rationale**: The refresh token cookie (`__rp_refresh`) is httpOnly, signed, and scoped to the API domain with `path: '/auth'`. When the browser navigates to `GET /auth/login`, the cookie is automatically sent. This is the simplest way to detect an existing session without any new infrastructure — the cookie is already there, we just need to read it. If valid, attempt a token refresh to verify the session is still active; if successful, redirect to `APP_URL`. If the cookie is missing or refresh fails, proceed with the normal WorkOS authorization flow.

**Alternatives considered**:
- **Client-side fetch from marketing page**: Would require CORS setup between `apps/web` and the API, plus a client-side JavaScript fetch to `/auth/refresh`. Adds complexity (loading state, error handling on the marketing page) for no real benefit.
- **Next.js API route proxy**: Would add a server route in `apps/web` that checks session, but session cookies live on the API domain — `apps/web` cannot read them. Would require an additional cross-domain call, adding latency.
- **Shared cookie domain**: Would require both `apps/web` and `apps/api` on the same parent domain. Over-engineering for this use case.

## R2: WorkOS Token Refresh for Session Validation

**Decision**: Use `workos.userManagement.authenticateWithRefreshToken()` to validate the session. If refresh succeeds, the user is authenticated — redirect to `APP_URL`. If it throws, treat as unauthenticated.

**Rationale**: Simply having a refresh token cookie doesn't guarantee the session is still valid (it could be revoked or expired). The only reliable way to verify is to attempt a refresh. This also rotates the refresh token, maintaining the existing security model. The refresh operation adds ~100-200ms latency, which is well within the 2-second target.

**Alternatives considered**:
- **Just check cookie existence**: Faster but would redirect to `APP_URL` with an invalid session, causing the app to show an auth error. Poor UX.
- **Decode JWT without verification**: The access token isn't stored in cookies (only refresh token is). Not applicable.

## R3: Login Button Approach on Marketing Page

**Decision**: Add a plain `<a>` anchor tag (no `<button>` wrapper) linking to `${API_URL}/auth/login?screen_hint=sign-in`, consistent with the existing sign-up button pattern but without the `<button>` wrapper to achieve the "unstyled" requirement.

**Rationale**: The existing sign-up button already uses `<a href="${API_URL}/auth/login?screen_hint=sign-up"><button>Sign up</button></a>`. For the login button, we use a bare `<a>` tag to meet the "unstyled" spec requirement. A plain anchor is natively accessible (keyboard focusable, screen-reader announced), requires no JavaScript, and works identically across desktop and mobile browsers.

**Alternatives considered**:
- **Button with `onClick` + `window.location`**: Adds JavaScript dependency unnecessarily. A plain link is simpler and more accessible.
- **Next.js `Link` component**: Would use client-side navigation, but the target is an external API domain. Plain `<a>` is correct for cross-origin navigation.
