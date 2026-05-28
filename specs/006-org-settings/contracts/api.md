# API Contracts: Organisation Settings Page

**Branch**: `006-org-settings` | **Date**: 2026-03-07

## GET /api/orgs/:orgSlug

Retrieve organisation details for the settings page.

**Middleware**: `authMiddleware`, `orgScopeMiddleware`
**Allowed roles**: owner, admin, member (all org members)

### Request

```
GET /api/orgs/:orgSlug
Authorization: Bearer <jwt>
```

**Path params**:
- `orgSlug` (string, required) — Organisation slug

### Response 200

```json
{
  "id": "uuid",
  "name": "My Company",
  "slug": "my-company",
  "createdAt": "2026-03-07T10:00:00.000Z"
}
```

**Schema**: `OrganisationResponseSchema` (existing in `packages/shared/src/schemas/organisation.ts`)

### Error Responses

| Status | Error Code                  | Condition                    |
|--------|-----------------------------|------------------------------|
| 401    | AUTH_TOKEN_*                | Invalid or missing JWT       |
| 403    | AUTH_MEMBERSHIP_NOT_FOUND   | User not a member of org     |
| 404    | AUTH_ORG_NOT_FOUND          | Org slug does not exist      |

---

## PATCH /api/orgs/:orgSlug

Update organisation name. Restricted to Owners and Admins.

**Middleware**: `authMiddleware`, `orgScopeMiddleware`
**Allowed roles**: owner, admin
**OTel span**: `identity.renameOrganisation`

### Request

```
PATCH /api/orgs/:orgSlug
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Path params**:
- `orgSlug` (string, required) — Organisation slug

**Body**:
```json
{
  "name": "New Company Name"
}
```

**Validation** (`UpdateOrganisationRequestSchema`):
- `name`: string, min 1 char, max 100 chars, trimmed, required

### Response 200

```json
{
  "id": "uuid",
  "name": "New Company Name",
  "slug": "my-company",
  "createdAt": "2026-03-07T10:00:00.000Z"
}
```

**Schema**: `OrganisationResponseSchema` (existing)

### Error Responses

| Status | Error Code                  | Condition                             |
|--------|-----------------------------|---------------------------------------|
| 400    | (validation error)          | Missing/invalid body                  |
| 401    | AUTH_TOKEN_*                | Invalid or missing JWT                |
| 403    | AUTH_ROLE_INSUFFICIENT      | User is a Member (not owner/admin)    |
| 403    | AUTH_MEMBERSHIP_NOT_FOUND   | User not a member of org              |
| 404    | AUTH_ORG_NOT_FOUND          | Org slug does not exist               |
| 422    | AUTH_ORG_NAME_INVALID       | Name empty, whitespace-only, or >100 chars |

---

## Zod Schemas

### New Schema (packages/shared/src/schemas/organisation.ts)

```typescript
export const UpdateOrganisationRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});
```

### Existing Schemas (no changes)

- `OrganisationResponseSchema` — used for both GET and PATCH responses
- `OrganisationSlugSchema` — used for slug validation in middleware
