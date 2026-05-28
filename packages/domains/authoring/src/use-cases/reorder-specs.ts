import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';

export interface ReorderSpecsDeps {
  playbookRepo: PlaybookRepository;
  playbookSpecRepo: PlaybookSpecRepository;
}

export interface ReorderSpecsCommand {
  playbookId: string;
  sectionId?: string | null;
  orderedIds: string[];
  orgId: string;
}

export async function reorderSpecs(deps: ReorderSpecsDeps, command: ReorderSpecsCommand): Promise<void> {
  const playbook = await deps.playbookRepo.findById(command.playbookId, command.orgId);
  if (!playbook) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  const updates = command.orderedIds.map((id, index) => ({ id, position: index }));
  await deps.playbookSpecRepo.updatePositions(updates, command.orgId);
}
