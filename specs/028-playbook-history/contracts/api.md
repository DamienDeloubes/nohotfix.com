# API Contract: Playbook Change History

**Branch**: `028-playbook-history` | **Date**: 2026-03-12

## Endpoints

### GET /api/orgs/:orgSlug/playbooks/:playbookId/history

Retrieve the paginated change history for a playbook.

**Authentication**: Required (any org member)
**Role**: Any (no admin restriction)
**Middleware**: `[authMiddleware, orgScopeMiddleware]`

#### Path Parameters

| Parameter    | Type   | Required | Description          |
|-------------|--------|----------|----------------------|
| `orgSlug`   | string | Yes      | Organisation slug    |
| `playbookId`| string | Yes      | Playbook UUID        |

#### Response: 200 OK

```json
{
  "entries": [
    {
      "id": "uuid",
      "action": "name_changed",
      "fieldChanges": { "old": "Smoke Tests", "new": "Integration Tests" },
      "actorName": "Damien de Loubes",
      "isRemovedMember": false,
      "createdAt": "2026-03-12T14:30:00.000Z"
    },
    {
      "id": "uuid",
      "action": "created",
      "fieldChanges": null,
      "actorName": "Damien de Loubes",
      "isRemovedMember": false,
      "createdAt": "2026-03-12T10:00:00.000Z"
    }
  ]
}
```

**Ordering**: Entries are returned in reverse chronological order (newest first).

**Removed members**: When `isRemovedMember` is `true`, the `actorName` is the denormalized name from the original changelog entry. The frontend displays "Removed member" in place of the name.

#### Response: 404 Not Found

```json
{
  "error": "AUDIT_PLAYBOOK_NOT_FOUND",
  "message": "Playbook not found"
}
```

Returned when `playbookId` does not exist in the organisation.

## Action Types

All 15 action types that may appear in the `action` field:

| Action | Category | `fieldChanges` shape |
|--------|----------|---------------------|
| `created` | Lifecycle | `null` |
| `archived` | Lifecycle | `null` |
| `unarchived` | Lifecycle | `null` |
| `name_changed` | Metadata | `{ old: string, new: string }` |
| `description_updated` | Metadata | `{ old: string\|null, new: string\|null }` |
| `environment_changed` | Metadata | `{ oldId: string\|null, oldName: string\|null, newId: string\|null, newName: string\|null }` |
| `section_added` | Section | `{ sectionId: string, name: string }` |
| `section_renamed` | Section | `{ sectionId: string, old: string, new: string }` |
| `section_removed` | Section | `{ sectionId: string, name: string, specCount: number }` |
| `sections_reordered` | Section | `{ orderedIds: string[] }` |
| `spec_added` | Spec | `{ specLibraryId: string, specTitle: string, sectionId: string\|null, sectionName: string\|null }` |
| `spec_removed` | Spec | `{ specLibraryId: string, specTitle: string, sectionId: string\|null, sectionName: string\|null }` |
| `spec_archived` | Spec | `{ specLibraryId: string, specTitle: string, sectionId: string\|null, sectionName: string\|null }` |
| `specs_reordered` | Spec | `{ sectionId: string\|null, sectionName: string\|null, orderedIds: string[] }` |

## Zod Schemas

```typescript
// packages/shared/src/schemas/playbooks.ts

export const PLAYBOOK_HISTORY_ACTIONS = [
  'created', 'archived', 'unarchived',
  'name_changed', 'description_updated', 'environment_changed',
  'section_added', 'section_renamed', 'section_removed', 'sections_reordered',
  'spec_added', 'spec_removed', 'spec_archived', 'specs_reordered',
] as const;

export const PlaybookHistoryActionSchema = z.enum(PLAYBOOK_HISTORY_ACTIONS);

export const PlaybookHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  action: PlaybookHistoryActionSchema,
  fieldChanges: z.record(z.unknown()).nullable(),
  actorName: z.string(),
  isRemovedMember: z.boolean(),
  createdAt: z.string().datetime(),
});

export const PlaybookHistoryResponseSchema = z.object({
  entries: z.array(PlaybookHistoryEntrySchema),
});
```

## Mutation Side Effects

The following existing endpoints will now also record changelog entries as a side effect. No changes to their request/response contracts.

| Endpoint | Actions Recorded |
|----------|-----------------|
| `POST /api/orgs/:orgSlug/playbooks` | `created` |
| `PATCH /api/orgs/:orgSlug/playbooks/:playbookId` | `name_changed`, `description_updated`, `environment_changed` (one per changed field) |
| `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections` | `section_added` |
| `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` | `section_renamed` |
| `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId` | `section_removed` |
| `POST /api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder` | `sections_reordered` |
| `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs` | `spec_added` |
| `DELETE /api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId` | `spec_removed` |
| `POST /api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder` | `specs_reordered` |
| `PATCH /api/orgs/:orgSlug/specs/:specId/archive` | `spec_archived` (on each affected playbook) |
| Playbook archive/unarchive (when implemented) | `archived`, `unarchived` |
