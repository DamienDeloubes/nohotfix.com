import type { LibrarySpec } from '@releasepilot/shared';

import { SpecLibraryEntryEntity, type CreateSpecLibraryEntryParams } from '../entities/spec-library-entry.js';
import type { TestStepProps } from '../entities/value-objects/test-step.js';
import { AuthorSpecArchivedError, AuthorSpecNotFoundError } from '../errors/index.js';
import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';

export interface UpdateLibrarySpecDeps {
  specLibraryRepo: SpecLibraryRepository;
}

export interface UpdateLibrarySpecCommand {
  id: string;
  orgId: string;
  title: string;
  systemUnderTest?: string | null | undefined;
  severity?: string | undefined;
  preconditions?: unknown;
  description?: unknown;
  testSteps?: TestStepProps[] | undefined;
  expectedResult?: unknown;
  testerNotes?: string | null | undefined;
  estimatedDurationMinutes?: number | null | undefined;
  artifactRequirements?: Array<{ type: string; label: string; description?: string | null; required?: boolean }> | undefined;
  tags?: string[] | undefined;
}

export async function updateLibrarySpec(deps: UpdateLibrarySpecDeps, command: UpdateLibrarySpecCommand): Promise<LibrarySpec> {
  const existing = await deps.specLibraryRepo.findById(command.id, command.orgId);
  if (!existing) {
    throw new AuthorSpecNotFoundError(command.id);
  }

  if (existing.isArchived) {
    throw new AuthorSpecArchivedError(command.id);
  }

  // Validate all fields through domain entity (reuses create validation: title length, test step limits, rich text limits, etc.)
  const createParams: CreateSpecLibraryEntryParams = {
    id: existing.id,
    orgId: existing.orgId,
    title: command.title,
    createdBy: existing.createdBy,
  };
  if (command.systemUnderTest !== undefined) createParams.systemUnderTest = command.systemUnderTest;
  if (command.severity !== undefined) createParams.severity = command.severity;
  if (command.preconditions !== undefined) createParams.preconditions = command.preconditions;
  if (command.description !== undefined) createParams.description = command.description;
  if (command.testSteps !== undefined) createParams.testSteps = command.testSteps;
  if (command.expectedResult !== undefined) createParams.expectedResult = command.expectedResult;
  if (command.testerNotes !== undefined) createParams.testerNotes = command.testerNotes;
  if (command.estimatedDurationMinutes !== undefined) createParams.estimatedDurationMinutes = command.estimatedDurationMinutes;
  if (command.artifactRequirements !== undefined) createParams.artifactRequirements = command.artifactRequirements;
  if (command.tags !== undefined) createParams.tags = command.tags;

  const entity = SpecLibraryEntryEntity.create(createParams);

  const persisted = await deps.specLibraryRepo.update(command.id, command.orgId, {
    title: entity.title.toString(),
    systemUnderTest: entity.systemUnderTest,
    severity: entity.severity.toString(),
    preconditions: entity.preconditions,
    description: entity.description,
    testSteps: entity.testSteps.map((s) => ({ instruction: s.instruction, expectedOutcome: s.expectedOutcome })),
    expectedResult: entity.expectedResult,
    artifactRequirements: entity.artifactRequirements,
    testerNotes: entity.testerNotes,
    estimatedDurationMinutes: entity.estimatedDurationMinutes,
    tags: entity.tags,
  });

  if (!persisted) {
    throw new AuthorSpecNotFoundError(command.id);
  }

  return {
    id: persisted.id,
    orgId: persisted.orgId,
    title: persisted.title,
    systemUnderTest: persisted.systemUnderTest,
    severity: persisted.severity as 'critical' | 'high' | 'medium' | 'low',
    preconditions: persisted.preconditions,
    description: persisted.description,
    testSteps: persisted.testSteps as { instruction: string; expectedOutcome?: string }[] | null,
    expectedResult: persisted.expectedResult,
    artifactRequirements: persisted.artifactRequirements as { index: number; type: 'text'; label: string; description: string | null; required: boolean }[] | null,
    testerNotes: persisted.testerNotes,
    estimatedDurationMinutes: persisted.estimatedDurationMinutes ?? null,
    tags: persisted.tags ?? [],
    isArchived: persisted.isArchived,
    createdBy: persisted.createdBy,
    createdAt: persisted.createdAt.toISOString(),
    updatedAt: persisted.updatedAt.toISOString(),
  };
}
