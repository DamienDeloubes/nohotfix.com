import type { RoleValue } from '../entities/value-objects/role.js';
import { AuthMembershipNotFoundError, AuthOrgNotFoundError } from '../errors/index.js';
import type { MembershipRepository } from '../ports/membership-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';

export interface ResolveOrgFromSlugDeps {
  organisationRepo: OrganisationRepository;
  membershipRepo: MembershipRepository;
}

export interface ResolveOrgFromSlugCommand {
  slug: string;
  userId: string;
}

export interface ResolveOrgFromSlugOutput {
  orgId: string;
  orgName: string;
  orgSlug: string;
  membershipId: string;
  role: RoleValue;
}

export async function resolveOrgFromSlug(deps: ResolveOrgFromSlugDeps, input: ResolveOrgFromSlugCommand): Promise<ResolveOrgFromSlugOutput> {
  const org = await deps.organisationRepo.findBySlug(input.slug);
  if (!org) {
    throw new AuthOrgNotFoundError({ slug: input.slug });
  }

  const membership = await deps.membershipRepo.findByOrgAndUser(org.id, input.userId);
  if (!membership) {
    throw new AuthMembershipNotFoundError({ orgId: org.id, userId: input.userId });
  }

  return {
    orgId: org.id,
    orgName: org.name.toString(),
    orgSlug: org.slug.toString(),
    membershipId: membership.id,
    role: membership.role.value,
  };
}
