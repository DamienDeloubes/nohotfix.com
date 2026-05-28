import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';

export interface RemoveSpecFromSectionDeps {
  playbookSpecRepo: PlaybookSpecRepository;
}

export interface RemoveSpecFromSectionCommand {
  specId: string;
  orgId: string;
}

export async function removeSpecFromSection(deps: RemoveSpecFromSectionDeps, command: RemoveSpecFromSectionCommand): Promise<void> {
  await deps.playbookSpecRepo.delete(command.specId, command.orgId);
}
