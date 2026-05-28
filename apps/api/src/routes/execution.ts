import type { FastifyInstance } from 'fastify';

export async function executionRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/api/runs', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.get('/api/runs', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.get('/api/runs/:id', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.post('/api/runs/:id/decision', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));

  fastify.post('/api/runs/:runId/sections/:sectionId/skip', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));

  fastify.patch('/api/runs/:runId/specs/:specId/open', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.post('/api/runs/:runId/specs/:specId/claim', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.delete('/api/runs/:runId/specs/:specId/claim', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.post('/api/runs/:runId/specs/:specId/result', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));

  fastify.post('/api/runs/:runId/specs/:specId/artifacts/presign', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.post('/api/runs/:runId/specs/:specId/artifacts', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.put('/api/runs/:runId/specs/:specId/artifacts/:artifactId/table', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.put('/api/runs/:runId/specs/:specId/artifacts/:artifactId/value', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
  fastify.put('/api/runs/:runId/specs/:specId/artifacts/:artifactId/url', async (_request, reply) => reply.code(501).send({ error: 'Not implemented' }));
}
