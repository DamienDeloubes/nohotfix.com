import type { Database } from '@nohotfix/db';
import { EnvironmentEntity, EnvironmentName, type EnvironmentRepository } from '@nohotfix/domain-identity';
import { sql, type Kysely } from 'kysely';

export class KyselyEnvironmentRepository implements EnvironmentRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByOrg(orgId: string): Promise<EnvironmentEntity[]> {
    const rows = await this.db.selectFrom('environments').selectAll().where('org_id', '=', orgId).orderBy('position', 'asc').execute();
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string, orgId: string): Promise<EnvironmentEntity | undefined> {
    const row = await this.db.selectFrom('environments').selectAll().where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async create(data: { orgId: string; name: string; position: number }): Promise<EnvironmentEntity> {
    const row = await this.db
      .insertInto('environments')
      .values({
        org_id: data.orgId,
        name: data.name,
        position: data.position,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  async update(id: string, orgId: string, data: { name?: string; position?: number }): Promise<EnvironmentEntity | undefined> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.position !== undefined) updateData.position = data.position;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id, orgId);
    }

    const row = await this.db.updateTable('environments').set(updateData).where('id', '=', id).where('org_id', '=', orgId).returningAll().executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async delete(id: string, orgId: string): Promise<boolean> {
    const result = await this.db.deleteFrom('environments').where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return result.numDeletedRows > 0n;
  }

  async countPlaybooksByEnvironmentId(environmentId: string, orgId: string): Promise<number> {
    const result = await this.db
      .selectFrom('playbooks')
      .select(sql<number>`count(*)::int`.as('count'))
      .where('environment_id', '=', environmentId)
      .where('org_id', '=', orgId)
      .executeTakeFirstOrThrow();
    return result.count;
  }

  async getMaxPosition(orgId: string): Promise<number> {
    const result = await this.db
      .selectFrom('environments')
      .select(sql<number | null>`max(position)`.as('max_position'))
      .where('org_id', '=', orgId)
      .executeTakeFirst();
    return result?.max_position ?? -1;
  }

  private toEntity(row: { id: string; org_id: string; name: string; position: number; created_at: Date }): EnvironmentEntity {
    return EnvironmentEntity.reconstitute({
      id: row.id,
      orgId: row.org_id,
      name: EnvironmentName.create(row.name),
      position: row.position,
      createdAt: row.created_at,
    });
  }
}
