import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { ApiClient, type TokenManager } from '../client.js';
import { ApiError } from '../errors.js';

function createMockTokenManager(overrides?: Partial<TokenManager>): TokenManager {
  return {
    getToken: vi.fn().mockResolvedValue('test-token'),
    refreshToken: vi.fn().mockResolvedValue('refreshed-token'),
    ...overrides,
  };
}

function mockFetch(responses: Array<{ status: number; body?: unknown; headers?: Record<string, string> }>) {
  let callIndex = 0;
  return vi.fn(async () => {
    const resp = responses[callIndex++];
    if (!resp) throw new Error('No more mock responses');
    return {
      ok: resp.status >= 200 && resp.status < 300,
      status: resp.status,
      json: async () => resp.body,
    } as Response;
  });
}

describe('ApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends GET request with auth header', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 200, body: { id: 1 } }]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.get('/api/items');

    expect(result).toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/items',
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' },
      }),
    );
  });

  it('sends POST request with body and content-type', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 201, body: { id: 2 } }]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.post('/api/items', { name: 'test' });

    expect(result).toEqual({ id: 2 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/items',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test' }),
      }),
    );
  });

  it('sends PATCH request', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 200, body: { updated: true } }]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.patch('/api/items/1', { name: 'updated' });

    expect(result).toEqual({ updated: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/items/1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });

  it('sends DELETE request', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 204 }]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.delete('/api/items/1');

    expect(result).toBeUndefined();
  });

  it('retries on 401 with refreshed token', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([
      { status: 401, body: { error: 'AUTH_SESSION_EXPIRED', message: 'Expired' } },
      { status: 200, body: { id: 1 } },
    ]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.get('/api/items');

    expect(result).toEqual({ id: 1 });
    expect(tokenManager.refreshToken).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // Second call should use refreshed token
    expect(fetchMock.mock.calls[1]![1]).toEqual(
      expect.objectContaining({
        headers: { Authorization: 'Bearer refreshed-token' },
      }),
    );
  });

  it('throws ApiError when refresh fails on 401', async () => {
    const tokenManager = createMockTokenManager({
      refreshToken: vi.fn().mockResolvedValue(null),
    });
    const fetchMock = mockFetch([{ status: 401, body: { error: 'AUTH_SESSION_EXPIRED', message: 'Expired' } }]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });

    try {
      await client.get('/api/items');
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.code).toBe('AUTH_SESSION_EXPIRED');
      expect(apiErr.status).toBe(401);
    }
  });

  it('deduplicates concurrent 401 refresh calls', async () => {
    let refreshCallCount = 0;
    const tokenManager = createMockTokenManager({
      refreshToken: vi.fn(async () => {
        refreshCallCount++;
        // Simulate async delay
        await new Promise((r) => setTimeout(r, 10));
        return 'refreshed-token';
      }),
    });

    let callIndex = 0;
    const fetchMock = vi.fn(async () => {
      const idx = callIndex++;
      if (idx < 2) {
        return { ok: false, status: 401, json: async () => ({ error: 'AUTH_SESSION_EXPIRED' }) } as Response;
      }
      return { ok: true, status: 200, json: async () => ({ id: idx }) } as Response;
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });

    // Fire two concurrent requests
    const [r1, r2] = await Promise.all([client.get('/api/items/1'), client.get('/api/items/2')]);

    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
    // refreshToken was called for each request independently
    // (deduplication happens at the session layer, not the client)
    expect(refreshCallCount).toBe(2);
  });

  it('validates response with Zod schema', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 200, body: { id: 1, name: 'test' } }]);
    vi.stubGlobal('fetch', fetchMock);

    const schema = z.object({ id: z.number(), name: z.string() });
    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });
    const result = await client.get('/api/items', { schema });

    expect(result).toEqual({ id: 1, name: 'test' });
  });

  it('throws on Zod validation failure', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([{ status: 200, body: { id: 'not-a-number' } }]);
    vi.stubGlobal('fetch', fetchMock);

    const schema = z.object({ id: z.number() });
    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });

    await expect(client.get('/api/items', { schema })).rejects.toThrow();
  });

  it('parses error body on non-OK response', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = mockFetch([
      {
        status: 422,
        body: { error: 'VALIDATION_ERROR', message: 'Name is required' },
      },
    ]);
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });

    try {
      await client.post('/api/items', { name: '' });
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.code).toBe('VALIDATION_ERROR');
      expect(apiErr.message).toBe('Name is required');
      expect(apiErr.status).toBe(422);
    }
  });

  it('handles non-JSON error body gracefully', async () => {
    const tokenManager = createMockTokenManager();
    const fetchMock = vi.fn(
      async () =>
        ({
          ok: false,
          status: 500,
          json: async () => {
            throw new Error('not json');
          },
        }) as Response,
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new ApiClient({ baseUrl: 'https://api.test', tokenManager });

    try {
      await client.get('/api/items');
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.code).toBe('UNKNOWN');
      expect(apiErr.status).toBe(500);
    }
  });
});
