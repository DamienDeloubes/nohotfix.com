import type { StripeWebhookEvent } from '../types.js';

export interface StripeWebhookEventRepository {
  findByStripeEventId(stripeEventId: string): Promise<StripeWebhookEvent | undefined>;
  create(data: { stripeEventId: string; eventType: string }): Promise<StripeWebhookEvent>;
  markProcessed(id: string): Promise<void>;
}
