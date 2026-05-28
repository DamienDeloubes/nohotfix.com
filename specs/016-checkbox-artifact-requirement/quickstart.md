# Quickstart: Checkbox Artifact Requirement

**Feature**: 016-checkbox-artifact-requirement
**Date**: 2026-03-10

## Prerequisites

- Node.js 20+, pnpm
- `pnpm install` from repo root
- No database migration required

## Implementation Order

### 1. Shared Schemas (packages/shared)

1. **`packages/shared/src/schemas/specs.ts`** — Add `CheckboxArtifactRequirementSchema` and `CheckboxArtifactRequirementResponseSchema`. Add to both discriminated unions.
2. **`packages/shared/src/types/index.ts`** — Export `CheckboxArtifactRequirement` type.

### 2. Domain Value Object (packages/domains/authoring)

3. **`packages/domains/authoring/src/entities/value-objects/checkbox-artifact-requirement.ts`** — NEW. Copy `file-artifact-requirement.ts` pattern, remove description field.
4. **`packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`** — Add `'checkbox'` case to the type discriminator in `create()`.
5. **Export** from domain package index if needed.

### 3. Unit Tests

6. **`packages/domains/authoring/src/entities/__tests__/checkbox-artifact-requirement.test.ts`** — NEW. Test create, defaults, boundary (200 char label), toJson, equality, toString.
7. **`packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`** — Add checkbox-type tests: single checkbox, mixed types, checkbox in 10-item array.

### 4. Frontend Form

8. **`packages/domains/authoring/src/ui/components/CheckboxArtifactForm.tsx`** — NEW. Label input (200 char counter) + required toggle. No description textarea. Placeholder: "e.g. I verified this in staging".
9. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`** — Add "Checkbox" button alongside "Text" and "File". Wire `CheckboxArtifactForm` for `type === 'checkbox'`. Update `ArtifactFormData` union type.
10. **`packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`** — Update type assertion in form data mapping to include `'checkbox'`.

### 5. Frontend Display

11. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`** — Add "Checkbox" badge with distinct color (green suggested).

## Verification

```bash
# Type check
pnpm turbo run typecheck

# Unit tests
pnpm --filter @releasepilot/domain-authoring test

# Full build
pnpm turbo run build
```

## Key Files Reference

| File | Action | Pattern Source |
|------|--------|---------------|
| `packages/shared/src/schemas/specs.ts` | Modify | `FileArtifactRequirementSchema` |
| `packages/shared/src/types/index.ts` | Modify | `FileArtifactRequirement` export |
| `packages/domains/authoring/src/entities/value-objects/checkbox-artifact-requirement.ts` | Create | `file-artifact-requirement.ts` |
| `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` | Modify | `'file'` case |
| `packages/domains/authoring/src/entities/__tests__/checkbox-artifact-requirement.test.ts` | Create | `file-artifact-requirement.test.ts` |
| `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` | Modify | File type tests |
| `packages/domains/authoring/src/ui/components/CheckboxArtifactForm.tsx` | Create | `FileArtifactForm.tsx` |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` | Modify | File button pattern |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` | Modify | File badge pattern |
| `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` | Modify | Type assertion |
