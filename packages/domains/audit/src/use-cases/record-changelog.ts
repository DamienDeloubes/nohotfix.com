import type { ChangelogRepository } from '../ports/changelog-repository.js';

export interface RecordChangelogDeps {
  changelogRepo: ChangelogRepository;
}

export interface RecordChangelogCommand {
  orgId: string;
  entityType: 'playbook' | 'spec_library';
  entityId: string;
  action: string;
  actorId: string;
  actorName: string;
  fieldChanges?: Record<string, { old: unknown; new: unknown }>;
}

export async function recordChangelog(deps: RecordChangelogDeps, command: RecordChangelogCommand): Promise<void> {
  await deps.changelogRepo.append({
    orgId: command.orgId,
    entityType: command.entityType,
    entityId: command.entityId,
    action: command.action,
    actorId: command.actorId,
    actorName: command.actorName,
    ...(command.fieldChanges != null && { fieldChanges: command.fieldChanges }),
  });
}
