import { describe, expect, it, vi } from 'vitest';

import { AuthorSpecArchivedError, AuthorSpecNotFoundError } from '../../errors/index.js';
import type { SpecLibraryRepository } from '../../ports/spec-library-repository.js';
import { updateLibrarySpec } from '../update-library-spec.js';

const NOW = new Date('2026-03-09T12:00:00Z');

function fakeEntry(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spec-1',
    orgId: 'org-1',
    title: 'Original title',
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

function buildMockRepo(overrides: Partial<SpecLibraryRepository> = {}): SpecLibraryRepository {
  return {
    findById: vi.fn().mockResolvedValue(fakeEntry()),
    findByOrg: vi.fn(),
    create: vi.fn(),
    update: vi.fn().mockImplementation(async (_id, _orgId, data) => ({
      ...fakeEntry(),
      ...data,
      updatedAt: new Date('2026-03-09T12:01:00Z'),
    })),
    findDistinctSystemsUnderTest: vi.fn(),
    findDistinctTags: vi.fn(),
    list: vi.fn(),
    ...overrides,
  };
}

describe('updateLibrarySpec', () => {
  it('returns updated DTO on successful update', async () => {
    const repo = buildMockRepo();
    const result = await updateLibrarySpec({ specLibraryRepo: repo }, { id: 'spec-1', orgId: 'org-1', title: 'Updated title' });

    expect(repo.findById).toHaveBeenCalledWith('spec-1', 'org-1');
    expect(repo.update).toHaveBeenCalledOnce();
    expect(result.title).toBe('Updated title');
    expect(result.id).toBe('spec-1');
    expect(result.orgId).toBe('org-1');
  });

  it('throws AuthorSpecNotFoundError when spec does not exist', async () => {
    const repo = buildMockRepo({
      findById: vi.fn().mockResolvedValue(undefined),
    });

    await expect(updateLibrarySpec({ specLibraryRepo: repo }, { id: 'nonexistent', orgId: 'org-1', title: 'Test' })).rejects.toThrow(AuthorSpecNotFoundError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('throws AuthorSpecArchivedError when spec is archived', async () => {
    const repo = buildMockRepo({
      findById: vi.fn().mockResolvedValue(fakeEntry({ isArchived: true })),
    });

    await expect(updateLibrarySpec({ specLibraryRepo: repo }, { id: 'spec-1', orgId: 'org-1', title: 'Test' })).rejects.toThrow(AuthorSpecArchivedError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('throws validation error for empty title', async () => {
    const repo = buildMockRepo();

    await expect(updateLibrarySpec({ specLibraryRepo: repo }, { id: 'spec-1', orgId: 'org-1', title: '' })).rejects.toThrow('Spec title must not be empty');
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('preserves existing createdBy from the fetched spec', async () => {
    const repo = buildMockRepo({
      findById: vi.fn().mockResolvedValue(fakeEntry({ createdBy: 'original-creator' })),
    });

    await updateLibrarySpec({ specLibraryRepo: repo }, { id: 'spec-1', orgId: 'org-1', title: 'Updated' });

    expect(repo.update).toHaveBeenCalledOnce();
    // The update call should not change createdBy — it's not in the update payload
    const updateData = (repo.update as ReturnType<typeof vi.fn>).mock.calls[0][2];
    expect(updateData).not.toHaveProperty('createdBy');
  });

  it('passes all fields to repo.update when provided', async () => {
    const repo = buildMockRepo();

    await updateLibrarySpec(
      { specLibraryRepo: repo },
      {
        id: 'spec-1',
        orgId: 'org-1',
        title: 'New title',
        systemUnderTest: 'Auth Service',
        severity: 'critical',
        testSteps: [{ instruction: 'Step 1' }],
        testerNotes: 'Test on staging',
        estimatedDurationMinutes: 30,
        tags: ['smoke', 'auth'],
      },
    );

    const updateData = (repo.update as ReturnType<typeof vi.fn>).mock.calls[0][2];
    expect(updateData.title).toBe('New title');
    expect(updateData.systemUnderTest).toBe('Auth Service');
    expect(updateData.severity).toBe('critical');
    expect(updateData.testSteps).toEqual([{ instruction: 'Step 1', expectedOutcome: undefined }]);
    expect(updateData.testerNotes).toBe('Test on staging');
    expect(updateData.estimatedDurationMinutes).toBe(30);
    expect(updateData.tags).toEqual(['smoke', 'auth']);
  });
});
