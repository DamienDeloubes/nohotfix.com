# API Contracts: Organization Onboarding

## POST /api/orgs

Create a new organization and assign the authenticated user as owner.

**Auth**: Bearer JWT (no `org_id` required — uses `authMiddlewareNoOrg`)

### Request

```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp"
}
```

**Zod Schema** (`CreateOrganisationRequestSchema`):
```typescript
z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
})
```

### Response 201 Created

```json
{
  "id": "uuid",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "createdAt": "2026-03-05T12:00:00Z"
}
```

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | Validation error | Invalid name or slug format |
| 401 | `AUTH_TOKEN_MISSING` | No Bearer token |
| 409 | `AUTH_ORG_SLUG_TAKEN` | Slug already exists |

---

## GET /api/orgs/check-slug?slug={slug}

Check if an organization slug is available.

**Auth**: Bearer JWT (no `org_id` required — uses `authMiddlewareNoOrg`)

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| slug | string | Yes | The slug to check |

### Response 200 OK

```json
{
  "available": true
}
```

or

```json
{
  "available": false
}
```

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | Validation error | Missing or invalid slug format |
| 401 | `AUTH_TOKEN_MISSING` | No Bearer token |

---

## GET /api/users/me/orgs

List all organizations the authenticated user belongs to.

**Auth**: Bearer JWT (no `org_id` required — uses `authMiddlewareNoOrg`)

### Response 200 OK

```json
{
  "organisations": [
    {
      "id": "uuid",
      "name": "Acme Corporation",
      "slug": "acme-corp",
      "role": "owner",
      "createdAt": "2026-03-05T12:00:00Z"
    }
  ]
}
```

Returns an empty array if the user has no organizations (triggers onboarding).

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 401 | `AUTH_TOKEN_MISSING` | No Bearer token |

---

## Zod Schemas (packages/shared)

### New Schemas (`schemas/organisation.ts`)

```typescript
export const OrganisationSlugSchema = z.string()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

export const CreateOrganisationRequestSchema = z.object({
  name: z.string().min(1).max(100),
  slug: OrganisationSlugSchema,
});

export const OrganisationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
});

export const UserOrganisationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  createdAt: z.string().datetime(),
});

export const CheckSlugResponseSchema = z.object({
  available: z.boolean(),
});
```

### Updated Schema (`schemas/auth.ts`)

```typescript
export const SessionUserSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  role: z.enum(['owner', 'admin', 'member']),  // Added 'owner'
  email: z.string().email(),
  displayName: z.string().optional(),
});
```

## Error Codes (packages/shared)

### New Codes (`errors/codes.ts`)

```typescript
AUTH_ORG_SLUG_TAKEN    // 409 Conflict - slug already in use
AUTH_ORG_NOT_FOUND     // 404 Not Found - org does not exist or user lacks access
```
