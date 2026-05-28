import type { SpecLibraryEntry, SpecListItemEntry } from '../types.js';

export interface ListSpecsParams {
  orgId: string;
  isArchived: boolean;
  search?: string | undefined;
  severity?: string | undefined;
  sort: string;
  order: string;
  limit: number;
  offset: number;
}

export interface ListSpecsResult {
  items: SpecListItemEntry[];
  total: number;
}

export interface SpecLibraryRepository {
  findById(id: string, orgId: string): Promise<SpecLibraryEntry | undefined>;
  findByIds(ids: string[], orgId: string): Promise<SpecLibraryEntry[]>;
  findByOrg(orgId: string, includeArchived?: boolean): Promise<SpecLibraryEntry[]>;
  create(data: Omit<SpecLibraryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<SpecLibraryEntry>;
  update(id: string, orgId: string, data: Partial<SpecLibraryEntry>): Promise<SpecLibraryEntry | undefined>;
  findDistinctSystemsUnderTest(orgId: string): Promise<string[]>;
  findDistinctTags(orgId: string): Promise<string[]>;
  list(params: ListSpecsParams): Promise<ListSpecsResult>;
  setArchived(id: string, orgId: string, isArchived: boolean): Promise<SpecLibraryEntry | undefined>;
}
