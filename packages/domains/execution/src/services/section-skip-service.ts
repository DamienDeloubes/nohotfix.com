export class SectionSkipService {
  async skipSection(_data: { sectionId: string; runId: string; orgId: string; reason: string; skippedBy: string }): Promise<void> {
    // TODO: Mark all specs in section as skipped atomically
  }
}
