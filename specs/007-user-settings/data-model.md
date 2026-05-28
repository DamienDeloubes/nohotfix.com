# Data Model: User Settings Page

**Branch**: `007-user-settings` | **Date**: 2026-03-08

## Schema Changes

### Table: `users` (modified)

| Column | Type | Nullable | Default | Change |
|--------|------|----------|---------|--------|
| `id` | `uuid` | No | `gen_random_uuid()` | Unchanged |
| `workos_user_id` | `text` | No | — | Unchanged |
| `email` | `text` | No | — | Unchanged |
| `display_name` | `text` | Yes | `null` | **DROPPED** |
| `first_name` | `text` | Yes | `null` | **ADDED** |
| `last_name` | `text` | Yes | `null` | **ADDED** |
| `created_at` | `timestamptz` | No | `now()` | Unchanged |
| `updated_at` | `timestamptz` | No | `now()` | Unchanged |

### Migration: `002_user_first_last_name.ts`

**UP**:
1. Add `first_name TEXT` column (nullable)
2. Add `last_name TEXT` column (nullable)
3. Copy `display_name` → `first_name` for all existing rows
4. Drop `display_name` column

**DOWN**:
1. Add `display_name TEXT` column (nullable)
2. Copy `first_name` → `display_name` for all existing rows (concatenate with `last_name` if present)
3. Drop `first_name` and `last_name` columns

### Kysely Schema Update (`packages/db/src/schema.ts`)

```typescript
export interface UsersTable {
  id: Generated<string>;
  workos_user_id: string;
  email: string;
  first_name: string | null;   // was: display_name
  last_name: string | null;    // new
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}
```

## Domain Entities

### UserEntity (modified)

**Props changes**:
- Remove: `displayName: DisplayName | null`
- Add: `firstName: FirstName | null`, `lastName: LastName | null`

**Method changes**:
- `create()`: Accepts `firstName?: string`, `lastName?: string` instead of `displayName?: string`
- `reconstitute()`: Accepts `firstName: FirstName | null`, `lastName: LastName | null`
- `updateProfile()`: Accepts `{ firstName?: string; lastName?: string }` instead of `{ displayName?: string | null }`

### Value Objects

#### FirstName (new) — `packages/domains/identity/src/entities/value-objects/first-name.ts`

- Private constructor, static `.create(raw: string)`
- Validation: non-empty after trim, max 50 characters
- Throws `AuthUserFirstNameInvalidError` on validation failure
- `.equals()`, `.toString()`

#### LastName (new) — `packages/domains/identity/src/entities/value-objects/last-name.ts`

- Private constructor, static `.create(raw: string)`
- Validation: non-empty after trim, max 50 characters
- Throws `AuthUserLastNameInvalidError` on validation failure
- `.equals()`, `.toString()`

#### DisplayName (deleted)

- File removed: `packages/domains/identity/src/entities/value-objects/display-name.ts`
- Tests removed: `packages/domains/identity/src/entities/__tests__/display-name.test.ts`

## Port Interface Changes

### UserRepository (modified)

```typescript
export interface UserRepository {
  findById(id: string): Promise<UserEntity | undefined>;
  findByWorkosId(workosUserId: string): Promise<UserEntity | undefined>;
  upsertByWorkosId(data: {
    workosUserId: string;
    email: string;
    firstName?: string;      // was: displayName
    lastName?: string;       // new
  }): Promise<UserEntity>;
  update(id: string, data: {
    firstName?: string;      // was: displayName
    lastName?: string;       // new
  }): Promise<UserEntity | undefined>;
}
```

### MemberWithUserDto (modified)

```typescript
export interface MemberWithUserDto {
  membershipId: string;
  userId: string;
  firstName: string | null;   // was: displayName
  lastName: string | null;    // new
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}
```

## Error Codes (new)

| Code | HTTP Status | Message |
|------|-------------|---------|
| `AUTH_USER_FIRST_NAME_INVALID` | 400 | First name must be between 1 and 50 characters |
| `AUTH_USER_LAST_NAME_INVALID` | 400 | Last name must be between 1 and 50 characters |
| `AUTH_USER_NOT_FOUND` | 404 | User not found |
