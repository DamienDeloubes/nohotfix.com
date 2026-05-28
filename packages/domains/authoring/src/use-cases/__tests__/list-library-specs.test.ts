import { describe, expect, it, vi } from 'vitest';

import type { SpecListItemEntry } from '../../types.js';
import { listLibrarySpecs } from '../list-library-specs.js';

function fakeEntry(overrides: Partial<SpecListItemEntry> = {}): SpecListItemEntry {
  return {
    id: 'spec-1',
    title: 'Smoke test',
    systemUnderTest: null,
    severity: 'medium',
    tags: ['smoke'],
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    ...overrides,
  };
}

function mockRepo(items: SpecListItemEntry[] = [], total = items.length) {
  return {
    findById: vi.fn(),
    findByOrg: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findDistinctSystemsUnderTest: vi.fn(),
    findDistinctTags: vi.fn(),
    list: vi.fn().mockResolvedValue({ items, total }),
  };
}

describe('listLibrarySpecs', () => {
  it('computes offset 0 for page 1', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ offset: 0 }));
  });

  it('computes offset 50 for page 3', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 3 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ offset: 50 }));
  });

  it('escapes % in search', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', search: '100%', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ search: '100\\%' }));
  });

  it('escapes _ in search', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', search: 'test_case', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ search: 'test\\_case' }));
  });

  it('escapes \\ in search', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', search: 'path\\file', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ search: 'path\\\\file' }));
  });

  it('maps active tab to isArchived=false', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ isArchived: false }));
  });

  it('maps archived tab to isArchived=true', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'archived', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ isArchived: true }));
  });

  it('returns totalPages=0 for 0 items', async () => {
    const repo = mockRepo([], 0);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(result.totalPages).toBe(0);
  });

  it('returns totalPages=1 for 25 items', async () => {
    const repo = mockRepo([], 25);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(result.totalPages).toBe(1);
  });

  it('returns totalPages=2 for 26 items', async () => {
    const repo = mockRepo([], 26);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(result.totalPages).toBe(2);
  });

  it('returns totalPages=2 for 50 items', async () => {
    const repo = mockRepo([], 50);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(result.totalPages).toBe(2);
  });

  it('returns totalPages=3 for 51 items', async () => {
    const repo = mockRepo([], 51);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });
    expect(result.totalPages).toBe(3);
  });

  it('treats empty search string as undefined', async () => {
    const repo = mockRepo();
    await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', search: '  ', sort: 'updated', order: 'desc', page: 1 });
    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ search: undefined }));
  });

  it('maps DTO with ISO date strings and preserves null systemUnderTest', async () => {
    const entry = fakeEntry({ systemUnderTest: null });
    const repo = mockRepo([entry], 1);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 1 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].systemUnderTest).toBeNull();
    expect(result.items[0].updatedAt).toBe('2026-03-10T12:00:00.000Z');
    expect(result.items[0].tags).toEqual(['smoke']);
  });

  it('returns correct page and pageSize in result', async () => {
    const repo = mockRepo([], 100);
    const result = await listLibrarySpecs({ specLibraryRepo: repo }, { orgId: 'org-1', tab: 'active', sort: 'updated', order: 'desc', page: 3 });

    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(25);
    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(4);
  });
});
