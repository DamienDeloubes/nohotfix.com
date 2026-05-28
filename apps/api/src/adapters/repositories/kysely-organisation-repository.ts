import type { Database } from '@nohotfix/db';
import { OrganisationEntity, OrganisationName, OrganisationSlug, type OrganisationRepository } from '@nohotfix/domain-identity';
import type { Kysely } from 'kysely';

export class KyselyOrganisationRepository implements OrganisationRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string): Promise<OrganisationEntity | undefined> {
    const row = await this.db.selectFrom('organisations').selectAll().where('id', '=', id).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findBySlug(slug: string): Promise<OrganisationEntity | undefined> {
    const row = await this.db.selectFrom('organisations').selectAll().where('slug', '=', slug).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  // Acknowledged exception to constitution II (org_id tenancy):
  // User discovering own tenant memberships requires cross-org query.
  async findByUserId(userId: string): Promise<OrganisationEntity[]> {
    const rows = await this.db
      .selectFrom('organisations')
      .innerJoin('memberships', 'memberships.org_id', 'organisations.id')
      .where('memberships.user_id', '=', userId)
      .selectAll('organisations')
      .execute();
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: { name: string; slug: string }): Promise<OrganisationEntity> {
    const row = await this.db.insertInto('organisations').values({ name: data.name, slug: data.slug }).returningAll().executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  async update(id: string, data: { name?: string }): Promise<OrganisationEntity | undefined> {
    const row = await this.db
      .updateTable('organisations')
      .set({ ...data, updated_at: new Date().toISOString() })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async slugExists(slug: string): Promise<boolean> {
    const row = await this.db.selectFrom('organisations').select('id').where('slug', '=', slug).executeTakeFirst();
    return !!row;
  }

  private toEntity(row: { id: string; name: string; slug: string; created_at: Date; updated_at: Date }): OrganisationEntity {
    return OrganisationEntity.reconstitute({
      id: row.id,
      name: OrganisationName.create(row.name),
      slug: OrganisationSlug.create(row.slug),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
