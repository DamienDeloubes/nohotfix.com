import { acceptInvite, createInvite, listPendingInvites, resendInvite, resolveUserFromJwt, revokeInvite, validateInviteToken } from '@nohotfix/domain-identity';
import { CreateInviteRequestSchema } from '@nohotfix/shared';
import type { FastifyInstance } from 'fastify';

import { getSpan } from '../shared/lib/tracing.js';
import { authMiddleware } from '../shared/middleware/auth.js';
import { orgScopeMiddleware } from '../shared/middleware/org-scope.js';
import { roleGuard } from '../shared/middleware/role-guard.js';

export async function inviteRoutes(fastify: FastifyInstance): Promise<void> {
  // T019: POST /api/orgs/:orgSlug/invites — create invite
  fastify.post('/api/orgs/:orgSlug/invites', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email: inviterEmail } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const parsed = CreateInviteRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);
    span.setAttribute('invite.email', parsed.data.email);
    span.setAttribute('invite.role', parsed.data.role);

    const result = await createInvite(
      {
        inviteRepo: request.server.root.inviteRepo,
        membershipRepo: request.server.root.membershipRepo,
        organisationRepo: request.server.root.organisationRepo,
        userRepo: request.server.root.userRepo,
        emailPort: request.server.root.resendEmailAdapter,
        webUrl: request.server.config.WEB_URL,
      },
      {
        orgId,
        email: parsed.data.email,
        role: parsed.data.role,
        invitedByUserId: userId,
        inviterEmail,
      },
    );

    span.setAttribute('invite.id', result.id);
    return reply.code(201).send(result);
  });

  // T020: GET /api/orgs/:orgSlug/invites — list pending invites
  fastify.get('/api/orgs/:orgSlug/invites', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);

    const rawInvites = await listPendingInvites({ inviteRepo: request.server.root.inviteRepo }, orgId);

    span.setAttribute('invites.count', rawInvites.length);
    return reply.send({
      invites: rawInvites.map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: inv.status,
        invitedBy: {
          id: inv.invitedBy,
          firstName: inv.inviterFirstName,
          lastName: inv.inviterLastName,
        },
        lastSentAt: inv.lastSentAt,
        tokenExpiresAt: inv.tokenExpiresAt,
        createdAt: inv.createdAt,
      })),
    });
  });

  // T037: POST /api/orgs/:orgSlug/invites/:inviteId/resend — resend invite
  fastify.post('/api/orgs/:orgSlug/invites/:inviteId/resend', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { inviteId } = request.params as { inviteId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('invite.id', inviteId);

    const result = await resendInvite(
      {
        inviteRepo: request.server.root.inviteRepo,
        organisationRepo: request.server.root.organisationRepo,
        userRepo: request.server.root.userRepo,
        emailPort: request.server.root.resendEmailAdapter,
        webUrl: request.server.config.WEB_URL,
      },
      { orgId, inviteId },
    );

    return reply.send(result);
  });

  // T038: DELETE /api/orgs/:orgSlug/invites/:inviteId — revoke invite
  fastify.delete('/api/orgs/:orgSlug/invites/:inviteId', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { inviteId } = request.params as { inviteId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('invite.id', inviteId);

    await revokeInvite({ inviteRepo: request.server.root.inviteRepo }, { orgId, inviteId });

    return reply.code(204).send();
  });

  // T031: GET /api/invites/:token/validate — validate invite token (no auth)
  fastify.get('/api/invites/:token/validate', async (request, reply) => {
    const span = getSpan(request);
    const { token } = request.params as { token: string };
    span.setAttribute('invite.token_prefix', token.slice(0, 8));

    const result = await validateInviteToken(
      {
        inviteRepo: request.server.root.inviteRepo,
        organisationRepo: request.server.root.organisationRepo,
      },
      token,
    );

    span.setAttribute('invite.validation_status', result.status);
    return reply.send(result);
  });

  // T030: POST /api/invites/:token/accept — accept invite (auth required, no org scope)
  fastify.post('/api/invites/:token/accept', { preHandler: [authMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { token } = request.params as { token: string };
    span.setAttribute('invite.token_prefix', token.slice(0, 8));

    const user = await resolveUserFromJwt(
      { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
      { workosUserId: request.authUser!.userId },
    );
    span.setAttribute('user.id', user.id);

    const result = await acceptInvite(
      {
        inviteRepo: request.server.root.inviteRepo,
        membershipRepo: request.server.root.membershipRepo,
        organisationRepo: request.server.root.organisationRepo,
        userRepo: request.server.root.userRepo,
      },
      {
        token,
        userId: user.id,
        userEmail: user.email,
      },
    );

    span.setAttribute('invite.org_slug', result.orgSlug);
    return reply.send(result);
  });
}
