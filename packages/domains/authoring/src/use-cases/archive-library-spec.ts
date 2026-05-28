import type { LibrarySpec } from '@nohotfix/shared';

import { AuthorSpecNotFoundError } from '../errors/index.js';
import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';

export interface ArchiveLibrarySpecDeps {
  specLibraryRepo: SpecLibraryRepository;
  playbookSpecRepo: PlaybookSpecRepository;
}

export interface ArchiveLibrarySpecCommand {
  specId: string;
  orgId: string;
  archive: boolean;
}

export interface ArchiveLibrarySpecResult {
  spec: LibrarySpec;
  wasChanged: boolean;
}

export async function archiveLibrarySpec(deps: ArchiveLibrarySpecDeps, command: ArchiveLibrarySpecCommand): Promise<ArchiveLibrarySpecResult> {
  const existing = await deps.specLibraryRepo.findById(command.specId, command.orgId);
  if (!existing) {
    throw new AuthorSpecNotFoundError(command.specId);
  }

  // Idempotency: if already in target state, return current state without changes
  if (existing.isArchived === command.archive) {
    return {
      spec: toLibrarySpec(existing),
      wasChanged: false,
    };
  }

  const updated = await deps.specLibraryRepo.setArchived(command.specId, command.orgId, command.archive);
  if (!updated) {
    throw new AuthorSpecNotFoundError(command.specId);
  }

  // When archiving, remove spec from all playbook templates
  if (command.archive) {
    await deps.playbookSpecRepo.removeByLibrarySpecId(command.specId, command.orgId);
  }

  return {
    spec: toLibrarySpec(updated),
    wasChanged: true,
  };
}

function toLibrarySpec(entry: {
  id: string;
  orgId: string;
  title: string;
  systemUnderTest: string | null;
  severity: string;
  preconditions: unknown;
  description: unknown;
  testSteps: unknown;
  expectedResult: unknown;
  artifactRequirements: unknown;
  testerNotes: string | null;
  estimatedDurationMinutes: number | null;
  tags: string[] | null;
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}): LibrarySpec {
  return {
    id: entry.id,
    orgId: entry.orgId,
    title: entry.title,
    systemUnderTest: entry.systemUnderTest,
    severity: entry.severity as 'critical' | 'high' | 'medium' | 'low',
    preconditions: entry.preconditions,
    description: entry.description,
    testSteps: entry.testSteps as { instruction: string; expectedOutcome?: string }[] | null,
    expectedResult: entry.expectedResult,
    artifactRequirements: entry.artifactRequirements as { index: number; type: 'text'; label: string; description: string | null; required: boolean }[] | null,
    testerNotes: entry.testerNotes,
    estimatedDurationMinutes: entry.estimatedDurationMinutes ?? null,
    tags: entry.tags ?? [],
    isArchived: entry.isArchived,
    createdBy: entry.createdBy,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
