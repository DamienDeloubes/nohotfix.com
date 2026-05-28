# Quickstart: Spec Field Validations

**Feature**: 012-spec-field-validations
**Date**: 2026-03-10

## Context

This feature adds field-level validations to the spec creation form (from 011-create-spec) and introduces two new fields: `estimatedDurationMinutes` and `tags`. All validations are enforced on both frontend and backend.

## Primary Context

**Bounded Context**: Authoring

## Key Files to Modify

### Shared Package (`packages/shared/`)

| File | Action | Purpose |
|------|--------|---------|
| `src/schemas/specs.ts` | Modify | Update Zod schemas with new constraints and fields |
| `src/errors/codes.ts` | Modify | Register 5 new AUTHOR_SPEC_* error codes |
| `src/lib/tiptap-text.ts` | Create | Plain-text extraction from TipTap JSON for character counting |
| `src/lib/kebab-case.ts` | Create | Kebab-case transformation utility for tags |

### Database Package (`packages/db/`)

| File | Action | Purpose |
|------|--------|---------|
| `src/schema.ts` | Modify | Add `estimated_duration_minutes` and `tags` columns to SpecLibraryTable |
| `src/migrations/003_spec_estimated_duration_and_tags.ts` | Create | Database migration |

### Authoring Domain (`packages/domains/authoring/`)

| File | Action | Purpose |
|------|--------|---------|
| `src/entities/value-objects/spec-title.ts` | Modify | Change max from 500 → 200, throw domain error |
| `src/entities/value-objects/test-step.ts` | Modify | Add 500-char limits, throw domain error |
| `src/entities/value-objects/estimated-duration.ts` | Create | New VO: integer 1–999 validation |
| `src/entities/value-objects/spec-tag.ts` | Create | New VO: kebab-case transform + 30-char limit |
| `src/entities/value-objects/spec-tags.ts` | Create | New VO: collection with dedup + 10-item limit |
| `src/entities/spec-library-entry.ts` | Modify | Add new fields, rich text char validation |
| `src/errors/index.ts` | Modify | Add 5 new domain error classes |
| `src/use-cases/create-library-spec.ts` | Modify | Pass new fields to entity |
| `src/ports/spec-library-repository.ts` | Modify | Update interface for new fields |
| `src/ui/components/CreateSpecForm.tsx` | Modify | Add duration + tags fields, character counters, inline errors |
| `src/ui/components/SpecDetail.tsx` | Modify | Display duration and tags |
| `src/ui/components/TagsCombobox.tsx` | Create | Tags input with kebab-case transform + suggestions |
| `src/ui/hooks/use-tags-suggestions.ts` | Create | Hook for fetching tag suggestions |

### API (`apps/api/`)

| File | Action | Purpose |
|------|--------|---------|
| `src/routes/authoring.ts` | Modify | Add GET /tags endpoint, pass new fields |
| `src/adapters/repositories/kysely-spec-library-repository.ts` | Modify | Handle new columns |

## Implementation Order

1. Shared utilities (`tiptap-text.ts`, `kebab-case.ts`) + error codes
2. Database migration
3. Value objects (new + modified)
4. Entity update
5. Use case + repository updates
6. API route updates
7. Frontend form updates (character counters, duration field, tags combobox, inline errors)
8. Tests at all layers

## Verification

```bash
# Run from repo root
pnpm turbo run build typecheck test
```
