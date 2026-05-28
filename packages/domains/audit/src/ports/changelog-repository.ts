import type { ChangelogEntry, PlaybookChangelogEntry, SpecChangelogEntry } from '../types.js';

export interface ChangelogRepository {
  findByEntity(orgId: string, entityType: 'playbook' | 'spec_library', entityId: string, pagination: { limit: number; offset: number }): Promise<ChangelogEntry[]>;
  findBySpecWithMembership(orgId: string, specId: string): Promise<SpecChangelogEntry[]>;
  findByPlaybookWithMembership(orgId: string, playbookId: string): Promise<PlaybookChangelogEntry[]>;
  append(data: Omit<ChangelogEntry, 'id' | 'createdAt'>): Promise<ChangelogEntry>;
}
