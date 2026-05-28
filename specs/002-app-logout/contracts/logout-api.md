# API Contract: Logout

**Feature**: 002-app-logout | **Date**: 2026-03-05

## POST /auth/logout (existing — no changes needed)

Clears the refresh token cookie, effectively terminating the server-side session.

### Request

- **Method**: POST
- **URL**: `{API_URL}/auth/logout`
- **Headers**: None required (cookie-based)
- **Credentials**: `include` (required for cross-origin cookie clearing)
- **Body**: None

### Response

**200 OK** — Session cleared successfully
```json
{ "ok": true }
```

### Cookie Side Effect

Clears the `__rp_refresh` cookie:
- Path: `/auth`
- Domain: API origin (e.g., `api.nohotfix.io`)

### Client-Side Contract

After calling this endpoint, the client (`apps/app`) MUST also:
1. Set in-memory `accessToken` to `null`
2. Clear TanStack Query cache (at minimum the `['session']` key)
3. Redirect to `VITE_WEB_URL` (apps/web landing page) using `window.location.replace()`

### Error Handling

The client should treat any response (including network errors) as "proceed with local cleanup and redirect." The server-side cookie clearing is best-effort — the important guarantee is that the client clears its local state and navigates away.
