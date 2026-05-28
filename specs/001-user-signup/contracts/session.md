# Contract: Session Endpoint

**Feature**: 001-user-signup
**Owner**: `apps/web` (Next.js)
**Consumer**: `apps/app` (React SPA)

---

## `GET /api/auth/session`

Returns the current user's profile data from the WorkOS session, or `null` if no session is present.

### Purpose

Allows `apps/app` (deployed on `app.nohotfix.io`) to read the session established by `apps/web` (deployed on `nohotfix.io`). Session tokens are stored in httpOnly cookies on the `nohotfix.io` domain by the WorkOS AuthKit SDK.

### Authentication

None — this endpoint reads the session from httpOnly cookies automatically. The caller must include credentials (`credentials: 'include'` in `fetch`).

### CORS

| Header | Value |
|--------|-------|
| `Access-Control-Allow-Origin` | `https://app.nohotfix.io` (production) / `http://localhost:5173` (dev) |
| `Access-Control-Allow-Credentials` | `true` |
| `Access-Control-Allow-Methods` | `GET, OPTIONS` |

### Request

```
GET /api/auth/session
Origin: https://app.nohotfix.io
Cookie: <workos session cookies set by authkit-nextjs>
```

No request body. No query parameters.

### Response: Session present (200 OK)

```json
{
  "id": "user_01ABC123",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "profilePictureUrl": null,
  "emailVerified": true,
  "createdAt": "2026-03-04T10:00:00.000Z",
  "updatedAt": "2026-03-04T10:00:00.000Z",
  "object": "user"
}
```

Response schema: The raw WorkOS user object. Additional fields may be present depending on WorkOS configuration. **No field stripping is applied.**

### Response: No session (200 OK)

```json
null
```

HTTP status is always `200`. A missing session is not an error — `null` is a valid response.

### Error responses

| Status | Condition |
|--------|-----------|
| `500` | Internal error reading session from WorkOS SDK |

### Local development

In local development, `apps/web` runs on `http://localhost:3000` and `apps/app` runs on `http://localhost:5173`. The CORS origin in development must allow `http://localhost:5173`.

The `NEXT_PUBLIC_APP_URL` environment variable controls the CORS `Allow-Origin` header:
- Production: `https://app.nohotfix.io`
- Development: `http://localhost:5173`

---

## Signup Initiation

There is no explicit API contract for the signup button — it is a standard browser redirect to WorkOS AuthKit.

### Signup flow

1. User clicks signup button on `nohotfix.io`
2. Next.js Server Action calls `signIn({ screenHint: 'sign-up' })` from `@workos-inc/authkit-nextjs`
3. Browser is redirected to WorkOS AuthKit hosted UI
4. User completes signup form on WorkOS-hosted page
5. WorkOS redirects browser to `https://nohotfix.io/auth/callback?code=<code>&state=<state>`
6. `handleAuth()` in the callback route exchanges the code for tokens, sets httpOnly cookies, and redirects browser to `https://app.nohotfix.io`
7. SPA calls `GET /api/auth/session` — receives user object
8. SPA renders `<pre>{JSON.stringify(user, null, 2)}</pre>`

### Callback route

```
GET /auth/callback?code=<workos_code>&state=<workos_state>
```

Handled by `handleAuth()` from `@workos-inc/authkit-nextjs`. Not a custom contract — fully SDK-managed.
