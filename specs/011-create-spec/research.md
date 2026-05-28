# Research: Create Spec

## R-001: Schema Migration Requirement

**Decision**: No schema migration needed.

**Rationale**: The `spec_library` table already exists in `001_initial_schema.ts` with all required columns: `title` (TEXT), `system_under_test` (TEXT nullable), `severity` (TEXT nullable), `preconditions` (JSONB nullable), `description` (JSONB nullable), `test_steps` (JSONB nullable), `expected_result` (JSONB nullable), `artifact_requirements` (JSONB nullable), `tester_notes` (TEXT nullable), `is_archived` (BOOLEAN default FALSE), `created_by` (UUID FK to users), timestamps. The `changelog` table also exists with `entity_type` supporting `'spec_library'`.

**Alternatives considered**: Adding a separate `systems_under_test` lookup table — rejected because querying `SELECT DISTINCT system_under_test FROM spec_library WHERE org_id = ?` is simpler and sufficient for the combobox suggestion pattern. A lookup table adds unnecessary complexity for a free-text field.

## R-002: Shared Schema Updates

**Decision**: Extend `CreateLibrarySpecRequestSchema` in `packages/shared/src/schemas/specs.ts` to include rich text and test step fields.

**Rationale**: The current schema only includes `title`, `systemUnderTest`, `severity`, and `testerNotes`. Missing: `preconditions` (JSONB), `description` (JSONB), `testSteps` (array of `{ instruction: string, expectedOutcome: string }`), `expectedResult` (JSONB). These must be added to enable full spec creation per FR-003/FR-006.

**Alternatives considered**: Keeping rich text as untyped `z.unknown()` — rejected because test steps have a defined structure (instruction + expectedOutcome) that benefits from explicit validation. Rich text fields remain `z.unknown()` since TipTap JSON structure is opaque to the API.

## R-003: Test Step Data Structure

**Decision**: Test steps stored as a JSON array in the `test_steps` JSONB column. Each element: `{ instruction: string, expectedOutcome: string }`. Position is implicit from array index.

**Rationale**: The `test_steps` column is already JSONB. Array index provides natural ordering without a separate position field. Max 50 steps validated by Zod schema (`.max(50)`). Each step requires both `instruction` and `expectedOutcome` (plain text, per clarification).

**Alternatives considered**: Separate `spec_test_steps` table with `position` column — rejected as over-engineering for an ordered list within a single entity. JSONB array is simpler, atomic (single row update), and sufficient for <=50 items.

## R-004: Rich Text Normalisation

**Decision**: API normalises "empty" TipTap JSON to `null` before storage. A TipTap document is considered empty if it matches `{ "type": "doc", "content": [] }` or `{ "type": "doc", "content": [{ "type": "paragraph" }] }` (empty paragraph). The use-case performs this normalisation.

**Rationale**: Per FR-009, empty rich text must be stored as null. TipTap always produces a structural object even when the editor is visually empty. Normalisation prevents storing meaningless JSON and simplifies null-checks on read.

**Alternatives considered**: Storing the structural object as-is — rejected because it complicates equality checks and wastes storage. Frontend would need to distinguish "null" from "structurally empty" on read.

## R-005: System Under Test Suggestions Endpoint

**Decision**: New GET endpoint `GET /api/orgs/:orgSlug/specs/systems-under-test` returning `string[]` of distinct non-null `system_under_test` values for the org. Ordered alphabetically. No pagination (unlikely to exceed a few hundred values per org).

**Rationale**: The combobox (FR-005) needs suggestion data. Querying distinct values from `spec_library` is efficient with the existing `idx_specs_org` index. A dedicated endpoint is cleaner than embedding suggestions in a list response.

**Alternatives considered**: Client-side extraction from a spec list endpoint — rejected because the spec list feature is out of scope (separate feature). Also, distinct values are a separate concern from spec records.

## R-006: Changelog Integration Pattern

**Decision**: The API route handler orchestrates changelog recording after successful spec creation. The route calls `createLibrarySpec` (Authoring domain) then `appendChangelog` (Audit domain). This is API-layer orchestration, not a cross-domain import.

**Rationale**: Per Constitution I, cross-domain communication uses either domain events or API-layer orchestration. Since changelog recording is synchronous and part of the same request, API-layer orchestration is appropriate. The route handler calls both use-cases sequentially.

**Alternatives considered**: Domain event (`SpecCreated` event → Audit handler) — viable but adds complexity for a synchronous side-effect. Can be refactored to events later if needed.

## R-007: Role Guard Strategy

**Decision**: Dual-layer role enforcement. (1) Frontend: TanStack Router `beforeLoad` on spec-library routes checks `orgContext.role` and redirects Members. (2) Backend: Route handler checks `request.orgContext!.role` and throws `AuthRoleInsufficientError` for non-admin roles.

**Rationale**: Per Constitution IV, role guards must be at the TanStack Router level. Backend enforcement is a security requirement — frontend guards are UX only.

**Alternatives considered**: Backend-only enforcement — rejected per Constitution IV which mandates frontend route-level guards. Frontend-only — rejected because it's bypassable.

## R-008: Domain Entity vs Simple DTO

**Decision**: Create a `SpecLibraryEntryEntity` with private constructor, `create()` and `reconstitute()` factories, following the entity pattern from `code-architecture.md`. Value objects for `SpecTitle` (1-500 char validation) and `Severity` (enum validation). `TestStep` as a value object with instruction + expectedOutcome validation.

**Rationale**: Per code-architecture.md, entities must follow the private constructor pattern. Value objects enforce validation at the domain boundary. The `create()` factory validates inputs; `reconstitute()` trusts persistence.

**Alternatives considered**: Plain DTO without entity — rejected because it bypasses domain validation. The entity pattern ensures title length and severity enum are always valid regardless of caller.

## R-009: New Error Code

**Decision**: Register `AUTHOR_SPEC_NOT_FOUND` in the error codes enum. Create `AuthorSpecNotFoundError` class extending `DomainError` with 404 status.

**Rationale**: The detail page (redirect target after creation) needs to handle the case where a spec ID doesn't exist or doesn't belong to the org. This is a standard not-found error following the existing `AUTHOR_PLAYBOOK_NOT_FOUND` pattern.

**Alternatives considered**: Reusing a generic 404 — rejected per constitution (NFR-ERR): all error paths must use domain-specific codes.

## R-010: Form State Preservation (FR-014/FR-015)

**Decision**: Use React state for the form (controlled components). On network error, the mutation's `onError` callback shows a toast; form state naturally persists because React state isn't cleared. For session expiry (FR-015, SHOULD), use `sessionStorage` to persist form data on a timer or on blur, restored on mount.

**Rationale**: TanStack Query mutations don't clear form state on error by default. The `sessionStorage` approach for session expiry is lightweight and doesn't require external state management.

**Alternatives considered**: `localStorage` — rejected because form data is session-scoped and should not persist across browser sessions. Redux/Zustand — rejected as over-engineering for a single form.
