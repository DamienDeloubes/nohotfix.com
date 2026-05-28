import { ExecRunImmutableError } from '@nohotfix/domain-execution';
import type { FastifyReply, FastifyRequest } from 'fastify';

const TERMINAL_RUN_STATUSES = new Set(['go', 'no_go', 'abandoned']);

export async function immutabilityGuard(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const { runId } = request.params as { runId?: string };
  if (!runId) return;

  const db = request.server.db;
  const run = await db.selectFrom('runs').select(['status']).where('id', '=', runId).where('org_id', '=', request.orgContext!.orgId).executeTakeFirst();

  if (run && TERMINAL_RUN_STATUSES.has(run.status)) {
    throw new ExecRunImmutableError(runId);
  }
}
