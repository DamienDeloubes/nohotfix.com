# Quickstart: URL Artifact Requirement

**Feature**: 017-url-artifact-requirement
**Date**: 2026-03-10

## Prerequisites

- Node.js 20+, pnpm
- `pnpm install` from repo root
- No database migration required

## Implementation Order

### 1. Shared Schemas (packages/shared)

1. **`packages/shared/src/schemas/specs.ts`** — Add `UrlArtifactRequirementSchema` and `UrlArtifactRequirementResponseSchema`. Add to both discriminated unions.
2. **`packages/shared/src/types/index.ts`** — Export `UrlArtifactRequirement` type.

### 2. Domain Value Object (packages/domains/authoring)

3. **`packages/domains/authoring/src/entities/value-objects/url-artifact-requirement.ts`** — NEW. Copy `text-artifact-requirement.ts` pattern (has description field, unlike checkbox).
4. **`packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`** — Add `'url'` case to the type discriminator in `create()`.
5. **Export** from domain package index if needed.

### 3. Unit Tests

6. **`packages/domains/authoring/src/entities/__tests__/url-artifact-requirement.test.ts`** — NEW. Test create, defaults, boundary (200 char label, 1000 char description), description null normalization, toJson, equality, toString.
7. **`packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`** — Add url-type tests: single url, mixed types (all four), url in 10-item array.

### 4. Frontend Form

8. **`packages/domains/authoring/src/ui/components/UrlArtifactForm.tsx`** — NEW. Label input (200 char counter) + description textarea (1000 char counter) + required toggle. Placeholder: label "e.g. CI Pipeline URL", description "e.g. Provide the GitHub Actions run URL for the main branch build".
9. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`** — Add "URL" button alongside "Text", "File", and "Checkbox". Wire `UrlArtifactForm` for `type === 'url'`. Update `ArtifactFormData` union type.
10. **`packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`** — Update type assertion in form data mapping to include `'url'`.

### 5. Frontend Display

11. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`** — Add "URL" badge with distinct color (amber/orange suggested).

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
| `packages/shared/src/schemas/specs.ts` | Modify | `TextArtifactRequirementSchema` |
| `packages/shared/src/types/index.ts` | Modify | `TextArtifactRequirement` export |
| `packages/domains/authoring/src/entities/value-objects/url-artifact-requirement.ts` | Create | `text-artifact-requirement.ts` |
| `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` | Modify | `'text'` case |
| `packages/domains/authoring/src/entities/__tests__/url-artifact-requirement.test.ts` | Create | `text-artifact-requirement.test.ts` |
| `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` | Modify | Text type tests |
| `packages/domains/authoring/src/ui/components/UrlArtifactForm.tsx` | Create | `TextArtifactForm.tsx` |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` | Modify | Text button pattern |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` | Modify | Text badge pattern |
| `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` | Modify | Type assertion |
