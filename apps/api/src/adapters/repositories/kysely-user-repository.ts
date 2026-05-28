import type { Database } from '@nohotfix/db';
import { Email, FirstName, LastName, UserEntity, WorkosUserId, type UserRepository } from '@nohotfix/domain-identity';
import type { Kysely } from 'kysely';

export class KyselyUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string): Promise<UserEntity | undefined> {
    const row = await this.db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async findByWorkosId(workosUserId: string): Promise<UserEntity | undefined> {
    const row = await this.db.selectFrom('users').selectAll().where('workos_user_id', '=', workosUserId).executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  async upsertByWorkosId(data: { workosUserId: string; email: string; firstName?: string; lastName?: string }): Promise<UserEntity> {
    const row = await this.db
      .insertInto('users')
      .values({
        workos_user_id: data.workosUserId,
        email: data.email,
        first_name: data.firstName ?? null,
        last_name: data.lastName ?? null,
      })
      .onConflict((oc) =>
        oc.column('workos_user_id').doUpdateSet({
          email: data.email,
          first_name: data.firstName ?? null,
          last_name: data.lastName ?? null,
          updated_at: new Date().toISOString(),
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();
    return this.toEntity(row);
  }

  async update(id: string, data: { firstName?: string; lastName?: string }): Promise<UserEntity | undefined> {
    const row = await this.db
      .updateTable('users')
      .set({
        first_name: data.firstName ?? null,
        last_name: data.lastName ?? null,
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
    return row ? this.toEntity(row) : undefined;
  }

  private toEntity(row: {
    id: string;
    workos_user_id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    created_at: Date;
    updated_at: Date;
  }): UserEntity {
    return UserEntity.reconstitute({
      id: row.id,
      workosUserId: WorkosUserId.create(row.workos_user_id),
      email: Email.create(row.email),
      firstName: row.first_name ? FirstName.create(row.first_name) : null,
      lastName: row.last_name ? LastName.create(row.last_name) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
