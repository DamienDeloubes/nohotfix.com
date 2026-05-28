# Data Model: Create Spec

## Entities

### SpecLibraryEntry (Aggregate Root)

**Context**: Authoring
**Table**: `spec_library` (exists — no migration)

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| id | UUID | Yes | Auto-generated | Primary key |
| orgId | UUID | Yes | FK → organisations | Tenant isolation |
| title | string | Yes | 1-500 characters | SpecTitle value object |
| systemUnderTest | string | No | Free text | Nullable, combobox suggestions from existing values |
| severity | enum | No | critical / high / medium / low | Defaults to "medium" on creation; Severity value object |
| preconditions | JSON | No | TipTap JSON or null | Normalised: empty TipTap → null |
| description | JSON | No | TipTap JSON or null | Normalised: empty TipTap → null |
| testSteps | TestStep[] | No | Array of 0-50 items | Stored as JSONB array; each item validated |
| expectedResult | JSON | No | TipTap JSON or null | Normalised: empty TipTap → null |
| artifactRequirements | JSON | No | — | Out of scope for this feature; always null on create |
| testerNotes | string | No | Free text | Nullable |
| isArchived | boolean | Yes | — | Defaults to false on creation |
| createdBy | UUID | Yes | FK → users | The Admin who created the spec |
| createdAt | Date | Yes | Auto-generated | Timestamp |
| updatedAt | Date | Yes | Auto-generated | Timestamp |

**Indexes** (existing):
- `idx_specs_org` on `(org_id, is_archived)` — list queries
- `idx_specs_org_title` using GIN on `title` — full-text search (future feature)

### TestStep (Value Object)

**Storage**: Inline within `spec_library.test_steps` JSONB column as an ordered array.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| instruction | string | Yes | Non-empty plain text |
| expectedOutcome | string | Yes | Non-empty plain text |

Position is implicit from array index (0-based). Maximum 50 items per spec.

**JSON structure example**:
```json
[
  { "instruction": "Navigate to login page", "expectedOutcome": "Login form is displayed" },
  { "instruction": "Enter invalid password", "expectedOutcome": "Error message shown" }
]
```

### ChangelogEntry (Audit Context — existing)

**Table**: `changelog` (exists — no migration)

| Field | Value for this feature |
|-------|----------------------|
| orgId | The org's UUID |
| entityType | `'spec_library'` |
| entityId | The created spec's UUID |
| action | `'created'` |
| fieldChanges | `null` (creation events don't track field-level diffs) |
| actorId | The Admin user's UUID |
| actorName | The Admin user's display name or email |

## Value Objects

### SpecTitle
- **Validation**: Non-empty string, 1-500 characters, trimmed
- **Location**: `packages/domains/authoring/src/value-objects/spec-title.ts`
- **Error**: Throws validation error if empty or exceeds 500 chars

### Severity
- **Validation**: Must be one of `'critical' | 'high' | 'medium' | 'low'`
- **Location**: `packages/domains/authoring/src/value-objects/severity.ts`
- **Default**: `'medium'` when not provided

### TestStep
- **Validation**: `instruction` non-empty string, `expectedOutcome` non-empty string
- **Location**: `packages/domains/authoring/src/value-objects/test-step.ts`
- **Array constraint**: Max 50 items enforced at Zod schema level and in entity `create()` factory

## Relationships

```
Organisation (1) ──── (N) SpecLibraryEntry
User (1) ──── (N) SpecLibraryEntry (via created_by)
SpecLibraryEntry (1) ──── (N) ChangelogEntry (via entity_id where entity_type = 'spec_library')
```

## Shared Types (DTOs)

### LibrarySpecDto
Return type from `createLibrarySpec` use-case and GET endpoint. Matches `LibrarySpecSchema` from `packages/shared/src/schemas/specs.ts`.

### CreateLibrarySpecRequest
Input validated by `CreateLibrarySpecRequestSchema`. Fields:
- `title` (string, 1-500, required)
- `systemUnderTest` (string, optional)
- `severity` (enum, optional)
- `preconditions` (unknown/JSON, optional)
- `description` (unknown/JSON, optional)
- `testSteps` (array of `{ instruction: string, expectedOutcome: string }`, optional, max 50)
- `expectedResult` (unknown/JSON, optional)
- `testerNotes` (string, optional)
