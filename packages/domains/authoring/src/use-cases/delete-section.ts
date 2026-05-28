import type { PlaybookSectionRepository } from '../ports/playbook-section-repository.js';
import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';

export interface DeleteSectionDeps {
  playbookSectionRepo: PlaybookSectionRepository;
  playbookSpecRepo: PlaybookSpecRepository;
}

export interface DeleteSectionCommand {
  sectionId: string;
  orgId: string;
}

export async function deleteSection(deps: DeleteSectionDeps, command: DeleteSectionCommand): Promise<void> {
  await deps.playbookSpecRepo.deleteBySectionId(command.sectionId, command.orgId);
  await deps.playbookSectionRepo.delete(command.sectionId, command.orgId);
}
