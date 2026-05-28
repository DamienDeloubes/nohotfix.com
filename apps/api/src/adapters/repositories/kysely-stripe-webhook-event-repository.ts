import type { Database } from '@nohotfix/db';
import type { StripeWebhookEvent, StripeWebhookEventRepository } from '@nohotfix/domain-billing';
import type { Kysely } from 'kysely';

export class KyselyStripeWebhookEventRepository implements StripeWebhookEventRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByStripeEventId(_stripeEventId: string): Promise<StripeWebhookEvent | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async create(_data: { stripeEventId: string; eventType: string }): Promise<StripeWebhookEvent> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async markProcessed(_id: string): Promise<void> {
    void this.db;
    // TODO: Implement with Kysely
  }
}
