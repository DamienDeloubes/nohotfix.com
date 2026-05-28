# Tasks: Organisation Settings Page

**Input**: Design documents from `/specs/006-org-settings/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec. Omitted.

**Organization**: Tasks grouped by user story. All three stories are P1 but have a natural dependency order: view (US1) → edit (US2) → permission enforcement (US3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared schema and export wiring needed by all stories

- [x] T001 [P] Add `UpdateOrganisationRequestSchema` to `packages/shared/src/schemas/organisation.ts` — Zod schema: `z.object({ name: z.string().min(1).max(100).trim() })`
- [x] T002 [P] Add `beforeLoad` redirect from `/settings/` to `/settings/general` in `apps/app/src/routes/_authenticated/$orgSlug/settings/index.tsx` (FR-001: default tab)

**Checkpoint**: Shared schema available, settings redirect in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Use case that all stories depend on (view returns org data, edit mutates it, permissions are checked inside it)

- [x] T003 Create `renameOrganisation` use case in `packages/domains/identity/src/use-cases/rename-organisation.ts` — accepts `{ organisationRepo, role, orgId, newName }`, checks role is owner/admin (throws `AuthRoleInsufficientError`), validates name via `OrganisationName.create()`, calls `organisationRepo.update()`, returns `OrganisationResponseSchema`-compatible DTO
- [x] T004 Export `renameOrganisation` from `packages/domains/identity/src/use-cases/index.ts`

**Checkpoint**: Domain use case ready — route and UI can now be built

---

## Phase 3: User Story 1 — View Organisation Details (Priority: P1)

**Goal**: Any org member navigates to Settings and sees the organisation name (read-only for Members) and slug (read-only for all).

**Independent Test**: Navigate to `/settings/general` as any role → org name and slug are displayed.

### Implementation for User Story 1

- [x] T005 [US1] Implement `GET /api/orgs/:orgSlug` handler in `apps/api/src/routes/identity.ts` — replace 501 stub, use `getSpan(request)` for span attributes, read `request.orgContext` fields, return `{ id, name, slug, createdAt }` using `OrganisationResponseSchema` (pattern: /project:new-route)
- [x] T006 [P] [US1] Create `useOrganisationDetails` TanStack Query hook in `packages/domains/identity/src/ui/hooks/use-organisation-details.ts` — `GET /api/orgs/:orgSlug`, returns `{ data, isLoading, error }`
- [x] T007 [US1] Create `OrganisationSettingsForm` component in `packages/domains/identity/src/ui/components/OrganisationSettingsForm.tsx` — displays org name and slug as read-only text fields; accepts `role` prop to conditionally render edit affordances (edit mode built in US2); shows loading skeleton while fetching
- [x] T008 [US1] Export `OrganisationSettingsForm` and `useOrganisationDetails` from `packages/domains/identity/src/ui/index.ts`
- [x] T009 [US1] Replace placeholder in `apps/app/src/routes/_authenticated/$orgSlug/settings/general.tsx` — import `OrganisationSettingsForm` and `useOrganisationDetails` from `@nohotfix/domain-identity/ui`, pass org slug and role from route context

**Checkpoint**: All roles can view org name + slug on the General Settings page

---

## Phase 4: User Story 2 — Edit Organisation Name (Priority: P1)

**Goal**: Owners and Admins can edit the org name inline and save. Success toast on save, validation error on invalid input.

**Independent Test**: Log in as Owner/Admin → change name → save → name persists on reload.

### Implementation for User Story 2

- [x] T010 [US2] Implement `PATCH /api/orgs/:orgSlug` handler in `apps/api/src/routes/identity.ts` — replace 501 stub, use `getSpan(request)` for span attributes, validate body with `UpdateOrganisationRequestSchema`, call `renameOrganisation` use case with deps from `request.server.root` + `request.orgContext`, return updated org DTO (pattern: /project:new-route)
- [x] T011 [P] [US2] Create `useRenameOrganisation` mutation hook in `packages/domains/identity/src/ui/hooks/use-rename-organisation.ts` — `PATCH /api/orgs/:orgSlug`, on success invalidates `useOrganisationDetails` query, returns `{ mutate, isPending, error }`
- [x] T012 [US2] Update `OrganisationSettingsForm` in `packages/domains/identity/src/ui/components/OrganisationSettingsForm.tsx` — when role is owner/admin: render name as editable input + Save button, wire `useRenameOrganisation` mutation, show inline validation errors (empty/too long), show success feedback on save, disable button while saving
- [x] T013 [US2] Export `useRenameOrganisation` from `packages/domains/identity/src/ui/index.ts`

**Checkpoint**: Owners/Admins can rename the organisation from the Settings page

---

## Phase 5: User Story 3 — Permission Enforcement for Members (Priority: P1)

**Goal**: Members see the page in read-only mode. PATCH requests from Members are rejected with AUTH_ROLE_INSUFFICIENT (403).

**Independent Test**: Log in as Member → no edit input or save button visible. Attempt PATCH via curl → 403.

### Implementation for User Story 3

- [x] T014 [US3] Verify `OrganisationSettingsForm` renders read-only view when `role === 'member'` — no input field, no save button. This should already work from T007 conditional rendering; confirm and adjust if needed in `packages/domains/identity/src/ui/components/OrganisationSettingsForm.tsx`
- [x] T015 [US3] Verify `renameOrganisation` use case rejects member role — the role check in T003 should throw `AuthRoleInsufficientError` for members. Manually test `PATCH /api/orgs/:orgSlug` as member → expect 403 response with `AUTH_ROLE_INSUFFICIENT` error code

**Checkpoint**: Permission enforcement confirmed for both UI and API layers

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories

- [x] T016 Verify OTel span instrumentation on both GET and PATCH handlers in `apps/api/src/routes/identity.ts` — auto-instrumented by `@fastify/otel`, custom attributes (`org.slug`, `user.id`) added via `getSpan(request)`
- [x] T017 Verify all error paths use domain error codes — `AUTH_ROLE_INSUFFICIENT` (403), `AUTH_ORG_NAME_INVALID` (422), `AUTH_ORG_NOT_FOUND` (404) — no ad-hoc string errors in `packages/domains/identity/src/use-cases/rename-organisation.ts`
- [x] T018 Run `pnpm turbo run build typecheck` to verify no type errors across the monorepo
- [x] T019 Run quickstart.md verification: test all 4 scenarios (Owner edit, Admin edit, Member read-only, Member PATCH rejection)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 and T002 can run in parallel immediately
- **Foundational (Phase 2)**: T003 depends on T001 (uses `UpdateOrganisationRequestSchema` pattern for validation). T004 depends on T003.
- **US1 (Phase 3)**: Depends on Phase 2 completion (T004). T005 and T006 can run in parallel. T007 depends on T006. T008 depends on T007. T009 depends on T008.
- **US2 (Phase 4)**: Depends on US1 (T009) for the component to extend. T010 and T011 can run in parallel. T012 depends on T011. T013 depends on T011.
- **US3 (Phase 5)**: Depends on US2 (T013) — verifies what US1+US2 built. T014 and T015 can run in parallel.
- **Polish (Phase 6)**: Depends on all user stories being complete (T015).

### User Story Dependencies

- **US1 (View)**: Independent after Foundational — delivers read-only page
- **US2 (Edit)**: Builds on US1's component — adds edit affordances
- **US3 (Permissions)**: Validates US1+US2 — confirms enforcement works end-to-end

### Parallel Opportunities

- T001 ‖ T002 (Setup phase — different files)
- T005 ‖ T006 (US1 — API route vs UI hook, different packages)
- T010 ‖ T011 (US2 — API route vs UI hook, different packages)
- T014 ‖ T015 (US3 — UI verification vs API verification)

---

## Parallel Example: User Story 1

```bash
# After Phase 2 completes, launch in parallel:
Task T005: "Implement GET /api/orgs/:orgSlug in apps/api/src/routes/identity.ts"
Task T006: "Create useOrganisationDetails hook in packages/domains/identity/src/ui/hooks/"

# Then sequentially:
Task T007: "Create OrganisationSettingsForm component"
Task T008: "Export from ui/index.ts"
Task T009: "Wire into settings/general.tsx route"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Navigate to Settings as any role → org name and slug displayed
5. Deliverable: read-only Organisation Settings page

### Incremental Delivery

1. Setup + Foundational → Schema and use case ready
2. Add US1 → Read-only settings page → Validate independently
3. Add US2 → Edit capability for Owners/Admins → Validate independently
4. Add US3 → Verify permission enforcement → Full feature complete
5. Polish → OTel, error paths, build verification

---

## Notes

- No schema migrations needed — all tables exist
- No new error codes needed — reuses `AUTH_ORG_NAME_INVALID` and `AUTH_ROLE_INSUFFICIENT`
- No new entities — `OrganisationEntity.rename()` and `OrganisationRepository.update()` already exist
- The `GET /api/orgs/:orgSlug` and `PATCH /api/orgs/:orgSlug` stubs already exist (returning 501) — replace handler bodies
- US3 is primarily a verification phase — the enforcement is built into the use case (T003) and UI (T007/T012)
