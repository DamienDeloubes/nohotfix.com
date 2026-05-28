# Research: Change Member Role

**Feature**: 009-change-member-role | **Date**: 2026-03-09

## R1: Ownership Transfer Atomicity

**Decision**: Use a dedicated `transferOwnership()` method on the `MembershipRepository` port. The Kysely adapter implements it using a database transaction (`db.transaction().execute()`) that updates both memberships atomically.

**Rationale**: The domain use case must not know about database transactions (hexagonal architecture). By expressing the atomic operation as a port method, the domain stays infrastructure-agnostic while the adapter ensures transactional integrity. The transaction guarantees that no intermediate state (zero or two owners) is ever persisted.

**Alternatives considered**:
- **Two separate `updateRole()` calls**: Rejected — non-atomic; crash between calls leaves org with zero or two owners.
- **Database trigger enforcing single owner**: Rejected — adds complexity for a v1 feature; the transaction approach is simpler and sufficient.
- **Separate API endpoint for ownership transfer**: Rejected — overcomplicates the API surface. A single PATCH endpoint with role=owner triggers the transfer flow in the use case.

## R2: API Endpoint Design — Single vs Multiple Endpoints

**Decision**: Single `PATCH /api/orgs/:orgSlug/members/:memberId/role` endpoint handles both regular role changes and ownership transfer. The request body contains `{ role: 'owner' | 'admin' | 'member' }`. The use case internally branches based on whether the target role is `owner`.

**Rationale**: The existing codebase already has a stubbed `PATCH .../role` endpoint returning 501. Using the same endpoint simplifies the API surface and matches existing patterns. The use case handles the business logic divergence transparently.

**Alternatives considered**:
- **Separate `POST .../transfer-ownership`**: Rejected — creates an inconsistent API pattern and requires a new route. The single endpoint with role-based branching is cleaner.

## R3: Error Code Naming for New Domain Errors

**Decision**: Three new error codes following the `AUTH_*` taxonomy:
1. `AUTH_ROLE_SAME` (400) — Target already has the requested role (no-op rejection)
2. `AUTH_OWNER_SELF_DEMOTE` (403) — Owner attempts to change their own role without transferring ownership
3. `AUTH_TARGET_NOT_FOUND` (404) — Target membership not found in the organisation

**Rationale**: These are distinct from existing codes. `AUTH_MEMBERSHIP_NOT_FOUND` (403) is for the *requester* not being a member (middleware-level). `AUTH_TARGET_NOT_FOUND` (404) is for the *target* of a role change not existing. Separation avoids confusing error semantics.

**Alternatives considered**:
- **Reuse `AUTH_MEMBERSHIP_NOT_FOUND` for target**: Rejected — different HTTP status (403 vs 404) and different semantic context (middleware auth vs business rule).
- **Use a generic validation error**: Rejected — violates the error taxonomy principle; each distinct error path must have a specific code.

## R4: UI Interaction Pattern for Role Changes

**Decision**: Add an inline role dropdown to each member row in the MembersList component. The dropdown shows available roles based on the actor's role (admin sees admin/member; owner sees owner/admin/member). Selecting a new role triggers the mutation immediately (with confirmation dialog for ownership transfer and admin self-demotion).

**Rationale**: Inline dropdowns are consistent with common admin panel patterns (e.g., GitHub, Linear, Notion). They minimise clicks for the most common operation (promote/demote). The confirmation dialogs for high-stakes actions (FR-013, FR-014) add a safety net without friction for routine changes.

**Alternatives considered**:
- **Modal dialog for role changes**: Rejected — adds unnecessary friction for a simple operation.
- **Separate settings page per member**: Rejected — overengineered for a single field change.
- **Click-to-edit role badge**: Rejected — less discoverable than a dropdown; inconsistent with form patterns.

## R5: Admin-to-Admin Demotion and Last-Admin Constraint

**Decision**: The existing `MembershipService.enforceLastAdminConstraint()` is reused. The constraint counts admins (not owners) — the owner is not counted as an admin for this purpose. An admin can demote another admin as long as at least one admin remains. The owner can always manage roles regardless of admin count.

**Rationale**: The constraint prevents an organisation from losing all administrative capacity below the owner level. The owner always retains full control, so the constraint applies specifically to the admin pool. The existing `countAdmins()` method (currently a TODO) counts memberships with `role = 'admin'`, excluding the owner.

**Alternatives considered**:
- **Count owner as admin for constraint**: Rejected — semantically incorrect; the owner is a distinct role, and the constraint is specifically about admin-level management capacity.
- **No last-admin constraint**: Rejected — already established in the codebase and constitution.

## R6: Concurrency Strategy

**Decision**: Last-write-wins with no optimistic locking. The `updateRole()` repository method performs a simple UPDATE with no version check. For ownership transfer, the transaction ensures atomicity but does not prevent concurrent transfers (the last transaction to commit wins).

**Rationale**: Role changes are infrequent operations in B2B SaaS (typically < 1/day/org). The risk of concurrent conflicting role changes is negligible. Adding optimistic locking (e.g., `updated_at` check) would add complexity without meaningful benefit. The spec explicitly states last-write-wins for concurrent changes.

**Alternatives considered**:
- **Optimistic locking with version column**: Rejected — overengineered for the frequency of this operation.
- **Pessimistic locking (SELECT FOR UPDATE)**: Rejected — adds latency and deadlock risk for negligible benefit.
