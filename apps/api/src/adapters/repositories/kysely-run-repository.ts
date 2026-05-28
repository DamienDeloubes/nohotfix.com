import type { Database } from '@nohotfix/db';
import type { Run, RunRepository } from '@nohotfix/domain-execution';
import type { Kysely } from 'kysely';

export class KyselyRunRepository implements RunRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(_id: string, _orgId: string): Promise<Run | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async findByOrg(_orgId: string, _statuses?: string[]): Promise<Run[]> {
    void this.db;
    // TODO: Implement with Kysely
    return [];
  }

  async create(_data: Omit<Run, 'id' | 'createdAt'>): Promise<Run> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async updateStatus(_id: string, _orgId: string, _status: string): Promise<Run | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async recordDecision(
    _id: string,
    _orgId: string,
    _data: {
      status: 'go' | 'no_go';
      decisionBy: string;
      decisionAt: Date;
      decisionStatement?: string;
      failedSpecsAtDecision?: unknown;
    },
  ): Promise<Run | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }
}
