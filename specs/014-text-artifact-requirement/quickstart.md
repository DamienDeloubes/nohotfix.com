# Quickstart: Text Artifact Requirement

**Feature**: 014-text-artifact-requirement

## Prerequisites

- Node.js 20, pnpm installed
- Local dev environment running (`pnpm dev` or Docker Compose)

## Implementation Order

1. **packages/shared** — Error codes + Zod schemas (foundation for everything else)
2. **packages/domains/authoring** — Value objects + entity update + error classes
3. **apps/api** — Route handler + use case updates
4. **packages/domains/authoring/ui** — Form components + detail display
5. **apps/app** — Wire components into routes (CreateSpecForm, SpecDetail)

## Key Files to Modify

```bash
# 1. Shared schemas + error codes
packages/shared/src/errors/codes.ts          # Add 2 error codes
packages/shared/src/schemas/specs.ts         # Add artifact requirement Zod schemas
packages/shared/src/types/index.ts           # Export new types

# 2. Domain value objects + errors
packages/domains/authoring/src/entities/value-objects/artifact-label.ts       # NEW
packages/domains/authoring/src/entities/value-objects/artifact-description.ts # NEW
packages/domains/authoring/src/entities/value-objects/text-artifact-requirement.ts # NEW
packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts # NEW
packages/domains/authoring/src/entities/value-objects/index.ts               # Re-export
packages/domains/authoring/src/errors/index.ts                               # Add 2 errors
packages/domains/authoring/src/entities/spec-library-entry.ts                # Accept artifact reqs

# 3. Use case + route
packages/domains/authoring/src/use-cases/create-library-spec.ts              # Pass artifact reqs
apps/api/src/routes/authoring.ts                                             # Forward parsed data

# 4. UI components
packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx    # NEW
packages/domains/authoring/src/ui/components/TextArtifactForm.tsx            # NEW
packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx # NEW
packages/domains/authoring/src/ui/components/CreateSpecForm.tsx              # Add section
packages/domains/authoring/src/ui/components/SpecDetail.tsx                  # Add display
```

## Validation Commands

```bash
# Type check
pnpm turbo run typecheck

# Run tests
pnpm turbo run test

# Lint
pnpm turbo run lint

# Full pipeline
pnpm turbo run build typecheck test
```

## Testing Strategy

- **Unit tests** (colocated `*.test.ts`): ArtifactLabel, ArtifactDescription, TextArtifactRequirement, ArtifactRequirements value objects — valid inputs, boundary values, invalid inputs, error codes
- **Integration tests** (`apps/api/src/__tests__/`): POST spec with artifact requirements — happy path, validation errors, max 10 enforcement
- **Manual verification**: Create spec with text artifacts in the UI, verify persistence and display on detail page
