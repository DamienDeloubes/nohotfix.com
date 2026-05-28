# Data Model: Organization Members List

**Feature**: 005-org-members-list
**Date**: 2026-03-07

## Schema Changes

**None.** This feature uses existing tables only. No migrations required.

## Existing Tables Used

### `memberships`

```
id          Generated<string>    PK, auto-UUID
org_id      string               FK → organisations.id
user_id     string               FK → users.id
role        'owner' | 'admin' | 'member'
created_at  ColumnType<Date, string | undefined, never>
```

### `users`

```
id              Generated<string>    PK, auto-UUID
workos_user_id  string               unique
email           string
first_name      string | null
last_name       string | null
created_at      ColumnType<Date, string | undefined, never>
updated_at      ColumnType<Date, string | undefined, string>
```

## Query Projection (DTO)

The `findMembersWithUsers` repository method returns a cross-table projection:

```typescript
// packages/domains/identity/src/ports/membership-repository.ts
export interface MemberWithUserDto {
  membershipId: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;   // memberships.created_at
}
```

## Query Design

```sql
SELECT
  m.id        AS membership_id,
  m.user_id,
  u.first_name,
  u.last_name,
  u.email,
  m.role,
  m.created_at AS joined_at
FROM memberships m
INNER JOIN users u ON u.id = m.user_id
WHERE m.org_id = :orgId
ORDER BY
  CASE m.role
    WHEN 'owner' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'member' THEN 3
  END,
  COALESCE(u.first_name, u.email) ASC
```

**Tenant isolation**: `WHERE m.org_id = :orgId` — `orgId` comes from JWT (not path param).

## Validation Rules

- No write operations — read-only feature.
- `org_id` is always derived from the authenticated user's JWT, never from user input.
