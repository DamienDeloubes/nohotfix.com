# API Contracts: Archive & Unarchive Playbook

**Branch**: `029-archive-playbook` | **Date**: 2026-03-12

---

## New Endpoints

### PATCH /api/orgs/:orgSlug/playbooks/:playbookId/archive

**Purpose**: Archive a playbook (set `is_archived = true`).

**Auth**: Org-scoped, admin minimum.

**Request**: No body required.

**Response (200)**:
```json
{
  "playbook": {
    "id": "uuid",
    "name": "Release Playbook v3",
    "description": "...",
    "environmentId": "uuid | null",
    "isArchived": true,
    "createdAt": "2026-03-10T12:00:00Z",
    "updatedAt": "2026-03-12T14:30:00Z"
  },
  "wasChanged": true
}
```

**Response (200, already archived)**:
```json
{
  "playbook": { "..." },
  "wasChanged": false
}
```

**Error Responses**:
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 403 | `AUTH_ROLE_INSUFFICIENT` | Member attempts archive |
| 404 | `AUTHOR_PLAYBOOK_NOT_FOUND` | Playbook not found or wrong org |

**Changelog Side Effect**: Records `{ entityType: 'playbook', action: 'archived' }` only when `wasChanged: true`.

---

### PATCH /api/orgs/:orgSlug/playbooks/:playbookId/unarchive

**Purpose**: Unarchive a playbook (set `is_archived = false`).

**Auth**: Org-scoped, admin minimum.

**Request**: No body required.

**Response (200)**:
```json
{
  "playbook": {
    "id": "uuid",
    "name": "Release Playbook v3",
    "isArchived": false,
    "..."
  },
  "wasChanged": true
}
```

**Response (200, already active)**:
```json
{
  "playbook": { "..." },
  "wasChanged": false
}
```

**Error Responses**:
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 403 | `AUTH_ROLE_INSUFFICIENT` | Member attempts unarchive |
| 404 | `AUTHOR_PLAYBOOK_NOT_FOUND` | Playbook not found or wrong org |

**Changelog Side Effect**: Records `{ entityType: 'playbook', action: 'unarchived' }` only when `wasChanged: true`.

---

### GET /api/orgs/:orgSlug/playbooks/:playbookId/archive-info

**Purpose**: Get information needed for the archive confirmation dialog (active run count).

**Auth**: Org-scoped, admin minimum.

**Request**: No body or query params.

**Response (200)**:
```json
{
  "playbookId": "uuid",
  "activeRunCount": 3
}
```

`activeRunCount` includes runs with status `in_progress` or `awaiting_decision`.

**Error Responses**:
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 403 | `AUTH_ROLE_INSUFFICIENT` | Member attempts access |
| 404 | `AUTHOR_PLAYBOOK_NOT_FOUND` | Playbook not found or wrong org |

---

## Modified Endpoints

### GET /api/orgs/:orgSlug/playbooks

**Change**: Ensure `isArchived` query parameter is supported for filtering.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `isArchived` | `boolean` | `false` | Filter by archive status. `false` = Active tab, `true` = Archived tab |

**Response**: No change to response shape. Returns playbooks matching the filter.

---

### Existing Write Endpoints (Guard Addition)

All write endpoints under `/api/orgs/:orgSlug/playbooks/:playbookId/*` (except `/archive` and `/unarchive`) gain an archived-playbook guard:

- `PATCH /api/playbooks/:id` (update name/description/environment)
- `POST /api/playbooks/:id/sections` (add section)
- `PATCH /api/playbooks/:playbookId/sections/:sectionId` (update section)
- `DELETE /api/playbooks/:playbookId/sections/:sectionId` (delete section)
- `POST /api/playbooks/:playbookId/sections/reorder` (reorder sections)
- `POST /api/playbooks/:playbookId/sections/:sectionId/specs` (add spec)
- `DELETE /api/playbooks/:playbookId/sections/:sectionId/specs/:specId` (remove spec)
- `POST /api/playbooks/:playbookId/sections/:sectionId/specs/reorder` (reorder specs)
- `POST /api/playbooks/:playbookId/sections/:sectionId/specs/bulk` (bulk insert)
- `POST /api/playbooks/:playbookId/sections/copy-from` (copy section)

**New Error Response** (all above):
| Status | Error Code | Condition |
|--------|-----------|-----------|
| 409 | `AUTHOR_PLAYBOOK_ARCHIVED` | Playbook is archived |

---

## Zod Schemas

### Request Schemas (packages/shared)

```typescript
// No request body needed for archive/unarchive (path params only)
export const PlaybookArchiveInfoResponseSchema = z.object({
  playbookId: z.string().uuid(),
  activeRunCount: z.number().int().min(0),
});

export const ArchivePlaybookResponseSchema = z.object({
  playbook: PlaybookDtoSchema,
  wasChanged: z.boolean(),
});
```

### Playbook History Actions Update

```typescript
// packages/shared/src/schemas/playbooks.ts
export const PLAYBOOK_HISTORY_ACTIONS = [
  // ... existing actions ...
  'archived',
  'unarchived',
] as const;
```
