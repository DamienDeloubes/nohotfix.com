import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNameInvalidError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import { createPlaybook } from '../create-playbook.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function fakePlaybook(overrides: Record<string, unknown> = {}) {
  return {
    id: 'pb-1',
    orgId: 'org-1',
    name: 'Sprint Release',
    isArchived: false,
    createdBy: 'user-1',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildMockRepo(overrides: Partial<PlaybookRepository> = {}): PlaybookRepository {
  return {
    findById: vi.fn(),
    findByOrg: vi.fn(),
    findByOrgWithCounts: vi.fn(),
    create: vi.fn().mockImplementation(async (data) => fakePlaybook({ name: data.name, description: data.description, environmentId: data.environmentId })),
    update: vi.fn(),
    ...overrides,
  };
}

describe('createPlaybook', () => {
  it('creates a playbook with valid inputs', async () => {
    const repo = buildMockRepo();
    const result = await createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: 'Sprint Release', createdBy: 'user-1' });

    expect(repo.create).toHaveBeenCalledWith({
      orgId: 'org-1',
      name: 'Sprint Release',
      isArchived: false,
      createdBy: 'user-1',
    });
    expect(result.name).toBe('Sprint Release');
  });

  it('trims whitespace from the name', async () => {
    const repo = buildMockRepo();
    await createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: '  Sprint Release  ', createdBy: 'user-1' });

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Sprint Release' }));
  });

  it('throws AuthorPlaybookNameInvalidError for empty name', async () => {
    const repo = buildMockRepo();
    await expect(createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: '', createdBy: 'user-1' })).rejects.toThrow(AuthorPlaybookNameInvalidError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('throws AuthorPlaybookNameInvalidError for whitespace-only name', async () => {
    const repo = buildMockRepo();
    await expect(createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: '   ', createdBy: 'user-1' })).rejects.toThrow(AuthorPlaybookNameInvalidError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('throws AuthorPlaybookNameInvalidError for name exceeding 255 chars', async () => {
    const repo = buildMockRepo();
    const longName = 'a'.repeat(256);
    await expect(createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: longName, createdBy: 'user-1' })).rejects.toThrow(AuthorPlaybookNameInvalidError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('passes optional description and environmentId', async () => {
    const repo = buildMockRepo();
    await createPlaybook({ playbookRepo: repo }, { orgId: 'org-1', name: 'Test', description: 'A desc', environmentId: 'env-1', createdBy: 'user-1' });

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ description: 'A desc', environmentId: 'env-1' }));
  });
});
