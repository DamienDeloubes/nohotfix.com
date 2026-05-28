# Data Model: Measured Value Artifact Requirement

**Feature**: 019-measured-value-artifact-requirement
**Date**: 2026-03-10

## No Database Migration Required

The measured value artifact type uses the existing `spec_library.artifact_requirements` JSONB column. No schema changes.

## JSONB Structure

A measured value artifact requirement stored in the `artifact_requirements` JSONB array:

```json
{
  "index": 0,
  "type": "measured_value",
  "label": "Homepage API response time",
  "description": "Measure the P95 response time of the /api/overview endpoint under normal load",
  "required": true,
  "unit": "ms",
  "expectedValue": 200,
  "tolerancePercentage": 10,
  "toleranceDescription": "Based on last quarter's P95 average"
}
```

Minimal example (no tolerance, no description):

```json
{
  "index": 1,
  "type": "measured_value",
  "label": "Error rate",
  "description": null,
  "required": false,
  "unit": "%",
  "expectedValue": 0.5,
  "tolerancePercentage": null,
  "toleranceDescription": null
}
```

**Fields:**

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `index` | integer | 0-based, contiguous | Assigned by `ArtifactRequirements.create()` |
| `type` | string | Literal `"measured_value"` | Discriminator for the union |
| `label` | string | 1-200 chars, trimmed | Describes what is being measured |
| `description` | string \| null | 0-1,000 chars, trimmed. Null if empty. | Guidance on what should be measured and how |
| `required` | boolean | Required field | Defaults to `false` at form level |
| `unit` | string | One of: `ms`, `s`, `%`, `MB`, `GB`, `req/s` | Display unit for the measured value |
| `expectedValue` | number | Finite (not NaN, not Infinity). Zero, negative, decimal all valid. | The target number |
| `tolerancePercentage` | number \| null | Positive, > 0. Null if not configured. | Acceptable deviation as a percentage (e.g. 10 means +/-10%) |
| `toleranceDescription` | string \| null | 0-1,000 chars, trimmed. Null if empty or if tolerancePercentage is null. | Explains where the tolerance baseline comes from |

**Notable characteristics:**
- Includes optional `description` field (same as text, file, url types)
- Has 4 type-specific fields: `unit`, `expectedValue`, `tolerancePercentage`, `toleranceDescription`
- `toleranceDescription` is normalized to null when `tolerancePercentage` is null (no meaning without tolerance)
- `expectedValue` of 0 is valid (e.g. 0% error rate)
- `expectedValue` can be negative (e.g. temperature changes, relative values)
- `expectedValue` can be decimal (e.g. 0.5% error rate, 99.9% uptime)

## Value Object: MeasuredValueUnit

Located at `packages/domains/authoring/src/entities/value-objects/measured-value-unit.ts`

```typescript
const VALID_UNITS = ['ms', 's', '%', 'MB', 'GB', 'req/s'] as const;
type MeasuredValueUnitValue = typeof VALID_UNITS[number];

class MeasuredValueUnit {
  private constructor(readonly value: MeasuredValueUnitValue) {}

  static create(raw: string): MeasuredValueUnit {
    if (!VALID_UNITS.includes(raw as MeasuredValueUnitValue)) {
      throw new AuthorArtifactRequirementsInvalidError(
        `Invalid measured value unit: ${raw}. Must be one of: ${VALID_UNITS.join(', ')}`
      );
    }
    return new MeasuredValueUnit(raw as MeasuredValueUnitValue);
  }

  equals(other: MeasuredValueUnit): boolean {
    return this.value === other.value;
  }

  toString(): string { return this.value; }
}
```

## Value Object: MeasuredValueArtifactRequirement

Located at `packages/domains/authoring/src/entities/value-objects/measured-value-artifact-requirement.ts`

```typescript
interface MeasuredValueArtifactRequirementProps {
  index: number;
  type: 'measured_value';
  label: ArtifactLabel;
  description: ArtifactDescription | null;
  required: boolean;
  unit: MeasuredValueUnit;
  expectedValue: number;
  tolerancePercentage: number | null;
  toleranceDescription: ArtifactDescription | null;
}
```

**Factory methods:**
- `create(params)` — Validates:
  - Label via `ArtifactLabel.create()` (1-200 chars)
  - Description via `ArtifactDescription.create()` (0-1,000 chars)
  - Unit via `MeasuredValueUnit.create()` (one of 6 valid units)
  - `expectedValue`: must be a finite number (`Number.isFinite()`), throws if NaN or Infinity
  - `tolerancePercentage`: when provided, must be a positive finite number > 0
  - `toleranceDescription`: via `ArtifactDescription.create()` (0-1,000 chars), normalized to null when `tolerancePercentage` is null
- `reconstitute(props)` — From persistence, no validation.
- `toJson()` — Serializes to `{ index, type: 'measured_value', label, description, required, unit, expectedValue, tolerancePercentage, toleranceDescription }`.
- `equals(other)` — Structural comparison.
- `toString()` — Debug string.

## Zod Schemas

### Request Schema (packages/shared/src/schemas/specs.ts)

```typescript
// MeasuredValueUnitSchema already exists (line 37, from feature 018):
// export const MeasuredValueUnitSchema = z.enum(['ms', 's', '%', 'MB', 'GB', 'req/s']);

export const MeasuredValueArtifactRequirementSchema = z.object({
  type: z.literal('measured_value'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
  unit: MeasuredValueUnitSchema,
  expectedValue: z.number().refine(Number.isFinite, { message: 'Expected value must be a finite number' }),
  tolerancePercentage: z.number().positive().optional(),
  toleranceDescription: z.string().max(1000).optional(),
});
```

### Response Schema

```typescript
export const MeasuredValueArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('measured_value'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
  unit: MeasuredValueUnitSchema,
  expectedValue: z.number(),
  tolerancePercentage: z.number().nullable(),
  toleranceDescription: z.string().nullable(),
});
```

### Discriminated Union Update

```typescript
// Request
export const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
  FileArtifactRequirementSchema,
  CheckboxArtifactRequirementSchema,
  UrlArtifactRequirementSchema,
  MeasuredValueArtifactRequirementSchema,  // NEW
  TableArtifactRequirementSchema,
]);

// Response
export const ArtifactRequirementResponseSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementResponseSchema,
  FileArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementResponseSchema,
  UrlArtifactRequirementResponseSchema,
  MeasuredValueArtifactRequirementResponseSchema,  // NEW
  TableArtifactRequirementResponseSchema,
]);
```

## Shared Type Export

```typescript
// packages/shared/src/types/index.ts
export type MeasuredValueArtifactRequirement = z.infer<typeof MeasuredValueArtifactRequirementSchema>;
export type MeasuredValueArtifactRequirementResponse = z.infer<typeof MeasuredValueArtifactRequirementResponseSchema>;
```

## Impact on Existing Code

### ArtifactRequirements.create() (value-objects/artifact-requirements.ts)

Update `create()` method signature to accept measured_value fields and add case to switch:

```typescript
// Update raw parameter type to include measured_value fields
static create(raw: Array<{
  type: string;
  label: string;
  description?: string | null;
  required?: boolean;
  columns?: unknown[];
  rows?: unknown[][];
  unit?: string;
  expectedValue?: number;
  tolerancePercentage?: number;
  toleranceDescription?: string | null;
}>): ArtifactRequirements {
  // ...
  case 'measured_value':
    return MeasuredValueArtifactRequirement.create({
      index: i,
      label: item.label,
      description: item.description,
      required: item.required,
      unit: item.unit!,
      expectedValue: item.expectedValue!,
      tolerancePercentage: item.tolerancePercentage,
      toleranceDescription: item.toleranceDescription,
    });
}
```

### ArtifactRequirementItem type (artifact-requirements.ts)

Add `MeasuredValueArtifactRequirement` to the union type:

```typescript
type ArtifactRequirementItem = TextArtifactRequirement | FileArtifactRequirement | CheckboxArtifactRequirement | UrlArtifactRequirement | MeasuredValueArtifactRequirement | TableArtifactRequirement;
```

### ArtifactRequirementJson type (artifact-requirements.ts)

Add `MeasuredValueArtifactRequirementJson` to the union:

```typescript
export type ArtifactRequirementJson =
  | TextArtifactRequirementJson
  | FileArtifactRequirementJson
  | CheckboxArtifactRequirementJson
  | UrlArtifactRequirementJson
  | MeasuredValueArtifactRequirementJson
  | TableArtifactRequirementJson;
```

### CreateSpecForm.tsx — Form data mapping

Add measured_value case to the payload mapping:

```typescript
if (a.type === 'measured_value') {
  return {
    type: 'measured_value' as const,
    label: a.label.trim(),
    required: a.required,
    unit: a.unit as 'ms' | 's' | '%' | 'MB' | 'GB' | 'req/s',
    expectedValue: Number(a.expectedValue),
    ...(a.description.trim() && { description: a.description.trim() }),
    ...(a.tolerancePercentage && { tolerancePercentage: Number(a.tolerancePercentage) }),
    ...(a.tolerancePercentage && a.toleranceDescription.trim() && { toleranceDescription: a.toleranceDescription.trim() }),
  };
}
```

### ArtifactRequirementsList.tsx — Form data union + add button + validation

Update `ArtifactFormData` union to include `MeasuredValueArtifactFormData`.
Update `ArtifactType` and `ARTIFACT_TYPE_LABELS` to include `'measured_value': 'Measured Value'`.
Add `handleAdd` case for measured_value with default form data.
Add `hasMeasuredValueErrors()` validation helper.
Add "Measured Value" button alongside existing type buttons.
Wire `MeasuredValueArtifactForm` in the `SortableArtifact` dispatch.

### ArtifactRequirementsDisplay.tsx — Type badge + display

Add "Measured Value" badge (rose/pink: `#ffe4e6` bg, `#e11d48` text).
Display unit alongside expected value (e.g., "200 ms", "99.9 %").
Conditionally show tolerance percentage and description when configured.
