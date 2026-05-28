# Quickstart: Remove Organization Member

## Prerequisites

- Node.js 20+, pnpm
- PostgreSQL running (via `docker-compose up -d`)
- `pnpm install` completed at repo root

## Implementation Order

### 1. Shared Layer (error code)

Register `AUTH_OWNER_CANNOT_BE_REMOVED` in `packages/shared/src/errors/codes.ts`:
- Add to `ErrorCode` enum
- HTTP status: 409

### 2. Domain Layer (Identity context)

**Error class** — `packages/domains/identity/src/errors/index.ts`:
- Add `AuthOwnerCannotBeRemovedError` extending `DomainError`

**Repository port** — `packages/domains/identity/src/ports/membership-repository.ts`:
- Update `delete(id: string): Promise<void>` → `delete(orgId: string, id: string): Promise<boolean>`

**Use case** — `packages/domains/identity/src/use-cases/remove-member.ts`:
- Replace stub with full implementation
- Deps: `{ membershipRepo: MembershipRepository }`
- Command: `{ orgId: string; memberId: string; actorUserId: string; actorRole: RoleValue }`
- Logic:
  1. Lookup target membership via `membershipRepo.findByOrgAndId(orgId, memberId)`
  2. If not found → throw `AuthTargetNotFoundError`
  3. If target is owner → throw `AuthOwnerCannotBeRemovedError`
  4. If actor !== target AND actor role is "member" → throw `AuthRoleInsufficientError`
  5. Call `membershipRepo.delete(orgId, memberId)`
  6. Return `{ isSelfRemoval: actorUserId === target.userId }`

**Unit tests** — `packages/domains/identity/src/use-cases/__tests__/remove-member.test.ts`

### 3. Infrastructure Layer

**Repository adapter** — `apps/api/src/adapters/repositories/kysely-membership-repository.ts`:
- Complete `delete()` stub with Kysely DELETE query
- Filter by both `id` and `org_id`
- Return `true` if `numDeletedRows > 0`

### 4. API Layer

**Route handler** — `apps/api/src/routes/identity.ts`:
- Replace 501 stub with full DELETE handler
- Middleware: `[orgScopeMiddleware]` (already includes auth)
- Extract `memberId` from params, org context from `request.orgContext!`
- Call `removeMember` use case
- Return 204 No Content

**Integration tests** — `apps/api/src/routes/identity.spec.ts`

### 5. Frontend Layer

**Mutation hook** — `packages/domains/identity/src/ui/hooks/use-remove-member.ts`:
- Follow `useChangeMemberRole` pattern
- DELETE to `/api/orgs/${orgSlug}/members/${memberId}`
- On success: invalidate `invalidateKeys`

**Member list UI** — Wire the hook in the existing member list component:
- Add "Remove" button (visible to admin/owner only, hidden for owner row)
- Add confirmation dialog
- On self-removal: redirect after success

## Verification

```bash
# Run unit tests
pnpm --filter @releasepilot/domain-identity test

# Run integration tests
pnpm --filter api test

# Type check
pnpm turbo run typecheck

# Lint
pnpm turbo run lint
```
