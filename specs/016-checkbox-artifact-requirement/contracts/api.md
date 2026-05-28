# API Contracts: Checkbox Artifact Requirement

**Feature**: 016-checkbox-artifact-requirement
**Date**: 2026-03-10

## No New Endpoints

The checkbox artifact type does not introduce new API endpoints. It extends the existing `POST /api/orgs/:orgSlug/specs` request/response schemas.

## Modified Contract: Create Spec

### Request Body (extended)

The `artifactRequirements` array now accepts `type: 'checkbox'` in addition to `'text'` and `'file'`:

```json
{
  "title": "Verify staging deployment",
  "artifactRequirements": [
    {
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
    },
    {
      "type": "checkbox",
      "label": "No regressions observed"
    },
    {
      "type": "text",
      "label": "Paste error log output",
      "description": "Include the last 50 lines",
      "required": true
    }
  ]
}
```

**Checkbox-specific rules:**
- `type`: Must be `"checkbox"` (literal)
- `label`: Required, 1–200 chars
- `required`: Optional boolean, defaults to `false`
- No `description` field accepted (silently stripped by Zod)

### Response Body (extended)

Checkbox requirements in the response include the assigned `index`:

```json
{
  "id": "uuid",
  "title": "Verify staging deployment",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
    },
    {
      "index": 1,
      "type": "checkbox",
      "label": "No regressions observed",
      "required": false
    },
    {
      "index": 2,
      "type": "text",
      "label": "Paste error log output",
      "description": "Include the last 50 lines",
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
| >10 artifact requirements | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Unknown type (not text/file/checkbox) | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
