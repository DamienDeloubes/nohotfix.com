import { describe, expect, it, vi } from 'vitest';

import { AuthorPlaybookNotFoundError, AuthorPlaybookSpecDuplicateError, AuthorSectionNotFoundError, AuthorSpecNotFoundError } from '../../errors/index.js';
import type { PlaybookRepository } from '../../ports/playbook-repository.js';
import type { PlaybookSectionRepository } from '../../ports/playbook-section-repository.js';
import type { PlaybookSpecRepository } from '../../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../../ports/spec-library-repository.js';
import { addSpecToSection } from '../add-spec-to-section.js';

const NOW = new Date('2026-03-11T12:00:00Z');

function fakePlaybook() {
  return { id: 'pb-1', orgId: 'org-1', name: 'Test', isArchived: false, createdBy: 'user-1', createdAt: NOW, updatedAt: NOW };
}

function fakeLibrarySpec() {
  return {
    id: 'lib-1',
    orgId: 'org-1',
    title: 'Login test',
    systemUnderTest: 'Auth',
    severity: 'high',
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

function fakeSection() {
  return { id: 'sec-1', playbookId: 'pb-1', orgId: 'org-1', name: 'Backend', position: 0, createdAt: NOW };
}

function fakePlaybookSpec(overrides: Record<string, unknown> = {}) {
  return {
    id: 'pbs-1',
    sectionId: null,
    playbookId: 'pb-1',
    orgId: 'org-1',
    specLibraryId: 'lib-1',
    position: 0,
    createdAt: NOW,
    ...overrides,
  };
}

function buildDeps(
  overrides: {
    playbookRepo?: Partial<PlaybookRepository>;
    playbookSectionRepo?: Partial<PlaybookSectionRepository>;
    playbookSpecRepo?: Partial<PlaybookSpecRepository>;
    specLibraryRepo?: Partial<SpecLibraryRepository>;
  } = {},
) {
  return {
    playbookRepo: {
      findById: vi.fn().mockResolvedValue(fakePlaybook()),
      findByOrg: vi.fn(),
      findByOrgWithCounts: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      ...overrides.playbookRepo,
    } as PlaybookRepository,
    playbookSectionRepo: {
      findByPlaybook: vi.fn().mockResolvedValue([fakeSection()]),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      ...overrides.playbookSectionRepo,
    } as PlaybookSectionRepository,
    playbookSpecRepo: {
      findBySection: vi.fn().mockResolvedValue([]),
      findByPlaybook: vi.fn(),
      findUngrouped: vi.fn().mockResolvedValue([]),
      findByLibrarySpec: vi.fn(),
      create: vi.fn().mockImplementation(async (data) => fakePlaybookSpec({ ...data })),
      delete: vi.fn(),
      updatePositions: vi.fn(),
      existsInPlaybook: vi.fn().mockResolvedValue(false),
      deleteBySectionId: vi.fn(),
      ...overrides.playbookSpecRepo,
    } as PlaybookSpecRepository,
    specLibraryRepo: {
      findById: vi.fn().mockResolvedValue(fakeLibrarySpec()),
      findByOrg: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findDistinctSystemsUnderTest: vi.fn(),
      findDistinctTags: vi.fn(),
      list: vi.fn(),
      setArchived: vi.fn(),
      ...overrides.specLibraryRepo,
    } as SpecLibraryRepository,
  };
}

describe('addSpecToSection', () => {
  it('adds spec to ungrouped zone successfully', async () => {
    const deps = buildDeps();
    const result = await addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'lib-1', orgId: 'org-1' });

    expect(deps.playbookSpecRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: null,
        playbookId: 'pb-1',
        specLibraryId: 'lib-1',
      }),
    );
    expect(result.specLibraryId).toBe('lib-1');
  });

  it('adds spec to a specific section', async () => {
    const deps = buildDeps();
    await addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'lib-1', sectionId: 'sec-1', orgId: 'org-1' });

    expect(deps.playbookSpecRepo.create).toHaveBeenCalledWith(expect.objectContaining({ sectionId: 'sec-1' }));
  });

  it('throws AuthorPlaybookNotFoundError for missing playbook', async () => {
    const deps = buildDeps({ playbookRepo: { findById: vi.fn().mockResolvedValue(undefined) } });
    await expect(addSpecToSection(deps, { playbookId: 'missing', specLibraryId: 'lib-1', orgId: 'org-1' })).rejects.toThrow(AuthorPlaybookNotFoundError);
  });

  it('throws AuthorSectionNotFoundError for missing section', async () => {
    const deps = buildDeps({ playbookSectionRepo: { findByPlaybook: vi.fn().mockResolvedValue([]) } });
    await expect(addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'lib-1', sectionId: 'missing', orgId: 'org-1' })).rejects.toThrow(AuthorSectionNotFoundError);
  });

  it('throws AuthorPlaybookSpecDuplicateError for duplicate spec', async () => {
    const deps = buildDeps({ playbookSpecRepo: { existsInPlaybook: vi.fn().mockResolvedValue(true) } });
    await expect(addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'lib-1', orgId: 'org-1' })).rejects.toThrow(AuthorPlaybookSpecDuplicateError);
  });

  it('throws AuthorSpecNotFoundError for missing library spec', async () => {
    const deps = buildDeps({ specLibraryRepo: { findById: vi.fn().mockResolvedValue(undefined) } });
    await expect(addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'missing', orgId: 'org-1' })).rejects.toThrow(AuthorSpecNotFoundError);
  });

  it('stores only reference data, not denormalized content', async () => {
    const deps = buildDeps();
    await addSpecToSection(deps, { playbookId: 'pb-1', specLibraryId: 'lib-1', orgId: 'org-1' });

    const createCall = vi.mocked(deps.playbookSpecRepo.create).mock.calls[0]![0];
    expect(createCall).toEqual({
      sectionId: null,
      playbookId: 'pb-1',
      orgId: 'org-1',
      specLibraryId: 'lib-1',
      position: 0,
    });
    // Verify no content fields are present
    expect('title' in createCall).toBe(false);
    expect('severity' in createCall).toBe(false);
  });
});
