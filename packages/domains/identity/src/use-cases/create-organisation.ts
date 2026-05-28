import type { OrganisationDto } from '@releasepilot/shared';

import { OrganisationName } from '../entities/value-objects/organisation-name.js';
import { OrganisationSlug } from '../entities/value-objects/organisation-slug.js';
import { AuthOrgSlugTakenError } from '../errors/index.js';
import type { EnvironmentRepository } from '../ports/environment-repository.js';
import type { MembershipRepository } from '../ports/membership-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';

const DEFAULT_ENVIRONMENTS = [
  { name: 'Production', position: 0 },
  { name: 'Acceptance', position: 1 },
  { name: 'Test', position: 2 },
];

export interface CreateOrganisationDeps {
  organisationRepo: OrganisationRepository;
  membershipRepo: MembershipRepository;
  environmentRepo?: EnvironmentRepository;
}

export interface CreateOrganisationCommand {
  name: string;
  slug: string;
  userId: string;
}

export async function createOrganisation(deps: CreateOrganisationDeps, input: CreateOrganisationCommand): Promise<OrganisationDto> {
  // Validate inputs via value objects (throws on invalid)
  OrganisationName.create(input.name);
  OrganisationSlug.create(input.slug);

  // Check slug uniqueness
  const slugTaken = await deps.organisationRepo.slugExists(input.slug);
  if (slugTaken) {
    throw new AuthOrgSlugTakenError();
  }

  // Create organisation
  const org = await deps.organisationRepo.create({
    name: input.name,
    slug: input.slug,
  });

  // Create owner membership
  await deps.membershipRepo.create({
    orgId: org.id,
    userId: input.userId,
    role: 'owner',
  });

  // Seed default environments
  if (deps.environmentRepo) {
    for (const env of DEFAULT_ENVIRONMENTS) {
      await deps.environmentRepo.create({ orgId: org.id, name: env.name, position: env.position });
    }
  }

  return {
    id: org.id,
    name: org.name.toString(),
    slug: org.slug.toString(),
    createdAt: org.createdAt.toISOString(),
  };
}
