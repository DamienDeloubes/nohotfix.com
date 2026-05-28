import type { Subscription } from '../types.js';

export interface SubscriptionRepository {
  findByOrg(orgId: string): Promise<Subscription | undefined>;
  upsert(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> & { orgId: string }): Promise<Subscription>;
  updateStatus(orgId: string, status: string): Promise<Subscription | undefined>;
}
