# Data Model: Remove Organization Member

## Existing Entities (no changes)

### Membership

| Field | Type | Constraint | Notes |
|-------|------|------------|-------|
| id | Generated\<string\> | PK, auto UUID | |
| org_id | string | FK → organisations(id) | Tenant boundary |
| user_id | string | FK → users(id) | |
| role | 'owner' \| 'admin' \| 'member' | NOT NULL | |
| created_at | ColumnType\<Date, string \| undefined, never\> | Auto | |

**Unique constraint**: (org_id, user_id)

**This feature**: Deletes membership rows via `DELETE FROM memberships WHERE id = $1 AND org_id = $2`. Hard delete — no soft-delete column.

## Schema Changes

**None required.** The feature operates on the existing `memberships` table with no structural modifications.

## New Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_OWNER_CANNOT_BE_REMOVED | 409 | Attempt to remove the organization owner. Ownership must be transferred first. |

Existing codes reused:
- `AUTH_ROLE_INSUFFICIENT` (403) — non-admin member trying to remove another member
- `AUTH_TARGET_NOT_FOUND` (404) — membership not found or belongs to different org

## Repository Port Update

The existing `MembershipRepository.delete()` signature needs updating for tenant safety:

```typescript
// Current (stub):
delete(id: string): Promise<void>

// Updated:
delete(orgId: string, id: string): Promise<boolean>
```

- `orgId` parameter ensures tenant boundary enforcement
- Returns `boolean` — `true` if a row was deleted, `false` if not found (enables 404 detection without a separate query)

## State Transitions

No state machine changes. Membership deletion is a terminal operation (row ceases to exist).

## Validation Rules

| Rule | Enforced By | Error Code |
|------|-------------|------------|
| Actor must be admin/owner to remove others | Use case | AUTH_ROLE_INSUFFICIENT |
| Owner cannot be removed | Use case | AUTH_OWNER_CANNOT_BE_REMOVED |
| Target must exist in same org | Repository (org_id filter) | AUTH_TARGET_NOT_FOUND |
| Self-removal allowed for any non-owner | Use case | (no error — allowed) |
