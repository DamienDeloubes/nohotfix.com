# API Contracts: URL Artifact Requirement

**Feature**: 017-url-artifact-requirement
**Date**: 2026-03-10

## No New Endpoints

The URL artifact type does not introduce new API endpoints. It extends the existing `POST /api/orgs/:orgSlug/specs` request/response schemas.

## Modified Contract: Create Spec

### Request Body (extended)

The `artifactRequirements` array now accepts `type: 'url'` in addition to `'text'`, `'file'`, and `'checkbox'`:

```json
{
  "title": "Verify deployment pipeline",
  "artifactRequirements": [
    {
      "type": "url",
      "label": "CI Pipeline URL",
      "description": "Provide the GitHub Actions run URL for the main branch build",
      "required": true
    },
    {
      "type": "url",
      "label": "Staging Deployment URL",
      "required": false
    },
    {
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
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

**URL-specific rules:**
- `type`: Must be `"url"` (literal)
- `label`: Required, 1-200 chars
- `description`: Optional, 0-1,000 chars. Empty/whitespace-only normalized to null.
- `required`: Optional boolean, defaults to `false`

### Response Body (extended)

URL requirements in the response include the assigned `index`:

```json
{
  "id": "uuid",
  "title": "Verify deployment pipeline",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "url",
      "label": "CI Pipeline URL",
      "description": "Provide the GitHub Actions run URL for the main branch build",
      "required": true
    },
    {
      "index": 1,
      "type": "url",
      "label": "Staging Deployment URL",
      "description": null,
      "required": false
    },
    {
      "index": 2,
      "type": "checkbox",
      "label": "I verified this in staging",
      "required": true
    },
    {
      "index": 3,
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
| Description >1,000 chars | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| >10 artifact requirements | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
| Unknown type (not text/file/checkbox/url) | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 |
