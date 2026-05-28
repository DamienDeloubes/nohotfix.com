# Contract: GET /auth/login (Updated)

**Feature**: 004-login-redirect
**Date**: 2026-03-06

## Endpoint

`GET /auth/login`

## Existing Behavior (unchanged)

Redirects the browser to WorkOS AuthKit authorization URL for sign-in or sign-up.

**Query Parameters**:

| Parameter     | Type   | Required | Values                    |
|---------------|--------|----------|---------------------------|
| `screen_hint` | string | No       | `sign-in` or `sign-up`    |

## New Behavior (added)

Before redirecting to WorkOS, the handler checks for an existing valid session via the refresh token cookie.

### Flow

1. Read `__rp_refresh` signed cookie from request
2. If cookie exists and signature is valid:
   a. Attempt `workos.userManagement.authenticateWithRefreshToken()`
   b. If refresh succeeds: set updated cookies, redirect to `APP_URL` (HTTP 302)
   c. If refresh fails: clear cookies, fall through to step 3
3. If no valid cookie or refresh failed:
   a. Generate WorkOS authorization URL (existing behavior)
   b. Redirect to WorkOS (HTTP 302)

### Response

| Scenario                  | Status | Location Header        |
|---------------------------|--------|------------------------|
| Valid session detected    | 302    | `APP_URL` (e.g., `https://app.nohotfix.io`) |
| No session / expired      | 302    | WorkOS AuthKit URL     |

### Cookies (on valid session redirect)

| Cookie          | Action  | Notes                          |
|-----------------|---------|--------------------------------|
| `__rp_refresh`  | Updated | New refresh token from rotation |
| `__rp_sid`      | Updated | Session ID from new access token |

### Error Cases

| Scenario                        | Behavior                                  |
|---------------------------------|-------------------------------------------|
| WorkOS provider unavailable     | Throws `AuthProviderUnavailableError` (503) |
| Cookie exists but tampered      | Cleared, proceeds to WorkOS sign-in       |
| Refresh token revoked/expired   | Cookies cleared, proceeds to WorkOS sign-in |
