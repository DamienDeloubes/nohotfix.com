import type { OrganisationDto } from '@releasepilot/shared';

import type { RoleValue } from '../entities/value-objects/role.js';
import { AuthOrgNotFoundError, AuthRoleInsufficientError } from '../errors/index.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';

export interface RenameOrganisationDeps {
  organisationRepo: OrganisationRepository;
}

export interface RenameOrganisationCommand {
  orgId: string;
  newName: string;
  role: RoleValue;
}

export async function renameOrganisation(deps: RenameOrganisationDeps, input: RenameOrganisationCommand): Promise<OrganisationDto> {
  if (input.role !== 'owner' && input.role !== 'admin') {
    throw new AuthRoleInsufficientError();
  }

  const updated = await deps.organisationRepo.update(input.orgId, { name: input.newName });
  if (!updated) {
    throw new AuthOrgNotFoundError({ orgId: input.orgId });
  }

  return {
    id: updated.id,
    name: updated.name.toString(),
    slug: updated.slug.toString(),
    createdAt: updated.createdAt.toISOString(),
  };
}
