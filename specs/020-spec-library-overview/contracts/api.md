# API Contract: Spec Library Overview

**Branch**: `020-spec-library-overview` | **Date**: 2026-03-10

## GET /api/orgs/:orgSlug/specs

List specs for an organisation with search, filtering, sorting, and pagination.

### Authentication

- Middleware: `orgScopeMiddleware` (JWT auth + org membership verification)
- Roles: All org members (owner, admin, member)

### Request

**Path Parameters**:

| Param | Type | Required |
|-------|------|----------|
| orgSlug | string | Yes |

**Query Parameters**:

| Param | Type | Default | Validation |
|-------|------|---------|------------|
| tab | `'active'` \| `'archived'` | `'active'` | Enum |
| q | string | (empty) | Max 200 chars, trimmed |
| severity | `'critical'` \| `'high'` \| `'medium'` \| `'low'` | (none) | Enum |
| sort | `'title'` \| `'system'` \| `'severity'` \| `'updated'` | `'updated'` | Enum |
| order | `'asc'` \| `'desc'` | `'desc'` | Enum |
| page | integer | `1` | Min 1 |

### Response

**200 OK**:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Login flow smoke test",
      "systemUnderTest": "Authentication Service",
      "severity": "critical",
      "tags": ["smoke", "auth", "login"],
      "updatedAt": "2026-03-10T14:30:00.000Z"
    }
  ],
  "total": 142,
  "page": 1,
  "pageSize": 25,
  "totalPages": 6
}
```

**SpecListItem fields**:

| Field | Type | Notes |
|-------|------|-------|
| id | string | UUID |
| title | string | Full title |
| systemUnderTest | string \| null | Null if not set |
| severity | string \| null | Null if not set |
| tags | string[] | Empty array if no tags |
| updatedAt | string | ISO 8601 |

**Pagination envelope**:

| Field | Type | Notes |
|-------|------|-------|
| items | SpecListItem[] | Current page results |
| total | number | Total matching specs |
| page | number | Current page (1-indexed) |
| pageSize | number | Always 25 |
| totalPages | number | ceil(total / pageSize) |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | (validation error) | Invalid query parameters |
| 401 | AUTH_TOKEN_MISSING | No auth token |
| 403 | AUTH_MEMBERSHIP_NOT_FOUND | User not a member of org |
| 404 | AUTH_ORG_NOT_FOUND | Org slug not found |
| 500 | SYS_INTERNAL | Unexpected server error |

### Notes

- Search is case-insensitive and searches across `title` and `system_under_test`
- Special characters in search (`%`, `_`, `\`) are escaped server-side
- Severity sort order: Critical > High > Medium > Low (ascending = Low first)
- Out-of-range pages return empty `items` array with correct `total` and `totalPages`
- Only list-view columns are returned (no rich text fields, test steps, or artifact requirements)
