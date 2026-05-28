import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { Playbook } from '../types.js';

export interface ArchivePlaybookDeps {
  playbookRepo: PlaybookRepository;
}

export interface ArchivePlaybookCommand {
  playbookId: string;
  orgId: string;
  isArchived: boolean;
}

export interface ArchivePlaybookResult {
  playbook: {
    id: string;
    name: string;
    description?: string;
    environmentId?: string;
    isArchived: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  wasChanged: boolean;
}

function toPlaybookDto(playbook: Playbook) {
  return {
    id: playbook.id,
    name: playbook.name,
    ...(playbook.description != null && { description: playbook.description }),
    ...(playbook.environmentId != null && { environmentId: playbook.environmentId }),
    isArchived: playbook.isArchived,
    createdBy: playbook.createdBy,
    createdAt: playbook.createdAt.toISOString(),
    updatedAt: playbook.updatedAt.toISOString(),
  };
}

export async function archivePlaybook(deps: ArchivePlaybookDeps, command: ArchivePlaybookCommand): Promise<ArchivePlaybookResult> {
  const existing = await deps.playbookRepo.findById(command.playbookId, command.orgId);
  if (!existing) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  // Idempotency: if already in target state, return current state without changes
  if (existing.isArchived === command.isArchived) {
    return {
      playbook: toPlaybookDto(existing),
      wasChanged: false,
    };
  }

  const updated = await deps.playbookRepo.update(command.playbookId, command.orgId, { isArchived: command.isArchived });
  if (!updated) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  return {
    playbook: toPlaybookDto(updated),
    wasChanged: true,
  };
}
