# Research: Spec Field Validations

**Feature**: 012-spec-field-validations
**Date**: 2026-03-10

## R1: Current Validation Architecture

**Decision**: Extend the existing two-layer validation pattern (Zod at API boundary + value objects in domain layer).

**Rationale**: The 011-create-spec feature established a clean pattern: Zod schemas in `packages/shared/src/schemas/specs.ts` validate structural constraints (types, min/max), while value objects in `packages/domains/authoring/src/entities/value-objects/` enforce domain rules. This feature adds constraints within the same layers — no new patterns needed.

**Alternatives considered**:

- Single-layer validation (Zod only): Rejected — violates hexagonal architecture by putting domain rules at the API boundary.
- Form-level validation only: Rejected — backend must independently enforce all rules (FR-028).

## R2: Database Migration for New Fields

**Decision**: Add a new migration `003_spec_estimated_duration_and_tags.ts` to add `estimated_duration_minutes` (INTEGER, nullable) and `tags` (JSONB, nullable, default `'[]'`) columns to `spec_library`.

**Rationale**: Neither column exists in the current schema. `estimated_duration_minutes` maps naturally to an INTEGER column. Tags as a JSONB array avoids a junction table for a simple string list with max 10 items, consistent with the project's existing JSONB patterns (test_steps, artifact_requirements).

**Alternatives considered**:

- Separate `spec_tags` junction table: Rejected — over-engineering for max 10 tags per spec. JSONB array is sufficient and simpler to query with `@>` operator. Tag suggestions can be extracted with `jsonb_array_elements_text()`.
- Tags as TEXT[] (PostgreSQL array): Rejected — JSONB is the established pattern in this project and offers richer query capabilities.

## R3: Value Object Error Codes

**Decision**: Convert existing generic `Error` throws in value objects (SpecTitle, TestStep) to domain-specific errors using the `DOMAIN_CATEGORY_SPECIFIC` taxonomy. Add new error codes: `AUTHOR_SPEC_TITLE_INVALID`, `AUTHOR_SPEC_STEP_INVALID`, `AUTHOR_SPEC_DURATION_INVALID`, `AUTHOR_SPEC_TAGS_INVALID`, `AUTHOR_SPEC_FIELD_TOO_LONG`.

**Rationale**: The constitution (NFR-ERR) requires all error paths to use structured error codes. Currently, value objects throw generic `Error` instances — this is a gap from 011-create-spec that this feature must resolve. A single `AUTHOR_SPEC_FIELD_TOO_LONG` code with `details.field` covers all character-limit violations without code explosion.

**Alternatives considered**:

- One error code per field per violation: Rejected — excessive granularity. The `details` object on `DomainError` carries field-specific context.
- Keep generic errors: Rejected — violates constitution NFR-ERR.

## R4: Rich Text Character Counting

**Decision**: Implement a shared `extractPlainTextLength(tiptapDoc: unknown): number` utility in `packages/shared/src/lib/` that extracts plain text from a TipTap JSON document and returns the character count. Used by both frontend (real-time counter) and backend (validation).

**Rationale**: Character limits on rich text fields (preconditions: 5,000, description: 10,000, expected result: 5,000) apply to plain-text content, not the JSON structure. The same extraction logic must run on both sides to ensure consistent counts. TipTap JSON has a predictable `{ type: "doc", content: [...] }` structure where text nodes contain `.text` properties.

**Alternatives considered**:

- Frontend-only counting with backend max JSON size: Rejected — inconsistent enforcement. A JSON structure with minimal text but heavy formatting could pass backend checks while exceeding plain-text limits.
- TipTap's built-in `editor.storage.characterCount`: Only available on the frontend editor instance. Backend needs the same logic without a TipTap editor.

## R5: Kebab-Case Transformation

**Decision**: Implement a `toKebabCase(raw: string): string` utility in `packages/shared/src/lib/` that lowercases, replaces spaces/underscores with hyphens, strips non-alphanumeric characters (except hyphens), and collapses consecutive hyphens.

**Rationale**: Tags must be stored in kebab-case (spec-configuration.md). The transformation must be deterministic and identical on frontend and backend. Placing it in `packages/shared` ensures a single source of truth.

**Alternatives considered**:

- Use a library (e.g., `change-case`): Rejected — adding a dependency for a ~5-line function violates YAGNI. The transformation rules are specific to NoHotfix tags.

## R6: Title Length Change (500 → 200)

**Decision**: Update `SpecTitle` value object max from 500 to 200. Update Zod schema `CreateLibrarySpecRequestSchema` max from 500 to 200. Update frontend character counter from 500 to 200.

**Rationale**: The canonical spec-configuration document defines title max as 200 characters. The 011-create-spec implementation used 500 as a placeholder. Since 011-create-spec has not shipped to production, no migration or data compatibility concern exists.

**Alternatives considered**:

- Keep 500 for backwards compatibility: Rejected — no production data exists; align now while the cost is zero.

## R7: Test Step Expected Outcome — Required vs Optional

**Decision**: Expected outcome remains optional per test step, as defined in spec-configuration.md. The current implementation already treats it as optional in the Zod schema (`z.string().optional()`) and entity layer. No change needed here.

**Rationale**: The 011-create-spec spec text said "both required" but the actual implementation made expectedOutcome optional. The spec-configuration document (source of truth) says optional. The implementation is already correct.
