import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { PlaybookDetail } from '../../types.js';
import { getPlaybookDetail } from '../get-playbook-detail.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function fakePlaybookDetail(overrides: Partial<PlaybookDetail> = {}): PlaybookDetail {
  return {
    playbook: { id: 'pb-1', orgId: 'org-1', name: 'Release v2', isArchived: false, createdBy: 'user-1', createdAt: NOW, updatedAt: NOW },
    sections: [
      {
        id: 'sec-1',
        name: 'Backend',
        position: 0,
        specs: [{ id: 'pbs-1', specLibraryId: 'lib-1', position: 0, title: 'Login test', severity: 'high', systemUnderTest: 'Auth' }],
      },
    ],
    ungroupedSpecs: [],
    ...overrides,
  };
}

function buildMockPlaybookRepo(overrides: Partial<PlaybookRepository> = {}): PlaybookRepository {
  return {
    findById: vi.fn(),
    findByOrg: vi.fn(),
    findByOrgWithCounts: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    countActiveRuns: vi.fn().mockResolvedValue(0),
    findDetail: vi.fn().mockResolvedValue(fakePlaybookDetail()),
    ...overrides,
  };
}

describe('getPlaybookDetail', () => {
  it('returns the playbook detail from the repository', async () => {
    const playbookRepo = buildMockPlaybookRepo();
    const result = await getPlaybookDetail({ playbookRepo }, { playbookId: 'pb-1', orgId: 'org-1' });

    expect(result.playbook.id).toBe('pb-1');
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]!.specs[0]!.title).toBe('Login test');
    expect(result.ungroupedSpecs).toHaveLength(0);
    expect(playbookRepo.findDetail).toHaveBeenCalledWith('pb-1', 'org-1');
  });

  it('throws AuthorPlaybookNotFoundError when playbook is not found', async () => {
    const playbookRepo = buildMockPlaybookRepo({ findDetail: vi.fn().mockResolvedValue(undefined) });
    await expect(getPlaybookDetail({ playbookRepo }, { playbookId: 'missing', orgId: 'org-1' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });
});
