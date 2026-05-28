# Data Model: Change Member Role

**Feature**: 009-change-member-role | **Date**: 2026-03-09

## Schema Changes

**No database migrations required.** This feature operates on the existing `memberships` table with no schema modifications.

## Existing Table: `memberships`

| Column       | Type                                          | Constraints                                       |
|-------------|-----------------------------------------------|---------------------------------------------------|
| `id`        | `Generated<string>` (UUID)                    | PK, auto-generated                                |
| `org_id`    | `string` (UUID)                               | FK → `organisations.id`, NOT NULL                  |
| `user_id`   | `string` (UUID)                               | FK → `users.id`, NOT NULL                          |
| `role`      | `'owner' \| 'admin' \| 'member'`             | NOT NULL, CHECK constraint                         |
| `created_at`| `ColumnType<Date, string \| undefined, never>`| Auto-set on insert                                 |

**Unique constraint**: `(org_id, user_id)` — one membership per user per org.

**Role CHECK constraint** (from migration 002): `role IN ('owner', 'admin', 'member')`

## Invariants

1. **Single owner**: Exactly one membership per `org_id` has `role = 'owner'` at any time. Enforced by the application layer (ownership transfer transaction).
2. **Non-empty admin pool** (soft): The `enforceLastAdminConstraint()` prevents demoting the last admin. The owner can override if needed (owner always has full control).
3. **Tenant isolation**: All queries include `org_id` in WHERE clause.

## Repository Port Changes

### Existing methods to implement (currently TODO stubs)

```
updateRole(orgId: string, id: string, role: RoleValue): Promise<MembershipEntity | undefined>
  — UPDATE memberships SET role = $role WHERE id = $id AND org_id = $orgId RETURNING *

countAdmins(orgId: string): Promise<number>
  — SELECT COUNT(*) FROM memberships WHERE org_id = $orgId AND role = 'admin'
```

### New methods

```
findByOrgAndId(orgId: string, id: string): Promise<MembershipEntity | undefined>
  — SELECT * FROM memberships WHERE id = $id AND org_id = $orgId

transferOwnership(orgId: string, newOwnerId: string, previousOwnerId: string): Promise<void>
  — Within a single transaction:
    UPDATE memberships SET role = 'owner' WHERE id = $newOwnerId AND org_id = $orgId
    UPDATE memberships SET role = 'admin' WHERE id = $previousOwnerId AND org_id = $orgId
```

## Entity: MembershipEntity (no changes)

The existing `MembershipEntity.changeRole(newRole)` method returns a new instance with the updated role. No entity modifications required.

## Value Object: Role (no changes)

The existing `Role` value object supports all three values (`owner`, `admin`, `member`) with hierarchy checks. No modifications required.

## Error Codes (new)

| Code                    | HTTP | Trigger                                            |
|------------------------|------|----------------------------------------------------|
| `AUTH_ROLE_SAME`       | 400  | Target already has the requested role              |
| `AUTH_OWNER_SELF_DEMOTE` | 403 | Owner attempts to change own role without transfer |
| `AUTH_TARGET_NOT_FOUND`| 404  | Target membership ID not found in the organisation |

## Shared Schemas (new)

```
ChangeMemberRoleRequestSchema = z.object({
  role: z.enum(['owner', 'admin', 'member'])
})
```
