import { describe, expect, it, vi } from 'vitest';

import { AuthorSpecNotFoundError } from '../../errors/index.js';
import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../../ports/spec-library-repository.js';
import { getArchiveImpact } from '../get-archive-impact.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function fakeEntry() {
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
    setArchived: vi.fn(),
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
    removeByLibrarySpecId: vi.fn(),
    findPlaybooksReferencingSpec: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe('getArchiveImpact', () => {
  it('throws AuthorSpecNotFoundError when spec does not exist', async () => {
    const specRepo = buildMockSpecRepo({ findById: vi.fn().mockResolvedValue(undefined) });
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    await expect(getArchiveImpact({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'nonexistent', orgId: 'org-1' })).rejects.toThrow(AuthorSpecNotFoundError);
  });

  it('returns empty arrays when spec has no playbook references', async () => {
    const specRepo = buildMockSpecRepo();
    const playbookSpecRepo = buildMockPlaybookSpecRepo();

    const result = await getArchiveImpact({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1' });

    expect(result).toEqual({
      specId: 'spec-1',
      activePlaybooks: [],
      archivedPlaybooks: [],
    });
  });

  it('splits playbooks into active and archived groups', async () => {
    const specRepo = buildMockSpecRepo();
    const playbookSpecRepo = buildMockPlaybookSpecRepo({
      findPlaybooksReferencingSpec: vi.fn().mockResolvedValue([
        { id: 'pb-1', name: 'Sprint Release', isArchived: false },
        { id: 'pb-2', name: 'Hotfix Deploy', isArchived: false },
        { id: 'pb-3', name: 'Q4 Release', isArchived: true },
      ]),
    });

    const result = await getArchiveImpact({ specLibraryRepo: specRepo, playbookSpecRepo }, { specId: 'spec-1', orgId: 'org-1' });

    expect(result).toEqual({
      specId: 'spec-1',
      activePlaybooks: [
        { id: 'pb-1', name: 'Sprint Release' },
        { id: 'pb-2', name: 'Hotfix Deploy' },
      ],
      archivedPlaybooks: [{ id: 'pb-3', name: 'Q4 Release' }],
    });
  });
});
