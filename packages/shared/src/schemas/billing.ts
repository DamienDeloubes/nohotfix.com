import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum(['trialing', 'grace_period', 'past_due', 'active', 'cancelled', 'expired']);

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  status: SubscriptionStatusSchema,
  trialEndsAt: z.string().datetime().optional(),
  currentPeriodStart: z.string().datetime().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  cancelAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCheckoutSessionRequestSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const CreatePortalSessionRequestSchema = z.object({
  returnUrl: z.string().url(),
});
