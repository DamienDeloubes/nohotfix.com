# API Contract: Change Member Role

**Feature**: 009-change-member-role | **Date**: 2026-03-09

## PATCH /api/orgs/:orgSlug/members/:memberId/role

Changes the role of a target member. When `role` is `owner`, performs an ownership transfer (owner-only).

### Request

**Path parameters**:
- `orgSlug` (string) — Organisation slug
- `memberId` (string, UUID) — Target membership ID

**Headers**:
- `Authorization: Bearer <token>` — Required

**Body** (`application/json`):
```json
{
  "role": "admin" | "member" | "owner"
}
```

**Validation**: `ChangeMemberRoleRequestSchema` — `role` must be one of the three valid values.

### Middleware

`preHandler: [orgScopeMiddleware]`

The `orgScopeMiddleware` resolves the org slug, verifies the requester's membership, and populates `request.orgContext` with the requester's role, userId, and membershipId.

### Responses

#### 200 OK — Role changed successfully

```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "string | null",
  "lastName": "string | null",
  "email": "string",
  "role": "admin",
  "joinedAt": "2026-03-09T00:00:00.000Z"
}
```

Schema: `OrgMemberDtoSchema` (existing)

#### 200 OK — Ownership transferred

Same response shape. The response reflects the *target member's* updated membership (now owner). The previous owner's demotion to admin is performed atomically server-side.

#### 400 Bad Request — Same role (no-op)

```json
{
  "error": "AUTH_ROLE_SAME",
  "message": "Target member already has this role"
}
```

#### 400 Bad Request — Invalid body

```json
{
  "error": "Invalid request body",
  "details": { ... }
}
```

#### 403 Forbidden — Insufficient role

```json
{
  "error": "AUTH_ROLE_INSUFFICIENT",
  "message": "Insufficient role for this action"
}
```

Triggered when:
- A member (non-admin) attempts any role change
- An admin attempts to assign the owner role
- An admin attempts to modify the owner's role

#### 403 Forbidden — Owner self-demotion

```json
{
  "error": "AUTH_OWNER_SELF_DEMOTE",
  "message": "Owner cannot change their own role without transferring ownership"
}
```

#### 404 Not Found — Target not found

```json
{
  "error": "AUTH_TARGET_NOT_FOUND",
  "message": "Target member not found in this organisation"
}
```

#### 409 Conflict — Last admin

```json
{
  "error": "AUTH_LAST_ADMIN",
  "message": "Cannot remove or demote the last admin"
}
```

### OTel Span Attributes

Set via `getSpan(request)` in the route handler:

| Attribute                | Type    | Description                            |
|-------------------------|---------|----------------------------------------|
| `org.id`                | string  | Organisation ID                        |
| `target.membership_id`  | string  | Target membership being modified       |
| `role.from`             | string  | Previous role of the target            |
| `role.to`               | string  | Requested new role                     |
| `role.is_transfer`      | boolean | Whether this is an ownership transfer  |

### Authorization Matrix

| Actor Role | Target Role | New Role | Result |
|-----------|------------|----------|--------|
| member    | any        | any      | 403 AUTH_ROLE_INSUFFICIENT |
| admin     | member     | admin    | 200 OK |
| admin     | admin      | member   | 200 OK (peer demotion allowed) |
| admin     | owner      | any      | 403 AUTH_ROLE_INSUFFICIENT |
| admin     | any        | owner    | 403 AUTH_ROLE_INSUFFICIENT |
| owner     | member     | admin    | 200 OK |
| owner     | admin      | member   | 200 OK |
| owner     | member     | owner    | 200 OK (ownership transfer) |
| owner     | admin      | owner    | 200 OK (ownership transfer) |
| owner     | self       | admin    | 403 AUTH_OWNER_SELF_DEMOTE |
| owner     | self       | member   | 403 AUTH_OWNER_SELF_DEMOTE |
| any       | any        | same     | 400 AUTH_ROLE_SAME |
