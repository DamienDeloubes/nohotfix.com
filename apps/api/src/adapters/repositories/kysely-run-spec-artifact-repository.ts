import type { Database } from '@nohotfix/db';
import type { RunSpecArtifact, RunSpecArtifactRepository } from '@nohotfix/domain-execution';
import type { Kysely } from 'kysely';

export class KyselyRunSpecArtifactRepository implements RunSpecArtifactRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findBySpec(_specId: string, _orgId: string): Promise<RunSpecArtifact[]> {
    void this.db;
    // TODO: Implement with Kysely
    return [];
  }

  async create(_data: Omit<RunSpecArtifact, 'id' | 'createdAt'>): Promise<RunSpecArtifact> {
    void this.db;
    // TODO: Implement with Kysely
    throw new Error('Not implemented');
  }

  async update(_id: string, _orgId: string, _data: Partial<RunSpecArtifact>): Promise<RunSpecArtifact | undefined> {
    void this.db;
    // TODO: Implement with Kysely
    return undefined;
  }
}
