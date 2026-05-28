# Quickstart: Organization Members List

**Feature**: 005-org-members-list
**Date**: 2026-03-07

## Prerequisites

- Node.js 20+, pnpm installed
- PostgreSQL running (via `docker-compose up -d`)
- Environment variables configured in `apps/api/.env` and `apps/app/.env.local`

## Development Setup

```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d postgres

# Run migrations
pnpm --filter @nohotfix/db migrate

# Start API (port 3001)
pnpm --filter api dev

# Start App (port 5173)
pnpm --filter app dev
```

## Key Files to Modify

### 1. Domain Port (add method)
`packages/domains/identity/src/ports/membership-repository.ts`
- Add `MemberWithUserDto` interface
- Add `findMembersWithUsers(orgId: string): Promise<MemberWithUserDto[]>` to `MembershipRepository`

### 2. Use Case (new file)
`packages/domains/identity/src/use-cases/list-org-members.ts`
- Accept `MembershipRepository` as dependency
- Call `findMembersWithUsers(orgId)`
- Return DTO array

### 3. Repository Adapter (implement)
`apps/api/src/adapters/repositories/kysely-membership-repository.ts`
- Implement `findMembersWithUsers` with JOIN query
- Apply role-hierarchy + alphabetical sorting via SQL ORDER BY

### 4. Shared Schema (add)
`packages/shared/src/schemas/organisation.ts`
- Add `OrgMemberResponseSchema` and `ListOrgMembersResponseSchema`

### 5. Route Handler (implement stub)
`apps/api/src/routes/identity.ts`
- Replace 501 stub for `GET /api/orgs/:orgId/members`
- Use `authMiddleware`, `getSpan(request)` for span attributes, call use case

### 6. Domain UI Hook (new file)
`packages/domains/identity/src/ui/hooks/use-org-members.ts`
- TanStack Query `useQuery` for `GET /api/orgs/:orgId/members`

### 7. Domain UI Component (new file)
`packages/domains/identity/src/ui/components/MembersList.tsx`
- Render sorted member list (name/email fallback + role badge)

### 8. Route Page (update placeholder)
`apps/app/src/routes/_authenticated/$orgSlug/settings/members.tsx`
- Import and compose `MembersList` from identity domain UI

## Verification

```bash
# Type check
pnpm turbo run typecheck

# Run tests
pnpm turbo run test

# Build all
pnpm turbo run build
```

## Test Plan

- **Unit**: `list-org-members.test.ts` — sort order, empty list, name fallback
- **Integration**: `GET /api/orgs/:orgId/members` — happy path, org_id boundary isolation
