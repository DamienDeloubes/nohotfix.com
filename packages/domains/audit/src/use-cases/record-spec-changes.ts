import type { SpecHistoryAction } from '@releasepilot/shared';

import type { ChangelogRepository } from '../ports/changelog-repository.js';

export interface RecordSpecChangesDeps {
  changelogRepo: ChangelogRepository;
}

export interface SpecSnapshot {
  title: string;
  description: unknown;
  tags: string[];
  estimatedDurationMinutes: number | null;
  artifactRequirements: Array<{ label: string; [key: string]: unknown }> | null;
  systemUnderTest: string | null;
  severity: string | null;
  preconditions: unknown;
  testSteps: unknown;
  expectedResult: unknown;
  testerNotes: string | null;
}

export interface RecordSpecChangesCommand {
  orgId: string;
  specId: string;
  actorId: string;
  actorName: string;
  oldSpec: SpecSnapshot;
  newSpec: SpecSnapshot;
}

interface ChangeEntry {
  action: SpecHistoryAction;
  fieldChanges?: Record<string, { old: unknown; new: unknown }>;
}

function detectFieldChanges(oldSpec: SpecSnapshot, newSpec: SpecSnapshot): ChangeEntry[] {
  const entries: ChangeEntry[] = [];

  if (oldSpec.title !== newSpec.title) {
    entries.push({
      action: 'title_changed',
      fieldChanges: { title: { old: oldSpec.title, new: newSpec.title } },
    });
  }

  if (JSON.stringify(oldSpec.description) !== JSON.stringify(newSpec.description)) {
    entries.push({ action: 'description_updated' });
  }

  const oldTags = [...(oldSpec.tags ?? [])].sort();
  const newTags = [...(newSpec.tags ?? [])].sort();
  if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
    entries.push({
      action: 'tags_changed',
      fieldChanges: { tags: { old: oldSpec.tags, new: newSpec.tags } },
    });
  }

  if (oldSpec.estimatedDurationMinutes !== newSpec.estimatedDurationMinutes) {
    entries.push({
      action: 'duration_changed',
      fieldChanges: {
        estimated_duration_minutes: {
          old: oldSpec.estimatedDurationMinutes,
          new: newSpec.estimatedDurationMinutes,
        },
      },
    });
  }

  if ((oldSpec.systemUnderTest ?? null) !== (newSpec.systemUnderTest ?? null)) {
    entries.push({
      action: 'system_under_test_changed',
      fieldChanges: {
        system_under_test: {
          old: oldSpec.systemUnderTest,
          new: newSpec.systemUnderTest,
        },
      },
    });
  }

  if ((oldSpec.severity ?? null) !== (newSpec.severity ?? null)) {
    entries.push({
      action: 'severity_changed',
      fieldChanges: {
        severity: {
          old: oldSpec.severity,
          new: newSpec.severity,
        },
      },
    });
  }

  if (JSON.stringify(oldSpec.preconditions) !== JSON.stringify(newSpec.preconditions)) {
    entries.push({ action: 'preconditions_updated' });
  }

  if (JSON.stringify(oldSpec.testSteps) !== JSON.stringify(newSpec.testSteps)) {
    entries.push({ action: 'test_steps_updated' });
  }

  if (JSON.stringify(oldSpec.expectedResult) !== JSON.stringify(newSpec.expectedResult)) {
    entries.push({ action: 'expected_result_updated' });
  }

  if ((oldSpec.testerNotes ?? null) !== (newSpec.testerNotes ?? null)) {
    entries.push({ action: 'tester_notes_updated' });
  }

  return entries;
}

function detectArtifactChanges(oldSpec: SpecSnapshot, newSpec: SpecSnapshot): ChangeEntry[] {
  const entries: ChangeEntry[] = [];
  const oldArtifacts = oldSpec.artifactRequirements ?? [];
  const newArtifacts = newSpec.artifactRequirements ?? [];

  const oldByLabel = new Map(oldArtifacts.map((a) => [a.label, a]));
  const newByLabel = new Map(newArtifacts.map((a) => [a.label, a]));

  for (const [label, newArt] of newByLabel) {
    const oldArt = oldByLabel.get(label);
    if (!oldArt) {
      entries.push({
        action: 'artifact_added',
        fieldChanges: { artifact: { old: null, new: newArt } },
      });
    } else if (JSON.stringify(oldArt) !== JSON.stringify(newArt)) {
      entries.push({
        action: 'artifact_modified',
        fieldChanges: { artifact: { old: oldArt, new: newArt } },
      });
    }
  }

  for (const [label, oldArt] of oldByLabel) {
    if (!newByLabel.has(label)) {
      entries.push({
        action: 'artifact_removed',
        fieldChanges: { artifact: { old: oldArt, new: null } },
      });
    }
  }

  return entries;
}

export async function recordSpecChanges(deps: RecordSpecChangesDeps, command: RecordSpecChangesCommand): Promise<void> {
  const fieldChanges = detectFieldChanges(command.oldSpec, command.newSpec);
  const artifactChanges = detectArtifactChanges(command.oldSpec, command.newSpec);
  const allChanges = [...fieldChanges, ...artifactChanges];

  for (const change of allChanges) {
    await deps.changelogRepo.append({
      orgId: command.orgId,
      entityType: 'spec_library',
      entityId: command.specId,
      action: change.action,
      actorId: command.actorId,
      actorName: command.actorName,
      ...(change.fieldChanges != null && { fieldChanges: change.fieldChanges }),
    });
  }
}
