# Research: Playbook & Sections Configuration

**Branch**: `025-playbook-configuration` | **Date**: 2026-03-11

## R1: Ungrouped Specs — section_id Nullability

**Decision**: Make `playbook_specs.section_id` nullable via migration 007.

**Rationale**: The feature requires ungrouped specs (specs not belonging to any section) at the top of the playbook editor. The current schema has `section_id UUID NOT NULL REFERENCES playbook_sections(id) ON DELETE CASCADE`. Making it nullable allows ungrouped specs to have `section_id = NULL` while still belonging to a playbook via `playbook_id`.

**Alternatives considered**:
- **Sentinel "ungrouped" section**: Create a hidden section per playbook to hold ungrouped specs. Rejected — adds hidden state, complicates queries (filtering out the sentinel), and makes the data model lie about its intent.
- **Separate `playbook_ungrouped_specs` table**: Rejected — duplicates the `playbook_specs` structure; doubles query complexity for duplicate checks.

**Impact**: Migration 007 (additive, non-destructive). Schema type change: `section_id: string | null`. Port and domain type change: `sectionId: string | null`. Existing FK `ON DELETE CASCADE` still works for sectioned specs; ungrouped specs won't cascade (they have no section to delete).

## R2: Spec Denormalization in playbook_specs

**Decision**: When adding a library spec to a playbook, copy the spec's data fields (title, severity, system_under_test, description, test_steps, etc.) into the `playbook_specs` row AND set `spec_library_id` to link back.

**Rationale**: The `playbook_specs` table was designed to hold a full copy of spec data for the snapshot service (when a run starts, the playbook is deep-copied to run tables). The `spec_library_id` FK is used for UI purposes — detecting duplicates in the picker and linking back to the library for editing.

**Alternatives considered**:
- **Store only the FK, join at read time**: Rejected — breaks the snapshot service contract; if a library spec is edited after being added to a playbook, the run would get the wrong data.
- **Sync on demand**: Too complex for v1; spec sync is a separate future feature.

## R3: Duplicate Spec Detection

**Decision**: Check uniqueness by `(playbook_id, spec_library_id)` pair. A spec library entry can appear at most once per playbook (across all sections and ungrouped).

**Rationale**: The feature explicitly prevents duplicate specs within a single playbook (FR-005). The `spec_library_id` column is the natural duplicate key. The port method `existsInPlaybook(playbookId, specLibraryId, orgId)` performs this check.

**Impact**: New port method on `PlaybookSpecRepository`. The use case throws `AUTHOR_PLAYBOOK_SPEC_DUPLICATE` if the check fails.

## R4: Position Management Strategy

**Decision**: Use integer positions with gap-based reordering. On reorder, receive the full ordered list of IDs and batch-update positions sequentially (0, 1, 2, ...).

**Rationale**: Simpler than fractional indexing. Position gaps never accumulate because reorder always normalizes. The editor sends the complete ordered array after drag-and-drop, so the server always has the authoritative order.

**Alternatives considered**:
- **Fractional indexing**: Rejected — over-engineering for a feature with max ~100 items per container.
- **Linked list (prev/next)**: Rejected — complex for batch queries and harder to reason about.

**Impact**: Reorder endpoints accept `{ orderedIds: string[] }` and batch-update all positions in a single query.

## R5: TransactionalRoot Extension

**Decision**: Extend `TransactionalRoot` in `with-transaction.ts` to include `playbookRepo`, `playbookSectionRepo`, and `playbookSpecRepo`.

**Rationale**: Section deletion with cascading spec removal, and spec addition (duplicate check + insert) need transactional consistency. The existing `withTransaction` pattern provides this.

**Impact**: Update `TransactionalRoot` interface and `createWithTransaction` factory to instantiate playbook repositories within the transaction.

## R6: Port Interface Extensions

**Decision**: Extend existing port interfaces to support the feature's query patterns.

### PlaybookRepository additions:
- `findByOrgWithCounts(orgId: string, includeArchived?: boolean)`: Returns playbooks with `specCount` and environment name for the list page (avoids N+1 queries).

### PlaybookSpecRepository additions:
- `findByPlaybook(playbookId: string, orgId: string)`: All specs in a playbook (for editor load).
- `findUngrouped(playbookId: string, orgId: string)`: Specs where `section_id IS NULL`.
- `updatePositions(updates: Array<{ id: string; position: number }>, orgId: string)`: Batch position update.
- `existsInPlaybook(playbookId: string, specLibraryId: string, orgId: string)`: Duplicate check.
- `deleteBySectionId(sectionId: string, orgId: string)`: Delete all specs in a section (for section deletion — although CASCADE handles this at DB level, explicit deletion is cleaner for the use case to log/track).

## R7: New Error Codes

**Decision**: Register three new error codes in `AUTHOR_*` namespace.

| Code | HTTP | When |
|------|------|------|
| `AUTHOR_SECTION_NOT_FOUND` | 404 | Section ID does not exist or belongs to another org |
| `AUTHOR_PLAYBOOK_NAME_INVALID` | 400 | Playbook name empty or exceeds 255 chars |
| `AUTHOR_PLAYBOOK_SPEC_DUPLICATE` | 409 | Spec already exists in this playbook |

## R8: Spec Library Search for Picker

**Decision**: Reuse the existing `SpecLibraryRepository.findByOrg()` method with a search filter for the spec picker. The picker needs: `id`, `title`, `severity`, `system_under_test` — a lightweight projection.

**Rationale**: The spec library repository already supports filtering. Adding a `search` parameter (title ILIKE) and a lightweight projection avoids creating a separate query path.

**Impact**: May need a new port method `searchForPicker(orgId, query)` that returns minimal fields, or reuse existing list with a search param. Decision deferred to implementation — both approaches are valid.
