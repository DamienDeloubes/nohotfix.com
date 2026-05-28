import type { PlaybookSpec } from '../types.js';

export interface PlaybookSpecRepository {
  findBySection(sectionId: string, orgId: string): Promise<PlaybookSpec[]>;
  findByPlaybook(playbookId: string, orgId: string): Promise<PlaybookSpec[]>;
  findUngrouped(playbookId: string, orgId: string): Promise<PlaybookSpec[]>;
  findByLibrarySpec(specLibraryId: string, orgId: string): Promise<PlaybookSpec[]>;
  create(data: Omit<PlaybookSpec, 'id' | 'createdAt'>): Promise<PlaybookSpec>;
  delete(id: string, orgId: string): Promise<void>;
  updatePositions(updates: Array<{ id: string; position: number }>, orgId: string): Promise<void>;
  existsInPlaybook(playbookId: string, specLibraryId: string, orgId: string): Promise<boolean>;
  deleteBySectionId(sectionId: string, orgId: string): Promise<void>;
  removeByLibrarySpecId(specLibraryId: string, orgId: string): Promise<number>;
  findPlaybooksReferencingSpec(specLibraryId: string, orgId: string): Promise<{ id: string; name: string; isArchived: boolean }[]>;
}
