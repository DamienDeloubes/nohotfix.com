# Research: Spec History

**Branch**: `022-spec-history` | **Date**: 2026-03-11

## Decision 1: New Table vs Reuse Existing Changelog

**Decision**: Reuse the existing `changelog` table — no new table or migration needed.

**Rationale**: The `changelog` table already has:
- `entity_type` supporting `'spec_library'`
- `action` as a generic string (supports granular action types like `title_changed`, `artifact_added`)
- `field_changes` as JSONB (supports `{ old, new }` structure per field)
- `actor_id` referencing `users(id)` + `actor_name` for display
- `org_id` for tenancy, `entity_id` for the spec, `created_at` for timestamp
- An index on `(org_id, entity_type, entity_id, created_at DESC)` — ideal for reverse-chronological queries

**Alternatives considered**:
- New `spec_history` table: Rejected — duplicates `changelog` structure exactly. Would require a new migration, repository, and adapter for no gain.

## Decision 2: One Entry Per Changed Field

**Decision**: Create N separate `changelog` entries when N fields change in a single save, all with the same `created_at` timestamp.

**Rationale**: Matches FR-013 from the spec. Each entry has a specific `action` type (e.g. `title_changed`) and its own `field_changes` payload. This makes the timeline granular and each entry self-describing.

**Implementation**: The route handler (or a dedicated history service) compares old entity state vs new state, then calls `recordChangelog()` once per detected change using the same ISO timestamp.

**Alternatives considered**:
- Single entry with multiple fields in `field_changes`: Rejected — the spec explicitly requires one entry per field for granular timeline display.

## Decision 3: Removed Member Detection

**Decision**: On read, LEFT JOIN `memberships` to detect whether the `actor_id` is still a member of the org. If no membership row exists, display "Removed member".

**Rationale**: The `actor_id` and `actor_name` are already stored in `changelog`. By checking current membership status at read time, we get accurate "Removed member" labels without needing to update old history entries when a member is removed.

**Alternatives considered**:
- Store a `is_member` flag on changelog entries and update on member removal: Rejected — violates append-only nature of changelog and adds complexity to member removal flow.
- Always use `actor_name` as-is: Rejected — spec requires "Removed member" label for removed users.

## Decision 4: Where Change Detection Lives

**Decision**: Change detection logic lives in a new `recordSpecChanges` function in the Audit domain (`packages/domains/audit/src/use-cases/`). It accepts old and new spec state, computes diffs, and calls `recordChangelog()` for each detected change.

**Rationale**: Change detection is audit/history logic, not authoring business logic. The Authoring domain's `updateLibrarySpec` use case handles validation and persistence; the route handler then calls `recordSpecChanges` with the before/after snapshots. This follows the existing pattern where `recordChangelog` is called from the route handler (as seen in the create-spec route).

**Alternatives considered**:
- Embed change detection in `updateLibrarySpec`: Rejected — mixes authoring concerns with audit concerns; violates bounded context integrity.
- Database trigger: Rejected — overly complex for v1; JSONB diffing in SQL is fragile.

## Decision 5: History Read Endpoint

**Decision**: Implement `getSpecChangelog` use case (currently a stub) and expose via `GET /api/orgs/:orgSlug/specs/:specId/history`.

**Rationale**: The `getSpecChangelog` use case already exists as a stub in `packages/domains/audit/src/use-cases/`. The endpoint returns all history entries for a spec (no pagination per spec requirement). The query uses the existing `idx_changelog_entity` index.

## Decision 6: Frontend Tab Implementation

**Decision**: Add a "History" tab to the existing spec detail page using the same inline-style tab pattern already established in the spec library index page (active/archived tabs).

**Rationale**: Follows existing UI patterns. The spec detail route (`$specId.tsx`) will manage tab state. A new `SpecHistoryTimeline` component in `packages/domains/authoring/src/ui/components/` renders the timeline. Uses relative time formatting (e.g. "2 hours ago").

## Decision 7: Action Type Values

**Decision**: Use these `action` string values in changelog entries:

| Action | `field_changes` content |
|--------|------------------------|
| `created` | None (already used by create-spec) |
| `title_changed` | `{ title: { old: "X", new: "Y" } }` |
| `description_updated` | None (no content diff) |
| `tags_changed` | `{ tags: { old: ["a","b"], new: ["a","c"] } }` |
| `duration_changed` | `{ estimated_duration_minutes: { old: 30, new: 60 } }` |
| `artifact_added` | `{ artifact: { old: null, new: { label: "Screenshot", ...config } } }` |
| `artifact_removed` | `{ artifact: { old: { label: "Screenshot", ...config }, new: null } }` |
| `artifact_modified` | `{ artifact: { old: { label: "Screenshot", ...oldConfig }, new: { label: "Screenshot", ...newConfig } } }` |

**Rationale**: Consistent with the existing `action: 'created'` pattern. Granular action types enable human-readable timeline messages without parsing `field_changes`.
