import { AuthorSectionNotFoundError } from '../errors/index.js';
import type { PlaybookSectionRepository } from '../ports/playbook-section-repository.js';
import type { PlaybookSection } from '../types.js';

export interface UpdateSectionDeps {
  playbookSectionRepo: PlaybookSectionRepository;
}

export interface UpdateSectionCommand {
  sectionId: string;
  orgId: string;
  name?: string;
}

export async function updateSection(deps: UpdateSectionDeps, command: UpdateSectionCommand): Promise<PlaybookSection> {
  const updated = await deps.playbookSectionRepo.update(command.sectionId, command.orgId, {
    ...(command.name != null && { name: command.name.trim() }),
  });
  if (!updated) {
    throw new AuthorSectionNotFoundError(command.sectionId);
  }
  return updated;
}
