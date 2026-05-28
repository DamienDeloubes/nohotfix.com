# Data Model: URL Artifact Requirement

**Feature**: 017-url-artifact-requirement
**Date**: 2026-03-10

## No Database Migration Required

The URL artifact type uses the existing `spec_library.artifact_requirements` JSONB column. No schema changes.

## JSONB Structure

A URL artifact requirement stored in the `artifact_requirements` JSONB array:

```json
{
  "index": 0,
  "type": "url",
  "label": "CI Pipeline URL",
  "description": "Provide the GitHub Actions run URL for the main branch build",
  "required": true
}
```

**Fields:**

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `index` | integer | 0-based, contiguous | Assigned by `ArtifactRequirements.create()` |
| `type` | string | Literal `"url"` | Discriminator for the union |
| `label` | string | 1-200 chars, trimmed | Describes what URL to provide |
| `description` | string \| null | 0-1,000 chars, trimmed. Null if empty. | Guidance on what link is expected |
| `required` | boolean | Required field | Defaults to `false` at form level |

**Notable characteristics:**
- Includes optional `description` field (same as text and file types, unlike checkbox)
- No type-specific configuration fields (unlike `measured_value` or `table`)

## Value Object: UrlArtifactRequirement

Located at `packages/domains/authoring/src/entities/value-objects/url-artifact-requirement.ts`

```typescript
interface UrlArtifactRequirementProps {
  index: number;
  type: 'url';
  label: ArtifactLabel;              // Reuses existing value object (1-200 chars)
  description: ArtifactDescription | null;  // Reuses existing value object (0-1,000 chars)
  required: boolean;
}
```

**Factory methods:**
- `create(params)` — Validates label via `ArtifactLabel.create()`, description via `ArtifactDescription.create()`. Returns new instance.
- `reconstitute(props)` — From persistence, no validation.
- `toJson()` — Serializes to `{ index, type: 'url', label: string, description: string | null, required: boolean }`.
- `equals(other)` — Structural comparison.
- `toString()` — Debug string.

## Zod Schemas

### Request Schema (packages/shared/src/schemas/specs.ts)

```typescript
const UrlArtifactRequirementSchema = z.object({
  type: z.literal('url'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
});
```

### Response Schema

```typescript
const UrlArtifactRequirementResponseSchema = z.object({
  index: z.number(),
  type: z.literal('url'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
});
```

### Discriminated Union Update

```typescript
// Request
const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
  FileArtifactRequirementSchema,
  CheckboxArtifactRequirementSchema,
  UrlArtifactRequirementSchema,  // NEW
]);

// Response
const ArtifactRequirementResponseSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementResponseSchema,
  FileArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementResponseSchema,
  UrlArtifactRequirementResponseSchema,  // NEW
]);
```

## Shared Type Export

```typescript
// packages/shared/src/types/index.ts
export type UrlArtifactRequirement = z.infer<typeof UrlArtifactRequirementSchema>;
```

## Impact on Existing Code

### ArtifactRequirements.create() (value-objects/artifact-requirements.ts)

Add `'url'` case to the type discriminator switch:

```typescript
case 'url':
  return UrlArtifactRequirement.create({ ...item, index: i });
```

### CreateSpecForm.tsx — Form data mapping

Update the type union in the artifact requirements mapping:

```typescript
type: a.type as 'text' | 'file' | 'checkbox' | 'url',
```

### ArtifactRequirementsDisplay.tsx — Type badge

Add URL type badge (suggested: amber/orange to differentiate from indigo=Text, blue=File, green=Checkbox).
