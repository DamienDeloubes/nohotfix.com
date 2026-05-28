# Tasks: Organization Members List

**Input**: Design documents from `/specs/005-org-members-list/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Included — spec references unit and integration tests in quickstart.md and plan.md Constitution Check III.

**Organization**: Single user story (US1) — all tasks build toward one independently testable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project setup needed — existing monorepo with all infrastructure in place.

*(No tasks — project structure, tooling, and dependencies already exist.)*

---

## Phase 2: Foundational (Shared Types & Port Interface)

**Purpose**: Shared schemas and port definitions that MUST be complete before user story implementation.

- [x] T001 [P] Add `OrgMemberResponseSchema` and `ListOrgMembersResponseSchema` Zod schemas to `packages/shared/src/schemas/organisation.ts`, export types from `packages/shared/src/types/index.ts` and `packages/shared/src/index.ts` (pattern: /project:new-route)
- [x] T002 [P] Add `MemberWithUserDto` interface and `findMembersWithUsers(orgId: string): Promise<MemberWithUserDto[]>` method to `MembershipRepository` port in `packages/domains/identity/src/ports/membership-repository.ts`

**Checkpoint**: Shared types and port interface ready — US1 implementation can begin.

---

## Phase 3: User Story 1 — Any User Views Organization Members (Priority: P1)

**Goal**: Any authenticated org member navigates to `/$orgSlug/settings/members` and sees a sorted list of all confirmed members with display name (or email fallback) and role.

**Independent Test**: Log in as any org member, navigate to the members settings page, verify all confirmed members are listed in role-hierarchy order (owner → admin → member), alphabetically within each group, showing name and role.

### Implementation for User Story 1

- [x] T003 [US1] Create `listOrgMembers` use case in `packages/domains/identity/src/use-cases/list-org-members.ts` — accepts `MembershipRepository` dep + `orgId` input, calls `findMembersWithUsers(orgId)`, returns `MemberWithUserDto[]` (pattern: /project:new-route)
- [x] T004 [US1] Export `listOrgMembers` use case and `MemberWithUserDto` type from `packages/domains/identity/src/index.ts`
- [x] T005 [US1] Implement `findMembersWithUsers(orgId)` in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — JOIN `memberships` + `users`, WHERE `org_id = :orgId`, ORDER BY role hierarchy (CASE owner=1, admin=2, member=3) then `COALESCE(display_name, email) ASC`
- [x] T006 [US1] Implement `GET /api/orgs/:orgId/members` route handler in `apps/api/src/routes/identity.ts` — replace 501 stub with `authMiddleware` + `getSpan(request)` for span attributes, use `request.user.orgId` for tenant isolation, call `listOrgMembers` use case, return `{ members: [...] }` with dates as ISO strings (pattern: /project:new-route)
- [x] T007 [P] [US1] Create `useOrgMembers` TanStack Query hook in `packages/domains/identity/src/ui/hooks/use-org-members.ts` — `useQuery` for `GET /api/orgs/:orgId/members`, `staleTime: 5min`, follow `useUserOrganisations` pattern (accepts `apiUrl` + `getAccessToken` options)
- [x] T008 [P] [US1] Create `MembersList` component in `packages/domains/identity/src/ui/components/MembersList.tsx` — render member list with display name (email fallback when `displayName` is null) and role badge, loading/empty states
- [x] T009 [US1] Export `useOrgMembers` hook and `MembersList` component from `packages/domains/identity/src/ui/index.ts`
- [x] T010 [US1] Update `apps/app/src/routes/_authenticated/$orgSlug/settings/members.tsx` — import and compose `MembersList` from `@releasepilot/domain-identity/ui`, pass org context to `useOrgMembers`

### Tests for User Story 1

- [x] T011 [P] [US1] Unit test for `listOrgMembers` use case in `packages/domains/identity/src/use-cases/__tests__/list-org-members.test.ts` — test with mocked `MembershipRepository`: verify delegates to `findMembersWithUsers`, test empty org returns empty array, test result passthrough
- [x] T012 [P] [US1] Integration test for `GET /api/orgs/:orgId/members` in `apps/api/src/routes/identity.spec.ts` — test happy path (returns sorted members), test `org_id` tenant isolation (user from org A cannot see org B members), test unauthenticated returns 401

**Checkpoint**: User Story 1 fully functional — members list visible on settings page with correct sort order and name/email display.

---

## Phase 4: Polish & Verification

**Purpose**: Final validation across the full build pipeline.

- [x] T013 Verify OTel span instrumentation — route auto-instrumented by `@fastify/otel`, custom attributes added via `getSpan(request)` in route handler
- [x] T014 Run `pnpm turbo run build typecheck test` to confirm everything compiles and all tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (T001, T002)
- **Polish (Phase 4)**: Depends on Phase 3 completion

### Task Dependencies Within Phase 3

```
T001, T002 (parallel, foundational)
    ↓
T003 (use case — depends on T002 port)
    ↓
T004 (export — depends on T003)
T005 (adapter — depends on T002 port)
    ↓
T006 (route — depends on T003, T005)
    ↓
T007, T008 (parallel — UI hook + component, independent files)
    ↓
T009 (export — depends on T007, T008)
    ↓
T010 (page composition — depends on T009)

T011, T012 (parallel — tests, can start after T003/T006 respectively)
```

### Parallel Opportunities

```
# Phase 2: Both foundational tasks in parallel
T001: Zod schemas in packages/shared
T002: Port interface in packages/domains/identity

# Phase 3: After T005 + T003 complete, UI tasks in parallel
T007: useOrgMembers hook
T008: MembersList component

# Phase 3: Tests in parallel with each other
T011: Use case unit test
T012: Route integration test
```

---

## Implementation Strategy

### MVP (Single Story)

1. Complete Phase 2: Foundational (T001-T002) — shared types + port
2. Complete Phase 3: User Story 1 (T003-T012) — full vertical slice
3. Complete Phase 4: Polish (T013-T014) — verification
4. **VALIDATE**: Navigate to `/$orgSlug/settings/members` and confirm member list renders

### Delivery Notes

- This is a single-story feature — no incremental delivery beyond the full implementation
- No database migration required (uses existing `memberships` + `users` tables)
- No new domain error codes required (existing auth errors cover all error paths)
- Route stub already exists at `GET /api/orgs/:orgId/members` (currently 501)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to US1 (the only user story)
- Use `request.user.orgId` from JWT for tenant isolation — never trust path param for queries
- Dates in API responses must be ISO strings (`.toISOString()`)
- Domain test files use `.test.ts`, API test files use `.spec.ts`
- Domain UI components go in `packages/domains/identity/src/ui/`, NOT in `apps/app/src/`
