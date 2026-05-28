# API Contracts: Measured Value Artifact Requirement

**Feature**: 019-measured-value-artifact-requirement
**Date**: 2026-03-10

## No New Endpoints

The measured value artifact type does not introduce new API endpoints. It extends the existing `POST /api/orgs/:orgSlug/specs` and `PUT /api/orgs/:orgSlug/specs/:specId` request/response schemas.

## Modified Contract: Create/Update Spec

### Request Body (extended)

The `artifactRequirements` array now accepts `type: 'measured_value'` in addition to `'text'`, `'file'`, `'checkbox'`, `'url'`, and `'table'`:

```json
{
  "title": "Verify homepage performance",
  "artifactRequirements": [
    {
      "type": "measured_value",
      "label": "Homepage API response time",
      "description": "Measure the P95 response time of the /api/overview endpoint under normal load",
      "required": true,
      "unit": "ms",
      "expectedValue": 200,
      "tolerancePercentage": 10,
      "toleranceDescription": "Based on last quarter's P95 average"
    },
    {
      "type": "measured_value",
      "label": "Error rate",
      "required": false,
      "unit": "%",
      "expectedValue": 0.5
    },
    {
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
    }
  ]
}
```

**Measured value-specific rules:**
- `type`: Must be `"measured_value"` (literal)
- `label`: Required, 1-200 chars
- `description`: Optional, 0-1,000 chars. Empty/whitespace-only normalized to null.
- `required`: Optional boolean, defaults to `false`
- `unit`: Required. One of: `"ms"`, `"s"`, `"%"`, `"MB"`, `"GB"`, `"req/s"`
- `expectedValue`: Required. Finite number (not NaN, not Infinity). Zero, negative, and decimal values are valid.
- `tolerancePercentage`: Optional. Positive number > 0.
- `toleranceDescription`: Optional, 0-1,000 chars. Silently discarded if `tolerancePercentage` is not provided.

### Response Body (extended)

Measured value requirements in the response include the assigned `index` and normalized nullable fields:

```json
{
  "id": "uuid",
  "title": "Verify homepage performance",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "measured_value",
      "label": "Homepage API response time",
      "description": "Measure the P95 response time of the /api/overview endpoint under normal load",
      "required": true,
      "unit": "ms",
      "expectedValue": 200,
      "tolerancePercentage": 10,
      "toleranceDescription": "Based on last quarter's P95 average"
    },
    {
      "index": 1,
      "type": "measured_value",
      "label": "Error rate",
      "description": null,
      "required": false,
      "unit": "%",
      "expectedValue": 0.5,
      "tolerancePercentage": null,
      "toleranceDescription": null
    },
    {
      "index": 2,
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
    }
  ]
}
```

## Error Responses (unchanged)

No new error codes. Existing error responses apply:

| Scenario | Error Code | HTTP Status |
|----------|-----------|-------------|
| Empty or >200 char label | `AUTHOR_ARTIFACT_LABEL_INVALID` | 400 |
| Description >1,000 chars | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| >10 artifact requirements | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Unknown type | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Missing or invalid unit | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Missing expectedValue | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Non-finite expectedValue (NaN, Infinity) | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Non-positive tolerancePercentage | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Tolerance description >1,000 chars | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
