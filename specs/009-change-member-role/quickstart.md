# Quickstart: Change Member Role

**Feature**: 009-change-member-role | **Date**: 2026-03-09

## Prerequisites

- Node.js 20+, pnpm 9+
- PostgreSQL running (via `docker compose up -d`)
- Environment variables configured (`.env` files)

## Local Development Setup

```bash
# Start dependencies
docker compose up -d

# Install dependencies
pnpm install

# Run database migrations
pnpm --filter db migrate

# Start API and App in dev mode
pnpm turbo run dev --filter=api --filter=app
```

## Key Files to Modify (in implementation order)

### 1. Error codes + schemas (packages/shared)

```
packages/shared/src/errors/codes.ts          # Add AUTH_ROLE_SAME, AUTH_OWNER_SELF_DEMOTE, AUTH_TARGET_NOT_FOUND
packages/shared/src/schemas/organisation.ts   # Add ChangeMemberRoleRequestSchema
```

### 2. Domain errors (packages/domains/identity)

```
packages/domains/identity/src/errors/index.ts  # Add 3 new error classes
```

### 3. Repository port + adapter

```
packages/domains/identity/src/ports/membership-repository.ts   # Add transferOwnership()
apps/api/src/adapters/repositories/kysely-membership-repository.ts  # Implement updateRole(), countAdmins(), transferOwnership()
```

### 4. Use case

```
packages/domains/identity/src/use-cases/change-member-role.ts  # Replace TODO stub
```

### 5. API route

```
apps/api/src/routes/identity.ts  # Implement PATCH handler (replace 501 stub)
```

### 6. Frontend hooks + UI

```
packages/domains/identity/src/ui/hooks/use-change-member-role.ts  # New mutation hook
packages/domains/identity/src/ui/components/MembersList.tsx        # Add role dropdown
```

## Testing

```bash
# Unit tests (domain logic)
pnpm --filter @nohotfix/domain-identity test

# Integration tests (API routes)
pnpm --filter api test

# Type checking
pnpm turbo run typecheck

# All checks
pnpm turbo run build typecheck test
```

## Manual Verification

1. Log in as **admin** → navigate to org settings → members tab
2. Change a member's role from member → admin → verify badge updates
3. Change the admin back to member → verify badge updates
4. Try to assign "owner" role → verify it's not available
5. Log in as **owner** → transfer ownership to a member → verify confirmation dialog → confirm → verify new owner
6. Log in as **member** → verify no role change controls visible
