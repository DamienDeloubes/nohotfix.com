# API Contracts: User Settings Page

**Branch**: `007-user-settings` | **Date**: 2026-03-08

## Modified Endpoints

### GET /api/users/me

**Auth**: `authMiddleware` (JWT required)

**Response** (200):
```json
{
  "id": "uuid",
  "workosUserId": "user_01ABC...",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Changes**: This endpoint now returns the local DB user record via `resolveUserFromJwt` instead of the WorkOS profile via `UserProfileProvider`. The local DB is authoritative for names after signup. Fields removed from previous response: `emailVerified`, `profilePictureUrl`, `lastSignInAt` (WorkOS-only fields no longer exposed). Field added: `id` (internal user UUID).

---

### PATCH /api/users/me (new implementation — currently returns 501)

**Auth**: `authMiddleware` (JWT required)

**Request body** (Zod: `UpdateUserProfileRequestSchema`):
```json
{
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Validation**:
- `firstName`: string, min 1 (after trim), max 50, required
- `lastName`: string, min 1 (after trim), max 50, required

**Response** (200):
```json
{
  "id": "uuid",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "updatedAt": "2026-03-08T12:00:00.000Z"
}
```

**Error responses**:

| Status | Code | Condition |
|--------|------|-----------|
| 400 | `AUTH_USER_FIRST_NAME_INVALID` | First name empty, whitespace-only, or >50 chars |
| 400 | `AUTH_USER_LAST_NAME_INVALID` | Last name empty, whitespace-only, or >50 chars |
| 401 | `AUTH_TOKEN_MISSING` | No JWT provided |
| 404 | `AUTH_USER_NOT_FOUND` | Internal user record not found for JWT subject |

---

### GET /api/orgs/:orgSlug/members (modified response)

**Auth**: `orgScopeMiddleware`

**Response** (200):
```json
{
  "members": [
    {
      "id": "membership-uuid",
      "userId": "user-uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "owner",
      "joinedAt": "2026-03-01T00:00:00.000Z"
    }
  ]
}
```

**Changes**: `displayName` field replaced with `firstName` and `lastName`.

## Zod Schema Changes

### UpdateUserProfileRequestSchema (new — replaces UpdateDisplayNameRequestSchema)

```typescript
export const UpdateUserProfileRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
});
```

### SessionUserSchema (modified)

```typescript
export const SessionUserSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  email: z.string().email(),
  firstName: z.string().optional(),   // was: displayName
  lastName: z.string().optional(),    // new
});
```

### OrgMemberResponseSchema (modified)

```typescript
// In organisation.ts
firstName: z.string().nullable(),   // was: displayName
lastName: z.string().nullable(),    // new
```
