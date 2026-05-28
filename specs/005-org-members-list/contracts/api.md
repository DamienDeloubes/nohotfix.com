# API Contract: Organization Members List

**Feature**: 005-org-members-list
**Date**: 2026-03-07

## GET /api/orgs/:orgId/members

List all confirmed members of the authenticated user's organization.

### Authentication

- **Middleware**: `authMiddleware` (org-scoped JWT required)
- **Authorization**: Any authenticated member of the organization (owner, admin, or member)
- **Tenant isolation**: `orgId` for the query is derived from `request.user.orgId` (JWT), not the `:orgId` path parameter

### Request

**Path Parameters**:

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| orgId     | string | yes      | Organization ID (validated against JWT orgId) |

**Query Parameters**: None

**Body**: None

### Response

**200 OK**

```json
{
  "members": [
    {
      "id": "uuid",
      "userId": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "owner",
      "joinedAt": "2026-01-15T10:30:00.000Z"
    },
    {
      "id": "uuid",
      "userId": "uuid",
      "firstName": null,
      "lastName": null,
      "email": "bob@example.com",
      "role": "member",
      "joinedAt": "2026-02-20T14:00:00.000Z"
    }
  ]
}
```

**Response fields**:

| Field       | Type             | Description                                              |
|-------------|------------------|----------------------------------------------------------|
| id          | string (UUID)    | Membership ID                                            |
| userId      | string (UUID)    | User ID                                                  |
| firstName   | string \| null   | User's first name (null if not set — frontend shows email as fallback) |
| lastName    | string \| null   | User's last name                                                         |
| email       | string           | User's email address                                     |
| role        | enum             | `"owner"` \| `"admin"` \| `"member"`                    |
| joinedAt    | string (ISO8601) | When the user joined the organization                    |

**Sort order**: Role hierarchy (owner → admin → member), then alphabetically by `COALESCE(firstName, email)` within each role group.

### Zod Schema

```typescript
// packages/shared/src/schemas/organisation.ts

export const OrgMemberResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'member']),
  joinedAt: z.string().datetime(),
});

export const ListOrgMembersResponseSchema = z.object({
  members: z.array(OrgMemberResponseSchema),
});
```

### Error Responses

| Status | Error Code          | Condition                    |
|--------|---------------------|------------------------------|
| 401    | AUTH_TOKEN_MISSING   | No Authorization header      |
| 401    | AUTH_TOKEN_MALFORMED | Invalid token format         |
| 401    | AUTH_TOKEN_INVALID   | Expired or invalid JWT       |
| 403    | AUTH_ROLE_INSUFFICIENT | User not a member of this org |
