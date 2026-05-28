# Tasks: Measured Value Artifact Requirement

**Input**: Design documents from `/specs/019-measured-value-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — unit tests are part of the established artifact requirement pattern and are required by the constitution (Principle III).

**Organization**: Tasks are grouped by user story. US1 (add measured value) and US2 (validate fields) are tightly coupled — they compose the core creation flow. US3 (display) is independently implementable after Phase 2. US4 (conditional tolerance description) is a UX refinement implemented within the form component.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Schemas)

**Purpose**: Add measured value Zod schemas and type exports to `packages/shared`. These are foundational — all domain value objects and UI components depend on them. Note: `MeasuredValueUnitSchema` already exists (created by feature 018 for table columns).

- [x] T001 Add `MeasuredValueArtifactRequirementSchema` (with fields: `type: z.literal('measured_value')`, `label`, `description`, `required`, `unit: MeasuredValueUnitSchema`, `expectedValue: z.number().refine(Number.isFinite)`, `tolerancePercentage: z.number().positive().optional()`, `toleranceDescription: z.string().max(1000).optional()`) and `MeasuredValueArtifactRequirementResponseSchema` (with `index`, nullable fields for description/tolerancePercentage/toleranceDescription) to `packages/shared/src/schemas/specs.ts`. Add both to the `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema` discriminated unions.
- [x] T002 Export `MeasuredValueArtifactRequirement` and `MeasuredValueArtifactRequirementResponse` types (via `z.infer`) from `packages/shared/src/types/index.ts`. Add imports for the new schemas from `../schemas/specs.js`.

**Checkpoint**: `pnpm turbo run typecheck --filter @releasepilot/shared` passes

---

## Phase 2: Foundational (Domain Value Objects)

**Purpose**: Create domain value objects in `packages/domains/authoring/` and wire the `'measured_value'` case into the existing discriminated union factory. All UI and test tasks depend on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `MeasuredValueUnit` value object in `packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts` with private constructor, `create(raw: string)`, `equals()`, `toString()`. Validate that the unit is one of the 6 allowed values (`ms`, `s`, `%`, `MB`, `GB`, `req/s`). Throw `AuthorArtifactRequirementsInvalidError` with descriptive message for invalid units. (pattern: /project:new-entity)
- [x] T004 Create `MeasuredValueArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/measured-value-artifact-requirement.ts` with `create()`, `reconstitute()`, `toJson()`, `equals()`, `toString()`. Use `ArtifactLabel` for label, `ArtifactDescription` for description and toleranceDescription, `MeasuredValueUnit` for unit. Validate: `expectedValue` must be finite (`Number.isFinite()`), `tolerancePercentage` when provided must be positive and > 0, `toleranceDescription` normalized to null when `tolerancePercentage` is absent. Throw `AuthorArtifactRequirementsInvalidError` for violations. Export `MeasuredValueArtifactRequirementJson` interface. (pattern: /project:new-entity)
- [x] T005 Add `'measured_value'` case to the type discriminator switch in `ArtifactRequirements.create()` in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`. Update the raw parameter type to include `unit?: string`, `expectedValue?: number`, `tolerancePercentage?: number`, `toleranceDescription?: string | null`. Pass all type-specific fields from the input item to `MeasuredValueArtifactRequirement.create()`. Update `ArtifactRequirementJson` and `ArtifactRequirementItem` union types to include `MeasuredValueArtifactRequirementJson` and `MeasuredValueArtifactRequirement`.
- [x] T006 Export `MeasuredValueUnit`, `MeasuredValueArtifactRequirement`, and `MeasuredValueArtifactRequirementJson` from `packages/domains/authoring/src/entities/value-objects/index.ts`

**Checkpoint**: `pnpm turbo run typecheck --filter @releasepilot/domain-authoring` passes

---

## Phase 3: User Story 1 — Add Measured Value Artifact Requirement (Priority: P1) 🎯 MVP

**Goal**: Admins can add measured value artifact requirements to a spec with unit, expected value, and optional tolerance, and the data persists correctly through the create-and-view round trip.

**Independent Test**: Create a spec with a measured value artifact requirement (with and without tolerance), submit it, and verify the data round-trips correctly via the API.

### Unit Tests

- [x] T007 [P] [US1] Create unit tests for `MeasuredValueUnit` in `packages/domains/authoring/src/entities/__tests__/measured-value-unit.test.ts`. Cover: create with each of the 6 valid units (`ms`, `s`, `%`, `MB`, `GB`, `req/s`), invalid unit string rejected, empty string rejected, case sensitivity (e.g. `MS` rejected), equals (structural equality and inequality), toString returns the unit value.
- [x] T008 [P] [US1] Create unit tests for `MeasuredValueArtifactRequirement` in `packages/domains/authoring/src/entities/__tests__/measured-value-artifact-requirement.test.ts`. Cover: create with all fields (unit, expectedValue, tolerancePercentage, toleranceDescription), create without tolerance (both null), create without description (null), expectedValue of zero (valid), negative expectedValue (valid), decimal expectedValue (valid, e.g. 0.5), non-finite expectedValue NaN (rejected), non-finite expectedValue Infinity (rejected), invalid unit (rejected via MeasuredValueUnit), negative tolerancePercentage (rejected), zero tolerancePercentage (rejected), tolerancePercentage of 100+ (valid), toleranceDescription without tolerancePercentage (silently discarded to null), label boundary (200 chars accepted, 201 rejected), description boundary (1000 chars accepted, 1001 rejected), toleranceDescription boundary (1000 chars accepted, 1001 rejected), whitespace-only label (rejected), whitespace-only description (normalized to null), whitespace-only toleranceDescription (normalized to null), toJson round-trip (all fields present including nulls), equals (structural equality and inequality), toString.
- [x] T009 [P] [US1] Add measured_value type tests to `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`: single measured_value requirement, mixed types (all six: text, file, checkbox, url, measured_value, table), measured_value in a 10-item array at the limit.

### Frontend Form

- [x] T010 [US1] Create `MeasuredValueArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/MeasuredValueArtifactForm.tsx`. Export `MeasuredValueArtifactFormData` interface with fields: `type: 'measured_value'`, `label: string`, `description: string`, `required: boolean`, `unit: string` (empty string when unselected), `expectedValue: string` (string for form state, parsed to number on submit), `tolerancePercentage: string` (empty string when not set), `toleranceDescription: string` (empty string when not set). The component renders: label input with 200-char counter (FR-014), description textarea with 1000-char counter (FR-015), required toggle (defaults to false), unit dropdown with 6 options: ms, s, %, MB, GB, req/s (FR-007/FR-008), expected value number input (FR-009), tolerance percentage number input (optional) (FR-010), tolerance description textarea with 1000-char counter (conditionally shown only when tolerance percentage has a value — FR-019/FR-020/FR-021) (FR-016). Inline validation errors adjacent to fields (FR-027). Placeholders: label "e.g. Homepage API response time", description "e.g. Measure the P95 response time under normal load".
- [x] T011 [US1] Update `ArtifactRequirementsList.tsx` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`: import `MeasuredValueArtifactForm` and `MeasuredValueArtifactFormData`. Add `'measured_value'` to `ArtifactType`. Add `MeasuredValueArtifactFormData` to `ArtifactFormData` union. Add `measured_value: 'Measured Value'` to `ARTIFACT_TYPE_LABELS`. Add conditional render branch `item.type === 'measured_value' ? <MeasuredValueArtifactForm ... />` in `SortableArtifact`. Add "+ Measured Value" button in the add buttons section. Update `handleAdd` to initialize measured_value form data: `{ type: 'measured_value', label: '', description: '', required: false, unit: '', expectedValue: '', tolerancePercentage: '', toleranceDescription: '' }`. Add `hasMeasuredValueErrors()` validation helper: check unit is non-empty, expectedValue is a valid finite number when non-empty, tolerancePercentage is positive > 0 when non-empty, toleranceDescription <= 1000 chars. Wire `hasMeasuredValueErrors()` into `hasArtifactErrors()`.
- [x] T012 [US1] Update `CreateSpecForm.tsx` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`: add `measured_value` case to the artifact requirements payload mapping. Parse `expectedValue` from string to `Number()`, parse `tolerancePercentage` from string to `Number()`. Conditionally include `description` (if trimmed non-empty), `tolerancePercentage` (if non-empty), and `toleranceDescription` (if both tolerancePercentage and toleranceDescription are non-empty after trimming). Cast `unit` to the `MeasuredValueUnit` type. Cast `type` to `'measured_value' as const`.

**Checkpoint**: Admin can add a measured value artifact requirement to a spec, configure unit/expectedValue/tolerance, submit the spec, and data persists to the API. `pnpm --filter @releasepilot/domain-authoring test` passes.

---

## Phase 4: User Story 2 — Validate Measured Value Fields (Priority: P1)

**Goal**: All measured value artifact requirement validation rules are enforced on both frontend (inline errors, preventing submission) and backend (rejecting invalid payloads).

**Independent Test**: Attempt to submit a spec with invalid measured value data (empty label, missing unit, non-numeric expectedValue, negative tolerancePercentage) and verify both client-side and server-side reject the payload.

> Note: Backend (Zod schema) validation was already implemented in T001. Domain value object validation was implemented in T003-T004. Frontend inline validation was partially implemented in T010-T011. This phase covers validation edge cases and ensures frontend parity with backend.

### Implementation

- [x] T013 [US2] Verify and complete frontend inline validation in `MeasuredValueArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/MeasuredValueArtifactForm.tsx`: ensure validation covers all acceptance scenarios from US2: empty label shows error (AS-1), label > 200 chars shows error with counter (AS-2), description > 1000 chars shows error with counter (AS-3), unselected unit shows error (AS-4), empty expectedValue shows error (AS-5), non-numeric expectedValue shows error (AS-6), negative tolerancePercentage shows error (AS-7), zero tolerancePercentage shows error (AS-8). Ensure `hasMeasuredValueErrors()` in `ArtifactRequirementsList.tsx` covers all these cases to block form submission.

**Checkpoint**: All 13 acceptance scenarios from US2 pass (both client-side inline errors and server-side rejection). `pnpm --filter @releasepilot/domain-authoring test` passes.

---

## Phase 5: User Story 3 — Display on Spec Detail Page (Priority: P2)

**Goal**: Measured value artifact requirements are displayed on the spec detail page with unit, expected value, tolerance (when configured), and required/optional status.

**Independent Test**: Create a spec with measured value artifact requirements (with and without tolerance, with and without descriptions) and view the spec detail page to verify all fields display correctly.

### Implementation

- [x] T014 [US3] Update `ArtifactRequirementsDisplay.tsx` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`: add "Measured Value" type badge with rose/pink color scheme (bg: `#ffe4e6`, text: `#e11d48`). For `type === 'measured_value'` requirements, display: unit alongside expected value (e.g. "200 ms", "99.9 %", "1,000 req/s") (FR-025), tolerance percentage with +/- prefix when configured (e.g. "±10%") (FR-022), tolerance description below tolerance percentage when present (FR-022), description when present (FR-022). Hide tolerance section when `tolerancePercentage` is null (FR-024). Hide description section when `description` is null (FR-023). Show required/optional badge.

**Checkpoint**: Spec detail page shows measured value artifact requirements with correct badge, expected value with unit, tolerance info (when configured), and required/optional status. All 4 acceptance scenarios from US3 pass.

---

## Phase 6: User Story 4 — Conditional Tolerance Description (Priority: P3)

**Goal**: The tolerance description field is hidden when no tolerance percentage is entered and appears when a tolerance percentage is provided, reducing form clutter.

**Independent Test**: Toggle the tolerance percentage field between empty and populated states and verify the tolerance description field appears/disappears accordingly, with value cleared on hide.

> Note: This behavior was designed into T010 (FR-019/FR-020/FR-021). This phase is a verification/polish step to ensure the conditional UI works correctly in all edge cases.

### Implementation

- [x] T015 [US4] Verify and polish conditional tolerance description behavior in `MeasuredValueArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/MeasuredValueArtifactForm.tsx`: ensure tolerance description field is hidden when tolerance percentage is empty (AS-1), appears when tolerance percentage has a value (AS-2), and that clearing tolerance percentage also clears the tolerance description value (AS-3). Ensure the 1000-char counter on tolerance description only renders when the field is visible.

**Checkpoint**: All 3 acceptance scenarios from US4 pass. Tolerance description field toggles correctly based on tolerance percentage state.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T016 Verify all new value object methods (`MeasuredValueUnit`, `MeasuredValueArtifactRequirement`) throw `AuthorArtifactRequirementsInvalidError` with descriptive messages for each error path — no ad-hoc string errors
- [x] T017 Run full type check and build: `pnpm turbo run typecheck` and `pnpm turbo run build`
- [x] T018 Run full test suite: `pnpm --filter @releasepilot/domain-authoring test`
- [x] T019 Run quickstart.md validation: verify all 13 files listed in quickstart.md are created/modified as specified

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T002) — BLOCKS all user stories
- **US1 Core (Phase 3)**: Depends on Foundational (T003-T006) — unit tests T007-T009 can start as soon as T003-T004 complete
- **US2 Validation (Phase 4)**: Depends on Phase 3 (T010 MeasuredValueArtifactForm must exist)
- **US3 Display (Phase 5)**: Depends on Phase 2 only — can run in parallel with Phases 3-4
- **US4 Conditional UI (Phase 6)**: Depends on Phase 3 (T010 MeasuredValueArtifactForm must exist)
- **Polish (Phase 7)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Core measured value creation — can start after Foundational (Phase 2)
- **US2 (P1)**: Validation — depends on US1 form component existing (T010)
- **US3 (P2)**: Display — independent of US1-2 (only needs shared schemas + value objects from Phase 2)
- **US4 (P3)**: Conditional UI — depends on US1 form component existing (T010)

### Within Each Phase

- Unit tests (T007-T009) can run in parallel [P]
- Value objects: T003 and T004 can be created in parallel [P] (T004 imports MeasuredValueUnit from T003 — but file can be created in same pass since it's a simple import; if strict ordering needed, T003 first then T004)
- Frontend tasks (T010 → T011 → T012) are sequential within Phase 3

### Parallel Opportunities

- T003 [P] in parallel (independent file)
- T007, T008, T009 in parallel (different test files, all depend on T003-T004)
- Phase 5 (T014) can run in parallel with Phase 3-4 if needed (only depends on Phase 2)
- Phase 4 (T013) and Phase 6 (T015) are sequential (both modify MeasuredValueArtifactForm.tsx — T013 adds validation, T015 adds conditional UI on the same component)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch value object creation in parallel:
Task: "Create MeasuredValueUnit value object in packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts"
Task: "Create MeasuredValueArtifactRequirement value object in packages/domains/authoring/src/entities/value-objects/measured-value-artifact-requirement.ts"
```

## Parallel Example: Phase 3 (Unit Tests)

```bash
# Launch all unit tests in parallel:
Task: "Create unit tests for MeasuredValueUnit in packages/domains/authoring/src/entities/__tests__/measured-value-unit.test.ts"
Task: "Create unit tests for MeasuredValueArtifactRequirement in packages/domains/authoring/src/entities/__tests__/measured-value-artifact-requirement.test.ts"
Task: "Add measured_value type tests to packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2 + 3)

1. Complete Phase 1: Setup (shared schemas + types)
2. Complete Phase 2: Foundational (value objects + wiring)
3. Complete Phase 3: US1 Core (unit tests + form + integration)
4. **STOP and VALIDATE**: Create a spec with a measured value artifact requirement, submit it, verify round-trip via API
5. Deploy/demo if ready — measured value creation works end-to-end

### Incremental Delivery

1. Setup + Foundational → Schemas and domain logic ready
2. US1 Core → Measured value creation works → Test and validate (MVP!)
3. US2 Validation → Full inline + backend validation → Test edge cases
4. US3 Display → Spec detail page shows measured values → Visual verification
5. US4 Conditional UI → Tolerance description field polish → UX refinement
6. Polish → Final verification and cleanup

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Core form + tests)
   - Developer B: US3 (Display — independent, only needs Phase 2)
3. After US1:
   - Developer A: US2 (Validation) + US4 (Conditional UI)
4. Polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No new API endpoints — all changes flow through existing `POST /api/orgs/:orgSlug/specs`
- No database migration — uses existing `spec_library.artifact_requirements` JSONB column
- No new error codes — reuses `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`
- No new OTel instrumentation — measured value data flows through existing `createLibrarySpec` use case
- `MeasuredValueUnitSchema` already exists in `packages/shared/src/schemas/specs.ts` (from feature 018) — do not recreate it
- Numeric form fields (`expectedValue`, `tolerancePercentage`) use string state in React and are parsed to `Number()` at submission time
- This is the final standalone artifact type. After this feature, all 6 types from `docs/development/spec-configuration.md` are available (file, text, checkbox, url, measured_value, table)
