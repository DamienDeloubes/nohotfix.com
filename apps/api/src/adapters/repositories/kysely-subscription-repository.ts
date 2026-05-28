import type { Database } from '@nohotfix/db';
import type { Subscription, SubscriptionRepository } from '@nohotfix/domain-billing';
import type { Kysely } from 'kysely';

export class KyselySubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByOrg(_orgId: string): Promise<Subscription | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async upsert(_data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> & { orgId: string }): Promise<Subscription> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async updateStatus(_orgId: string, _status: string): Promise<Subscription | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }
}
