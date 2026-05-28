export interface Subscription {
  id: string;
  orgId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  plan: string;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeWebhookEvent {
  id: string;
  stripeEventId: string;
  eventType: string;
  processedAt: Date | null;
  createdAt: Date;
}
