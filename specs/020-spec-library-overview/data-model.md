# Data Model: Spec Library Overview

**Branch**: `020-spec-library-overview` | **Date**: 2026-03-10

## Existing Tables (No Migration Required)

### spec_library

All columns already exist. No schema changes needed.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID (PK) | No | Auto-generated |
| org_id | UUID (FK → organisations) | No | Tenant isolation key |
| title | TEXT | No | Searchable (GIN trigram index) |
| system_under_test | TEXT | Yes | Searchable (ILIKE) |
| severity | ENUM ('critical','high','medium','low') | Yes | Filterable, sortable |
| tags | JSONB (string[]) | Yes | Default `[]`, GIN indexed |
| is_archived | BOOLEAN | No | Default `false`, indexed with org_id |
| created_at | TIMESTAMPTZ | No | Auto-set |
| updated_at | TIMESTAMPTZ | No | Auto-set, used for default sort |
| created_by | UUID (FK → users) | No | — |
| preconditions | JSONB | Yes | Not used in list view |
| description | JSONB | Yes | Not used in list view |
| test_steps | JSONB | Yes | Not used in list view |
| expected_result | JSONB | Yes | Not used in list view |
| artifact_requirements | JSONB | Yes | Not used in list view |
| tester_notes | TEXT | Yes | Not used in list view |
| estimated_duration_minutes | INTEGER | Yes | Not used in list view |

### Existing Indexes

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| idx_specs_org_title | (org_id, title) | GIN trigram | Accelerates ILIKE search on title |
| (unnamed) | (org_id, is_archived) | B-tree | Active/archived tab filtering |
| (unnamed) | (tags) | GIN | Tag filtering (future use) |

## Query Patterns

### List Specs (Primary Query)

```sql
SELECT id, title, system_under_test, severity, tags, is_archived, updated_at
FROM spec_library
WHERE org_id = $orgId
  AND is_archived = $isArchived
  AND ($search IS NULL OR (title ILIKE $searchPattern OR system_under_test ILIKE $searchPattern))
  AND ($severity IS NULL OR severity = $severity)
ORDER BY $sortColumn $sortOrder
LIMIT 25 OFFSET $offset
```

**Note**: Only select columns needed for the list view (not rich text JSONB fields) to minimize data transfer.

### Count Query (For Pagination)

```sql
SELECT COUNT(*) as total
FROM spec_library
WHERE org_id = $orgId
  AND is_archived = $isArchived
  AND ($search IS NULL OR (title ILIKE $searchPattern OR system_under_test ILIKE $searchPattern))
  AND ($severity IS NULL OR severity = $severity)
```

## New Interfaces

### ListSpecsQuery (Use Case Input)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| orgId | string | (required) | Tenant isolation |
| tab | 'active' \| 'archived' | 'active' | Maps to `is_archived` |
| search | string \| undefined | undefined | Search term (min 1 char, unescaped) |
| severity | 'critical' \| 'high' \| 'medium' \| 'low' \| undefined | undefined | Severity filter |
| sort | 'title' \| 'system' \| 'severity' \| 'updated' | 'updated' | Sort column |
| order | 'asc' \| 'desc' | 'desc' | Sort direction |
| page | number | 1 | Page number (1-indexed) |

### ListSpecsResult (Use Case Output)

| Field | Type | Notes |
|-------|------|-------|
| items | SpecListItem[] | Page of specs |
| total | number | Total matching count |
| page | number | Current page |
| pageSize | number | Always 25 |
| totalPages | number | ceil(total / pageSize) |

### SpecListItem (DTO)

| Field | Type | Notes |
|-------|------|-------|
| id | string | Spec UUID |
| title | string | Full title (truncation is frontend concern) |
| systemUnderTest | string \| null | — |
| severity | 'critical' \| 'high' \| 'medium' \| 'low' \| null | — |
| tags | string[] | All tags (overflow display is frontend concern) |
| updatedAt | string | ISO 8601 datetime |

## Severity Sort Mapping

For `ORDER BY severity`, use a CASE expression:

| Severity | Sort Value (ascending) |
|----------|----------------------|
| low | 1 |
| medium | 2 |
| high | 3 |
| critical | 4 |
| NULL | 0 (sorts before low) |
