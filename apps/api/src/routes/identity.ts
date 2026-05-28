import {
  changeMemberRole,
  checkSlugAvailability,
  createEnvironment,
  createOrganisation,
  deleteEnvironment,
  getUserOrganisations,
  listEnvironments,
  listOrgMembers,
  removeMember,
  renameEnvironment,
  renameOrganisation,
  reorderEnvironments,
  resolveUserFromJwt,
  updateUserProfile,
} from '@nohotfix/domain-identity';
import {
  ChangeMemberRoleRequestSchema,
  CreateEnvironmentRequestSchema,
  CreateOrganisationRequestSchema,
  OrganisationSlugSchema,
  ReorderEnvironmentsRequestSchema,
  UpdateEnvironmentRequestSchema,
  UpdateOrganisationRequestSchema,
  UpdateUserProfileRequestSchema,
} from '@nohotfix/shared';
import type { FastifyInstance } from 'fastify';

import { getSpan } from '../shared/lib/tracing.js';
import { authMiddleware } from '../shared/middleware/auth.js';
import { orgScopeMiddleware } from '../shared/middleware/org-scope.js';

export async function identityRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/orgs/:orgSlug', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', request.orgContext!.userId);

    const org = await request.server.root.organisationRepo.findById(orgId);
    if (!org) {
      return reply.code(404).send({ error: 'Organisation not found' });
    }

    return reply.send({
      id: org.id,
      name: org.name.toString(),
      slug: org.slug.toString(),
      createdAt: org.createdAt.toISOString(),
    });
  });

  fastify.patch('/api/orgs/:orgSlug', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, role, userId } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const parsed = UpdateOrganisationRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('org.name.new', parsed.data.name);

    const result = await renameOrganisation({ organisationRepo: request.server.root.organisationRepo }, { orgId, newName: parsed.data.name, role });

    return reply.send(result);
  });

  fastify.get('/api/orgs/:orgSlug/members', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId } = request.orgContext!;
    span.setAttribute('org.id', orgId);

    const members = await listOrgMembers({ membershipRepo: request.server.root.membershipRepo }, orgId);

    span.setAttribute('members.count', members.length);
    return reply.send({
      members: members.map((m) => ({
        id: m.membershipId,
        userId: m.userId,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      })),
    });
  });

  fastify.patch('/api/orgs/:orgSlug/members/:memberId/role', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, role: actorRole, membershipId: actorMembershipId } = request.orgContext!;
    const { memberId } = request.params as { memberId: string };

    span.setAttribute('org.id', orgId);
    span.setAttribute('target.membership_id', memberId);

    const parsed = ChangeMemberRoleRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('role.to', parsed.data.role);

    const result = await changeMemberRole(
      {
        membershipRepo: request.server.root.membershipRepo,
      },
      {
        orgId,
        targetMembershipId: memberId,
        newRole: parsed.data.role,
        actorMembershipId,
        actorRole,
      },
    );

    span.setAttribute('role.from', result.previousRole);
    span.setAttribute('role.is_transfer', result.isTransfer);

    // Fetch updated member DTO for response
    const members = await request.server.root.membershipRepo.findMembersWithUsers(orgId);
    const updatedMember = members.find((m) => m.membershipId === memberId);

    if (!updatedMember) {
      return reply.code(404).send({ error: 'Member not found after update' });
    }

    return reply.send({
      id: updatedMember.membershipId,
      userId: updatedMember.userId,
      firstName: updatedMember.firstName,
      lastName: updatedMember.lastName,
      email: updatedMember.email,
      role: updatedMember.role,
      joinedAt: updatedMember.joinedAt.toISOString(),
    });
  });

  fastify.delete('/api/orgs/:orgSlug/members/:memberId', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, userId: actorUserId, role: actorRole } = request.orgContext!;
    const { memberId } = request.params as { memberId: string };

    span.setAttribute('membership.actor_id', actorUserId);
    span.setAttribute('membership.target_id', memberId);
    span.setAttribute('membership.org_id', orgId);

    const result = await removeMember({ membershipRepo: request.server.root.membershipRepo }, { orgId, memberId, actorUserId, actorRole });

    span.setAttribute('membership.is_self_removal', result.isSelfRemoval);

    return reply.code(204).send();
  });

  fastify.get('/api/users/me', { preHandler: authMiddleware }, async (request, reply) => {
    const span = getSpan(request);
    span.setAttribute('user.workos_id', request.authUser!.userId);

    const result = await resolveUserFromJwt(
      { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
      { workosUserId: request.authUser!.userId },
    );

    request.log.info({ workosUserId: request.authUser!.userId }, 'User profile fetched');
    return reply.send(result);
  });

  fastify.get('/api/orgs/:orgSlug/me', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { userId, email, role } = request.orgContext!;
    span.setAttribute('user.id', userId);

    const user = await request.server.root.userRepo.findById(userId);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return reply.send({
      id: user.id,
      workosUserId: user.workosUserId.toString(),
      email,
      firstName: user.firstName?.toString() ?? null,
      lastName: user.lastName?.toString() ?? null,
      role,
    });
  });

  fastify.patch('/api/users/me', { preHandler: authMiddleware }, async (request, reply) => {
    const span = getSpan(request);
    span.setAttribute('user.workos_id', request.authUser!.userId);

    const parsed = UpdateUserProfileRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);

    const user = await resolveUserFromJwt(
      { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
      { workosUserId: request.authUser!.userId },
    );
    span.setAttribute('user.internal_id', user.id);

    const result = await updateUserProfile({ userRepo: request.server.root.userRepo }, { userId: user.id, firstName: parsed.data.firstName, lastName: parsed.data.lastName });

    return reply.send(result);
  });

  // T023: POST /api/orgs — create organisation
  fastify.post('/api/orgs', { preHandler: authMiddleware }, async (request, reply) => {
    const span = getSpan(request);
    span.setAttribute('user.workos_id', request.authUser!.userId);

    const parsed = CreateOrganisationRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('org.slug', parsed.data.slug);

    // Resolve WorkOS user ID → internal user
    const user = await resolveUserFromJwt(
      { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
      { workosUserId: request.authUser!.userId },
    );
    span.setAttribute('user.internal_id', user.id);

    const result = await createOrganisation(
      {
        organisationRepo: request.server.root.organisationRepo,
        membershipRepo: request.server.root.membershipRepo,
        environmentRepo: request.server.root.environmentRepo,
      },
      {
        name: parsed.data.name,
        slug: parsed.data.slug,
        userId: user.id,
      },
    );

    span.setAttribute('org.id', result.id);
    return reply.code(201).send(result);
  });

  // T024: GET /api/orgs/check-slug — check slug availability
  fastify.get('/api/orgs/check-slug', { preHandler: authMiddleware }, async (request, reply) => {
    const span = getSpan(request);
    const { slug } = request.query as { slug?: string };
    const parsed = OrganisationSlugSchema.safeParse(slug);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid slug format', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);
    span.setAttribute('org.slug', parsed.data);

    const result = await checkSlugAvailability({ organisationRepo: request.server.root.organisationRepo }, parsed.data);

    span.setAttribute('slug.available', result.available);
    return reply.send(result);
  });

  // Environments
  fastify.get('/api/orgs/:orgSlug/environments', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId } = request.orgContext!;
    span.setAttribute('org.id', orgId);

    const environments = await listEnvironments({ environmentRepo: request.server.root.environmentRepo }, { orgId });

    span.setAttribute('environments.count', environments.length);
    return reply.send({ environments });
  });

  fastify.post('/api/orgs/:orgSlug/environments', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, role } = request.orgContext!;
    span.setAttribute('org.id', orgId);

    if (role !== 'admin' && role !== 'owner') {
      return reply.code(403).send({ error: 'Insufficient role' });
    }

    const parsed = CreateEnvironmentRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('environment.name', parsed.data.name);

    const env = await createEnvironment({ environmentRepo: request.server.root.environmentRepo }, { orgId, name: parsed.data.name });

    span.setAttribute('environment.id', env.id);
    return reply.code(201).send(env);
  });

  fastify.patch('/api/orgs/:orgSlug/environments/:environmentId', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, role } = request.orgContext!;
    const { environmentId } = request.params as { environmentId: string };
    span.setAttribute('org.id', orgId);
    span.setAttribute('environment.id', environmentId);

    if (role !== 'admin' && role !== 'owner') {
      return reply.code(403).send({ error: 'Insufficient role' });
    }

    const parsed = UpdateEnvironmentRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('environment.name.new', parsed.data.name);

    const env = await renameEnvironment({ environmentRepo: request.server.root.environmentRepo }, { orgId, environmentId, name: parsed.data.name });

    return reply.send(env);
  });

  fastify.post('/api/orgs/:orgSlug/environments/reorder', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, role } = request.orgContext!;
    span.setAttribute('org.id', orgId);

    if (role !== 'admin' && role !== 'owner') {
      return reply.code(403).send({ error: 'Insufficient role' });
    }

    const parsed = ReorderEnvironmentsRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    const environments = await reorderEnvironments({ environmentRepo: request.server.root.environmentRepo }, { orgId, environmentIds: parsed.data.environmentIds });

    return reply.send({ environments });
  });

  fastify.delete('/api/orgs/:orgSlug/environments/:environmentId', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, role } = request.orgContext!;
    const { environmentId } = request.params as { environmentId: string };
    span.setAttribute('org.id', orgId);
    span.setAttribute('environment.id', environmentId);

    if (role !== 'admin' && role !== 'owner') {
      return reply.code(403).send({ error: 'Insufficient role' });
    }

    await deleteEnvironment({ environmentRepo: request.server.root.environmentRepo }, { orgId, environmentId });

    return reply.code(204).send();
  });

  // T025: GET /api/users/me/orgs — get user's organisations
  fastify.get('/api/users/me/orgs', { preHandler: authMiddleware }, async (request, reply) => {
    const span = getSpan(request);
    span.setAttribute('user.workos_id', request.authUser!.userId);

    // Resolve WorkOS user ID → internal user
    const user = await resolveUserFromJwt(
      { userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter },
      { workosUserId: request.authUser!.userId },
    );
    span.setAttribute('user.internal_id', user.id);

    const orgs = await getUserOrganisations(
      {
        organisationRepo: request.server.root.organisationRepo,
        membershipRepo: request.server.root.membershipRepo,
      },
      user.id,
    );

    span.setAttribute('orgs.count', orgs.length);
    return reply.send(orgs);
  });
}
