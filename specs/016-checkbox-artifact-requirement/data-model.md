# Data Model: Checkbox Artifact Requirement

**Feature**: 016-checkbox-artifact-requirement
**Date**: 2026-03-10

## No Database Migration Required

The checkbox artifact type uses the existing `spec_library.artifact_requirements` JSONB column. No schema changes.

## JSONB Structure

A checkbox artifact requirement stored in the `artifact_requirements` JSONB array:

```json
{
  "index": 0,
  "type": "checkbox",
  "label": "I verified this in staging",
  "required": true
}
```

**Fields:**

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `index` | integer | 0-based, contiguous | Assigned by `ArtifactRequirements.create()` |
| `type` | string | Literal `"checkbox"` | Discriminator for the union |
| `label` | string | 1–200 chars, trimmed | The confirmation statement itself |
| `required` | boolean | Required field | Defaults to `false` at form level |

**Notable absences:**
- No `description` field (checkbox label is self-explanatory)
- No type-specific configuration fields (unlike `measured_value` or `table`)

## Value Object: CheckboxArtifactRequirement

Located at `packages/domains/authoring/src/entities/value-objects/checkbox-artifact-requirement.ts`

```typescript
interface CheckboxArtifactRequirementProps {
  index: number;
  type: 'checkbox';
  label: ArtifactLabel;       // Reuses existing value object (1-200 chars)
  required: boolean;
}
```

**Factory methods:**
- `create(params)` — Validates label via `ArtifactLabel.create()`. No description validation (field doesn't exist).
- `reconstitute(props)` — From persistence, no validation.
- `toJson()` — Serializes to `{ index, type: 'checkbox', label: string, required: boolean }`.
- `equals(other)` — Structural comparison.
- `toString()` — Debug string.

## Zod Schemas

### Request Schema (packages/shared/src/schemas/specs.ts)

```typescript
const CheckboxArtifactRequirementSchema = z.object({
  type: z.literal('checkbox'),
  label: z.string().min(1).max(200),
  required: z.boolean().optional().default(false),
});
// No description field — Zod strips unknown fields by default
```

### Response Schema

```typescript
const CheckboxArtifactRequirementResponseSchema = z.object({
  index: z.number(),
  type: z.literal('checkbox'),
  label: z.string(),
  required: z.boolean(),
});
// No description in response either
```

### Discriminated Union Update

```typescript
// Request
const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
  FileArtifactRequirementSchema,
  CheckboxArtifactRequirementSchema,  // NEW
]);

// Response
const ArtifactRequirementResponseSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementResponseSchema,
  FileArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementResponseSchema,  // NEW
]);
```

## Shared Type Export

```typescript
// packages/shared/src/types/index.ts
export type CheckboxArtifactRequirement = z.infer<typeof CheckboxArtifactRequirementSchema>;
```

## Impact on Existing Code

### ArtifactRequirements.create() (value-objects/artifact-requirements.ts)

Add `'checkbox'` case to the type discriminator switch:

```typescript
case 'checkbox':
  return CheckboxArtifactRequirement.create({ ...item, index: i });
```

### CreateSpecForm.tsx — Form data mapping

Update the type union in the artifact requirements mapping:

```typescript
type: a.type as 'text' | 'file' | 'checkbox',
```

### ArtifactRequirementsDisplay.tsx — Type badge

Add checkbox type badge (suggested: green to differentiate from blue=File, indigo=Text).
