import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../ports/playbook-section-repository.js';
import type { PlaybookSection } from '../types.js';

export interface CreateSectionDeps {
  playbookRepo: PlaybookRepository;
  playbookSectionRepo: PlaybookSectionRepository;
}

export interface CreateSectionCommand {
  playbookId: string;
  orgId: string;
  name: string;
}

export async function createSection(deps: CreateSectionDeps, command: CreateSectionCommand): Promise<PlaybookSection> {
  const playbook = await deps.playbookRepo.findById(command.playbookId, command.orgId);
  if (!playbook) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  const existing = await deps.playbookSectionRepo.findByPlaybook(command.playbookId, command.orgId);
  const nextPosition = existing.length > 0 ? Math.max(...existing.map((s) => s.position)) + 1 : 0;

  return deps.playbookSectionRepo.create({
    playbookId: command.playbookId,
    orgId: command.orgId,
    name: command.name.trim(),
    position: nextPosition,
  });
}
