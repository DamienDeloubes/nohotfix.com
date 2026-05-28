import type { PlaybookSection } from '../types.js';

export interface PlaybookSectionRepository {
  findByPlaybook(playbookId: string, orgId: string): Promise<PlaybookSection[]>;
  create(data: Omit<PlaybookSection, 'id' | 'createdAt'>): Promise<PlaybookSection>;
  update(id: string, orgId: string, data: Partial<Pick<PlaybookSection, 'name' | 'position'>>): Promise<PlaybookSection | undefined>;
  delete(id: string, orgId: string): Promise<void>;
}
