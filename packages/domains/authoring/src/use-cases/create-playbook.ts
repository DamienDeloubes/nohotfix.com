import { AuthorPlaybookNameInvalidError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { Playbook } from '../types.js';

export interface CreatePlaybookDeps {
  playbookRepo: PlaybookRepository;
}

export interface CreatePlaybookCommand {
  orgId: string;
  name: string;
  description?: string;
  environmentId?: string;
  createdBy: string;
}

export async function createPlaybook(deps: CreatePlaybookDeps, command: CreatePlaybookCommand): Promise<Playbook> {
  const trimmedName = command.name.trim();
  if (trimmedName.length === 0 || trimmedName.length > 255) {
    throw new AuthorPlaybookNameInvalidError(trimmedName.length === 0 ? 'Playbook name cannot be empty' : 'Playbook name cannot exceed 255 characters');
  }

  return deps.playbookRepo.create({
    orgId: command.orgId,
    name: trimmedName,
    ...(command.description != null && { description: command.description }),
    ...(command.environmentId != null && { environmentId: command.environmentId }),
    isArchived: false,
    createdBy: command.createdBy,
  });
}
