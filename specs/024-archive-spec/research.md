# Research: Archive Spec

## Decision 1: Archive/Unarchive API Design

**Decision**: Two separate PATCH endpoints — `PATCH /api/orgs/:orgSlug/specs/:specId/archive` and `PATCH /api/orgs/:orgSlug/specs/:specId/unarchive` — rather than a single PATCH with a body `{ isArchived: boolean }`.

**Rationale**: Separate endpoints provide clearer semantics, simpler role guard configuration, and distinct OTel span names. Each endpoint is a self-documenting action. The changelog action ("archived" / "unarchived") maps 1:1 to the endpoint.

**Alternatives considered**:
- Single `PATCH /specs/:specId` with `{ isArchived: true/false }` — rejected because it overloads the existing update endpoint and makes role guarding and changelog recording more complex.
- `DELETE` for archive + `POST` for unarchive — rejected because archive is not deletion; misleading HTTP semantics.

## Decision 2: Repository Method Design

**Decision**: Add a `setArchived(id: string, orgId: string, isArchived: boolean): Promise<SpecLibraryEntry | undefined>` method to the `SpecLibraryRepository` port interface, rather than reusing the existing `update()` method.

**Rationale**: The existing `update()` method accepts a `Partial<SpecLibraryEntry>` which could technically set `isArchived`, but a dedicated method makes the intent explicit, is easier to test, and avoids accidentally allowing `isArchived` to be set via the general update path.

**Alternatives considered**:
- Reuse `update()` with `{ isArchived: true }` — rejected because it conflates spec field editing with lifecycle state changes and bypasses the archived-spec update guard in `updateLibrarySpec`.

## Decision 3: Toast Notification Pattern

**Decision**: Create a minimal app-global Toast component in `apps/app/src/components/ui/` using a React context provider. Toasts are auto-dismissed after 4 seconds with a manual dismiss option.

**Rationale**: The codebase currently has no toast system (uses `window.confirm` for unsaved changes). Archive/unarchive require success and error toasts. A lightweight context-based approach fits the YAGNI principle while being reusable for future features.

**Alternatives considered**:
- Third-party library (react-hot-toast, sonner) — rejected to avoid adding a dependency for a simple use case. Can migrate later if needs grow.
- Inline status messages — rejected because the archive action from the detail page redirects to the overview, losing inline state.

## Decision 4: Confirmation Dialog Pattern

**Decision**: Create a reusable ConfirmDialog component in `apps/app/src/components/ui/` that accepts title, description, confirm/cancel button labels, and a variant (default/destructive). Archive uses the "destructive" variant.

**Rationale**: The codebase uses `window.confirm()` for unsaved changes, which is inconsistent with a polished SPA. A custom dialog enables consistent styling and branding. The component is generic enough for future reuse (delete confirmation, leave page, etc.).

**Alternatives considered**:
- `window.confirm()` — rejected because it cannot be styled, doesn't match the SPA design, and cannot show rich content.
- Inline confirmation (expand row with confirm/cancel) — rejected for complexity and inconsistency with the detail page entry point.

## Decision 5: Optimistic Updates Strategy

**Decision**: Use TanStack Query's `onMutate` → `onError` → `onSettled` pattern for optimistic updates. On archive/unarchive from the overview table, optimistically remove the row from the current tab's cached list. On error, roll back by restoring the previous cache. On settle, invalidate the list queries to ensure consistency.

**Rationale**: This is the standard TanStack Query optimistic update pattern. It provides immediate feedback (spec disappears from current tab) while handling failures gracefully.

**Alternatives considered**:
- Server-first (wait for response before updating UI) — rejected because it adds perceived latency for a simple boolean toggle.
- Refetch-only (invalidate without optimistic removal) — rejected because the row lingering briefly after clicking "Archive" feels sluggish.

## Decision 6: Unarchive — No Confirmation Dialog

**Decision**: Unarchive executes immediately without a confirmation step, matching the spec requirement.

**Rationale**: Unarchiving is non-destructive — it restores access and editability. Requiring confirmation for a safe, reversible action adds friction without value. This aligns with the principle that only destructive/irreversible actions require confirmation (Constitution IV).

## Decision 7: Changelog Action Values

**Decision**: Add `"archived"` and `"unarchived"` to the `SpecHistoryActionSchema` enum in `packages/shared/src/schemas/specs.ts`. The `describeHistoryAction()` utility will map these to human-readable labels ("Archived" / "Unarchived").

**Rationale**: The existing changelog infrastructure supports arbitrary action strings validated by a Zod enum. Adding two new values is the minimal change needed.

## Decision 8: Edit URL Redirect for Archived Specs

**Decision**: The existing `$specId.edit.tsx` route already checks `isArchived` and prevents editing (lines 61-67). No additional redirect logic is needed — the existing guard is sufficient.

**Rationale**: The spec says navigating to the edit URL of an archived spec should redirect to the detail page. The existing implementation already handles this case by checking `isArchived` on the fetched spec and navigating away.
