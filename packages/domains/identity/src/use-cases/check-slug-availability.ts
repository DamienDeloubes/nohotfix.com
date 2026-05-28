import type { OrganisationRepository } from '../ports/organisation-repository.js';

export interface CheckSlugAvailabilityDeps {
  organisationRepo: OrganisationRepository;
}

export async function checkSlugAvailability(deps: CheckSlugAvailabilityDeps, slug: string): Promise<{ available: boolean }> {
  const exists = await deps.organisationRepo.slugExists(slug);
  return { available: !exists };
}
