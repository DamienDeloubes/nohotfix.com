import type { EnvironmentDto } from '@releasepilot/shared';

import type { EnvironmentRepository } from '../ports/environment-repository.js';

export interface ReorderEnvironmentsDeps {
  environmentRepo: EnvironmentRepository;
}

export interface ReorderEnvironmentsCommand {
  orgId: string;
  environmentIds: string[];
}

export async function reorderEnvironments(deps: ReorderEnvironmentsDeps, command: ReorderEnvironmentsCommand): Promise<EnvironmentDto[]> {
  const existing = await deps.environmentRepo.findByOrg(command.orgId);
  const existingIds = new Set(existing.map((e) => e.id));

  // Validate all IDs belong to org and list is complete
  for (const id of command.environmentIds) {
    if (!existingIds.has(id)) {
      throw new Error(`Environment ID ${id} does not belong to this organisation`);
    }
  }
  if (command.environmentIds.length !== existing.length) {
    throw new Error('Environment ID list must include all environments for this organisation');
  }

  // Update positions
  for (let i = 0; i < command.environmentIds.length; i++) {
    const envId = command.environmentIds[i]!;
    await deps.environmentRepo.update(envId, command.orgId, { position: i });
  }

  // Return updated list
  const updated = await deps.environmentRepo.findByOrg(command.orgId);
  return updated.map((env) => ({
    id: env.id,
    name: env.name.toString(),
    position: env.position,
    createdAt: env.createdAt.toISOString(),
  }));
}
