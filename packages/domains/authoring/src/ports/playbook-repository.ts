import type { Playbook, PlaybookDetail, PlaybookWithCounts } from '../types.js';

export interface PlaybookRepository {
  findById(id: string, orgId: string): Promise<Playbook | undefined>;
  findByOrg(orgId: string, includeArchived?: boolean): Promise<Playbook[]>;
  findByOrgWithCounts(orgId: string, isArchived?: boolean): Promise<PlaybookWithCounts[]>;
  create(data: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playbook>;
  update(id: string, orgId: string, data: Partial<Pick<Playbook, 'name' | 'description' | 'isArchived'>> & { environmentId?: string | null }): Promise<Playbook | undefined>;
  countActiveRuns(playbookId: string, orgId: string): Promise<number>;
  findDetail(playbookId: string, orgId: string): Promise<PlaybookDetail | undefined>;
}
