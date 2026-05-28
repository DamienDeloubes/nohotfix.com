import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // 1. Add slug column (nullable initially for backfill)
  await sql`ALTER TABLE organisations ADD COLUMN slug TEXT`.execute(db);

  // 2. Backfill existing rows with their UUID as slug fallback
  await sql`UPDATE organisations SET slug = id WHERE slug IS NULL`.execute(db);

  // 3. Make slug NOT NULL
  await sql`ALTER TABLE organisations ALTER COLUMN slug SET NOT NULL`.execute(db);

  // 4. Create unique index on slug
  await sql`CREATE UNIQUE INDEX idx_organisations_slug ON organisations (slug)`.execute(db);

  // 5. Drop existing CHECK constraint on memberships.role and add new one with 'owner'
  await sql`ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_role_check`.execute(db);
  await sql`ALTER TABLE memberships ADD CONSTRAINT memberships_role_check CHECK (role IN ('owner', 'admin', 'member'))`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // 1. Drop unique index
  await sql`DROP INDEX IF EXISTS idx_organisations_slug`.execute(db);

  // 2. Drop slug column
  await sql`ALTER TABLE organisations DROP COLUMN IF EXISTS slug`.execute(db);

  // 3. Migrate owner roles back to admin
  await sql`UPDATE memberships SET role = 'admin' WHERE role = 'owner'`.execute(db);

  // 4. Restore original CHECK constraint
  await sql`ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_role_check`.execute(db);
  await sql`ALTER TABLE memberships ADD CONSTRAINT memberships_role_check CHECK (role IN ('admin', 'member'))`.execute(db);
}
