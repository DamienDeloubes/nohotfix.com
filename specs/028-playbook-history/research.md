# Research: Playbook Change History

**Branch**: `028-playbook-history` | **Date**: 2026-03-12

## No NEEDS CLARIFICATION Items

All technical context is resolved. The feature reuses the existing changelog infrastructure with no new technology choices.

## Design Decisions

### 1. Reuse Existing Changelog Table

- **Decision**: Use the existing `changelog` table with `entity_type='playbook'`
- **Rationale**: Table already supports playbook entries (`entity_type` CHECK constraint includes `'playbook'`). Index `idx_changelog_entity` covers `(org_id, entity_type, entity_id, created_at DESC)` — optimal for the history query pattern.
- **Alternatives considered**: Separate `playbook_changelog` table — rejected because the existing table schema is identical to what's needed and the index already covers the query pattern.

### 2. Diff Detection Approach for Metadata Changes

- **Decision**: Compare old vs new playbook state field-by-field in a `recordPlaybookChanges()` use case, emitting one changelog entry per changed field (parallel to `recordSpecChanges()`).
- **Rationale**: Consistent with spec history pattern. One entry per field allows granular timeline descriptions ("changed name from X to Y") rather than generic "playbook updated" entries.
- **Alternatives considered**: Single "playbook_updated" entry with all changes in `field_changes` — rejected because it produces less readable timeline entries and doesn't align with the established per-field pattern.

### 3. Removed Member Detection

- **Decision**: Reuse the `findBySpecWithMembership()` LEFT JOIN pattern, creating a parallel `findByPlaybookWithMembership()` method on the changelog repository.
- **Rationale**: Exact same problem (actor may have left org). Exact same solution (LEFT JOIN on memberships, compute `isRemovedMember` flag).
- **Alternatives considered**: Share a single generic method — possible but would require refactoring the existing spec history method. Keep parallel methods for now; extract generic if a third entity type is added.

### 4. Changelog Recording in Archive Spec Flow

- **Decision**: When `archiveLibrarySpec()` removes specs from playbooks, the route handler records `spec_archived` entries for each affected playbook in the same transaction.
- **Rationale**: The archive use case already calls `playbookSpecRepo.removeByLibrarySpecId()`. The route handler knows which playbooks were affected (via `getArchiveImpact()`) and can record entries for each.
- **Alternatives considered**: Record inside the use case — rejected because use cases in `@nohotfix/domain-authoring` cannot import from `@nohotfix/domain-audit` (bounded context integrity). API-layer orchestration is the correct cross-context mechanism.

### 5. Section Name Denormalization in Spec-Level Actions

- **Decision**: Store `sectionName` alongside `sectionId` in `field_changes` for all spec-level actions (`spec_added`, `spec_removed`, `spec_archived`, `specs_reordered`).
- **Rationale**: Clarification Q1 — if section is later deleted, the entry must still be readable. Consistent with FR-007 (spec title denormalization).

### 6. Environment Name Denormalization

- **Decision**: Store `{oldId, oldName, newId, newName}` in `field_changes` for `environment_changed`.
- **Rationale**: Clarification Q2 — if environment is later deleted, the entry must still be readable.

### 7. History Tab Access Control

- **Decision**: Any organisation member can view playbook history (no admin role required).
- **Rationale**: Clarification Q3 — history is read-only transparency. Restricting to admins reduces audit trail value.
