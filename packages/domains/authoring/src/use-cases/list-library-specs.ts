import { escapeSearch, type SpecListResult } from '@nohotfix/shared';

import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';

export interface ListLibrarySpecsDeps {
  specLibraryRepo: SpecLibraryRepository;
}

export interface ListLibrarySpecsQuery {
  orgId: string;
  tab: 'active' | 'archived';
  search?: string | undefined;
  severity?: string | undefined;
  sort: string;
  order: string;
  page: number;
}

const PAGE_SIZE = 25;

export async function listLibrarySpecs(deps: ListLibrarySpecsDeps, query: ListLibrarySpecsQuery): Promise<SpecListResult> {
  const offset = (query.page - 1) * PAGE_SIZE;
  const isArchived = query.tab === 'archived';
  const search = query.search?.trim() || undefined;
  const escapedSearch = search ? escapeSearch(search) : undefined;

  const { items, total } = await deps.specLibraryRepo.list({
    orgId: query.orgId,
    isArchived,
    search: escapedSearch,
    severity: query.severity,
    sort: query.sort,
    order: query.order,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / PAGE_SIZE);

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      systemUnderTest: item.systemUnderTest,
      severity: item.severity || null,
      tags: item.tags ?? [],
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
    })),
    total,
    page: query.page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}
