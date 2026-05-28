# API Contract: Edit Spec

## PUT /api/orgs/:orgSlug/specs/:specId

Update an existing spec in the Spec Library. Requires admin or owner role.

### Request

**Path Parameters**:
- `orgSlug` (string, required) — Organisation slug
- `specId` (string, UUID, required) — Spec ID

**Headers**:
- `Authorization: Bearer <JWT>` — Required
- `Content-Type: application/json`

**Body** (UpdateLibrarySpecRequestSchema):
```json
{
  "title": "string (1-200 chars, required)",
  "systemUnderTest": "string (optional)",
  "severity": "critical | high | medium | low (optional)",
  "preconditions": "unknown (TipTap JSON, optional)",
  "description": "unknown (TipTap JSON, optional)",
  "testSteps": [
    {
      "instruction": "string (1-500 chars, required)",
      "expectedOutcome": "string (0-500 chars, optional)"
    }
  ],
  "expectedResult": "unknown (TipTap JSON, optional)",
  "artifactRequirements": [
    {
      "type": "text | file | checkbox | url | measured_value | table",
      "label": "string (required)",
      "description": "string (optional)",
      "required": "boolean (optional)"
    }
  ],
  "testerNotes": "string (max 2000 chars, optional)",
  "estimatedDurationMinutes": "number (1-999, optional)",
  "tags": ["string (max 30 chars each, max 10 items, optional)"]
}
```

### Responses

**200 OK** — Spec updated successfully:
```json
{
  "id": "uuid",
  "orgId": "uuid",
  "title": "string",
  "systemUnderTest": "string | null",
  "severity": "critical | high | medium | low | null",
  "preconditions": "unknown | null",
  "description": "unknown | null",
  "testSteps": [
    {
      "instruction": "string",
      "expectedOutcome": "string | null"
    }
  ],
  "expectedResult": "unknown | null",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "string",
      "label": "string",
      "description": "string | null",
      "required": true
    }
  ],
  "testerNotes": "string | null",
  "estimatedDurationMinutes": "number | null",
  "tags": ["string"],
  "isArchived": false,
  "createdBy": "uuid",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**400 Bad Request** — Validation failure:
```json
{
  "error": "Invalid request body",
  "details": { "fieldErrors": {}, "formErrors": [] }
}
```

**403 Forbidden** — Member role (not admin/owner):
```json
{
  "error": "AUTH_ROLE_INSUFFICIENT",
  "message": "Insufficient role to perform this action"
}
```

**403 Forbidden** — Archived spec:
```json
{
  "error": "AUTHOR_SPEC_ARCHIVED",
  "message": "Cannot edit an archived spec"
}
```

**404 Not Found** — Spec not found:
```json
{
  "error": "AUTHOR_SPEC_NOT_FOUND",
  "message": "Spec not found"
}
```

### Middleware Chain

```
orgScopeMiddleware → handler (role check → validate → fetch spec → update → changelog → respond)
```

### Side Effects

- Updates `spec_library.updated_at` timestamp
- Creates 0-N `changelog` entries (one per changed field/artifact)
- Invalidates `specKeys.detail(orgSlug, specId)` and `specKeys.lists(orgSlug)` on frontend
