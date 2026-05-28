# API Contract: Remove Organization Member

## DELETE /api/orgs/:orgSlug/members/:memberId

Remove a member from the organization (hard delete). Also used for self-removal (leave).

### Authentication

Required. Middleware chain: `authMiddleware` → `orgScopeMiddleware`

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| orgSlug | string | Organization slug |
| memberId | string | Membership ID (UUID) to remove |

### Request Body

None.

### Authorization Rules

| Actor Role | Target Role | Self-Removal? | Result |
|------------|-------------|---------------|--------|
| owner | admin | No | ✅ 204 |
| owner | member | No | ✅ 204 |
| admin | admin | No | ✅ 204 |
| admin | member | No | ✅ 204 |
| admin | self | Yes | ✅ 204 (redirect on frontend) |
| member | self | Yes | ✅ 204 (redirect on frontend) |
| member | other | No | ❌ 403 AUTH_ROLE_INSUFFICIENT |
| any | owner | No | ❌ 409 AUTH_OWNER_CANNOT_BE_REMOVED |

### Success Response

**Status**: 204 No Content

No response body.

### Error Responses

#### 403 Forbidden — Insufficient Role

```json
{
  "error": "AUTH_ROLE_INSUFFICIENT",
  "message": "You do not have permission to remove members"
}
```

#### 404 Not Found — Membership Not Found

```json
{
  "error": "AUTH_TARGET_NOT_FOUND",
  "message": "Member not found"
}
```

Returned when:
- Membership ID does not exist
- Membership belongs to a different organization (no existence leakage)
- Membership was already deleted

#### 409 Conflict — Owner Cannot Be Removed

```json
{
  "error": "AUTH_OWNER_CANNOT_BE_REMOVED",
  "message": "The organization owner cannot be removed. Transfer ownership first."
}
```

### OTel Span Attributes

Auto-instrumented by `@fastify/otel`. Custom attributes added via `getSpan(request)`:

| Attribute | Value |
|-----------|-------|
| `membership.actor_id` | Actor's user ID |
| `membership.target_id` | Target membership ID |
| `membership.is_self_removal` | `true` / `false` |
| `membership.org_id` | Organization ID |
