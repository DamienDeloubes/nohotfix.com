import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import { reorderSpecs } from '../reorder-specs.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function buildDeps(overrides: { playbookRepo?: Partial<PlaybookRepository>; playbookSpecRepo?: Partial<PlaybookSpecRepository> } = {}) {
  return {
    playbookRepo: {
      findById: vi.fn().mockResolvedValue({ id: 'pb-1', orgId: 'org-1', name: 'Test', isArchived: false, createdBy: 'user-1', createdAt: NOW, updatedAt: NOW }),
      findByOrg: vi.fn(),
      findByOrgWithCounts: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      ...overrides.playbookRepo,
    } as PlaybookRepository,
    playbookSpecRepo: {
      findBySection: vi.fn(),
      findByPlaybook: vi.fn(),
      findUngrouped: vi.fn(),
      findByLibrarySpec: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      updatePositions: vi.fn().mockResolvedValue(undefined),
      existsInPlaybook: vi.fn(),
      deleteBySectionId: vi.fn(),
      ...overrides.playbookSpecRepo,
    } as PlaybookSpecRepository,
  };
}

describe('reorderSpecs', () => {
  it('reorders positions correctly (0,1,2...)', async () => {
    const deps = buildDeps();
    await reorderSpecs(deps, { playbookId: 'pb-1', orderedIds: ['s3', 's1', 's2'], orgId: 'org-1' });

    expect(deps.playbookSpecRepo.updatePositions).toHaveBeenCalledWith(
      [
        { id: 's3', position: 0 },
        { id: 's1', position: 1 },
        { id: 's2', position: 2 },
      ],
      'org-1',
    );
  });

  it('throws AuthorPlaybookNotFoundError for missing playbook', async () => {
    const deps = buildDeps({ playbookRepo: { findById: vi.fn().mockResolvedValue(undefined) } });
    await expect(reorderSpecs(deps, { playbookId: 'missing', orderedIds: ['s1'], orgId: 'org-1' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });
});
