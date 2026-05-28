# API Contracts: Spec History

**Branch**: `022-spec-history` | **Date**: 2026-03-11

## GET /api/orgs/:orgSlug/specs/:specId/history

Retrieves the complete change history for a spec.

**Auth**: `orgScopeMiddleware` (any org member)
**Role**: All roles (owner, admin, member)

### Request

```
GET /api/orgs/:orgSlug/specs/:specId/history
```

Path params:
- `orgSlug` — Organisation slug (resolved by middleware)
- `specId` — UUID of the spec

### Response 200

```json
{
  "entries": [
    {
      "id": "uuid",
      "action": "title_changed",
      "fieldChanges": {
        "title": { "old": "Deploy Check", "new": "Deploy Checklist" }
      },
      "actorName": "Damien",
      "isRemovedMember": false,
      "createdAt": "2026-03-11T14:30:00.000Z"
    },
    {
      "id": "uuid",
      "action": "created",
      "fieldChanges": null,
      "actorName": "Damien",
      "isRemovedMember": false,
      "createdAt": "2026-03-10T10:00:00.000Z"
    }
  ]
}
```

Entries ordered by `createdAt` DESC (newest first).

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `entries[].id` | string (UUID) | Unique entry identifier |
| `entries[].action` | string | One of: `created`, `title_changed`, `description_updated`, `tags_changed`, `duration_changed`, `artifact_added`, `artifact_removed`, `artifact_modified` |
| `entries[].fieldChanges` | object or null | `{ fieldName: { old, new } }` — null for `created` and `description_updated` |
| `entries[].actorName` | string | Display name of actor, or "Removed member" if no longer in org |
| `entries[].isRemovedMember` | boolean | `true` if actor is no longer an org member |
| `entries[].createdAt` | string (ISO 8601) | Timestamp of the change |

### Response 404

Spec not found (uses existing `AUTHOR_SPEC_NOT_FOUND` error code).

```json
{
  "error": "AUTHOR_SPEC_NOT_FOUND",
  "message": "Spec not found"
}
```

## Write Side: Changelog Recording on Spec Update

No new write endpoint. History entries are created as a side effect of the existing `PATCH /api/orgs/:orgSlug/specs/:specId` endpoint (to be implemented as part of the update-library-spec feature).

The route handler:
1. Fetches current spec state (before update)
2. Calls `updateLibrarySpec` use case (validates + persists)
3. Calls `recordSpecChanges` (compares old vs new, creates N changelog entries)

### Zod Schemas (to add to `packages/shared`)

```typescript
// Response schema
export const SpecHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  action: z.enum([
    'created',
    'title_changed',
    'description_updated',
    'tags_changed',
    'duration_changed',
    'artifact_added',
    'artifact_removed',
    'artifact_modified',
  ]),
  fieldChanges: z.record(z.object({ old: z.unknown(), new: z.unknown() })).nullable(),
  actorName: z.string(),
  isRemovedMember: z.boolean(),
  createdAt: z.string().datetime(),
});

export const SpecHistoryResponseSchema = z.object({
  entries: z.array(SpecHistoryEntrySchema),
});
```
