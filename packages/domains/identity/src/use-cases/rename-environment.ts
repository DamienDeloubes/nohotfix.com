import type { EnvironmentDto } from '@releasepilot/shared';

import { EnvironmentName } from '../entities/value-objects/environment-name.js';
import { AuthEnvNameDuplicateError, AuthEnvNotFoundError } from '../errors/index.js';
import type { EnvironmentRepository } from '../ports/environment-repository.js';

export interface RenameEnvironmentDeps {
  environmentRepo: EnvironmentRepository;
}

export interface RenameEnvironmentCommand {
  orgId: string;
  environmentId: string;
  name: string;
}

export async function renameEnvironment(deps: RenameEnvironmentDeps, command: RenameEnvironmentCommand): Promise<EnvironmentDto> {
  const env = await deps.environmentRepo.findById(command.environmentId, command.orgId);
  if (!env) {
    throw new AuthEnvNotFoundError({ environmentId: command.environmentId });
  }

  const newName = EnvironmentName.create(command.name);

  // Check for duplicate name (case-insensitive), excluding self
  const existing = await deps.environmentRepo.findByOrg(command.orgId);
  const duplicate = existing.find((e) => e.id !== command.environmentId && e.name.equals(newName));
  if (duplicate) {
    throw new AuthEnvNameDuplicateError();
  }

  const renamed = env.rename(command.name);
  const updated = await deps.environmentRepo.update(command.environmentId, command.orgId, { name: renamed.name.toString() });
  if (!updated) {
    throw new AuthEnvNotFoundError({ environmentId: command.environmentId });
  }

  return {
    id: updated.id,
    name: updated.name.toString(),
    position: updated.position,
    createdAt: updated.createdAt.toISOString(),
  };
}
