# Data Model: Invite Members

**Feature**: 008-invite-members
**Context**: Identity

## New Table: `invites`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `Generated<string>` (UUID) | PK, auto-generated | |
| `org_id` | `string` (UUID) | NOT NULL, FK → `organisations(id)` | Tenant scope |
| `email` | `string` | NOT NULL | Invited email (lowercase, trimmed) |
| `role` | `string` | NOT NULL, CHECK (`admin`, `member`) | Role assigned on acceptance |
| `token` | `string` | NOT NULL, UNIQUE | 256-bit random hex |
| `status` | `string` | NOT NULL, CHECK (`pending`, `accepted`, `revoked`) | Invite lifecycle |
| `invited_by` | `string` (UUID) | NOT NULL, FK → `users(id)` | User who created the invite |
| `token_expires_at` | `ColumnType<Date, string, string>` | NOT NULL | 7 days from creation/resend |
| `last_sent_at` | `ColumnType<Date, string, string>` | NOT NULL | For resend rate limiting |
| `accepted_by` | `string` (UUID) \| null | FK → `users(id)` | Set on acceptance |
| `accepted_at` | `ColumnType<Date, string | undefined, never>` \| null | | Set on acceptance |
| `created_at` | `ColumnType<Date, string | undefined, never>` | NOT NULL, DEFAULT NOW() | |
| `updated_at` | `ColumnType<Date, string | undefined, string>` | NOT NULL, DEFAULT NOW() | |

### Indexes

| Name | Columns | Type | Rationale |
|------|---------|------|-----------|
| `idx_invites_token` | `token` | UNIQUE | Token lookup for acceptance |
| `idx_invites_org_email` | `org_id, email` | NON-UNIQUE | Duplicate invite check (filter by status in query) |
| `idx_invites_org_status` | `org_id, status` | NON-UNIQUE | List pending invites for members page |

### Uniqueness Constraint

No database-level unique constraint on `(org_id, email)` — multiple invite records can exist for the same email (e.g., one `revoked`, one `pending`). The application layer enforces "only one pending invite per email per org" via a check-before-insert pattern in the use case.

## Existing Table: `memberships` (UNCHANGED)

No schema changes. A membership row is created only when an invite is accepted, using the existing `create` method on `MembershipRepository`.

## Entity: InviteEntity

**Aggregate root** in Identity context.

### Properties (InviteProps)

```
id: string
orgId: string
email: Email (value object)
role: Role (value object — 'admin' | 'member')
token: string
status: InviteStatus ('pending' | 'accepted' | 'revoked')
invitedBy: string
tokenExpiresAt: Date
lastSentAt: Date
acceptedBy: string | null
acceptedAt: Date | null
createdAt: Date
updatedAt: Date
```

### Factory Methods

- `create(params)` — validates email + role via value objects, generates token, sets status=pending, sets tokenExpiresAt=now+7d, sets lastSentAt=now
- `reconstitute(props)` — from DB row, no validation

### Mutation Methods (return new instance)

- `resend()` — regenerates token, resets tokenExpiresAt=now+7d, updates lastSentAt=now. Throws if status !== 'pending'.
- `revoke()` — sets status='revoked'. Throws if status !== 'pending'.
- `accept(userId)` — sets status='accepted', acceptedBy=userId, acceptedAt=now. Throws if status !== 'pending'.
- `isExpired()` — returns tokenExpiresAt < now
- `canResend()` — returns true if status=pending AND enough time has passed since lastSentAt (5min for first, 15min for subsequent)

### State Transitions

```
pending → accepted  (via accept())
pending → revoked   (via revoke())
```

Terminal states: `accepted`, `revoked` (no transitions out).

## Value Objects (reused)

- **Email**: Already exists in identity domain — validates format, lowercases
- **Role**: Already exists — `owner | admin | member`. For invites, only `admin | member` are valid (owners cannot be invited)

## New Value Object: InviteToken

```
InviteToken.generate() → new InviteToken (32 random bytes → hex)
InviteToken.create(raw: string) → validates 64-char hex string
```
