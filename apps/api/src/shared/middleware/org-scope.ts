import { resolveOrgFromSlug, resolveUserFromJwt, type RoleValue } from '@nohotfix/domain-identity';
import type { FastifyRequest } from 'fastify';

import { getSpan } from '../lib/tracing.js';

export interface OrgContext {
  orgId: string;
  orgSlug: string;
  orgName: string;
  userId: string;
  membershipId: string;
  role: RoleValue;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    orgContext?: OrgContext;
  }
}

export async function orgScopeMiddleware(request: FastifyRequest): Promise<void> {
  const span = getSpan(request);
  const workosUserId = request.authUser!.userId;

  // 2. Resolve WorkOS ID → internal user
  const user = await resolveUserFromJwt({ userRepo: request.server.root.userRepo, userProfileProvider: request.server.root.workosUserProfileAdapter }, { workosUserId });

  // 3. Resolve slug → org + verify membership
  const { orgSlug } = request.params as { orgSlug: string };
  const orgContext = await resolveOrgFromSlug(
    { organisationRepo: request.server.root.organisationRepo, membershipRepo: request.server.root.membershipRepo },
    { slug: orgSlug, userId: user.id },
  );

  // 4. Attach org context
  request.orgContext = {
    ...orgContext,
    userId: user.id,
    email: user.email,
  };

  span.setAttribute('org.id', orgContext.orgId);
  span.setAttribute('org.slug', orgContext.orgSlug);
  span.setAttribute('user.id', user.id);
  span.setAttribute('user.role', orgContext.role);
}
