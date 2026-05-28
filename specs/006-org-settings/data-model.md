# Data Model: Organisation Settings Page

**Branch**: `006-org-settings` | **Date**: 2026-03-07

## Schema Changes

**None required.** All data structures already exist.

## Existing Entities (referenced by this feature)

### Organisation

| Field       | Type              | Constraints                        | Mutable |
|-------------|-------------------|------------------------------------|---------|
| id          | UUID (Generated)  | Primary key, auto-generated        | No      |
| name        | string            | 1-100 characters, non-empty        | Yes     |
| slug        | string            | 3-50 chars, lowercase alphanum + hyphens, unique | No |
| created_at  | Date              | Auto-set on creation               | No      |
| updated_at  | Date              | Auto-set on creation and mutation   | Yes     |

**Domain Entity**: `OrganisationEntity` in `packages/domains/identity/src/entities/organisation.ts`
- `rename(newName: string)` returns a new instance with updated name and `updatedAt`
- Value objects: `OrganisationName` (1-100 chars), `OrganisationSlug` (3-50 chars, regex validated)

### Membership (for role-based access)

| Field       | Type              | Constraints                        | Mutable |
|-------------|-------------------|------------------------------------|---------|
| id          | UUID (Generated)  | Primary key, auto-generated        | No      |
| org_id      | UUID              | FK → organisations.id              | No      |
| user_id     | UUID              | FK → users.id                      | No      |
| role        | string            | 'owner' \| 'admin' \| 'member'    | Yes     |
| created_at  | Date              | Auto-set on creation               | No      |
| updated_at  | Date              | Auto-set on creation and mutation   | Yes     |

**Domain Entity**: `MembershipEntity` in `packages/domains/identity/src/entities/membership.ts`
- `role` determines edit permissions (owner/admin can rename, member cannot)

## Validation Rules

| Rule                           | Enforced By                      |
|--------------------------------|----------------------------------|
| Name non-empty                 | `OrganisationName.create()`      |
| Name max 100 chars             | `OrganisationName.create()`      |
| Name no whitespace-only        | `OrganisationName.create()`      |
| Slug immutable                 | No update endpoint; not in PATCH body schema |
| Role check (owner/admin only)  | `renameOrganisation` use case    |

## Kysely Schema Reference

```typescript
// packages/db/src/schema.ts — NO CHANGES
export interface OrganisationsTable {
  id: Generated<string>;
  name: string;
  slug: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}
```
