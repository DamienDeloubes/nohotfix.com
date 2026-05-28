import { jsonb, type Database } from '@nohotfix/db';
import type { ListSpecsParams, ListSpecsResult, SpecLibraryEntry, SpecLibraryRepository, SpecListItemEntry } from '@nohotfix/domain-authoring';
import { sql, type Kysely } from 'kysely';

export class KyselySpecLibraryRepository implements SpecLibraryRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string, orgId: string): Promise<SpecLibraryEntry | undefined> {
    const row = await this.db.selectFrom('spec_library').selectAll().where('id', '=', id).where('org_id', '=', orgId).executeTakeFirst();
    return row ? this.toEntry(row) : undefined;
  }

  async findByIds(ids: string[], orgId: string): Promise<SpecLibraryEntry[]> {
    if (ids.length === 0) return [];
    const rows = await this.db.selectFrom('spec_library').selectAll().where('id', 'in', ids).where('org_id', '=', orgId).execute();
    return rows.map((row) => this.toEntry(row));
  }

  async findByOrg(orgId: string, includeArchived?: boolean): Promise<SpecLibraryEntry[]> {
    let query = this.db.selectFrom('spec_library').selectAll().where('org_id', '=', orgId);
    if (!includeArchived) {
      query = query.where('is_archived', '=', false);
    }
    const rows = await query.execute();
    return rows.map((row) => this.toEntry(row));
  }

  async create(data: Omit<SpecLibraryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<SpecLibraryEntry> {
    const row = await this.db
      .insertInto('spec_library')
      .values({
        org_id: data.orgId,
        title: data.title,
        system_under_test: data.systemUnderTest,
        severity: data.severity as 'critical' | 'high' | 'medium' | 'low' | null,
        preconditions: jsonb(data.preconditions),
        description: jsonb(data.description),
        test_steps: jsonb(data.testSteps),
        expected_result: jsonb(data.expectedResult),
        artifact_requirements: jsonb(data.artifactRequirements),
        tester_notes: data.testerNotes,
        estimated_duration_minutes: data.estimatedDurationMinutes,
        tags: jsonb(data.tags) as unknown as string[],
        is_archived: data.isArchived,
        created_by: data.createdBy,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntry(row);
  }

  async update(id: string, orgId: string, data: Partial<SpecLibraryEntry>): Promise<SpecLibraryEntry | undefined> {
    const row = await this.db
      .updateTable('spec_library')
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.systemUnderTest !== undefined && { system_under_test: data.systemUnderTest }),
        ...(data.severity !== undefined && { severity: data.severity as 'critical' | 'high' | 'medium' | 'low' | null }),
        ...(data.preconditions !== undefined && { preconditions: jsonb(data.preconditions) }),
        ...(data.description !== undefined && { description: jsonb(data.description) }),
        ...(data.testSteps !== undefined && { test_steps: jsonb(data.testSteps) }),
        ...(data.expectedResult !== undefined && { expected_result: jsonb(data.expectedResult) }),
        ...(data.artifactRequirements !== undefined && { artifact_requirements: jsonb(data.artifactRequirements) }),
        ...(data.testerNotes !== undefined && { tester_notes: data.testerNotes }),
        ...(data.estimatedDurationMinutes !== undefined && { estimated_duration_minutes: data.estimatedDurationMinutes }),
        ...(data.tags !== undefined && { tags: jsonb(data.tags) as unknown as string[] }),
        ...(data.isArchived !== undefined && { is_archived: data.isArchived }),
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', id)
      .where('org_id', '=', orgId)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toEntry(row) : undefined;
  }

  async findDistinctSystemsUnderTest(orgId: string): Promise<string[]> {
    const rows = await this.db
      .selectFrom('spec_library')
      .select('system_under_test')
      .distinct()
      .where('org_id', '=', orgId)
      .where('system_under_test', 'is not', null)
      .orderBy('system_under_test', 'asc')
      .execute();
    return rows.map((row) => row.system_under_test as string);
  }

  async findDistinctTags(orgId: string): Promise<string[]> {
    const rows = await sql<{ tag: string }>`
      SELECT DISTINCT t.value AS tag
      FROM spec_library, jsonb_array_elements_text(tags) AS t(value)
      WHERE org_id = ${orgId}
      ORDER BY tag ASC
    `.execute(this.db);
    return rows.rows.map((row) => row.tag);
  }

  async list(params: ListSpecsParams): Promise<ListSpecsResult> {
    let baseQuery = this.db.selectFrom('spec_library').where('org_id', '=', params.orgId).where('is_archived', '=', params.isArchived);

    if (params.search) {
      const pattern = `%${params.search}%`;
      baseQuery = baseQuery.where((eb) => eb.or([eb('title', 'ilike', pattern), eb('system_under_test', 'ilike', pattern)]));
    }

    if (params.severity) {
      baseQuery = baseQuery.where('severity', '=', params.severity as 'critical' | 'high' | 'medium' | 'low');
    }

    // Count query
    const countResult = await baseQuery.select((eb) => eb.fn.countAll<number>().as('count')).executeTakeFirstOrThrow();
    const total = Number(countResult.count);

    // Sort mapping
    let itemsQuery = baseQuery.select(['id', 'title', 'system_under_test', 'severity', 'tags', 'updated_at']);

    const orderDirection = params.order === 'asc' ? 'asc' : 'desc';

    switch (params.sort) {
      case 'title':
        itemsQuery = itemsQuery.orderBy('title', orderDirection);
        break;
      case 'system':
        itemsQuery = itemsQuery.orderBy('system_under_test', orderDirection);
        break;
      case 'severity':
        itemsQuery = itemsQuery.orderBy(sql`CASE severity WHEN 'critical' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END`, orderDirection);
        break;
      case 'updated':
      default:
        itemsQuery = itemsQuery.orderBy('updated_at', orderDirection);
        break;
    }

    const rows = await itemsQuery.limit(params.limit).offset(params.offset).execute();

    const items: SpecListItemEntry[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      systemUnderTest: row.system_under_test,
      severity: row.severity ?? '',
      tags: (row.tags as string[] | null) ?? [],
      updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at as string),
    }));

    return { items, total };
  }

  async setArchived(id: string, orgId: string, isArchived: boolean): Promise<SpecLibraryEntry | undefined> {
    const row = await this.db
      .updateTable('spec_library')
      .set({
        is_archived: isArchived,
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', id)
      .where('org_id', '=', orgId)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toEntry(row) : undefined;
  }

  private toEntry(row: Record<string, unknown>): SpecLibraryEntry {
    return {
      id: row.id as string,
      orgId: row.org_id as string,
      title: row.title as string,
      systemUnderTest: row.system_under_test as string | null,
      severity: row.severity as string,
      preconditions: row.preconditions,
      description: row.description,
      testSteps: row.test_steps,
      expectedResult: row.expected_result,
      artifactRequirements: row.artifact_requirements,
      testerNotes: row.tester_notes as string | null,
      estimatedDurationMinutes: (row.estimated_duration_minutes as number | null) ?? null,
      tags: (row.tags as string[] | null) ?? [],
      isArchived: row.is_archived as boolean,
      createdBy: row.created_by as string,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at as string),
      updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at as string),
    };
  }
}
