import type { Database, Invite } from '@nohotfix/db';
import { Email, InviteEntity, InviteToken, Role, type InviteRepository, type InviteWithInviterDto, type NewInviteDto } from '@nohotfix/domain-identity';
import type { Kysely } from 'kysely';

export class KyselyInviteRepository implements InviteRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByToken(token: string): Promise<InviteEntity | undefined> {
    const row = await this.db.selectFrom('invites').selectAll().where('token', '=', token).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findById(orgId: string, id: string): Promise<InviteEntity | undefined> {
    const row = await this.db.selectFrom('invites').selectAll().where('org_id', '=', orgId).where('id', '=', id).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findPendingByOrgAndEmail(orgId: string, email: string): Promise<InviteEntity | undefined> {
    const row = await this.db
      .selectFrom('invites')
      .selectAll()
      .where('org_id', '=', orgId)
      .where('email', '=', email.toLowerCase())
      .where('status', '=', 'pending')
      .executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findPendingByOrg(orgId: string): Promise<InviteWithInviterDto[]> {
    const rows = await this.db
      .selectFrom('invites as i')
      .innerJoin('users as u', 'u.id', 'i.invited_by')
      .where('i.org_id', '=', orgId)
      .where('i.status', '=', 'pending')
      .select([
        'i.id',
        'i.org_id',
        'i.email',
        'i.role',
        'i.status',
        'i.invited_by',
        'u.first_name as inviter_first_name',
        'u.last_name as inviter_last_name',
        'i.token_expires_at',
        'i.last_sent_at',
        'i.created_at',
      ])
      .orderBy('i.created_at', 'desc')
      .execute();

    return rows.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      email: row.email,
      role: row.role,
      status: row.status,
      invitedBy: row.invited_by,
      inviterFirstName: row.inviter_first_name,
      inviterLastName: row.inviter_last_name,
      tokenExpiresAt: (row.token_expires_at as Date).toISOString(),
      lastSentAt: (row.last_sent_at as Date).toISOString(),
      createdAt: (row.created_at as Date).toISOString(),
    }));
  }

  async create(data: NewInviteDto): Promise<InviteEntity> {
    const row = await this.db
      .insertInto('invites')
      .values({
        org_id: data.orgId,
        email: data.email.toString(),
        role: data.role.toString() as 'admin' | 'member',
        token: data.token.toString(),
        status: data.status,
        invited_by: data.invitedBy,
        token_expires_at: data.tokenExpiresAt.toISOString(),
        last_sent_at: data.lastSentAt.toISOString(),
        accepted_by: data.acceptedBy,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  async update(invite: InviteEntity): Promise<void> {
    await this.db
      .updateTable('invites')
      .set({
        token: invite.token.toString(),
        status: invite.status,
        token_expires_at: invite.tokenExpiresAt.toISOString(),
        last_sent_at: invite.lastSentAt.toISOString(),
        accepted_by: invite.acceptedBy,
        updated_at: invite.updatedAt.toISOString(),
      })
      .where('org_id', '=', invite.orgId)
      .where('id', '=', invite.id)
      .execute();
  }

  async delete(orgId: string, id: string): Promise<void> {
    await this.db.deleteFrom('invites').where('org_id', '=', orgId).where('id', '=', id).execute();
  }

  private toEntity(row: Invite): InviteEntity {
    return InviteEntity.reconstitute({
      id: row.id,
      orgId: row.org_id,
      email: Email.create(row.email),
      role: Role.create(row.role),
      token: InviteToken.create(row.token),
      status: row.status,
      invitedBy: row.invited_by,
      tokenExpiresAt: row.token_expires_at instanceof Date ? row.token_expires_at : new Date(row.token_expires_at),
      lastSentAt: row.last_sent_at instanceof Date ? row.last_sent_at : new Date(row.last_sent_at),
      acceptedBy: row.accepted_by,
      acceptedAt: row.accepted_at instanceof Date ? row.accepted_at : row.accepted_at ? new Date(row.accepted_at) : null,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
      updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at),
    });
  }
}
