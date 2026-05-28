# Feature Specification: Playbook Change History

**Feature Branch**: `028-playbook-history`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Append-only changelog tracking all mutations to playbook templates with 15 distinct action types, surfaced as a read-only History tab on the playbook editor/detail page."

## Clarifications

### Session 2026-03-12

- Q: Should spec-level actions (`spec_added`, `spec_removed`, `spec_archived`, `specs_reordered`) denormalize the section name in `field_changes` alongside `sectionId`? → A: Yes — store `sectionName` alongside `sectionId` in all spec-level actions, consistent with FR-007's denormalization principle for spec titles.
- Q: Should `environment_changed` store environment names or just IDs in `field_changes`? → A: Store both ID and name for old and new environment (e.g., `{oldName, newName, oldId, newId}`), consistent with denormalization principle.
- Q: Who can view playbook history — any org member or only admins? → A: Any organisation member can view (read-only). Only mutations require admin role.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Playbook Change History (Priority: P1)

A team lead opens a playbook and navigates to the "History" tab to see a chronological timeline of every change made to that playbook. Each entry shows who made the change, what changed, and when. The most recent changes appear first. The timeline is read-only — users can scroll through it to understand how the playbook evolved over time.

**Why this priority**: This is the core value of the feature. Without the ability to view history, recording it is pointless. Users need a transparent audit trail to understand why their playbook looks the way it does today.

**Independent Test**: Can be fully tested by creating a playbook, making several edits, then opening the History tab and verifying all changes are listed in reverse chronological order with correct actor and description.

**Acceptance Scenarios**:

1. **Given** a playbook with recorded changes, **When** a user opens the History tab, **Then** they see a paginated timeline of all changes, newest first
2. **Given** a newly created playbook with no edits, **When** a user opens the History tab, **Then** they see a single "created" entry attributed to the creator
3. **Given** a playbook with many changes, **When** a user scrolls through the timeline, **Then** additional entries load via pagination
4. **Given** a change made by a user who has since been removed from the organisation, **When** the History tab is viewed, **Then** the entry displays "Removed member" instead of the former member's name

---

### User Story 2 - Record Metadata Changes (Priority: P1)

An admin edits a playbook's name, description, or default environment. Each individual field change is recorded as a separate history entry showing the old and new value so the team can see exactly what was updated.

**Why this priority**: Metadata changes are the most common playbook edits and must be tracked from day one to provide a useful audit trail.

**Independent Test**: Can be tested by changing a playbook's name, then checking the History tab for a "name changed" entry showing the old and new name.

**Acceptance Scenarios**:

1. **Given** a playbook named "Smoke Tests", **When** an admin renames it to "Integration Tests", **Then** a history entry records "changed name from 'Smoke Tests' to 'Integration Tests'" with the admin's name and timestamp
2. **Given** a playbook with no description, **When** an admin adds a description, **Then** a history entry records the description update
3. **Given** a playbook with environment "Staging", **When** an admin clears the environment, **Then** a history entry records the environment change from "Staging" to none
4. **Given** an admin changes both the name and description in one save, **When** the update is processed, **Then** two separate history entries are recorded (one per field)

---

### User Story 3 - Record Section Changes (Priority: P1)

An admin adds, renames, or removes sections within a playbook. Each section mutation is captured as a distinct history entry, including relevant context such as the section name and (for removal) how many specs were in the section.

**Why this priority**: Section structure is fundamental to playbook organisation and changes should be visible in the audit trail alongside metadata and spec changes.

**Independent Test**: Can be tested by adding a section, renaming it, then deleting it, and verifying three distinct entries appear in the History tab.

**Acceptance Scenarios**:

1. **Given** a playbook, **When** an admin adds a section named "Regression", **Then** a history entry records "added section 'Regression'"
2. **Given** a section named "Regression", **When** an admin renames it to "Full Regression", **Then** a history entry records "renamed section from 'Regression' to 'Full Regression'"
3. **Given** a section "Regression" containing 3 specs, **When** an admin deletes the section, **Then** a history entry records "removed section 'Regression' (3 specs)"
4. **Given** a playbook with sections A, B, C, **When** an admin reorders them to C, A, B, **Then** a single history entry records "reordered sections"

---

### User Story 4 - Record Spec Assignment Changes (Priority: P1)

An admin adds a spec from the library to a playbook, removes a spec from a playbook, or reorders specs within a section. Each action is captured as a history entry with the spec title and section context.

**Why this priority**: Spec-to-playbook assignments directly affect what gets tested in a run. Tracking these changes is essential for understanding playbook evolution.

**Independent Test**: Can be tested by adding a library spec to a section, then removing it, and verifying both entries appear in the History tab with correct spec title and section name.

**Acceptance Scenarios**:

1. **Given** a playbook with a "Smoke" section, **When** an admin adds spec "Login Flow" to the section, **Then** a history entry records "added 'Login Flow' to 'Smoke'"
2. **Given** a spec "Login Flow" in the "Smoke" section, **When** an admin removes it, **Then** a history entry records "removed 'Login Flow' from 'Smoke'"
3. **Given** a spec added to the ungrouped area, **When** the History tab is viewed, **Then** the entry shows the spec was added without a section context
4. **Given** 3 specs in a section, **When** an admin reorders them, **Then** a single history entry records "reordered specs in 'Smoke'"

---

### User Story 5 - Distinguish Archived vs Manually Removed Specs (Priority: P2)

When a library spec is archived, it is automatically removed from all playbooks that reference it. The playbook history should clearly distinguish this system-triggered removal from a manual removal by an admin, so users understand why a spec disappeared.

**Why this priority**: Without this distinction, users would see "removed" entries and assume someone deliberately pulled the spec, leading to confusion and unnecessary investigation.

**Independent Test**: Can be tested by archiving a library spec that is referenced in a playbook, then checking the playbook's History tab for a "spec archived" entry (not "spec removed") attributed to whoever archived the spec.

**Acceptance Scenarios**:

1. **Given** spec "Login Flow" is in playbook "Release Checklist", **When** an admin archives "Login Flow" in the spec library, **Then** the playbook history records "archived 'Login Flow'" (not "removed")
2. **Given** a spec archived entry in the history, **When** a user views it, **Then** the entry is visually distinguishable from a manual removal (different action description)
3. **Given** spec "Login Flow" is in 3 playbooks, **When** it is archived, **Then** each playbook's history independently records the "spec archived" entry with the archiving user as the actor

---

### User Story 6 - Record Playbook Archive and Unarchive (Priority: P2)

When a playbook is archived or unarchived, a history entry captures this lifecycle event so the audit trail is complete even for playbooks that were temporarily retired.

**Why this priority**: Archive/unarchive are significant lifecycle events but less frequent than day-to-day edits. Still needed for a complete audit trail.

**Independent Test**: Can be tested by archiving and then unarchiving a playbook, and verifying both entries appear in the History tab.

**Acceptance Scenarios**:

1. **Given** an active playbook, **When** an admin archives it, **Then** a history entry records "archived this playbook"
2. **Given** an archived playbook, **When** an admin unarchives it, **Then** a history entry records "unarchived this playbook"

---

### Edge Cases

- What happens when two admins edit the same playbook concurrently? Each mutation is recorded independently with its own timestamp; no merging or conflict resolution is needed since the changelog is append-only.
- What happens when a section is deleted that contains specs? The section removal entry captures the spec count; individual spec removal entries are not generated (the section deletion is the single recorded action).
- What happens when a spec is added to a playbook but the library spec has since been deleted? The history entry preserves the spec title as it was at the time of the action (denormalized in field_changes), so the entry remains readable.
- What happens when sections or specs are reordered but the final order is the same as before? The reorder action is still recorded (the system does not compare before/after order).

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST record a changelog entry for every playbook mutation, capturing the action type, actor identity, actor name, timestamp, and structured field changes
- **FR-002**: System MUST support exactly 15 action types: `created`, `archived`, `unarchived`, `name_changed`, `description_updated`, `environment_changed`, `section_added`, `section_renamed`, `section_removed`, `sections_reordered`, `spec_added`, `spec_removed`, `spec_archived`, `specs_reordered`
- **FR-003**: System MUST record one changelog entry per individual field change when multiple metadata fields are updated in a single request (e.g., name + description = 2 entries)
- **FR-004**: System MUST record exactly one changelog entry for reorder operations, regardless of how many items changed position
- **FR-005**: System MUST distinguish between manual spec removal (`spec_removed`) and spec removal triggered by library spec archival (`spec_archived`), using different action types
- **FR-006**: For `spec_archived` entries, the actor MUST be the user who archived the spec in the library, not a system actor
- **FR-007**: System MUST denormalize the spec title into the changelog `field_changes` at the time of recording, so entries remain readable even if the library spec is later deleted
- **FR-008**: System MUST denormalize the actor name into the changelog entry at the time of recording
- **FR-009**: System MUST detect removed organisation members when displaying history and show "Removed member" instead of the former member's name
- **FR-010**: System MUST provide a paginated history endpoint for a given playbook, returning entries in reverse chronological order (newest first). Any organisation member can access this endpoint (no admin role required)
- **FR-011**: System MUST display playbook history in a read-only timeline accessible via a "History" tab on the playbook editor/detail page
- **FR-012**: Changelog writes MUST be performed within the same transaction as the playbook mutation they record
- **FR-013**: For metadata changes (`name_changed`, `description_updated`), the `field_changes` MUST capture both the old and new values
- **FR-013a**: For `environment_changed`, the `field_changes` MUST capture both ID and name for the old and new environment (e.g., `{oldId, oldName, newId, newName}`), where `null` values represent a cleared environment
- **FR-014**: For section removal, the `field_changes` MUST capture the section name and the count of specs that were in the section at the time of deletion
- **FR-015**: For reorder actions, the `field_changes` MUST capture the resulting ordered IDs array and (for spec reorder) the section context
- **FR-016**: For all spec-level actions (`spec_added`, `spec_removed`, `spec_archived`, `specs_reordered`), the `field_changes` MUST include `sectionName` alongside `sectionId` when a section is involved, so entries remain readable even if the section is later deleted

### Key Entities

- **Changelog Entry**: An immutable record of a single playbook mutation. Attributes: unique ID, organisation context, entity type (playbook), entity ID (playbook ID), action type, structured field changes, actor ID, actor display name, creation timestamp.
- **Playbook History Action**: One of 15 enumerated action types that categorise what kind of mutation occurred, grouped into lifecycle (3), metadata (3), section (4), and spec (5) categories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every playbook mutation results in exactly one changelog entry per changed field, with zero data loss across all 15 action types
- **SC-002**: Users can view the complete history of a playbook within 2 seconds of opening the History tab
- **SC-003**: History entries for removed organisation members display "Removed member" instead of stale user data in 100% of cases
- **SC-004**: Users can correctly distinguish between manually removed specs and archived specs by reading the history timeline, without needing to cross-reference other pages
- **SC-005**: History entries remain readable and accurate even after the referenced spec or section has been deleted, with zero orphaned or broken references in the timeline

## Assumptions

- The existing `changelog` table schema (with `entity_type`, `entity_id`, `action`, `field_changes` JSONB, `actor_id`, `actor_name`) is sufficient for playbook history — no migration is needed.
- Pagination follows the same pattern as the existing spec history endpoint (cursor or offset-based, as already implemented).
- The playbook editor/detail page already supports a tabbed layout or can accommodate a new "History" tab alongside existing content.
- Section deletion does not generate individual `spec_removed` entries for each spec in the section — only a single `section_removed` entry with the spec count.
- The `spec_archived` action is recorded during the spec archive flow, which already handles removal of the spec from all playbooks.
