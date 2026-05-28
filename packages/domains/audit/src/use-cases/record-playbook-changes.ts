import type { PlaybookHistoryAction } from '@releasepilot/shared';

import type { ChangelogRepository } from '../ports/changelog-repository.js';

export interface PlaybookSnapshot {
  name: string;
  description: string | null;
  environmentId: string | null;
  environmentName: string | null;
}

export interface RecordPlaybookChangesDeps {
  changelogRepo: ChangelogRepository;
}

export interface RecordPlaybookChangesCommand {
  orgId: string;
  playbookId: string;
  actorId: string;
  actorName: string;
  oldPlaybook: PlaybookSnapshot;
  newPlaybook: PlaybookSnapshot;
}

interface ChangeEntry {
  action: PlaybookHistoryAction;
  fieldChanges?: Record<string, unknown>;
}

function detectChanges(oldPlaybook: PlaybookSnapshot, newPlaybook: PlaybookSnapshot): ChangeEntry[] {
  const entries: ChangeEntry[] = [];

  if (oldPlaybook.name !== newPlaybook.name) {
    entries.push({
      action: 'name_changed',
      fieldChanges: { old: oldPlaybook.name, new: newPlaybook.name },
    });
  }

  if ((oldPlaybook.description ?? null) !== (newPlaybook.description ?? null)) {
    entries.push({
      action: 'description_updated',
      fieldChanges: { old: oldPlaybook.description, new: newPlaybook.description },
    });
  }

  if ((oldPlaybook.environmentId ?? null) !== (newPlaybook.environmentId ?? null)) {
    entries.push({
      action: 'environment_changed',
      fieldChanges: {
        oldId: oldPlaybook.environmentId,
        oldName: oldPlaybook.environmentName,
        newId: newPlaybook.environmentId,
        newName: newPlaybook.environmentName,
      },
    });
  }

  return entries;
}

export async function recordPlaybookChanges(deps: RecordPlaybookChangesDeps, command: RecordPlaybookChangesCommand): Promise<void> {
  const changes = detectChanges(command.oldPlaybook, command.newPlaybook);

  for (const change of changes) {
    await deps.changelogRepo.append({
      orgId: command.orgId,
      entityType: 'playbook',
      entityId: command.playbookId,
      action: change.action,
      actorId: command.actorId,
      actorName: command.actorName,
      ...(change.fieldChanges != null && { fieldChanges: change.fieldChanges as Record<string, { old: unknown; new: unknown }> }),
    });
  }
}
