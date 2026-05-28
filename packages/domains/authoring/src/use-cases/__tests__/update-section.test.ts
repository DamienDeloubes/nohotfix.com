import { describe, expect, it, vi } from 'vitest';

import { AuthorSectionNotFoundError } from '../../errors/index.js';
import type { PlaybookSectionRepository } from '../../ports/playbook-section-repository.js';
import { updateSection } from '../update-section.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function buildMockRepo(overrides: Partial<PlaybookSectionRepository> = {}): PlaybookSectionRepository {
  return {
    findByPlaybook: vi.fn(),
    create: vi.fn(),
    update: vi
      .fn()
      .mockImplementation(async (_id, _orgId, data) => ({ id: 'sec-1', playbookId: 'pb-1', orgId: 'org-1', name: data.name ?? 'Original', position: 0, createdAt: NOW })),
    delete: vi.fn(),
    ...overrides,
  };
}

describe('updateSection', () => {
  it('renames section', async () => {
    const repo = buildMockRepo();
    const result = await updateSection({ playbookSectionRepo: repo }, { sectionId: 'sec-1', orgId: 'org-1', name: 'Renamed' });

    expect(repo.update).toHaveBeenCalledWith('sec-1', 'org-1', { name: 'Renamed' });
    expect(result.name).toBe('Renamed');
  });

  it('throws AuthorSectionNotFoundError for missing section', async () => {
    const repo = buildMockRepo({ update: vi.fn().mockResolvedValue(undefined) });
    await expect(updateSection({ playbookSectionRepo: repo }, { sectionId: 'missing', orgId: 'org-1', name: 'New' })).rejects.toThrow(AuthorSectionNotFoundError);
  });
});
