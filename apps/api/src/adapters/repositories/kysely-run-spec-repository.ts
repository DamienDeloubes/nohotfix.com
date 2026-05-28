import type { Database } from '@nohotfix/db';
import type { RunSpec, RunSpecRepository } from '@nohotfix/domain-execution';
import type { Kysely } from 'kysely';

export class KyselyRunSpecRepository implements RunSpecRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByRun(_runId: string, _orgId: string): Promise<RunSpec[]> {
    void this.db;
    // TODO: Implement with Kysely
    return [];
  }

  async findBySection(_sectionId: string, _orgId: string): Promise<RunSpec[]> {
    void this.db;
    // TODO: Implement with Kysely
    return [];
  }

  async findById(_id: string, _orgId: string): Promise<RunSpec | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async create(_data: Omit<RunSpec, 'id'>): Promise<RunSpec> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async updateStatus(_id: string, _orgId: string, _status: string, _data?: Partial<RunSpec>): Promise<RunSpec | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }

  async countByStatus(_runId: string, _orgId: string): Promise<Record<string, number>> {
    void this.db;
    // TODO: Implement with Kysely
    return {};
  }
}
