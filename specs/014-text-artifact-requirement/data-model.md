# Data Model: Text Artifact Requirement

**Feature**: 014-text-artifact-requirement
**Date**: 2026-03-10

## No Migration Required

The `artifact_requirements` JSONB column already exists on `spec_library`, `playbook_specs`, and `run_specs` tables (created in `001_initial_schema.ts`). Currently stored as `null`. This feature populates it with typed data.

## JSONB Schema: `artifact_requirements`

Stored as a JSON array (or `null` if no requirements). Each element is a discriminated union on `type`.

### Text Artifact Requirement (first type)

```typescript
// Stored in spec_library.artifact_requirements JSONB column
type ArtifactRequirementsJson = ArtifactRequirementJson[] | null;

interface TextArtifactRequirementJson {
  index: number;           // 0-based, contiguous, explicit (not derived from array position)
  type: 'text';            // Discriminator
  label: string;           // 1-200 chars, trimmed
  description: string | null; // Max 1,000 chars, trimmed, whitespace-only → null
  required: boolean;       // If true, blocks spec completion during execution
}

// Future: FileArtifactRequirementJson, CheckboxArtifactRequirementJson, etc.
type ArtifactRequirementJson = TextArtifactRequirementJson; // Union grows as types are added
```

### Example Stored Value

```json
[
  {
    "index": 0,
    "type": "text",
    "label": "Paste the relevant error log output",
    "description": "Include the full stack trace and any preceding warning messages",
    "required": true
  },
  {
    "index": 1,
    "type": "text",
    "label": "Manual observation notes",
    "description": null,
    "required": false
  }
]
```

## Value Objects

### ArtifactLabel

| Attribute | Type | Constraints |
|-----------|------|-------------|
| `value` | `string` | Required, 1-200 chars after trim. Whitespace-only rejected. |

**Validation**: `ArtifactLabel.create(raw: string): ArtifactLabel`
- Trims input
- Throws `AuthorArtifactLabelInvalidError` if empty or > 200 chars

### ArtifactDescription

| Attribute | Type | Constraints |
|-----------|------|-------------|
| `value` | `string \| null` | Optional. Max 1,000 chars after trim. Whitespace-only normalised to `null`. |

**Validation**: `ArtifactDescription.create(raw: string | null | undefined): ArtifactDescription`
- Trims input, whitespace-only → null
- Throws `AuthorArtifactRequirementsInvalidError` if > 1,000 chars

### TextArtifactRequirement (Value Object)

| Attribute | Type | Constraints |
|-----------|------|-------------|
| `index` | `number` | 0-based integer, assigned by collection |
| `type` | `'text'` | Literal discriminator |
| `label` | `ArtifactLabel` | See above |
| `description` | `ArtifactDescription` | See above |
| `required` | `boolean` | Defaults to `false` |

**Factory**: `TextArtifactRequirement.create(params: { index: number; label: string; description?: string | null; required?: boolean }): TextArtifactRequirement`

### ArtifactRequirements (Collection VO)

| Attribute | Type | Constraints |
|-----------|------|-------------|
| `items` | `TextArtifactRequirement[]` | Max 10 items. Indices contiguous 0-based. |

**Factory**: `ArtifactRequirements.create(raw: Array<{ type: string; label: string; description?: string | null; required?: boolean }>): ArtifactRequirements`
- Validates max 10
- Assigns contiguous indices (0, 1, 2, ...)
- Throws `AuthorArtifactRequirementsInvalidError` if > 10 or unknown type

**Serialisation**: `toJson(): ArtifactRequirementJson[]` — returns array matching JSONB schema.

## Zod Schemas (packages/shared)

### Request Schema Addition

```typescript
// Added to packages/shared/src/schemas/specs.ts

export const TextArtifactRequirementSchema = z.object({
  type: z.literal('text'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
});

export const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
]);

// Added to CreateLibrarySpecRequestSchema:
// artifactRequirements: z.array(ArtifactRequirementSchema).max(10).optional()
```

### Response Schema Update

```typescript
// Updated in LibrarySpecSchema:
// artifactRequirements: z.array(ArtifactRequirementSchema).nullable()
// (replaces z.unknown().nullable())
```

## Error Codes

| Code | HTTP | When |
|------|------|------|
| `AUTHOR_ARTIFACT_LABEL_INVALID` | 400 | Label empty, whitespace-only after trim, or exceeds 200 chars |
| `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 | List exceeds 10 items, unknown type, or description exceeds 1,000 chars |

## Entity Changes

### SpecLibraryEntryEntity

**Props change**: `artifactRequirements: unknown` → `artifactRequirements: ArtifactRequirementJson[] | null`

**CreateParams addition**: `artifactRequirements?: Array<{ type: string; label: string; description?: string | null; required?: boolean }>`

**create() change**: Validates via `ArtifactRequirements.create()` if provided, serialises to JSON array. Empty array normalised to `null`.

**reconstitute() change**: Accepts JSONB data as-is (no re-validation, trust persistence layer).

## Affected Tables (read/write)

| Table | Column | Change |
|-------|--------|--------|
| `spec_library` | `artifact_requirements` | Now populated with typed JSONB array (was always `null`) |
| `playbook_specs` | `artifact_requirements` | No change in this feature (snapshot copies from spec_library) |
| `run_specs` | `artifact_requirements` | No change in this feature (snapshot copies from playbook_specs) |
