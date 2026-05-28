import type { UserOrganisationDto } from '@releasepilot/shared';

import type { MembershipRepository } from '../ports/membership-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';

export interface GetUserOrganisationsDeps {
  organisationRepo: OrganisationRepository;
  membershipRepo: MembershipRepository;
}

export async function getUserOrganisations(deps: GetUserOrganisationsDeps, userId: string): Promise<UserOrganisationDto[]> {
  const orgs = await deps.organisationRepo.findByUserId(userId);

  const results: UserOrganisationDto[] = [];
  for (const org of orgs) {
    const membership = await deps.membershipRepo.findByOrgAndUser(org.id, userId);
    if (membership) {
      results.push({
        id: org.id,
        name: org.name.toString(),
        slug: org.slug.toString(),
        role: membership.role.toString() as UserOrganisationDto['role'],
        createdAt: org.createdAt.toISOString(),
      });
    }
  }

  return results;
}
