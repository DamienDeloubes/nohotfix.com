import type { Database } from '@nohotfix/db';
import type { PlaybookSpec, PlaybookSpecRepository } from '@nohotfix/domain-authoring';
import type { Kysely } from 'kysely';

export class KyselyPlaybookSpecRepository implements PlaybookSpecRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findBySection(sectionId: string, orgId: string): Promise<PlaybookSpec[]> {
    const rows = await this.db.selectFrom('playbook_specs').selectAll().where('section_id', '=', sectionId).where('org_id', '=', orgId).orderBy('position', 'asc').execute();
    return rows.map((row) => this.toSpec(row));
  }

  async findByPlaybook(playbookId: string, orgId: string): Promise<PlaybookSpec[]> {
    const rows = await this.db.selectFrom('playbook_specs').selectAll().where('playbook_id', '=', playbookId).where('org_id', '=', orgId).orderBy('position', 'asc').execute();
    return rows.map((row) => this.toSpec(row));
  }

  async findUngrouped(playbookId: string, orgId: string): Promise<PlaybookSpec[]> {
    const rows = await this.db
      .selectFrom('playbook_specs')
      .selectAll()
      .where('playbook_id', '=', playbookId)
      .where('org_id', '=', orgId)
      .where('section_id', 'is', null)
      .orderBy('position', 'asc')
      .execute();
    return rows.map((row) => this.toSpec(row));
  }

  async findByLibrarySpec(specLibraryId: string, orgId: string): Promise<PlaybookSpec[]> {
    const rows = await this.db
      .selectFrom('playbook_specs')
      .selectAll()
      .where('spec_library_id', '=', specLibraryId)
      .where('org_id', '=', orgId)
      .orderBy('position', 'asc')
      .execute();
    return rows.map((row) => this.toSpec(row));
  }

  async create(data: Omit<PlaybookSpec, 'id' | 'createdAt'>): Promise<PlaybookSpec> {
    const row = await this.db
      .insertInto('playbook_specs')
      .values({
        section_id: data.sectionId,
        playbook_id: data.playbookId,
        org_id: data.orgId,
        spec_library_id: data.specLibraryId,
        position: data.position,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toSpec(row);
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.db.deleteFrom('playbook_specs').where('id', '=', id).where('org_id', '=', orgId).execute();
  }

  async updatePositions(updates: Array<{ id: string; position: number }>, orgId: string): Promise<void> {
    for (const update of updates) {
      await this.db.updateTable('playbook_specs').set({ position: update.position }).where('id', '=', update.id).where('org_id', '=', orgId).execute();
    }
  }

  async existsInPlaybook(playbookId: string, specLibraryId: string, orgId: string): Promise<boolean> {
    const row = await this.db
      .selectFrom('playbook_specs')
      .select('id')
      .where('playbook_id', '=', playbookId)
      .where('spec_library_id', '=', specLibraryId)
      .where('org_id', '=', orgId)
      .executeTakeFirst();
    return row !== undefined;
  }

  async deleteBySectionId(sectionId: string, orgId: string): Promise<void> {
    await this.db.deleteFrom('playbook_specs').where('section_id', '=', sectionId).where('org_id', '=', orgId).execute();
  }

  async removeByLibrarySpecId(specLibraryId: string, orgId: string): Promise<number> {
    const result = await this.db.deleteFrom('playbook_specs').where('spec_library_id', '=', specLibraryId).where('org_id', '=', orgId).executeTakeFirst();
    return Number(result.numDeletedRows);
  }

  async findPlaybooksReferencingSpec(specLibraryId: string, orgId: string): Promise<{ id: string; name: string; isArchived: boolean }[]> {
    const rows = await this.db
      .selectFrom('playbook_specs as ps')
      .innerJoin('playbooks as p', (join) => join.onRef('p.id', '=', 'ps.playbook_id').onRef('p.org_id', '=', 'ps.org_id'))
      .select(['p.id', 'p.name', 'p.is_archived'])
      .distinct()
      .where('ps.spec_library_id', '=', specLibraryId)
      .where('ps.org_id', '=', orgId)
      .orderBy('p.name', 'asc')
      .execute();
    return rows.map((row) => ({ id: row.id, name: row.name, isArchived: row.is_archived }));
  }

  private toSpec(row: { id: string; section_id: string | null; playbook_id: string; org_id: string; spec_library_id: string; position: number; created_at: Date }): PlaybookSpec {
    return {
      id: row.id,
      sectionId: row.section_id,
      playbookId: row.playbook_id,
      orgId: row.org_id,
      specLibraryId: row.spec_library_id,
      position: row.position,
      createdAt: row.created_at,
    };
  }
}
