import { AuthorPlaybookNotFoundError, AuthorPlaybookSpecDuplicateError, AuthorSectionNotFoundError, AuthorSpecNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../ports/playbook-section-repository.js';
import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';
import type { PlaybookSpec } from '../types.js';

export interface AddSpecToSectionDeps {
  playbookRepo: PlaybookRepository;
  playbookSectionRepo: PlaybookSectionRepository;
  playbookSpecRepo: PlaybookSpecRepository;
  specLibraryRepo: SpecLibraryRepository;
}

export interface AddSpecToSectionCommand {
  playbookId: string;
  specLibraryId: string;
  sectionId?: string | null;
  orgId: string;
}

export async function addSpecToSection(deps: AddSpecToSectionDeps, command: AddSpecToSectionCommand): Promise<PlaybookSpec> {
  const playbook = await deps.playbookRepo.findById(command.playbookId, command.orgId);
  if (!playbook) {
    throw new AuthorPlaybookNotFoundError(command.playbookId);
  }

  const resolvedSectionId = command.sectionId ?? null;

  if (resolvedSectionId) {
    const sections = await deps.playbookSectionRepo.findByPlaybook(command.playbookId, command.orgId);
    const sectionExists = sections.some((s) => s.id === resolvedSectionId);
    if (!sectionExists) {
      throw new AuthorSectionNotFoundError(resolvedSectionId);
    }
  }

  const isDuplicate = await deps.playbookSpecRepo.existsInPlaybook(command.playbookId, command.specLibraryId, command.orgId);
  if (isDuplicate) {
    throw new AuthorPlaybookSpecDuplicateError(command.specLibraryId);
  }

  // Verify library spec exists
  const librarySpec = await deps.specLibraryRepo.findById(command.specLibraryId, command.orgId);
  if (!librarySpec) {
    throw new AuthorSpecNotFoundError(command.specLibraryId);
  }

  // Determine position: append at the end of the target zone
  const existingSpecs = resolvedSectionId
    ? await deps.playbookSpecRepo.findBySection(resolvedSectionId, command.orgId)
    : await deps.playbookSpecRepo.findUngrouped(command.playbookId, command.orgId);
  const nextPosition = existingSpecs.length > 0 ? Math.max(...existingSpecs.map((s) => s.position)) + 1 : 0;

  return deps.playbookSpecRepo.create({
    sectionId: resolvedSectionId,
    playbookId: command.playbookId,
    orgId: command.orgId,
    specLibraryId: command.specLibraryId,
    position: nextPosition,
  });
}
