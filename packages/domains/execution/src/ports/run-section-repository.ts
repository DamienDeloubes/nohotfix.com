import type { RunSection } from '../types.js';

export interface RunSectionRepository {
  findByRun(runId: string, orgId: string): Promise<RunSection[]>;
  create(data: Omit<RunSection, 'id'>): Promise<RunSection>;
  update(id: string, orgId: string, data: Partial<RunSection>): Promise<RunSection | undefined>;
}
