import { AuthEnvInUseError, AuthEnvNotFoundError } from '../errors/index.js';
import type { EnvironmentRepository } from '../ports/environment-repository.js';

export interface DeleteEnvironmentDeps {
  environmentRepo: EnvironmentRepository;
}

export interface DeleteEnvironmentCommand {
  orgId: string;
  environmentId: string;
}

export async function deleteEnvironment(deps: DeleteEnvironmentDeps, command: DeleteEnvironmentCommand): Promise<void> {
  const env = await deps.environmentRepo.findById(command.environmentId, command.orgId);
  if (!env) {
    throw new AuthEnvNotFoundError({ environmentId: command.environmentId });
  }

  // Check if environment is referenced by any playbook
  const playbookCount = await deps.environmentRepo.countPlaybooksByEnvironmentId(command.environmentId, command.orgId);
  if (playbookCount > 0) {
    throw new AuthEnvInUseError({
      playbookCount,
      message: `This environment cannot be deleted because it is used by ${playbookCount} playbook(s). Remove it from all playbooks before deleting.`,
    });
  }

  await deps.environmentRepo.delete(command.environmentId, command.orgId);

  // Reorder remaining environments to close the position gap
  const remaining = await deps.environmentRepo.findByOrg(command.orgId);
  for (let i = 0; i < remaining.length; i++) {
    const env = remaining[i];
    if (env && env.position !== i) {
      await deps.environmentRepo.update(env.id, command.orgId, { position: i });
    }
  }
}
