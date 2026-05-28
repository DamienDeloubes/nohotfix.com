# Data Model: Archive & Unarchive Playbook

**Branch**: `029-archive-playbook` | **Date**: 2026-03-12

## Overview

No new tables or columns required. The feature uses the existing `playbooks.is_archived` column and `changelog` table.

---

## Existing Entities (No Changes)

### playbooks

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` (PK, auto-generated) | `Generated<string>` in Kysely schema |
| `org_id` | `uuid` (FK -> organisations) | Tenant scope, required in all queries |
| `name` | `varchar(255)` | Playbook name |
| `description` | `text` | Optional description |
| `environment_id` | `uuid` (FK -> environments, nullable) | Associated environment |
| `is_archived` | `boolean NOT NULL DEFAULT FALSE` | **Used by this feature** -- toggles active/archived state |
| `created_at` | `timestamptz` | `ColumnType<Date, string \| undefined, never>` |
| `updated_at` | `timestamptz` | Auto-updated on write |

**Index**: `(org_id, is_archived)` -- already exists, supports efficient tab-filtered queries.

### changelog

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` (PK, auto-generated) | |
| `org_id` | `uuid` (FK -> organisations) | |
| `entity_type` | `varchar` | `'playbook'` for this feature |
| `entity_id` | `uuid` | Playbook ID |
| `action` | `varchar` | `'archived'` or `'unarchived'` (new action types) |
| `actor_id` | `uuid` (FK -> users) | User who performed the action |
| `field_changes` | `jsonb` | `null` for archive/unarchive (no field diffs) |
| `created_at` | `timestamptz` | Timestamp of the action |

---

## Schema Changes Required

### packages/shared/src/schemas/playbooks.ts

Add `'archived'` and `'unarchived'` to the playbook history action types:

```typescript
// Existing actions: 'created', 'name_changed', 'description_changed', 'spec_added', 'spec_removed', 'section_added', ...
// New actions:
'archived', 'unarchived'
```

### packages/shared/src/errors/codes.ts

Add new error code:

```typescript
AUTHOR_PLAYBOOK_ARCHIVED = 'AUTHOR_PLAYBOOK_ARCHIVED',
```

HTTP mapping (in `apps/api/src/shared/errors/`):

```typescript
[ErrorCode.AUTHOR_PLAYBOOK_ARCHIVED]: 409,
```

---

## Query Patterns

### Archive a playbook

```sql
UPDATE playbooks
SET is_archived = true, updated_at = NOW()
WHERE id = :playbookId AND org_id = :orgId
RETURNING *;
```

### Unarchive a playbook

```sql
UPDATE playbooks
SET is_archived = false, updated_at = NOW()
WHERE id = :playbookId AND org_id = :orgId
RETURNING *;
```

### List playbooks (Active tab)

```sql
SELECT p.*, COUNT(ps.id) as spec_count, e.name as environment_name
FROM playbooks p
LEFT JOIN playbook_specs ps ON ps.playbook_id = p.id
LEFT JOIN environments e ON e.id = p.environment_id
WHERE p.org_id = :orgId AND p.is_archived = false
GROUP BY p.id, e.name
ORDER BY p.updated_at DESC;
```

### List playbooks (Archived tab)

```sql
-- Same query with is_archived = true
WHERE p.org_id = :orgId AND p.is_archived = true
```

### Active run count for confirmation dialog

```sql
SELECT COUNT(*) as active_run_count
FROM runs
WHERE playbook_id = :playbookId
  AND org_id = :orgId
  AND status IN ('in_progress', 'awaiting_decision');
```

### Record changelog entry

```sql
INSERT INTO changelog (id, org_id, entity_type, entity_id, action, actor_id, field_changes, created_at)
VALUES (:id, :orgId, 'playbook', :playbookId, :action, :actorId, NULL, NOW());
```

---

## Relationships

```
playbooks (1) --- (N) playbook_sections
playbooks (1) --- (N) playbook_specs (via sections)
playbooks (1) --- (N) runs (source playbook for snapshots)
playbooks (1) --- (N) changelog (entity_type = 'playbook')
```

Archiving a playbook does NOT cascade to any related entities. Sections, specs, and runs remain unchanged.

---

## Validation Rules

- `is_archived` is a boolean; no intermediate states
- Archive/unarchive is idempotent: setting `is_archived = true` when already `true` succeeds silently (returns `wasChanged: false`)
- Only admins and owners can archive/unarchive (enforced via `roleGuard({ minimum: 'admin' })`)
- Writes to archived playbooks (update name, add section, add spec, reorder, etc.) are rejected with `AUTHOR_PLAYBOOK_ARCHIVED`
- Starting a run from an archived playbook is rejected (checked at run creation time)
