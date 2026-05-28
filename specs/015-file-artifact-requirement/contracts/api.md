# API Contracts: File Artifact Requirement

## Overview

No new API endpoints. The file artifact requirement is accepted and returned through the existing spec CRUD endpoints. This document describes the updated request/response shapes.

## POST /api/orgs/:orgSlug/specs (existing -- updated payload)

### Request Body (updated)

The `artifactRequirements` array now accepts objects with `type: 'file'` in addition to `type: 'text'`:

```json
{
  "title": "Verify deployment screenshot",
  "severity": "high",
  "artifactRequirements": [
    {
      "type": "text",
      "label": "Paste the deployment log output",
      "required": true
    },
    {
      "type": "file",
      "label": "Screenshot of the deployment dashboard",
      "description": "Upload a PNG or JPEG screenshot showing the successful deployment status",
      "required": true
    }
  ]
}
```

### File Artifact Requirement Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `type` | `'file'` | Yes | Literal discriminator |
| `label` | string | Yes | 1-200 chars after trim |
| `description` | string | No | Max 1,000 chars |
| `required` | boolean | No | Defaults to `false` |

### Response (unchanged structure)

```json
{
  "id": "uuid",
  "title": "Verify deployment screenshot",
  "artifactRequirements": [
    {
      "index": 0,
      "type": "text",
      "label": "Paste the deployment log output",
      "description": null,
      "required": true
    },
    {
      "index": 1,
      "type": "file",
      "label": "Screenshot of the deployment dashboard",
      "description": "Upload a PNG or JPEG screenshot showing the successful deployment status",
      "required": true
    }
  ]
}
```

## GET /api/orgs/:orgSlug/specs/:specId (existing -- no changes)

Returns spec with `artifactRequirements` array including both text and file types. No endpoint changes needed.

## Validation Error Responses (unchanged)

| Scenario | HTTP Status | Error Code |
|----------|-------------|------------|
| Empty/whitespace-only label | 400 | `AUTHOR_ARTIFACT_LABEL_INVALID` |
| Label > 200 chars | 400 | `AUTHOR_ARTIFACT_LABEL_INVALID` |
| Description > 1,000 chars | 400 | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` |
| > 10 artifact requirements | 400 | `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` |
| Unknown artifact type | 400 | Zod validation error (discriminated union) |
