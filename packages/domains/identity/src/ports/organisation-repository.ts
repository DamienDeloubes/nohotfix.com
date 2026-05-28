import type { OrganisationEntity } from '../entities/organisation.js';

export interface OrganisationRepository {
  findById(id: string): Promise<OrganisationEntity | undefined>;
  findBySlug(slug: string): Promise<OrganisationEntity | undefined>;
  findByUserId(userId: string): Promise<OrganisationEntity[]>;
  create(data: { name: string; slug: string }): Promise<OrganisationEntity>;
  update(id: string, data: { name?: string }): Promise<OrganisationEntity | undefined>;
  slugExists(slug: string): Promise<boolean>;
}
