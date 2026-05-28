import type { EnvironmentDto } from '@releasepilot/shared';

import type { EnvironmentRepository } from '../ports/environment-repository.js';

export interface ListEnvironmentsDeps {
  environmentRepo: EnvironmentRepository;
}

export interface ListEnvironmentsCommand {
  orgId: string;
}

export async function listEnvironments(deps: ListEnvironmentsDeps, command: ListEnvironmentsCommand): Promise<EnvironmentDto[]> {
  const environments = await deps.environmentRepo.findByOrg(command.orgId);

  return environments.map((env) => ({
    id: env.id,
    name: env.name.toString(),
    position: env.position,
    createdAt: env.createdAt.toISOString(),
  }));
}
