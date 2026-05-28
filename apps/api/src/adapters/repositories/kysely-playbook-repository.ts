import type { Database } from '@nohotfix/db';
import type { Playbook, PlaybookDetail, PlaybookRepository, PlaybookSectionDetail, PlaybookSpecSummary, PlaybookWithCounts } from '@nohotfix/domain-authoring';
import { sql, type Kysely } from 'kysely';

export class KyselyPlaybookRepository implements PlaybookRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string, orgId: string): Promise<Playbook | undefined> {
    const row = await this.db.selectFrom('playbooks').selectAll().where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return row ? this.toPlaybook(row) : undefined;
  }

  async findByOrg(orgId: string, includeArchived?: boolean): Promise<Playbook[]> {
    let query = this.db.selectFrom('playbooks').selectAll().where('org_id', '=', orgId);
    if (!includeArchived) {
      query = query.where('is_archived', '=', false);
    }
    const rows = await query.orderBy('created_at', 'desc').execute();
    return rows.map((row) => this.toPlaybook(row));
  }

  async findByOrgWithCounts(orgId: string, isArchived?: boolean): Promise<PlaybookWithCounts[]> {
    let query = this.db
      .selectFrom('playbooks')
      .leftJoin('environments', 'environments.id', 'playbooks.environment_id')
      .select([
        'playbooks.id',
        'playbooks.org_id',
        'playbooks.name',
        'playbooks.description',
        'playbooks.is_archived',
        'playbooks.created_by',
        'playbooks.created_at',
        'playbooks.updated_at',
        'environments.name as environment_name',
      ])
      .select(sql<string>`(SELECT COUNT(*) FROM playbook_specs WHERE playbook_specs.playbook_id = playbooks.id)`.as('spec_count'))
      .where('playbooks.org_id', '=', orgId);

    if (isArchived !== undefined) {
      query = query.where('playbooks.is_archived', '=', isArchived);
    }

    const rows = await query.orderBy('playbooks.created_at', 'desc').execute();
    return rows.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      name: row.name,
      ...(row.description != null && { description: row.description }),
      ...(row.environment_name != null && { environmentName: row.environment_name }),
      isArchived: row.is_archived,
      createdBy: row.created_by,
      specCount: parseInt(String(row.spec_count), 10),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async create(data: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playbook> {
    const row = await this.db
      .insertInto('playbooks')
      .values({
        org_id: data.orgId,
        name: data.name,
        description: data.description ?? null,
        environment_id: data.environmentId ?? null,
        is_archived: data.isArchived,
        created_by: data.createdBy,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toPlaybook(row);
  }

  async update(id: string, orgId: string, data: Partial<Pick<Playbook, 'name' | 'description' | 'isArchived'>> & { environmentId?: string | null }): Promise<Playbook | undefined> {
    const row = await this.db
      .updateTable('playbooks')
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.environmentId !== undefined && { environment_id: data.environmentId ?? null }),
        ...(data.isArchived !== undefined && { is_archived: data.isArchived }),
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', id)
      .where('org_id', '=', orgId)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toPlaybook(row) : undefined;
  }

  async findDetail(playbookId: string, orgId: string): Promise<PlaybookDetail | undefined> {
    const playbookRow = await this.db.selectFrom('playbooks').selectAll().where('id', '=', playbookId).where('org_id', '=', orgId).executeTakeFirst();
    if (!playbookRow) return undefined;

    const rows = await this.db
      .selectFrom('playbook_sections as sec')
      .rightJoin('playbook_specs as ps', (join) => join.onRef('ps.playbook_id', '=', 'sec.playbook_id').onRef('ps.section_id', '=', 'sec.id'))
      .leftJoin('spec_library as sl', 'sl.id', 'ps.spec_library_id')
      .select([
        'sec.id as section_id',
        'sec.name as section_name',
        'sec.position as section_position',
        'ps.id as spec_id',
        'ps.spec_library_id',
        'ps.section_id as spec_section_id',
        'ps.position as spec_position',
        'sl.title as lib_title',
        'sl.severity as lib_severity',
        'sl.system_under_test as lib_system_under_test',
      ])
      .where('ps.playbook_id', '=', playbookId)
      .where('ps.org_id', '=', orgId)
      .orderBy('sec.position', 'asc')
      .orderBy('ps.position', 'asc')
      .execute();

    const allSections = await this.db
      .selectFrom('playbook_sections')
      .select(['id', 'name', 'position'])
      .where('playbook_id', '=', playbookId)
      .where('org_id', '=', orgId)
      .orderBy('position', 'asc')
      .execute();

    const sectionMap = new Map<string, PlaybookSectionDetail>();
    for (const sec of allSections) {
      sectionMap.set(sec.id, { id: sec.id, name: sec.name, position: sec.position, specs: [] });
    }

    const ungroupedSpecs: PlaybookSpecSummary[] = [];

    for (const row of rows) {
      if (!row.spec_id) continue;

      const spec: PlaybookSpecSummary = {
        id: row.spec_id,
        specLibraryId: row.spec_library_id!,
        position: row.spec_position!,
        title: row.lib_title ?? '(deleted spec)',
        severity: row.lib_severity ?? null,
        systemUnderTest: row.lib_system_under_test ?? null,
      };

      if (row.spec_section_id == null) {
        ungroupedSpecs.push(spec);
      } else {
        const section = sectionMap.get(row.spec_section_id);
        if (section) {
          section.specs.push(spec);
        } else {
          ungroupedSpecs.push(spec);
        }
      }
    }

    return {
      playbook: {
        id: playbookRow.id,
        orgId: playbookRow.org_id,
        name: playbookRow.name,
        ...(playbookRow.description != null && { description: playbookRow.description }),
        ...(playbookRow.environment_id != null && { environmentId: playbookRow.environment_id }),
        isArchived: playbookRow.is_archived,
        createdBy: playbookRow.created_by,
        createdAt: playbookRow.created_at,
        updatedAt: playbookRow.updated_at,
      },
      sections: [...sectionMap.values()],
      ungroupedSpecs,
    };
  }

  async countActiveRuns(playbookId: string, orgId: string): Promise<number> {
    const result = await this.db
      .selectFrom('runs')
      .select(sql<string>`COUNT(*)`.as('count'))
      .where('playbook_id', '=', playbookId)
      .where('org_id', '=', orgId)
      .where('status', 'in', ['in_progress', 'awaiting_decision'])
      .executeTakeFirstOrThrow();

    return parseInt(String(result.count), 10);
  }

  private toPlaybook(row: {
    id: string;
    org_id: string;
    name: string;
    description: string | null;
    environment_id: string | null;
    is_archived: boolean;
    created_by: string;
    created_at: Date;
    updated_at: Date;
  }): Playbook {
    return {
      id: row.id,
      orgId: row.org_id,
      name: row.name,
      ...(row.description != null && { description: row.description }),
      ...(row.environment_id != null && { environmentId: row.environment_id }),
      isArchived: row.is_archived,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
