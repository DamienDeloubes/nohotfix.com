export class SubscriptionStateService {
  computeStatus(_subscription: { status: string; trialEndsAt: Date | null }): string {
    // TODO: Compute current state from timestamps and Stripe data
    return _subscription.status;
  }
}
