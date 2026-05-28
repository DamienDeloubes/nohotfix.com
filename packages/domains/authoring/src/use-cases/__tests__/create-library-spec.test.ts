import { describe, expect, it, vi } from 'vitest';

import type { SpecLibraryRepository } from '../../ports/spec-library-repository.js';
import { createLibrarySpec } from '../create-library-spec.js';

function buildMockRepo(overrides: Partial<SpecLibraryRepository> = {}): SpecLibraryRepository {
  return {
    findById: vi.fn(),
    findByOrg: vi.fn(),
    create: vi.fn().mockImplementation(async (data) => ({
      id: '00000000-0000-0000-0000-000000000001',
      ...data,
      createdAt: new Date('2026-03-09T12:00:00Z'),
      updatedAt: new Date('2026-03-09T12:00:00Z'),
    })),
    update: vi.fn(),
    findDistinctSystemsUnderTest: vi.fn(),
    ...overrides,
  };
}

describe('createLibrarySpec', () => {
  it('calls repo.create with validated data and returns DTO', async () => {
    const repo = buildMockRepo();
    const result = await createLibrarySpec(
      { specLibraryRepo: repo },
      {
        id: '00000000-0000-0000-0000-000000000001',
        orgId: '00000000-0000-0000-0000-000000000002',
        createdBy: '00000000-0000-0000-0000-000000000003',
        title: 'Smoke test',
      },
    );

    expect(repo.create).toHaveBeenCalledOnce();
    expect(result.id).toBe('00000000-0000-0000-0000-000000000001');
    expect(result.title).toBe('Smoke test');
    expect(result.severity).toBe('medium');
    expect(result.isArchived).toBe(false);
    expect(result.createdAt).toBe('2026-03-09T12:00:00.000Z');
  });

  it('propagates SpecTitle validation error (empty title)', async () => {
    const repo = buildMockRepo();
    await expect(
      createLibrarySpec(
        { specLibraryRepo: repo },
        {
          id: '00000000-0000-0000-0000-000000000001',
          orgId: '00000000-0000-0000-0000-000000000002',
          createdBy: '00000000-0000-0000-0000-000000000003',
          title: '',
        },
      ),
    ).rejects.toThrow('Spec title must not be empty');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('propagates Severity validation error', async () => {
    const repo = buildMockRepo();
    await expect(
      createLibrarySpec(
        { specLibraryRepo: repo },
        {
          id: '00000000-0000-0000-0000-000000000001',
          orgId: '00000000-0000-0000-0000-000000000002',
          createdBy: '00000000-0000-0000-0000-000000000003',
          title: 'Valid',
          severity: 'invalid',
        },
      ),
    ).rejects.toThrow('Invalid severity');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('propagates TestStep validation error (empty instruction)', async () => {
    const repo = buildMockRepo();
    await expect(
      createLibrarySpec(
        { specLibraryRepo: repo },
        {
          id: '00000000-0000-0000-0000-000000000001',
          orgId: '00000000-0000-0000-0000-000000000002',
          createdBy: '00000000-0000-0000-0000-000000000003',
          title: 'Valid',
          testSteps: [{ instruction: '' }],
        },
      ),
    ).rejects.toThrow('instruction must not be empty');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('accepts test step without expected outcome', async () => {
    const repo = buildMockRepo();
    const result = await createLibrarySpec(
      { specLibraryRepo: repo },
      {
        id: '00000000-0000-0000-0000-000000000001',
        orgId: '00000000-0000-0000-0000-000000000002',
        createdBy: '00000000-0000-0000-0000-000000000003',
        title: 'Valid',
        testSteps: [{ instruction: 'Do something' }],
      },
    );
    expect(repo.create).toHaveBeenCalledOnce();
    expect(result.testSteps).toEqual([{ instruction: 'Do something', expectedOutcome: undefined }]);
  });
});
