# Data Model: Organization Onboarding

## Entity Changes

### Organisation (modified)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Existing |
| name | TEXT | NOT NULL, max 100 chars | Existing |
| **slug** | **TEXT** | **NOT NULL, UNIQUE, 3-50 chars, `^[a-z0-9]+(-[a-z0-9]+)*$`** | **New** |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Existing |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Existing |

**Slug validation rules**:
- Lowercase letters, numbers, hyphens only
- Cannot start or end with a hyphen
- Between 3 and 50 characters
- Globally unique (enforced by UNIQUE index)

### Membership (modified)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Existing |
| org_id | UUID | FK → organisations(id), NOT NULL | Existing |
| user_id | UUID | FK → users(id), NOT NULL | Existing |
| role | TEXT | NOT NULL, CHECK `('owner', 'admin', 'member')` | **Modified**: added `'owner'` |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Existing |

**Unique constraint**: `(org_id, user_id)` — unchanged.

### User (unchanged)

No changes to the users table. Referenced via `memberships.user_id`.

## Relationships

```
User 1──N Membership N──1 Organisation
```

- A user can belong to multiple organisations (via memberships)
- An organisation has multiple members (via memberships)
- The organisation creator gets a membership with `role = 'owner'`
- Each organisation has exactly one owner (enforced at application level, not DB constraint)

## Migration: `002_add_org_slug_and_owner_role.ts`

### Up

1. Add `slug TEXT` column to `organisations` (nullable initially for backfill)
2. Backfill existing rows: set `slug = id` (UUID as slug fallback)
3. Alter column to `NOT NULL`
4. Create unique index `idx_organisations_slug ON organisations (slug)`
5. Drop existing CHECK constraint on `memberships.role`
6. Add new CHECK constraint: `role IN ('owner', 'admin', 'member')`

### Down

1. Drop unique index `idx_organisations_slug`
2. Drop `slug` column from `organisations`
3. Update any `'owner'` roles to `'admin'` (data migration)
4. Drop and re-add CHECK constraint: `role IN ('admin', 'member')`

## Domain Entity Updates

### OrganisationEntity

- Add `slug: OrganisationSlug` property
- `static create(params: { id: string; name: string; slug: string })` — validates via value objects
- `static reconstitute(props: OrganisationProps)` — includes slug
- No `changeSlug()` method (slugs are immutable after creation in this feature)

### OrganisationSlug (new value object)

- Validates: 3-50 chars, matches `^[a-z0-9]+(-[a-z0-9]+)*$`
- Immutable, created via `OrganisationSlug.create(raw: string)`
- Throws descriptive error on invalid input

### Role (value object update)

- `RoleValue` becomes `'owner' | 'admin' | 'member'`
- Add `static owner(): Role`
- Add `isOwner(): boolean`
- Update `VALID_ROLES` set

## Repository Port Changes

### OrganisationRepository (updated)

```typescript
interface OrganisationRepository {
  findById(id: string): Promise<OrganisationEntity | undefined>;
  findBySlug(slug: string): Promise<OrganisationEntity | undefined>;       // New
  findByUserId(userId: string): Promise<OrganisationEntity[]>;             // New
  create(entity: OrganisationEntity): Promise<OrganisationEntity>;         // New
  update(id: string, data: { name?: string }): Promise<OrganisationEntity | undefined>;
  slugExists(slug: string): Promise<boolean>;                              // New
}
```

### MembershipRepository (unchanged interface, existing `create()` suffices)

The existing `create(data: { orgId, userId, role })` method handles owner membership creation.
