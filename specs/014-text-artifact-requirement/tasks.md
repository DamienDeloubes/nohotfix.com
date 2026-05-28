# Tasks: Text Artifact Requirement

**Input**: Design documents from `/specs/014-text-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — project infrastructure already exists. Skip to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared schemas, error codes, value objects, and entity changes that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Register error codes `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` in `packages/shared/src/errors/codes.ts`
- [x] T002 [P] Add `TextArtifactRequirementSchema`, `ArtifactRequirementSchema` (discriminated union), and `ArtifactRequirementResponseSchema` (with index) Zod schemas to `packages/shared/src/schemas/specs.ts`. Add `artifactRequirements` field to `CreateLibrarySpecRequestSchema` as `z.array(ArtifactRequirementSchema).max(10).optional()`. Update `LibrarySpecSchema` to use typed array instead of `z.unknown().nullable()`. Export new types from `packages/shared/src/types/index.ts`
- [x] T003 [P] Create `AuthorArtifactLabelInvalidError` and `AuthorArtifactRequirementsInvalidError` error classes in `packages/domains/authoring/src/errors/index.ts` (pattern: /project:new-entity)
- [x] T004 [P] Create `ArtifactLabel` value object in `packages/domains/authoring/src/entities/value-objects/artifact-label.ts` — private constructor, static `create(raw: string)`, trim, validate 1-200 chars, throw `AuthorArtifactLabelInvalidError` (pattern: /project:new-entity)
- [x] T005 [P] Create `ArtifactDescription` value object in `packages/domains/authoring/src/entities/value-objects/artifact-description.ts` — private constructor, static `create(raw: string | null | undefined)`, trim, whitespace-only → null, validate max 1,000 chars, throw `AuthorArtifactRequirementsInvalidError` (pattern: /project:new-entity)
- [x] T006 [P] Create `TextArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/text-artifact-requirement.ts` — composes `ArtifactLabel` + `ArtifactDescription`, stores `index`, `type: 'text'`, `required` (default false), exposes `toJson()` method (pattern: /project:new-entity)
- [x] T007 Create `ArtifactRequirements` collection value object in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` — static `create(raw: Array<{type, label, description?, required?}>)`, validates max 10, assigns contiguous 0-based indices, throws `AuthorArtifactRequirementsInvalidError`. Exposes `toJson()` returning typed array, `isEmpty` returning boolean (pattern: /project:new-entity)
- [x] T008 Re-export new value objects from `packages/domains/authoring/src/entities/value-objects/index.ts`
- [x] T009 Update `SpecLibraryEntryEntity` in `packages/domains/authoring/src/entities/spec-library-entry.ts` — change `artifactRequirements` type from `unknown` to typed array or null; add `artifactRequirements` to `CreateSpecLibraryEntryParams`; validate via `ArtifactRequirements.create()` in `create()` factory; empty array normalised to null
- [x] T010 Update `createLibrarySpec` use case in `packages/domains/authoring/src/use-cases/create-library-spec.ts` — accept `artifactRequirements` in `CreateLibrarySpecCommand`, pass to entity `create()`, serialise to JSON in repo call (replace hardcoded `null`)
- [x] T011 Update route handler in `apps/api/src/routes/authoring.ts` — forward `parsed.data.artifactRequirements` to `createLibrarySpec` command (pattern: /project:new-route)
- [x] T012 [P] Write unit tests for `ArtifactLabel` in `packages/domains/authoring/src/entities/__tests__/artifact-label.test.ts` — valid (1 char, 200 chars, trimming), invalid (empty, whitespace-only, 201 chars), error code assertion
- [x] T013 [P] Write unit tests for `ArtifactDescription` in `packages/domains/authoring/src/entities/__tests__/artifact-description.test.ts` — valid (null, 1000 chars, trimming), invalid (1001 chars), whitespace-only → null, error code assertion
- [x] T014 [P] Write unit tests for `TextArtifactRequirement` in `packages/domains/authoring/src/entities/__tests__/text-artifact-requirement.test.ts` — create with valid data, default required=false, toJson() output shape
- [x] T015 Write unit tests for `ArtifactRequirements` collection in `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` — valid (0 items, 1 item, 10 items), invalid (11 items), index assignment (contiguous 0-based), isEmpty, toJson(), unknown type rejection, error code assertion
- [x] T016 Write integration test for POST /api/orgs/:orgSlug/specs with artifact requirements in `apps/api/src/routes/authoring.spec.ts` — test cases: (1) create spec with valid text artifact requirements returns 201 with indexed artifacts, (2) create spec with empty label returns 400 with `AUTHOR_ARTIFACT_LABEL_INVALID`, (3) create spec with 11 artifact requirements returns 400 with `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`, (4) create spec with no artifact requirements returns 201 (backward compatibility)
- [x] T017 Export new entities, VOs, and errors from domain package `packages/domains/authoring/src/index.ts`

**Checkpoint**: Foundation ready — schemas validated, VOs tested, entity accepts artifact requirements, API route forwards data. User story UI work can begin.

---

## Phase 3: User Stories 1 & 2 — Add + Validate Text Artifact Requirement (Priority: P1) MVP

**Goal**: Admin can add text artifact requirements to a spec via the creation form with inline validation

**Independent Test**: Create a spec with one text artifact requirement (label + description + required toggle). Verify the requirement persists through the create-and-view round trip. Verify invalid inputs (empty label, label > 200 chars, description > 1,000 chars) show inline errors and are rejected server-side.

### Implementation

- [x] T018 [P] [US1] Create `TextArtifactForm` component in `packages/domains/authoring/src/ui/components/TextArtifactForm.tsx` — label input with character counter (max 200), description textarea with character counter (max 1,000), required toggle (default off), inline validation errors, `onChange` callback with typed artifact data
- [x] T019 [US1] Create `ArtifactRequirementsList` component in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — "Add artifact requirement" button with type selector (only "Text" for now), renders `TextArtifactForm` for each item, remove button per item, max 10 enforcement with disabled state and message, `onChange` callback with full list
- [x] T020 [US2] Add inline validation to `ArtifactRequirementsList` — validate label required (non-empty after trim), label max 200, description max 1,000 on each artifact form. Show field-level errors. Prevent form submission when errors exist
- [x] T021 [US1] Integrate `ArtifactRequirementsList` into `CreateSpecForm` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` — add as new form section after existing fields, include in form state and sessionStorage persistence, include in submit payload as `artifactRequirements`
- [x] T022 [US1] Update `SavedFormState` interface in `CreateSpecForm.tsx` to include `artifactRequirements` array for sessionStorage persistence

**Checkpoint**: Admin can add text artifact requirements with validation. Creating a spec with artifacts persists them to the database.

---

## Phase 4: User Story 3 — Manage Multiple Artifact Requirements (Priority: P1)

**Goal**: Admin can add up to 10 artifact requirements, remove individual ones, and reorder via drag-and-drop

**Independent Test**: Add 3 text artifact requirements, remove the second, verify re-indexing. Drag the third to the first position, verify new order persists. Add 10 requirements, verify the add button is disabled.

### Implementation

- [x] T023 [US3] Add drag-and-drop reordering to `ArtifactRequirementsList` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — use `@dnd-kit` (`DndContext`, `SortableContext`, `arrayMove`, `useSortable`) following the pattern in `TestStepList.tsx`
- [x] T024 [US3] Implement index recalculation in `ArtifactRequirementsList` — on remove: splice item and reassign contiguous 0-based indices. On reorder: `arrayMove` then reassign indices. Ensure indices in form state match visual order

**Checkpoint**: Admin can add, remove, and reorder artifact requirements. Indices recalculate correctly.

---

## Phase 5: User Story 4 — Display on Spec Detail Page (Priority: P2)

**Goal**: Spec detail page shows artifact requirements in a dedicated section

**Independent Test**: Create a spec with 2 text artifact requirements (one with description, one without). View the spec detail page and verify both are displayed with label, type, required status, and description (where present). Create a spec with no artifacts and verify no section is shown.

### Implementation

- [x] T025 [P] [US4] Create `ArtifactRequirementsDisplay` component in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` — renders list of artifact requirements ordered by index, each showing: label, type badge ("Text"), required/optional badge, description (if present). Returns null when list is empty or null
- [x] T026 [US4] Integrate `ArtifactRequirementsDisplay` into `SpecDetail` in `packages/domains/authoring/src/ui/components/SpecDetail.tsx` — render "Artifact Requirements" section after existing fields, conditionally hidden when no artifacts

**Checkpoint**: All user stories complete. Full create-validate-reorder-display flow works end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup

- [x] T027 [P] Verify all new error paths use domain-specific error codes (`AUTHOR_ARTIFACT_LABEL_INVALID`, `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`) — no ad-hoc string errors
- [x] T028 [P] Verify `UpdateLibrarySpecRequestSchema` in `packages/shared/src/schemas/specs.ts` also accepts `artifactRequirements` field (for future edit form compatibility per A-008)
- [x] T029 Run `pnpm turbo run build typecheck test` to confirm full pipeline passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories.
- **US1+US2 (Phase 3)**: Depends on Phase 2 completion (schemas, VOs, entity, route)
- **US3 (Phase 4)**: Depends on Phase 3 (needs the base `ArtifactRequirementsList` component)
- **US4 (Phase 5)**: Depends on Phase 2 only (can run in parallel with Phase 3/4 if desired — just needs typed data to display)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1+US2 (P1)**: Depends on Phase 2. Core creation + validation flow.
- **US3 (P1)**: Depends on US1+US2 (needs the list component to add reordering to)
- **US4 (P2)**: Depends on Phase 2 only (read-only display, no dependency on form components)

### Within Each User Story

- Value objects → Entity → Use case → Route → UI component → Integration
- Tests alongside implementation (Phase 2 includes unit tests for VOs)

### Parallel Opportunities

- T001, T002, T003, T004, T005, T006 can all run in parallel (different files)
- T012, T013, T014 can run in parallel (test files for different VOs)
- T018 and T025 can run in parallel (different UI components, no dependency)
- US4 (Phase 5) can run in parallel with US3 (Phase 4) if both start after Phase 3

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all independent foundational tasks together:
Task: "T001 — Register error codes in packages/shared/src/errors/codes.ts"
Task: "T002 — Add Zod schemas in packages/shared/src/schemas/specs.ts"
Task: "T003 — Create error classes in packages/domains/authoring/src/errors/index.ts"
Task: "T004 — Create ArtifactLabel VO in packages/domains/authoring/src/entities/value-objects/artifact-label.ts"
Task: "T005 — Create ArtifactDescription VO in packages/domains/authoring/src/entities/value-objects/artifact-description.ts"
Task: "T006 — Create TextArtifactRequirement VO in packages/domains/authoring/src/entities/value-objects/text-artifact-requirement.ts"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 2: Foundational (schemas, VOs, entity, route, tests)
2. Complete Phase 3: US1 + US2 (form component with validation)
3. **STOP and VALIDATE**: Create a spec with text artifacts, verify persistence
4. Deploy/demo if ready — core value delivered

### Incremental Delivery

1. Phase 2 → Foundation ready
2. Phase 3 (US1+US2) → Create + validate flow → Test → MVP!
3. Phase 4 (US3) → Drag-and-drop reordering → Test independently
4. Phase 5 (US4) → Detail page display → Test independently
5. Phase 6 → Polish and verify

---

## Notes

- No database migration required — `artifact_requirements` JSONB column already exists
- Only "Text" type implemented now; discriminated union schema extends for future types
- Drag-and-drop reuses `@dnd-kit` patterns from existing `TestStepList` component
- Domain UI components live in `packages/domains/authoring/src/ui/components/` (not `apps/app/`)
- Test files in domain packages use `.test.ts` naming (not `.spec.ts`)
- Query keys already centralised; no new query key factories needed for this feature
