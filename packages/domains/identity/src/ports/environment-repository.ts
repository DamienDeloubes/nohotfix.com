import type { EnvironmentEntity } from '../entities/environment.js';

export interface EnvironmentRepository {
  findByOrg(orgId: string): Promise<EnvironmentEntity[]>;
  findById(id: string, orgId: string): Promise<EnvironmentEntity | undefined>;
  create(data: { orgId: string; name: string; position: number }): Promise<EnvironmentEntity>;
  update(id: string, orgId: string, data: { name?: string; position?: number }): Promise<EnvironmentEntity | undefined>;
  delete(id: string, orgId: string): Promise<boolean>;
  countPlaybooksByEnvironmentId(environmentId: string, orgId: string): Promise<number>;
  getMaxPosition(orgId: string): Promise<number>;
}
