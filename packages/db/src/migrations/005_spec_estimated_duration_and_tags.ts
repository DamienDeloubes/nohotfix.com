import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE spec_library
      ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER,
      ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

    ALTER TABLE spec_library
      ADD CONSTRAINT spec_library_estimated_duration_minutes_check
        CHECK (estimated_duration_minutes IS NULL OR (estimated_duration_minutes >= 1 AND estimated_duration_minutes <= 999));

    CREATE INDEX IF NOT EXISTS idx_spec_library_tags ON spec_library USING GIN (tags);
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP INDEX IF EXISTS idx_spec_library_tags;

    ALTER TABLE spec_library
      DROP CONSTRAINT IF EXISTS spec_library_estimated_duration_minutes_check;

    ALTER TABLE spec_library
      DROP COLUMN IF EXISTS estimated_duration_minutes,
      DROP COLUMN IF EXISTS tags;
  `.execute(db);
}
