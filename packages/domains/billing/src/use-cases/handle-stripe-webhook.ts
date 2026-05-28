export async function handleStripeWebhook(_data: { rawBody: string; signature: string }): Promise<void> {
  // TODO: Validate signature, deduplicate, dispatch to event-specific handlers
}
