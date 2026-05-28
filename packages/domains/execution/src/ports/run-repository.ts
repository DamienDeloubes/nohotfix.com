import type { Run } from '../types.js';

export interface RunRepository {
  findById(id: string, orgId: string): Promise<Run | undefined>;
  findByOrg(orgId: string, statuses?: string[]): Promise<Run[]>;
  create(data: Omit<Run, 'id' | 'createdAt'>): Promise<Run>;
  updateStatus(id: string, orgId: string, status: string): Promise<Run | undefined>;
  recordDecision(
    id: string,
    orgId: string,
    data: {
      status: 'go' | 'no_go';
      decisionBy: string;
      decisionAt: Date;
      decisionStatement?: string;
      failedSpecsAtDecision?: unknown;
    },
  ): Promise<Run | undefined>;
}
