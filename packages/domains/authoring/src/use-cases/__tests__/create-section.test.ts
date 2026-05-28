import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../../ports/playbook-section-repository.js';
import { createSection } from '../create-section.js';

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
      findByPlaybook: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation(async (data) => ({ id: 'sec-1', ...data, createdAt: NOW })),
      update: vi.fn(),
      delete: vi.fn(),
      ...overrides.playbookSectionRepo,
    } as PlaybookSectionRepository,
  };
}

describe('createSection', () => {
  it('creates section with auto-position 0 when no sections exist', async () => {
    const deps = buildDeps();
    const result = await createSection(deps, { playbookId: 'pb-1', orgId: 'org-1', name: 'Backend' });

    expect(deps.playbookSectionRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Backend', position: 0 }));
    expect(result.id).toBe('sec-1');
  });

  it('auto-assigns next position when sections exist', async () => {
    const deps = buildDeps({
      playbookSectionRepo: {
        findByPlaybook: vi.fn().mockResolvedValue([{ position: 0 }, { position: 1 }]),
        create: vi.fn().mockImplementation(async (data) => ({ id: 'sec-2', ...data, createdAt: NOW })),
      },
    });
    await createSection(deps, { playbookId: 'pb-1', orgId: 'org-1', name: 'Frontend' });

    expect(deps.playbookSectionRepo.create).toHaveBeenCalledWith(expect.objectContaining({ position: 2 }));
  });

  it('throws AuthorPlaybookNotFoundError for missing playbook', async () => {
    const deps = buildDeps({ playbookRepo: { findById: vi.fn().mockResolvedValue(undefined) } });
    await expect(createSection(deps, { playbookId: 'missing', orgId: 'org-1', name: 'Test' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });
});
