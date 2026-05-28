# Data Model: File Artifact Requirement

## Overview

No new tables or columns. The file artifact requirement is stored as a JSONB variant in the existing `spec_library.artifact_requirements` column, alongside text artifacts.

## Entity: File Artifact Requirement (Value Object)

Extends the artifact requirement discriminated union with `type: 'file'`.

### Fields

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `index` | integer | 0-based, contiguous | Assigned by `ArtifactRequirements` collection |
| `type` | string literal | `'file'` | Discriminator |
| `label` | string | 1-200 chars, trimmed | Via `ArtifactLabel` VO |
| `description` | string \| null | Max 1,000 chars, trimmed, whitespace-only → null | Via `ArtifactDescription` VO |
| `required` | boolean | Defaults to `false` | Blocks spec completion if true |

### JSONB Storage Format

```json
{
  "index": 0,
  "type": "file",
  "label": "Screenshot of the confirmation page",
  "description": "Upload a PNG or JPEG screenshot showing the success message",
  "required": true
}
```

### Validation Rules (unchanged from base)

| Rule | Value | Enforced by |
|------|-------|-------------|
| Label length | 1-200 chars (after trim) | `ArtifactLabel` VO |
| Label whitespace-only | Rejected | `ArtifactLabel` VO |
| Description length | Max 1,000 chars | `ArtifactDescription` VO |
| Description whitespace-only | Normalised to null | `ArtifactDescription` VO |
| Max requirements per spec | 10 (shared across all types) | `ArtifactRequirements` collection |
| Required default | false | `FileArtifactRequirement` VO |

## Discriminated Union (updated)

```
ArtifactRequirement = TextArtifactRequirement | FileArtifactRequirement
```

Discriminated on the `type` field. The `ArtifactRequirements` collection VO dispatches creation to the correct type-specific VO based on the discriminator.

## Relationships

```
SpecLibraryEntry 1──* ArtifactRequirement (JSONB array, max 10)
  └── type: 'text' → TextArtifactRequirement
  └── type: 'file' → FileArtifactRequirement   ← NEW
```

## No Migration Required

The `spec_library.artifact_requirements` column is `jsonb` and already stores the discriminated union array. Adding a new variant with `type: 'file'` requires no schema change.
