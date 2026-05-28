import type { LibrarySpec } from '@nohotfix/shared';

import { SpecLibraryEntryEntity, type CreateSpecLibraryEntryParams } from '../entities/spec-library-entry.js';
import type { TestStepProps } from '../entities/value-objects/test-step.js';
import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';

export interface CreateLibrarySpecDeps {
  specLibraryRepo: SpecLibraryRepository;
}

export interface CreateLibrarySpecCommand {
  id: string;
  orgId: string;
  createdBy: string;
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

export async function createLibrarySpec(deps: CreateLibrarySpecDeps, command: CreateLibrarySpecCommand): Promise<LibrarySpec> {
  const createParams: CreateSpecLibraryEntryParams = {
    id: command.id,
    orgId: command.orgId,
    title: command.title,
    createdBy: command.createdBy,
  };
  if (command.systemUnderTest != null) createParams.systemUnderTest = command.systemUnderTest;
  if (command.severity != null) createParams.severity = command.severity;
  if (command.preconditions !== undefined) createParams.preconditions = command.preconditions;
  if (command.description !== undefined) createParams.description = command.description;
  if (command.testSteps !== undefined) createParams.testSteps = command.testSteps;
  if (command.expectedResult !== undefined) createParams.expectedResult = command.expectedResult;
  if (command.testerNotes != null) createParams.testerNotes = command.testerNotes;
  if (command.estimatedDurationMinutes != null) createParams.estimatedDurationMinutes = command.estimatedDurationMinutes;
  if (command.artifactRequirements !== undefined) createParams.artifactRequirements = command.artifactRequirements;
  if (command.tags !== undefined) createParams.tags = command.tags;

  const entity = SpecLibraryEntryEntity.create(createParams);

  const persisted = await deps.specLibraryRepo.create({
    orgId: entity.orgId,
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
    isArchived: false,
    createdBy: entity.createdBy,
  });

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
