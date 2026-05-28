# Data Model: Spec Field Validations

**Feature**: 012-spec-field-validations
**Date**: 2026-03-10

## Schema Changes

### Migration: `003_spec_estimated_duration_and_tags`

**Table**: `spec_library` (existing — two columns added)

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| `estimated_duration_minutes` | `INTEGER` | Yes | `NULL` | CHECK (1 <= value <= 999) | Optional. Only integers 1–999 when set. |
| `tags` | `JSONB` | Yes | `'[]'::jsonb` | — | Array of kebab-case strings. Max 10 items, each max 30 chars. Enforced at application layer. |

### Kysely Schema Update

```typescript
// packages/db/src/schema.ts — SpecLibraryTable additions
estimated_duration_minutes: number | null;
tags: ColumnType<string[], string[] | undefined, string[]>;  // Select: string[], Insert: string[]?, Update: string[]
```

## Validation Rules by Field

### Existing Fields (constraint updates)

| Field | Current Constraint | New Constraint | Change |
|-------|-------------------|----------------|--------|
| `title` | 1–500 chars, trimmed | 1–200 chars, trimmed | Max reduced from 500 → 200 |
| `preconditions` | None | Max 5,000 plain-text chars | New limit |
| `description` | None | Max 10,000 plain-text chars | New limit |
| `expected_result` | None | Max 5,000 plain-text chars | New limit |
| `tester_notes` | None | Max 2,000 chars, trimmed | New limit |
| `test_steps` | Max 50 steps, instruction required | Max 50 steps, instruction required (max 500 chars), expectedOutcome optional (max 500 chars) | Char limits on step fields |

### New Fields

| Field | Type | Constraint | Notes |
|-------|------|------------|-------|
| `estimated_duration_minutes` | integer \| null | 1–999 when provided | Whole number only. |
| `tags` | string[] | Max 10 items, each max 30 chars | Auto-transformed to kebab-case. Deduplicated. |

## Value Objects (new or modified)

### SpecTitle (modified)

- Max length changed from 500 → 200
- Throws `AuthorSpecTitleInvalidError` (was generic `Error`)

### TestStep (modified)

- Instruction: max 500 chars (new constraint)
- ExpectedOutcome: max 500 chars when provided (new constraint)
- Throws `AuthorSpecStepInvalidError` (was generic `Error`)

### EstimatedDuration (new value object)

- `create(raw: number): EstimatedDuration`
- Validates: integer, 1 ≤ value ≤ 999
- Throws `AuthorSpecDurationInvalidError`

### SpecTag (new value object)

- `create(raw: string): SpecTag`
- Applies kebab-case transformation via shared `toKebabCase()`
- Validates: 1–30 chars after transformation, non-empty after stripping
- Throws `AuthorSpecTagsInvalidError`

### SpecTags (new value object — collection)

- `create(raw: string[]): SpecTags`
- Deduplicates after kebab-case transformation
- Validates: max 10 unique tags
- Throws `AuthorSpecTagsInvalidError`

## Entity Update

### SpecLibraryEntryEntity (modified)

New properties added to `SpecLibraryEntryProps`:

```typescript
estimatedDurationMinutes: EstimatedDuration | null;
tags: SpecTags;
```

`create()` factory updated to:
- Accept `estimatedDurationMinutes?: number` and `tags?: string[]`
- Construct `EstimatedDuration` and `SpecTags` value objects
- Validate rich text character limits via shared `extractPlainTextLength()`

`reconstitute()` factory updated to accept pre-validated duration and tags.

## Error Codes (new)

| Code | HTTP | When |
|------|------|------|
| `AUTHOR_SPEC_TITLE_INVALID` | 400 | Title empty, too long, or whitespace-only |
| `AUTHOR_SPEC_STEP_INVALID` | 400 | Step instruction empty/too long, expectedOutcome too long |
| `AUTHOR_SPEC_DURATION_INVALID` | 400 | Duration not integer, out of 1–999 range |
| `AUTHOR_SPEC_TAGS_INVALID` | 400 | Too many tags, tag too long, empty after transform |
| `AUTHOR_SPEC_FIELD_TOO_LONG` | 400 | Rich text or tester notes exceeds character limit. `details.field` identifies which field. |

## Shared Utilities (new)

### `packages/shared/src/lib/tiptap-text.ts`

```typescript
export function extractPlainTextLength(doc: unknown): number;
```

Walks the TipTap JSON document tree, concatenates `.text` properties from text nodes, returns total character count.

### `packages/shared/src/lib/kebab-case.ts`

```typescript
export function toKebabCase(raw: string): string;
```

Lowercases, replaces spaces/underscores with hyphens, strips non-alphanumeric (except hyphens), collapses consecutive hyphens, trims leading/trailing hyphens.
