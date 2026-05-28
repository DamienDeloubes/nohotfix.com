# Tasks: Table Artifact Requirement

**Input**: Design documents from `/specs/018-table-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — unit tests are part of the established artifact requirement pattern and are required by the constitution (Principle III).

**Organization**: Tasks are grouped by user story. US1-US4 (all P1) are tightly coupled — they compose the core table creation flow. US5 (P2) is the display story and is independently implementable after US1-US4.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Schemas)

**Purpose**: Add table-related Zod schemas and type exports to `packages/shared`. These are foundational — all domain value objects and UI components depend on them.

- [x] T001 Add `MeasuredValueUnitSchema`, `TableColumnDefSchema`, `CellValueSchema`, `TableArtifactRequirementSchema`, and their response counterparts (`TableColumnDefResponseSchema`, `TableArtifactRequirementResponseSchema`) to `packages/shared/src/schemas/specs.ts`. Add `TableArtifactRequirementSchema` and `TableArtifactRequirementResponseSchema` to both `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema` discriminated unions.
- [x] T002 Export `TableArtifactRequirement`, `TableColumnDef`, `MeasuredValueUnit`, and `CellValue` types from `packages/shared/src/types/index.ts`

**Checkpoint**: `pnpm turbo run typecheck --filter @releasepilot/shared` passes

---

## Phase 2: Foundational (Domain Value Objects)

**Purpose**: Create domain value objects in `packages/domains/authoring/` and wire the `'table'` case into the existing discriminated union factory. All UI and test tasks depend on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `TableColumnDef` value object in `packages/domains/authoring/src/entities/value-objects/table-column-def.ts` with `create()`, `reconstitute()`, `toJson()`, `equals()`. Validate: name (trimmed, 1-100 chars), type (text/number/boolean/measured_value), readOnly (only text/number, default false, stripped for boolean/measured_value), unit (required for measured_value, one of 6 valid values, stripped for other types), tolerancePercentage (only measured_value, positive, stripped for other types). Throw `AuthorArtifactRequirementsInvalidError` for violations. (pattern: /project:new-entity)
- [x] T004 Create `TableArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/table-artifact-requirement.ts` with `create()`, `reconstitute()`, `toJson()`, `equals()`, `toString()`. Use `ArtifactLabel` and `ArtifactDescription` for label/description. Use `TableColumnDef.create()` for column validation. Validate: columns (1-5), rows (1-50), each row length === column count, cell-column consistency (read-only text → non-empty string, read-only number → number, fillable text/number → null, boolean → null, measured_value → `{ expectedValue: number, measuredValue: null }`). Throw `AuthorArtifactRequirementsInvalidError` for structural violations. (pattern: /project:new-entity)
- [x] T005 Add `'table'` case to the type discriminator switch in `ArtifactRequirements.create()` in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`. Pass `columns` and `rows` from the input item to `TableArtifactRequirement.create()`.
- [x] T006 Export `TableColumnDef` and `TableArtifactRequirement` from `packages/domains/authoring/src/entities/value-objects/index.ts` (or the domain package's public entry point)

**Checkpoint**: `pnpm turbo run typecheck --filter @releasepilot/domain-authoring` passes

---

## Phase 3: User Stories 1-3 — Core Table Creation (Priority: P1) 🎯 MVP

**Goal**: Admins can add table artifact requirements to a spec with column definitions and row data, and the data persists correctly through the create-and-view round trip.

**Independent Test**: Create a spec with a table artifact requirement using all four column types, submit it, and verify the table data round-trips correctly via the API.

> Note: US1 (add table), US2 (manage columns), and US3 (manage rows) are combined into a single phase because they are inseparable in the UI — the `TableArtifactForm.tsx` component implements all three stories as a single inline form.

### Unit Tests

- [x] T007 [P] [US1] Create unit tests for `TableColumnDef` in `packages/domains/authoring/src/entities/__tests__/table-column-def.test.ts`. Cover: create with each of the 4 column types, readOnly validation (accepted for text/number, stripped for boolean/measured_value), unit validation (required for measured_value, rejected for other types, invalid unit rejected), tolerancePercentage (accepted for measured_value only, must be positive), name boundaries (1 char, 100 chars accepted, empty rejected, 101 chars rejected, whitespace-only rejected), toJson round-trip, equals (structural equality and inequality).
- [x] T008 [P] [US1] Create unit tests for `TableArtifactRequirement` in `packages/domains/authoring/src/entities/__tests__/table-artifact-requirement.test.ts`. Cover: create with valid columns and rows, cell-column consistency (read-only text with non-empty string, read-only text with null rejected, read-only number with number, fillable text/number with null, boolean with null, measured_value with `{ expectedValue, measuredValue: null }`, measured_value with missing expectedValue rejected), boundary tests (1 column/1 row minimum, 5 columns/50 rows maximum, 0 columns rejected, 6 columns rejected, 0 rows rejected, 51 rows rejected), row cell count mismatch rejection, label/description via ArtifactLabel/ArtifactDescription, toJson round-trip, equals, toString.
- [x] T009 [P] [US1] Add table-type tests to `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`: single table requirement, mixed types (all five: text, file, checkbox, url, table), table in a 10-item array at the limit.

### Frontend Form

- [x] T010 [US1] Create `TableArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/TableArtifactForm.tsx`. Export `TableArtifactFormData` interface with fields: `type: 'table'`, `label: string`, `description: string`, `required: boolean`, `columns: TableColumnFormData[]`, `rows: CellValue[][]`. The component renders: label input with 200-char counter (FR-007), description textarea with 1000-char counter (FR-008), required toggle (defaults to false), column management section (add/remove/reorder columns, max 5, type-specific config per column), and row management section (add/remove/reorder rows, max 50, cell inputs matching column types). Column config: name input, type selector (text/number/boolean/measured_value), readOnly toggle for text/number only (FR-012/FR-013), unit selector for measured_value (FR-014), tolerance input for measured_value (FR-015). Row cells: text input for read-only text, number input for read-only number, expected value input for measured_value, disabled/placeholder for fillable and boolean cells. Inline validation errors (FR-039).
- [x] T011 [US1] Update `ArtifactRequirementsList.tsx` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`: add `'table'` to `ArtifactType`, add `TableArtifactFormData` to `ArtifactFormData` union, add `table: 'Table'` to `ARTIFACT_TYPE_LABELS`, add conditional render branch `item.type === 'table' ? <TableArtifactForm ... />`, add "+ Table" button in the add buttons section, update `handleAdd` to initialize table form data with empty columns/rows arrays.
- [x] T012 [US1] Update `CreateSpecForm.tsx` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`: update type assertion to include `'table'` in the artifact requirements mapping, add conditional logic to include `columns` and `rows` in the payload for table type requirements.

**Checkpoint**: Admin can add a table artifact requirement to a spec, configure columns (all 4 types) and rows, submit the spec, and data persists to the API. `pnpm --filter @releasepilot/domain-authoring test` passes.

---

## Phase 4: User Story 4 — Validation (Priority: P1)

**Goal**: All table artifact requirement validation rules are enforced on both frontend (inline errors, preventing submission) and backend (rejecting invalid payloads).

**Independent Test**: Attempt to submit a spec with invalid table data (empty label, no columns, no rows, cell-column mismatches) and verify both client-side and server-side reject the payload.

> Note: Backend (Zod schema) validation was already implemented in T001. Domain value object validation was implemented in T003-T004. This phase covers frontend inline validation wiring.

### Implementation

- [x] T013 [US4] Add frontend inline validation to `TableArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/TableArtifactForm.tsx`: validate label required and max 200 chars (FR-002), description max 1000 chars (FR-004), at least 1 column required (FR-009), at least 1 row required (FR-019), column name required (FR-010), unit required for measured_value columns (FR-014), read-only text cells non-empty (FR-021), read-only number cells must have a value (FR-023), measured_value cells must have expectedValue (FR-026). Show inline error messages adjacent to the relevant field (FR-039). Prevent form submission when validation errors exist (FR-038).
- [x] T014 [US4] Add column type change handler to `TableArtifactForm.tsx` in `packages/domains/authoring/src/ui/components/TableArtifactForm.tsx`: when an Admin changes a column's type, reset existing cell data for that column in all rows to the appropriate default for the new type (null for fillable, empty string for read-only text, null for read-only number). Handle readOnly toggle removal when switching to boolean or measured_value.

**Checkpoint**: All acceptance scenarios from US4 pass (empty label, >200 chars, >1000 desc, no columns, no rows, empty column name, missing unit, empty read-only cell, missing expectedValue). Backend also rejects via Zod + domain validation.

---

## Phase 5: User Story 5 — Display (Priority: P2)

**Goal**: Table artifact requirements are displayed on the spec detail page with a read-only table preview showing column headers and row data.

**Independent Test**: Create a spec with table artifact requirements using various column type combinations and view the spec detail page to verify the table structure displays correctly.

### Implementation

- [x] T015 [US5] Update `ArtifactRequirementsDisplay.tsx` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`: add "Table" type badge with purple/violet color scheme (bg: `#f3e8ff`, text: `#7c3aed`) to the type badge conditional (FR-031). Add table preview rendering for `type === 'table'`: render a read-only HTML table with column headers showing column name, type indicator, and unit for measured_value columns (FR-034). Render row data: read-only cells show author-set values with normal text styling, fillable cells (text/number) show as greyed-out empty placeholders visually distinct from read-only cells (FR-035), measured_value cells show "expected: {value} {unit}" with measured portion empty (FR-036), boolean cells show unchecked indicator icons (FR-037). Hide description section when description is null (FR-033).

**Checkpoint**: Spec detail page shows table artifact requirements with correct badge, table preview with all cell types rendered appropriately. All 7 acceptance scenarios from US5 pass.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T016 Verify all new value object methods (`TableColumnDef`, `TableArtifactRequirement`) throw `AuthorArtifactRequirementsInvalidError` with descriptive messages for each error path — no ad-hoc string errors
- [x] T017 Run full type check and build: `pnpm turbo run typecheck` and `pnpm turbo run build`
- [x] T018 Run full test suite: `pnpm --filter @releasepilot/domain-authoring test`
- [x] T019 Run quickstart.md validation: verify all 13 files listed in quickstart.md are created/modified as specified

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T002) — BLOCKS all user stories
- **US1-3 Core (Phase 3)**: Depends on Foundational (T003-T006) — unit tests T007-T009 can start as soon as T003-T004 complete
- **US4 Validation (Phase 4)**: Depends on Phase 3 (T010 TableArtifactForm must exist)
- **US5 Display (Phase 5)**: Depends on Phase 2 only — can run in parallel with Phases 3-4
- **Polish (Phase 6)**: Depends on all phases complete

### User Story Dependencies

- **US1-3 (P1)**: Core table creation — tightly coupled, implemented together in Phase 3
- **US4 (P1)**: Validation — depends on US1-3 form component existing
- **US5 (P2)**: Display — independent of US1-4 (only needs shared schemas + value objects from Phase 2)

### Within Each Phase

- Unit tests (T007-T009) can run in parallel [P]
- Value objects: T003 first, then T004 (T004 depends on T003)
- Frontend tasks (T010 → T011 → T012) are sequential within Phase 3

### Parallel Opportunities

- T003 then T004 sequentially (T004 imports TableColumnDef from T003)
- T007, T008, T009 in parallel (different test files, all depend on T003-T004)
- Phase 5 (T015) can run in parallel with Phase 3-4 if needed (only depends on Phase 2)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch value object creation in parallel:
Task: "Create TableColumnDef value object in packages/domains/authoring/src/entities/value-objects/table-column-def.ts"
Task: "Create TableArtifactRequirement value object in packages/domains/authoring/src/entities/value-objects/table-artifact-requirement.ts"
```

## Parallel Example: Phase 3 (Unit Tests)

```bash
# Launch all unit tests in parallel:
Task: "Create unit tests for TableColumnDef in packages/domains/authoring/src/entities/__tests__/table-column-def.test.ts"
Task: "Create unit tests for TableArtifactRequirement in packages/domains/authoring/src/entities/__tests__/table-artifact-requirement.test.ts"
Task: "Add table-type tests to packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2 + 3)

1. Complete Phase 1: Setup (shared schemas + types)
2. Complete Phase 2: Foundational (value objects + wiring)
3. Complete Phase 3: US1-3 Core (unit tests + form + integration)
4. **STOP and VALIDATE**: Create a spec with a table artifact requirement, submit it, verify round-trip via API
5. Deploy/demo if ready — table creation works end-to-end

### Incremental Delivery

1. Setup + Foundational → Schemas and domain logic ready
2. US1-3 Core → Table creation works → Test and validate (MVP!)
3. US4 Validation → Full inline + backend validation → Test edge cases
4. US5 Display → Table preview on spec detail page → Full feature complete
5. Polish → Final verification and cleanup

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1-3 are combined because the TableArtifactForm.tsx component implements all three stories as a single cohesive form
- No new API endpoints — all changes flow through existing `POST /api/orgs/:orgSlug/specs`
- No database migration — uses existing `spec_library.artifact_requirements` JSONB column
- No new error codes — reuses `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`
- No new OTel instrumentation — table data flows through existing `createLibrarySpec` use case
