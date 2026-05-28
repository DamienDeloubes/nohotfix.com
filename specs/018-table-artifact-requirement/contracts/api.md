# API Contracts: Table Artifact Requirement

**Feature**: 018-table-artifact-requirement
**Date**: 2026-03-10

## No New Endpoints

The table artifact type does not introduce new API endpoints. It extends the existing `POST /api/orgs/:orgSlug/specs` request/response schemas.

## Modified Contract: Create Spec

### Request Body (extended)

The `artifactRequirements` array now accepts `type: 'table'` in addition to `'text'`, `'file'`, `'checkbox'`, and `'url'`:

```json
{
  "title": "API performance validation",
  "artifactRequirements": [
    {
      "type": "table",
      "label": "API endpoint load times",
      "description": "Measure response times for all critical endpoints under normal load",
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
    },
    {
      "type": "checkbox",
      "label": "I verified no performance regressions",
      "required": true
    }
  ]
}
```

**Table-specific rules:**
- `type`: Must be `"table"` (literal)
- `label`: Required, 1-200 chars
- `description`: Optional, 0-1,000 chars. Empty/whitespace-only normalized to null.
- `required`: Optional boolean, defaults to `false`
- `columns`: Required array, 1-5 items
  - `name`: Required, 1-100 chars
  - `type`: Required, one of `"text"`, `"number"`, `"boolean"`, `"measured_value"`
  - `readOnly`: Optional boolean, only valid for `text`/`number` columns (default `false`)
  - `unit`: Required for `measured_value` columns. One of: `"ms"`, `"s"`, `"%"`, `"MB"`, `"GB"`, `"req/s"`
  - `tolerancePercentage`: Optional positive number, only valid for `measured_value` columns
- `rows`: Required array, 1-50 items. Each row is an array of cell values matching column order.
  - Cell value format depends on column type (see data-model.md)
  - Each row must have exactly as many cells as there are columns

### Response Body (extended)

Table requirements in the response include the assigned `index`:

```json
{
  "id": "uuid",
  "title": "API performance validation",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "table",
      "label": "API endpoint load times",
      "description": "Measure response times for all critical endpoints under normal load",
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
    },
    {
      "index": 1,
      "type": "checkbox",
      "label": "I verified no performance regressions",
      "required": true
    }
  ]
}
```

## Error Responses (unchanged)

No new error codes. Existing error responses apply with descriptive messages:

| Scenario | Error Code | HTTP Status |
|----------|-----------|-------------|
| Empty or >200 char label | `AUTHOR_ARTIFACT_LABEL_INVALID` | 400 |
| Description >1,000 chars | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| >10 artifact requirements | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Unknown type | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| <1 or >5 columns | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| <1 or >50 rows | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Empty column name | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Column name >100 chars | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Missing unit on measured_value column | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Invalid unit value | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Row cell count != column count | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Read-only text cell with empty/null value | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Read-only number cell with null value | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| measured_value cell with missing expectedValue | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Non-positive tolerancePercentage | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
