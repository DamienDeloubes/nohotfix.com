import { describe, expect, it, vi } from 'vitest';

import { AuthorSpecNotFoundError } from '../../errors/index.js';
import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../../ports/spec-library-repository.js';
import { archiveLibrarySpec } from '../archive-library-spec.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function fakeEntry(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spec-1',
    orgId: 'org-1',
    title: 'Login test',
    systemUnderTest: null,
    severity: 'medium',
    preconditions: null,
    description: null,
    testSteps: null,
    expectedResult: null,
    artifactRequirements: null,
    testerNotes: null,
    estimatedDurationMinutes: null,
    tags: [],
    isArchived: false,
    createdBy: 'user-1',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildMockSpecRepo(overrides: Partial<SpecLibraryRepository> = {}): SpecLibraryRepository {
  return {
    findById: vi.fn().mockResolvedValue(fakeEntry()),
    findByOrg: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findDistinctSystemsUnderTest: vi.fn(),
    findDistinctTags: vi.fn(),
    list: vi.fn(),
    setArchived: vi.fn().mockImplementation(async (_id, _orgId, isArchived) => ({
      ...fakeEntry(),
      isArchived,
      updatedAt: new Date('2026-03-11T12:01:00Z'),
    })),
    ...overrides,
  };
}

function buildMockPlaybookSpecRepo(overrides: Partial<PlaybookSpecRepository> = {}): PlaybookSpecRepository {
  return {
    findBySection: vi.fn(),
    findByPlaybook: vi.fn(),
    findUngrouped: vi.fn(),
    findByLibrarySpec: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    updatePositions: vi.fn(),
    existsInPlaybook: vi.fn(),
    deleteBySectionId: vi.fn(),
    removeByLibrarySpecId: vi.fn().mockResolvedValue(0),
    findPlaybooksReferencingSpec: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe('archiveLibrarySpec', () => {
  it('throws AuthorSpecNotFoundError when spec does not exist', async () => {
    const specRepo = buildMockSpecRepo({ findById: vi.fn().mockResolvedValue(undefined) });
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    await expect(archiveLibrarySpec({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'nonexistent', orgId: 'org-1', archive: true })).rejects.toThrow(
      AuthorSpecNotFoundError,
    );
    expect(specRepo.setArchived).not.toHaveBeenCalled();
  });

  it('returns wasChanged: false when already archived (idempotency)', async () => {
    const specRepo = buildMockSpecRepo({ findById: vi.fn().mockResolvedValue(fakeEntry({ isArchived: true })) });
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    const result = await archiveLibrarySpec({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1', archive: true });

    expect(result.wasChanged).toBe(false);
    expect(result.spec.isArchived).toBe(true);
    expect(specRepo.setArchived).not.toHaveBeenCalled();
    expect(playbookSpecRepo.removeByLibrarySpecId).not.toHaveBeenCalled();
  });

  it('returns wasChanged: false when already active on unarchive (idempotency)', async () => {
    const specRepo = buildMockSpecRepo({ findById: vi.fn().mockResolvedValue(fakeEntry({ isArchived: false })) });
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    const result = await archiveLibrarySpec({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1', archive: false });

    expect(result.wasChanged).toBe(false);
    expect(result.spec.isArchived).toBe(false);
    expect(specRepo.setArchived).not.toHaveBeenCalled();
  });

  it('archives a spec and calls removeByLibrarySpecId', async () => {
    const specRepo = buildMockSpecRepo();
    const playbookSpecRepo = buildMockPlaybookSpecRepo({ removeByLibrarySpecId: vi.fn().mockResolvedValue(3) });

    const result = await archiveLibrarySpec({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1', archive: true });

    expect(result.wasChanged).toBe(true);
    expect(result.spec.isArchived).toBe(true);
    expect(specRepo.setArchived).toHaveBeenCalledWith('spec-1', 'org-1', true);
    expect(playbookSpecRepo.removeByLibrarySpecId).toHaveBeenCalledWith('spec-1', 'org-1');
  });

  it('unarchives a spec without calling removeByLibrarySpecId', async () => {
    const specRepo = buildMockSpecRepo({
      findById: vi.fn().mockResolvedValue(fakeEntry({ isArchived: true })),
      setArchived: vi.fn().mockResolvedValue(fakeEntry({ isArchived: false, updatedAt: new Date('2026-03-11T12:01:00Z') })),
    });
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    const result = await archiveLibrarySpec({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1', archive: false });

    expect(result.wasChanged).toBe(true);
    expect(result.spec.isArchived).toBe(false);
    expect(playbookSpecRepo.removeByLibrarySpecId).not.toHaveBeenCalled();
  });
});
