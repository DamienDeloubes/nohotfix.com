import { WorkOS } from '@workos-inc/node';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    workos: WorkOS;
  }
}

async function workosPlugin(fastify: FastifyInstance): Promise<void> {
  const workos = new WorkOS(fastify.config.WORKOS_API_KEY);
  fastify.decorate('workos', workos);
  fastify.log.info('WorkOS SDK initialized');
}

export default fp(workosPlugin, { name: 'workos' });
