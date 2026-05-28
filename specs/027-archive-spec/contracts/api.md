# API Contracts: Archive & Unarchive Spec

**Branch**: `027-archive-spec` | **Date**: 2026-03-12

## New Endpoint

### GET `/api/orgs/:orgSlug/specs/:specId/archive-impact`

Returns the playbook templates that reference a spec, grouped by active/archived status. Called by the frontend before showing the archive confirmation dialog.

**Middleware**: `authMiddleware`, `orgScopeMiddleware`, `roleGuard({ minimum: 'admin' })`

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| orgSlug | string | Organisation slug |
| specId | string (UUID) | Spec library ID |

**Response 200**:
```json
{
  "specId": "uuid",
  "activePlaybooks": [
    { "id": "uuid", "name": "Sprint Release" },
    { "id": "uuid", "name": "Hotfix Deploy" }
  ],
  "archivedPlaybooks": [
    { "id": "uuid", "name": "Q4 Release" }
  ]
}
```

**Response 404**: `{ "error": "AUTHOR_SPEC_NOT_FOUND", "message": "Spec not found" }`
**Response 403**: `{ "error": "AUTH_ROLE_INSUFFICIENT", "message": "Insufficient role" }`

---

## Modified Endpoints

### PATCH `/api/orgs/:orgSlug/specs/:specId/archive` (existing — modified behavior)

**Changes**:
- Now removes all `playbook_specs` referencing this spec atomically within the same transaction.
- Idempotent: if the spec is already archived, returns 200 with current state (no playbook removal, no changelog entry).

**Middleware**: unchanged (`authMiddleware`, `orgScopeMiddleware`, `roleGuard({ minimum: 'admin' })`)

**Response 200**: `LibrarySpec` (unchanged shape)

**Transaction scope**:
1. Check current state → if already archived, return immediately
2. Set `is_archived = true`
3. Delete all `playbook_specs` where `spec_library_id = specId AND org_id = orgId`
4. Record changelog entry (action: `'archived'`)

---

### PATCH `/api/orgs/:orgSlug/specs/:specId/unarchive` (existing — modified behavior)

**Changes**:
- Idempotent: if the spec is already active, returns 200 with current state (no changelog entry).
- No playbook restoration — spec is NOT re-added to any playbooks.

**Middleware**: unchanged
**Response 200**: `LibrarySpec` (unchanged shape)

**Transaction scope**:
1. Check current state → if already active, return immediately
2. Set `is_archived = false`
3. Record changelog entry (action: `'unarchived'`)
