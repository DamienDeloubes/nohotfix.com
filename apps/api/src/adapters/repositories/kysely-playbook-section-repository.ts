import type { Database } from '@nohotfix/db';
import type { PlaybookSection, PlaybookSectionRepository } from '@nohotfix/domain-authoring';
import type { Kysely } from 'kysely';

export class KyselyPlaybookSectionRepository implements PlaybookSectionRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByPlaybook(playbookId: string, orgId: string): Promise<PlaybookSection[]> {
    const rows = await this.db.selectFrom('playbook_sections').selectAll().where('playbook_id', '=', playbookId).where('org_id', '=', orgId).orderBy('position', 'asc').execute();
    return rows.map((row) => this.toSection(row));
  }

  async create(data: Omit<PlaybookSection, 'id' | 'createdAt'>): Promise<PlaybookSection> {
    const row = await this.db
      .insertInto('playbook_sections')
      .values({
        playbook_id: data.playbookId,
        org_id: data.orgId,
        name: data.name,
        position: data.position,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toSection(row);
  }

  async update(id: string, orgId: string, data: Partial<Pick<PlaybookSection, 'name' | 'position'>>): Promise<PlaybookSection | undefined> {
    const row = await this.db
      .updateTable('playbook_sections')
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.position !== undefined && { position: data.position }),
      })
      .where('id', '=', id)
      .where('org_id', '=', orgId)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toSection(row) : undefined;
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.db.deleteFrom('playbook_sections').where('id', '=', id).where('org_id', '=', orgId).execute();
  }

  private toSection(row: { id: string; playbook_id: string; org_id: string; name: string; position: number; created_at: Date }): PlaybookSection {
    return {
      id: row.id,
      playbookId: row.playbook_id,
      orgId: row.org_id,
      name: row.name,
      position: row.position,
      createdAt: row.created_at,
    };
  }
}
