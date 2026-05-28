export async function createCheckoutSession(_data: { orgId: string; successUrl: string; cancelUrl: string }): Promise<{ url: string }> {
  // TODO: Generate Stripe Checkout session
  throw new Error('Not implemented');
}
