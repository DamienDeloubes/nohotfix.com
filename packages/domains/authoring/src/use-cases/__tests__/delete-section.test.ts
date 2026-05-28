import { describe, expect, it, vi } from 'vitest';

import type { PlaybookSectionRepository } from '../../ports/playbook-section-repository.js';
import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import { deleteSection } from '../delete-section.js';

function buildDeps(overrides: { playbookSectionRepo?: Partial<PlaybookSectionRepository>; playbookSpecRepo?: Partial<PlaybookSpecRepository> } = {}) {
  return {
    playbookSectionRepo: {
      findByPlaybook: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      ...overrides.playbookSectionRepo,
    } as PlaybookSectionRepository,
    playbookSpecRepo: {
      findBySection: vi.fn(),
      findByPlaybook: vi.fn(),
      findUngrouped: vi.fn(),
      findByLibrarySpec: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      updatePositions: vi.fn(),
      existsInPlaybook: vi.fn(),
      deleteBySectionId: vi.fn().mockResolvedValue(undefined),
      ...overrides.playbookSpecRepo,
    } as PlaybookSpecRepository,
  };
}

describe('deleteSection', () => {
  it('deletes section and its specs', async () => {
    const deps = buildDeps();
    await deleteSection(deps, { sectionId: 'sec-1', orgId: 'org-1' });

    expect(deps.playbookSpecRepo.deleteBySectionId).toHaveBeenCalledWith('sec-1', 'org-1');
    expect(deps.playbookSectionRepo.delete).toHaveBeenCalledWith('sec-1', 'org-1');
  });
});
