# Research: Spec Library Overview

**Branch**: `020-spec-library-overview` | **Date**: 2026-03-10

## Decision 1: Primary Bounded Context

**Decision**: Authoring
**Rationale**: The spec library is a core Authoring concern. The existing `SpecLibraryRepository` port, `SpecLibraryEntryEntity`, and `createLibrarySpec` use case all live in `packages/domains/authoring/`. The new list/search endpoint extends this same context.
**Alternatives considered**: None — context assignment is unambiguous.

## Decision 2: Database — No Migration Required

**Decision**: No schema migration needed. The existing `spec_library` table already has all columns required for this feature (title, system_under_test, severity, tags, is_archived, created_at, updated_at, org_id). The GIN trigram index `idx_specs_org_title` on the title column and the composite index on `(org_id, is_archived)` already exist.
**Rationale**: Migration `001_initial_schema.ts` created the table with the trigram index. Migration `005_spec_estimated_duration_and_tags.ts` added the tags column with a GIN index. All columns needed for search, sort, filter, and pagination are present.
**Alternatives considered**: Adding a trigram index on `system_under_test` for search — deferred because the existing title index covers the primary search case and `system_under_test` searches can use `ILIKE` with acceptable performance at the expected scale (<500 specs per org).

## Decision 3: Search Implementation

**Decision**: Server-side search using PostgreSQL `ILIKE` with trigram acceleration on `title`, and plain `ILIKE` on `system_under_test`. Special characters (`%`, `_`, `\`) escaped server-side before query construction.
**Rationale**: The existing GIN trigram index on title accelerates `ILIKE` queries. For `system_under_test`, plain `ILIKE` is sufficient at the expected data volume. Trigram search provides fuzzy-ish matching naturally.
**Alternatives considered**: Full-text search with `tsvector` — rejected as over-engineering for the current scale and column set.

## Decision 4: Pagination Strategy

**Decision**: Offset/limit server-side pagination with a total count query.
**Rationale**: Spec matches the offset/limit pattern (fixed page size of 25, "Page X of Y" indicator, "Showing X-Y of Z specs"). Cursor-based pagination is unnecessary given the expected data volume (<500 specs per org) and the requirement for arbitrary page navigation.
**Alternatives considered**: Cursor-based pagination — rejected because the spec requires total count display and the data volume doesn't warrant the complexity.

## Decision 5: Frontend URL State Sync

**Decision**: Use TanStack Router's `validateSearch` with a Zod schema to parse and validate URL search params. This is the idiomatic approach for TanStack Router and provides type-safe search param access.
**Rationale**: TanStack Router has first-class support for search params via `validateSearch`. This provides automatic serialization/deserialization, type safety, and integration with `Link` components for URL updates. No existing routes use this pattern yet, but it's the documented approach for the framework.
**Alternatives considered**: Manual `URLSearchParams` parsing — rejected because TanStack Router's built-in approach is more type-safe and integrates with router navigation.

## Decision 6: UI Components — Inline CSS (Project Pattern)

**Decision**: Build table and filter components using inline CSS, following the existing project pattern established by `MembersList`, `PendingInviteRow`, and other domain components. No shadcn components are installed.
**Rationale**: The project currently has no shadcn components installed (only `.gitkeep` in `apps/app/src/components/ui/`). All existing domain components use inline styles. Introducing a component library for a single feature would break consistency.
**Alternatives considered**: Installing shadcn/ui Table, Badge, etc. — deferred to a separate infrastructure task if the team decides to adopt it project-wide.

## Decision 7: New Error Codes

**Decision**: No new error codes needed for this feature. The list endpoint returns empty results (not errors) for no-match scenarios. The existing `AUTHOR_SPEC_NOT_FOUND` covers the case where a deep-linked spec doesn't exist. API validation failures use standard 400 responses. The only error scenario is a system-level failure, covered by `SYS_DATABASE` and `SYS_INTERNAL`.
**Rationale**: List endpoints conventionally return empty arrays rather than errors for zero results. The spec explicitly defines empty states as UI-level concerns, not API error codes.
**Alternatives considered**: `AUTHOR_SPEC_LIST_FAILED` — rejected because generic system error codes cover infrastructure failures without needing a feature-specific code.

## Decision 8: Role Access

**Decision**: The list endpoint is accessible to all authenticated org members (any role). The existing `orgScopeMiddleware` provides auth + org membership verification. No additional role guard needed on the list route.
**Rationale**: The spec says "Roles: Anyone can view." The `orgScopeMiddleware` already ensures the user is an authenticated member of the org. The "+ New spec" button navigates to the create form, which has its own admin role guard.
**Alternatives considered**: Admin-only access — rejected per spec requirement.
