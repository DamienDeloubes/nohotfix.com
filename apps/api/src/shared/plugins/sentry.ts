import { DomainError } from '@nohotfix/shared';
import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function sentryPlugin(fastify: FastifyInstance): Promise<void> {
  const dsn = fastify.config.SENTRY_DSN;

  if (!dsn) {
    fastify.log.info('Sentry: SENTRY_DSN not set, skipping initialization');
    return;
  }

  const Sentry = await import('@sentry/node');
  Sentry.init({
    dsn,
    environment: fastify.config.NODE_ENV,
    tracesSampleRate: 0, // OTel handles tracing
  });

  fastify.addHook('onError', async (_request, _reply, error: FastifyError | Error) => {
    if (error instanceof DomainError && error.statusCode < 500) return;
    Sentry.captureException(error, {
      fingerprint: error instanceof DomainError ? [error.code] : ['{{ default }}'],
    });
  });

  fastify.log.info('Sentry initialized');
}

export default fp(sentryPlugin, { name: 'sentry' });
