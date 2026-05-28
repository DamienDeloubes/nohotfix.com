import type { FastifyInstance } from 'fastify';

export async function billingRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/api/billing/checkout', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not implemented' });
  });

  fastify.post('/api/billing/portal', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not implemented' });
  });

  fastify.get('/api/billing/subscription', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not implemented' });
  });

  fastify.post('/api/webhooks/stripe', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not implemented' });
  });
}
