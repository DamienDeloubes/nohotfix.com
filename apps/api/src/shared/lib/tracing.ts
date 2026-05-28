import type { Span } from '@opentelemetry/api';
import type { FastifyRequest } from 'fastify';

/**
 * Get the active OTel span from the request (provided by @fastify/otel).
 * Returns a no-op span if OTel is disabled, so callers can always call setAttribute safely.
 */
export function getSpan(request: FastifyRequest) {
  const otel = request.opentelemetry();
  if (otel.enabled) return otel.span;

  // Return a no-op object so callers don't need null checks
  return { setAttribute: () => {} } as unknown as Span;
}
