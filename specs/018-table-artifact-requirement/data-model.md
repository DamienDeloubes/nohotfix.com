# Data Model: Table Artifact Requirement

**Feature**: 018-table-artifact-requirement
**Date**: 2026-03-10

## No Database Migration Required

The table artifact type uses the existing `spec_library.artifact_requirements` JSONB column. No schema changes.

## JSONB Structure

A table artifact requirement stored in the `artifact_requirements` JSONB array:

```json
{
  "index": 0,
  "type": "table",
  "label": "API endpoint load times",
  "description": "Measure response times for all critical endpoints",
  "required": true,
  "columns": [
    { "name": "Endpoint", "type": "text", "readOnly": true },
    { "name": "Response Time", "type": "measured_value", "unit": "ms", "tolerancePercentage": 10 }
  ],
  "rows": [
    ["/api/overview", { "expectedValue": 200, "measuredValue": null }],
    ["/api/releases", { "expectedValue": 300, "measuredValue": null }],
    ["/api/specs", { "expectedValue": 250, "measuredValue": null }]
  ]
}
```

**Top-level fields:**

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `index` | integer | 0-based, contiguous | Assigned by `ArtifactRequirements.create()` |
| `type` | string | Literal `"table"` | Discriminator for the union |
| `label` | string | 1-200 chars, trimmed | Describes what the table represents |
| `description` | string \| null | 0-1,000 chars, trimmed. Null if empty. | Guidance for the tester |
| `required` | boolean | Required field | Defaults to `false` at form level |
| `columns` | array | 1-5 items | Column definitions |
| `rows` | array | 1-50 items | Row data (each row is an array of cell values) |

**Column definition fields:**

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `name` | string | 1-100 chars, trimmed | Column header label |
| `type` | string | `"text"` \| `"number"` \| `"boolean"` \| `"measured_value"` | Column type |
| `readOnly` | boolean | Only for `text` and `number` types. Default: `false` | When true, author sets values |
| `unit` | string \| undefined | Required for `measured_value`. One of: `ms`, `s`, `%`, `MB`, `GB`, `req/s` | Display unit |
| `tolerancePercentage` | number \| undefined | Optional for `measured_value`. Positive number. | Applies to all rows |

**Cell value types per column type:**

| Column Type | Read-only | Cell Value | Notes |
|-------------|-----------|-----------|-------|
| `text` | `true` | `string` | Author-set, non-empty |
| `text` | `false` | `null` | Tester fills during execution |
| `number` | `true` | `number` | Author-set |
| `number` | `false` | `null` | Tester fills during execution |
| `boolean` | N/A (always fillable) | `null` | Tester fills as `true`/`false` |
| `measured_value` | N/A (always fillable) | `{ "expectedValue": number, "measuredValue": null }` | Author sets expected; tester fills measured |

## Value Object: TableArtifactRequirement

Located at `packages/domains/authoring/src/entities/value-objects/table-artifact-requirement.ts`

```typescript
interface TableColumnDefProps {
  name: string;           // 1-100 chars, trimmed
  type: 'text' | 'number' | 'boolean' | 'measured_value';
  readOnly?: boolean;     // Only valid for text/number. Default false.
  unit?: string;          // Required for measured_value
  tolerancePercentage?: number; // Optional for measured_value, positive
}

type CellValue = string | number | boolean | null | {
  expectedValue: number;
  measuredValue: number | null;
};

interface TableArtifactRequirementProps {
  index: number;
  type: 'table';
  label: ArtifactLabel;
  description: ArtifactDescription | null;
  required: boolean;
  columns: TableColumnDefProps[];   // 1-5
  rows: CellValue[][];              // 1-50, each row length === columns.length
}
```

**Factory methods:**
- `create(params)` — Validates:
  - Label via `ArtifactLabel.create()` (1-200 chars)
  - Description via `ArtifactDescription.create()` (0-1,000 chars)
  - Columns array: 1-5 items, each name trimmed and non-empty (1-100 chars), type valid
  - Column type-specific rules: `readOnly` only on text/number, `unit` required for measured_value, `tolerancePercentage` only on measured_value and must be positive
  - Rows array: 1-50 items, each row length matches column count
  - Cell-column consistency: read-only text → non-empty string, read-only number → number, fillable text/number → null, boolean → null, measured_value → `{ expectedValue: number, measuredValue: null }`
  - Throws `AuthorArtifactRequirementsInvalidError` for any structural violation
- `reconstitute(props)` — From persistence, no validation.
- `toJson()` — Serializes to the JSONB structure shown above.
- `equals(other)` — Structural comparison (deep equality on columns and rows).
- `toString()` — Debug string including column count and row count.

## Value Object: TableColumnDef

Located at `packages/domains/authoring/src/entities/value-objects/table-column-def.ts`

```typescript
interface TableColumnDefCreateParams {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'measured_value';
  readOnly?: boolean;
  unit?: string;
  tolerancePercentage?: number;
}
```

**Factory methods:**
- `create(params)` — Validates:
  - Name: trimmed, 1-100 chars
  - Type: one of the four valid types
  - `readOnly`: only accepted for text/number; stripped for boolean/measured_value
  - `unit`: required for measured_value, must be one of the 6 valid units; stripped for other types
  - `tolerancePercentage`: only accepted for measured_value, must be positive; stripped for other types
- `reconstitute(props)` — From persistence.
- `toJson()` — Serializes column definition.

## Zod Schemas

### New Schemas (packages/shared/src/schemas/specs.ts)

```typescript
// Unit enum for measured_value columns
const MeasuredValueUnitSchema = z.enum(['ms', 's', '%', 'MB', 'GB', 'req/s']);

// Column definition
const TableColumnDefSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['text', 'number', 'boolean', 'measured_value']),
  readOnly: z.boolean().optional(),
  unit: MeasuredValueUnitSchema.optional(),
  tolerancePercentage: z.number().positive().optional(),
});

// Cell value (loosely typed at schema level; strict validation in value object)
const CellValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object({
    expectedValue: z.number(),
    measuredValue: z.number().nullable(),
  }),
]);

// Request schema
const TableArtifactRequirementSchema = z.object({
  type: z.literal('table'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
  columns: z.array(TableColumnDefSchema).min(1).max(5),
  rows: z.array(z.array(CellValueSchema)).min(1).max(50),
});
```

### Response Schema

```typescript
const TableColumnDefResponseSchema = z.object({
  name: z.string(),
  type: z.enum(['text', 'number', 'boolean', 'measured_value']),
  readOnly: z.boolean().optional(),
  unit: MeasuredValueUnitSchema.optional(),
  tolerancePercentage: z.number().optional(),
});

const TableArtifactRequirementResponseSchema = z.object({
  index: z.number(),
  type: z.literal('table'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
  columns: z.array(TableColumnDefResponseSchema),
  rows: z.array(z.array(CellValueSchema)),
});
```

### Discriminated Union Update

```typescript
// Request
const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
  FileArtifactRequirementSchema,
  CheckboxArtifactRequirementSchema,
  UrlArtifactRequirementSchema,
  TableArtifactRequirementSchema,  // NEW
]);

// Response
const ArtifactRequirementResponseSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementResponseSchema,
  FileArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementResponseSchema,
  UrlArtifactRequirementResponseSchema,
  TableArtifactRequirementResponseSchema,  // NEW
]);
```

## Shared Type Exports

```typescript
// packages/shared/src/types/index.ts
export type TableArtifactRequirement = z.infer<typeof TableArtifactRequirementSchema>;
export type TableColumnDef = z.infer<typeof TableColumnDefSchema>;
export type MeasuredValueUnit = z.infer<typeof MeasuredValueUnitSchema>;
export type CellValue = z.infer<typeof CellValueSchema>;
```

## Impact on Existing Code

### ArtifactRequirements.create() (value-objects/artifact-requirements.ts)

Add `'table'` case to the type discriminator switch:

```typescript
case 'table':
  return TableArtifactRequirement.create({
    index: i,
    label: item.label,
    description: item.description,
    required: item.required,
    columns: item.columns,
    rows: item.rows,
  });
```

### CreateSpecForm.tsx — Form data mapping

Update the type union and payload mapping:

```typescript
// Type assertion
type: a.type as 'text' | 'file' | 'checkbox' | 'url' | 'table',

// Payload mapping — table type includes columns and rows
...(a.type === 'table' && {
  columns: a.columns,
  rows: a.rows,
}),
```

### ArtifactRequirementsDisplay.tsx — Type badge

Add table type badge (purple/violet):

```typescript
// Badge colors
req.type === 'table' ? '#f3e8ff' : // bg
req.type === 'table' ? '#7c3aed' : // text color
```

Add table preview rendering: column headers + row data in a read-only HTML table.

## Additional Examples

### Browser compatibility matrix (boolean columns)

```json
{
  "index": 1,
  "type": "table",
  "label": "Cross-browser smoke test results",
  "description": null,
  "required": true,
  "columns": [
    { "name": "Browser", "type": "text", "readOnly": true },
    { "name": "OS", "type": "text", "readOnly": true },
    { "name": "Passed", "type": "boolean" }
  ],
  "rows": [
    ["Chrome 120", "Windows 11", null],
    ["Chrome 120", "macOS 14", null],
    ["Firefox 121", "Windows 11", null],
    ["Safari 17", "macOS 14", null]
  ]
}
```

### Feature flag verification (mixed read-only and fillable text)

```json
{
  "index": 2,
  "type": "table",
  "label": "Feature flag state at release",
  "description": null,
  "required": true,
  "columns": [
    { "name": "Flag", "type": "text", "readOnly": true },
    { "name": "Expected State", "type": "text", "readOnly": true },
    { "name": "Actual State", "type": "text" }
  ],
  "rows": [
    ["enable-new-checkout", "enabled", null],
    ["dark-mode-beta", "disabled", null],
    ["rate-limit-v2", "enabled", null]
  ]
}
```
