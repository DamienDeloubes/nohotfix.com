import { BillSubExpiredError } from '@nohotfix/domain-billing';
import type { FastifyReply, FastifyRequest } from 'fastify';

const BLOCKED_STATUSES = new Set(['past_due', 'expired']);

export async function subscriptionGuard(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const { orgId } = request.orgContext!;

  const subscription = await request.server.db.selectFrom('subscriptions').select(['status']).where('org_id', '=', orgId).executeTakeFirst();

  if (subscription && BLOCKED_STATUSES.has(subscription.status)) {
    throw new BillSubExpiredError();
  }
}
