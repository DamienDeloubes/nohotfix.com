# Data Model: Spec History

**Branch**: `022-spec-history` | **Date**: 2026-03-11

## Schema Changes

**No new tables or migrations required.**

The existing `changelog` table fully supports spec history. All action types and field change payloads fit within the current schema.

## Existing Table: `changelog`

```sql
CREATE TABLE changelog (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      UUID NOT NULL REFERENCES organisations(id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('playbook','spec_library')),
  entity_id   UUID NOT NULL,
  action      TEXT NOT NULL,
  field_changes JSONB,
  actor_id    UUID NOT NULL REFERENCES users(id),
  actor_name  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_changelog_entity
  ON changelog (org_id, entity_type, entity_id, created_at DESC);
```

### Kysely Schema Type (existing)

```typescript
export interface ChangelogTable {
  id: Generated<string>;
  org_id: string;
  entity_type: 'playbook' | 'spec_library';
  entity_id: string;
  action: string;
  field_changes: unknown;  // JSONB
  actor_id: string;
  actor_name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}
```

## How Spec History Maps to Changelog

| Spec History Concept | Changelog Column | Value |
|---------------------|-----------------|-------|
| Which spec | `entity_type` + `entity_id` | `'spec_library'` + spec UUID |
| Which org | `org_id` | Organisation UUID |
| Who changed it | `actor_id` + `actor_name` | User UUID + display name or email |
| What changed | `action` | One of: `created`, `title_changed`, `description_updated`, `tags_changed`, `duration_changed`, `artifact_added`, `artifact_removed`, `artifact_modified` |
| Old/new values | `field_changes` | JSONB `{ fieldName: { old, new } }` or null |
| When | `created_at` | Timestamp (shared across entries from same save) |

## Action Types and Payloads

### `created`
```json
{ "field_changes": null }
```

### `title_changed`
```json
{ "field_changes": { "title": { "old": "Deploy Check", "new": "Deploy Checklist" } } }
```

### `description_updated`
```json
{ "field_changes": null }
```
No content diff stored (rich text diffing is impractical).

### `tags_changed`
```json
{ "field_changes": { "tags": { "old": ["deploy", "backend"], "new": ["deploy", "infra"] } } }
```

### `duration_changed`
```json
{ "field_changes": { "estimated_duration_minutes": { "old": 30, "new": 60 } } }
```

### `artifact_added`
```json
{ "field_changes": { "artifact": { "old": null, "new": { "label": "Screenshot", "type": "file" } } } }
```

### `artifact_removed`
```json
{ "field_changes": { "artifact": { "old": { "label": "Screenshot", "type": "file" }, "new": null } } }
```

### `artifact_modified`
```json
{ "field_changes": { "artifact": { "old": { "label": "Screenshot", "type": "file", "description": "Before" }, "new": { "label": "Screenshot", "type": "file", "description": "After" } } } }
```

## Read Query: History with Removed Member Detection

```sql
SELECT
  c.id,
  c.action,
  c.field_changes,
  c.actor_id,
  c.actor_name,
  c.created_at,
  CASE WHEN m.id IS NULL THEN TRUE ELSE FALSE END AS is_removed_member
FROM changelog c
LEFT JOIN memberships m
  ON m.user_id = c.actor_id AND m.org_id = c.org_id
WHERE c.org_id = $1
  AND c.entity_type = 'spec_library'
  AND c.entity_id = $2
ORDER BY c.created_at DESC;
```

## Entities (Domain Layer)

### SpecChangelogEntry (Audit Domain — read model)

```typescript
interface SpecChangelogEntry {
  id: string;
  action: SpecHistoryAction;
  fieldChanges: Record<string, { old: unknown; new: unknown }> | null;
  actorId: string;
  actorName: string;
  isRemovedMember: boolean;
  createdAt: Date;
}

type SpecHistoryAction =
  | 'created'
  | 'title_changed'
  | 'description_updated'
  | 'tags_changed'
  | 'duration_changed'
  | 'artifact_added'
  | 'artifact_removed'
  | 'artifact_modified';
```

No new entity class needed — this is a read-only DTO. The write side uses the existing `recordChangelog` use case.

## Relationships

```
spec_library (1) ←→ (N) changelog
  via: changelog.entity_id = spec_library.id
       changelog.entity_type = 'spec_library'

users (1) ←→ (N) changelog
  via: changelog.actor_id = users.id

memberships (0..1) ←→ (N) changelog
  via: LEFT JOIN on actor_id + org_id (for removed member detection)
```
