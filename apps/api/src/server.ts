import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { DomainError } from '@nohotfix/shared';
import Fastify from 'fastify';

import { createCompositionRoot, type CompositionRoot } from './composition-root.js';
import { parseConfig, type Config } from './config.js';
// Routes
import { auditRoutes, authoringRoutes, authRoutes, billingRoutes, executionRoutes, identityRoutes, inviteRoutes } from './routes/index.js';
// Plugins Add back once plugins are setup
// import sentryPlugin from './shared/plugins/sentry.js';
import dbPlugin from './shared/plugins/db.js';
import otelPlugin from './shared/plugins/otel.js';
import workosPlugin from './shared/plugins/workos.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    root: CompositionRoot;
  }
}

async function buildServer() {
  const config = parseConfig();

  const fastify = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : {
              target: 'pino',
            },
    },
  });

  // Decorate config early so all plugins can access it
  fastify.decorate('config', config);

  // Infrastructure plugins (order matters — OTel must be first, before routes)
  await fastify.register(otelPlugin);
  // Add back once Sentry plugin is setup
  // await fastify.register(sentryPlugin);
  await fastify.register(cors, {
    origin: ['https://nohotfix.com', 'https://app.nohotfix.com', ...(config.NODE_ENV !== 'production' ? ['http://localhost:5173', 'http://localhost:3000'] : [])],
    credentials: true,
  });
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  });
  await fastify.register(sensible);
  await fastify.register(cookie, { secret: config.COOKIE_SECRET });
  await fastify.register(workosPlugin);
  await fastify.register(dbPlugin);

  // Composition root — wire domain services with infrastructure adapters
  const root = createCompositionRoot(fastify.db, fastify.workos, config);
  fastify.decorate('root', root);

  // Auth routes (no auth middleware — handles OAuth flow)
  await fastify.register(authRoutes);

  // Domain routes
  await fastify.register(identityRoutes);
  await fastify.register(inviteRoutes);
  await fastify.register(billingRoutes);
  await fastify.register(authoringRoutes);
  await fastify.register(executionRoutes);
  await fastify.register(auditRoutes);

  // Health check
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Global error handler
  fastify.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }

    fastify.log.error({ err: error }, 'Unhandled error');
    return reply.code(500).send({
      error: 'SYS_INTERNAL',
      message: 'An internal server error occurred',
    });
  });

  return fastify;
}

async function start() {
  const server = await buildServer();
  const { config } = server;

  const gracefulShutdown = async (signal: string) => {
    server.log.info({ signal }, 'Received shutdown signal');
    await server.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

  try {
    await server.listen({ port: config.PORT, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void start();

export { buildServer };
