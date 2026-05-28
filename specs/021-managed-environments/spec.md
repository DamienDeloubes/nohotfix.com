# Feature Specification: Managed Environments

**Feature Branch**: `021-managed-environments`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Org-level managed environment definitions (Production, Acceptance, Test) with CRUD on a dedicated settings page. Environments are referenced by playbooks and runs."

## Clarifications

### Session 2026-03-11

- Q: How should existing organisations (created before this feature ships) get environments? → A: Seed defaults for existing orgs via a one-time data migration at deploy time.
- Q: Should completed/abandoned runs block environment deletion? → A: No. Only active runs (in_progress, awaiting_decision) block deletion. Terminal runs do not block.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and manage environments (Priority: P1)

An admin navigates to the Environments settings page to see all environments configured for their organisation. The page displays an ordered list with the three defaults (Production, Acceptance, Test) seeded on org creation. The admin can add, rename, reorder, and delete environments from this single surface.

**Why this priority**: This is the core surface — without it, no environment management exists. It is the prerequisite for every other story and for the playbook environment dropdown.

**Independent Test**: Can be fully tested by navigating to `/:orgSlug/settings/environments` and verifying the default environments are displayed in order. Delivers the foundational CRUD capability.

**Acceptance Scenarios**:

1. **Given** a newly created organisation, **When** the admin navigates to the Environments settings page, **Then** three default environments are displayed in order: Production, Acceptance, Test.
2. **Given** the Environments settings page is open, **When** the admin views the list, **Then** each environment shows a name, a drag handle for reordering, and a delete button.
3. **Given** the Environments settings page is open, **When** a non-admin member navigates to the page, **Then** they are denied access (page not visible or redirected).

---

### User Story 2 - Add a new environment (Priority: P1)

An admin clicks "Add environment" at the bottom of the list. A new row appears with an empty inline-editable name field. The admin types a name (e.g. "Hotfix") and presses Enter or clicks away to save. The new environment appears at the bottom of the list and is immediately available in playbook environment dropdowns.

**Why this priority**: Adding environments is essential — orgs will have different environments beyond the defaults. Without this, the feature is static and unusable for most teams.

**Independent Test**: Can be fully tested by clicking "Add environment", typing a name, saving, and verifying it appears in the list and in the playbook environment dropdown.

**Acceptance Scenarios**:

1. **Given** the Environments settings page, **When** the admin clicks "Add environment" and types "Hotfix" and presses Enter, **Then** a new environment "Hotfix" appears at the bottom of the list.
2. **Given** "Production" already exists, **When** the admin tries to add "production" (lowercase), **Then** an inline error is shown: "An environment with this name already exists."
3. **Given** the admin clicks "Add environment", **When** they submit with an empty name, **Then** a validation error is shown and the environment is not created.
4. **Given** the admin adds "Hotfix" successfully, **When** they navigate to the playbook creation form, **Then** "Hotfix" appears as an option in the environment dropdown.

---

### User Story 3 - Rename an environment (Priority: P2)

An admin clicks on an environment name to make it editable inline. They change the name (e.g. "Acceptance" to "Staging") and press Enter or click away. The name updates everywhere because playbooks and runs reference environments by ID, not by name.

**Why this priority**: Renaming is important for orgs that want to align terminology with their workflows, but it is not blocking for initial use since defaults are reasonable.

**Independent Test**: Can be fully tested by clicking an environment name, editing it, saving, and verifying the new name appears in the list and in playbook dropdowns.

**Acceptance Scenarios**:

1. **Given** an environment named "Acceptance", **When** the admin clicks the name, edits it to "Staging", and presses Enter, **Then** the environment is renamed to "Staging" in the list.
2. **Given** an environment named "Test" and "Production" exists, **When** the admin tries to rename "Test" to "Production", **Then** an inline error is shown: "An environment with this name already exists."
3. **Given** the admin clears the name field and clicks away, **Then** the name reverts to its previous value and a validation error is shown.
4. **Given** a playbook has "Acceptance" as its default environment, **When** the admin renames "Acceptance" to "Staging", **Then** the playbook's environment dropdown now shows "Staging" (reference by ID, not name).

---

### User Story 4 - Reorder environments (Priority: P2)

An admin drags an environment to a new position in the list. The new order is saved immediately. This order determines the display order in dropdowns and future run timeline views.

**Why this priority**: Ordering provides organisational control, but the default order (Production, Acceptance, Test) works out of the box for most teams.

**Independent Test**: Can be fully tested by dragging an environment to a new position and verifying the list order updates and persists on page reload.

**Acceptance Scenarios**:

1. **Given** environments in order Production, Acceptance, Test, **When** the admin drags "Test" above "Acceptance", **Then** the order becomes Production, Test, Acceptance.
2. **Given** the admin reorders environments, **When** they reload the page, **Then** the new order is preserved.
3. **Given** the admin reorders environments, **When** they open a playbook's environment dropdown, **Then** environments are listed in the new order.

---

### User Story 5 - Delete an environment (Priority: P3)

An admin clicks the delete button on an environment. If the environment is not used by any playbook, a confirmation prompt is shown and the environment is deleted. If it is in use by playbooks, deletion is blocked with an explanatory message. Active run checks will be added when the run creation feature introduces `environment_id` on the runs table.

**Why this priority**: Deletion is a cleanup action that is less frequent than adding or renaming. The delete guard is critical to prevent orphaned data, but the feature is functional without deletion.

**Independent Test**: Can be fully tested by attempting to delete an unused environment (should succeed) and an in-use environment (should be blocked).

**Acceptance Scenarios**:

1. **Given** an environment "Hotfix" that is not used by any playbook, **When** the admin clicks delete, **Then** a confirmation prompt is shown: "Delete Hotfix? This cannot be undone."
2. **Given** the admin confirms deletion of "Hotfix", **Then** "Hotfix" is removed from the list and no longer appears in dropdowns.
3. **Given** an environment "Production" that is used by 3 playbooks, **When** the admin clicks delete, **Then** deletion is blocked with message: "This environment cannot be deleted because it is used by 3 playbook(s). Remove it from all playbooks before deleting."
4. **Given** environments in order Production (pos 0), Test (pos 1), Hotfix (pos 2), **When** the admin deletes "Test", **Then** remaining environments are reordered: Production (pos 0), Hotfix (pos 1).

---

### Edge Cases

- **Last environment deleted**: An org can have zero environments. Playbooks can exist without an environment. The system does not enforce a minimum count.
- **Case-insensitive uniqueness**: "production" and "Production" are treated as the same name. Uniqueness checks are case-insensitive.
- **Concurrent editing**: Two admins rename the same environment simultaneously — last write wins. The UI reflects the final state on next data fetch.
- **Org creation with seed failure**: If default environment seeding fails during org creation, the org is still created with an empty environments list. The admin can add environments manually.
- **Very long environment name**: Names are capped at 100 characters. Attempting to exceed this shows a validation error.
- **Whitespace-only name**: A name consisting only of whitespace is treated as empty and rejected.
- **Leading/trailing whitespace**: Names are trimmed before saving. " Production " becomes "Production".

## Requirements *(mandatory)*

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: System MUST create three default environments (Production, Acceptance, Test) when a new organisation is created. A one-time data migration MUST seed the same defaults for all existing organisations that have no environments.
- **FR-002**: System MUST provide a settings page at `/:orgSlug/settings/environments` accessible only to admins.
- **FR-003**: The settings page MUST display all environments for the organisation in position order.
- **FR-004**: Admins MUST be able to add a new environment with a name between 1 and 100 characters.
- **FR-005**: Environment names MUST be unique within an organisation (case-insensitive comparison).
- **FR-006**: Admins MUST be able to rename an environment inline. The new name must pass the same validation as adding (1-100 chars, unique, trimmed).
- **FR-007**: Admins MUST be able to reorder environments via drag-and-drop. The new order is persisted immediately.
- **FR-008**: Admins MUST be able to delete an environment that is not referenced by any playbook or run.
- **FR-009**: System MUST block deletion of an environment that is referenced by any playbook, displaying the count of referencing playbooks. Active run checks will be added when the run creation feature introduces `environment_id` on the runs table.
- **FR-010**: When an environment is deleted, remaining environments MUST be reordered to close the position gap.
- **FR-011**: Environment names MUST be trimmed of leading and trailing whitespace before saving.
- **FR-012**: Renaming an environment MUST propagate automatically to all referencing entities (playbooks, runs) because they reference by ID, not name.

### Key Entities

- **Environment**: An org-scoped named label representing a deployment target or process context. Key attributes: name (unique per org, case-insensitive), position (display order). Referenced by playbooks (optional) and runs (required at creation).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can add, rename, reorder, and delete environments from a single settings page in under 5 seconds per action.
- **SC-002**: New organisations see three pre-configured default environments immediately upon first visit to the settings page.
- **SC-003**: Duplicate environment names (case-insensitive) are prevented with immediate inline feedback — zero duplicates can exist.
- **SC-004**: Environments referenced by playbooks cannot be deleted — 100% of deletion attempts on in-use environments are blocked with a clear explanation. Active run checks will be added when runs reference environments by ID.
- **SC-005**: Environment order set on the settings page is consistently reflected in all dropdowns across the platform.
