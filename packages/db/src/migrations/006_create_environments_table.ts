import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Create environments table
  await sql`
    CREATE TABLE IF NOT EXISTS environments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT environments_name_length_check CHECK (CHAR_LENGTH(name) >= 1 AND CHAR_LENGTH(name) <= 100)
    )
  `.execute(db);

  // Index for listing environments by org in position order
  await sql`
    CREATE INDEX IF NOT EXISTS idx_environments_org_position
    ON environments (org_id, position)
  `.execute(db);

  // Case-insensitive unique constraint on (org_id, name)
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_environments_org_name
    ON environments (org_id, LOWER(name))
  `.execute(db);

  // Add environment_id FK column to playbooks
  await sql`
    ALTER TABLE playbooks
    ADD COLUMN IF NOT EXISTS environment_id UUID REFERENCES environments(id)
  `.execute(db);

  // Verify no non-null data exists in playbooks.environment before dropping
  const result = await sql<{ count: string }>`
    SELECT COUNT(*) as count FROM playbooks WHERE environment IS NOT NULL
  `.execute(db);

  const nonNullCount = parseInt(result.rows[0]?.count ?? '0', 10);

  if (nonNullCount > 0) {
    // Map freeform values to environment IDs by name match before drop
    await sql`
      UPDATE playbooks p
      SET environment_id = e.id
      FROM environments e
      WHERE e.org_id = p.org_id
        AND LOWER(e.name) = LOWER(p.environment)
        AND p.environment IS NOT NULL
    `.execute(db);
  }

  // Drop the freeform environment TEXT column
  await sql`
    ALTER TABLE playbooks DROP COLUMN IF EXISTS environment
  `.execute(db);

  // Seed 3 default environments for all existing organisations that have no environments
  await sql`
    INSERT INTO environments (org_id, name, position)
    SELECT o.id, env.name, env.position
    FROM organisations o
    CROSS JOIN (
      VALUES ('Production', 0), ('Acceptance', 1), ('Test', 2)
    ) AS env(name, position)
    WHERE NOT EXISTS (
      SELECT 1 FROM environments e WHERE e.org_id = o.id
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Re-add the freeform environment column to playbooks
  await sql`
    ALTER TABLE playbooks ADD COLUMN IF NOT EXISTS environment TEXT
  `.execute(db);

  // Drop environment_id FK column from playbooks
  await sql`
    ALTER TABLE playbooks DROP COLUMN IF EXISTS environment_id
  `.execute(db);

  // Drop environments table
  await sql`DROP TABLE IF EXISTS environments CASCADE`.execute(db);
}
