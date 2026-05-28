# Tasks: Managed Environments

**Input**: Design documents from `/specs/021-managed-environments/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Not explicitly requested in the spec. Test tasks are omitted. Tests can be added incrementally during implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Register error codes, create Zod schemas, database migration, and schema types — all prerequisites consumed by domain and API layers.

- [x] T001 [P] Register 4 new error codes (AUTH_ENV_NOT_FOUND, AUTH_ENV_NAME_DUPLICATE, AUTH_ENV_NAME_INVALID, AUTH_ENV_IN_USE) in `packages/shared/src/errors/codes.ts`
- [x] T002 [P] Create Zod schemas (EnvironmentDtoSchema, CreateEnvironmentRequestSchema, UpdateEnvironmentRequestSchema, ReorderEnvironmentsRequestSchema) in `packages/shared/src/schemas/environments.ts` and export from `packages/shared/src/index.ts`
- [x] T003 [P] Create database migration `packages/db/src/migrations/006_create_environments_table.ts`: create `environments` table with indexes + case-insensitive unique constraint, add `environment_id` FK column to `playbooks`, drop `environment` TEXT column from `playbooks` (verify no non-null data exists first; if data exists, map freeform values to environment IDs by name match before drop), seed 3 defaults for all existing orgs via INSERT...SELECT (pattern: /project:migrate)
- [x] T004 Add `EnvironmentsTable` interface and update `PlaybooksTable` (replace `environment: string | null` with `environment_id: string | null`) in `packages/db/src/schema.ts`, add `environments: EnvironmentsTable` to `Database` interface, export convenience type aliases

**Checkpoint**: Shared schemas, error codes, DB migration, and types are ready for domain layer

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain entity, value object, port interface, error classes, repository adapter, and composition root wiring — blocks all user story work

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create EnvironmentName value object in `packages/domains/identity/src/entities/environment-name.ts` with create()/equals()/toString(), trimming, 1-100 char validation, case-insensitive equals (pattern: /project:new-entity)
- [x] T006 [P] Create EnvironmentEntity in `packages/domains/identity/src/entities/environment.ts` with private constructor, static create()/reconstitute(), rename() returning new instance (pattern: /project:new-entity)
- [x] T007 [P] Create 4 domain error classes (AuthEnvNotFoundError, AuthEnvNameDuplicateError, AuthEnvNameInvalidError, AuthEnvInUseError) in `packages/domains/identity/src/errors/index.ts`
- [x] T008 [P] Create EnvironmentRepository port interface in `packages/domains/identity/src/ports/environment-repository.ts` with findByOrg(), findById(), create(), update(), delete(), countPlaybooksByEnvironmentId(), getMaxPosition()
- [x] T009 Export new entities, value objects, errors, and ports from `packages/domains/identity/src/index.ts`
- [x] T010 Create KyselyEnvironmentRepository implementing EnvironmentRepository port in `apps/api/src/adapters/repositories/kysely-environment-repository.ts` with org_id tenancy on all queries
- [x] T011 Wire KyselyEnvironmentRepository in `apps/api/src/composition-root.ts` (add to CompositionRoot interface and createCompositionRoot function)

**Checkpoint**: Foundation ready — entity, repository, errors, and wiring in place. User story implementation can begin.

---

## Phase 3: User Story 1 — View and Manage Environments (Priority: P1) MVP

**Goal**: Admin navigates to the Environments settings page and sees all environments for their org displayed in position order, with the 3 seeded defaults visible.

**Independent Test**: Navigate to `/:orgSlug/settings/environments` and verify Production, Acceptance, Test are displayed in order.

### Implementation for User Story 1

- [x] T012 [US1] Create listEnvironments use case in `packages/domains/identity/src/use-cases/list-environments.ts` accepting Deps (EnvironmentRepository) and Command (orgId), returning EnvironmentDto[] (pattern: /project:new-route)
- [x] T013 [US1] Add GET `/api/orgs/:orgSlug/environments` route handler in `apps/api/src/routes/identity.ts` with orgScopeMiddleware, calling listEnvironments use case, returning 200 with environments array (pattern: /project:new-route)
- [x] T014 [P] [US1] Add environmentKeys factory to `apps/app/src/api/query-keys.ts` (all, lists, list pattern matching existing settingsKeys)
- [x] T015 [US1] Create useEnvironments query hook (list) in `packages/domains/identity/src/ui/hooks/use-environments.ts` accepting queryKey param, fetching GET /api/orgs/:orgSlug/environments
- [x] T016 [US1] Create Environments settings page in `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx` with admin role guard in beforeLoad, rendering ordered list of environment names with drag handles and delete buttons

**Checkpoint**: Admin can view all environments on the settings page. The 3 seeded defaults appear in order.

---

## Phase 4: User Story 2 — Add a New Environment (Priority: P1)

**Goal**: Admin clicks "Add environment", types a name, and saves. The new environment appears at the bottom of the list. Duplicate names (case-insensitive) are rejected with inline error.

**Independent Test**: Click "Add environment", type "Hotfix", press Enter — verify it appears in the list. Try adding "production" — verify duplicate error.

### Implementation for User Story 2

- [x] T017 [US2] Create createEnvironment use case in `packages/domains/identity/src/use-cases/create-environment.ts` with duplicate name check (case-insensitive), position = maxPosition + 1, returning EnvironmentDto (pattern: /project:new-route)
- [x] T018 [US2] Add POST `/api/orgs/:orgSlug/environments` route handler in `apps/api/src/routes/identity.ts` with orgScopeMiddleware + admin role check, Zod validation via CreateEnvironmentRequestSchema (pattern: /project:new-route)
- [x] T019 [US2] Create useCreateEnvironment mutation hook in `packages/domains/identity/src/ui/hooks/use-environments.ts` accepting invalidateKeys param, posting to POST /api/orgs/:orgSlug/environments
- [x] T020 [US2] Add inline "Add environment" form to settings page in `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx` with name input, Enter to save, inline validation error display for duplicates
- [x] T021 [US2] Modify createOrganisation use case in `packages/domains/identity/src/use-cases/create-organisation.ts` to seed 3 default environments (Production pos 0, Acceptance pos 1, Test pos 2) on new org creation

**Checkpoint**: Admin can add environments. Duplicates are blocked. New orgs get 3 defaults seeded.

---

## Phase 5: User Story 3 — Rename an Environment (Priority: P2)

**Goal**: Admin clicks an environment name, edits it inline, and saves. The rename propagates via ID reference. Duplicate and empty names are rejected.

**Independent Test**: Click "Acceptance", edit to "Staging", press Enter — verify the name updates in the list.

### Implementation for User Story 3

- [x] T022 [US3] Create renameEnvironment use case in `packages/domains/identity/src/use-cases/rename-environment.ts` with findById, duplicate name check, entity.rename(), returning updated EnvironmentDto (pattern: /project:new-route)
- [x] T023 [US3] Add PATCH `/api/orgs/:orgSlug/environments/:environmentId` route handler in `apps/api/src/routes/identity.ts` with orgScopeMiddleware + admin role check, Zod validation via UpdateEnvironmentRequestSchema (pattern: /project:new-route)
- [x] T024 [US3] Create useRenameEnvironment mutation hook in `packages/domains/identity/src/ui/hooks/use-environments.ts` accepting invalidateKeys param
- [x] T025 [US3] Add inline-edit behaviour to environment name rows in `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx` — click to edit, Enter/blur to save, revert on empty, inline error on duplicate

**Checkpoint**: Admin can rename environments inline. Validation errors display inline.

---

## Phase 6: User Story 4 — Reorder Environments (Priority: P2)

**Goal**: Admin drags an environment to a new position. The new order is saved immediately and reflected in all dropdowns.

**Independent Test**: Drag "Test" above "Acceptance" — verify order persists on page reload.

### Implementation for User Story 4

- [x] T026 [US4] Create reorderEnvironments use case in `packages/domains/identity/src/use-cases/reorder-environments.ts` accepting full ordered list of environment IDs, validating all IDs belong to org, updating positions in a single transaction (pattern: /project:new-route)
- [x] T027 [US4] Add POST `/api/orgs/:orgSlug/environments/reorder` route handler in `apps/api/src/routes/identity.ts` with orgScopeMiddleware + admin role check, Zod validation via ReorderEnvironmentsRequestSchema (pattern: /project:new-route)
- [x] T028 [US4] Create useReorderEnvironments mutation hook in `packages/domains/identity/src/ui/hooks/use-environments.ts` accepting invalidateKeys param
- [x] T029 [US4] Add @dnd-kit drag-and-drop to environment list in `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx` — drag handle on each row, onDragEnd calls reorder mutation with new ID order

**Checkpoint**: Admin can reorder environments via drag-and-drop. Order persists and is reflected in dropdowns.

---

## Phase 7: User Story 5 — Delete an Environment (Priority: P3)

**Goal**: Admin clicks delete on an environment. If unused by playbooks, confirmation prompt then delete. If in use by playbooks, deletion is blocked with an explanatory message.

**Independent Test**: Delete an unused environment — verify it disappears. Try deleting one referenced by a playbook — verify the block message with counts.

### Implementation for User Story 5

- [x] T030 [US5] Create deleteEnvironment use case in `packages/domains/identity/src/use-cases/delete-environment.ts` with findById, count referencing playbooks (via countPlaybooksByEnvironmentId), block with AuthEnvInUseError if > 0, delete and reorder remaining positions. Active run checks deferred to run creation feature. (pattern: /project:new-route)
- [x] T031 [US5] Add DELETE `/api/orgs/:orgSlug/environments/:environmentId` route handler in `apps/api/src/routes/identity.ts` with orgScopeMiddleware + admin role check, returning 204 on success (pattern: /project:new-route)
- [x] T032 [US5] Create useDeleteEnvironment mutation hook in `packages/domains/identity/src/ui/hooks/use-environments.ts` accepting invalidateKeys param
- [x] T033 [US5] Add delete button and confirmation dialog to environment rows in `apps/app/src/routes/_authenticated/$orgSlug/settings/environments.tsx` — on click: if success show confirm dialog, if 409 show block message with playbook count

**Checkpoint**: Admin can delete unused environments. In-use environments are blocked with clear explanation.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: OTel instrumentation, error code verification, and build validation

- [x] T034 [P] Add OTel span attributes (environment.id, environment.name, org.id) to all environment route handlers in `apps/api/src/routes/identity.ts` using getSpan(request) pattern
- [x] T035 [P] Verify all error paths in use cases throw domain error classes (no ad-hoc string errors) — check create, rename, delete use cases
- [x] T036 [P] Add sidebar navigation link to Environments settings page in `apps/app/src/components/layout/Sidebar.tsx` (under Settings section)
- [x] T037 Run `pnpm turbo run build typecheck test` to verify full pipeline passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — MVP, first story to implement
- **US2 (Phase 4)**: Depends on Phase 3 (needs list page to display created environments)
- **US3 (Phase 5)**: Depends on Phase 3 (needs list page with environment rows)
- **US4 (Phase 6)**: Depends on Phase 3 (needs list page with environment rows)
- **US5 (Phase 7)**: Depends on Phase 3 (needs list page with delete buttons)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Requires Foundational — no other story dependencies
- **US2 (P1)**: Requires US1 (list page must exist to show added environments)
- **US3 (P2)**: Requires US1 — independent of US2, US4, US5
- **US4 (P2)**: Requires US1 — independent of US2, US3, US5
- **US5 (P3)**: Requires US1 — independent of US2, US3, US4

### Parallel Opportunities

- **Phase 1**: T001, T002, T003 can run in parallel (different files)
- **Phase 2**: T005, T006, T007, T008 can run in parallel (different files)
- **After US1**: US3, US4, US5 can run in parallel (independent features on the same page)
- **Phase 8**: T034, T035, T036 can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```
# Launch all domain artifacts in parallel:
Task T005: "Create EnvironmentName value object in packages/domains/identity/src/entities/environment-name.ts"
Task T006: "Create EnvironmentEntity in packages/domains/identity/src/entities/environment.ts"
Task T007: "Create 4 domain error classes in packages/domains/identity/src/errors/index.ts"
Task T008: "Create EnvironmentRepository port in packages/domains/identity/src/ports/environment-repository.ts"

# Then sequentially:
Task T009: "Export from index.ts" (depends on T005-T008)
Task T010: "Create KyselyEnvironmentRepository" (depends on T008)
Task T011: "Wire in composition root" (depends on T010)
```

## Parallel Example: After US1

```
# These can run in parallel (different use cases, routes, and UI additions):
US3 (T022-T025): Rename environment
US4 (T026-T029): Reorder environments
US5 (T030-T033): Delete environment
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (error codes, schemas, migration)
2. Complete Phase 2: Foundational (entity, port, repo, wiring)
3. Complete Phase 3: US1 — List environments page
4. **STOP and VALIDATE**: Navigate to settings page, verify 3 defaults displayed
5. Deploy/demo if ready — admin can see environments

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (List) → Admin sees environments → MVP!
3. US2 (Add) → Admin can add environments
4. US3 (Rename) + US4 (Reorder) → Can run in parallel → Full management
5. US5 (Delete) → Complete CRUD with safety guards
6. Polish → OTel, verification, build pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- The migration (T003) seeds existing orgs — no separate seeding task needed
- The createOrganisation modification (T021) handles new org seeding
