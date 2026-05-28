# Tasks: URL Artifact Requirement

**Input**: Design documents from `/specs/017-url-artifact-requirement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — the spec follows established testing discipline (unit tests for value objects and domain logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the URL type to shared schemas and type exports — the foundation all user stories depend on.

- [x] T001 [P] Add `UrlArtifactRequirementSchema` and `UrlArtifactRequirementResponseSchema` to `packages/shared/src/schemas/specs.ts` and register both in the `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema` discriminated unions. URL schema has `type: z.literal('url')`, `label: z.string().min(1).max(200)`, `description: z.string().max(1000).optional()`, `required: z.boolean().optional().default(false)`. Response schema adds `index: z.number()` and `description: z.string().nullable()`.
- [x] T002 [P] Export `UrlArtifactRequirement` and `UrlArtifactRequirementResponse` types from `packages/shared/src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain value object and its registration in the aggregate — MUST be complete before any user story UI work.

**No new error codes needed** — URL reuses existing `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.

**No new OTel instrumentation needed** — URL flows through already-instrumented `createLibrarySpec` use case.

- [x] T003 Create `UrlArtifactRequirement` value object in `packages/domains/authoring/src/entities/value-objects/url-artifact-requirement.ts` — follow `text-artifact-requirement.ts` pattern (includes description field, unlike checkbox). Private constructor, `create()` factory (validates label via `ArtifactLabel.create()`, description via `ArtifactDescription.create()`), `reconstitute()`, `toJson()` (returns `{ index, type: 'url', label, description, required }`), `equals()`, `toString()`. (pattern: /project:new-entity)
- [x] T004 Add `'url'` case to the type discriminator in `ArtifactRequirements.create()` in `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` — import `UrlArtifactRequirement` and call `UrlArtifactRequirement.create({ ...item, index: i })` for `type === 'url'`
- [x] T005 Export `UrlArtifactRequirement` from `packages/domains/authoring/src/entities/value-objects/index.ts` (or equivalent barrel file if one exists)

### Unit Tests

- [x] T006 [P] Create unit tests for `UrlArtifactRequirement` in `packages/domains/authoring/src/entities/__tests__/url-artifact-requirement.test.ts` — follow `text-artifact-requirement.test.ts` pattern. Test: create with valid label + description + required true, create with defaults (required=false, no description), label at 200 chars boundary, label at 201 chars throws `AUTHOR_ARTIFACT_LABEL_INVALID`, empty label throws `AUTHOR_ARTIFACT_LABEL_INVALID`, whitespace-only label throws, description at 1000 chars boundary, description at 1001 chars throws `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`, empty/whitespace description normalized to null, `toJson()` output shape (includes description key), `equals()` comparison, `toString()` output, `reconstitute()` skips validation
- [x] T007 [P] Add url-type tests to `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` — test: single url requirement creates with index 0, mixed types array (text + file + checkbox + url) creates with correct indices and types, url in 10-item array accepted, url type serializes correctly via `toJson()`

**Checkpoint**: Foundation ready — shared schemas, value object, aggregate discriminator, and unit tests all in place.

---

## Phase 3: User Story 1 — Add a URL Artifact Requirement to a Spec (Priority: P1) 🎯 MVP

**Goal**: Admin can add URL artifact requirements during spec creation. The form shows a label input, optional description textarea, and required toggle. URL type persists correctly through create-and-view round trip.

**Independent Test**: Create a spec with one or more URL artifact requirements and verify they persist correctly.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `UrlArtifactForm` component in `packages/domains/authoring/src/ui/components/UrlArtifactForm.tsx` — follow `TextArtifactForm.tsx` pattern (includes description field, unlike CheckboxArtifactForm). Label input with 200-char character counter, description textarea with 1000-char character counter, required toggle checkbox. Placeholder text: label "e.g. CI Pipeline URL", description "e.g. Provide the GitHub Actions run URL for the main branch build". Accept same props interface as `TextArtifactForm`/`FileArtifactForm` (onChange, value, errors).
- [x] T009 [US1] Wire URL type into `ArtifactRequirementsList` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` — add "URL" button alongside existing "Text", "File", and "Checkbox" buttons (disabled at max 10). Render `UrlArtifactForm` when `type === 'url'`. Update `ArtifactFormData` union type to include url (type: 'url', label: string, description: string, required: boolean). Update `hasArtifactErrors()` to validate url items (label required, max 200 chars, description max 1000 chars).
- [x] T010 [US1] Update form data mapping in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` — update the type assertion in the `artifactRequirements.map()` to include `'url'`: `type: a.type as 'text' | 'file' | 'checkbox' | 'url'`. For url type, include description in the mapped output (same behavior as text/file). Ensure sessionStorage serialization handles url form data.

**Checkpoint**: Admin can add URL artifact requirements, fill in label + description + required toggle, submit the spec, and the URL data persists correctly.

---

## Phase 4: User Story 2 — Validate URL Artifact Requirement Fields (Priority: P1)

**Goal**: Validation on both frontend (inline errors, character counters, prevent submission) and backend (Zod schema rejects invalid payloads) for URL artifact requirements.

**Independent Test**: Enter values at and beyond the label and description constraints. Verify inline errors, submission prevention, and server-side rejection.

### Implementation for User Story 2

- [x] T011 [US2] Verify frontend validation in `UrlArtifactForm.tsx` and `ArtifactRequirementsList.tsx` — label field shows inline error when empty, inline error when > 200 chars, character counter updates in real time. Description field shows inline error when > 1000 chars, character counter updates in real time. Submit button disabled when validation errors present. This should already work from T008/T009 if the validation pattern from `TextArtifactForm`/`FileArtifactForm` was followed. Manual verification and fix any gaps.
- [x] T012 [US2] Verify backend validation — the `UrlArtifactRequirementSchema` in `packages/shared/src/schemas/specs.ts` (from T001) enforces `label.min(1).max(200)` and `description.max(1000).optional()`. The `ArtifactRequirements.create()` in the domain (from T004) validates via `ArtifactLabel.create()` and `ArtifactDescription.create()`. Verify: empty label rejected, > 200 char label rejected, > 1000 char description rejected, empty/whitespace description normalized to null. No code changes expected — this is a validation pass.

**Checkpoint**: All invalid URL inputs are rejected on both client and server. Empty descriptions are normalized to null.

---

## Phase 5: User Story 3 — Display URL Artifact Requirements on Spec Detail Page (Priority: P2)

**Goal**: Spec detail page shows URL requirements with "URL" type badge, label, description (if provided), and required/optional status.

**Independent Test**: Create a spec with URL requirements (with and without descriptions), view the detail page, verify correct display.

### Implementation for User Story 3

- [x] T013 [US3] Add URL type badge to `ArtifactRequirementsDisplay` in `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` — add `'url'` case to the type badge rendering. Use amber/orange color (e.g. `bg-amber-100 text-amber-800` / hex `#fef3c7`, `#92400e`) to differentiate from indigo (Text), blue (File), and green (Checkbox). Display label, description (if present, hide section when null), and required/optional badge.

**Checkpoint**: Spec detail page correctly displays URL artifact requirements with distinct visual indicator and optional description.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories.

- [x] T014 Run `pnpm turbo run typecheck` to verify no type errors across the monorepo
- [x] T015 Run `pnpm --filter @nohotfix/domain-authoring test` to verify all unit tests pass (existing + new)
- [x] T016 Run `pnpm turbo run build` to verify full build succeeds
- [x] T017 Verify no ad-hoc string errors — all error paths use existing domain error codes from `packages/shared/src/errors/codes.ts`
- [x] T018 Verify URL data round-trip: create spec with URL requirements (with and without descriptions) via UI, view on detail page, confirm correct persistence and display

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
- T008 (UrlArtifactForm) can run in parallel with T006/T007 (different files)
- US3 (Phase 5) can run in parallel with US1 (Phase 3) after Phase 2 completes

---

## Parallel Example: Phase 2

```bash
# After T003 + T004 complete, launch tests in parallel:
Task: T006 "Unit tests for UrlArtifactRequirement value object"
Task: T007 "URL tests for ArtifactRequirements aggregate"
```

## Parallel Example: After Phase 2

```bash
# US1 and US3 can start simultaneously:
Task: T008 [US1] "Create UrlArtifactForm component"
Task: T013 [US3] "Add URL type badge to ArtifactRequirementsDisplay"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T007)
3. Complete Phase 3: User Story 1 (T008–T010)
4. **STOP and VALIDATE**: Create a spec with URL requirements, verify persistence
5. Proceed to Phase 4 (US2 validation) and Phase 5 (US3 display)

### Incremental Delivery

1. Setup + Foundational → Schemas, value objects, tests
2. User Story 1 → Admin can add URLs to specs (MVP!)
3. User Story 2 → Validation verified on both sides
4. User Story 3 → Detail page displays URLs
5. Polish → Full build, typecheck, round-trip verification

---

## Notes

- This follows the exact pattern of feature 016 (checkbox) but with the text artifact's structure (includes description field)
- No database migration required
- No new API endpoints
- No new error codes
- No new OTel instrumentation
- Pattern source: `text-artifact-requirement.ts` (value object), `TextArtifactForm.tsx` (form), `FileArtifactForm.tsx` (form)
- Key difference from checkbox: includes optional description field (label + description + required, same as text/file)
- Badge color: amber/orange (distinct from indigo=Text, blue=File, green=Checkbox)
