# Research: Organization Onboarding

## R1: Database Migration Strategy for `slug` Column

**Decision**: Add `slug` column via new additive migration `002_add_org_slug_and_owner_role.ts`.

**Rationale**: Constitution mandates additive-only migrations in v1. The existing `organisations` table has no `slug` column. Adding a `TEXT NOT NULL UNIQUE` column with a unique index enables slug-based lookups for URL routing. The `owner` role must also be added to the `memberships.role` CHECK constraint.

**Alternatives considered**:
- Modify migration 001: Rejected — violates additive migration rule and would require re-running against production.
- Separate `org_slugs` table: Rejected — unnecessary indirection; slug is a core organisation attribute.

## R2: Auth Middleware Adaptation for Pre-Org Users

**Decision**: Create a lightweight `authMiddlewareNoOrg` variant that does not require `org_id` in the JWT payload. Used only for onboarding endpoints (`POST /api/orgs`, `GET /api/users/me/orgs`, `GET /api/orgs/check-slug`).

**Rationale**: The current `authMiddleware` extracts `org_id` from the JWT. During onboarding, the user has no org yet, so `org_id` may be empty/missing. The new variant validates the JWT and extracts `userId` + `email` but does not require `org_id`. Existing org-scoped endpoints continue using the standard `authMiddleware`.

**Alternatives considered**:
- Make `org_id` optional in existing middleware: Rejected — would weaken the tenancy guarantee on all existing endpoints.
- Skip auth on onboarding endpoints: Rejected — must verify the user is authenticated.

## R3: Route Restructuring Under `$orgSlug`

**Decision**: Introduce a `_authenticated/$orgSlug.tsx` layout route that captures the org slug from the URL, validates it against the user's orgs, and provides org context to child routes.

**Rationale**: The spec requires all dashboard routes scoped under `/<org-slug>/...`. TanStack Router's file-based routing supports dynamic segments via `$paramName` directory convention. The layout `beforeLoad` validates the slug belongs to the authenticated user's organizations.

**Alternatives considered**:
- Query parameter for org context: Rejected by spec (clarification chose URL path).
- Server-side session org storage: Rejected by spec.

## R4: Onboarding Route Placement

**Decision**: Place the onboarding route at `/onboarding/create-org` outside the org-scoped `$orgSlug` layout but inside authentication checks.

**Rationale**: The onboarding form must be accessible to authenticated users who have no org yet. It cannot be under `$orgSlug` (no slug exists yet). The `_authenticated.tsx` layout `beforeLoad` checks if user has orgs: if not, redirects to `/onboarding/create-org`; if yes, continues to the org-scoped routes. The onboarding route itself must also verify authentication (redirect to login if not).

**Alternatives considered**:
- Place onboarding under a separate `_unauthenticated` layout: Rejected — user must be authenticated.
- Modal overlay on dashboard: Rejected — user has no dashboard to show.

## R5: Slug Uniqueness Validation (Frontend)

**Decision**: Debounced async slug check via `GET /api/orgs/check-slug?slug=<value>`. Debounce at 300ms. Show inline availability status.

**Rationale**: Provides immediate feedback without waiting for form submission. Standard UX pattern for unique identifier fields (GitHub repo names, Slack workspaces, etc.).

**Alternatives considered**:
- Validate only on form submit: Rejected — poor UX; user discovers conflict only after submission.
- WebSocket for real-time check: Over-engineered for this use case.

## R6: Role Value Object Update

**Decision**: Add `'owner'` to the `RoleValue` type and `Role` value object. Update the database CHECK constraint. Update the `SessionUserSchema` in `packages/shared`.

**Rationale**: The spec clarification established "owner" as a distinct role from "admin". The existing `Role` value object supports `'admin' | 'member'`. Adding `'owner'` as a third value maintains the existing pattern.

**Alternatives considered**:
- Separate `is_owner` boolean column: Rejected — role is already a single-value enum pattern; adding a parallel field creates ambiguity.
- Keep "admin" and treat first admin as implicit owner: Rejected — spec explicitly requires distinct roles.

## R7: Session Enhancement for Org List

**Decision**: Add `GET /api/users/me/orgs` endpoint that returns the user's organizations (with slug). The frontend fetches this on app load to determine routing.

**Rationale**: The current `GET /api/users/me` returns user profile + `orgId` from JWT. For the onboarding guard, we need to know if the user has *any* orgs (not just the one in the JWT). A separate endpoint is cleaner than overloading `/users/me`.

**Alternatives considered**:
- Include orgs in `/users/me` response: Viable but mixes concerns; `/users/me` is about the current session profile.
- Client-side redirect based on JWT `org_id` being empty: Fragile — depends on JWT structure and doesn't confirm org exists in DB.
