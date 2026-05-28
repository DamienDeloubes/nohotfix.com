# API Contracts: Archive Spec

## PATCH /api/orgs/:orgSlug/specs/:specId/archive

Archive a spec in the library.

**Middleware**: `orgScopeMiddleware`, `roleGuard('admin', 'owner')`

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| orgSlug | string | Organisation slug |
| specId | string (UUID) | Spec library entry ID |

**Request Body**: None

**Success Response**: `200 OK`
```json
{
  "id": "uuid",
  "title": "Login flow verification",
  "isArchived": true,
  "updatedAt": "2026-03-11T10:00:00.000Z"
}
```
Returns the full `LibrarySpec` DTO (same schema as GET /specs/:specId).

**Error Responses**:
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 404 | AUTHOR_SPEC_NOT_FOUND | Spec does not exist for this org |
| 403 | AUTH_ROLE_INSUFFICIENT | Caller is a member (not admin/owner) |
| 403 | AUTH_MEMBERSHIP_NOT_FOUND | Caller is not a member of this org |

**Changelog Side Effect**: Appends a changelog entry:
```json
{
  "entity_type": "spec_library",
  "entity_id": "<specId>",
  "action": "archived",
  "field_changes": null,
  "actor_id": "<userId>",
  "actor_name": "<userDisplayName>"
}
```

---

## PATCH /api/orgs/:orgSlug/specs/:specId/unarchive

Unarchive a spec in the library.

**Middleware**: `orgScopeMiddleware`, `roleGuard('admin', 'owner')`

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| orgSlug | string | Organisation slug |
| specId | string (UUID) | Spec library entry ID |

**Request Body**: None

**Success Response**: `200 OK`
```json
{
  "id": "uuid",
  "title": "Login flow verification",
  "isArchived": false,
  "updatedAt": "2026-03-11T10:00:00.000Z"
}
```
Returns the full `LibrarySpec` DTO.

**Error Responses**:
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 404 | AUTHOR_SPEC_NOT_FOUND | Spec does not exist for this org |
| 403 | AUTH_ROLE_INSUFFICIENT | Caller is a member (not admin/owner) |
| 403 | AUTH_MEMBERSHIP_NOT_FOUND | Caller is not a member of this org |

**Changelog Side Effect**: Appends a changelog entry:
```json
{
  "entity_type": "spec_library",
  "entity_id": "<specId>",
  "action": "unarchived",
  "field_changes": null,
  "actor_id": "<userId>",
  "actor_name": "<userDisplayName>"
}
```

---

## Existing Endpoints — Behaviour Clarifications

### GET /api/orgs/:orgSlug/specs?tab=active|archived

No changes. Already filters by `is_archived` based on `tab` query parameter. Active tab returns `is_archived = false`, Archived tab returns `is_archived = true`.

### GET /api/orgs/:orgSlug/specs/:specId

No changes. Already returns `isArchived` boolean in response. Works for both active and archived specs.

### PUT /api/orgs/:orgSlug/specs/:specId

No changes. Already throws `AUTHOR_SPEC_ARCHIVED` (409) if the spec is archived. Archived specs cannot be edited.

### GET /api/orgs/:orgSlug/specs/:specId/history

No changes. Will automatically include "archived" and "unarchived" changelog entries once they exist, since the endpoint reads from the `changelog` table filtered by `entity_id`.
