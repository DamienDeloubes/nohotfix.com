import { describe, expect, it, vi } from 'vitest';

import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import { removeSpecFromSection } from '../remove-spec-from-section.js';

function buildMockRepo(overrides: Partial<PlaybookSpecRepository> = {}): PlaybookSpecRepository {
  return {
    findBySection: vi.fn(),
    findByPlaybook: vi.fn(),
    findUngrouped: vi.fn(),
    findByLibrarySpec: vi.fn(),
    create: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined),
    updatePositions: vi.fn(),
    existsInPlaybook: vi.fn(),
    deleteBySectionId: vi.fn(),
    ...overrides,
  };
}

describe('removeSpecFromSection', () => {
  it('removes spec successfully', async () => {
    const repo = buildMockRepo();
    await removeSpecFromSection({ playbookSpecRepo: repo }, { specId: 'pbs-1', orgId: 'org-1' });

    expect(repo.delete).toHaveBeenCalledWith('pbs-1', 'org-1');
  });

  it('handles non-existent spec gracefully', async () => {
    const repo = buildMockRepo();
    await expect(removeSpecFromSection({ playbookSpecRepo: repo }, { specId: 'nonexistent', orgId: 'org-1' })).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('nonexistent', 'org-1');
  });
});
