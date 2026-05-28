import { createKyselyClient, type Database } from '@nohotfix/db';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { Kysely } from 'kysely';

import { KyselyOtelPlugin } from './kysely-otel.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<Database>;
  }
}

async function dbPlugin(fastify: FastifyInstance): Promise<void> {
  const connectionString = fastify.config.DATABASE_URL;

  if (!connectionString) {
    fastify.log.info('Database: DATABASE_URL not set, skipping database initialization');
    return;
  }

  const db = createKyselyClient({
    connectionString: fastify.config.DATABASE_URL ?? '',
    plugins: [new KyselyOtelPlugin()],
  });

  fastify.decorate('db', db);

  // Test connection on startup — log warning on failure, don't crash (health check must still work)
  try {
    await db.selectFrom('organisations').select('id').limit(1).execute();
    fastify.log.info('Database connection established');
  } catch (err) {
    fastify.log.warn({ err }, 'Database connection test failed — server still starting');
  }

  fastify.addHook('onClose', async () => {
    await db.destroy();
  });
}

export default fp(dbPlugin, { name: 'db' });
