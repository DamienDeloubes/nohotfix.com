import { AuthProviderUnavailableError, AuthTokenInvalidError, AuthTokenMalformedError, AuthTokenMissingError } from '@nohotfix/domain-identity';
import { DomainError } from '@nohotfix/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { getSpan } from '../lib/tracing.js';

export interface AuthUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks(request: FastifyRequest) {
  if (!jwks) {
    const { workos, config } = request.server;
    const jwksUrl = workos.userManagement.getJwksUrl(config.WORKOS_CLIENT_ID);
    jwks = createRemoteJWKSet(new URL(jwksUrl));
  }

  return jwks;
}

function rethrowOrWrapJwtError(err: unknown, request: FastifyRequest): never {
  if (err instanceof DomainError) throw err;

  if (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch'))) {
    request.log.error({ err }, 'JWKS fetch failed');
    throw new AuthProviderUnavailableError({ cause: (err as Error).message });
  }
  request.log.warn({ err }, 'JWT verification failed');
  throw new AuthTokenInvalidError({ cause: (err as Error).message });
}

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const span = getSpan(request);
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) throw new AuthTokenMissingError();

  const token = authHeader.slice(7);
  if (!token) throw new AuthTokenMalformedError();

  try {
    const { payload } = await jwtVerify(token, getJwks(request));
    const base: AuthUser = {
      userId: String(payload['sub'] ?? ''),
      email: String(payload['email'] ?? ''),
    };
    if (payload['first_name'] !== undefined) base.firstName = String(payload['first_name']);
    if (payload['last_name'] !== undefined) base.lastName = String(payload['last_name']);
    request.authUser = base;

    span.setAttribute('user.id', request.authUser.userId);
    request.log.debug({ userId: request.authUser.userId }, 'JWT verified');
  } catch (err) {
    rethrowOrWrapJwtError(err, request);
  }
}
