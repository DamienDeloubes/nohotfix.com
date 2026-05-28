import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Make section_id nullable to support ungrouped specs (specs not belonging to any section)
  await sql`
    ALTER TABLE playbook_specs ALTER COLUMN section_id DROP NOT NULL
  `.execute(db);

  // Composite index for efficient queries: all specs in a playbook, ungrouped specs
  await sql`
    CREATE INDEX IF NOT EXISTS idx_pb_specs_playbook
    ON playbook_specs (playbook_id, section_id, position)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Remove any ungrouped specs before re-adding NOT NULL constraint
  await sql`
    DELETE FROM playbook_specs WHERE section_id IS NULL
  `.execute(db);

  await sql`
    ALTER TABLE playbook_specs ALTER COLUMN section_id SET NOT NULL
  `.execute(db);

  await sql`
    DROP INDEX IF EXISTS idx_pb_specs_playbook
  `.execute(db);
}
