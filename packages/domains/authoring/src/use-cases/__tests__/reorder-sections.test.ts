import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../../ports/playbook-section-repository.js';
import { reorderSections } from '../reorder-sections.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function buildDeps(overrides: { playbookRepo?: Partial<PlaybookRepository>; playbookSectionRepo?: Partial<PlaybookSectionRepository> } = {}) {
  return {
    playbookRepo: {
      findById: vi.fn().mockResolvedValue({ id: 'pb-1', orgId: 'org-1', name: 'Test', isArchived: false, createdBy: 'user-1', createdAt: NOW, updatedAt: NOW }),
      findByOrg: vi.fn(),
      findByOrgWithCounts: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      ...overrides.playbookRepo,
    } as PlaybookRepository,
    playbookSectionRepo: {
      findByPlaybook: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      ...overrides.playbookSectionRepo,
    } as PlaybookSectionRepository,
  };
}

describe('reorderSections', () => {
  it('reorders positions correctly', async () => {
    const deps = buildDeps();
    await reorderSections(deps, { playbookId: 'pb-1', orderedIds: ['s3', 's1', 's2'], orgId: 'org-1' });

    expect(deps.playbookSectionRepo.update).toHaveBeenCalledWith('s3', 'org-1', { position: 0 });
    expect(deps.playbookSectionRepo.update).toHaveBeenCalledWith('s1', 'org-1', { position: 1 });
    expect(deps.playbookSectionRepo.update).toHaveBeenCalledWith('s2', 'org-1', { position: 2 });
  });

  it('throws AuthorPlaybookNotFoundError for missing playbook', async () => {
    const deps = buildDeps({ playbookRepo: { findById: vi.fn().mockResolvedValue(undefined) } });
    await expect(reorderSections(deps, { playbookId: 'missing', orderedIds: ['s1'], orgId: 'org-1' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });
});
