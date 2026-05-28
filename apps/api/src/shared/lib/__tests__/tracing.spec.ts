import type { FastifyRequest } from 'fastify';
import { describe, expect, it } from 'vitest';

import { getSpan } from '../tracing.js';

describe('getSpan', () => {
  it('returns a no-op span when otel is disabled', () => {
    const fakeRequest = {
      opentelemetry: () => ({ enabled: false, span: null, context: null, tracer: {}, inject: () => {}, extract: () => ({}) }),
    } as unknown as FastifyRequest;

    const span = getSpan(fakeRequest);
    expect(span).toBeDefined();
    expect(typeof span.setAttribute).toBe('function');
    // Should not throw
    span.setAttribute('test.key', 'value');
  });

  it('returns the real span when otel is enabled', () => {
    const mockSpan = { setAttribute: () => {} };
    const fakeRequest = {
      opentelemetry: () => ({ enabled: true, span: mockSpan, context: {}, tracer: {}, inject: () => {}, extract: () => ({}) }),
    } as unknown as FastifyRequest;

    const span = getSpan(fakeRequest);
    expect(span).toBe(mockSpan);
  });
});
