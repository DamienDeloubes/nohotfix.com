# Data Model: Archive & Unarchive Spec

**Branch**: `027-archive-spec` | **Date**: 2026-03-12

## No Migration Required

All tables and columns already exist. This feature adds no new tables, columns, or indexes.

## Existing Tables Used

### spec_library (existing — no changes)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| org_id | string | Tenant isolation — required in all queries |
| is_archived | boolean | Default `false`. Toggled by archive/unarchive. Indexed as `(org_id, is_archived)` |
| title | string | |
| ... | ... | All other spec content fields |
| created_at | ColumnType\<Date, string \| undefined, never\> | |
| updated_at | ColumnType\<Date, string \| undefined, string\> | Updated on archive/unarchive |

### playbook_specs (existing — no changes)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| playbook_id | string | FK to playbooks.id |
| section_id | string \| null | FK to playbook_sections.id (nullable for ungrouped) |
| org_id | string | Tenant isolation |
| spec_library_id | string | FK to spec_library.id — rows with this value are deleted on archive |
| position | number | Ordering within section. Gaps after deletion are acceptable. |
| created_at | ColumnType\<Date, string \| undefined, never\> | |

**Archive cascade**: When a spec is archived, all `playbook_specs` rows where `spec_library_id = <archived spec>` and `org_id = <org>` are deleted in the same transaction.

### playbooks (existing — no changes, read-only access)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| org_id | string | Tenant isolation |
| name | string | Displayed in confirmation dialog |
| is_archived | boolean | Used to group playbooks in dialog (active vs. archived) |

**Impact preview**: Queried via JOIN `playbook_specs → playbooks` to find playbooks referencing a spec, grouped by `is_archived`.

### changelog (existing — no changes, append-only)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| org_id | string | Tenant isolation |
| entity_type | 'playbook' \| 'spec_library' | Set to `'spec_library'` for archive/unarchive |
| entity_id | string | The spec ID |
| action | string | `'archived'` or `'unarchived'` |
| field_changes | unknown (JSONB) | `null` for archive/unarchive (no field changes) |
| actor_id | string | User who performed the action |
| actor_name | string | User email |
| created_at | ColumnType\<Date, string \| undefined, never\> | Timestamp of the action |

## New Types

### ArchiveImpactResponse (shared schema)

```typescript
// packages/shared/src/schemas/specs.ts
{
  specId: string;
  activePlaybooks: { id: string; name: string }[];
  archivedPlaybooks: { id: string; name: string }[];
}
```

Returned by the impact preview endpoint. Frontend uses this to render the confirmation dialog content with playbook names grouped by status.

## Query Patterns

### Archive Impact Preview (new)

```sql
SELECT DISTINCT p.id, p.name, p.is_archived
FROM playbook_specs ps
INNER JOIN playbooks p ON p.id = ps.playbook_id AND p.org_id = ps.org_id
WHERE ps.spec_library_id = :specId AND ps.org_id = :orgId
ORDER BY p.name
```

### Playbook Spec Cascade Removal (new)

```sql
DELETE FROM playbook_specs
WHERE spec_library_id = :specId AND org_id = :orgId
```

### Archive Spec (existing — unchanged)

```sql
UPDATE spec_library
SET is_archived = :isArchived, updated_at = NOW()
WHERE id = :specId AND org_id = :orgId
RETURNING *
```

## Relationships

```
spec_library (1) ←──── (*) playbook_specs (*)  ────→ (1) playbooks
                          │
                          └── Deleted on archive (cascade in application layer)
```

No foreign key cascade at the DB level — the application transaction handles the removal atomically.
