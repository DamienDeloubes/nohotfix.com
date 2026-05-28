# Data Model: Archive Spec

## Existing Entities (no migration needed)

### spec_library (existing table — no changes)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| org_id | string | Tenant FK |
| title | string | Spec title |
| is_archived | boolean | **Used by this feature**. Default `false`. Set to `true` on archive, `false` on unarchive. |
| ... | ... | Other fields unchanged |
| created_at | ColumnType\<Date\> | Immutable |
| updated_at | ColumnType\<Date\> | Updated on archive/unarchive |

### changelog (existing table — no changes)

| Column | Type | Notes |
|--------|------|-------|
| id | Generated\<string\> | UUID PK |
| org_id | string | Tenant FK |
| entity_type | 'playbook' \| 'spec_library' | Set to `'spec_library'` for spec archive/unarchive |
| entity_id | string | FK to spec_library.id |
| action | string | **New values**: `'archived'`, `'unarchived'` |
| field_changes | JSONB \| null | `null` for archive/unarchive (no field-level changes) |
| actor_id | string | User who performed the action |
| actor_name | string | User display name at time of action |
| created_at | ColumnType\<Date\> | Immutable timestamp |

## Schema Changes (Zod — `packages/shared/src/schemas/specs.ts`)

### SpecHistoryActionSchema (modify)

Add `'archived'` and `'unarchived'` to the existing enum:

```typescript
// Before:
export const SpecHistoryActionSchema = z.enum([
  'created', 'title_changed', 'description_updated', 'tags_changed',
  'duration_changed', 'system_under_test_changed', 'severity_changed',
  'preconditions_updated', 'test_steps_updated', 'expected_result_updated',
  'tester_notes_updated', 'artifact_added', 'artifact_removed', 'artifact_modified',
]);

// After:
export const SpecHistoryActionSchema = z.enum([
  'created', 'title_changed', 'description_updated', 'tags_changed',
  'duration_changed', 'system_under_test_changed', 'severity_changed',
  'preconditions_updated', 'test_steps_updated', 'expected_result_updated',
  'tester_notes_updated', 'artifact_added', 'artifact_removed', 'artifact_modified',
  'archived', 'unarchived',
]);
```

## Repository Port Extension

### SpecLibraryRepository (modify interface)

Add one new method to the existing port interface:

```typescript
// packages/domains/authoring/src/ports/spec-library-repository.ts
export interface SpecLibraryRepository {
  // ... existing methods ...
  setArchived(id: string, orgId: string, isArchived: boolean): Promise<SpecLibraryEntry | undefined>;
}
```

**Behaviour**: Sets `is_archived` and `updated_at`. Returns the updated entry, or `undefined` if spec not found for given `id + org_id`.

## Domain Use Case

### archiveLibrarySpec (replace TODO stub)

```typescript
// packages/domains/authoring/src/use-cases/archive-library-spec.ts
interface ArchiveLibrarySpecDeps {
  specLibraryRepo: SpecLibraryRepository;
}

interface ArchiveLibrarySpecCommand {
  specId: string;
  orgId: string;
  archive: boolean; // true = archive, false = unarchive
}

// Returns updated SpecLibraryEntry or throws AUTHOR_SPEC_NOT_FOUND
```

## Validation Rules

- `specId` must exist for the given `org_id` → `AUTHOR_SPEC_NOT_FOUND` (404)
- Archiving an already-archived spec is idempotent (succeeds, records changelog)
- Unarchiving an already-active spec is idempotent (succeeds, records changelog)
- Only admin/owner roles can archive/unarchive → `AUTH_ROLE_INSUFFICIENT` (403, enforced by `roleGuard` middleware)

## State Transitions

```
Active (is_archived = false)  ←→  Archived (is_archived = true)
```

- No intermediate states
- Both directions are idempotent
- No constraints from other entities (playbook linking out of scope)
