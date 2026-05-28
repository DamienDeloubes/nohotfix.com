# Data Model: User Signup (001-user-signup)

**Date**: 2026-03-04
**Branch**: `001-user-signup`

---

## Overview

This feature introduces **no database schema changes**. No new tables, no new columns, no new migrations.

The WorkOS identity provider is the authoritative store for user credentials and profile data. The existing `users` and `memberships` tables already support the Identity context — the `SyncUserFromJWT` use case will upsert user records when the authenticated SPA makes its first API call. That sync path is out of scope for this feature.

The data model for this feature is limited to the **session data type** returned by the WorkOS SDK and forwarded to the SPA.

---

## Session User Object

This is the raw payload returned by `getSession().user` from `@workos-inc/authkit-nextjs`. The SPA renders it verbatim.

### Shape (WorkOS SDK output)

The exact shape is determined by WorkOS and may vary by configuration, but typically includes:

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | WorkOS user ID (`user_…`) |
| `email` | `string` | User's email address — always present |
| `firstName` | `string \| null` | User's first name |
| `lastName` | `string \| null` | User's last name |
| `profilePictureUrl` | `string \| null` | Avatar URL |
| `emailVerified` | `boolean` | Whether email has been verified |
| `createdAt` | `string` | ISO 8601 timestamp |
| `updatedAt` | `string` | ISO 8601 timestamp |
| `object` | `string` | Always `"user"` |

**Important**: The SPA renders the entire object with `JSON.stringify(user, null, 2)`. No field selection or transformation is applied. If the WorkOS SDK returns additional fields, they are displayed.

### Null state

When no session is present, `getSession()` returns `null` (or `{ user: null }`). The SPA renders:
```
null
```

---

## Existing Tables (unchanged)

The following tables in the existing schema support this feature when the Identity context's `SyncUserFromJWT` eventually runs (out of scope for this feature):

| Table | Relevant Columns | Notes |
|-------|-----------------|-------|
| `users` | `workos_user_id`, `email`, `display_name` | User record created/upserted on first API call after signup |
| `memberships` | `org_id`, `user_id`, `role` | Membership created when user joins an org |

No migration is required for this feature.

---

## State Transitions

### Session lifecycle (relevant to this feature)

```
No session (null) → Active session (user object present)
```

Triggered by: Successful WorkOS signup → callback → cookie set → SPA reads session.

```
Active session → No session (null)
```

Triggered by: Session expiry (handled by `authkitMiddleware` refresh). Out of scope for this feature — expired session falls back to null display.

### Not in scope

- Org creation state machine
- Subscription state machine
- Run state machine

---

## API Layer (apps/web session endpoint)

The `GET /api/auth/session` endpoint on `apps/web` is the single new interface introduced by this feature. It is documented in `contracts/session.md`.
