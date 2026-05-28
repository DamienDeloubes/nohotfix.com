import FastifyOtelInstrumentation from '@fastify/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function otelPlugin(fastify: FastifyInstance): Promise<void> {
  const endpoint = fastify.config.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (!endpoint) {
    fastify.log.info('OTel: OTEL_EXPORTER_OTLP_ENDPOINT not set, skipping');
    return;
  }

  const fastifyInstrumentation = new FastifyOtelInstrumentation({
    requestHook(span, request) {
      const route = request.routeOptions?.url ?? request.url;
      span.updateName(`${request.method} ${route}`);
    },
  });

  const sdk = new NodeSDK({
    serviceName: 'nohotfix-api',
    traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
    instrumentations: [fastifyInstrumentation],
  });

  sdk.start();
  fastify.log.info('OTel SDK started');

  // Register the Fastify instrumentation plugin — must be before routes
  await fastify.register(fastifyInstrumentation.plugin());

  fastify.addHook('onClose', async () => {
    await sdk.shutdown();
  });
}

export default fp(otelPlugin, { name: 'otel' });
