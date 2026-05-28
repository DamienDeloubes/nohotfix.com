# Data Model: Managed Environments

**Branch**: `021-managed-environments` | **Date**: 2026-03-11

## New Table: `environments`

| Column       | Type                                              | Constraints                                          |
|-------------|---------------------------------------------------|------------------------------------------------------|
| `id`        | `Generated<string>` (UUID)                        | PK, auto-generated                                   |
| `org_id`    | `string` (UUID)                                   | FK → `organisations.id`, NOT NULL                    |
| `name`      | `string`                                          | NOT NULL, 1-100 chars                                |
| `position`  | `number` (INTEGER)                                | NOT NULL                                             |
| `created_at`| `ColumnType<Date, string \| undefined, never>`    | NOT NULL, default `NOW()`                            |

### Indexes

- `idx_environments_org_position` on `(org_id, position)` — primary query path (list environments for org in order)
- `uq_environments_org_name` — unique index on `(org_id, LOWER(name))` — case-insensitive uniqueness

### Constraints

- `environments_name_length_check`: `CHAR_LENGTH(name) >= 1 AND CHAR_LENGTH(name) <= 100`
- FK `org_id` → `organisations.id` with `ON DELETE CASCADE`

## Kysely Schema Type

```typescript
export interface EnvironmentsTable {
  id: Generated<string>;
  org_id: string;
  name: string;
  position: number;
  created_at: ColumnType<Date, string | undefined, never>;
}
```

Add to `Database` interface:
```typescript
environments: EnvironmentsTable;
```

## Modified Table: `playbooks`

| Change | Column | From | To |
|--------|--------|------|----|
| Add    | `environment_id` | — | `string \| null` (UUID), FK → `environments.id`, nullable |
| Drop   | `environment` | `string \| null` (TEXT) | — |

### Migration Notes

- Add `environment_id` column (nullable FK)
- Drop `environment` column (freeform text, currently unused — no data to migrate). Migration must verify no non-null data exists in `playbooks.environment` before dropping. If data exists, map freeform values to environment IDs by name match before drop.
- No ON DELETE CASCADE for `environment_id` — deletion is guarded at application layer

## Modified Table: `runs`

No schema changes in this feature. The `runs.environment` column remains as freeform text (captures the environment name at snapshot time). Future run creation feature will populate this from the managed environments list.

## Entity: EnvironmentEntity

```
EnvironmentEntity
├── id: string (UUID)
├── orgId: string (UUID)
├── name: EnvironmentName (value object, 1-100 chars, trimmed)
└── position: number (integer, >= 0)
```

### Value Object: EnvironmentName

- Validates: non-empty, trimmed, 1-100 characters
- `.create(raw: string)` trims whitespace and validates
- `.equals(other: EnvironmentName)` — case-insensitive comparison
- `.toString()` returns the stored (trimmed, original-case) value

## Relationships

```
organisations 1 ──── * environments (org_id FK)
environments  1 ──── * playbooks   (environment_id FK, nullable)
```

## Seed Data

On org creation and via migration for existing orgs:

| name         | position |
|-------------|----------|
| Production  | 0        |
| Acceptance  | 1        |
| Test        | 2        |
