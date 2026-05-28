# Feature: Edit Spec

## Feature description

Admins and owners can edit an existing spec in the Spec Library. Currently specs can only be created, listed, and viewed — there is no way to modify a spec once it has been saved. This feature introduces a dedicated edit page, accessible from two entry points: the "Edit spec" button on the spec detail page, and the "Edit spec" action in the row action menu on the Spec Library overview table.

The edit page is functionally identical to the create spec form — all fields are editable at once, with the same validations and field behaviours — but pre-populated with the spec's current values. Saving commits changes directly to the `spec_library` entry. No propagation to playbooks exists yet (playbook linking is a future feature). Members (non-admin, non-owner) cannot edit specs and do not see the edit entry points.

**Out of scope**: editing a spec from within a playbook section, archiving/unarchiving, spec deletion, and any sync/propagation to playbook specs.

## How the feature should work for the user

**Entry point 1 — Spec detail page:**
1. An admin or owner views a spec on the spec detail page (`/:orgSlug/spec-library/:specId`).
2. They click the "Edit spec" button (visible only to admins and owners — hidden entirely from members).
3. They are navigated to the edit page (`/:orgSlug/spec-library/:specId/edit`), which displays the same form as the create spec form, pre-populated with the spec's current values.
4. All fields are editable at once: title, system under test, severity, preconditions, description, test steps, expected result, artifact requirements, and tester notes.
5. Test steps can be added, removed, and reordered via drag and drop — same behaviour as create.
6. Artifact requirements can be added, edited, and removed — same behaviour as create.
7. The admin makes their changes and clicks the "Save" button at the bottom of the page.
8. On success, they are redirected to the spec detail page, which reflects the updated values.
9. If the admin clicks "Cancel" at any point, they are redirected back to the spec detail page with no changes saved to the database.

**Entry point 2 — Spec Library overview table:**
1. An admin or owner is on the Spec Library overview page (`/:orgSlug/spec-library`).
2. They open the three-dot action menu on a spec row and click "Edit spec".
3. They are navigated to the same edit page (`/:orgSlug/spec-library/:specId/edit`) pre-populated with that spec's current values.
4. The flow from step 4 onwards is identical to entry point 1.

**Member access:**
- The "Edit spec" button on the spec detail page is not rendered for members.
- The "Edit spec" action does not appear in the row action menu for members.
- If a member navigates directly to `/:orgSlug/spec-library/:specId/edit`, they are redirected to the spec detail page.

**Archived spec access:**
- If an admin navigates to the edit URL for an archived spec, they are redirected to the spec detail page.

## Happy paths

1. **Edit a spec from the detail page**: Admin clicks "Edit spec" on a spec detail page, updates the title and severity, clicks "Save". They are redirected to the spec detail page showing the new title and severity. One history entry is recorded for the title change and one for the severity change.

2. **Edit a spec from the overview table**: Admin opens the action menu on a spec row in the overview table, clicks "Edit spec", updates the description, clicks "Save". They are redirected to the spec detail page. One history entry is recorded noting the description was updated.

3. **Add a test step during edit**: Admin opens the edit page, clicks "Add step", fills in the instruction and expected outcome for a new step, clicks "Save". The new step appears on the spec detail page in the correct position.

4. **Remove a test step during edit**: Admin opens the edit page, removes an existing step, clicks "Save". The step no longer appears on the spec detail page.

5. **Reorder test steps during edit**: Admin drags step 3 to position 1. Step numbers recalculate. Admin clicks "Save". The spec detail page reflects the new step order.

6. **Add an artifact requirement during edit**: Admin opens the edit page, clicks "Add artifact requirement", configures it, clicks "Save". The new requirement appears on the spec detail page.

7. **Remove an artifact requirement during edit**: Admin opens the edit page, removes an existing artifact requirement, clicks "Save". The requirement no longer appears on the spec detail page.

8. **No-op save**: Admin opens the edit page, makes no changes, clicks "Save". They are redirected to the spec detail page. No history entries are created.

9. **Cancel edit**: Admin opens the edit page, makes changes, then clicks "Cancel". They are redirected to the spec detail page. No changes are persisted.

## Unhappy paths and edge cases

1. **Member navigates directly to edit URL**: A member navigates to `/:orgSlug/spec-library/:specId/edit`. They are redirected to the spec detail page (`/:orgSlug/spec-library/:specId`).

2. **Admin navigates to edit URL for an archived spec**: The spec is archived. The admin is redirected to the spec detail page for that spec.

3. **Save fails due to network or server error**: The API call fails. The admin stays on the edit page with all their unsaved changes intact. An error message is displayed so they can retry.

4. **Required field cleared (title emptied)**: Admin clears the title field. The "Save" button is disabled. An inline validation error is shown on the title field. The same validations as the create form apply.

5. **Test step with missing instruction or expected outcome**: Admin adds a test step but leaves the instruction or expected outcome blank. The "Save" button is disabled and an inline validation error is shown on the incomplete field — consistent with create form behaviour.

6. **Test step limit reached**: Admin attempts to add a 51st test step. The "Add step" control is disabled and a message indicates the maximum of 50 steps has been reached — consistent with create form behaviour.

7. **Unsaved changes indicator**: While the admin has made edits but not yet saved, the page shows a visual indicator (e.g. "Unsaved changes") near the Save button so the admin is aware of pending changes.

8. **Concurrent edit by two admins**: Two admins open the edit page for the same spec simultaneously. Both save successfully — the last save wins. No conflict detection or merge is performed in v1.

9. **Session expires mid-edit**: The admin's session expires while they are on the edit page. When they attempt to save, they are redirected to login. Form state is preserved so they can recover their changes after re-authenticating — consistent with create form behaviour.
