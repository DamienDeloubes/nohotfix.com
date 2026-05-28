# Tasks: Change Member Role

**Input**: Design documents from `/specs/009-change-member-role/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed — all infrastructure exists. This phase is skipped.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Error codes, domain errors, Zod schemas, and repository stubs that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Register 3 new error codes (`AUTH_ROLE_SAME`, `AUTH_OWNER_SELF_DEMOTE`, `AUTH_TARGET_NOT_FOUND`) in `packages/shared/src/errors/codes.ts` (pattern: /project:new-entity)
- [x] T002 [P] Add `ChangeMemberRoleRequestSchema` (`z.object({ role: z.enum(['owner', 'admin', 'member']) })`) to `packages/shared/src/schemas/organisation.ts` and export the inferred type from `packages/shared/src/index.ts`
- [x] T003 [P] Create 3 domain error classes (`AuthRoleSameError` 400, `AuthOwnerSelfDemoteError` 403, `AuthTargetNotFoundError` 404) in `packages/domains/identity/src/errors/index.ts` (pattern: /project:new-entity)
- [x] T004 [P] Add `findByOrgAndId(orgId: string, id: string): Promise<MembershipEntity | undefined>` and `transferOwnership(orgId: string, newOwnerId: string, previousOwnerId: string): Promise<void>` methods to the `MembershipRepository` interface in `packages/domains/identity/src/ports/membership-repository.ts`. Also update `updateRole` signature to include `orgId`: `updateRole(orgId: string, id: string, role: RoleValue): Promise<MembershipEntity | undefined>`
- [x] T005 Implement `updateRole()` method in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — replace TODO stub with `UPDATE memberships SET role = $role WHERE id = $id AND org_id = $orgId RETURNING *`, then `toEntity()` the result. The `org_id` filter is mandatory for tenant isolation per constitution Principle II.
- [x] T006 [P] Implement `countAdmins()` method in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — replace TODO stub with `SELECT COUNT(*) FROM memberships WHERE org_id = $orgId AND role = 'admin'`
- [x] T007 Implement `findByOrgAndId()` and `transferOwnership()` methods in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — `findByOrgAndId`: `SELECT * FROM memberships WHERE id = $id AND org_id = $orgId`, then `toEntity()`. `transferOwnership`: use `db.transaction().execute()` to atomically UPDATE both memberships (target → owner, previous → admin), filtering by `org_id`
- [x] T008 Re-export new error classes, `findByOrgAndId`, and `transferOwnership` port types from `packages/domains/identity/src/index.ts`

**Checkpoint**: Foundation ready — all error codes, schemas, repository methods, and port interfaces are in place

---

## Phase 3: User Story 1 — Promote or Demote a Member (Priority: P1) 🎯 MVP

**Goal**: Admins and owners can change a member's role between "admin" and "member" via the API and UI

**Independent Test**: Log in as admin → navigate to members list → change a member's role → verify badge updates immediately

### Implementation for User Story 1

- [x] T009 [US1] Implement `changeMemberRole` use case in `packages/domains/identity/src/use-cases/change-member-role.ts` — replace TODO stub with full implementation. Accept `ChangeMemberRoleDeps` (membershipRepo, membershipService) and `ChangeMemberRoleCommand` (orgId, targetMembershipId, newRole, actorMembershipId, actorRole). Business rules: (1) reject if actor is member role → throw `AuthRoleInsufficientError`, (2) look up target membership via `membershipRepo.findByOrgAndId(orgId, targetMembershipId)` → throw `AuthTargetNotFoundError` if not found, (3) reject if target role equals newRole → throw `AuthRoleSameError`, (4) reject if actor is admin and target is owner → throw `AuthRoleInsufficientError`, (5) reject if newRole is 'owner' and actor is not owner → throw `AuthRoleInsufficientError`, (6) reject if actor targets themselves and actor is owner → throw `AuthOwnerSelfDemoteError` (admin self-demotion is allowed — confirmation is UI-only), (7) if demoting an admin (including admin self-demotion), call `membershipService.enforceLastAdminConstraint()`, (8) call `membershipRepo.updateRole(orgId, targetMembershipId, newRole)`, (9) return updated member DTO. Follow the `createInvite` use case pattern for Deps/Command/Output interfaces. (pattern: /project:new-route)
- [x] T010 [US1] Implement `PATCH /api/orgs/:orgSlug/members/:memberId/role` handler in `apps/api/src/routes/identity.ts` — replace the 501 stub. Use `preHandler: [orgScopeMiddleware]`. Validate body with `ChangeMemberRoleRequestSchema.safeParse()`. Set OTel span attributes (`org.id`, `target.membership_id`, `role.to`). Call `changeMemberRole` use case with deps from `request.server.root`. After success, fetch updated member via `membershipRepo.findMembersWithUsers()` filtered to target, return 200 with `OrgMemberDtoSchema` shape. Add span attributes `role.from` and `role.is_transfer` after use case returns. (pattern: /project:new-route)
- [x] T011 [US1] Wire `changeMemberRole` use case dependencies in `apps/api/src/composition-root.ts` if any new service instances are needed (MembershipService already exists — verify it's accessible)
- [x] T012 [P] [US1] Create `useChangeMemberRole` mutation hook in `packages/domains/identity/src/ui/hooks/use-change-member-role.ts` — accept `{ apiUrl, getAccessToken, orgSlug, invalidateKeys }` options. Use `useMutation` with `mutateAsync` calling `PATCH /api/orgs/${orgSlug}/members/${memberId}/role` with `{ role }` body. On success, invalidate queries using provided `invalidateKeys`. Follow the `useCreateInvite` pattern from `use-invites.ts`.
- [x] T013 [US1] Update `MembersList.tsx` in `packages/domains/identity/src/ui/components/MembersList.tsx` — add a role dropdown (`<select>`) per member row, visible only when the current user has admin or owner role (accept `currentUserRole` as a prop). For admins, show options: admin, member. For owners, show options: admin, member (owner handled in US2). On selection change, call the `onRoleChange(memberId, newRole)` callback prop. Show loading state during mutation. Show error toast/message on failure.
- [x] T014 [US1] Update the org members settings route in `apps/app/src/routes/` that renders `MembersList` — pass `currentUserRole` from `orgContext`, instantiate `useChangeMemberRole` hook with `invalidateKeys: [settingsKeys.members(orgSlug)]`, and pass the `onRoleChange` handler that calls `mutateAsync({ memberId, role })`.
- [x] T015 [US1] Add admin self-demotion confirmation dialog to `MembersList.tsx` — when `currentUserRole === 'admin'` and the member being changed is the current user and new role is 'member', show a confirmation dialog ("You will lose admin access. Are you sure?") before executing the mutation (FR-014).

**Checkpoint**: Admins and owners can promote/demote members between admin and member roles. UI reflects changes immediately.

---

## Phase 4: User Story 2 — Transfer Ownership (Priority: P2)

**Goal**: Owners can transfer ownership to another member, atomically demoting themselves to admin

**Independent Test**: Log in as owner → transfer ownership to a member → verify confirmation dialog → confirm → verify new owner badge and previous owner demoted to admin

### Implementation for User Story 2

- [x] T016 [US2] Extend `changeMemberRole` use case in `packages/domains/identity/src/use-cases/change-member-role.ts` — add ownership transfer branch: when `newRole === 'owner'` and actor is owner, call `membershipRepo.transferOwnership(orgId, targetMembershipId, actorMembershipId)` instead of `updateRole()`. Return the updated target member DTO.
- [x] T017 [US2] Update role dropdown in `MembersList.tsx` — when `currentUserRole === 'owner'`, include "owner" as an option in the dropdown for other members. Add a confirmation dialog before ownership transfer: "Are you sure you want to transfer ownership to [member name]? You will be demoted to admin." (FR-013). Only execute mutation after confirmation.
- [x] T018 [US2] Update the route handler in `apps/api/src/routes/identity.ts` — ensure the `role.is_transfer` span attribute is set to `true` when the new role is 'owner' and the current role is not 'owner'.

**Checkpoint**: Ownership transfer works atomically. Exactly one owner exists at all times. Confirmation dialog prevents accidental transfers.

---

## Phase 5: User Story 3 — Unauthorized Role Change Prevented (Priority: P1)

**Goal**: All authorization rules are enforced — members see no controls, admins cannot assign owner, owner cannot self-demote

**Independent Test**: Log in as member → verify no role dropdown visible. Log in as admin → verify owner option not available. Log in as owner → try to change own role → verify rejection.

### Implementation for User Story 3

- [x] T019 [US3] Verify `MembersList.tsx` hides role dropdown completely when `currentUserRole === 'member'` — the dropdown should not render at all (FR-011). If not already implemented in T013, add the conditional rendering.
- [x] T020 [US3] Verify the `changeMemberRole` use case correctly handles all authorization edge cases from the API contract authorization matrix in `specs/009-change-member-role/contracts/api.md` — admin cannot modify owner's role (FR-009), admin cannot assign owner role (FR-007), owner cannot change own role without transfer (FR-008). These should already be implemented in T009 but verify and fix any gaps.
- [x] T021 [US3] Add error handling UI to `MembersList.tsx` — display user-friendly error messages when the API returns `AUTH_ROLE_INSUFFICIENT`, `AUTH_ROLE_SAME`, `AUTH_OWNER_SELF_DEMOTE`, `AUTH_LAST_ADMIN`, or `AUTH_TARGET_NOT_FOUND`. Show the error inline near the affected member row or as a toast notification.

**Checkpoint**: All authorization rules enforced at both API and UI levels. Unauthorized actions are prevented with clear feedback.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all user stories

- [x] T022 [P] Verify all 3 new error codes (`AUTH_ROLE_SAME`, `AUTH_OWNER_SELF_DEMOTE`, `AUTH_TARGET_NOT_FOUND`) are properly registered in `packages/shared/src/errors/codes.ts` and have corresponding domain error classes in `packages/domains/identity/src/errors/index.ts`
- [x] T023 [P] Verify OTel span attributes (`org.id`, `target.membership_id`, `role.from`, `role.to`, `role.is_transfer`) are set correctly in the PATCH route handler in `apps/api/src/routes/identity.ts`
- [x] T024 [P] Verify `org_id` tenant isolation in all new repository queries in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — `findByOrgAndId`, `updateRole`, and `transferOwnership` must include `org_id` in WHERE clauses
- [x] T025 Run `pnpm turbo run build typecheck test` to verify full pipeline passes
- [x] T026 Run quickstart.md manual verification steps from `specs/009-change-member-role/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 (extends the use case and UI from US1)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (verifies and extends the authorization and UI from US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 — extends the `changeMemberRole` use case with ownership transfer branch and the UI with owner role option
- **User Story 3 (P1)**: Depends on US1 — verifies and extends authorization enforcement and error handling built in US1

### Within Each User Story

- Use case before route handler
- Route handler before UI hooks
- UI hooks before component updates
- Core logic before confirmation dialogs

### Parallel Opportunities

**Phase 2 (Foundational)**:
```
Parallel group 1: T001, T002, T003, T004 (different files, no dependencies)
Sequential: T005, T006, T007 (same file — kysely-membership-repository.ts)
Then: T008 (depends on T003, T004)
```

**Phase 3 (US1)**:
```
Sequential: T009 → T010 → T011 (use case → route → wiring)
Parallel after T009: T012 (hook, different file)
Sequential after T012: T013 → T014 → T015 (UI components depend on hook)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (error codes, schemas, repo methods)
2. Complete Phase 3: User Story 1 (use case, route, hook, UI)
3. **STOP and VALIDATE**: Test promote/demote flow end-to-end
4. Deploy/demo if ready — admins can manage roles

### Incremental Delivery

1. Phase 2 → Foundation ready
2. Add US1 → Test independently → Deploy (MVP: promote/demote)
3. Add US2 → Test independently → Deploy (ownership transfer)
4. Add US3 → Test independently → Deploy (auth enforcement polish)
5. Phase 6 → Final verification and cleanup

---

## Notes

- No database migrations needed — existing `memberships` table is sufficient
- The `change-member-role.ts` use case already exists as a TODO stub — replace it
- The `PATCH .../role` route already exists returning 501 — replace the handler
- Repository methods `updateRole()` and `countAdmins()` are TODO stubs — implement them
- `settingsKeys.members(orgSlug)` query key already exists — no changes to `query-keys.ts`
- US2 extends US1's use case with an ownership transfer branch, not a separate use case
- Tests are not included as they were not explicitly requested
