import { jsonb, type Database } from '@nohotfix/db';
import type { ChangelogEntry, ChangelogRepository, PlaybookChangelogEntry, SpecChangelogEntry } from '@nohotfix/domain-audit';
import type { PlaybookHistoryAction, SpecHistoryAction } from '@nohotfix/shared';
import { sql, type Kysely } from 'kysely';

export class KyselyChangelogRepository implements ChangelogRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByEntity(orgId: string, entityType: 'playbook' | 'spec_library', entityId: string, pagination: { limit: number; offset: number }): Promise<ChangelogEntry[]> {
    const rows = await this.db
      .selectFrom('changelog')
      .selectAll()
      .where('org_id', '=', orgId)
      .where('entity_type', '=', entityType)
      .where('entity_id', '=', entityId)
      .orderBy('created_at', 'desc')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .execute();
    return rows.map((row) => this.toEntry(row));
  }

  async findBySpecWithMembership(orgId: string, specId: string): Promise<SpecChangelogEntry[]> {
    const rows = await this.db
      .selectFrom('changelog as c')
      .leftJoin('memberships as m', (join) => join.onRef('m.user_id', '=', 'c.actor_id').onRef('m.org_id', '=', 'c.org_id'))
      .select(['c.id', 'c.action', 'c.field_changes', 'c.actor_name', 'c.created_at', sql<boolean>`CASE WHEN m.id IS NULL THEN TRUE ELSE FALSE END`.as('is_removed_member')])
      .where('c.org_id', '=', orgId)
      .where('c.entity_type', '=', 'spec_library')
      .where('c.entity_id', '=', specId)
      .orderBy('c.created_at', 'desc')
      .execute();

    return rows.map((row) => ({
      id: row.id as string,
      action: row.action as SpecHistoryAction,
      fieldChanges: (row.field_changes as Record<string, { old: unknown; new: unknown }>) ?? null,
      actorName: row.actor_name as string,
      isRemovedMember: Boolean(row.is_removed_member),
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at as string),
    }));
  }

  async findByPlaybookWithMembership(orgId: string, playbookId: string): Promise<PlaybookChangelogEntry[]> {
    const rows = await this.db
      .selectFrom('changelog as c')
      .leftJoin('memberships as m', (join) => join.onRef('m.user_id', '=', 'c.actor_id').onRef('m.org_id', '=', 'c.org_id'))
      .select(['c.id', 'c.action', 'c.field_changes', 'c.actor_name', 'c.created_at', sql<boolean>`CASE WHEN m.id IS NULL THEN TRUE ELSE FALSE END`.as('is_removed_member')])
      .where('c.org_id', '=', orgId)
      .where('c.entity_type', '=', 'playbook')
      .where('c.entity_id', '=', playbookId)
      .orderBy('c.created_at', 'desc')
      .execute();

    return rows.map((row) => ({
      id: row.id as string,
      action: row.action as PlaybookHistoryAction,
      fieldChanges: (row.field_changes as Record<string, unknown>) ?? null,
      actorName: row.actor_name as string,
      isRemovedMember: Boolean(row.is_removed_member),
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at as string),
    }));
  }

  async append(data: Omit<ChangelogEntry, 'id' | 'createdAt'>): Promise<ChangelogEntry> {
    const row = await this.db
      .insertInto('changelog')
      .values({
        org_id: data.orgId,
        entity_type: data.entityType,
        entity_id: data.entityId,
        action: data.action,
        field_changes: jsonb(data.fieldChanges),
        actor_id: data.actorId,
        actor_name: data.actorName,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntry(row);
  }

  private toEntry(row: Record<string, unknown>): ChangelogEntry {
    const fieldChanges = row.field_changes as Record<string, { old: unknown; new: unknown }> | null | undefined;
    const entry: ChangelogEntry = {
      id: row.id as string,
      orgId: row.org_id as string,
      entityType: row.entity_type as 'playbook' | 'spec_library',
      entityId: row.entity_id as string,
      action: row.action as string,
      actorId: row.actor_id as string,
      actorName: row.actor_name as string,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at as string),
    };
    if (fieldChanges != null) entry.fieldChanges = fieldChanges;
    return entry;
  }
}
