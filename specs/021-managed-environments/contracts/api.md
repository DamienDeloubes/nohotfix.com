# API Contracts: Managed Environments

**Branch**: `021-managed-environments` | **Date**: 2026-03-11

All endpoints are org-scoped and require `orgScopeMiddleware`. Admin-only endpoints additionally check role.

---

## GET `/api/orgs/:orgSlug/environments`

List all environments for the org, ordered by position.

**Middleware**: `orgScopeMiddleware` (any role can read)

**Response** `200`:
```json
{
  "environments": [
    {
      "id": "uuid",
      "name": "Production",
      "position": 0,
      "createdAt": "2026-03-11T10:00:00.000Z"
    }
  ]
}
```

**Zod Response Schema**: `EnvironmentDtoSchema`

---

## POST `/api/orgs/:orgSlug/environments`

Create a new environment. Appended at the end (highest position + 1).

**Middleware**: `orgScopeMiddleware`, role check: `admin` or `owner`

**Request Body**:
```json
{
  "name": "Hotfix"
}
```

**Zod Request Schema**: `CreateEnvironmentRequestSchema`
- `name`: string, 1-100 chars, trimmed

**Response** `201`:
```json
{
  "id": "uuid",
  "name": "Hotfix",
  "position": 3,
  "createdAt": "2026-03-11T10:00:00.000Z"
}
```

**Errors**:
- `400` — Invalid request body (Zod validation)
- `409` — `AUTH_ENV_NAME_DUPLICATE`: "An environment with this name already exists"

---

## PATCH `/api/orgs/:orgSlug/environments/:environmentId`

Rename an environment.

**Middleware**: `orgScopeMiddleware`, role check: `admin` or `owner`

**Request Body**:
```json
{
  "name": "Staging"
}
```

**Zod Request Schema**: `UpdateEnvironmentRequestSchema`
- `name`: string, 1-100 chars, trimmed

**Response** `200`:
```json
{
  "id": "uuid",
  "name": "Staging",
  "position": 1,
  "createdAt": "2026-03-11T10:00:00.000Z"
}
```

**Errors**:
- `400` — Invalid request body
- `404` — `AUTH_ENV_NOT_FOUND`: "Environment not found"
- `409` — `AUTH_ENV_NAME_DUPLICATE`: "An environment with this name already exists"

---

## DELETE `/api/orgs/:orgSlug/environments/:environmentId`

Delete an environment. Blocked if referenced by playbooks.

**Middleware**: `orgScopeMiddleware`, role check: `admin` or `owner`

**Response** `204`: No content

**Errors**:
- `404` — `AUTH_ENV_NOT_FOUND`: "Environment not found"
- `409` — `AUTH_ENV_IN_USE`: "This environment cannot be deleted because it is used by [X] playbook(s). Remove it from all playbooks before deleting."

---

## POST `/api/orgs/:orgSlug/environments/reorder`

Reorder all environments. Accepts the full ordered list of environment IDs.

**Middleware**: `orgScopeMiddleware`, role check: `admin` or `owner`

**Request Body**:
```json
{
  "environmentIds": ["uuid-1", "uuid-3", "uuid-2"]
}
```

**Zod Request Schema**: `ReorderEnvironmentsRequestSchema`
- `environmentIds`: array of UUID strings, min 1

**Response** `200`:
```json
{
  "environments": [
    { "id": "uuid-1", "name": "Production", "position": 0, "createdAt": "..." },
    { "id": "uuid-3", "name": "Test", "position": 1, "createdAt": "..." },
    { "id": "uuid-2", "name": "Acceptance", "position": 2, "createdAt": "..." }
  ]
}
```

**Errors**:
- `400` — Invalid request body or ID list doesn't match all org environments

---

## Error Codes (new)

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_ENV_NOT_FOUND` | 404 | Environment does not exist or does not belong to org |
| `AUTH_ENV_NAME_DUPLICATE` | 409 | An environment with this name already exists (case-insensitive) |
| `AUTH_ENV_NAME_INVALID` | 422 | Environment name fails validation (empty, too long, whitespace-only) |
| `AUTH_ENV_IN_USE` | 409 | Environment is referenced by playbooks and cannot be deleted. Active run checks deferred to run creation feature. |

---

## Zod Schemas (packages/shared)

```typescript
// DTO
export const EnvironmentDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
});

// Request: create
export const CreateEnvironmentRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

// Request: update (rename)
export const UpdateEnvironmentRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

// Request: reorder
export const ReorderEnvironmentsRequestSchema = z.object({
  environmentIds: z.array(z.string().uuid()).min(1),
});
```
