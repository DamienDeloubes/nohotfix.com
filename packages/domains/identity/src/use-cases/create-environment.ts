import type { EnvironmentDto } from '@nohotfix/shared';

import { EnvironmentName } from '../entities/value-objects/environment-name.js';
import { AuthEnvNameDuplicateError } from '../errors/index.js';
import type { EnvironmentRepository } from '../ports/environment-repository.js';

export interface CreateEnvironmentDeps {
  environmentRepo: EnvironmentRepository;
}

export interface CreateEnvironmentCommand {
  orgId: string;
  name: string;
}

export async function createEnvironment(deps: CreateEnvironmentDeps, command: CreateEnvironmentCommand): Promise<EnvironmentDto> {
  const envName = EnvironmentName.create(command.name);

  // Check for duplicate name (case-insensitive)
  const existing = await deps.environmentRepo.findByOrg(command.orgId);
  const duplicate = existing.find((e) => e.name.equals(envName));
  if (duplicate) {
    throw new AuthEnvNameDuplicateError();
  }

  const maxPosition = await deps.environmentRepo.getMaxPosition(command.orgId);
  const env = await deps.environmentRepo.create({
    orgId: command.orgId,
    name: envName.toString(),
    position: maxPosition + 1,
  });

  return {
    id: env.id,
    name: env.name.toString(),
    position: env.position,
    createdAt: env.createdAt.toISOString(),
  };
}
