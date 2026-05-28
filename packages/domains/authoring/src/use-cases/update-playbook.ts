import { AuthorPlaybookNameInvalidError, AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { Playbook } from '../types.js';

export interface UpdatePlaybookDeps {
  playbookRepo: PlaybookRepository;
}

export interface UpdatePlaybookCommand {
  id: string;
  orgId: string;
  name?: string;
  description?: string;
  environmentId?: string | null;
}

export async function updatePlaybook(deps: UpdatePlaybookDeps, command: UpdatePlaybookCommand): Promise<Playbook> {
  if (command.name != null) {
    const trimmed = command.name.trim();
    if (trimmed.length === 0 || trimmed.length > 255) {
      throw new AuthorPlaybookNameInvalidError(trimmed.length === 0 ? 'Playbook name cannot be empty' : 'Playbook name cannot exceed 255 characters');
    }
  }

  const updated = await deps.playbookRepo.update(command.id, command.orgId, {
    ...(command.name != null && { name: command.name.trim() }),
    ...(command.description !== undefined && { description: command.description }),
    ...(command.environmentId !== undefined && { environmentId: command.environmentId }),
  });

  if (!updated) {
    throw new AuthorPlaybookNotFoundError(command.id);
  }

  return updated;
}
