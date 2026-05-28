# Research: Remove Organization Member

## R1: Existing Stubs and Implementation Gaps

**Decision**: Complete existing stubs rather than creating new files for the core backend.

**Rationale**: The codebase already has:
- `removeMember` use case stub in `packages/domains/identity/src/use-cases/remove-member.ts` (empty function with TODO)
- DELETE route stub in `apps/api/src/routes/identity.ts` returning 501
- `delete()` repository stub in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` (TODO)
- `MembershipRepository.delete(id)` port signature already defined

Completing stubs avoids unnecessary structural changes and aligns with the existing codebase conventions.

**Alternatives considered**: Creating new separate files — rejected because stubs already exist in the expected locations.

## R2: Error Code for Owner Removal Attempt

**Decision**: Add `AUTH_OWNER_CANNOT_BE_REMOVED` error code (409 Conflict).

**Rationale**: The existing `AUTH_ROLE_INSUFFICIENT` (403) means "you don't have permission to do this action." Attempting to remove the owner is not a permissions issue — it's a business rule violation (owner must transfer first). A distinct 409 code communicates the correct semantics and recovery action.

**Alternatives considered**:
- Reuse `AUTH_ROLE_INSUFFICIENT` — rejected because the actor may have admin/owner role; the issue is the target's role, not the actor's.
- Reuse `AUTH_LAST_ADMIN` — rejected because that code is about admin count, not owner protection.

## R3: Self-Removal Authorization Model

**Decision**: Self-removal bypasses the admin/owner role check. Any non-owner member can remove themselves.

**Rationale**: Per clarification session (spec.md), members should be able to leave voluntarily. The use case checks:
1. If actor === target (self-removal): allow for any non-owner role
2. If actor !== target: require admin or owner role on the actor

This matches common team platform patterns (Slack, GitHub, etc.) and avoids support burden.

**Alternatives considered**: Requiring admin role even for self-removal — rejected per clarification decision.

## R4: Repository Delete Implementation

**Decision**: Hard delete with `org_id` in WHERE clause, using `deleteFrom('memberships').where('id', '=', id).where('org_id', '=', orgId)`.

**Rationale**: The repository port already defines `delete(id: string): Promise<void>`. However, for tenant isolation, the implementation must also filter by `org_id`. The port signature should be updated to `delete(orgId: string, id: string): Promise<boolean>` to:
1. Include `org_id` for tenant boundary enforcement (constitution Principle II)
2. Return `boolean` to indicate whether a row was actually deleted (for 404 detection)

**Alternatives considered**:
- Soft delete — rejected per spec (hard delete is the requirement; memberships have no `is_archived` column).
- Delete without org_id check — rejected as a security defect per constitution.

## R5: Frontend Hook Pattern

**Decision**: Create `useRemoveMember` hook following the `useChangeMemberRole` pattern.

**Rationale**: The existing `useChangeMemberRole` hook demonstrates the exact pattern:
- Accepts `{ apiUrl, getAccessToken, orgSlug, invalidateKeys }`
- Returns a TanStack Query mutation
- On success: invalidates `invalidateKeys` to refresh the members list
- Domain hook in `packages/domains/identity/src/ui/hooks/`
- Query key invalidation passed in from `apps/app` route (centralised keys)

The new hook follows this pattern exactly, with DELETE method and no request body.

**Alternatives considered**: None — the pattern is established and mandated by constitution Principle IV.

## R6: Last-Admin Constraint on Removal

**Decision**: Reuse `MembershipService.enforceLastAdminConstraint()` — but only when removing an admin. Do NOT enforce when removing a regular member.

**Rationale**: The existing `MembershipService` already has this logic. The `removeMember` use case should:
1. Check if the target has the admin role
2. If yes, call `membershipService.enforceLastAdminConstraint(orgId, targetUserId)`
3. If no, skip the check (removing a regular member has no admin-count implications)

Per spec: "Admin tries to remove themselves when they are the last admin — allowed" and "the owner remains to manage the organization." This means the last-admin constraint may NOT apply here at all — the owner can always manage the org. Let me re-read the spec...

Actually, per the spec: the last admin removing themselves IS allowed because the owner remains. The `enforceLastAdminConstraint` from `MembershipService` may throw `AUTH_LAST_ADMIN` in this case, but the spec says it should be allowed. So the remove-member use case should NOT call `enforceLastAdminConstraint` — the owner is always present to manage the org, so there's no risk of an unmanageable state.

**Revised Decision**: Do NOT enforce the last-admin constraint on member removal. The owner always remains, so the organization is always manageable.

**Alternatives considered**: Enforcing last-admin check — rejected because the owner can always manage the org, and the spec explicitly allows the last admin to remove themselves.
