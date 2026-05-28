# Spec Configuration — Inputs & Required Artifacts

> Defines what a Spec contains at authoring time and how artifact requirements are structured.

---

## Spec Input Fields

### Core Fields

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `title` | string | Required. 1–200 chars. Trimmed. | Short identifier for the spec. |
| `severity` | enum | `critical`, `high`, `medium`, `low` | Defaults to `medium`. |
| `systemUnderTest` | string \| null | Optional. Free-text. | Combobox with suggestions from existing specs. |
| `preconditions` | rich text | Optional. Max 5,000 chars (plain text). | Setup instructions, environment requirements, prerequisites. |
| `description` | rich text | Optional. Max 10,000 chars (plain text). | Test objective and purpose. The longest field. |
| `testSteps` | ordered list | Optional. Max 50 steps. Drag-reorderable. | Each step has an `instruction` (required) and optional `expectedOutcome`. |
| `expectedResult` | rich text | Optional. Max 5,000 chars (plain text). | Overall pass/fail criterion for the spec. |
| `testerNotes` | string \| null | Optional. Max 2,000 chars. Trimmed. | Plain text advisory context for the tester. |
| `estimatedDurationMinutes` | integer \| null | Optional. 1–999 minutes. | Used to calculate total estimated time at playbook and section level (simple sum). |
| `tags` | string[] | Optional. Max 10 tags. Each tag max 30 chars. | Auto-transformed to kebab-case. Combobox with suggestions from existing specs (same pattern as `systemUnderTest`). |
| `artifactRequirements` | ArtifactRequirement[] | Optional. Max 10 items. | See artifact types below. |

### Field Details

**Rich text fields** (`preconditions`, `description`, `expectedResult`) use TipTap and are stored as JSONB in a versioned envelope `{ version: 1, doc: <tiptap-json> }`. Empty documents are normalized to `null`. Character limits apply to extracted plain text content, not the JSON structure.

**Tags** are always stored and displayed in kebab-case (e.g. `smoke-test`, `api-regression`). The UI auto-transforms user input. Duplicate tags (after transformation) are silently deduplicated.

**Estimated duration** rolls up to playbook and section level as a simple sum of all contained specs. Specs without a duration are excluded from the sum.

### Future Candidates (post-v1)

| Field | Type | Rationale |
|---|---|---|
| `externalId` | string \| null | Link to external test management system (Jira XRay, TestRail). Enterprise value. |

---

## Artifact Requirement Types

Six artifact types that a spec author can add as required evidence. Each has a `label`, optional `description`, and `required` flag.

### 1. `file`

File upload via presigned URL. The system enforces a global **10 MB max file size** and a global set of allowed file extensions — these are not configurable per requirement.

**Author configures:**
- `label` — what file to upload (e.g. "Screenshot of the confirmation page")
- `description` (optional) — hint or guidance for the tester
- `required` — whether the spec cannot be marked as passed without this file

**Use cases:** UI screenshots, error log exports, test reports, security scan outputs, config snapshots.

### 2. `text`

Free-form text input from the tester. Zero storage cost.

**Author configures:**
- `label` — what text to provide (e.g. "Paste the relevant error log output")
- `description` (optional) — guidance on what to include
- `required`

**Use cases:** Log output, observed error messages, CLI command output, manual observation notes.

### 3. `checkbox`

Simple boolean confirmation. The label is the confirmation statement itself.

**Author configures:**
- `label` — the statement the tester confirms (e.g. "I ran the E2E tests for the NKC funnels")
- `required`

**Use cases:** "I verified this in staging", "No regressions observed", "Rollback plan reviewed", "Security review completed".

### 4. `url`

A link to external evidence. The system validates it is a valid URL — no pattern restrictions.

**Author configures:**
- `label` — what URL to provide (e.g. "CI Pipeline URL")
- `description` (optional) — guidance on what link is expected (e.g. "Provide the GitHub Actions run URL for the main branch build")
- `required`

**Use cases:** CI/CD pipeline runs, staging deployment URLs, Sentry issues, Jira/Linear tickets, Datadog dashboards, Loom recordings, PR previews.

### 5. `measured_value`

A numeric measurement with an expected value and optional tolerance for visual pass/fail indication.

**Author configures:**
- `label` — what is being measured (e.g. "Homepage API response time")
- `description` (optional) — explanation of what should be measured and how
- `unit` — from a fixed set: `ms`, `s`, `%`, `MB`, `GB`, `req/s`
- `expectedValue` — the target number (e.g. 200)
- `tolerancePercentage` (optional) — acceptable deviation as a percentage (e.g. 10 means ±10%)
- `toleranceDescription` (optional) — explains where the tolerance baseline comes from (e.g. "Based on last quarter's P95 average")
- `required`

**Tester fills in during run:**
- `measuredValue` — the actual observed number

**Display behavior:**
- When `tolerancePercentage` is configured: the measured value is shown in **green** if within the tolerance range, **red** if outside it.
- When no tolerance is configured: the measured and expected values are displayed side by side without color coding.
- An out-of-tolerance value is **informational only** — it does not block the tester from marking the spec as passed or failed. The tester retains full control over the pass/fail decision.
- Out-of-tolerance measurements are surfaced as warnings in the run overview and the go/no-go decision screen, so reviewers have visibility without needing to dig into each spec.

**Use cases:** API response times, error rates, memory usage, Apdex scores, CVSS vulnerability scores, load test throughput.

### 6. `table`

Structured tabular data with author-defined columns and rows. The author defines the full table structure; the tester fills in designated columns during execution.

**Constraints:**
- Min 1, max **5 columns**
- Min 1, max **50 rows**
- All rows are defined by the author — the tester cannot add or remove rows

**Author configures:**
- `label` — what the table represents (e.g. "API endpoint load times")
- `description` (optional) — guidance for the tester
- `required`
- `columns` — the column definitions (see below)
- `rows` — the row data (see below)

**Column types:**

| Type | Description | Editable by tester? |
|---|---|---|
| `text` | Free text value | Configurable: read-only (author-set) or fillable by tester |
| `number` | Plain numeric value | Configurable: read-only (author-set) or fillable by tester |
| `boolean` | Pass/fail toggle | Always fillable by tester |
| `measured_value` | Numeric measurement with built-in expected value | Always fillable by tester (measured part) |

**Column definition fields:**

| Field | Type | Notes |
|---|---|---|
| `name` | string | Column header label. Required. |
| `type` | `text`, `number`, `boolean`, `measured_value` | Required. |
| `readOnly` | boolean | For `text` and `number` columns: if true, the author sets the values and the tester cannot edit them. Not applicable to `boolean` or `measured_value`. |
| `unit` | string \| null | For `measured_value` columns only. Fixed set: `ms`, `s`, `%`, `MB`, `GB`, `req/s`. |
| `tolerancePercentage` | number \| null | For `measured_value` columns only. Applies to all rows in the column. Same green/red behavior as standalone measured values. |

**`measured_value` cells** are self-contained — each cell stores both the `expectedValue` (set by the author, read-only) and the `measuredValue` (filled by the tester). The tolerance percentage is defined once at the column level and applies uniformly to all rows.

**Row data:** Each row is an array of cell values matching the column order. Cell value format depends on the column type:

| Column type | Author sets | Tester fills in |
|---|---|---|
| `text` (read-only) | The text value | — |
| `text` (fillable) | `null` (empty) | The text value |
| `number` (read-only) | The number value | — |
| `number` (fillable) | `null` (empty) | The number value |
| `boolean` | `null` (unchecked) | `true` or `false` |
| `measured_value` | `expectedValue` | `measuredValue` |

**Example — "Overview load times":**

```
label: "API endpoint load times"
columns: [
  { name: "Endpoint",      type: "text",           readOnly: true },
  { name: "Response Time",  type: "measured_value",  unit: "ms", tolerancePercentage: 10 }
]
rows: [
  ["/api/overview",  { expectedValue: 200, measuredValue: null }],
  ["/api/releases",  { expectedValue: 300, measuredValue: null }],
  ["/api/specs",     { expectedValue: 250, measuredValue: null }]
]
```

The tester sees:

| Endpoint | Response Time (ms) |
|---|---|
| /api/overview | expected: 200 — measured: *(fill in)* |
| /api/releases | expected: 300 — measured: *(fill in)* |
| /api/specs | expected: 250 — measured: *(fill in)* |

Each measured value is color-coded green/red based on the ±10% tolerance. Out-of-tolerance values are warnings only — the tester decides pass/fail.

**Example — "Browser compatibility matrix":**

```
label: "Cross-browser smoke test results"
columns: [
  { name: "Browser",  type: "text",     readOnly: true },
  { name: "OS",       type: "text",     readOnly: true },
  { name: "Passed",   type: "boolean" }
]
rows: [
  ["Chrome 120",  "Windows 11",  null],
  ["Chrome 120",  "macOS 14",    null],
  ["Firefox 121", "Windows 11",  null],
  ["Safari 17",   "macOS 14",    null]
]
```

**Example — "Feature flag verification":**

```
label: "Feature flag state at release"
columns: [
  { name: "Flag",           type: "text",   readOnly: true },
  { name: "Expected State", type: "text",   readOnly: true },
  { name: "Actual State",   type: "text",   readOnly: false }
]
rows: [
  ["enable-new-checkout",   "enabled",   null],
  ["dark-mode-beta",        "disabled",  null],
  ["rate-limit-v2",         "enabled",   null]
]
```

---

## Artifact Requirement Schema

```typescript
interface BaseArtifactRequirement {
  index: number;           // 0-based position, used as FK via requirement_index
  label: string;           // Required, max 200 chars
  description?: string;    // Optional guidance, max 1,000 chars
  required: boolean;       // If true, spec cannot be marked passed without this artifact
}

// --- File ---

interface FileArtifactRequirement extends BaseArtifactRequirement {
  type: 'file';
  // No type-specific config. File size and extensions enforced globally by the system.
}

// --- Text ---

interface TextArtifactRequirement extends BaseArtifactRequirement {
  type: 'text';
}

// --- Checkbox ---

interface CheckboxArtifactRequirement extends BaseArtifactRequirement {
  type: 'checkbox';
  // label is the confirmation statement. No description needed.
}

// --- URL ---

interface UrlArtifactRequirement extends BaseArtifactRequirement {
  type: 'url';
  // System validates it is a valid URL. No pattern restrictions.
}

// --- Measured Value ---

type MeasuredValueUnit = 'ms' | 's' | '%' | 'MB' | 'GB' | 'req/s';

interface MeasuredValueArtifactRequirement extends BaseArtifactRequirement {
  type: 'measured_value';
  unit: MeasuredValueUnit;
  expectedValue: number;
  tolerancePercentage?: number;      // e.g. 10 means ±10%
  toleranceDescription?: string;     // Explains where the tolerance comes from
}

// --- Table ---

type TableColumnType = 'text' | 'number' | 'boolean' | 'measured_value';

interface TableColumnDef {
  name: string;                          // Column header label
  type: TableColumnType;
  readOnly?: boolean;                    // For text/number only. Default: false
  unit?: MeasuredValueUnit;              // For measured_value columns only
  tolerancePercentage?: number;          // For measured_value columns only
}

// Cell value types per column type:
// - text:           string | null
// - number:         number | null
// - boolean:        boolean | null
// - measured_value: { expectedValue: number; measuredValue: number | null }

type CellValue = string | number | boolean | null | {
  expectedValue: number;
  measuredValue: number | null;
};

interface TableArtifactRequirement extends BaseArtifactRequirement {
  type: 'table';
  columns: TableColumnDef[];     // Min 1, max 5 columns
  rows: CellValue[][];           // Min 1, max 50 rows. Each row matches column order.
}

// --- Union ---

type ArtifactRequirement =
  | FileArtifactRequirement
  | TextArtifactRequirement
  | CheckboxArtifactRequirement
  | UrlArtifactRequirement
  | MeasuredValueArtifactRequirement
  | TableArtifactRequirement;
```

---

## Key Design Decisions

1. **`index` is explicit, not derived from array position.** Survives reordering during edits without corrupting existing run data that references `requirement_index`.

2. **`required` is per-requirement, not per-spec.** Some artifacts are "nice to have" (e.g. a Loom recording URL) while others are blocking (e.g. a deployment screenshot). This flag drives the enforcement gate at execution time.

3. **Max 10 requirements per spec.** Most specs should have 1–3. Beyond 10, the spec is likely doing too much and should be split.

4. **File constraints are system-global, not per-requirement.** The 10 MB file size limit and allowed file extensions are enforced by the system. Spec authors do not configure these.

5. **Measured values use tolerance, not threshold operators.** Instead of `lte`/`gte`/`eq`, the author sets an `expectedValue` and optional `tolerancePercentage`. Color coding (green/red) is informational only — it never blocks the tester from passing or failing a spec. Out-of-tolerance values surface as warnings in the run overview and go/no-go decision screen.

6. **Table rows are author-defined.** The tester fills in designated columns but cannot add or remove rows. This ensures structural consistency across runs.

---

## Enforcement Flow

```
Spec Authoring                    Run Execution
─────────────                    ─────────────
artifact_requirements[] ──snapshot──► run_specs.artifact_requirements[]
                                          │
                                          ▼
                                  Tester submits artifact
                                          │
                                          ▼
                                  System validates:
                                  1. Type matches requirement[index].type
                                  2. Global rules (file size, valid URL, etc.)
                                  3. Persists to run_spec_artifacts
                                          │
                                          ▼
                                  On spec completion attempt:
                                  - All required=true requirements have artifacts → allow
                                  - Missing required artifacts → blocked
                                          │
                                          ▼
                                  Tolerance warnings surface in:
                                  - Spec card in run overview (warning badge)
                                  - Go/no-go decision screen (heads-up section)
```

---

## Validation Rules Summary

| Type | Rule | Value |
|---|---|---|
| file | Max size | 10 MB (system-enforced) |
| file | Allowed extensions | System-enforced global set |
| text | Max length | 10,000 chars |
| checkbox | Value | Must be `true` to satisfy requirement |
| url | Format | Valid URL |
| measured_value | Value | Finite, non-NaN number |
| measured_value | Tolerance | Visual only (green/red), never blocks pass/fail |
| table | Max columns | 5 |
| table | Max rows | 50 |
| table | Row management | Author-defined only, tester cannot add/remove |
| table | measured_value cells | Same tolerance behavior as standalone measured values |
