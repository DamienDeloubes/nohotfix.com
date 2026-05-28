# Tasks: File Artifact Requirement

**Input**: Design documents from `/specs/015-file-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included — unit tests for new value object and updated collection VO.

**Organization**: Tasks grouped by user story. US1 and US2 are both P1 and tightly coupled (creation + validation). US3 and US4 are P2 (display + constraint note).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Shared Schema + Domain Layer)

**Purpose**: Zod schema and domain value objects that ALL user stories depend on. No new error codes or OTel spans needed (reuses existing).

- [x] T001 [P] Add `FileArtifactRequirementSchema` and `FileArtifactRequirementResponseSchema` to the discriminated union in `packages/shared/src/schemas/specs.ts` — define `type: z.literal('file')` variant with same base fields as text (label 1-200 chars, optional description max 1000 chars, optional required boolean defaulting false); add both to `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema` unions
- [x] T002 [P] Create `FileArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/file-artifact-requirement.ts` — follow `TextArtifactRequirement` pattern: private constructor, `.create()` factory composing `ArtifactLabel` + `ArtifactDescription`, `type: 'file'` literal, `.toJson()` returning `FileArtifactRequirementJson` interface; export from `packages/domains/authoring/src/index.ts` (pattern: /project:new-entity)
- [x] T003 Update `ArtifactRequirements` collection VO in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` — import `FileArtifactRequirement`, add `case 'file':` to type dispatch in `.create()` method, update `ArtifactRequirementJson` union type to include `FileArtifactRequirementJson`, update `items` type to include `FileArtifactRequirement`
- [x] T004 Create unit tests for `FileArtifactRequirement` VO in `packages/domains/authoring/src/entities/__tests__/file-artifact-requirement.test.ts` — test: valid creation with all fields, valid creation with only label, label trimming, label boundary (200 chars accepted, 201 rejected), empty/whitespace-only label rejected, description boundary (1000 chars accepted, 1001 rejected), whitespace-only description normalised to null, required defaults to false, type is 'file', toJson() output, equals() and toString()
- [x] T005 Update unit tests for `ArtifactRequirements` collection in `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` — add tests: file type accepted and indexed correctly, mixed text + file types indexed contiguously, file type serialised correctly via toJson(), 10-item limit applies across mixed types

**Checkpoint**: Schema and domain layer support file artifacts. Backend validation works end-to-end via existing create spec use case.

---

## Phase 2: User Story 1 — Add a File Artifact Requirement to a Spec (Priority: P1) 🎯 MVP

**Goal**: Admin can select "File" from the artifact type selector, fill in label/description/required, and submit the spec with file artifact requirements persisted.

**Independent Test**: Create a spec with one or more file artifact requirements via the UI and verify they persist through the create-and-view round trip.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `FileArtifactForm` component in `packages/domains/authoring/src/ui/components/FileArtifactForm.tsx` — follow `TextArtifactForm.tsx` pattern: define `FileArtifactFormData` interface (`{ type: 'file'; label: string; description: string; required: boolean }`), render label input (200 char limit + counter), description textarea (1000 char limit + counter), required checkbox, inline validation errors; add static info note about system-enforced file constraints ("Files are limited to 10 MB. Only certain file types are accepted.")
- [x] T007 [US1] Update `ArtifactRequirementsList` component in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — import `FileArtifactForm`; update `ArtifactFormData` union type to include `FileArtifactFormData`; update the "Add artifact requirement" control to present a type selector with "Text" and "File" options (dropdown or segmented control); render `FileArtifactForm` when item type is `'file'`; display a file icon (e.g., lucide-react `FileUp` or `Paperclip`) in the artifact requirement card header to visually distinguish file from text requirements in the creation form; update `validateArtifact()` to handle file type (same validation rules as text: label 1-200 chars, description max 1000 chars)
- [x] T008 [US1] Verify `CreateSpecForm` serialization in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` handles file type — confirm the `artifactRequirements.map(a => ...)` serialization in the submit handler passes `type: 'file'` through correctly (should work without changes since it uses `a.type`); verify session storage persistence handles the new type

**Checkpoint**: Admin can add file artifact requirements in the create spec form, submit, and see them persisted. US1 is fully functional.

---

## Phase 3: User Story 2 — Validate File Artifact Requirement Fields (Priority: P1)

**Goal**: Frontend inline validation and backend rejection for invalid file artifact fields.

**Independent Test**: Enter values at and beyond each field's constraints for a file artifact requirement, verify inline errors appear and backend rejects invalid payloads.

### Implementation for User Story 2

- [x] T009 [US2] Verify frontend validation for file artifacts in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — confirm `validateArtifact()` handles `type: 'file'` with same rules as text (if not already covered in T007, add missing validation); confirm character counters highlight red when over limit; confirm submit button is disabled when any artifact has validation errors
- [x] T010 [US2] Add file artifact test cases to the existing create-spec integration test in `apps/api/src/routes/authoring.spec.ts` — add cases: (1) happy path creating a spec with a file artifact requirement returns 201 with correct type/label/description/required, (2) file artifact with empty label returns 400 with `AUTHOR_ARTIFACT_LABEL_INVALID`, (3) file artifact with label > 200 chars returns 400, (4) mixed text + file artifacts returns 201 with both types correctly persisted

**Checkpoint**: All validation paths work for file artifacts — same guarantees as text artifacts.

---

## Phase 4: User Story 3 — Display File Artifact Requirements on Spec Detail Page (Priority: P2)

**Goal**: Spec detail page shows file artifact requirements with correct "File" type badge.

**Independent Test**: Create a spec with file artifacts, view the spec detail page, verify "File" badge and all fields display correctly.

### Implementation for User Story 3

- [x] T011 [US3] Update `ArtifactRequirementsDisplay` component in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` — add rendering case for `type: 'file'` to display "File" badge (distinct from "Text" badge); use an appropriate icon (e.g., file/paperclip icon from lucide-react) to visually distinguish file requirements

**Checkpoint**: Spec detail page correctly displays both file and text artifact requirements with distinct type indicators.

---

## Phase 5: User Story 4 — Communicate File Upload Constraints to the Author (Priority: P2)

**Goal**: File artifact form shows informational note about system-enforced upload constraints.

**Independent Test**: Add a file artifact requirement and verify constraint note is visible.

### Implementation for User Story 4

- [x] T012 [US4] Verify constraint note in `FileArtifactForm` component (created in T006) — confirm the static info note displays: file size limit (10 MB) and that only certain file types are accepted; ensure the note is styled as informational (not as an error or warning); ensure it does not introduce any configurable fields

**Checkpoint**: Author is informed about upload constraints when adding file artifact requirements.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify everything works end-to-end across the full stack.

- [x] T013 [P] Run `pnpm --filter @nohotfix/domain-authoring test` to verify all domain unit tests pass (including new file artifact tests)
- [x] T014 [P] Run `pnpm --filter @nohotfix/shared build` to verify shared schema builds with new file variant
- [x] T015 Run `pnpm turbo run build typecheck test` to verify full pipeline passes
- [x] T016 Manual smoke test: create a spec with mixed text + file artifact requirements, verify create form, submit, and detail page all work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: Depends on Phase 1 (Zod schema + VO must exist before UI)
- **US2 (Phase 3)**: Depends on Phase 2 (validation is verified against the creation flow)
- **US3 (Phase 4)**: Depends on Phase 1 (needs schema to render correctly); independent of US1/US2
- **US4 (Phase 5)**: Depends on Phase 2 (constraint note is part of FileArtifactForm created in T006)
- **Polish (Phase 6)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US2 (P1)**: Depends on US1 (validates the creation flow built in US1)
- **US3 (P2)**: Can start after Phase 1 — independent of US1/US2 (different component)
- **US4 (P2)**: Embedded in US1's `FileArtifactForm` — verification only after US1

### Within Each User Story

- Schema + VO before UI components
- UI component creation before integration verification
- All implementation before polish

### Parallel Opportunities

- T001 and T002 can run in parallel (different files: shared schema vs domain VO)
- T004 depends on T002; T005 depends on T003. Both test tasks can run in parallel with each other once their source dependencies are complete.
- T006 can run in parallel with T011 (different UI components: form vs display)
- T013 and T014 can run in parallel (different packages)

---

## Parallel Example: Phase 1 (Foundational)

```bash
# Launch schema and VO creation in parallel:
Task: T001 "Add FileArtifactRequirementSchema to packages/shared/src/schemas/specs.ts"
Task: T002 "Create FileArtifactRequirement VO in packages/domains/authoring/src/entities/value-objects/file-artifact-requirement.ts"

# Then sequentially:
Task: T003 "Update ArtifactRequirements collection (depends on T002)"

# Then in parallel:
Task: T004 "Unit tests for FileArtifactRequirement VO"
Task: T005 "Update ArtifactRequirements collection tests"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Foundational (schema + VO)
2. Complete Phase 2: US1 (FileArtifactForm + type selector)
3. **STOP and VALIDATE**: Create a spec with file artifacts, verify round-trip
4. All core value is delivered — Admin can add file artifacts to specs

### Incremental Delivery

1. Phase 1 (Foundational) → Schema + domain layer ready
2. US1 (Create) → File artifacts can be added → **MVP!**
3. US2 (Validate) → Verification that validation works correctly
4. US3 (Display) → Detail page shows file type correctly
5. US4 (Constraints) → Verification that constraint note is present
6. Polish → Full pipeline validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 and US4 are primarily verification tasks — most implementation happens in US1 (T006, T007)
- No new error codes, OTel spans, or database migrations needed
- T009, T010, T012 are verification/integration tasks, not new code — they confirm existing patterns handle the new type correctly
