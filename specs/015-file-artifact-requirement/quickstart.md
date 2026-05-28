# Quickstart: File Artifact Requirement

## Prerequisites

- Feature 014 (Text Artifact Requirement) fully implemented and merged
- Local dev environment running (`pnpm dev` from monorepo root)

## Files to Modify (in order)

### 1. Zod Schema (shared package)

**File**: `packages/shared/src/schemas/specs.ts`

- Add `FileArtifactRequirementSchema` (same fields as text, `type: z.literal('file')`)
- Add `FileArtifactRequirementResponseSchema` (with explicit index)
- Add both to the discriminated union arrays in `ArtifactRequirementSchema` and `ArtifactRequirementResponseSchema`

### 2. Domain Value Object (authoring package)

**New file**: `packages/domains/authoring/src/entities/value-objects/file-artifact-requirement.ts`

- Copy `text-artifact-requirement.ts` pattern
- Change type literal to `'file'`
- Same `ArtifactLabel` + `ArtifactDescription` composition
- Export `FileArtifactRequirementJson` interface

### 3. Collection Value Object (authoring package)

**File**: `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`

- Import `FileArtifactRequirement`
- Add `case 'file':` to the type dispatch in `create()` method
- Update `ArtifactRequirementJson` union type to include `FileArtifactRequirementJson`
- Update `items` type if needed to include `FileArtifactRequirement`

### 4. Frontend Form Component (authoring package)

**New file**: `packages/domains/authoring/src/ui/components/FileArtifactForm.tsx`

- Copy `TextArtifactForm.tsx` pattern
- Change `TextArtifactFormData` → `FileArtifactFormData` with `type: 'file'`
- Add static info note: "Files are limited to 10 MB. Only certain file types are accepted."
- Same label input, description textarea, required checkbox, character counters

### 5. Artifact Requirements List (authoring package)

**File**: `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`

- Import `FileArtifactForm`
- Update type selector to offer both "Text" and "File" options
- Update `ArtifactFormData` union type to include `FileArtifactFormData`
- Render `FileArtifactForm` when item type is `'file'`
- Update `validateArtifact()` to handle file type (same validation as text)

### 6. Artifact Requirements Display (authoring package)

**File**: `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`

- Add case for `type: 'file'` badge rendering (show "File" instead of "Text")

### 7. Unit Tests

**New file**: `packages/domains/authoring/src/entities/__tests__/file-artifact-requirement.test.ts`

- Valid creation, trimming, boundary lengths, whitespace rejection
- Follow `artifact-label.test.ts` patterns

**File**: `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`

- Add test: file type accepted and indexed correctly
- Add test: mixed text + file types work together
- Add test: file type serializes correctly via toJson()

## Verification

```bash
# Run domain unit tests
pnpm --filter @nohotfix/domain-authoring test

# Run shared package build (schema changes)
pnpm --filter @nohotfix/shared build

# Full pipeline
pnpm turbo run build typecheck test
```
