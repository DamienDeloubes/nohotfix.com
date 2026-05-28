# Data Model: Playbook Change History

**Branch**: `028-playbook-history` | **Date**: 2026-03-12

## No Schema Migration Required

This feature uses the existing `changelog` table. No new tables or columns are needed.

## Existing Table: `changelog`

```typescript
// packages/db/src/schema.ts (existing, unchanged)
interface ChangelogTable {
  id: Generated<string>;                              // UUID PK
  org_id: string;                                     // FK → organisations
  entity_type: 'playbook' | 'spec_library';           // Discriminator
  entity_id: string;                                  // FK → playbooks or spec_library
  action: string;                                     // Action name
  field_changes: unknown;                              // JSONB (nullable)
  actor_id: string;                                   // FK → users
  actor_name: string;                                 // Denormalized display name
  created_at: ColumnType<Date, string | undefined, never>; // Immutable timestamp
}
```

**Index**: `idx_changelog_entity ON changelog (org_id, entity_type, entity_id, created_at DESC)`

## New Shared Types

### PlaybookHistoryAction (packages/shared)

```typescript
export const PLAYBOOK_HISTORY_ACTIONS = [
  // Lifecycle (3)
  'created',
  'archived',
  'unarchived',
  // Metadata (3)
  'name_changed',
  'description_updated',
  'environment_changed',
  // Sections (4)
  'section_added',
  'section_renamed',
  'section_removed',
  'sections_reordered',
  // Specs (5)
  'spec_added',
  'spec_removed',
  'spec_archived',
  'specs_reordered',
] as const;

export type PlaybookHistoryAction = (typeof PLAYBOOK_HISTORY_ACTIONS)[number];
```

### PlaybookHistoryEntry (packages/shared)

```typescript
export interface PlaybookHistoryEntry {
  id: string;
  action: PlaybookHistoryAction;
  fieldChanges: Record<string, unknown> | null;
  actorName: string;
  isRemovedMember: boolean;
  createdAt: string; // ISO 8601
}

export interface PlaybookHistoryResponse {
  entries: PlaybookHistoryEntry[];
}
```

### PlaybookChangelogEntry (packages/domains/audit)

```typescript
export interface PlaybookChangelogEntry {
  id: string;
  action: PlaybookHistoryAction;
  fieldChanges: Record<string, unknown> | null;
  actorName: string;
  isRemovedMember: boolean;
  createdAt: Date;
}
```

## field_changes JSONB Shapes by Action

### Lifecycle Actions

```jsonc
// created
null  // or { name: "Smoke Tests", description?: "...", environmentId?: "..." }

// archived, unarchived
null
```

### Metadata Actions

```jsonc
// name_changed
{ "old": "Smoke Tests", "new": "Integration Tests" }

// description_updated
{ "old": "Previous description or null", "new": "New description or null" }

// environment_changed
{ "oldId": "uuid-or-null", "oldName": "Staging or null", "newId": "uuid-or-null", "newName": "Production or null" }
```

### Section Actions

```jsonc
// section_added
{ "sectionId": "uuid", "name": "Regression" }

// section_renamed
{ "sectionId": "uuid", "old": "Regression", "new": "Full Regression" }

// section_removed
{ "sectionId": "uuid", "name": "Regression", "specCount": 3 }

// sections_reordered
{ "orderedIds": ["uuid-1", "uuid-2", "uuid-3"] }
```

### Spec Actions

```jsonc
// spec_added
{ "specLibraryId": "uuid", "specTitle": "Login Flow", "sectionId": "uuid-or-null", "sectionName": "Smoke Tests or null" }

// spec_removed
{ "specLibraryId": "uuid", "specTitle": "Login Flow", "sectionId": "uuid-or-null", "sectionName": "Smoke Tests or null" }

// spec_archived (cascaded from library spec archive)
{ "specLibraryId": "uuid", "specTitle": "Login Flow", "sectionId": "uuid-or-null", "sectionName": "Smoke Tests or null" }

// specs_reordered
{ "sectionId": "uuid-or-null", "sectionName": "Smoke Tests or null", "orderedIds": ["uuid-1", "uuid-2", "uuid-3"] }
```

## Repository Port Extension

```typescript
// packages/domains/audit/src/ports/changelog-repository.ts (add method)
interface ChangelogRepository {
  // ... existing methods ...
  findByPlaybookWithMembership(orgId: string, playbookId: string): Promise<PlaybookChangelogEntry[]>;
}
```

## Validation Rules

- `action` MUST be one of the 15 values in `PLAYBOOK_HISTORY_ACTIONS`
- `field_changes` shape is action-dependent (no shared schema; validated at write time by use case)
- `actor_id` MUST reference an existing user (enforced by FK)
- `actor_name` MUST be non-empty string
- `org_id` MUST be present on every query (tenancy boundary)
