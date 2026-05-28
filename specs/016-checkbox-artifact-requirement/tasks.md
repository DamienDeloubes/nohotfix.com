# Tasks: Checkbox Artifact Requirement

**Input**: Design documents from `/specs/016-checkbox-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — the spec follows established testing discipline (unit tests for value objects and domain logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the checkbox type to shared schemas and domain value objects — the foundation all user stories depend on.

- [x] T001 [P] Add `CheckboxArtifactRequirementSchema` and `CheckboxArtifactRequirementResponseSchema` to `packages/shared/src/schemas/specs.ts` and register both in the `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema` discriminated unions. Checkbox schema has `type: z.literal('checkbox')`, `label: z.string().min(1).max(200)`, `required: z.boolean().optional().default(false)` — no description field. Response schema adds `index: z.number()`.
- [x] T002 Export `CheckboxArtifactRequirement` and `CheckboxArtifactRequirementResponse` types from `packages/shared/src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain value object and its registration in the aggregate — MUST be complete before any user story UI work.

**No new error codes needed** — checkbox reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.

**No new OTel instrumentation needed** — checkbox flows through already-instrumented `createLibrarySpec` use case.

- [x] T003 Create `CheckboxArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/checkbox-artifact-requirement.ts` — follow `file-artifact-requirement.ts` pattern. Private constructor, `create()` factory (validates label via `ArtifactLabel.create()`, no description), `reconstitute()`, `toJson()` (returns `{ index, type: 'checkbox', label, required }`), `equals()`, `toString()`. No description property. (pattern: /project:new-entity)
- [x] T004 Add `'checkbox'` case to the type discriminator in `ArtifactRequirements.create()` in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` — import `CheckboxArtifactRequirement` and call `CheckboxArtifactRequirement.create({ ...item, index: i })` for `type === 'checkbox'`
- [x] T005 Export `CheckboxArtifactRequirement` from `packages/domains/authoring/src/entities/value-objects/index.ts` (or equivalent barrel file if one exists)

### Unit Tests

- [x] T006 [P] Create unit tests for `CheckboxArtifactRequirement` in `packages/domains/authoring/src/entities/__tests__/checkbox-artifact-requirement.test.ts` — follow `file-artifact-requirement.test.ts` pattern. Test: create with valid label + required true, create with defaults (required=false), label at 200 chars boundary, label at 201 chars throws `AUTHOR_ARTIFACT_LABEL_INVALID`, empty label throws `AUTHOR_ARTIFACT_LABEL_INVALID`, whitespace-only label throws, `toJson()` output shape (no description key), `equals()` comparison, `toString()` output, `reconstitute()` skips validation
- [x] T007 [P] Add checkbox-type tests to `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` — test: single checkbox requirement creates with index 0, mixed types array (text + file + checkbox) creates with correct indices and types, checkbox in 10-item array accepted, checkbox type serializes correctly via `toJson()`

**Checkpoint**: Foundation ready — shared schemas, value object, aggregate discriminator, and unit tests all in place.

---

## Phase 3: User Story 1 — Add a Checkbox Artifact Requirement to a Spec (Priority: P1) 🎯 MVP

**Goal**: Admin can add checkbox artifact requirements during spec creation. The form shows a label input + required toggle (no description). Checkbox type persists correctly through create-and-view round trip.

**Independent Test**: Create a spec with one or more checkbox artifact requirements and verify they persist correctly.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `CheckboxArtifactForm` component in `packages/domains/authoring/src/ui/components/CheckboxArtifactForm.tsx` — follow `FileArtifactForm.tsx` pattern but simpler: label input with 200-char character counter, required toggle checkbox. No description textarea. No file constraint info box. Placeholder text: "e.g. I verified this in staging". Accept same props interface as `TextArtifactForm`/`FileArtifactForm` (onChange, value, errors).
- [x] T009 [US1] Wire checkbox type into `ArtifactRequirementsList` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — add "Checkbox" button alongside existing "Text" and "File" buttons (disabled at max 10). Render `CheckboxArtifactForm` when `type === 'checkbox'`. Update `ArtifactFormData` union type to include checkbox (type: 'checkbox', label: string, required: boolean — no description field). Update `hasArtifactErrors()` to validate checkbox items (label required, max 200 chars — no description validation).
- [x] T010 [US1] Update form data mapping in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` — update the type assertion in the `artifactRequirements.map()` to include `'checkbox'`: `type: a.type as 'text' | 'file' | 'checkbox'`. For checkbox type, do NOT include description in the mapped output (checkbox has no description). Ensure sessionStorage serialization handles checkbox form data.

**Checkpoint**: Admin can add checkbox artifact requirements, fill in label + required toggle, submit the spec, and the checkbox data persists correctly.

---

## Phase 4: User Story 2 — Validate Checkbox Artifact Requirement Fields (Priority: P1)

**Goal**: Validation on both frontend (inline errors, character counter, prevent submission) and backend (Zod schema rejects invalid payloads) for checkbox artifact requirements.

**Independent Test**: Enter values at and beyond the label constraint. Verify inline errors, submission prevention, and server-side rejection.

### Implementation for User Story 2

- [x] T011 [US2] Verify frontend validation in `CheckboxArtifactForm.tsx` and `ArtifactRequirementsList.tsx` — label field shows inline error when empty, inline error when > 200 chars, character counter updates in real time. Submit button disabled when validation errors present. This should already work from T008/T009 if the validation pattern from `TextArtifactForm`/`FileArtifactForm` was followed. Manual verification and fix any gaps.
- [x] T012 [US2] Verify backend validation — the `CheckboxArtifactRequirementSchema` in `packages/shared/src/schemas/specs.ts` (from T001) enforces `label.min(1).max(200)`. The `ArtifactRequirements.create()` in the domain (from T004) validates via `ArtifactLabel.create()`. Verify: empty label rejected, > 200 char label rejected, payload with description field silently stripped (Zod default strip behavior). No code changes expected — this is a validation pass.

**Checkpoint**: All invalid checkbox inputs are rejected on both client and server. Description fields in API payloads are silently stripped.

---

## Phase 5: User Story 3 — Display Checkbox Artifact Requirements on Spec Detail Page (Priority: P2)

**Goal**: Spec detail page shows checkbox requirements with "Checkbox" type badge, label, and required/optional status. No description displayed.

**Independent Test**: Create a spec with checkbox requirements, view the detail page, verify correct display.

### Implementation for User Story 3

- [x] T013 [US3] Add checkbox type badge to `ArtifactRequirementsDisplay` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` — add `'checkbox'` case to the type badge rendering. Use green color (e.g. `bg-green-100 text-green-800`) to differentiate from blue (File) and indigo (Text). Display label and required/optional badge. No description section rendered for checkbox type.

**Checkpoint**: Spec detail page correctly displays checkbox artifact requirements with distinct visual indicator.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories.

- [x] T014 Run `pnpm turbo run typecheck` to verify no type errors across the monorepo
- [x] T015 Run `pnpm --filter @releasepilot/domain-authoring test` to verify all unit tests pass (existing + new)
- [x] T016 Run `pnpm turbo run build` to verify full build succeeds
- [x] T017 Verify no ad-hoc string errors — all error paths use existing domain error codes from `packages/shared/src/errors/codes.ts`
- [x] T018 Verify checkbox data round-trip: create spec with checkbox requirements via UI, view on detail page, confirm correct persistence and display

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T001 and T002 are parallel.
- **Foundational (Phase 2)**: T003 depends on T001 (needs shared schema types). T004 depends on T003. T005 depends on T003. T006 and T007 depend on T003/T004.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion. T008 is parallel with T006/T007 (different files). T009 depends on T008. T010 depends on T009.
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (validates what Phase 3 built). Mostly verification, minimal code.
- **User Story 3 (Phase 5)**: Can start after Phase 2. Independent of Phases 3–4.
- **Polish (Phase 6)**: Depends on all user stories complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational (Phase 2)
- **User Story 2 (P1)**: Depends on User Story 1 (validates its form)
- **User Story 3 (P2)**: Depends only on Foundational (Phase 2) — can run in parallel with US1

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T006 and T007 (Unit tests) can run in parallel
- T008 (CheckboxArtifactForm) can run in parallel with T006/T007 (different files)
- US3 (Phase 5) can run in parallel with US1 (Phase 3) after Phase 2 completes

---

## Parallel Example: Phase 2

```bash
# After T003 + T004 complete, launch tests in parallel:
Task: T006 "Unit tests for CheckboxArtifactRequirement value object"
Task: T007 "Checkbox tests for ArtifactRequirements aggregate"
```

## Parallel Example: After Phase 2

```bash
# US1 and US3 can start simultaneously:
Task: T008 [US1] "Create CheckboxArtifactForm component"
Task: T013 [US3] "Add checkbox type badge to ArtifactRequirementsDisplay"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T007)
3. Complete Phase 3: User Story 1 (T008–T010)
4. **STOP and VALIDATE**: Create a spec with checkbox requirements, verify persistence
5. Proceed to Phase 4 (US2 validation) and Phase 5 (US3 display)

### Incremental Delivery

1. Setup + Foundational → Schemas, value objects, tests ✅
2. User Story 1 → Admin can add checkboxes to specs ✅ (MVP!)
3. User Story 2 → Validation verified on both sides ✅
4. User Story 3 → Detail page displays checkboxes ✅
5. Polish → Full build, typecheck, round-trip verification ✅

---

## Notes

- This is the smallest artifact type implementation (~12 files modified/created)
- No database migration required
- No new API endpoints
- No new error codes
- No new OTel instrumentation
- Pattern source for all tasks: features 014 (text) and 015 (file)
- Key difference from text/file: no description field anywhere (schema, value object, form, display)
