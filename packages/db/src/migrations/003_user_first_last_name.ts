import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // 1. Add first_name and last_name columns (nullable)
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT`.execute(db);
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT`.execute(db);

  // 2. Backfill first_name from display_name for existing rows
  await sql`UPDATE users SET first_name = display_name WHERE display_name IS NOT NULL`.execute(db);

  // 3. Drop display_name column
  await sql`ALTER TABLE users DROP COLUMN IF EXISTS display_name`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // 1. Add display_name column back
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`.execute(db);

  // 2. Backfill display_name from first_name + last_name
  await sql`UPDATE users SET display_name = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) WHERE first_name IS NOT NULL OR last_name IS NOT NULL`.execute(db);

  // 3. Drop first_name and last_name columns
  await sql`ALTER TABLE users DROP COLUMN IF EXISTS first_name`.execute(db);
  await sql`ALTER TABLE users DROP COLUMN IF EXISTS last_name`.execute(db);
}
