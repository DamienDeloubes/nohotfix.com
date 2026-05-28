# Research: Archive & Unarchive Spec

**Branch**: `027-archive-spec` | **Date**: 2026-03-12

## Existing Infrastructure Audit

### What Already Exists (no changes needed)

| Component | Location | Status |
|-----------|----------|--------|
| `is_archived` column | `packages/db/src/schema.ts` SpecLibraryTable | Complete — boolean, default false, indexed |
| `setArchived()` repo method | `kysely-spec-library-repository.ts:151` | Complete — UPDATE + RETURNING |
| PATCH `/specs/:specId/archive` | `apps/api/src/routes/authoring.ts:286` | Exists — needs enhancement |
| PATCH `/specs/:specId/unarchive` | `apps/api/src/routes/authoring.ts:317` | Exists — needs enhancement |
| `archiveLibrarySpec` use case | `packages/domains/authoring/src/use-cases/` | Exists — needs enhancement |
| `useArchiveSpec` hook | `packages/domains/authoring/src/ui/hooks/` | Complete |
| `useUnarchiveSpec` hook | `packages/domains/authoring/src/ui/hooks/` | Complete |
| `AUTHOR_SPEC_ARCHIVED` error | `packages/shared/src/errors/codes.ts` | Complete |
| `AUTHOR_SPEC_NOT_FOUND` error | `packages/shared/src/errors/codes.ts` | Complete |
| `AuthorSpecArchivedError` class | `packages/domains/authoring/src/errors/` | Complete |
| `roleGuard({ minimum: 'admin' })` | `apps/api/src/shared/middleware/role-guard.ts` | Complete |
| `withTransaction` helper | `apps/api/src/shared/lib/with-transaction.ts` | Complete — includes all needed repos |
| Active/Archived tabs | `apps/app/src/routes/.../spec-library/index.tsx` | Complete |
| `SpecDetailActions` component | `packages/domains/authoring/src/ui/` | Complete |
| `SpecLibraryTable` with action menus | `packages/domains/authoring/src/ui/` | Complete |
| `SpecHistoryTimeline` with archive actions | `packages/domains/authoring/src/ui/` | Complete |
| Spec list filtering by `is_archived` | `kysely-spec-library-repository.ts:list()` | Complete |
| `findByLibrarySpec()` on PlaybookSpecRepository | `packages/domains/authoring/src/ports/` | Complete — finds playbook_specs by library spec ID |
| Changelog recording for archive/unarchive | `apps/api/src/routes/authoring.ts` | Complete |
| `SPEC_HISTORY_ACTIONS` includes 'archived'/'unarchived' | `packages/shared/src/schemas/specs.ts` | Complete |

### What Needs to Be Built or Modified

| Gap | Decision | Rationale |
|-----|----------|-----------|
| Playbook cascade removal on archive | Add `removeByLibrarySpecId(specLibraryId, orgId)` to PlaybookSpecRepository port + Kysely adapter. Call within archive transaction. | Spec requires atomic removal from all playbook templates. Using bulk DELETE is simpler and more performant than iterating individual deletes. |
| Pre-archive impact preview | New GET endpoint + `getArchiveImpact` use case. Returns affected playbook names grouped by active/archived status. | Confirmation dialog needs playbook names before the user confirms. Cannot be part of the archive mutation itself. |
| Archive idempotency | Modify `archiveLibrarySpec` to return current state if already in target state (no error). | FR-019 requires idempotent behavior. Currently throws SPEC_NOT_FOUND on missing but doesn't handle already-archived state. |
| Confirmation dialog with playbook names | Extract `ArchiveConfirmDialog` component. Fetch impact data when dialog opens. Render grouped playbook names with overflow truncation. | FR-005, FR-006 require showing affected playbooks. Current dialog shows static text only. |
| Detail page archive redirect | Change navigation target from `tab: 'archived'` to Active tab (`tab: 'active'`). | FR-015 specifies redirect to Active tab after archiving from detail page. |
| Edit page redirect for archived spec | Replace error state with `navigate()` redirect to detail page. | FR-012 specifies redirect, not an error message. |
| Playbook query invalidation on archive | Invalidate playbook list query keys when archive succeeds (specs are removed from playbooks). | Playbook counts change when specs are removed; stale playbook data would be confusing. |

## Alternatives Considered

### Playbook Removal Strategy

| Option | Description | Decision |
|--------|-------------|----------|
| **A: Bulk DELETE** | Single `DELETE FROM playbook_specs WHERE spec_library_id = ? AND org_id = ?` | **Chosen** — simple, atomic, efficient. No position reordering needed (gaps in positions are acceptable). |
| B: Iterate + delete | Fetch all references with `findByLibrarySpec`, delete each individually | Rejected — N+1 queries, unnecessary complexity for a batch operation. |
| C: Soft-remove | Add `is_removed` flag to playbook_specs | Rejected — over-engineering. Spec says removal is permanent. No need to track former references. |

### Impact Preview Delivery

| Option | Description | Decision |
|--------|-------------|----------|
| **A: Separate GET endpoint** | `GET /specs/:specId/archive-impact` returns playbook names | **Chosen** — clean separation, cacheable, follows existing patterns. Dialog fetches on open. |
| B: Include in archive response | Return affected playbooks as part of the PATCH archive response | Rejected — user needs the info BEFORE confirming, not after. |
| C: Client-side calculation | Fetch all playbooks on the client and filter | Rejected — requires loading all playbook data; server has the authoritative state. |

### Idempotency Approach

| Option | Description | Decision |
|--------|-------------|----------|
| **A: Silent success** | If already in target state, return current state (200 OK) | **Chosen** — matches FR-019. Simpler for concurrent scenarios (two admins archiving simultaneously). |
| B: Error on duplicate | Throw a specific error code | Rejected — creates unnecessary error handling in the UI for a benign race condition. |
