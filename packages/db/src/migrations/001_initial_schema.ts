import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Enable uuid-ossp extension
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db);

  // organisations
  await sql`
    CREATE TABLE IF NOT EXISTS organisations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  // users
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      workos_user_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      display_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  // memberships
  await sql`
    CREATE TABLE IF NOT EXISTS memberships (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      user_id UUID NOT NULL REFERENCES users(id),
      role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_memberships_org
    ON memberships (org_id, user_id)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_memberships_user
    ON memberships (user_id)
  `.execute(db);

  // subscriptions
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL UNIQUE REFERENCES organisations(id),
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      status TEXT NOT NULL CHECK (status IN ('trialing','grace_period','past_due','active','cancelled','expired')),
      trial_ends_at TIMESTAMPTZ,
      current_period_start TIMESTAMPTZ,
      current_period_end TIMESTAMPTZ,
      cancel_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_org
    ON subscriptions (org_id)
  `.execute(db);

  // stripe_webhook_events
  await sql`
    CREATE TABLE IF NOT EXISTS stripe_webhook_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      stripe_event_id TEXT NOT NULL UNIQUE,
      event_type TEXT NOT NULL,
      processed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_stripe_events_id
    ON stripe_webhook_events (stripe_event_id)
  `.execute(db);

  // spec_library
  await sql`
    CREATE TABLE IF NOT EXISTS spec_library (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      title TEXT NOT NULL,
      system_under_test TEXT,
      severity TEXT CHECK (severity IN ('critical','high','medium','low')),
      preconditions JSONB,
      description JSONB,
      test_steps JSONB,
      expected_result JSONB,
      artifact_requirements JSONB,
      tester_notes TEXT,
      is_archived BOOLEAN NOT NULL DEFAULT FALSE,
      created_by UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_specs_org
    ON spec_library (org_id, is_archived)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_specs_org_title
    ON spec_library USING GIN (title gin_trgm_ops)
  `.execute(db);

  // playbooks
  await sql`
    CREATE TABLE IF NOT EXISTS playbooks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      name TEXT NOT NULL,
      description TEXT,
      environment TEXT,
      is_archived BOOLEAN NOT NULL DEFAULT FALSE,
      created_by UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_playbooks_org
    ON playbooks (org_id, is_archived)
  `.execute(db);

  // playbook_sections
  await sql`
    CREATE TABLE IF NOT EXISTS playbook_sections (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      playbook_id UUID NOT NULL REFERENCES playbooks(id) ON DELETE CASCADE,
      org_id UUID NOT NULL REFERENCES organisations(id),
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_pb_sections_playbook
    ON playbook_sections (playbook_id, position)
  `.execute(db);

  // playbook_specs
  await sql`
    CREATE TABLE IF NOT EXISTS playbook_specs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      section_id UUID NOT NULL REFERENCES playbook_sections(id) ON DELETE CASCADE,
      playbook_id UUID NOT NULL REFERENCES playbooks(id),
      org_id UUID NOT NULL REFERENCES organisations(id),
      spec_library_id UUID REFERENCES spec_library(id),
      title TEXT NOT NULL,
      system_under_test TEXT,
      severity TEXT CHECK (severity IN ('critical','high','medium','low')),
      preconditions JSONB,
      description JSONB,
      test_steps JSONB,
      expected_result JSONB,
      artifact_requirements JSONB,
      tester_notes TEXT,
      position INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_pb_specs_section
    ON playbook_specs (section_id, position)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_pb_specs_library
    ON playbook_specs (spec_library_id)
  `.execute(db);

  // runs
  await sql`
    CREATE TABLE IF NOT EXISTS runs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      playbook_id UUID NOT NULL REFERENCES playbooks(id),
      name TEXT NOT NULL,
      description TEXT,
      environment TEXT,
      status TEXT NOT NULL CHECK (status IN ('in_progress','awaiting_decision','go','no_go','abandoned')),
      target_date TIMESTAMPTZ,
      started_by UUID NOT NULL REFERENCES users(id),
      decision_by UUID REFERENCES users(id),
      decision_at TIMESTAMPTZ,
      decision_statement TEXT,
      failed_specs_at_decision JSONB,
      abandonment_reason TEXT,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_runs_org_status
    ON runs (org_id, status)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_runs_org_created
    ON runs (org_id, created_at DESC)
  `.execute(db);

  // run_sections
  await sql`
    CREATE TABLE IF NOT EXISTS run_sections (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      run_id UUID NOT NULL REFERENCES runs(id),
      org_id UUID NOT NULL REFERENCES organisations(id),
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      assigned_to UUID REFERENCES users(id),
      is_skipped BOOLEAN NOT NULL DEFAULT FALSE,
      skip_reason TEXT,
      skipped_by UUID REFERENCES users(id),
      skipped_at TIMESTAMPTZ
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_run_sections_run
    ON run_sections (run_id, position)
  `.execute(db);

  // run_specs
  await sql`
    CREATE TABLE IF NOT EXISTS run_specs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      run_section_id UUID NOT NULL REFERENCES run_sections(id),
      run_id UUID NOT NULL REFERENCES runs(id),
      org_id UUID NOT NULL REFERENCES organisations(id),
      title TEXT NOT NULL,
      system_under_test TEXT,
      severity TEXT CHECK (severity IN ('critical','high','medium','low')),
      preconditions JSONB,
      description JSONB,
      test_steps JSONB,
      expected_result JSONB,
      artifact_requirements JSONB,
      tester_notes TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending','in_progress','passed','failed','skipped')),
      claimed_by UUID REFERENCES users(id),
      executed_by UUID REFERENCES users(id),
      executed_at TIMESTAMPTZ,
      failure_reason TEXT,
      skip_reason TEXT,
      notes TEXT,
      position INTEGER NOT NULL
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_run_specs_section
    ON run_specs (run_section_id, position)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_run_specs_run_status
    ON run_specs (run_id, status)
  `.execute(db);

  // run_spec_artifacts
  await sql`
    CREATE TABLE IF NOT EXISTS run_spec_artifacts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      run_spec_id UUID NOT NULL REFERENCES run_specs(id),
      run_id UUID NOT NULL REFERENCES runs(id),
      org_id UUID NOT NULL REFERENCES organisations(id),
      requirement_index INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('file','table','measured_value','url')),
      file_key TEXT,
      file_name TEXT,
      file_type TEXT,
      file_size INTEGER,
      table_data JSONB,
      measured_value NUMERIC,
      measured_unit TEXT,
      measured_threshold_operator TEXT CHECK (measured_threshold_operator IN ('lte','gte','eq')),
      measured_threshold_value NUMERIC,
      url_value TEXT,
      uploaded_by UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_artifacts_spec
    ON run_spec_artifacts (run_spec_id)
  `.execute(db);

  // changelog
  await sql`
    CREATE TABLE IF NOT EXISTS changelog (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      entity_type TEXT NOT NULL CHECK (entity_type IN ('playbook','spec_library')),
      entity_id UUID NOT NULL,
      action TEXT NOT NULL,
      field_changes JSONB,
      actor_id UUID NOT NULL REFERENCES users(id),
      actor_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_changelog_entity
    ON changelog (org_id, entity_type, entity_id, created_at DESC)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE IF EXISTS changelog CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS run_spec_artifacts CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS run_specs CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS run_sections CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS runs CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS playbook_specs CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS playbook_sections CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS playbooks CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS spec_library CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS stripe_webhook_events CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS subscriptions CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS memberships CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS users CASCADE`.execute(db);
  await sql`DROP TABLE IF EXISTS organisations CASCADE`.execute(db);
}
