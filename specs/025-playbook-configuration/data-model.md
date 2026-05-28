# Data Model: Playbook & Sections Configuration

**Branch**: `025-playbook-configuration` | **Date**: 2026-03-11

## Existing Tables (no migration needed)

### playbooks

Already exists from migration 001. Updated by migration 006 (added `environment_id` FK).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | PK |
| `org_id` | `UUID` | NO | — | FK → organisations |
| `name` | `TEXT` | NO | — | 1-255 chars (validated by Zod) |
| `description` | `TEXT` | YES | — | Max 500 chars (validated by Zod) |
| `environment_id` | `UUID` | YES | — | FK → environments (nullable) |
| `is_archived` | `BOOLEAN` | NO | `FALSE` | Soft-delete flag |
| `created_by` | `UUID` | NO | — | FK → users |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Updated on metadata changes |

**Indexes**: `idx_playbooks_org (org_id, is_archived)`

### playbook_sections

Already exists from migration 001. No changes needed.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | PK |
| `playbook_id` | `UUID` | NO | — | FK → playbooks (ON DELETE CASCADE) |
| `org_id` | `UUID` | NO | — | FK → organisations |
| `name` | `TEXT` | NO | — | 1-255 chars |
| `position` | `INTEGER` | NO | — | 0-based ordering within playbook |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — |

**Indexes**: `idx_pb_sections_playbook (playbook_id, position)`

### playbook_specs

Exists from migration 001. **Requires migration 007** to make `section_id` nullable.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | PK |
| `section_id` | `UUID` | **YES** ← changed | — | FK → playbook_sections (ON DELETE CASCADE). NULL = ungrouped |
| `playbook_id` | `UUID` | NO | — | FK → playbooks |
| `org_id` | `UUID` | NO | — | FK → organisations |
| `spec_library_id` | `UUID` | YES | — | FK → spec_library. Set when added from library. |
| `title` | `TEXT` | NO | — | Copied from library spec at add time |
| `system_under_test` | `TEXT` | YES | — | Copied from library spec |
| `severity` | `TEXT` | YES | — | CHECK: critical, high, medium, low |
| `preconditions` | `JSONB` | YES | — | Copied from library spec |
| `description` | `JSONB` | YES | — | Copied from library spec |
| `test_steps` | `JSONB` | YES | — | Copied from library spec |
| `expected_result` | `JSONB` | YES | — | Copied from library spec |
| `artifact_requirements` | `JSONB` | YES | — | Copied from library spec |
| `tester_notes` | `TEXT` | YES | — | Copied from library spec |
| `position` | `INTEGER` | NO | — | 0-based ordering within section (or ungrouped zone) |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — |

**Indexes**:
- `idx_pb_specs_section (section_id, position)`
- `idx_pb_specs_library (spec_library_id)`
- `idx_pb_specs_playbook (playbook_id, section_id, position)` ← NEW (migration 007)

## Migration 007: Nullable playbook_spec section_id

```sql
-- Up
ALTER TABLE playbook_specs ALTER COLUMN section_id DROP NOT NULL;
CREATE INDEX idx_pb_specs_playbook ON playbook_specs (playbook_id, section_id, position);

-- Down
DELETE FROM playbook_specs WHERE section_id IS NULL;
ALTER TABLE playbook_specs ALTER COLUMN section_id SET NOT NULL;
DROP INDEX IF EXISTS idx_pb_specs_playbook;
```

**Rationale**: Ungrouped specs (specs not belonging to any section) need `section_id = NULL`. The new composite index supports efficient queries for "all specs in a playbook" and "ungrouped specs in a playbook" (`WHERE playbook_id = ? AND section_id IS NULL ORDER BY position`).

## Kysely Schema Type Changes

```typescript
// packages/db/src/schema.ts — PlaybookSpecsTable
export interface PlaybookSpecsTable {
  // ...existing fields...
  section_id: string | null;  // Changed from: string
  // ...rest unchanged...
}
```

## Domain Type Changes

```typescript
// packages/domains/authoring/src/types.ts

// PlaybookSpec.sectionId becomes nullable
export interface PlaybookSpec {
  id: string;
  sectionId: string | null;  // Changed from: string
  // ...rest unchanged...
}

// NEW: Lightweight type for list page
export interface PlaybookWithCounts {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  environmentName?: string;  // Joined from environments table
  isArchived: boolean;
  createdBy: string;
  specCount: number;         // COUNT of playbook_specs
  createdAt: Date;
  updatedAt: Date;
}
```

## Port Interface Changes

### PlaybookRepository — additions

```typescript
findByOrgWithCounts(orgId: string, includeArchived?: boolean): Promise<PlaybookWithCounts[]>;
```

### PlaybookSpecRepository — additions

```typescript
findByPlaybook(playbookId: string, orgId: string): Promise<PlaybookSpec[]>;
findUngrouped(playbookId: string, orgId: string): Promise<PlaybookSpec[]>;
updatePositions(updates: Array<{ id: string; position: number }>, orgId: string): Promise<void>;
existsInPlaybook(playbookId: string, specLibraryId: string, orgId: string): Promise<boolean>;
deleteBySectionId(sectionId: string, orgId: string): Promise<void>;
```

## New Error Codes

```typescript
// packages/shared/src/errors/codes.ts — additions to ErrorCode enum
AUTHOR_SECTION_NOT_FOUND = 'AUTHOR_SECTION_NOT_FOUND',
AUTHOR_PLAYBOOK_NAME_INVALID = 'AUTHOR_PLAYBOOK_NAME_INVALID',
AUTHOR_PLAYBOOK_SPEC_DUPLICATE = 'AUTHOR_PLAYBOOK_SPEC_DUPLICATE',
```

## New Zod Schemas

```typescript
// packages/shared/src/schemas/playbooks.ts — additions

export const ReorderSectionsRequestSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const ReorderSpecsRequestSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const AddSpecFromLibraryRequestSchema = z.object({
  specLibraryId: z.string().uuid(),
  sectionId: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0).optional(),
});
```

## Entity Relationships

```
organisations 1──* playbooks
playbooks     1──* playbook_sections
playbooks     1──* playbook_specs (via playbook_id)
playbook_sections 1──* playbook_specs (via section_id, nullable)
spec_library  1──* playbook_specs (via spec_library_id, nullable)
environments  1──* playbooks (via environment_id, nullable)
users         1──* playbooks (via created_by)
```

## Uniqueness Constraints

- `(playbook_id, spec_library_id)` — enforced at application level (use case checks `existsInPlaybook` before insert). Not a DB unique constraint because `spec_library_id` can be NULL (inline specs in future).
- Playbook names are NOT unique within an org (by design — see clarification phase).
- Section names are NOT unique within a playbook (multiple sections can have the same name).
