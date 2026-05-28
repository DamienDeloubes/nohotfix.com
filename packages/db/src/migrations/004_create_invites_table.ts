import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS invites (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES organisations(id),
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
      token TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'revoked')),
      invited_by UUID NOT NULL REFERENCES users(id),
      token_expires_at TIMESTAMPTZ NOT NULL,
      last_sent_at TIMESTAMPTZ NOT NULL,
      accepted_by UUID REFERENCES users(id),
      accepted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_invites_token
    ON invites (token)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_invites_org_email
    ON invites (org_id, email)
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS idx_invites_org_status
    ON invites (org_id, status)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE IF EXISTS invites CASCADE`.execute(db);
}
