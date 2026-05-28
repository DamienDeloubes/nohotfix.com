# Tasks: Remove Organization Member

**Input**: Design documents from `/specs/010-remove-org-member/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included — constitution Principle III mandates unit tests for error paths and integration tests for API endpoints.

**Organization**: Tasks grouped by user story. US2 (Owner Protection) and US4 (Unauthorized Prevention) are folded into US1 since they share the same backend use case and UI component — their logic is tested as part of US1's error path coverage.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Error codes, error classes, and port updates that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Register `AUTH_OWNER_CANNOT_BE_REMOVED` error code (409) in `packages/shared/src/errors/codes.ts` following `DOMAIN_CATEGORY_SPECIFIC` taxonomy
- [x] T002 [P] Create `AuthOwnerCannotBeRemovedError` domain error class in `packages/domains/identity/src/errors/index.ts` extending `DomainError`
- [x] T003 Update `MembershipRepository.delete()` port signature from `delete(id: string): Promise<void>` to `delete(orgId: string, id: string): Promise<boolean>` in `packages/domains/identity/src/ports/membership-repository.ts`

**Checkpoint**: Foundation ready — error codes registered, port interface updated

---

## Phase 2: User Story 1 — Remove a Member (Priority: P1) 🎯 MVP

**Goal**: Admins/owners can remove non-owner members via DELETE endpoint. Owner protection (US2) and authorization enforcement (US4) are built into the same use case and tested as error paths.

**Independent Test**: Log in as admin → members list → click Remove on a member → confirm → member disappears. Also verify: Remove not shown on owner row, Remove not shown for member-role users, API rejects unauthorized attempts.

### Unit Tests for US1

- [x] T004 [US1] Write unit tests for `removeMember` use case in `packages/domains/identity/src/use-cases/__tests__/remove-member.test.ts` covering: (1) happy path — admin removes member, (2) admin removes another admin, (3) owner removes member, (4) owner removes admin, (5) target not found → `AuthTargetNotFoundError`, (6) target is owner → `AuthOwnerCannotBeRemovedError`, (7) actor is member removing other → `AuthRoleInsufficientError`, (8) self-removal allowed for admin, (9) self-removal allowed for member, (10) owner self-removal → `AuthOwnerCannotBeRemovedError`. Mock `MembershipRepository` with `vi.fn()`

### Backend Implementation for US1

- [x] T005 [US1] Complete `removeMember` use case stub in `packages/domains/identity/src/use-cases/remove-member.ts` — Deps: `{ membershipRepo: MembershipRepository }`, Command: `{ orgId, memberId, actorUserId, actorRole }`. Logic: lookup target via `findByOrgAndId` → if not found throw `AuthTargetNotFoundError` → if target is owner throw `AuthOwnerCannotBeRemovedError` → if actor !== target AND actor role is member throw `AuthRoleInsufficientError` → call `delete(orgId, memberId)` → return `{ isSelfRemoval: boolean }`. Export from `packages/domains/identity/src/index.ts`
- [x] T006 [US1] Complete `delete()` stub in `apps/api/src/adapters/repositories/kysely-membership-repository.ts` — implement as `this.db.deleteFrom('memberships').where('id', '=', id).where('org_id', '=', orgId).execute()`, return `result.numDeletedRows > 0n`
- [x] T007 [US1] Complete DELETE `/api/orgs/:orgSlug/members/:memberId` route stub in `apps/api/src/routes/identity.ts` — replace 501 response with: middleware `[orgScopeMiddleware]`, extract `memberId` from params and org context from `request.orgContext!`, add OTel span attributes via `getSpan(request)` (`membership.actor_id`, `membership.target_id`, `membership.is_self_removal`, `membership.org_id`), call `removeMember` use case with deps from `request.server.root`, return `reply.code(204).send()` (pattern: /project:new-route)

### Integration Tests for US1

- [x] T008 [US1] Write integration tests for DELETE endpoint in `apps/api/src/routes/identity.spec.ts` using `buildApp()` + `app.inject()` pattern. Test cases: (1) admin removes member → 204, (2) member tries to remove another → 403 AUTH_ROLE_INSUFFICIENT, (3) attempt to remove owner → 409 AUTH_OWNER_CANNOT_BE_REMOVED, (4) membership not found → 404 AUTH_TARGET_NOT_FOUND, (5) org_id boundary — membership from different org → 404

### Frontend Implementation for US1

- [x] T009 [P] [US1] Create `useRemoveMember` mutation hook in `packages/domains/identity/src/ui/hooks/use-remove-member.ts` following `useChangeMemberRole` pattern — accepts `{ apiUrl, getAccessToken, orgSlug, invalidateKeys }`, sends DELETE to `/api/orgs/${orgSlug}/members/${memberId}`, on success invalidates `invalidateKeys`. Export from `packages/domains/identity/src/ui/index.ts`
- [x] T010 [US1] Wire `useRemoveMember` hook in the member list page under `apps/app/src/routes/_authenticated/$orgSlug/settings/` — add "Remove" button to member row actions (visible only when current user role is admin or owner AND target is not owner), add confirmation dialog ("Are you sure you want to remove {name}?"), on confirm call mutation, pass `invalidateKeys: [settingsKeys.members(orgSlug)]` from `apps/app/src/api/query-keys.ts`

**Checkpoint**: Admin/owner can remove members. Owner row has no Remove button. Members see no Remove buttons for others. All error paths return correct codes.

---

## Phase 3: User Story 3 — Self-Removal / Leave Organization (Priority: P2)

**Goal**: Any non-owner member can leave the organization. After confirmation, they are redirected out of the org context.

**Independent Test**: Log in as a member-role user → members list → click "Leave" on own row → confirm → redirected to org selector. Also test: admin leaves → redirected, owner cannot leave.

### Implementation for US3

- [x] T011 [US3] Add "Leave" action to the current user's own row in the member list page under `apps/app/src/routes/_authenticated/$orgSlug/settings/` — visible for all non-owner users (including member role), show confirmation dialog ("You will lose access to this organization. Are you sure?"), on confirm call `useRemoveMember` mutation with own `membershipId`, on success detect `isSelfRemoval` and redirect using `navigate({ to: '/' })` to exit org context. Owner row shows no Leave action.

**Checkpoint**: All non-owner users can leave via own row. Self-removal redirects out of org. Combined with US1, full feature is complete.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories

- [x] T012 [P] Verify all new error paths use domain-specific error codes from `packages/shared/src/errors/codes.ts` — no ad-hoc string errors in `removeMember` use case or route handler
- [x] T013 [P] Verify OTel span attributes are set on DELETE route via `getSpan(request)` — `membership.actor_id`, `membership.target_id`, `membership.is_self_removal`, `membership.org_id`
- [x] T014 Run `pnpm turbo run build typecheck test` to confirm all packages compile and tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: Depends on Phase 1 completion — BLOCKS frontend work
- **US3 (Phase 3)**: Depends on Phase 2 (reuses `useRemoveMember` hook from US1)
- **Polish (Phase 4)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1. Includes US2 + US4 logic. MVP milestone.
- **US3 (P2)**: Can start after US1 (reuses the mutation hook and backend). Adds self-removal UX.

### Within Each User Story

- Unit tests FIRST → then backend implementation → then integration tests → then frontend
- Backend tasks are sequential (use case → repo → route)
- Frontend hook (T009) can be built in parallel with backend (T005–T007) since it only needs the API contract

### Parallel Opportunities

- T001 + T002 can run in parallel (different files)
- T009 can run in parallel with T005–T008 (frontend hook vs backend implementation)
- T012 + T013 can run in parallel (independent verification checks)

---

## Parallel Example: Phase 1

```bash
# Launch foundational tasks in parallel:
Task: "T001 Register AUTH_OWNER_CANNOT_BE_REMOVED in packages/shared/src/errors/codes.ts"
Task: "T002 Create AuthOwnerCannotBeRemovedError in packages/domains/identity/src/errors/index.ts"
```

## Parallel Example: US1 Backend + Frontend

```bash
# After Phase 1, launch in parallel:
# Stream A (backend): T004 → T005 → T006 → T007 → T008
# Stream B (frontend): T009 (hook only — wiring in T010 needs backend)
```

---

## Implementation Strategy

### MVP First (US1 Only — Phase 1 + Phase 2)

1. Complete Phase 1: Foundational (T001–T003)
2. Complete Phase 2: US1 unit tests + backend + integration tests + frontend (T004–T010)
3. **STOP and VALIDATE**: Admin can remove members, owner protected, unauthorized rejected
4. Deploy/demo if ready — core value delivered

### Full Feature (Add US3 — Phase 3)

5. Complete Phase 3: Self-removal UX (T011)
6. Complete Phase 4: Polish (T012–T014)
7. Full feature complete — all 4 user stories satisfied

---

## Notes

- No database migration needed — uses existing `memberships` table
- 3 existing stubs to complete (use case, route, repository)
- 1 new error code, 1 new error class, 1 new frontend hook
- US2 + US4 are defensive checks — implemented and tested as error paths within US1
- Last-admin constraint NOT enforced on removal (per research.md R6 — owner always manages org)
