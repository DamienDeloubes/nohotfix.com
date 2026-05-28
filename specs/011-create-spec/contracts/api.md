# API Contracts: Create Spec

## POST /api/orgs/:orgSlug/specs

Create a new spec in the organisation's Spec Library.

**Middleware**: `orgScopeMiddleware` (JWT auth + org resolution + membership check)
**Role**: Admin or Owner only (Member → 403)

### Request

**Path params**:
- `orgSlug` (string) — organisation slug

**Body** (JSON):
```json
{
  "title": "Smoke test — login page",
  "systemUnderTest": "Login Service",
  "severity": "medium",
  "preconditions": { "type": "doc", "content": [...] },
  "description": { "type": "doc", "content": [...] },
  "testSteps": [
    { "instruction": "Navigate to /login", "expectedOutcome": "Login form is displayed" },
    { "instruction": "Submit empty form", "expectedOutcome": "Validation errors shown" }
  ],
  "expectedResult": { "type": "doc", "content": [...] },
  "testerNotes": "Run against staging only"
}
```

**Validation** (Zod):
- `title`: string, min 1, max 500 (required)
- `systemUnderTest`: string (optional)
- `severity`: enum `critical | high | medium | low` (optional, defaults to `medium`)
- `preconditions`: unknown/JSON (optional)
- `description`: unknown/JSON (optional)
- `testSteps`: array of `{ instruction: string (min 1), expectedOutcome: string (min 1) }`, max 50 (optional)
- `expectedResult`: unknown/JSON (optional)
- `testerNotes`: string (optional)

### Responses

**201 Created**:
```json
{
  "id": "uuid",
  "orgId": "uuid",
  "title": "Smoke test — login page",
  "systemUnderTest": "Login Service",
  "severity": "medium",
  "preconditions": { "type": "doc", "content": [...] },
  "description": { "type": "doc", "content": [...] },
  "testSteps": [
    { "instruction": "Navigate to /login", "expectedOutcome": "Login form is displayed" }
  ],
  "expectedResult": { "type": "doc", "content": [...] },
  "artifactRequirements": null,
  "testerNotes": "Run against staging only",
  "isArchived": false,
  "createdBy": "uuid",
  "createdAt": "2026-03-09T12:00:00.000Z",
  "updatedAt": "2026-03-09T12:00:00.000Z"
}
```

**400 Bad Request** (validation failure):
```json
{
  "error": "Invalid request body",
  "details": { "fieldErrors": { "title": ["String must contain at least 1 character(s)"] } }
}
```

**403 Forbidden** (member role):
```json
{
  "error": "AUTH_ROLE_INSUFFICIENT",
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found** (invalid org slug):
```json
{
  "error": "AUTH_ORG_NOT_FOUND",
  "message": "Organisation not found"
}
```

---

## GET /api/orgs/:orgSlug/specs/:specId

Retrieve a single spec by ID (minimal detail view for redirect target).

**Middleware**: `orgScopeMiddleware`
**Role**: Admin or Owner only

### Request

**Path params**:
- `orgSlug` (string)
- `specId` (string, UUID)

### Responses

**200 OK**: Same shape as 201 response above.

**403 Forbidden**: Role insufficient.

**404 Not Found**:
```json
{
  "error": "AUTHOR_SPEC_NOT_FOUND",
  "message": "Spec not found"
}
```

---

## GET /api/orgs/:orgSlug/specs/systems-under-test

List distinct "system under test" values used in the org's specs. Used for combobox suggestions.

**Middleware**: `orgScopeMiddleware`
**Role**: Admin or Owner only

### Request

**Path params**:
- `orgSlug` (string)

### Responses

**200 OK**:
```json
{
  "systems": ["Auth Service", "Checkout Flow", "Login Service", "Payment Gateway"]
}
```

Returns alphabetically sorted, distinct, non-null values. Empty array if no specs exist yet.
