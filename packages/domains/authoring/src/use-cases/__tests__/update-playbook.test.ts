import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNameInvalidError, AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import { updatePlaybook } from '../update-playbook.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function buildMockRepo(overrides: Partial<PlaybookRepository> = {}): PlaybookRepository {
  return {
    findById: vi.fn(),
    findByOrg: vi.fn(),
    findByOrgWithCounts: vi.fn(),
    create: vi.fn(),
    update: vi.fn().mockImplementation(async (_id, _orgId, data) => ({
      id: 'pb-1',
      orgId: 'org-1',
      name: data.name ?? 'Original',
      isArchived: false,
      createdBy: 'user-1',
      createdAt: NOW,
      updatedAt: new Date(),
    })),
    ...overrides,
  };
}

describe('updatePlaybook', () => {
  it('updates name and description', async () => {
    const repo = buildMockRepo();
    const result = await updatePlaybook({ playbookRepo: repo }, { id: 'pb-1', orgId: 'org-1', name: 'Updated' });

    expect(repo.update).toHaveBeenCalledWith('pb-1', 'org-1', expect.objectContaining({ name: 'Updated' }));
    expect(result.name).toBe('Updated');
  });

  it('throws AuthorPlaybookNotFoundError for missing playbook', async () => {
    const repo = buildMockRepo({ update: vi.fn().mockResolvedValue(undefined) });
    await expect(updatePlaybook({ playbookRepo: repo }, { id: 'missing', orgId: 'org-1', name: 'X' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });

  it('throws AuthorPlaybookNameInvalidError for empty name', async () => {
    const repo = buildMockRepo();
    await expect(updatePlaybook({ playbookRepo: repo }, { id: 'pb-1', orgId: 'org-1', name: '' })).rejects.toThrow(AuthorPlaybookNameInvalidError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('throws AuthorPlaybookNameInvalidError for name exceeding 255 chars', async () => {
    const repo = buildMockRepo();
    await expect(updatePlaybook({ playbookRepo: repo }, { id: 'pb-1', orgId: 'org-1', name: 'a'.repeat(256) })).rejects.toThrow(AuthorPlaybookNameInvalidError);
  });
});
