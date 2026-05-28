# Research: Edit Spec

## R1: Form Component Reuse Strategy

**Decision**: Extract a shared `SpecForm` component from the existing `CreateSpecForm`, then have both `CreateSpecForm` and `EditSpecForm` compose it.

**Rationale**: The existing `CreateSpecForm` contains all form logic (validation, test steps, artifact requirements, rich text, session storage). Extracting a `SpecForm` that accepts `initialValues`, `onSubmit`, `submitLabel`, and `storageKey` props keeps the domain UI DRY without introducing unnecessary abstraction. Both create and edit are thin wrappers.

**Alternatives considered**:
- Adding a `mode` prop to `CreateSpecForm` — rejected because it would overload a single component with conditional logic (different submit handler, different initial state, different navigation behavior).
- Building a separate `EditSpecForm` from scratch — rejected because it would duplicate ~90% of the form logic.

## R2: API Endpoint Design (PUT vs PATCH)

**Decision**: Use `PUT /api/orgs/:orgSlug/specs/:specId` with a full replacement payload (same shape as create).

**Rationale**: The edit form sends all fields at once (not partial updates). PUT semantics match the "replace entire spec" behavior. The `UpdateLibrarySpecRequestSchema` reuses `CreateLibrarySpecRequestSchema` fields. This aligns with the existing create endpoint pattern and avoids the complexity of partial merge logic.

**Alternatives considered**:
- PATCH with partial fields — rejected because the form always sends all fields and "last write wins" is the concurrency model. No benefit from partial updates.

## R3: History Change Detection Extension

**Decision**: Extend `SpecSnapshot` interface and `detectFieldChanges` function in `record-spec-changes.ts` to cover all editable fields.

**Rationale**: The existing `recordSpecChanges` use case tracks `title`, `description`, `tags`, `estimatedDurationMinutes`, and artifact requirements. Missing fields: `systemUnderTest`, `severity`, `preconditions`, `testSteps`, `expectedResult`, `testerNotes`. Each needs a corresponding `SPEC_HISTORY_ACTION` entry and detection logic.

**New SPEC_HISTORY_ACTIONS**:
- `system_under_test_changed` — records old/new values
- `severity_changed` — records old/new values
- `preconditions_updated` — no field_changes detail (JSONB comparison only)
- `test_steps_updated` — no field_changes detail (JSONB comparison only, per clarification Q3)
- `expected_result_updated` — no field_changes detail (JSONB comparison only)
- `tester_notes_updated` — no field_changes detail (text comparison only)

**Artifact requirements**: Already tracked granularly (`artifact_added`, `artifact_removed`, `artifact_modified`) with specific artifact label details — no changes needed (per clarification Q3).

## R4: Role Enforcement Strategy

**Decision**: Dual enforcement — backend API rejects non-admin/owner requests with `AUTH_ROLE_INSUFFICIENT`; frontend route `beforeLoad` redirects members to detail page.

**Rationale**: Defense in depth (per clarification Q1). The `orgScopeMiddleware` already resolves `request.orgContext.role`. The route handler checks role before processing. The frontend route uses `requireRole()` in `beforeLoad` to redirect before render.

**Alternatives considered**:
- Creating a new `adminGuard` middleware — rejected because the role check is a one-liner in the route handler and doesn't warrant a separate middleware for a single endpoint.

## R5: Unsaved Changes Protection

**Decision**: Use the browser `beforeunload` event for tab close/browser navigation, and TanStack Router's `useBlocker` for in-app navigation. Track dirty state by comparing current form values against initial values.

**Rationale**: Per clarification Q2, both browser-level and in-app navigation must trigger a confirmation dialog. `beforeunload` handles browser-level events. TanStack Router's `useBlocker` hook handles in-app SPA navigation. Dirty state is derived by deep-comparing the current form state against the initial values loaded from the API.

## R6: Archived Spec Guard

**Decision**: The frontend edit route fetches the spec and redirects to the detail page if `isArchived` is true. The backend PUT endpoint also checks `isArchived` and throws `AUTHOR_SPEC_ARCHIVED` if true.

**Rationale**: Both layers must enforce the guard. The frontend redirect provides a smooth UX; the backend rejection prevents API-level bypass.

## R7: No-Op Save Detection

**Decision**: The `updateLibrarySpec` use case always persists the update (simple PUT). The `recordSpecChanges` use case detects whether any fields actually changed and only creates changelog entries for actual changes. If nothing changed, zero changelog entries are created.

**Rationale**: The existing `recordSpecChanges` already compares old vs new snapshots and only creates entries for detected changes. The update use case doesn't need to skip the DB write — the cost of a no-op UPDATE is negligible and simpler than adding change detection at the use case level.
