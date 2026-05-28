# Tasks: Invite Members

**Input**: Design documents from `/specs/008-invite-members/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/invite-api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuration changes needed before any feature work

- [x] T001 Add `RESEND_API_KEY` to Zod config validation in `apps/api/src/config.ts`
- [x] T002 Add `RESEND_API_KEY` to `.env.example` at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain model, error codes, schemas, migration, and ports that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Register invite error codes (`AUTH_INVITE_DUPLICATE`, `AUTH_INVITE_ALREADY_MEMBER`, `AUTH_INVITE_SELF`, `AUTH_INVITE_EMAIL_FAILED`, `AUTH_INVITE_NOT_FOUND`, `AUTH_INVITE_RESEND_TOO_SOON`, `AUTH_INVITE_EXPIRED`, `AUTH_INVITE_EMAIL_MISMATCH`) in `packages/shared/src/errors/codes.ts` (pattern: /project:new-entity)
- [x] T004 [P] Create invite error classes in `packages/domains/identity/src/errors/index.ts` — one class per error code, extending `DomainError` (pattern: /project:new-entity)
- [x] T005 [P] Create `InviteToken` value object in `packages/domains/identity/src/entities/invite-token.ts` — `generate()` (crypto.randomBytes 32 bytes → hex), `create(raw)` (validates 64-char hex) (pattern: /project:new-entity)
- [x] T006 [P] Create `InviteEntity` aggregate root in `packages/domains/identity/src/entities/invite.ts` — private constructor, `create()`, `reconstitute()`, mutation methods: `resend()`, `revoke()`, `accept(userId)`, query methods: `isExpired()`, `canResend()` (pattern: /project:new-entity)
- [x] T007 [P] Create `InviteRepository` port interface in `packages/domains/identity/src/ports/invite-repository.ts` — methods: `findByToken`, `findByOrgAndEmail`, `findPendingByOrg`, `findById`, `create`, `update`, `delete` (pattern: /project:new-entity)
- [x] T008 [P] Create `EmailPort` interface in `packages/domains/identity/src/ports/email-port.ts` — method: `sendInviteEmail({ to, inviterName, orgName, inviteUrl })` (pattern: /project:new-entity)
- [x] T009 [P] Add invite Zod schemas in `packages/shared/src/schemas/invite.ts` — `CreateInviteRequestSchema` ({ email, role }), export from `packages/shared/src/schemas/index.ts` (pattern: /project:new-route)
- [x] T010 [P] Add invite DTOs in `packages/shared/src/types/index.ts` — `InviteDto`, `ListInvitesDto`, `InviteResendDto`, `AcceptInviteResultDto`
- [x] T011 Create migration `004_create_invites_table.ts` in `packages/db/src/migrations/` — `invites` table with all columns, indexes (`idx_invites_token` UNIQUE, `idx_invites_org_email`, `idx_invites_org_status`), FK constraints (pattern: /project:migrate)
- [x] T012 Add `InvitesTable` interface to `packages/db/src/schema.ts` and register in `Database` interface
- [x] T013 [P] Create `KyselyInviteRepository` adapter in `apps/api/src/adapters/repositories/kysely-invite-repository.ts` — implements `InviteRepository` port, all queries include `org_id` (pattern: /project:new-route)
- [x] T014 [P] Create `ResendEmailAdapter` in `apps/api/src/adapters/services/resend-email-adapter.ts` — implements `EmailPort`, wraps `createEmailSender` from `packages/email`, uses `MemberInvite` template (pattern: /project:new-route)
- [x] T015 Wire `KyselyInviteRepository` and `ResendEmailAdapter` in `apps/api/src/composition-root.ts`
- [x] T016 Export new entities, use cases, and ports from `packages/domains/identity/src/index.ts`

**Checkpoint**: Foundation ready — domain model, ports, adapters, and migration in place. User story implementation can begin.

---

## Phase 3: User Story 1 — Admin Invites a New Member (Priority: P1) MVP

**Goal**: Owners/Admins can invite users by email. Invite record is created, email is sent, invitee appears in members list with pending status.

**Independent Test**: Submit invite form → verify invite appears in members list with pending status → verify email dispatched.

### Implementation for User Story 1

- [x] T017 [US1] Create `createInvite` use case in `packages/domains/identity/src/use-cases/create-invite.ts` — validates email (not self, not existing member, not pending invite), creates InviteEntity, persists via repo, sends email via EmailPort, rolls back on email failure (pattern: /project:new-route)
- [x] T018 [US1] Create `listPendingInvites` use case in `packages/domains/identity/src/use-cases/list-pending-invites.ts` — returns pending invites for org with inviter details (pattern: /project:new-route)
- [x] T019 [US1] Create `POST /api/orgs/:orgSlug/invites` route in `apps/api/src/routes/invite.ts` — orgScopeMiddleware, role check (owner/admin), Zod validation, call createInvite use case, return 201 with InviteDto (pattern: /project:new-route)
- [x] T020 [US1] Create `GET /api/orgs/:orgSlug/invites` route in `apps/api/src/routes/invite.ts` — orgScopeMiddleware, role check (owner/admin), call listPendingInvites, return 200 with ListInvitesDto (pattern: /project:new-route)
- [x] T021 [US1] Register invite routes in `apps/api/src/server.ts`
- [x] T022 [US1] Add invite query keys (`inviteKeys.list(orgSlug)`, `inviteKeys.detail(orgSlug, id)`) to `apps/app/src/api/query-keys.ts`
- [x] T023 [P] [US1] Create `useInvites` hook (list) and `useCreateInvite` mutation hook in `packages/domains/identity/src/ui/hooks/useInvites.ts` — accept `queryKey`/`invalidateKeys` params, `apiUrl`, `getAccessToken`
- [x] T024 [P] [US1] Create `InviteMemberForm` component in `packages/domains/identity/src/ui/components/InviteMemberForm.tsx` — email input, role selector (Admin/Member), "Send invite" button, inline validation (email format, not empty), error/success toast
- [x] T025 [US1] Create `PendingInviteRow` component in `packages/domains/identity/src/ui/components/PendingInviteRow.tsx` — displays email, role, pending status badge, invited-by, "Resend" (disabled stub for now) and "Revoke" (stub) actions
- [x] T026 [US1] Export new hooks and components from `packages/domains/identity/src/ui/index.ts`
- [x] T027 [US1] Integrate invite form and pending invite list into `apps/app/src/routes/_authenticated/settings/members.tsx` — show form above members list (only for owner/admin), show pending invites alongside active members, pass centralised query keys to hooks

**Checkpoint**: US1 complete — Admins can send invites, see pending invites in the members list. Email is dispatched. Error cases (duplicate, self-invite, already member, email failure) are handled.

---

## Phase 4: User Story 2 — Invitee Accepts an Invite (Priority: P1)

**Goal**: Invitee clicks link in email, authenticates via WorkOS, and lands on org dashboard with active membership.

**Independent Test**: Click valid invite link → complete WorkOS signup/login → verify redirect to org dashboard with active membership.

### Implementation for User Story 2

- [x] T028 [US2] Create `validateInviteToken` use case in `packages/domains/identity/src/use-cases/validate-invite-token.ts` — looks up invite by token, returns status (valid/expired/revoked/accepted) and invite details (pattern: /project:new-route)
- [x] T029 [US2] Create `acceptInvite` use case in `packages/domains/identity/src/use-cases/accept-invite.ts` — validates token, checks email match, marks invite accepted, creates membership row via MembershipRepository, returns org slug/name (pattern: /project:new-route)
- [x] T030 [US2] Create `POST /api/invites/:token/accept` route in `apps/api/src/routes/invite.ts` — authMiddleware (no org scope), call acceptInvite use case, return 200 with org slug/name (pattern: /project:new-route)
- [x] T031 [US2] Create `GET /api/invites/:token/validate` route in `apps/api/src/routes/invite.ts` — no auth required, call validateInviteToken, return status + invited email (for web app to redirect correctly)
- [x] T032 [US2] Create invite landing page at `apps/web/src/app/invite/[token]/page.tsx` — server component, calls validate endpoint, if valid redirects to WorkOS auth with `login_hint={email}` and token in state param, if expired/revoked/not-found renders error page
- [x] T033 [US2] Create invite callback route at `apps/web/src/app/api/auth/invite-callback/route.ts` — exchanges WorkOS code for user identity, calls `POST /api/invites/:token/accept` with auth token, redirects to `apps/app/{orgSlug}` dashboard
- [x] T034 [US2] Add `WORKOS_REDIRECT_URI` for invite callback to `apps/web/.env.local` documentation and update `.env.example`

**Checkpoint**: US2 complete — Full invite acceptance flow works end-to-end. New users signup, existing users login, both land on the org dashboard with active membership.

---

## Phase 5: User Story 3 — Resend and Revoke Pending Invites (Priority: P2)

**Goal**: Owners/Admins can resend invite emails (with rate limiting and token regeneration) or revoke pending invites.

**Independent Test**: Create a pending invite → resend after cooldown (verify new email sent, old link invalid) → revoke (verify invite removed from list, link invalid).

### Implementation for User Story 3

- [x] T035 [US3] Create `resendInvite` use case in `packages/domains/identity/src/use-cases/resend-invite.ts` — validates invite exists and is pending, checks rate limit via `canResend()`, calls entity `resend()` to regenerate token, sends email, persists update (pattern: /project:new-route)
- [x] T036 [US3] Create `revokeInvite` use case in `packages/domains/identity/src/use-cases/revoke-invite.ts` — validates invite exists and is pending, calls entity `revoke()`, persists update (pattern: /project:new-route)
- [x] T037 [US3] Create `POST /api/orgs/:orgSlug/invites/:inviteId/resend` route in `apps/api/src/routes/invite.ts` — orgScopeMiddleware, role check, call resendInvite, return 200 with updated timestamps (pattern: /project:new-route)
- [x] T038 [US3] Create `DELETE /api/orgs/:orgSlug/invites/:inviteId` route in `apps/api/src/routes/invite.ts` — orgScopeMiddleware, role check, call revokeInvite, return 204 (pattern: /project:new-route)
- [x] T039 [P] [US3] Create `useResendInvite` and `useRevokeInvite` mutation hooks in `packages/domains/identity/src/ui/hooks/useInvites.ts` — accept `invalidateKeys` param, invalidate invite list on success
- [x] T040 [US3] Update `PendingInviteRow` component in `packages/domains/identity/src/ui/components/PendingInviteRow.tsx` — wire Resend button (disabled based on `lastSentAt`/`createdAt` cooldown logic: 5min initial, 15min subsequent), wire Revoke button with confirmation dialog
- [x] T041 [US3] Update members page in `apps/app/src/routes/_authenticated/settings/members.tsx` — pass resend/revoke mutation hooks and `invalidateKeys` to `PendingInviteRow`

**Checkpoint**: US3 complete — Pending invites have functional Resend (rate-limited, regenerates token) and Revoke (with confirmation) actions.

---

## Phase 6: User Story 4 — Expired, Revoked, and Already-Accepted Links (Priority: P2)

**Goal**: Users clicking invalid invite links see clear, appropriate feedback screens.

**Independent Test**: Click expired link → see "Invite expired" screen. Click revoked link → see "Invite no longer valid" screen. Click already-accepted link → redirect to org dashboard.

### Implementation for User Story 4

- [x] T042 [US4] Update invite landing page at `apps/web/src/app/invite/[token]/page.tsx` — add distinct error screens: "Invite expired — contact your org admin" (for expired), "Invite no longer valid" (for revoked/not-found), redirect to org dashboard (for already-accepted)
- [x] T043 [US4] Style error pages with consistent branding matching `apps/web` design — clear messaging, no dead-end (link back to homepage or contact info)

**Checkpoint**: US4 complete — All invalid link states display user-friendly error screens or redirect appropriately.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, observability, and final quality checks

- [x] T044 Add OTel span attributes (`invite.email`, `invite.role`, `invite.org_id`) via `getSpan(request)` in all invite route handlers in `apps/api/src/routes/invite.ts`
- [x] T045 Verify all invite error paths use domain error codes from `packages/shared/src/errors/codes.ts` — no ad-hoc string errors anywhere in invite use cases or routes
- [x] T046 Verify all invite repository queries include `org_id` in WHERE clauses (except token-based lookups which are cross-org by design)
- [x] T047 Update `MemberInvite` email template in `packages/email/src/templates/member-invite.tsx` — ensure button text reads "Accept invite to {orgName}" and template renders correctly
- [x] T048 Run full build and typecheck: `pnpm turbo run build typecheck`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP milestone
- **US2 (Phase 4)**: Depends on Foundational + needs invite routes from US1 (T019, T021)
- **US3 (Phase 5)**: Depends on Foundational + needs invite list UI from US1 (T025, T027)
- **US4 (Phase 6)**: Depends on US2 (builds on invite landing page from T032)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — fully independent
- **US2 (P1)**: Depends on US1 API routes (invite creation must exist to test acceptance)
- **US3 (P2)**: Depends on US1 UI components (resend/revoke actions are on pending invite rows)
- **US4 (P2)**: Depends on US2 landing page (error screens are variations of the same page)

### Within Each User Story

- Use cases before route handlers
- Route handlers before UI hooks
- UI hooks before UI components
- Components before page integration

### Parallel Opportunities

- **Phase 2**: T004–T010 can all run in parallel (different files, no dependencies)
- **Phase 3**: T023 and T024 can run in parallel (hook vs component, different files)
- **Phase 5**: T039 can run in parallel with T037/T038 (hooks vs routes)

---

## Parallel Example: Foundational Phase

```
# Launch all foundational tasks in parallel:
T004: Create invite error classes (packages/domains/identity/src/errors/)
T005: Create InviteToken value object (packages/domains/identity/src/entities/)
T006: Create InviteEntity (packages/domains/identity/src/entities/)
T007: Create InviteRepository port (packages/domains/identity/src/ports/)
T008: Create EmailPort interface (packages/domains/identity/src/ports/)
T009: Create invite Zod schemas (packages/shared/src/schemas/)
T010: Create invite DTOs (packages/shared/src/types/)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T016)
3. Complete Phase 3: User Story 1 (T017–T027)
4. **STOP and VALIDATE**: Admin can send invites, pending invites appear in members list
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test independently → Deploy (MVP — invites can be sent)
3. Add US2 → Test independently → Deploy (invites can be accepted)
4. Add US3 → Test independently → Deploy (resend/revoke lifecycle)
5. Add US4 → Test independently → Deploy (error screens polished)
6. Polish phase → Final quality pass → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (invite creation + list)
   - Developer B: US2 (invite acceptance) — starts after US1 routes are merged
3. After US1 merges:
   - Developer A: US3 (resend/revoke)
   - Developer B: US4 (error screens) — starts after US2 landing page is merged
4. Both complete Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable (US2-US4 depend on prior stories for realistic testing)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Token-based lookups (`findByToken`) are intentionally cross-org (token is the identity)
- All other invite queries MUST include `org_id`
