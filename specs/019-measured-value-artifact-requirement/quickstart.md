# Quickstart: Measured Value Artifact Requirement

**Feature**: 019-measured-value-artifact-requirement
**Date**: 2026-03-10

## Prerequisites

- Node.js 20+, pnpm
- `pnpm install` from repo root
- No database migration required

## Implementation Order

### 1. Shared Schemas (packages/shared)

1. **`packages/shared/src/schemas/specs.ts`** — Add `MeasuredValueArtifactRequirementSchema` and `MeasuredValueArtifactRequirementResponseSchema`. Add both to the discriminated unions. Note: `MeasuredValueUnitSchema` already exists (line 37, from feature 018).
2. **`packages/shared/src/types/index.ts`** — Export `MeasuredValueArtifactRequirement` and `MeasuredValueArtifactRequirementResponse` types. Add import for the new schemas.

### 2. Domain Value Objects (packages/domains/authoring)

3. **`packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts`** — NEW. Value object for the fixed unit set (`ms`, `s`, `%`, `MB`, `GB`, `req/s`). Private constructor + `create()` + `equals()` + `toString()`.
4. **`packages/domains/authoring/src/entities/value-objects/measured-value-artifact-requirement.ts`** — NEW. Value object with type-specific fields: `unit` (MeasuredValueUnit), `expectedValue` (finite number), `tolerancePercentage` (optional, positive > 0), `toleranceDescription` (optional ArtifactDescription, normalized to null when tolerance is absent). Copy `url-artifact-requirement.ts` structure and add type-specific fields.
5. **`packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`** — Add `'measured_value'` case to the type discriminator in `create()`. Update raw parameter type to include `unit`, `expectedValue`, `tolerancePercentage`, `toleranceDescription`. Add imports. Update `ArtifactRequirementJson` and `ArtifactRequirementItem` unions.
6. **`packages/domains/authoring/src/entities/value-objects/index.ts`** — Export new value objects.

### 3. Unit Tests

7. **`packages/domains/authoring/src/entities/__tests__/measured-value-unit.test.ts`** — NEW. Test all 6 valid units, invalid unit string, empty string, case sensitivity.
8. **`packages/domains/authoring/src/entities/__tests__/measured-value-artifact-requirement.test.ts`** — NEW. Test:
   - Create with all fields (unit, expectedValue, tolerancePercentage, toleranceDescription)
   - Create without tolerance (tolerancePercentage and toleranceDescription null)
   - Create without description (null)
   - Expected value of zero, negative, decimal
   - Non-finite expected value (NaN, Infinity) → error
   - Invalid unit → error
   - Non-positive tolerance → error
   - Tolerance description without tolerance → silently discarded (null)
   - Label boundary (200 chars accepted, 201 rejected)
   - Description boundary (1,000 chars accepted, 1,001 rejected)
   - Tolerance description boundary (1,000 chars accepted, 1,001 rejected)
   - toJson round-trip
   - equals
   - toString
9. **`packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`** — Add measured_value type tests: single measured_value, mixed types (all six), measured_value in 10-item array.

### 4. Frontend Form

10. **`packages/domains/authoring/src/ui/components/MeasuredValueArtifactForm.tsx`** — NEW. Fields:
    - Label input (200 char counter) — standard
    - Description textarea (1,000 char counter) — standard
    - Required toggle — standard
    - Unit dropdown (6 options: ms, s, %, MB, GB, req/s) — type-specific
    - Expected value number input — type-specific
    - Tolerance percentage number input (optional) — type-specific
    - Tolerance description textarea (1,000 char counter, conditionally shown when tolerance has a value) — type-specific
    - Placeholders: label "e.g. Homepage API response time", description "e.g. Measure the P95 response time under normal load"
11. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`** — Add "Measured Value" button. Wire `MeasuredValueArtifactForm` for `type === 'measured_value'`. Update `ArtifactFormData` union with `MeasuredValueArtifactFormData`. Update `ArtifactType` and `ARTIFACT_TYPE_LABELS`. Update `handleAdd` for measured_value default data. Add `hasMeasuredValueErrors()` validation helper. Wire into `hasArtifactErrors()`.
12. **`packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`** — Add measured_value case to payload mapping (parse expectedValue and tolerancePercentage from string to number, conditionally include tolerance fields).

### 5. Frontend Display

13. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`** — Add "Measured Value" badge (rose/pink). Display unit alongside expected value (e.g., "200 ms", "99.9 %"). Conditionally show tolerance and tolerance description.

## Verification

```bash
# Type check
pnpm turbo run typecheck

# Unit tests
pnpm --filter @nohotfix/domain-authoring test

# Full build
pnpm turbo run build
```

## Key Files Reference

| File | Action | Pattern Source |
|------|--------|---------------|
| `packages/shared/src/schemas/specs.ts` | Modify | `UrlArtifactRequirementSchema` (simple) + `TableArtifactRequirementSchema` (type-specific fields) |
| `packages/shared/src/types/index.ts` | Modify | `UrlArtifactRequirement` export |
| `packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts` | Create | N/A (new, simple value object) |
| `packages/domains/authoring/src/entities/value-objects/measured-value-artifact-requirement.ts` | Create | `url-artifact-requirement.ts` + type-specific fields |
| `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` | Modify | `'table'` case (for type-specific params) |
| `packages/domains/authoring/src/entities/value-objects/index.ts` | Modify | Existing exports |
| `packages/domains/authoring/src/entities/__tests__/measured-value-unit.test.ts` | Create | N/A |
| `packages/domains/authoring/src/entities/__tests__/measured-value-artifact-requirement.test.ts` | Create | `url-artifact-requirement.test.ts` |
| `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` | Modify | Table type tests |
| `packages/domains/authoring/src/ui/components/MeasuredValueArtifactForm.tsx` | Create | `UrlArtifactForm.tsx` + type-specific fields |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` | Modify | Table type pattern (for type-specific form data) |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` | Modify | Table type badge + display |
| `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` | Modify | Table type payload mapping |
