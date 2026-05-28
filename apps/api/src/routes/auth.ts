import { AuthSessionExpiredError, handleAuthCallback, initiateLogin, logout, refreshSession } from '@nohotfix/domain-identity';
import type { FastifyInstance } from 'fastify';

import { buildAuthCookieOptions, REFRESH_COOKIE_NAME, SID_COOKIE_NAME } from '../shared/lib/auth-cookies.js';
import { extractSessionId } from '../shared/lib/jwt-utils.js';
import { getSpan } from '../shared/lib/tracing.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /auth/login — redirects browser to WorkOS AuthKit or app if session exists
  fastify.get<{ Querystring: { screen_hint?: string; login_hint?: string; state?: string } }>(
    '/auth/login',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            screen_hint: { type: 'string', enum: ['sign-up', 'sign-in'] },
            login_hint: { type: 'string' },
            state: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const span = getSpan(request);
      const { config } = request.server;
      const screenHint = request.query.screen_hint as 'sign-up' | 'sign-in' | undefined;
      const loginHint = request.query.login_hint;
      const state = request.query.state;
      span.setAttribute('auth.screen_hint', screenHint ?? 'none');

      // Read existing refresh token from cookie
      let existingRefreshToken: string | undefined;
      const signed = request.cookies[REFRESH_COOKIE_NAME];
      if (signed) {
        const unsignResult = request.unsignCookie(signed);
        if (unsignResult.valid && unsignResult.value) {
          existingRefreshToken = unsignResult.value;
        }
      }

      const result = await initiateLogin(
        { authSessionProvider: request.server.root.workosAuthSessionAdapter },
        {
          clientId: config.WORKOS_CLIENT_ID,
          redirectUri: config.WORKOS_REDIRECT_URI,
          ...(screenHint ? { screenHint } : {}),
          ...(existingRefreshToken ? { existingRefreshToken } : {}),
          ...(state ? { state } : {}),
          ...(loginHint ? { loginHint } : {}),
        },
      );

      if (result.action === 'redirect-to-app') {
        const cookieOpts = buildAuthCookieOptions(config.NODE_ENV === 'production');
        void reply.setCookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOpts);
        const sid = extractSessionId(result.accessToken);
        if (sid) {
          void reply.setCookie(SID_COOKIE_NAME, sid, cookieOpts);
        }
        span.setAttribute('auth.redirect_target', 'app');

        // If coming from invite flow, redirect to accept-invite page
        if (state?.startsWith('invite:')) {
          const inviteToken = state.slice('invite:'.length);
          return reply.redirect(`${config.APP_URL}/accept-invite/${encodeURIComponent(inviteToken)}`);
        }
        return reply.redirect(config.APP_URL);
      }

      // redirect-to-provider — clear stale cookies if any existed
      if (existingRefreshToken) {
        void reply.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
        void reply.clearCookie(SID_COOKIE_NAME, { path: '/auth' });
      }
      span.setAttribute('auth.redirect_target', 'workos');
      return reply.redirect(result.url);
    },
  );

  // GET /auth/callback — WorkOS redirects here after sign-in/sign-up
  fastify.get<{ Querystring: { code: string; state?: string } }>(
    '/auth/callback',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['code'],
          properties: { code: { type: 'string' }, state: { type: 'string' } },
        },
      },
    },
    async (request, reply) => {
      const { config } = request.server;

      const tokens = await handleAuthCallback(
        { authSessionProvider: request.server.root.workosAuthSessionAdapter },
        { code: request.query.code, clientId: config.WORKOS_CLIENT_ID },
      );

      const cookieOpts = buildAuthCookieOptions(config.NODE_ENV === 'production');
      void reply.setCookie(REFRESH_COOKIE_NAME, tokens.refreshToken, cookieOpts);

      const sid = extractSessionId(tokens.accessToken);
      if (sid) {
        void reply.setCookie(SID_COOKIE_NAME, sid, cookieOpts);
      }

      // If this callback originated from an invite flow, redirect to accept-invite page
      const state = request.query.state;
      if (state?.startsWith('invite:')) {
        const inviteToken = state.slice('invite:'.length);
        return reply.redirect(`${config.APP_URL}/accept-invite/${encodeURIComponent(inviteToken)}`);
      }

      return reply.redirect(config.APP_URL);
    },
  );

  // POST /auth/refresh — exchange refresh token cookie for new access token
  fastify.post('/auth/refresh', async (request, reply) => {
    const { config } = request.server;

    const signed = request.cookies[REFRESH_COOKIE_NAME];
    if (!signed) {
      throw new AuthSessionExpiredError();
    }

    const unsignResult = request.unsignCookie(signed);
    if (!unsignResult.valid || !unsignResult.value) {
      throw new AuthSessionExpiredError();
    }

    try {
      const tokens = await refreshSession(
        { authSessionProvider: request.server.root.workosAuthSessionAdapter },
        { refreshToken: unsignResult.value, clientId: config.WORKOS_CLIENT_ID },
      );

      const cookieOpts = buildAuthCookieOptions(config.NODE_ENV === 'production');
      void reply.setCookie(REFRESH_COOKIE_NAME, tokens.refreshToken, cookieOpts);

      const sid = extractSessionId(tokens.accessToken);
      if (sid) {
        void reply.setCookie(SID_COOKIE_NAME, sid, cookieOpts);
      }

      return reply.send({ accessToken: tokens.accessToken });
    } catch {
      void reply.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
      void reply.clearCookie(SID_COOKIE_NAME, { path: '/auth' });
      throw new AuthSessionExpiredError();
    }
  });

  // POST /auth/logout — revoke WorkOS session + clear cookies
  fastify.post('/auth/logout', async (request, reply) => {
    // Read session ID from cookie for best-effort revocation
    let sessionId: string | undefined;
    const signedSid = request.cookies[SID_COOKIE_NAME];
    if (signedSid) {
      const unsignResult = request.unsignCookie(signedSid);
      if (unsignResult.valid && unsignResult.value) {
        sessionId = unsignResult.value;
      }
    }

    await logout({ authSessionProvider: request.server.root.workosAuthSessionAdapter }, sessionId ? { sessionId } : {});

    void reply.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
    void reply.clearCookie(SID_COOKIE_NAME, { path: '/auth' });
    request.log.info('Session cookies cleared');
    return reply.send({ ok: true });
  });
}
