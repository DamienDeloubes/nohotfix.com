import { AuthRoleInsufficientError } from '@nohotfix/domain-identity';
import { requireRole, type RoleCheck } from '@nohotfix/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Fastify preHandler that checks the caller's role from orgContext.
 * Must run after orgScopeMiddleware (which populates request.orgContext).
 *
 * @example
 * fastify.post('/api/orgs/:orgSlug/specs', {
 *   preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })],
 * }, handler);
 */
export function roleGuard(check: RoleCheck) {
  return async function roleGuardHandler(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const role = request.orgContext?.role;
    if (!role || !requireRole(role, check)) {
      throw new AuthRoleInsufficientError();
    }
  };
}
