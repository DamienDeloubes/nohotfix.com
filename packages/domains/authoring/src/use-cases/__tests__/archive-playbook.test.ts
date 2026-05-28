import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { Playbook } from '../../types.js';
import { archivePlaybook } from '../archive-playbook.js';

const NOW = new Date('2026-03-12T12:00:00Z');
const LATER = new Date('2026-03-12T12:01:00Z');

function fakePlaybook(overrides: Partial<Playbook> = {}): Playbook {
  return {
    id: 'pb-1',
    orgId: 'org-1',
    name: 'Release Playbook v3',
    description: 'Test playbook',
    isArchived: false,
    createdBy: 'user-1',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildMockPlaybookRepo(overrides: Partial<PlaybookRepository> = {}): PlaybookRepository {
  return {
    findById: vi.fn().mockResolvedValue(fakePlaybook()),
    findByOrg: vi.fn(),
    findByOrgWithCounts: vi.fn(),
    create: vi.fn(),
    countActiveRuns: vi.fn().mockResolvedValue(0),
    findDetail: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockImplementation(async (_id, _orgId, data) => ({
      ...fakePlaybook(),
      ...data,
      updatedAt: LATER,
    })),
    ...overrides,
  };
}

describe('archivePlaybook', () => {
  it('archives an active playbook and returns wasChanged: true', async () => {
    const playbookRepo = buildMockPlaybookRepo();

    const result = await archivePlaybook({ playbookRepo }, { playbookId: 'pb-1', orgId: 'org-1', isArchived: true });

    expect(result.wasChanged).toBe(true);
    expect(result.playbook.isArchived).toBe(true);
    expect(playbookRepo.update).toHaveBeenCalledWith('pb-1', 'org-1', { isArchived: true });
  });

  it('returns wasChanged: false when archiving an already-archived playbook (idempotency)', async () => {
    const playbookRepo = buildMockPlaybookRepo({
      findById: vi.fn().mockResolvedValue(fakePlaybook({ isArchived: true })),
    });

    const result = await archivePlaybook({ playbookRepo }, { playbookId: 'pb-1', orgId: 'org-1', isArchived: true });

    expect(result.wasChanged).toBe(false);
    expect(result.playbook.isArchived).toBe(true);
    expect(playbookRepo.update).not.toHaveBeenCalled();
  });

  it('unarchives an archived playbook and returns wasChanged: true', async () => {
    const playbookRepo = buildMockPlaybookRepo({
      findById: vi.fn().mockResolvedValue(fakePlaybook({ isArchived: true })),
      update: vi.fn().mockResolvedValue(fakePlaybook({ isArchived: false, updatedAt: LATER })),
    });

    const result = await archivePlaybook({ playbookRepo }, { playbookId: 'pb-1', orgId: 'org-1', isArchived: false });

    expect(result.wasChanged).toBe(true);
    expect(result.playbook.isArchived).toBe(false);
    expect(playbookRepo.update).toHaveBeenCalledWith('pb-1', 'org-1', { isArchived: false });
  });

  it('returns wasChanged: false when unarchiving an already-active playbook (idempotency)', async () => {
    const playbookRepo = buildMockPlaybookRepo();

    const result = await archivePlaybook({ playbookRepo }, { playbookId: 'pb-1', orgId: 'org-1', isArchived: false });

    expect(result.wasChanged).toBe(false);
    expect(result.playbook.isArchived).toBe(false);
    expect(playbookRepo.update).not.toHaveBeenCalled();
  });

  it('throws AuthorPlaybookNotFoundError when playbook does not exist', async () => {
    const playbookRepo = buildMockPlaybookRepo({
      findById: vi.fn().mockResolvedValue(undefined),
    });

    await expect(archivePlaybook({ playbookRepo }, { playbookId: 'nonexistent', orgId: 'org-1', isArchived: true })).rejects.toThrow(AuthorPlaybookNotFoundError);

    expect(playbookRepo.update).not.toHaveBeenCalled();
  });
});
