# API Contract: Text Artifact Requirement

**Feature**: 014-text-artifact-requirement

## Modified Endpoint

### POST /api/orgs/:orgSlug/specs

Create a spec with optional artifact requirements.

**Request body** (updated field only):

```json
{
  "title": "My spec",
  "artifactRequirements": [
    {
      "type": "text",
      "label": "Paste the relevant error log output",
      "description": "Include the full stack trace",
      "required": true
    },
    {
      "type": "text",
      "label": "Manual observation notes",
      "required": false
    }
  ]
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `artifactRequirements` | `ArtifactRequirement[]` | No | Max 10 items. Omit or empty array for no requirements. |
| `artifactRequirements[].type` | `'text'` | Yes | Discriminator. Only `text` supported in this feature. |
| `artifactRequirements[].label` | `string` | Yes | 1-200 chars. Trimmed server-side. |
| `artifactRequirements[].description` | `string` | No | Max 1,000 chars. Trimmed server-side. |
| `artifactRequirements[].required` | `boolean` | No | Defaults to `false`. |

**Response body** (updated field only):

```json
{
  "id": "uuid",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "text",
      "label": "Paste the relevant error log output",
      "description": "Include the full stack trace",
      "required": true
    }
  ]
}
```

Note: The response includes `index` (0-based, assigned by the server). The request does NOT include `index` — the server assigns indices based on array position.

**Error responses** (new):

| Code | HTTP | Condition |
|------|------|-----------|
| `AUTHOR_ARTIFACT_LABEL_INVALID` | 400 | Label empty, whitespace-only, or > 200 chars |
| `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` | 400 | > 10 requirements, unknown type, or description > 1,000 chars |

### GET /api/orgs/:orgSlug/specs/:specId

No changes to the endpoint contract. The `artifactRequirements` field in the response is now populated with typed data instead of `null`.

### PATCH /api/orgs/:orgSlug/specs/:specId

Accepts `artifactRequirements` in the same format as POST. Setting to `null` or omitting removes all requirements.
