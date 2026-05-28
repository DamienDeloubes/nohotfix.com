export class SnapshotService {
  async deepCopy(_data: { playbookId: string; orgId: string; runId: string }): Promise<void> {
    // TODO: Deep-copy playbook structure into run tables in a single transaction
  }
}
