# Research: Organisation Settings Page

**Branch**: `006-org-settings` | **Date**: 2026-03-07

## Decisions

### 1. Existing Domain Infrastructure

**Decision**: Reuse all existing Identity domain infrastructure — no new entities, ports, or adapters needed.

**Rationale**: Codebase research confirmed that `OrganisationEntity.rename()`, `OrganisationRepository.update()`, and `KyselyOrganisationRepository.update()` are all already implemented. The `PATCH /api/orgs/:orgSlug` route is declared but returns 501. Only a use case, route handler implementation, Zod schema, and UI component are missing.

**Alternatives considered**:
- Creating a separate `OrganisationSettingsService` domain service → Rejected: a simple use case function is sufficient for a single-field rename. No complex orchestration needed.

### 2. Role Enforcement Strategy

**Decision**: Enforce role check in the `renameOrganisation` use case (not middleware).

**Rationale**: The `orgScopeMiddleware` already resolves the user's role and attaches it to `request.orgContext`. The use case receives the role and checks `owner` or `admin` — throwing `AuthRoleInsufficientError` otherwise. This keeps enforcement testable at the domain level (pure unit tests) and follows the existing pattern where business rules live in use cases.

**Alternatives considered**:
- Adding a `roleGuardMiddleware('owner', 'admin')` at the route level → Rejected: role checks are business logic, not transport concerns. The existing `orgScopeMiddleware` verifies membership but does not filter by role — this is intentional per the hexagonal architecture.
- Hiding the edit endpoint entirely from Members → Rejected: the GET endpoint serves both roles. Only the PATCH needs role enforcement.

### 3. GET /api/orgs/:orgSlug Implementation

**Decision**: Implement the existing `GET /api/orgs/:orgSlug` stub alongside PATCH. The frontend needs organisation details (name, slug) for the settings page.

**Rationale**: The `orgScopeMiddleware` already resolves the org and provides `orgName`, `orgSlug`, and `orgId` in the request context. The GET handler simply returns these fields. However, having a proper GET endpoint is cleaner than relying on middleware side-effects and allows the UI to fetch org details independently.

**Alternatives considered**:
- Using the org context from the TanStack Router params + layout data → Considered viable for v1 but a proper GET endpoint is more robust and follows REST conventions.

### 4. Frontend Role-Based Rendering

**Decision**: Render a single `OrganisationSettingsForm` component that conditionally shows/hides edit affordances based on the user's role (available via `useOrgContext` hook from the org-scoped layout).

**Rationale**: All roles access the same route (`/settings/general`). The component shows the name in an editable input + save button for Owners/Admins, and as plain text for Members. The slug is always read-only. This follows the spec requirement that Members can view but not edit.

**Alternatives considered**:
- Separate read-only and edit components → Rejected: unnecessary duplication for a single-field form.
- Router-level `beforeLoad` guard blocking Members → Rejected: the spec requires Members to view the page.

### 5. Optimistic Update vs. Server Confirmation

**Decision**: Use standard mutation (not optimistic). Show a loading state during save, then display a success toast on completion.

**Rationale**: Organisation name changes are infrequent and low-latency (<1s expected). Optimistic updates add complexity with rollback logic for minimal UX gain. A standard `useMutation` → invalidate query pattern is simpler and sufficient.

**Alternatives considered**:
- Optimistic update with rollback → Rejected: over-engineering for a rare action.

### 6. Settings Default Tab Redirect

**Decision**: The settings index route (`/settings/`) redirects to `/settings/general` to make Organisation Settings the default tab.

**Rationale**: The spec requires Organisation Settings as the default destination when navigating to Settings. TanStack Router supports this via a `beforeLoad` redirect in the index route or simply rendering the general content inline. A redirect is cleaner and keeps URL consistency.

**Alternatives considered**:
- Rendering general settings inline in the layout → Rejected: breaks tab URL consistency.
