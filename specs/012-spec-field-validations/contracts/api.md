# API Contracts: Spec Field Validations

**Feature**: 012-spec-field-validations
**Date**: 2026-03-10

## Modified Endpoints

### POST `/api/orgs/:orgSlug/specs` (updated)

**Change**: Request schema updated with stricter validations and two new fields.

#### Request Body (updated `CreateLibrarySpecRequestSchema`)

```typescript
{
  title: string;                        // Required. 1–200 chars (was 500). Trimmed.
  systemUnderTest?: string;             // Optional. Unchanged.
  severity?: 'critical' | 'high' | 'medium' | 'low';  // Optional. Default: 'medium'. Unchanged.
  preconditions?: TipTapDocument;       // Optional. Max 5,000 plain-text chars. (NEW LIMIT)
  description?: TipTapDocument;         // Optional. Max 10,000 plain-text chars. (NEW LIMIT)
  testSteps?: TestStep[];               // Optional. Max 50 items.
  expectedResult?: TipTapDocument;      // Optional. Max 5,000 plain-text chars. (NEW LIMIT)
  testerNotes?: string;                 // Optional. Max 2,000 chars. Trimmed. (NEW LIMIT)
  estimatedDurationMinutes?: number;    // Optional. Integer 1–999. (NEW FIELD)
  tags?: string[];                      // Optional. Max 10 items, each max 30 chars. (NEW FIELD)
}
```

#### TestStep (updated)

```typescript
{
  instruction: string;       // Required. 1–500 chars. (NEW LIMIT)
  expectedOutcome?: string;  // Optional. Max 500 chars. (NEW LIMIT)
}
```

#### Response Body (updated `LibrarySpecDto`)

Two new fields in the response:

```typescript
{
  // ... existing fields unchanged ...
  estimatedDurationMinutes: number | null;  // NEW
  tags: string[];                           // NEW (always kebab-case, deduplicated)
}
```

#### New Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `AUTHOR_SPEC_TITLE_INVALID` | Title empty, whitespace-only, or exceeds 200 chars |
| 400 | `AUTHOR_SPEC_STEP_INVALID` | Step instruction empty/exceeds 500 chars, or expectedOutcome exceeds 500 chars |
| 400 | `AUTHOR_SPEC_DURATION_INVALID` | Duration not an integer or outside 1–999 range |
| 400 | `AUTHOR_SPEC_TAGS_INVALID` | More than 10 tags, tag exceeds 30 chars, or tag is empty after kebab-case transform |
| 400 | `AUTHOR_SPEC_FIELD_TOO_LONG` | Rich text field or tester notes exceeds character limit. `details.field` identifies which field. |

Error response format (unchanged pattern):

```json
{
  "error": "AUTHOR_SPEC_FIELD_TOO_LONG",
  "message": "Field 'description' exceeds the maximum of 10000 characters",
  "details": { "field": "description", "maxLength": 10000 }
}
```

### GET `/api/orgs/:orgSlug/specs/:specId` (updated)

**Change**: Response includes two new fields.

```typescript
{
  // ... existing fields unchanged ...
  estimatedDurationMinutes: number | null;  // NEW
  tags: string[];                           // NEW
}
```

### GET `/api/orgs/:orgSlug/specs/tags` (new)

Returns distinct tag values from all specs in the organisation for combobox suggestions.

**Middleware**: `[orgScopeMiddleware]`

**Response**: `200 OK`

```typescript
{
  tags: string[];  // Distinct kebab-case tags, alphabetically sorted
}
```

## Zod Schema Updates

### `packages/shared/src/schemas/specs.ts`

```typescript
// Updated
export const TestStepSchema = z.object({
  instruction: z.string().min(1).max(500),
  expectedOutcome: z.string().max(500).optional(),
});

// Updated
export const CreateLibrarySpecRequestSchema = z.object({
  title: z.string().min(1).max(200),
  systemUnderTest: z.string().optional(),
  severity: SeveritySchema.optional(),
  preconditions: z.unknown().optional(),          // Structural limit checked at domain layer
  description: z.unknown().optional(),            // Structural limit checked at domain layer
  testSteps: z.array(TestStepSchema).max(50).optional(),
  expectedResult: z.unknown().optional(),         // Structural limit checked at domain layer
  testerNotes: z.string().max(2000).optional(),
  estimatedDurationMinutes: z.number().int().min(1).max(999).optional(),  // NEW
  tags: z.array(z.string().max(30)).max(10).optional(),                   // NEW
});

// Updated
export const LibrarySpecSchema = z.object({
  // ... existing fields ...
  estimatedDurationMinutes: z.number().int().min(1).max(999).nullable(),  // NEW
  tags: z.array(z.string()).default([]),                                   // NEW
});
```

Note: Rich text character limits cannot be validated at the Zod layer (requires TipTap JSON parsing). These are enforced in the domain entity layer using `extractPlainTextLength()`.
