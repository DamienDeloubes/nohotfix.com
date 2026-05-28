export class ChangelogService {
  async append(_data: {
    orgId: string;
    entityType: 'playbook' | 'spec_library';
    entityId: string;
    action: string;
    fieldChanges?: Record<string, { old: unknown; new: unknown }>;
    actorId: string;
    actorName: string;
  }): Promise<void> {
    // TODO: Append changelog entry on every write to playbook templates / library specs
  }
}
