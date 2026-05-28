# Research: Measured Value Artifact Requirement

**Feature**: 019-measured-value-artifact-requirement
**Date**: 2026-03-10

## No External Unknowns

The measured value artifact type introduces no technology unknowns. It follows the established artifact type pattern from features 014-018. The type-specific fields (unit, expectedValue, tolerancePercentage, toleranceDescription) are well-defined in `docs/development/spec-configuration.md` and the `MeasuredValueUnitSchema` already exists in `packages/shared/src/schemas/specs.ts` (created by feature 018 for table column definitions).

## Decision Log

### D-001: Reuse existing MeasuredValueUnitSchema

**Decision**: Reuse the `MeasuredValueUnitSchema` Zod enum (`ms`, `s`, `%`, `MB`, `GB`, `req/s`) already defined in `packages/shared/src/schemas/specs.ts` (line 37). No new schema for units.

**Rationale**: The same fixed unit set applies to both standalone measured_value artifact requirements and measured_value columns within table artifact requirements. The schema was created by feature 018 and is already exported from `packages/shared`.

**Alternatives considered**:

- Create a separate unit schema for standalone measured values: Rejected — identical enum, would be redundant.

### D-002: Create MeasuredValueUnit value object in Authoring domain

**Decision**: Create a `MeasuredValueUnit` value object in `packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts`. This value object validates that the unit is one of the six allowed values and provides a typed wrapper.

**Rationale**: The table feature (018) validates units inline within `TableColumnDef.create()`. For the standalone measured_value type, a dedicated value object is cleaner and follows the pattern of `ArtifactLabel` and `ArtifactDescription`. The table's `TableColumnDef` can also reference this value object in a future refactor, but that is out of scope.

**Alternatives considered**:

- Validate unit inline in `MeasuredValueArtifactRequirement.create()`: Acceptable but a value object is more consistent with the existing pattern and reusable.

### D-003: Tolerance percentage validation — positive and greater than zero

**Decision**: Tolerance percentage, when provided, must be a positive finite number greater than zero. Zero is not accepted (a tolerance of 0% means no deviation allowed, which is semantically equivalent to not having tolerance at all).

**Rationale**: Per the spec edge cases: "tolerance percentage of 0 → validation error indicating tolerance must be greater than zero." This aligns with the Zod schema: `z.number().positive()` (positive excludes zero).

**Alternatives considered**:

- Allow zero: Rejected — zero tolerance is meaningless and would trigger green/red display with no allowed deviation, which is better handled by not setting tolerance at all.

### D-004: Tolerance description normalized to null when tolerance percentage is absent

**Decision**: If `tolerancePercentage` is not set (undefined or null), the `toleranceDescription` is silently discarded (normalized to null) regardless of what value was provided.

**Rationale**: Per spec FR-013 and edge case "Tolerance description without tolerance": the description has no meaning without a tolerance percentage. The API silently discards it rather than rejecting the request, to avoid unnecessary friction for clients.

**Alternatives considered**:

- Reject request with tolerance description but no tolerance percentage: Rejected — overly strict for no benefit. The description is informational.

### D-005: Expected value accepts any finite number

**Decision**: The expected value must be a finite number (not NaN, not Infinity). Zero, negative numbers, and decimal values are all valid.

**Rationale**: Per spec edge cases: "Expected value of zero: Valid (e.g. 0% error rate)", "Negative expected value: Valid (e.g. temperature readings)", "Decimal expected value: Valid (e.g. 0.5%)". The only constraint is finiteness — Zod's `z.number()` excludes NaN, and we add `.refine(Number.isFinite)` or equivalent.

**Alternatives considered**:

- Restrict to positive numbers: Rejected — legitimate use cases for zero and negative values exist.

### D-006: No new error codes needed

**Decision**: Reuse existing error codes: `AUTHOR_ARTIFACT_LABEL_INVALID` (label validation), `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` (type-specific validation: invalid unit, missing expectedValue, invalid tolerance). Reuse `ArtifactDescription` value object for both description and toleranceDescription.

**Rationale**: The measured_value type's validation errors fall into two categories: (1) label/description validation — already covered by existing value objects and error codes, and (2) type-specific validation (invalid unit, non-finite expected value, non-positive tolerance) — these are artifact requirement composition errors, covered by `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` with descriptive messages.

**Alternatives considered**:

- New `AUTHOR_MEASURED_VALUE_*` error codes: Rejected — the errors are all variations of "artifact requirement is invalid" with different messages. The existing code is sufficient with descriptive messages.

### D-007: Form component with conditional tolerance description

**Decision**: Create `MeasuredValueArtifactForm.tsx` with the following fields:

- Label (text input, 200 char counter) — standard
- Description (textarea, 1,000 char counter) — standard
- Required toggle — standard
- Unit (dropdown with 6 options) — type-specific
- Expected value (number input) — type-specific
- Tolerance percentage (number input, optional) — type-specific
- Tolerance description (textarea, 1,000 char counter, conditionally shown) — type-specific

The tolerance description field is only rendered when the tolerance percentage has a value. Clearing the tolerance percentage also clears the tolerance description.

**Rationale**: Per spec FR-019/FR-020/FR-021 (conditional UI). This reduces form clutter when tolerance is not used. Standard React controlled component pattern.

**Alternatives considered**:

- Always show tolerance description with a "disabled" state: Rejected — a hidden field is cleaner and matches the spec requirement.

### D-008: Display badge color for measured_value type

**Decision**: Use a distinct color for the "Measured Value" badge. Existing colors: Text=indigo, File=blue, Checkbox=green, URL=amber, Table=purple. Use **rose/pink** (`#ffe4e6` bg, `#e11d48` text) for measured value.

**Rationale**: Rose/pink is the remaining warm color that provides good visual distinction from all five existing badge colors. It conveys measurement/metrics, fitting for a numeric measurement type.

**Alternatives considered**:

- Teal/cyan: Acceptable but less distinctive from blue (file).
- Red: Rejected — red has negative connotations (error, danger).

### D-009: Form data interface for ArtifactFormData union

**Decision**: Add `MeasuredValueArtifactFormData` to the `ArtifactFormData` union in `ArtifactRequirementsList.tsx`:

```typescript
export interface MeasuredValueArtifactFormData {
  type: 'measured_value';
  label: string;
  description: string;
  required: boolean;
  unit: string; // '' when unselected
  expectedValue: string; // String for form state, parsed to number on submit
  tolerancePercentage: string; // '' when empty, parsed to number on submit
  toleranceDescription: string; // '' when empty
}
```

Numeric fields (`expectedValue`, `tolerancePercentage`) are stored as strings in form state to allow partial input (e.g., typing "-", "0.", "1e") and parsed to numbers at submission time. This matches standard React number input patterns.

**Rationale**: React controlled inputs work best with string state. Number conversion at submit time avoids NaN/intermediate state issues during typing.

**Alternatives considered**:

- Store as `number | null`: Causes issues with controlled inputs — `input type="number"` value must be a string for proper controlled behavior.

### D-010: Validation function for measured value form errors

**Decision**: Extend the `validateArtifact()` function in `ArtifactRequirementsList.tsx` to check measured-value-specific fields, and add a `hasMeasuredValueErrors()` helper (similar to `hasTableErrors()`):

- Unit must be selected (non-empty)
- Expected value must be a valid finite number
- Tolerance percentage, when provided, must be a positive number > 0
- Tolerance description, when provided, must be ≤ 1,000 chars

**Rationale**: Follows the existing pattern where `hasTableErrors()` validates table-specific fields and `validateArtifact()` validates common label/description fields. This keeps the validation logic organized.

**Alternatives considered**:

- Validate everything inside `validateArtifact()`: Would make the common function too type-specific. Better to follow the table pattern with a separate helper.
