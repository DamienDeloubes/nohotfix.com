# Feature Specification: Spec History

**Feature Branch**: `022-spec-history`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Spec History — complete audit trail of every change made to a spec in the Spec Library"

## Clarifications

### Session 2026-03-11

- Q: Where on the spec detail page should the history timeline appear? → A: Dedicated "History" tab alongside spec content.
- Q: Should existing specs receive a backfilled "created" history entry? → A: No backfill — existing specs show empty history; only new changes going forward are tracked.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Spec Change History (Priority: P1)

As any organisation member, I want to see a chronological timeline of all changes made to a spec so that I understand how it evolved, who changed what, and when.

**Why this priority**: The entire feature's value is delivering visibility into spec changes. Without displaying history, nothing else matters.

**Independent Test**: Can be fully tested by creating a spec, making several edits, then navigating to the spec detail page and verifying the history timeline shows all changes in reverse chronological order.

**Acceptance Scenarios**:

1. **Given** a spec with multiple recorded changes, **When** any organisation member navigates to the "History" tab on the spec detail page, **Then** they see a timeline of all changes ordered newest first.
2. **Given** a spec with history entries, **When** the member reads the timeline, **Then** each entry displays the actor's name, the action description, and a relative timestamp (e.g. "2 hours ago").
3. **Given** a spec with no edits since creation, **When** the member views the history, **Then** they see a single "created this spec" entry.

---

### User Story 2 - Record Granular Field Changes on Save (Priority: P1)

As the system, when an admin saves changes to a spec, I must record one history entry per changed field so that the audit trail is granular and precise.

**Why this priority**: Without recording changes, there is nothing to display. This is the write side that enables Story 1.

**Independent Test**: Can be tested by editing a spec (changing title and tags in one save), then querying the data store to verify two separate history entries were created with the same timestamp.

**Acceptance Scenarios**:

1. **Given** a spec exists, **When** an admin changes the title, **Then** a history entry is recorded with action type "title_changed" containing the old and new title values.
2. **Given** a spec exists, **When** an admin changes both the title and the tags in a single save, **Then** two separate history entries are created, both sharing the same timestamp.
3. **Given** a spec exists, **When** an admin saves without changing any tracked field (no-op save), **Then** no history entries are created.
4. **Given** a spec exists, **When** an admin changes the description, **Then** a history entry is recorded with action type "description_updated" without storing old or new content.

---

### User Story 3 - Record Artifact Requirement Changes (Priority: P2)

As the system, when an admin adds, removes, or modifies an artifact requirement on a spec, I must record the change with enough detail to understand what happened.

**Why this priority**: Artifact requirements are a core part of specs. Tracking their changes completes the audit trail beyond simple field edits.

**Independent Test**: Can be tested by adding an artifact requirement to a spec, modifying it, then removing it, and verifying three distinct history entries appear in the timeline.

**Acceptance Scenarios**:

1. **Given** a spec exists, **When** an admin adds an artifact requirement labelled "Screenshot", **Then** a history entry is recorded with action type "artifact_added" and the label "Screenshot".
2. **Given** a spec with an artifact requirement, **When** an admin removes it, **Then** a history entry is recorded with action type "artifact_removed" and the label of the removed artifact.
3. **Given** a spec with an artifact requirement, **When** an admin modifies it (e.g. changes its type or configuration), **Then** a history entry is recorded with action type "artifact_modified" containing the old and new state of the artifact, identified by label.

---

### User Story 4 - Display Removed Members in History (Priority: P3)

As an organisation member viewing spec history, when a change was made by a user who has since been removed from the organisation, I want to see a "Removed member" label so that the history remains coherent.

**Why this priority**: This is an edge case that maintains data integrity. The core feature works without it, but it prevents confusing gaps in the timeline.

**Independent Test**: Can be tested by having a user make a spec change, removing that user from the organisation, then viewing the spec history and verifying the entry shows "Removed member" instead of the user's name.

**Acceptance Scenarios**:

1. **Given** a history entry was created by a user who is no longer a member of the organisation, **When** any member views the history, **Then** the entry displays "Removed member" in place of the user's name.
2. **Given** a history entry was created by a current organisation member, **When** any member views the history, **Then** the entry displays the member's actual name.

---

### Edge Cases

- What happens when a spec is created? A single "created" entry is recorded — no field-level entries for the initial values.
- What happens when a no-op save occurs? No history entries are created.
- What happens when a user who made changes is removed from the organisation? Their history entries remain, displayed with "Removed member" label.
- What happens when multiple fields change in one save? One history entry per changed field, all sharing the same timestamp.
- What happens when the description is changed? Only the fact of the update is recorded — no before/after content is stored (rich text diffs are impractical).

## Requirements *(mandatory)*

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST record a single "created" history entry when a new spec is created, capturing the creator and timestamp.
- **FR-002**: System MUST record one history entry per changed field when a spec is saved, with each entry capturing the actor, action type, timestamp, and (where applicable) old and new values.
- **FR-003**: System MUST track changes to the following fields: title, description, tags, and estimated duration.
- **FR-004**: System MUST track artifact requirement changes: additions, removals, and modifications.
- **FR-005**: For title changes, the system MUST store both the old and new title.
- **FR-006**: For description changes, the system MUST record only that the description was updated, without storing content diffs.
- **FR-007**: For tag changes, the system MUST store both the old tag list and the new tag list.
- **FR-008**: For estimated duration changes, the system MUST store both the old and new duration values.
- **FR-009**: For artifact requirement additions, the system MUST store the label of the added artifact.
- **FR-010**: For artifact requirement removals, the system MUST store the label of the removed artifact.
- **FR-011**: For artifact requirement modifications, the system MUST store the old and new state of the modified artifact, identified by label.
- **FR-012**: System MUST NOT create history entries when a save results in no actual changes to any tracked field (no-op save).
- **FR-013**: When multiple fields change in a single save, the system MUST create separate history entries (one per field) all sharing the same timestamp.
- **FR-014**: All organisation members MUST be able to view the complete history of any spec they have access to.
- **FR-015**: The spec detail page MUST display history entries in a dedicated "History" tab, in reverse chronological order (newest first).
- **FR-016**: Each history entry MUST display the actor's name, a human-readable description of the change, and a relative timestamp.
- **FR-017**: When a history entry was created by a user who is no longer an organisation member, the system MUST display "Removed member" in place of the user's name.
- **FR-018**: History entries MUST be retained permanently with no automatic cleanup or expiry.
- **FR-019**: History MUST be read-only — no filtering, searching, or editing of history entries.

### Key Entities

- **Spec History Entry**: An individual record of a change to a spec. Key attributes: spec reference, actor reference, action type (created, title_changed, description_updated, tags_changed, duration_changed, artifact_added, artifact_removed, artifact_modified), old value, new value, timestamp.
- **Action Type**: An enumeration of all tracked change types that determines how old/new values are interpreted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of spec field edits (title, description, tags, duration) result in corresponding history entries within the same save operation.
- **SC-002**: 100% of artifact requirement changes (add, remove, modify) result in corresponding history entries.
- **SC-003**: No-op saves produce zero history entries (0% false positives).
- **SC-004**: All organisation members can view the full history timeline on any spec they can access, with no permission-related omissions.
- **SC-005**: History entries for removed members display "Removed member" label with no broken references or missing entries.
- **SC-006**: The history timeline loads and displays within 2 seconds for specs with up to 500 history entries.

## Assumptions

- History recording happens synchronously within the same save transaction (no eventual consistency / background jobs needed for v1).
- The spec detail page already exists and this feature adds a "History" tab to it.
- No backfill for existing specs — specs created before this feature will show an empty history tab until they are next edited.
- The "created" entry is the only entry recorded at spec creation time — initial field values are not individually tracked.
- Artifact requirements are identified by label for history purposes; labels are assumed to be unique within a spec at any given time.
- No pagination is needed for v1 — all history entries render in a single list.
- Playbook-level changes (adding/removing a spec from a playbook) are explicitly out of scope.
- Archive/unarchive actions are explicitly out of scope (archiving not yet implemented).

## Scope Boundaries

### In Scope

- Recording changes to spec fields: title, description, tags, estimated duration
- Recording changes to artifact requirements: add, remove, modify
- Displaying a read-only chronological timeline on the spec detail page
- Handling removed organisation members gracefully

### Out of Scope

- Playbook-level changes (e.g. adding/removing a spec from a playbook section)
- Archive/unarchive actions
- Pagination of history entries
- Filtering, searching, or editing history entries
- Content diffs for rich text description changes
