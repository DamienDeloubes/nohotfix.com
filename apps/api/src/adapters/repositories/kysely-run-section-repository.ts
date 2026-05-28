import type { Database } from '@nohotfix/db';
import type { RunSection, RunSectionRepository } from '@nohotfix/domain-execution';
import type { Kysely } from 'kysely';

export class KyselyRunSectionRepository implements RunSectionRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findByRun(_runId: string, _orgId: string): Promise<RunSection[]> {
    void this.db;
    // TODO: Implement with Kysely
    return [];
  }

  async create(_data: Omit<RunSection, 'id'>): Promise<RunSection> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async update(_id: string, _orgId: string, _data: Partial<RunSection>): Promise<RunSection | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }
}
