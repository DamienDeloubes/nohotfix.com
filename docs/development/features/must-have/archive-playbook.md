# Feature: Archive & Unarchive Playbook

_Last updated: 2026-03-12_

## Overview

Admins and owners can archive a playbook to remove it from the active list, and later unarchive it to restore it. Archiving addresses the need to retire playbooks that are no longer in use without permanently deleting them. The playbook remains accessible on the Archived tab for reference and can be restored at any time.

An archived playbook is hidden from the Active tab, cannot be edited, cannot be used to start new runs, and its only available action is "Unarchive". Unarchiving restores the playbook to active status and re-enables all capabilities. Both actions are recorded in the changelog.

### Key principles

- **Archiving a playbook does not affect specs.** Specs in the spec library stay referenced to their spec library — archiving a playbook does not archive, hide, or modify any of its referenced specs.
- **Archiving a spec removes it from all playbooks.** When a spec is archived in the library, it is removed from every playbook template that references it (both active and archived playbooks). This ensures playbook templates never contain stale, retired specs. See [Archive Spec](archive-spec.md) for full details.
- **Runs are never affected.** Runs are immutable snapshots created at start time. No archive action on playbooks or specs affects any run.

---

## How the feature should work for the user

### Archive — entry point 1: Playbook list page

1. An admin or owner is on the Playbook list page (`/:orgSlug/playbooks`) on the Active tab.
2. They open the three-dot action menu on a playbook row. The menu shows "Open", "Duplicate", and "Archive". Members do not see "Archive" — it is not rendered for them. The duplicate action is visible but does nothing. This will be added in another feature.
3. The admin clicks "Archive".
4. A confirmation dialog appears (see [Confirmation dialog content](#archive-confirmation-dialog) below).
5. The admin clicks "Archive".
6. The dialog closes. The playbook row is removed from the Active tab (optimistic update). A success toast appears: "Playbook archived."
7. The playbook is now visible on the Archived tab. A changelog entry is recorded: action `archived`.

### Archive — entry point 2: Playbook editor page

1. An admin or owner is on the playbook editor page (`/:orgSlug/playbooks/:playbookId`).
2. They open the playbook action menu (three-dot icon in the header). The menu includes "Archive playbook".
3. The admin clicks "Archive playbook".
4. The same confirmation dialog appears.
5. The admin clicks "Archive".
6. The admin is redirected to the Playbook list page (`/:orgSlug/playbooks`), landing on the Active tab. A success toast appears: "Playbook archived."
7. The playbook is now visible on the Archived tab. A changelog entry is recorded.

### Archive confirmation dialog

The confirmation dialog content is located below

> **Archive this playbook?**
>
> It will be removed from your active list and cannot be used to start new runs. You can unarchive at any time.
>
> 2 runs in progress from this playbook will not be affected — they continue as normal.
>
> [Cancel] [Archive]

### Archived playbook states

**Playbook list (Archived tab):**

- Same table columns as Active tab (name, environment, spec count)
- Per-row action menu (admin/owner only): "View" and "Unarchive"
- Members see only "View"

**Playbook detail/editor page (archived playbook):**

- If an admin navigates to the editor URL for an archived playbook, the page renders in **read-only mode**
- An "Archived" badge is displayed prominently in the page header, near the playbook name
- All editing controls are hidden: no inline editing, no drag handles, no "Add from library", no "Add section", no "New spec"
- The playbook action menu shows only: "Unarchive", "Duplicate", and "View change history". Duplicate action doesnt do anything, will be added in another feature
- Spec rows are visible with all their data (title, severity, system under test, artifact count) but are read-only
- The left section navigation sidebar remains functional for scrolling through the playbook

### Unarchive — entry point 1: Playbook list (Archived tab)

1. An admin or owner is on the Playbook list page on the Archived tab.
2. They open the three-dot action menu on an archived playbook row. The menu shows "View" and "Unarchive". Members see only "View".
3. The admin clicks "Unarchive".
4. No confirmation dialog — unarchive is non-destructive and executes immediately.
5. The playbook row disappears from the Archived tab (optimistic update). A success toast appears: "Playbook unarchived."
6. The playbook is now visible on the Active tab. A changelog entry is recorded: action `unarchived`.

### Unarchive — entry point 2: Archived playbook detail page

1. An admin or owner is viewing an archived playbook's detail page.
2. They click "Unarchive" in the playbook action menu.
3. No confirmation dialog.
4. The "Archived" badge disappears. All editing controls reappear. A success toast: "Playbook unarchived."
5. A changelog entry is recorded.

### Member access

- The "Archive" action menu item is not rendered for members in the playbook list or editor.
- The "Unarchive" action is not rendered for members.
- Members can view archived playbooks on the Archived tab and on the detail page (read-only), but have no actions beyond "View".

---

## How specs are affected by playbook archiving

### Archiving a playbook does not touch specs

A playbook references specs from the spec library. Archiving a playbook does **not** archive, hide, or modify any of its referenced specs. The specs remain fully active in the spec library and fully available to other playbooks. The playbook retains all its spec references — they are simply read-only while the playbook is archived.

### Archiving a spec removes it from all playbooks (including archived ones)

When a spec is archived in the library, it is removed from every playbook template that references it — regardless of whether the playbook is active or archived. This means:

- An active playbook's spec list is always clean: every spec in it is an active library spec.
- An archived playbook may lose specs while it is archived (if those specs are archived separately). When unarchived, the playbook comes back without those specs.
- Unarchiving a spec does **not** re-add it to playbooks it was previously removed from. The admin adds it back manually where needed.

See [Archive Spec](archive-spec.md) for the full confirmation dialog and interaction details.

---

## Happy paths

1. **Archive from the playbook list**: Admin opens the action menu on an active playbook row, clicks "Archive", confirms. The row disappears from the Active tab and a success toast appears. Specs in the library are unaffected.

2. **Archive from the playbook editor**: Admin is editing a playbook, clicks "Archive playbook" in the action menu, confirms. They are redirected to the playbook list. The playbook appears on the Archived tab.

3. **Cancel the archive confirmation**: Admin clicks "Archive" and the dialog opens. They click "Cancel". The dialog closes, nothing changes.

4. **View an archived playbook**: Admin switches to the Archived tab and clicks a playbook. The detail page renders in read-only mode with an "Archived" badge. All sections and specs are visible but not editable.

5. **Unarchive from the Archived tab**: Admin opens the action menu on an archived playbook and clicks "Unarchive". The row moves to the Active tab. Success toast shown.

6. **Unarchive from the detail page**: Admin views an archived playbook and clicks "Unarchive". The badge disappears, editing controls reappear, the playbook is active again.

7. **Archive a playbook with in-progress runs**: Admin archives a playbook that has 3 runs in progress. The confirmation dialog mentions the 3 runs. After archiving, all 3 runs continue normally — they are immutable snapshots. The playbook appears on the Archived tab and shows "3" in the active runs column.

8. **Duplicate an archived playbook**: Admin views an archived playbook and clicks "Duplicate" from the action menu. A new **active** playbook is created with the same sections, specs, and metadata. The admin is navigated to the new playbook's editor. The original remains archived.

9. **Archive and unarchive recorded in changelog**: Both actions create changelog entries showing the acting admin's name, the action ("Archived" / "Unarchived"), and the timestamp.

---

## Unhappy paths and edge cases

### Role and permission scenarios

1. **Member opens action menu on playbook list**: "Archive" is not present in the menu. The member sees only "Open" (for viewing). No server-side guard is needed to hide the item since the API also enforces role checks.

2. **Member navigates directly to an archived playbook's URL**: The page renders in read-only mode. The "Unarchive" action is not rendered. The member sees only the playbook content and the "Archived" badge.

3. **Member attempts to call the archive/unarchive API directly**: The API returns `AUTH_ROLE_INSUFFICIENT`.

### Spec interaction scenarios

4. **Spec is archived while referenced by an active playbook**: The spec is removed from the playbook (and all other playbooks that reference it). The playbook's spec count decreases. The playbook does NOT auto-archive — empty playbooks are valid states. See [Archive Spec](archive-spec.md) for the confirmation dialog that informs the admin of affected playbooks before they confirm.

5. **Admin archives a playbook, then some specs are archived separately, then unarchives the playbook**: The specs that were archived were removed from the playbook at the time of their archival (regardless of the playbook's archive status). When the playbook is unarchived, it comes back without those specs. The admin can then add new/different specs or re-add the unarchived ones. No warning or special handling needed — the playbook's current state is always clean and accurate.

6. **Admin archives a playbook, then ALL specs are archived separately, then unarchives the playbook**: The playbook unarchives as an empty playbook (all specs were removed when they were individually archived). Empty playbooks are a valid state. The admin can rebuild the playbook's spec list.

7. **Admin archives a spec that is the only spec in a playbook**: The spec is removed from the playbook. The playbook now has an empty section (or empty ungrouped zone). The playbook does NOT auto-archive. The admin manages the empty playbook separately.

8. **Admin unarchives a spec that was previously removed from playbooks**: The spec reappears in the library on the Active tab and in the "Add from library" picker. It is **not** automatically re-added to any playbooks. The admin adds it back manually where needed.

### Structural edge cases

9. **Archive the only active playbook in the org**: Allowed. The Active tab shows the empty state: "No active playbooks. Create one to get started."

10. **Admin navigates directly to the editor URL for an archived playbook** (`/:orgSlug/playbooks/:playbookId`): The page renders in read-only mode with the "Archived" badge. The admin is NOT redirected — they see the archived state directly. This is consistent with how archived specs work.

### Concurrency and failure scenarios

11. **Archive API call fails (network or server error)**: The optimistic row removal (list page) or redirect (editor page) does not happen. An error toast: "Failed to archive playbook. Please try again."

12. **Unarchive API call fails**: The optimistic row removal from the Archived tab does not happen. An error toast: "Failed to unarchive playbook. Please try again."

13. **Archive and unarchive in rapid succession**: Each action is recorded as a separate changelog entry. No deduplication.

14. **Two admins archive the same playbook simultaneously**: Both API calls set `is_archived = true`. Both succeed (idempotent). Two changelog entries recorded. Consistent final state.

15. **One admin archives a playbook while another admin is editing it**: The editing admin's page does not update in real time (no live push in v1). If they try to save changes, the API should accept the save (the playbook is archived but not locked at the DB level — archiving is a soft filter, not a write lock). However, on next page load, the editor renders in read-only mode. _Alternative_: the API rejects writes to archived playbooks with a clear error, and the editor shows "This playbook has been archived" on the next action attempt.

---

## What archiving a playbook does NOT do

- Does **not** archive, modify, or hide any specs in the spec library
- Does **not** cascade to other playbooks (even if they share the same specs)
- Does **not** auto-archive playbooks when their specs are archived individually
- Does **not** auto-unarchive specs when a playbook is unarchived
- Does **not** re-add specs that were removed (due to spec archival) when a playbook is unarchived
- Does **not** remove the playbook from the database — it remains queryable with `is_archived = true`

---

## Out of scope

- Delete playbook (permanent removal)
- Bulk archive/unarchive multiple playbooks
- Auto-archive rules (e.g., "archive playbooks not used in 90 days")
- Notification when a playbook you manage is archived by another admin
