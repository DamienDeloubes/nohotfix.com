import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../ports/playbook-section-repository.js';

export interface ReorderSectionsDeps {
  playbookRepo: PlaybookRepository;
  playbookSectionRepo: PlaybookSectionRepository;
}

export interface ReorderSectionsCommand {
  playbookId: string;
  orderedIds: string[];
  orgId: string;
}

export async function reorderSections(deps: ReorderSectionsDeps, command: ReorderSectionsCommand): Promise<void> {
  const playbook = await deps.playbookRepo.findById(command.playbookId, command.orgId);
  if (!playbook) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  for (let i = 0; i < command.orderedIds.length; i++) {
    const id = command.orderedIds[i]!;
    await deps.playbookSectionRepo.update(id, command.orgId, { position: i });
  }
}
