# API Contracts: Playbook & Sections Configuration

**Branch**: `025-playbook-configuration` | **Date**: 2026-03-11

All endpoints are registered in `apps/api/src/routes/authoring.ts`. All require `orgScopeMiddleware` (JWT auth + org slug resolution + membership check). Write endpoints additionally require `roleGuard({ minimum: 'admin' })`.

## Playbook CRUD

### GET /api/orgs/:orgSlug/playbooks

List playbooks for the organisation (list page).

**Middleware**: `[orgScopeMiddleware]`
**Access**: owner, admin, member

**Response** `200`:
```json
{
  "playbooks": [
    {
      "id": "uuid",
      "name": "Sprint Release",
      "description": "Full regression for sprint releases",
      "environmentName": "Staging",
      "specCount": 15,
      "createdAt": "2026-03-11T10:00:00.000Z",
      "updatedAt": "2026-03-11T10:00:00.000Z"
    }
  ]
}
```

**Notes**: Returns non-archived playbooks only. Joins `environments` for `environmentName`. Counts `playbook_specs` for `specCount`.

---

### POST /api/orgs/:orgSlug/playbooks

Create a new playbook.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`
**Access**: owner, admin

**Request body** (validated by `CreatePlaybookRequestSchema`):
```json
{
  "name": "Sprint Release",
  "description": "Optional description",
  "environmentId": "uuid-or-null"
}
```

**Response** `201`:
```json
{
  "id": "uuid",
  "name": "Sprint Release",
  "description": "Optional description",
  "environmentId": "uuid-or-null",
  "isArchived": false,
  "createdBy": "user-uuid",
  "createdAt": "2026-03-11T10:00:00.000Z",
  "updatedAt": "2026-03-11T10:00:00.000Z"
}
```

**Errors**: `AUTHOR_PLAYBOOK_NAME_INVALID` (400)

---

### GET /api/orgs/:orgSlug/playbooks/:playbookId

Get full playbook with sections and specs (editor page load).

**Middleware**: `[orgScopeMiddleware]`
**Access**: owner, admin, member

**Response** `200`:
```json
{
  "playbook": {
    "id": "uuid",
    "name": "Sprint Release",
    "description": "Description text",
    "environmentId": "env-uuid",
    "isArchived": false,
    "createdBy": "user-uuid",
    "createdAt": "2026-03-11T10:00:00.000Z",
    "updatedAt": "2026-03-11T10:00:00.000Z"
  },
  "sections": [
    {
      "id": "section-uuid",
      "name": "Backend",
      "position": 0,
      "specs": [
        {
          "id": "pb-spec-uuid",
          "specLibraryId": "lib-spec-uuid",
          "title": "API Auth Test",
          "severity": "high",
          "systemUnderTest": "Auth Service",
          "position": 0
        }
      ]
    }
  ],
  "ungroupedSpecs": [
    {
      "id": "pb-spec-uuid",
      "specLibraryId": "lib-spec-uuid",
      "title": "Smoke Test",
      "severity": "medium",
      "systemUnderTest": null,
      "position": 0
    }
  ]
}
```

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404)

---

### PATCH /api/orgs/:orgSlug/playbooks/:playbookId

Update playbook metadata (inline editing).

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`
**Access**: owner, admin

**Request body** (validated by `UpdatePlaybookRequestSchema`):
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "environmentId": "new-env-uuid"
}
```

All fields optional. Only provided fields are updated.

**Response** `200`: Updated playbook object (same shape as POST response).

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404), `AUTHOR_PLAYBOOK_NAME_INVALID` (400)

---

## Section CRUD

### POST /api/orgs/:orgSlug/playbooks/:playbookId/sections

Create a new section.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Request body** (validated by `CreateSectionRequestSchema`):
```json
{
  "name": "Backend Tests"
}
```

**Response** `201`: Section object with auto-assigned position (appended at end).
```json
{
  "id": "section-uuid",
  "playbookId": "playbook-uuid",
  "name": "Backend Tests",
  "position": 2,
  "createdAt": "2026-03-11T10:00:00.000Z"
}
```

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404)

---

### PATCH /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId

Update section (rename).

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Request body** (validated by `UpdateSectionRequestSchema`):
```json
{
  "name": "New Section Name"
}
```

**Response** `200`: Updated section object.

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404), `AUTHOR_SECTION_NOT_FOUND` (404)

---

### DELETE /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId

Delete a section and all its spec references.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Response** `204`: No content.

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404), `AUTHOR_SECTION_NOT_FOUND` (404)

**Notes**: DB cascade deletes `playbook_specs` rows in the section. Library specs are NOT deleted.

---

### POST /api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder

Reorder sections.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Request body** (validated by `ReorderSectionsRequestSchema`):
```json
{
  "orderedIds": ["section-uuid-3", "section-uuid-1", "section-uuid-2"]
}
```

**Response** `200`:
```json
{ "success": true }
```

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404)

---

## Spec Management

### POST /api/orgs/:orgSlug/playbooks/:playbookId/specs

Add a spec from the library to the playbook. Can target a section or the ungrouped zone.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Request body** (validated by `AddSpecFromLibraryRequestSchema`):
```json
{
  "specLibraryId": "lib-spec-uuid",
  "sectionId": "section-uuid-or-null"
}
```

`sectionId` null or omitted → ungrouped zone.

**Response** `201`: Created playbook spec object.
```json
{
  "id": "pb-spec-uuid",
  "sectionId": null,
  "specLibraryId": "lib-spec-uuid",
  "title": "API Auth Test",
  "severity": "high",
  "systemUnderTest": "Auth Service",
  "position": 3
}
```

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404), `AUTHOR_SECTION_NOT_FOUND` (404), `AUTHOR_SPEC_NOT_FOUND` (404), `AUTHOR_PLAYBOOK_SPEC_DUPLICATE` (409)

---

### DELETE /api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId

Remove a spec from the playbook.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Response** `204`: No content.

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404)

---

### POST /api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder

Reorder specs within a section or the ungrouped zone.

**Middleware**: `[orgScopeMiddleware, roleGuard({ minimum: 'admin' })]`

**Request body** (validated by `ReorderSpecsRequestSchema`):
```json
{
  "sectionId": "section-uuid-or-null",
  "orderedIds": ["spec-uuid-2", "spec-uuid-1", "spec-uuid-3"]
}
```

`sectionId` null → reorder ungrouped zone.

**Response** `200`:
```json
{ "success": true }
```

**Errors**: `AUTHOR_PLAYBOOK_NOT_FOUND` (404), `AUTHOR_SECTION_NOT_FOUND` (404)

---

## Spec Library Search (for picker)

### GET /api/orgs/:orgSlug/specs?q=searchterm

Already exists (spec library list endpoint). The spec picker reuses this endpoint with a `q` query parameter for title search. Returns only non-archived specs.

**Middleware**: `[orgScopeMiddleware]`

**Response**: Existing spec library list response shape — `{ specs: [...] }` with `id`, `title`, `severity`, `systemUnderTest`.

**Notes**: No new endpoint needed. The picker calls the existing spec library list with a search filter.
