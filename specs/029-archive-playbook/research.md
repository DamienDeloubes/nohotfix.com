# Research: Archive & Unarchive Playbook

**Branch**: `029-archive-playbook` | **Date**: 2026-03-12

## Research Summary

No NEEDS CLARIFICATION items in Technical Context. All decisions resolved through codebase exploration.

---

## Decision 1: Database Schema Changes

**Decision**: No migration required. The `playbooks` table already has `is_archived BOOLEAN NOT NULL DEFAULT FALSE` (migration 001, line 128) with an index on `(org_id, is_archived)`.

**Rationale**: The column and index were provisioned during the initial schema design. The `PlaybookRepository` port already accepts `isArchived` in its `update()` method signature and `findByOrg()` supports `includeArchived` filtering.

**Alternatives considered**:
- Adding a separate `archived_at` timestamp column: Rejected. The boolean pattern is consistent with `spec_library.is_archived` and sufficient for the feature. An `archived_at` timestamp can be derived from the changelog if ever needed.

---

## Decision 2: API Route Design (Archive/Unarchive)

**Decision**: Follow the archive-spec (027) pattern with dedicated PATCH endpoints:
- `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/archive`
- `PATCH /api/orgs/:orgSlug/playbooks/:playbookId/unarchive`
- `GET /api/orgs/:orgSlug/playbooks/:playbookId/archive-info` (returns active run count)

**Rationale**: Matches the established spec archive routes (`PATCH .../specs/:specId/archive`, `PATCH .../specs/:specId/unarchive`). Dedicated endpoints are clearer than a generic PATCH with body `{ isArchived: true }` and allow distinct middleware/authorization.

**Alternatives considered**:
- Generic `PATCH /playbooks/:id` with `{ isArchived: boolean }` in body: Rejected. The existing update route handles name/description/environment changes. Mixing archive semantics into the general update endpoint conflates two distinct user intentions and makes changelog recording ambiguous.
- `POST .../archive` / `POST .../unarchive`: Rejected. PATCH is consistent with the archive-spec pattern and semantically correct (partial resource update).

---

## Decision 3: Active Run Count for Confirmation Dialog

**Decision**: New `GET /api/orgs/:orgSlug/playbooks/:playbookId/archive-info` endpoint that returns the count of in-progress runs sourced from the playbook. This requires a new repository port `RunCountRepository` (or extending the existing `RunRepository` port in the Execution context -- but that would violate bounded context integrity). Instead, add a method to a new port in the Authoring context that queries the `runs` table for count only.

**Rationale**: The confirmation dialog needs the active run count before the user confirms. A lightweight GET endpoint is preferable to embedding this in the archive PATCH response. The Authoring domain should not import from Execution, so the query is implemented as an adapter in `apps/api` that queries the `runs` table directly, exposed through a port defined in Authoring.

**Alternatives considered**:
- Fetching run count client-side from an existing Execution endpoint: Rejected. Would require the frontend to coordinate two API calls and the Execution domain's run list endpoint may not support filtering by `playbook_id` efficiently.
- Including run count in the playbook list response: Rejected. Adds unnecessary overhead to every list request when it's only needed for the archive confirmation dialog.
- API-layer orchestration (route handler queries runs directly without a port): Acceptable shortcut. Since this is a simple count query and stays within the API layer, the route handler can query the `runs` table directly via `db` without a formal port. This avoids over-engineering a port/adapter for a single COUNT query.

**Final decision**: API-layer orchestration. The route handler for `GET .../archive-info` queries `runs` table directly for count where `playbook_id = :id AND status IN ('in_progress', 'awaiting_decision') AND org_id = :orgId`. No new port needed. This is consistent with the principle that `apps/api/src/routes/` can perform cross-context reads when orchestrating.

---

## Decision 4: Error Code for Writes to Archived Playbooks

**Decision**: Register `AUTHOR_PLAYBOOK_ARCHIVED` in the error code taxonomy. Map to HTTP 409 (Conflict). Throw from the archive/unarchive use case and from the existing playbook update/section mutation routes when the target playbook is archived.

**Rationale**: Consistent with `AUTHOR_SPEC_ARCHIVED` pattern. HTTP 409 signals a conflict with the current resource state, which is more semantically correct than 400 (bad request) or 403 (forbidden).

**Alternatives considered**:
- Reusing `AUTHOR_SPEC_ARCHIVED`: Rejected. Different entity, different error message. The error code taxonomy requires entity-specific codes.
- HTTP 403: Rejected. 403 implies authorization failure. The user has the right role; the resource state prevents the action.

---

## Decision 5: Changelog Action Types

**Decision**: Add `'archived'` and `'unarchived'` to the playbook history action types in `packages/shared/src/schemas/playbooks.ts`. The changelog entry uses `entityType: 'playbook'`, consistent with the spec archive pattern using `entityType: 'spec_library'`.

**Rationale**: Reuses the existing changelog infrastructure. The `describe-playbook-history-action.ts` UI utility in `packages/domains/audit/` needs to handle these two new action types.

**Alternatives considered**: None. This is the established pattern.

---

## Decision 6: Playbook List Filtering (Active vs Archived Tabs)

**Decision**: The existing `GET /api/orgs/:orgSlug/playbooks` endpoint already supports filtering via query parameters. Add/verify `isArchived` query parameter support. The frontend passes `{ isArchived: false }` for the Active tab and `{ isArchived: true }` for the Archived tab. Query keys use `playbookKeys.list(orgSlug, { isArchived })` for cache separation.

**Rationale**: The `PlaybookRepository.findByOrgWithCounts()` already supports `includeArchived`. The list endpoint needs to be extended (if not already) to filter by archive status.

**Alternatives considered**:
- Two separate endpoints: Rejected. Unnecessary duplication. A query parameter is the standard REST approach.

---

## Decision 7: Write Rejection on Archived Playbooks

**Decision**: The archive use case checks `isArchived` status and rejects writes with `AUTHOR_PLAYBOOK_ARCHIVED`. This guard is applied in:
1. The `archivePlaybook` use case (no-op if already archived, for idempotency)
2. Existing playbook mutation routes (update name, add section, add spec, reorder, etc.) via a `preHandler` check or inline guard

The simplest approach is a shared `preHandler` middleware that checks `playbook.is_archived` for all write routes under `/api/playbooks/:playbookId/*` (excluding the archive/unarchive endpoints themselves). This parallels the immutability guard pattern for runs.

**Rationale**: Centralised guard prevents archived playbook mutations from slipping through any route. Consistent with the immutability guard pattern.

**Alternatives considered**:
- Guard in each route handler individually: Rejected. Error-prone if new routes are added later.
- Guard in the domain use case only: Insufficient. Some routes may bypass use cases for simple operations.
