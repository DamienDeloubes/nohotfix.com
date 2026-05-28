# Research: Organization Members List

**Feature**: 005-org-members-list
**Date**: 2026-03-07

## Research Summary

No NEEDS CLARIFICATION items in Technical Context. This is a straightforward read-only feature using existing infrastructure. Research focuses on implementation patterns already established in the codebase.

---

### 1. Data Access Pattern for Members List

**Decision**: JOIN `memberships` with `users` in a single Kysely query, sorted by role hierarchy then display name.

**Rationale**: The `MembershipRepository.findByOrg(orgId)` port already exists but returns `MembershipEntity[]` (no user details). The list needs display name and email from the `users` table. Two options:

- **Option A (chosen)**: Enrich `findByOrg` to return a DTO with user details via a JOIN query. This avoids N+1 queries and keeps the data access in a single repository method.
- **Option B (rejected)**: Fetch memberships then batch-fetch users separately. Unnecessarily complex for a simple list page.

The repository method will return a plain DTO (not entity) since the result is a cross-table projection. The port interface will define a `MemberWithUser` type for this.

**Sorting**: SQL `ORDER BY` with a CASE expression for role hierarchy (owner=1, admin=2, member=3), then `COALESCE(display_name, email) ASC` for alphabetical ordering within groups.

---

### 2. Port Interface Design

**Decision**: Add a `findMembersWithUsers(orgId: string)` method to `MembershipRepository` returning `MemberWithUserDto[]`.

**Rationale**: The existing `findByOrg(orgId)` returns `MembershipEntity[]` which lacks user information. Rather than modifying the existing method's return type (which could break other consumers), add a new purpose-specific method. The return type is a DTO (not an entity) because it's a cross-table read projection.

**Alternatives considered**:
- Modifying `findByOrg` to include user data: rejected because it changes the contract for existing callers.
- Creating a separate `MemberListRepository` port: over-engineering for one method.

---

### 3. Frontend Data Fetching Pattern

**Decision**: TanStack Query `useQuery` hook in `packages/domains/identity/src/ui/hooks/use-org-members.ts`, following the pattern of existing hooks (`useUserOrganisations`, `useCheckSlug`).

**Rationale**: Consistent with established patterns. No polling needed (on-demand fetch). `staleTime: 5 * 60 * 1000` (5 minutes) matches the `useUserOrganisations` pattern for relatively stable data.

---

### 4. API Route Resolution

**Decision**: Implement the existing stub `GET /api/orgs/:orgId/members` using `authMiddleware` (org-scoped). The `orgId` for the query comes from `request.user.orgId` (JWT), not the path parameter, to enforce tenant isolation.

**Rationale**: The stub already exists in `identity.ts` returning 501. The path param `:orgId` is used for REST convention but the actual query uses the JWT-derived `orgId` for security. This prevents a user from requesting another org's members by manipulating the URL.

---

### 5. Error Handling

**Decision**: No new domain error codes needed.

**Rationale**: The endpoint is a simple read. Possible error paths:
- Unauthenticated: handled by `authMiddleware` → existing `AUTH_TOKEN_*` errors
- No membership in org: handled by `authMiddleware` → existing auth flow
- Empty results: valid response (empty array), not an error

No novel error conditions exist for this feature.
