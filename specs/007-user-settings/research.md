# Research: User Settings Page

**Branch**: `007-user-settings` | **Date**: 2026-03-08

## R1: Database Migration Strategy — display_name → first_name + last_name

**Decision**: Add `first_name` and `last_name` columns, backfill from `display_name`, then drop `display_name` in a single migration.

**Rationale**: Pre-launch application with no production data worth backward-compatibility concerns. A single migration is simpler than a phased approach. Kysely's `.addColumn()` and `.dropColumn()` in `alterTable` handles this cleanly.

**Alternatives considered**:
- Two-phase migration (add columns first, drop later): Unnecessary complexity for pre-launch.
- Repurpose `display_name` by splitting on space: Fragile; names with multiple spaces or single names break.

## R2: Value Object Design — FirstName and LastName vs inline validation

**Decision**: Create `FirstName` and `LastName` value objects following the existing `DisplayName` pattern (private constructor, static `.create()`, `.equals()`, `.toString()`).

**Rationale**: Consistent with the established entity pattern in `packages/domains/identity/`. Value objects encapsulate validation (non-empty after trim, max 50 chars) and ensure the domain layer enforces constraints without infrastructure dependencies.

**Alternatives considered**:
- Inline validation in entity: Violates the established value object pattern. Less reusable.
- Single `PersonName` value object with first/last: Over-engineered; the two fields have different nullability rules (first required, last nullable).

## R3: WorkOS UserProfile → first_name/last_name Mapping

**Decision**: The existing `UserProfileProvider` port already returns `firstName` and `lastName` as separate fields. The `resolveUserFromJwt` use case currently concatenates them into a single `displayName`. We'll update it to pass them through separately.

**Rationale**: WorkOS already provides the data in the desired format. The current concatenation in `resolve-user-from-jwt.ts` line 44 (`${profile.firstName} ${profile.lastName ?? ''}`) is the only code that collapses them. Removing this concatenation and storing separately is the natural fix.

**Alternatives considered**:
- Keep concatenating for a `display_name` computed field: Adds complexity with no benefit since we're dropping the column.

## R4: LastName Nullability

**Decision**: `last_name` is nullable at the database level. `LastName` value object is only required when saving from the User Settings page (FR-005). The entity stores `lastName: LastName | null`.

**Rationale**: WorkOS may not supply a last name. Migrated users will have null last name. Forcing last name would block existing users.

**Alternatives considered**:
- Required at DB level with empty string default: Empty string is semantically wrong; null correctly represents "not provided."

## R5: AuthUser Middleware Type

**Decision**: Replace `displayName?: string` with `firstName?: string` and `lastName?: string` in the `AuthUser` interface. The JWT `display_name` claim from WorkOS is no longer used for storage — we use the local DB values.

**Rationale**: The auth middleware extracts claims from the JWT, but the user's name is now authoritative from the local DB (not the JWT). The middleware still passes JWT claims for tracing/logging, but the canonical name comes from the user repository.

**Alternatives considered**:
- Remove name from AuthUser entirely: Still useful for logging/tracing without a DB round-trip.

## R6: Query Key Strategy

**Decision**: Add `userKeys` to `apps/app/src/api/query-keys.ts`:
```
userKeys.me()         → ['user', 'me']
userKeys.profile()    → ['user', 'profile']
```
The `useUpdateUserProfile` mutation hook invalidates `userKeys.me()` on success.

**Rationale**: User data is not org-scoped (same user across orgs), so no `orgSlug` in the key. Follows the existing factory pattern.

**Alternatives considered**:
- Nest under `settingsKeys`: Settings keys are org-scoped; user profile is user-scoped.
