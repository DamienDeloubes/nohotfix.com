import type { Database } from '@nohotfix/db';
import { MembershipEntity, Role, type MembershipRepository, type MemberWithUserDto, type RoleValue } from '@nohotfix/domain-identity';
import { sql, type Kysely } from 'kysely';

export class KyselyMembershipRepository implements MembershipRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findMembersWithUsers(orgId: string): Promise<MemberWithUserDto[]> {
    const rows = await this.db
      .selectFrom('memberships as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .where('m.org_id', '=', orgId)
      .select(['m.id as membership_id', 'm.user_id', 'u.first_name', 'u.last_name', 'u.email', 'm.role', 'm.created_at as joined_at'])
      .orderBy(sql`CASE m.role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 WHEN 'member' THEN 3 END`)
      .orderBy(sql`COALESCE(u.first_name, u.email)`, 'asc')
      .execute();

    return rows.map((row) => ({
      membershipId: row.membership_id,
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      role: row.role as RoleValue,
      joinedAt: row.joined_at,
    }));
  }

  async findByOrg(_orgId: string): Promise<MembershipEntity[]> {
    void this.db;
    // TODO: Implement with Kysely — reconstitute via MembershipEntity.reconstitute()
    return [];
  }

  async findByOrgAndUser(orgId: string, userId: string): Promise<MembershipEntity | undefined> {
    const row = await this.db.selectFrom('memberships').selectAll().where('org_id', '=', orgId).where('user_id', '=', userId).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findByOrgAndEmail(orgId: string, email: string): Promise<MembershipEntity | undefined> {
    const row = await this.db
      .selectFrom('memberships as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .where('m.org_id', '=', orgId)
      .where('u.email', '=', email.toLowerCase())
      .select(['m.id', 'm.org_id', 'm.user_id', 'm.role', 'm.created_at'])
      .executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findByOrgAndId(orgId: string, id: string): Promise<MembershipEntity | undefined> {
    const row = await this.db.selectFrom('memberships').selectAll().where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async countAdmins(orgId: string): Promise<number> {
    const result = await this.db
      .selectFrom('memberships')
      .select(this.db.fn.countAll<string>().as('count'))
      .where('org_id', '=', orgId)
      .where('role', '=', 'admin')
      .executeTakeFirstOrThrow();
    return parseInt(result.count, 10);
  }

  async create(data: { orgId: string; userId: string; role: RoleValue }): Promise<MembershipEntity> {
    const row = await this.db.insertInto('memberships').values({ org_id: data.orgId, user_id: data.userId, role: data.role }).returningAll().executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  async updateRole(orgId: string, id: string, role: RoleValue): Promise<MembershipEntity | undefined> {
    const row = await this.db.updateTable('memberships').set({ role }).where('id', '=', id).where('org_id', '=', orgId).returningAll().executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async transferOwnership(orgId: string, newOwnerId: string, previousOwnerId: string): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx.updateTable('memberships').set({ role: 'owner' }).where('id', '=', newOwnerId).where('org_id', '=', orgId).execute();
      await trx.updateTable('memberships').set({ role: 'admin' }).where('id', '=', previousOwnerId).where('org_id', '=', orgId).execute();
    });
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const result = await this.db.deleteFrom('memberships').where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return (result?.numDeletedRows ?? 0n) > 0n;
  }

  private toEntity(row: { id: string; org_id: string; user_id: string; role: string; created_at: Date }): MembershipEntity {
    return MembershipEntity.reconstitute({
      id: row.id,
      orgId: row.org_id,
      userId: row.user_id,
      role: Role.create(row.role),
      createdAt: row.created_at,
    });
  }
}
