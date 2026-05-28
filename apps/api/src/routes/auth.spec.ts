import cookie from '@fastify/cookie';
import type { AuthSessionProvider } from '@nohotfix/domain-identity';
import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CompositionRoot } from '../composition-root.js';
import type { parseConfig } from '../config.js';
import { extractSessionId } from '../shared/lib/jwt-utils.js';

// Mock tracing — getSpan returns a no-op span
vi.mock('../shared/lib/tracing.js', () => ({
  getSpan: () => ({ setAttribute: () => {} }),
}));

const { authRoutes } = await import('./auth.js');

// Build a fake JWT with a given payload
function fakeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.fake-signature`;
}

const COOKIE_SECRET = 'a'.repeat(32);

function buildApp(overrides: { revokeSession?: ReturnType<typeof vi.fn> } = {}) {
  const revokeSession = overrides.revokeSession ?? vi.fn().mockResolvedValue(undefined);

  const mockAuthSessionAdapter: AuthSessionProvider = {
    getAuthorizationUrl: vi.fn().mockReturnValue('https://authkit.test/authorize'),
    exchangeCode: vi.fn().mockResolvedValue({
      accessToken: fakeJwt({ sid: 'sess_abc123', sub: 'user_1' }),
      refreshToken: 'rt_test',
    }),
    refreshSession: vi.fn().mockResolvedValue({
      accessToken: fakeJwt({ sid: 'sess_xyz789', sub: 'user_1' }),
      refreshToken: 'rt_new',
    }),
    revokeSession,
  };

  const app = Fastify({ logger: false });

  // Register cookie plugin with signing secret
  void app.register(cookie, { secret: COOKIE_SECRET });

  // Decorate with config
  app.decorate('config', {
    NODE_ENV: 'test',
    PORT: 3001,
    WORKOS_CLIENT_ID: 'client_test',
    WORKOS_API_KEY: 'sk_test',
    WORKOS_REDIRECT_URI: 'http://localhost:3001/auth/callback',
    APP_URL: 'http://localhost:5173',
    COOKIE_SECRET,
  } as unknown as ReturnType<typeof parseConfig>);

  // Decorate with composition root containing the mock adapter
  app.decorate('root', {
    workosAuthSessionAdapter: mockAuthSessionAdapter,
  } as unknown as CompositionRoot);

  void app.register(authRoutes);

  return { app, revokeSession, mockAuthSessionAdapter };
}

// Helper to get a signed cookie value for injection
async function getSignedCookie(value: string): Promise<string> {
  const helper = Fastify({ logger: false });
  void helper.register(cookie, { secret: COOKIE_SECRET });
  await helper.ready();
  const signed = helper.signCookie(value);
  await helper.close();
  return signed;
}

// Legacy alias
async function getSignedSidCookie(sessionId: string): Promise<string> {
  const helper = Fastify({ logger: false });
  void helper.register(cookie, { secret: COOKIE_SECRET });
  await helper.ready();
  const signed = helper.signCookie(sessionId);
  await helper.close();
  return signed;
}

describe('extractSessionId', () => {
  it('extracts sid from a valid JWT', () => {
    const token = fakeJwt({ sid: 'sess_123', sub: 'user_1' });
    expect(extractSessionId(token)).toBe('sess_123');
  });

  it('returns null when sid claim is missing', () => {
    const token = fakeJwt({ sub: 'user_1' });
    expect(extractSessionId(token)).toBeNull();
  });

  it('returns null for malformed tokens', () => {
    expect(extractSessionId('not-a-jwt')).toBeNull();
    expect(extractSessionId('')).toBeNull();
    expect(extractSessionId('a.!!!.c')).toBeNull();
  });
});

describe('POST /auth/logout', () => {
  let app: ReturnType<typeof buildApp>['app'];
  let revokeSession: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const built = buildApp();
    app = built.app;
    revokeSession = built.revokeSession;
    await app.ready();
  });

  it('revokes WorkOS session when __rp_sid cookie is present', async () => {
    const signedSid = await getSignedSidCookie('sess_abc123');

    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      cookies: { __rp_sid: signedSid },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    expect(revokeSession).toHaveBeenCalledWith('sess_abc123');
  });

  it('still succeeds when __rp_sid cookie is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    expect(revokeSession).not.toHaveBeenCalled();
  });

  it('still succeeds when revokeSession throws', async () => {
    const failingRevoke = vi.fn().mockRejectedValue(new Error('WorkOS API error'));
    const built = buildApp({ revokeSession: failingRevoke });
    await built.app.ready();

    const signedSid = await getSignedSidCookie('sess_fail');

    const res = await built.app.inject({
      method: 'POST',
      url: '/auth/logout',
      cookies: { __rp_sid: signedSid },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    expect(failingRevoke).toHaveBeenCalledWith('sess_fail');

    await built.app.close();
  });

  it('clears both cookies on logout', async () => {
    const signedSid = await getSignedSidCookie('sess_abc123');

    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      cookies: { __rp_sid: signedSid },
    });

    const setCookieHeaders = res.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    const cookieNames = cookies.map((c) => c?.split('=')[0]);

    expect(cookieNames).toContain('__rp_refresh');
    expect(cookieNames).toContain('__rp_sid');
  });
});

describe('GET /auth/login — session-check redirect', () => {
  let app: ReturnType<typeof buildApp>['app'];

  beforeEach(async () => {
    const built = buildApp();
    app = built.app;
    await app.ready();
  });

  it('redirects to APP_URL when valid refresh cookie exists', async () => {
    const signedRefresh = await getSignedCookie('rt_existing');

    const res = await app.inject({
      method: 'GET',
      url: '/auth/login?screen_hint=sign-in',
      cookies: { __rp_refresh: signedRefresh },
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:5173');

    // Should set updated cookies from refresh
    const setCookieHeaders = res.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    const cookieNames = cookies.map((c) => c?.split('=')[0]);
    expect(cookieNames).toContain('__rp_refresh');
    expect(cookieNames).toContain('__rp_sid');
  });

  it('redirects to WorkOS when no cookie is present', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/login?screen_hint=sign-in',
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://authkit.test/authorize');
  });

  it('clears cookies and redirects to WorkOS when refresh token is expired/revoked', async () => {
    const built = buildApp();
    (built.mockAuthSessionAdapter.refreshSession as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Refresh token expired'));
    await built.app.ready();

    const signedRefresh = await getSignedCookie('rt_expired');

    const res = await built.app.inject({
      method: 'GET',
      url: '/auth/login?screen_hint=sign-in',
      cookies: { __rp_refresh: signedRefresh },
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://authkit.test/authorize');

    // Should clear stale cookies
    const setCookieHeaders = res.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    const clearCookies = cookies.filter((c) => c?.includes('Expires='));
    expect(clearCookies.length).toBeGreaterThanOrEqual(2);

    await built.app.close();
  });

  it('redirects to WorkOS when cookie signature is tampered', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/login?screen_hint=sign-in',
      cookies: { __rp_refresh: 'tampered-value.bad-sig' },
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://authkit.test/authorize');
  });
});
