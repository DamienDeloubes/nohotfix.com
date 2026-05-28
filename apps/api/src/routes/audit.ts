import { AuditPlaybookNotFoundError, getPlaybookChangelog } from '@nohotfix/domain-audit';
import type { FastifyInstance } from 'fastify';

import { getSpan } from '../shared/lib/tracing.js';
import { authMiddleware } from '../shared/middleware/auth.js';
import { orgScopeMiddleware } from '../shared/middleware/org-scope.js';

export async function auditRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/history', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.get('/api/history/:runId', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.get('/api/specs/:id/changelog', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));

  // GET /api/orgs/:orgSlug/playbooks/:playbookId/history — playbook change history
  fastify.get('/api/orgs/:orgSlug/playbooks/:playbookId/history', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { playbookId } = request.params as { playbookId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('playbook.id', playbookId);

    const playbook = await request.server.root.playbookRepo.findById(playbookId, orgId);
    if (!playbook) {
      throw new AuditPlaybookNotFoundError(playbookId);
    }

    const entries = await getPlaybookChangelog({ changelogRepo: request.server.root.changelogRepo }, { orgId, playbookId });

    span.setAttribute('result.count', entries.length);

    return reply.send({
      entries: entries.map((e) => ({
        id: e.id,
        action: e.action,
        fieldChanges: e.fieldChanges,
        actorName: e.actorName,
        isRemovedMember: e.isRemovedMember,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  });
}
