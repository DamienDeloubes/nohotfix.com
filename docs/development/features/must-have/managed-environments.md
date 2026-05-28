# Feature: Managed Environments

_Last updated: 2026-03-11_

## Overview

Managed Environments is a small foundational feature that introduces org-level environment definitions (e.g. "Production", "Acceptance", "Test"). Environments are created and maintained exclusively on a dedicated settings page. They are referenced by playbooks (optional default) and runs (required at creation). Centralising environment management ensures naming consistency across the platform and enables future features like environment-grouped run timelines.

## Complexity Assessment

- **Technical Complexity**: Low — single new table, simple CRUD, seed defaults on org creation.
- **Design Complexity**: Low — standard settings list pattern with inline editing.
- **User Experience Complexity**: Low — familiar concept; the only nuance is the delete guard when an environment is in use.

---

## Detailed Description

### Default Seeding

When an organisation is created, three default environments are inserted:

1. Production (position 0)
2. Acceptance (position 1)
3. Test (position 2)

These defaults can be renamed or deleted by the admin afterwards.

### Settings Page

- **Route**: `/:orgSlug/settings/environments`
- **Access**: Admin only

#### Page Layout

- Heading: "Environments"
- Subheading: "Manage the environments available for playbooks and runs."
- An ordered list of environments with drag handles for reordering
- Each row shows the environment name with inline-edit on click and a delete button
- "Add environment" button at the bottom of the list

#### Adding an Environment

- Clicking "Add environment" appends a new row at the bottom with an empty inline-editable name field
- The user types a name and presses Enter or clicks away to save
- Validation: name is required (1-100 chars), must be unique within the org (case-insensitive comparison)
- On duplicate name: inline error "An environment with this name already exists"

#### Renaming an Environment

- Click the environment name to make it editable inline
- Press Enter or click away to save
- Same validation as adding (required, unique, 1-100 chars)
- Renaming propagates automatically — playbooks and runs reference by `environment_id`, not by name

#### Reordering Environments

- Drag handle on each row allows reordering
- Position determines the display order in dropdowns and (future) run timeline views
- Saved immediately on drop

#### Deleting an Environment

- Delete button (trash icon) on each row
- **Guard**: if the environment is referenced by any playbook or run, deletion is blocked
  - Error message: "This environment cannot be deleted because it is used by [X] playbook(s) and [Y] run(s). Remove it from all playbooks and wait for active runs to complete before deleting."
- If not in use: confirmation prompt "Delete [name]? This cannot be undone."
- Deleting reorders remaining environments to close the gap

---

## Happy Paths

1. **Admin adds a new environment**: Admin navigates to settings → environments → clicks "Add environment" → types "Hotfix" → presses Enter → new environment appears at the bottom of the list.
2. **Admin renames an environment**: Admin clicks "Acceptance" → edits to "Staging" → presses Enter → name updates everywhere it appears in dropdowns.
3. **Admin reorders environments**: Admin drags "Test" above "Staging" → order updates → dropdowns reflect new order.
4. **Admin deletes an unused environment**: Admin clicks delete on "Test" → confirms → environment removed.

## Unhappy Paths

1. **Duplicate name**: Admin tries to add "Production" when it already exists → inline error, environment not created.
2. **Empty name**: Admin clears the name field and clicks away → validation error, reverts to previous name.
3. **Delete in-use environment**: Admin tries to delete "Production" which is referenced by 3 playbooks → blocked with explanatory message listing the count.

## Edge Cases

1. **Last environment**: There is no minimum — an org can delete all environments. Playbooks can exist without an environment. Environments become required only at run creation.
2. **Case sensitivity**: "production" and "Production" are treated as duplicates (case-insensitive uniqueness check).
3. **Concurrent editing**: Two admins rename the same environment simultaneously — last write wins, optimistic UI shows the final state on next fetch.
4. **Org creation failure mid-seed**: If default environment seeding fails during org creation, the org is still created — environments list is simply empty and admin can add manually.

---

## Integration Points

- **Playbooks**: Environment dropdown on playbook form pulls from this list. Playbook stores `environment_id` (nullable FK).
- **Runs** (future): Run creation requires an environment. The playbook's default environment is pre-selected but can be overridden to any org environment.
- **Run Timeline** (future): Environment position determines the vertical order of timelines on the Runs page.

## Out of Scope

- Environment-specific configuration (e.g. URLs, credentials)
- Environment health status or monitoring
- Per-environment access control
- Color coding or icons for environments
