import type { RunSpec } from '../types.js';

export interface RunSpecRepository {
  findByRun(runId: string, orgId: string): Promise<RunSpec[]>;
  findBySection(sectionId: string, orgId: string): Promise<RunSpec[]>;
  findById(id: string, orgId: string): Promise<RunSpec | undefined>;
  create(data: Omit<RunSpec, 'id'>): Promise<RunSpec>;
  updateStatus(id: string, orgId: string, status: string, data?: Partial<RunSpec>): Promise<RunSpec | undefined>;
  countByStatus(runId: string, orgId: string): Promise<Record<string, number>>;
}
