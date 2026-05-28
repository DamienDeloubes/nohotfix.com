export class ArtifactGateService {
  async evaluate(_runSpecId: string, _orgId: string): Promise<boolean> {
    // TODO: Check all artifact requirements are satisfied
    return true;
  }
}
