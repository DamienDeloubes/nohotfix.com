# API Contracts: Invite Members

**Feature**: 008-invite-members
**Base path**: `/api/orgs/:orgSlug`

## POST `/api/orgs/:orgSlug/invites`

Create and send a new invite.

**Middleware**: `orgScopeMiddleware` (resolves org, verifies membership + role)

**Authorization**: Owner or Admin only (check `request.orgContext.role`)

### Request

```typescript
// Zod schema: CreateInviteRequestSchema
{
  email: string;   // valid email, not self
  role: 'admin' | 'member';
}
```

### Response — 201 Created

```typescript
{
  id: string;
  email: string;
  role: 'admin' | 'member';
  status: 'pending';
  invitedBy: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  lastSentAt: string;       // ISO date
  tokenExpiresAt: string;   // ISO date
  createdAt: string;         // ISO date
}
```

### Error Responses

| Code | Error Code | Condition |
|------|-----------|-----------|
| 400 | (validation) | Invalid email format or missing fields |
| 403 | `AUTH_ROLE_INSUFFICIENT` | Caller is a Member (not Owner/Admin) |
| 409 | `AUTH_INVITE_DUPLICATE` | Email already has a pending invite for this org |
| 409 | `AUTH_INVITE_ALREADY_MEMBER` | Email is already an active member of this org |
| 422 | `AUTH_INVITE_SELF` | Caller tried to invite their own email |
| 502 | `AUTH_INVITE_EMAIL_FAILED` | Resend email delivery failed (invite rolled back) |

---

## GET `/api/orgs/:orgSlug/invites`

List pending invites for the org (displayed alongside members).

**Middleware**: `orgScopeMiddleware`

**Authorization**: Owner or Admin only

### Response — 200 OK

```typescript
{
  invites: Array<{
    id: string;
    email: string;
    role: 'admin' | 'member';
    status: 'pending';
    invitedBy: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
    lastSentAt: string;
    tokenExpiresAt: string;
    createdAt: string;
  }>;
}
```

---

## POST `/api/orgs/:orgSlug/invites/:inviteId/resend`

Resend the invite email with a new token.

**Middleware**: `orgScopeMiddleware`

**Authorization**: Owner or Admin only

### Response — 200 OK

```typescript
{
  id: string;
  lastSentAt: string;       // updated
  tokenExpiresAt: string;   // reset to now + 7d
}
```

### Error Responses

| Code | Error Code | Condition |
|------|-----------|-----------|
| 403 | `AUTH_ROLE_INSUFFICIENT` | Caller is a Member |
| 404 | `AUTH_INVITE_NOT_FOUND` | Invite doesn't exist or isn't pending |
| 429 | `AUTH_INVITE_RESEND_TOO_SOON` | Rate limit not met (5min initial / 15min subsequent) |
| 502 | `AUTH_INVITE_EMAIL_FAILED` | Resend email delivery failed |

---

## DELETE `/api/orgs/:orgSlug/invites/:inviteId`

Revoke a pending invite.

**Middleware**: `orgScopeMiddleware`

**Authorization**: Owner or Admin only

### Response — 204 No Content

### Error Responses

| Code | Error Code | Condition |
|------|-----------|-----------|
| 403 | `AUTH_ROLE_INSUFFICIENT` | Caller is a Member |
| 404 | `AUTH_INVITE_NOT_FOUND` | Invite doesn't exist or isn't pending |

---

## POST `/api/invites/:token/accept`

Accept an invite (called by web app after auth callback).

**Middleware**: `authMiddleware` (caller must be authenticated)

**No org scope** — the token identifies the org.

### Response — 200 OK

```typescript
{
  orgSlug: string;    // for redirect
  orgName: string;
}
```

### Error Responses

| Code | Error Code | Condition |
|------|-----------|-----------|
| 404 | `AUTH_INVITE_NOT_FOUND` | Token invalid or invite not pending |
| 410 | `AUTH_INVITE_EXPIRED` | Invite token has expired |
| 422 | `AUTH_INVITE_EMAIL_MISMATCH` | Authenticated user's email doesn't match invited email |

---

## Web App Routes (apps/web)

### GET `/invite/:token`

Server-rendered page. Validates token against API, then:
- **Valid**: Redirects to WorkOS auth with `login_hint={invited_email}` and stores token in state param
- **Expired**: Renders "Invite expired — contact your org admin" page
- **Revoked/Not found**: Renders "Invite no longer valid" page
- **Already accepted**: Redirects to `apps/app` org dashboard

### GET `/api/auth/invite-callback`

WorkOS OAuth callback for invite flow. Exchanges code, verifies email match, calls `POST /api/invites/:token/accept`, redirects to `apps/app/{orgSlug}/dashboard`.
