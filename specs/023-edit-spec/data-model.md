# Data Model: Edit Spec

## Overview

No database schema changes required. This feature operates on the existing `spec_library` and `changelog` tables. The only data model changes are at the application level: extending shared Zod schemas and the `SpecSnapshot` interface for change detection.

## Existing Tables (no migration)

### spec_library

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PK, auto-generated | |
| `org_id` | `UUID` | FK → organisations, NOT NULL | Tenant isolation |
| `title` | `TEXT` | NOT NULL | Required, 1-200 chars |
| `system_under_test` | `TEXT` | NULL | Optional |
| `severity` | `TEXT` | CHECK ('critical','high','medium','low'), NULL | Optional |
| `preconditions` | `JSONB` | NULL | TipTap rich text |
| `description` | `JSONB` | NULL | TipTap rich text |
| `test_steps` | `JSONB` | NULL | Array of {instruction, expectedOutcome} |
| `expected_result` | `JSONB` | NULL | TipTap rich text |
| `artifact_requirements` | `JSONB` | NULL | Array of typed artifact objects |
| `tester_notes` | `TEXT` | NULL | Max 2000 chars |
| `estimated_duration_minutes` | `INTEGER` | CHECK (1-999 or NULL) | Optional |
| `tags` | `JSONB` | DEFAULT '[]' | Array of strings, max 10 |
| `is_archived` | `BOOLEAN` | DEFAULT FALSE | Archive flag |
| `created_by` | `UUID` | FK → users, NOT NULL | |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW(), immutable | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Updated on edit |

### changelog

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PK, auto-generated | |
| `org_id` | `UUID` | FK → organisations, NOT NULL | Tenant isolation |
| `entity_type` | `TEXT` | CHECK ('playbook','spec_library'), NOT NULL | |
| `entity_id` | `UUID` | NOT NULL | FK to spec_library.id |
| `action` | `TEXT` | NOT NULL | See SPEC_HISTORY_ACTIONS below |
| `field_changes` | `JSONB` | NULL | `{ fieldName: { old, new } }` |
| `actor_id` | `UUID` | FK → users, NOT NULL | |
| `actor_name` | `TEXT` | NOT NULL | Denormalized for audit |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW(), immutable | |

## Application-Level Schema Changes

### Extended SPEC_HISTORY_ACTIONS

Current actions (from 022-spec-history):
- `created`
- `title_changed`
- `description_updated`
- `tags_changed`
- `duration_changed`
- `artifact_added`
- `artifact_removed`
- `artifact_modified`

New actions for edit spec:
- `system_under_test_changed` — `fieldChanges: { system_under_test: { old, new } }`
- `severity_changed` — `fieldChanges: { severity: { old, new } }`
- `preconditions_updated` — no fieldChanges (JSONB diff too complex to display)
- `test_steps_updated` — no fieldChanges (JSONB diff too complex to display)
- `expected_result_updated` — no fieldChanges (JSONB diff too complex to display)
- `tester_notes_updated` — no fieldChanges (text change, no old/new stored)

### Extended SpecSnapshot Interface

```typescript
// packages/domains/audit/src/use-cases/record-spec-changes.ts
interface SpecSnapshot {
  // Existing fields
  title: string;
  description: unknown;
  tags: string[];
  estimatedDurationMinutes: number | null;
  artifactRequirements: Array<{ label: string; [key: string]: unknown }> | null;
  // New fields for edit spec
  systemUnderTest: string | null;
  severity: string | null;
  preconditions: unknown;
  testSteps: unknown;
  expectedResult: unknown;
  testerNotes: string | null;
}
```

### UpdateLibrarySpecRequestSchema

```typescript
// packages/shared/src/schemas/specs.ts
const UpdateLibrarySpecRequestSchema = z.object({
  title: z.string().min(1).max(200),
  systemUnderTest: z.string().optional(),
  severity: SeveritySchema.optional(),
  preconditions: z.unknown().optional(),
  description: z.unknown().optional(),
  testSteps: z.array(TestStepSchema).max(50).optional(),
  expectedResult: z.unknown().optional(),
  artifactRequirements: z.array(ArtifactRequirementSchema).max(10).optional(),
  testerNotes: z.string().max(2000).optional(),
  estimatedDurationMinutes: z.number().int().min(1).max(999).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});
```

Same shape as `CreateLibrarySpecRequestSchema` — can be defined as a reference or separate const for clarity.

## Validation Rules

All validation rules are inherited from the create spec flow — no new rules:

| Field | Rule | Error Code |
|-------|------|------------|
| `title` | Required, 1-200 chars | `AUTHOR_SPEC_TITLE_INVALID` |
| `testSteps` | Max 50, instruction required (1-500 chars) | `AUTHOR_SPEC_STEP_INVALID` |
| `testerNotes` | Max 2000 chars | `AUTHOR_SPEC_FIELD_TOO_LONG` |
| `estimatedDurationMinutes` | 1-999 or null | `AUTHOR_SPEC_DURATION_INVALID` |
| `tags` | Max 10 items, each max 30 chars | `AUTHOR_SPEC_TAGS_INVALID` |
| `artifactRequirements` | Max 10, label required | `AUTHOR_ARTIFACT_LABEL_INVALID` |

## Entity Relationships

```
spec_library (1) ←── (N) changelog
   │                      │
   └── org_id ───→ organisations
   │                      │
   └── created_by ──→ users
                          │
   changelog.actor_id ────┘
```

No new relationships introduced by this feature.
