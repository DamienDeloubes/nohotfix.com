# Feature description

Admins and owners can archive a spec from the Spec Library, and later unarchive it to restore it to active status. Archiving addresses the need to retire specs that are no longer relevant without permanently deleting them — the spec remains accessible in the Archived tab of the library for reference and can be restored at any time.

An archived spec is hidden from library search results on the Active tab, cannot be edited, and its only available action is "Unarchive". Unarchiving restores the spec to active status and re-enables all editing capabilities. Both archive and unarchive actions are recorded in the changelog.

The `is_archived` column already exists on the `spec_library` table (default `false`) and the Spec Library overview page already renders Active and Archived tabs — this feature wires up the archive and unarchive mutations that drive those tabs.

### Key principle: archiving a spec retires it from active use everywhere

When a spec is archived, it is **removed from all playbook templates** (both active and archived playbooks) that reference it. This ensures playbook templates never contain stale, retired specs. Runs already started are unaffected — they are immutable snapshots created at run start time.

Unarchiving a spec restores it to the library but does **not** re-add it to playbooks it was previously removed from. The admin adds it back manually where needed.

**Out of scope**: spec deletion, and any impact on active or completed runs (runs are snapshotted at start time and are immutable regardless).

# How the feature should work for the user

## Archive — entry point 1: Spec Library overview table

1. An admin or owner is on the Spec Library overview page (`/:orgSlug/spec-library`) on the Active tab.
2. They open the three-dot action menu on a spec row. The menu shows "View", "Edit spec", and "Archive". Members see only "View" — the Archive item is not rendered for them.
3. The admin clicks "Archive".
4. A confirmation dialog appears (see [Confirmation dialog content](#archive-confirmation-dialog) below).
5. The admin clicks "Archive spec".
6. The dialog closes. The spec row is removed from the Active tab list (optimistic update). A success toast appears: "Spec archived."
7. The spec is now visible on the Archived tab. The spec is removed from all playbook templates that referenced it. A changelog entry is recorded: action `archived`, no field changes.

## Archive — entry point 2: Spec detail page

1. An admin or owner is viewing a spec on the spec detail page (`/:orgSlug/spec-library/:specId`).
2. An "Archive spec" button is visible in the page header actions area (next to "Edit spec"). Members do not see this button — it is not rendered for them.
3. The admin clicks "Archive spec".
4. The same confirmation dialog appears.
5. The admin clicks "Archive spec".
6. The admin is redirected to the Spec Library overview page (`/:orgSlug/spec-library`), landing on the Active tab. A success toast appears: "Spec archived."
7. The spec is now visible on the Archived tab. The spec is removed from all playbook templates that referenced it. A changelog entry is recorded.

## Archive confirmation dialog

The confirmation dialog content depends on whether the spec is referenced by any playbook templates:

**Not referenced by any playbooks:**

> **Archive this spec?**
>
> Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.
>
> [Cancel] [Archive spec]

**Referenced by active playbooks only (e.g. 3 active playbooks):**

> **Archive this spec?**
>
> Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.
>
> This spec will be removed from 3 playbooks: Sprint Release, Hotfix Deploy, Nightly Regression.
>
> Runs already started are not affected.
>
> [Cancel] [Archive spec]

**Referenced by both active and archived playbooks:**

> **Archive this spec?**
>
> Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.
>
> This spec will be removed from 2 playbooks: Sprint Release, Hotfix Deploy.
> Also from 1 archived playbook: Q4 Release.
>
> Runs already started are not affected.
>
> [Cancel] [Archive spec]

**Referenced by archived playbooks only:**

> **Archive this spec?**
>
> Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.
>
> This spec will be removed from 2 archived playbooks: Q4 Release, Legacy Deploy.
>
> Runs already started are not affected.
>
> [Cancel] [Archive spec]

When the playbook count exceeds 3, show the first 3 names and a count: "Sprint Release, Hotfix Deploy, Nightly Regression, and 4 others."

## Archived spec detail page state

1. An admin or owner navigates to the spec detail page for an archived spec.
2. The page renders the spec's content (all fields) in read-only mode — identical to the view a member sees.
3. An "Archived" badge is displayed prominently in the page header, near the spec title.
4. The "Edit spec" button is not rendered.
5. Instead, an "Unarchive" button is visible in the page header actions area. Members do not see this button.
6. The spec history panel is visible (read-only), including the archive changelog entry.

## Unarchive — entry point 1: Spec detail page (archived spec)

1. An admin or owner is on the spec detail page for an archived spec.
2. They click "Unarchive".
3. No confirmation dialog — unarchive is a non-destructive action and executes immediately.
4. The "Archived" badge disappears. The "Unarchive" button is replaced by the "Edit spec" and "Archive spec" buttons. The spec is now active.
5. A success toast appears: "Spec unarchived."
6. A changelog entry is recorded: action `unarchived`, no field changes.

## Unarchive — entry point 2: Spec Library overview table (Archived tab)

1. An admin or owner is on the Spec Library overview page on the Archived tab.
2. They open the three-dot action menu on an archived spec row. The menu shows "View" and "Unarchive". Members see only "View".
3. The admin clicks "Unarchive".
4. No confirmation dialog — unarchive executes immediately.
5. The spec row is removed from the Archived tab list (optimistic update). A success toast appears: "Spec unarchived."
6. The spec is now visible on the Active tab. A changelog entry is recorded.

## Member access

- The "Archive spec" button is not rendered for members on the spec detail page.
- The "Unarchive" button is not rendered for members on the spec detail page.
- The "Archive" and "Unarchive" action menu items are not rendered for members in the overview table row menus.
- Members can view archived specs on the spec detail page and on the Archived tab of the overview (read-only), but have no actions beyond "View".

# Happy paths

1. **Archive a spec not used in any playbook**: Admin opens the action menu on a spec, clicks "Archive". The confirmation dialog shows the standard message with no playbook list. Admin confirms. The spec moves to the Archived tab.

2. **Archive a spec used in active playbooks**: Admin archives a spec. The confirmation dialog shows "This spec will be removed from 3 playbooks: Sprint Release, Hotfix Deploy, Nightly Regression." Admin confirms. The spec is archived and removed from all 3 playbook templates. The playbooks' spec counts decrease accordingly.

3. **Archive a spec used in both active and archived playbooks**: Admin archives a spec. The dialog shows active playbooks prominently, plus "Also from 1 archived playbook: Q4 Release." Admin confirms. The spec is removed from all listed playbooks (active and archived).

4. **Archive from the spec detail page**: Admin is viewing a spec, clicks "Archive spec", confirms. They are redirected to the Spec Library overview (Active tab) and a success toast appears. The spec is removed from any referencing playbooks.

5. **Cancel the archive confirmation**: Admin clicks "Archive" and the dialog opens, showing the list of affected playbooks. They click "Cancel". The dialog closes and nothing changes — the spec and all playbook references remain intact.

6. **View an archived spec**: Admin switches to the Archived tab and clicks an archived spec row. The spec detail page renders all fields read-only, with an "Archived" badge and an "Unarchive" button. No edit actions are available.

7. **Unarchive from the spec detail page**: Admin views an archived spec and clicks "Unarchive". The badge disappears, the "Edit spec" and "Archive spec" buttons appear, and a success toast shows "Spec unarchived." The spec is immediately active and editable. It is **not** re-added to any playbooks it was previously removed from — the admin adds it back manually where needed.

8. **Unarchive from the Archived tab**: Admin opens the action menu on an archived spec row and clicks "Unarchive". The row disappears from the Archived tab immediately and appears on the Active tab. The spec is not re-added to any playbooks.

9. **Changelog entry on archive**: After archiving, the spec's history panel shows a new entry: the acting admin's name, the action "Archived", and the timestamp.

10. **Changelog entry on unarchive**: After unarchiving, the spec's history panel shows a new entry: the acting admin's name, the action "Unarchived", and the timestamp.

# Unhappy paths and edge cases

## Role and permission scenarios

1. **Member opens action menu on overview table**: The "Archive" and "Unarchive" items are not present in the menu — the menu shows only "View". No additional server-side guard is needed to hide these items since the API also enforces role checks.

2. **Member navigates directly to an archived spec detail page**: The page renders in read-only mode. The "Unarchive" button is not rendered. The member sees only the spec content, the "Archived" badge, and the history panel — no actions.

3. **Member attempts to call the archive/unarchive API directly**: The API returns `AUTH_ROLE_INSUFFICIENT`. The frontend does not surface this path since the actions are never rendered for members.

## Playbook interaction scenarios

4. **Archive a spec that is the only spec in a playbook**: The spec is removed from the playbook. The playbook now has an empty section (or empty ungrouped zone). The playbook does NOT auto-archive — empty playbooks are valid states. The admin can add different specs or archive the playbook separately.

5. **Archive a spec, then unarchive it, then try to re-add to a playbook**: After unarchiving, the spec appears in the "Add from library" picker again. The admin can add it back to any playbook as if it were newly created. No automatic restoration of previous playbook references.

6. **Archive a playbook, then archive a spec that was in it, then unarchive the playbook**: The spec was removed from the playbook when it was archived (regardless of the playbook's archive status). When the playbook is unarchived, it comes back without that spec. The playbook's spec list reflects all removals that happened while it was archived.

7. **Admin is viewing a playbook editor when another admin archives a spec in that playbook**: The editing admin's page does not update in real time (no live push in v1). On next data fetch (page refresh or navigation), the spec row will be gone from the playbook. If the admin was in the middle of an action on that spec row, the action fails gracefully with an error toast.

## Failure and concurrency scenarios

8. **Archive API call fails (network or server error)**: The optimistic row removal (on the overview table) or redirect (on the detail page) does not happen. An error toast appears: "Failed to archive spec. Please try again." The spec remains active and all playbook references remain intact — the removal is atomic with the archive.

9. **Unarchive API call fails (network or server error)**: The optimistic row removal (on the Archived tab) does not happen. An error toast appears: "Failed to unarchive spec. Please try again." The spec remains archived.

10. **Admin navigates directly to the edit URL for an archived spec** (`/:orgSlug/spec-library/:specId/edit`): They are redirected to the spec detail page (`/:orgSlug/spec-library/:specId`). This is consistent with the existing edit-spec behaviour for archived specs.

11. **Archived spec does not appear in Active tab search or filter results**: Even if a direct API call includes an archived spec's ID, the Active tab list endpoint always filters by `is_archived = false`. The archived spec only appears on the Archived tab.

12. **Archived spec does not appear in the "Add from library" picker**: When adding specs to a playbook, only active specs are shown. Archived specs are excluded from the picker.

13. **Archive and unarchive in rapid succession**: If an admin archives and immediately unarchives a spec, each action is recorded as a separate changelog entry. No deduplication. Note: the playbook removal on archive is **not** reversed by unarchiving — the spec must be manually re-added to playbooks.

14. **Two admins archive the same spec simultaneously**: Both API calls attempt to set `is_archived = true` and remove playbook references. Both succeed (idempotent). Two changelog entries are recorded. The spec ends up archived — consistent final state regardless of race.

15. **Two admins — one archives while the other is on the spec detail page**: The second admin is viewing the active spec when the first admin archives it. The second admin's page does not update in real time (no live push in v1). If they click "Edit spec", they are redirected to the spec detail page (which now shows the archived state) — consistent with how the edit redirect for archived specs already works.
