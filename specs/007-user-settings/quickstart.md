# Quickstart: User Settings Page

**Branch**: `007-user-settings` | **Date**: 2026-03-08

## Prerequisites

- Node.js 20+, pnpm
- PostgreSQL running (via `docker compose up -d`)
- `.env` configured at repo root

## Implementation Order

The implementation must follow this dependency chain:

### Phase 1: Foundation (no UI changes)

1. **Database migration** — `packages/db/src/migrations/002_user_first_last_name.ts`
   - Add `first_name`, `last_name` columns
   - Backfill from `display_name`
   - Drop `display_name`
   - Run: `pnpm --filter db migrate:latest`

2. **Kysely schema** — `packages/db/src/schema.ts`
   - Replace `display_name` with `first_name` + `last_name`

3. **Shared schemas & error codes** — `packages/shared/src/`
   - Add error codes: `AUTH_USER_FIRST_NAME_INVALID`, `AUTH_USER_LAST_NAME_INVALID`, `AUTH_USER_NOT_FOUND`
   - Replace `UpdateDisplayNameRequestSchema` with `UpdateUserProfileRequestSchema`
   - Update `SessionUserSchema`, `OrgMemberResponseSchema`
   - Update type exports

### Phase 2: Domain Layer

4. **Value objects** — `packages/domains/identity/src/entities/value-objects/`
   - Create `FirstName`, `LastName` (following `DisplayName` pattern)
   - Delete `DisplayName`
   - Update barrel export

5. **Domain errors** — `packages/domains/identity/src/errors/`
   - Add `AuthUserFirstNameInvalidError`, `AuthUserLastNameInvalidError`, `AuthUserNotFoundError`

6. **UserEntity** — `packages/domains/identity/src/entities/user.ts`
   - Replace `displayName: DisplayName | null` with `firstName: FirstName | null`, `lastName: LastName | null`
   - Update `create()`, `reconstitute()`, `updateProfile()`

7. **Ports** — `packages/domains/identity/src/ports/`
   - Update `UserRepository` interface (upsert + update signatures)
   - Update `MemberWithUserDto` (firstName/lastName)

8. **Use cases**
   - Update `resolveUserFromJwt` — store firstName/lastName separately from WorkOS profile
   - Update `syncUserFromJwt` — accept firstName/lastName params
   - Create `updateUserProfile` — validate + persist name change

### Phase 3: Infrastructure Adapters

9. **KyselyUserRepository** — update all queries for `first_name`/`last_name`
10. **KyselyMembershipRepository** — update member query + DTO mapping
11. **Auth middleware** — update `AuthUser` type

### Phase 4: API Routes

12. **identity.ts** — implement `PATCH /api/users/me`, update members response

### Phase 5: Frontend

13. **Query keys** — add `userKeys` to `query-keys.ts`
14. **Domain UI** — create `AccountSettingsForm` component + `useUpdateUserProfile` hook
15. **Route** — compose form into `account.tsx`
16. **MembersList** — update name display

### Phase 6: Tests

17. Unit tests: value objects, entity, use cases, error paths
18. Integration tests: `PATCH /api/users/me`
19. Update existing tests referencing `displayName`

## Verification

```bash
# Run migration
pnpm --filter db migrate:latest

# Type check
pnpm turbo run typecheck

# Tests
pnpm turbo run test

# Build
pnpm turbo run build

# Dev server
pnpm turbo run dev
```

## Key Files to Reference

- Existing entity pattern: `packages/domains/identity/src/entities/user.ts`
- Existing value object: `packages/domains/identity/src/entities/value-objects/email.ts`
- Existing adapter: `apps/api/src/adapters/repositories/kysely-user-repository.ts`
- Route handler pattern: `apps/api/src/routes/identity.ts`
- Domain UI pattern: `packages/domains/identity/src/ui/components/MembersList.tsx`
- Query keys: `apps/app/src/api/query-keys.ts`
