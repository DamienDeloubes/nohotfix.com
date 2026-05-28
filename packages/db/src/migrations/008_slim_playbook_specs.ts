import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Remove denormalized spec content columns from playbook_specs.
  // Playbook specs are now thin references to spec_library; content is
  // resolved via JOIN at read time and snapshot-copied only at run creation.
  await sql`
    ALTER TABLE playbook_specs
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS system_under_test,
      DROP COLUMN IF EXISTS severity,
      DROP COLUMN IF EXISTS preconditions,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS test_steps,
      DROP COLUMN IF EXISTS expected_result,
      DROP COLUMN IF EXISTS artifact_requirements,
      DROP COLUMN IF EXISTS tester_notes
  `.execute(db);

  // spec_library_id is now required (every playbook spec must reference a library spec)
  await sql`
    ALTER TABLE playbook_specs ALTER COLUMN spec_library_id SET NOT NULL
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Make spec_library_id nullable again
  await sql`
    ALTER TABLE playbook_specs ALTER COLUMN spec_library_id DROP NOT NULL
  `.execute(db);

  // Re-add denormalized columns
  await sql`
    ALTER TABLE playbook_specs
      ADD COLUMN title TEXT,
      ADD COLUMN system_under_test TEXT,
      ADD COLUMN severity TEXT CHECK (severity IN ('critical','high','medium','low')),
      ADD COLUMN preconditions JSONB,
      ADD COLUMN description JSONB,
      ADD COLUMN test_steps JSONB,
      ADD COLUMN expected_result JSONB,
      ADD COLUMN artifact_requirements JSONB,
      ADD COLUMN tester_notes TEXT
  `.execute(db);

  // Backfill from spec_library where possible
  await sql`
    UPDATE playbook_specs ps
    SET
      title = sl.title,
      system_under_test = sl.system_under_test,
      severity = sl.severity,
      preconditions = sl.preconditions,
      description = sl.description,
      test_steps = sl.test_steps,
      expected_result = sl.expected_result,
      artifact_requirements = sl.artifact_requirements,
      tester_notes = sl.tester_notes
    FROM spec_library sl
    WHERE ps.spec_library_id = sl.id
  `.execute(db);

  // Set title NOT NULL after backfill
  await sql`
    ALTER TABLE playbook_specs ALTER COLUMN title SET NOT NULL
  `.execute(db);
}
