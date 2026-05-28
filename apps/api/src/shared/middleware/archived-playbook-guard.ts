import { AuthorPlaybookArchivedError } from '@nohotfix/domain-authoring';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function archivedPlaybookGuard(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const { playbookId } = request.params as { playbookId?: string };
  if (!playbookId) return;

  const playbook = await request.server.root.playbookRepo.findById(playbookId, request.orgContext!.orgId);

  if (playbook?.isArchived) {
    throw new AuthorPlaybookArchivedError(playbookId);
  }
}
