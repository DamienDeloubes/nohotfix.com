# Tasks: Spec Field Validations

**Input**: Design documents from `/specs/012-spec-field-validations/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Unit tests included per constitution Mandatory Per-Feature Deliverables (error-path coverage).

**Organization**: Tasks grouped by user story. US1+US2 are both P1, US3+US4 are both P2.

**Total tasks**: 43

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Utilities)

**Purpose**: Create shared utilities and register error codes in `packages/shared/` — consumed by all subsequent phases.

- [x] T001 [P] Create `extractPlainTextLength(doc: unknown): number` utility in `packages/shared/src/lib/tiptap-text.ts` — walks TipTap JSON document tree, concatenates `.text` properties from text nodes, returns total character count. Handle null/undefined input (return 0). Export from `packages/shared/src/index.ts`.
- [x] T002 [P] Create `toKebabCase(raw: string): string` utility in `packages/shared/src/lib/kebab-case.ts` — lowercase, replace spaces/underscores with hyphens, strip non-alphanumeric chars (except hyphens), collapse consecutive hyphens, trim leading/trailing hyphens. Export from `packages/shared/src/index.ts`.
- [x] T002a [P] Unit tests for `extractPlainTextLength` in `packages/shared/src/lib/__tests__/tiptap-text.test.ts` — test empty/null input (returns 0), simple text node, nested nodes with formatting, document with no text nodes.
- [x] T002b [P] Unit tests for `toKebabCase` in `packages/shared/src/lib/__tests__/kebab-case.test.ts` — test spaces, underscores, mixed case, special characters stripped, consecutive hyphens collapsed, leading/trailing hyphens trimmed, empty string.
- [x] T003 [P] Register 5 new error codes in `packages/shared/src/errors/codes.ts`: `AUTHOR_SPEC_TITLE_INVALID`, `AUTHOR_SPEC_STEP_INVALID`, `AUTHOR_SPEC_DURATION_INVALID`, `AUTHOR_SPEC_TAGS_INVALID`, `AUTHOR_SPEC_FIELD_TOO_LONG`.
- [x] T004 [P] Update Zod schemas in `packages/shared/src/schemas/specs.ts`: change `title` max from 500 to 200; add `.max(500)` to `TestStepSchema.instruction` and `.max(500)` to `TestStepSchema.expectedOutcome`; add `.max(2000)` to `testerNotes`; add `estimatedDurationMinutes: z.number().int().min(1).max(999).optional()` and `tags: z.array(z.string().max(30)).max(10).optional()` to `CreateLibrarySpecRequestSchema`; add `estimatedDurationMinutes` (nullable) and `tags` (default `[]`) to `LibrarySpecSchema`. Update `UpdateLibrarySpecRequestSchema` to match.

**Checkpoint**: Shared package ready — all utilities, error codes, and schemas available for domain and API layers.

---

## Phase 2: Foundational (DB + Domain Errors)

**Purpose**: Database migration and domain error classes — MUST complete before user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 [P] Create migration `003_spec_estimated_duration_and_tags.ts` in `packages/db/src/migrations/`: add `estimated_duration_minutes INTEGER` (nullable, CHECK 1–999) and `tags JSONB` (nullable, DEFAULT `'[]'::jsonb`) columns to `spec_library` table. Include both `up()` and `down()` functions. (pattern: /project:migrate)
- [x] T006 [P] Update `SpecLibraryTable` interface in `packages/db/src/schema.ts`: add `estimated_duration_minutes: number | null` and `tags: ColumnType<string[], string[] | undefined, string[]>`. Update `Selectable`/`Insertable`/`Updateable` aliases if they exist. Re-export from `packages/db/src/index.ts`.
- [x] T007 Create 5 domain error classes in `packages/domains/authoring/src/errors/index.ts`: `AuthorSpecTitleInvalidError` (400), `AuthorSpecStepInvalidError` (400), `AuthorSpecDurationInvalidError` (400), `AuthorSpecTagsInvalidError` (400), `AuthorSpecFieldTooLongError` (400, accepts `details: { field: string, maxLength: number }`). Each extends `DomainError` from `@releasepilot/shared`. Export from domain package barrel.

**Checkpoint**: Foundation ready — migration, schema types, and error classes available. User story implementation can begin.

---

## Phase 3: User Story 1 — Text Field Validation Enforcement (Priority: P1) 🎯 MVP

**Goal**: Title validated at 1–200 chars (trimmed). Rich text fields validated against plain-text character limits (preconditions: 5,000, description: 10,000, expected result: 5,000). Tester notes validated at max 2,000 chars (trimmed). Character counters visible. Inline errors shown. Backend rejects invalid payloads.

**Independent Test**: Enter values at and beyond each field's character limit. Verify inline errors appear, form cannot submit, and API independently rejects oversized payloads.

### Implementation for User Story 1

- [x] T008 [P] [US1] Modify `SpecTitle` value object in `packages/domains/authoring/src/entities/value-objects/spec-title.ts`: change max length from 500 to 200. Replace generic `Error` throws with `AuthorSpecTitleInvalidError` from `../errors/index.js`. Keep trim + min 1 validation.
- [x] T008a [US1] Unit tests for updated `SpecTitle` VO in `packages/domains/authoring/src/entities/value-objects/__tests__/spec-title.test.ts` — test valid title (1–200 chars), empty string throws `AuthorSpecTitleInvalidError`, whitespace-only throws, 201 chars throws, boundary values (1 char, 200 chars). Assert error code is `AUTHOR_SPEC_TITLE_INVALID`.
- [x] T009 [US1] Update `SpecLibraryEntryEntity.create()` in `packages/domains/authoring/src/entities/spec-library-entry.ts`: after rich text normalisation, validate character limits using `extractPlainTextLength()` from `@releasepilot/shared` — preconditions max 5,000, description max 10,000, expected result max 5,000. Throw `AuthorSpecFieldTooLongError` with `{ field, maxLength }` details. Add tester notes trimming (whitespace-only → null) and max 2,000 char validation.
- [x] T009a [US1] Unit tests for rich text + tester notes validation in `packages/domains/authoring/src/entities/__tests__/spec-library-entry.test.ts` — test preconditions at 5,001 chars throws `AuthorSpecFieldTooLongError` with `details.field === 'preconditions'`, description at 10,001, expectedResult at 5,001, testerNotes at 2,001. Assert boundary values (at limit passes, over limit throws). Test whitespace-only tester notes normalised to null.
- [x] T010 [US1] Update `CreateSpecForm.tsx` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`: add visible character counter to title field (X/200). Add plain-text character counters to each `RichTextEditor` (preconditions X/5000, description X/10000, expectedResult X/5000) using `extractPlainTextLength()` from `@releasepilot/shared`. Add character counter to tester notes textarea (X/2000). Show inline validation error messages adjacent to each field when limits are exceeded. Disable submit button when any validation error is present.

**Checkpoint**: All existing text fields have character limits enforced on both frontend and backend. US1 is independently testable.

---

## Phase 4: User Story 2 — Test Steps Validation (Priority: P1)

**Goal**: Test step instruction validated at max 500 chars. Expected outcome validated at max 500 chars when provided. Instruction is required (non-empty after trim). Expected outcome remains optional. Max 50 steps enforced (already implemented — verify).

**Independent Test**: Add test steps with instructions/outcomes at and beyond 500 chars. Verify inline errors and API rejection.

### Implementation for User Story 2

- [x] T011 [US2] Modify `TestStep` value object in `packages/domains/authoring/src/entities/value-objects/test-step.ts`: add max 500 chars validation on `instruction` (after trim). Add max 500 chars validation on `expectedOutcome` when provided (after trim). Replace generic `Error` throw with `AuthorSpecStepInvalidError`. Include detail about which field and the limit.
- [x] T011a [US2] Unit tests for updated `TestStep` VO in `packages/domains/authoring/src/entities/value-objects/__tests__/test-step.test.ts` — test valid instruction (1–500 chars), empty instruction throws `AuthorSpecStepInvalidError`, instruction at 501 chars throws, optional expectedOutcome omitted passes, expectedOutcome at 501 chars throws. Assert error code is `AUTHOR_SPEC_STEP_INVALID`.
- [x] T012 [US2] Update `CreateSpecForm.tsx` test step section in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` (or `TestStepList.tsx` if separate component): add character counters to instruction field (X/500) and expectedOutcome field (X/500). Show inline validation errors when limits are exceeded.

**Checkpoint**: Test step fields have character limits. US1 + US2 together form the complete P1 MVP — all existing fields are validated.

---

## Phase 5: User Story 3 — Estimated Duration (Priority: P2)

**Goal**: New optional field `estimatedDurationMinutes` (integer 1–999) on the spec form. Value persists and displays on the spec detail page. Backend rejects invalid values.

**Independent Test**: Create specs with duration values (30, boundary values 1 and 999, invalid values 0 and 1000, non-integers 2.5). Verify persistence, display, and rejection.

### Implementation for User Story 3

- [x] T013 [US3] Create `EstimatedDuration` value object in `packages/domains/authoring/src/entities/value-objects/estimated-duration.ts`: private constructor, static `create(raw: number)` validates integer + range 1–999, throws `AuthorSpecDurationInvalidError`. Add `equals()` and `toString()`. Export from value-objects barrel `index.ts`. (pattern: /project:new-entity)
- [x] T013a [US3] Unit tests for `EstimatedDuration` VO in `packages/domains/authoring/src/entities/value-objects/__tests__/estimated-duration.test.ts` — test valid values (1, 500, 999), zero throws `AuthorSpecDurationInvalidError`, 1000 throws, negative throws, non-integer (2.5) throws. Assert error code is `AUTHOR_SPEC_DURATION_INVALID`.
- [x] T014 [US3] Update `SpecLibraryEntryEntity` in `packages/domains/authoring/src/entities/spec-library-entry.ts`: add `estimatedDurationMinutes: EstimatedDuration | null` to props. Update `create()` to accept optional `estimatedDurationMinutes` param and construct VO (or null). Update `reconstitute()` to accept pre-validated value. Add getter.
- [x] T015 [US3] Update `createLibrarySpec` use case in `packages/domains/authoring/src/use-cases/create-library-spec.ts`: add `estimatedDurationMinutes?: number` to `CreateLibrarySpecCommand`. Pass to entity `create()`. Include in returned DTO mapping.
- [x] T016 [US3] Update `SpecLibraryRepository` port interface in `packages/domains/authoring/src/ports/spec-library-repository.ts`: add `estimatedDurationMinutes` to create/update param types and return type.
- [x] T017 [US3] Update `KyselySpecLibraryRepository` in `apps/api/src/adapters/repositories/kysely-spec-library-repository.ts`: include `estimated_duration_minutes` in INSERT values and SELECT mapping. Map snake_case DB column to camelCase domain field.
- [x] T018 [US3] Update POST `/api/orgs/:orgSlug/specs` route handler in `apps/api/src/routes/authoring.ts`: pass `estimatedDurationMinutes` from parsed body to use case command. Update GET `/api/orgs/:orgSlug/specs/:specId` response to include `estimatedDurationMinutes`.
- [x] T019 [US3] Update `CreateSpecForm.tsx` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`: add estimated duration number input field with label "Estimated duration (minutes)". Validate client-side: integer only, 1–999 range. Show inline error for invalid values. Include in form submission payload. Persist in session storage.
- [x] T020 [US3] Update `SpecDetail.tsx` in `packages/domains/authoring/src/ui/components/SpecDetail.tsx`: display estimated duration when set (e.g., "30 min"). Hide when null.

**Checkpoint**: Estimated duration fully implemented end-to-end. US3 is independently testable.

---

## Phase 6: User Story 4 — Tags Implementation and Validation (Priority: P2)

**Goal**: New optional tags field with combobox (kebab-case auto-transform, max 10 tags, each max 30 chars, deduplication, suggestions from existing specs). Backend rejects invalid tags. Tags display on spec detail.

**Independent Test**: Add tags with mixed casing (verify transform), duplicates (verify dedup), exceed 10 tags or 30 chars (verify rejection). Verify suggestions appear from existing specs.

### Implementation for User Story 4

- [x] T021 [P] [US4] Create `SpecTag` value object in `packages/domains/authoring/src/entities/value-objects/spec-tag.ts`: private constructor, static `create(raw: string)` applies `toKebabCase()` from `@releasepilot/shared`, validates 1–30 chars after transform, throws `AuthorSpecTagsInvalidError` if empty or too long. Add `equals()` and `toString()`. (pattern: /project:new-entity)
- [x] T022 [P] [US4] Create `SpecTags` collection value object in `packages/domains/authoring/src/entities/value-objects/spec-tags.ts`: private constructor, static `create(raw: string[])` creates `SpecTag` for each, deduplicates by value, validates max 10 unique tags, throws `AuthorSpecTagsInvalidError` if exceeded. Exposes `toArray(): string[]`. Export both from value-objects barrel `index.ts`. (pattern: /project:new-entity)
- [x] T022a [US4] Unit tests for `SpecTag` and `SpecTags` VOs in `packages/domains/authoring/src/entities/value-objects/__tests__/spec-tags.test.ts` — test kebab-case transform ("Smoke Test" → "smoke-test"), empty tag after transform throws `AuthorSpecTagsInvalidError`, tag > 30 chars throws, 11 tags throws, duplicate tags deduplicated (10 unique from 12 with duplicates passes). Assert error code is `AUTHOR_SPEC_TAGS_INVALID`.
- [x] T023 [US4] Update `SpecLibraryEntryEntity` in `packages/domains/authoring/src/entities/spec-library-entry.ts`: add `tags: SpecTags` to props. Update `create()` to accept optional `tags?: string[]` and construct VO (default empty). Update `reconstitute()`. Add getter.
- [x] T024 [US4] Update `createLibrarySpec` use case in `packages/domains/authoring/src/use-cases/create-library-spec.ts`: add `tags?: string[]` to `CreateLibrarySpecCommand`. Pass to entity. Include in DTO mapping (use `tags.toArray()`).
- [x] T025 [US4] Update `SpecLibraryRepository` port + `KyselySpecLibraryRepository` adapter: add `tags` to create/update params and return mapping. Store as JSONB array, read back as `string[]`.
- [x] T026 [US4] Add `GET /api/orgs/:orgSlug/specs/tags` endpoint in `apps/api/src/routes/authoring.ts`: query distinct tag values across all specs in the org using `jsonb_array_elements_text(tags)`, return alphabetically sorted `{ tags: string[] }`. Apply `orgScopeMiddleware`. (pattern: /project:new-route)
- [x] T027 [US4] Add `specKeys.tags(orgSlug)` query key factory in `apps/app/src/api/query-keys.ts` for the tags suggestions endpoint.
- [x] T028 [P] [US4] Create `TagsCombobox.tsx` component in `packages/domains/authoring/src/ui/components/TagsCombobox.tsx`: multi-select combobox accepting `suggestions: string[]`, `value: string[]`, `onChange`, `maxTags: number`. Auto-transforms input to kebab-case on confirm. Shows tag pills with remove button. Disables input when max reached. Shows error for individual tags exceeding 30 chars.
- [x] T029 [P] [US4] Create `useTagsSuggestions` hook in `packages/domains/authoring/src/ui/hooks/use-tags-suggestions.ts`: accepts `apiUrl`, `getAccessToken`, `orgSlug`, `queryKey`. Fetches GET `/api/orgs/:orgSlug/specs/tags`. Returns `{ tags: string[], isLoading }`.
- [x] T030 [US4] Update `CreateSpecForm.tsx` in `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`: integrate `TagsCombobox` with `useTagsSuggestions`. Pass tag suggestions. Include tags in form submission payload. Persist in session storage.
- [x] T031 [US4] Update `SpecDetail.tsx` in `packages/domains/authoring/src/ui/components/SpecDetail.tsx`: display tags as pill/badge elements. Show empty state when no tags.

**Checkpoint**: Tags fully implemented end-to-end. US4 is independently testable. All four user stories now complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, consistency, and cleanup across all stories.

- [x] T031a Verify 50-step limit UI enforcement (FR-017) from 011-create-spec still works: "Add step" control is disabled at 50 steps with a visible message. If missing, implement in `CreateSpecForm.tsx` test step section.
- [x] T032 Verify all new error paths in value objects use domain-specific error codes from `packages/shared/src/errors/codes.ts` — no generic `Error` or ad-hoc string errors remain in `packages/domains/authoring/src/entities/value-objects/`.
- [x] T033 Verify value-objects barrel export in `packages/domains/authoring/src/entities/value-objects/index.ts` re-exports `EstimatedDuration`, `SpecTag`, `SpecTags` alongside existing `SpecTitle`, `Severity`, `TestStep`.
- [x] T034 Verify domain package barrel export in `packages/domains/authoring/src/index.ts` re-exports new error classes and value objects.
- [x] T035 Run full build pipeline: `pnpm turbo run build typecheck test` — all packages must pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. All T001–T004 are parallel.
- **Foundational (Phase 2)**: Depends on Phase 1 (error codes + Zod schemas must exist). T005+T006 are parallel [P]. T007 depends on T003.
- **US1 (Phase 3)**: Depends on Phase 2 complete. Sequential within phase (VO → entity → form).
- **US2 (Phase 4)**: Depends on Phase 2. Can run in parallel with US1 at the VO/entity level (T011 is a different file from T008). **However**, T012 modifies `CreateSpecForm.tsx` which is also modified by T010 — run T010 before T012 or merge into one task.
- **US3 (Phase 5)**: Depends on Phase 2 (migration + schema). Independent from US1/US2 at backend level. T019 modifies `CreateSpecForm.tsx` — run after T010/T012.
- **US4 (Phase 6)**: Depends on Phase 2. T021+T022 can run parallel with US3 VOs. T028+T029 are parallel (different files). T030 modifies `CreateSpecForm.tsx` — run last.
- **Polish (Phase 7)**: Depends on all user stories complete.

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on other stories
- **US2 (P1)**: After Foundational — shares `CreateSpecForm.tsx` with US1 (sequence T010 → T012)
- **US3 (P2)**: After Foundational — independent of US1/US2 at backend. Form task (T019) after US2 form task (T012)
- **US4 (P2)**: After Foundational — independent of US1/US2/US3 at backend. Form task (T030) after US3 form task (T019)

### CreateSpecForm.tsx Modification Order

This file is modified by 4 user stories. Execute form tasks in this order to avoid conflicts:

1. T010 (US1) — character counters for text fields
2. T012 (US2) — character counters for test step fields
3. T019 (US3) — estimated duration field
4. T030 (US4) — tags field integration

### Parallel Opportunities

```
Phase 1 (utilities + schemas parallel, then tests):
  T001 | T002 | T003 | T004
  then: T002a (after T001) | T002b (after T002)

Phase 2 (T005+T006 parallel, then T007):
  T005 | T006 → T007

US1 + US2 backend (parallel):
  T008 (SpecTitle VO) + T008a (tests) | T011 (TestStep VO) + T011a (tests)

US3 + US4 VOs (parallel):
  T013 (EstimatedDuration) | T021 + T022 (SpecTag + SpecTags)

US4 UI components (parallel):
  T028 (TagsCombobox) | T029 (useTagsSuggestions)
```

---

## Implementation Strategy

### MVP First (US1 + US2 — Both P1)

1. Complete Phase 1: Setup (shared utilities + error codes + Zod)
2. Complete Phase 2: Foundational (migration + schema + domain errors)
3. Complete Phase 3: US1 — text field validation
4. Complete Phase 4: US2 — test step validation
5. **STOP and VALIDATE**: All existing fields now have proper validation. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Character limits on all text fields → Test independently
3. US2 → Character limits on test steps → Test independently
4. US3 → Estimated duration field → Test independently
5. US4 → Tags field → Test independently
6. Polish → Final verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- `CreateSpecForm.tsx` is a shared bottleneck — form tasks must be sequenced (T010 → T012 → T019 → T030)
- The Zod schema update (T004) covers ALL stories at once since it's a single schema object
- The migration (T005) covers both US3 and US4 new fields since they're on the same table
- No OTel tasks needed — validation is synchronous in entity layer, existing route spans cover the flow (Constitution VII: ☑)
