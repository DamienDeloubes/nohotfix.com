export class SpecSyncService {
  async syncToLibrary(_data: { specLibraryId: string; orgId: string }): Promise<void> {
    // TODO: Update library entry, propagate changes to all linked PlaybookSpec records
  }

  async keepSpecLocal(_data: { playbookSpecId: string; orgId: string }): Promise<void> {
    // TODO: Set spec_library_id = NULL, copy content inline
  }
}
