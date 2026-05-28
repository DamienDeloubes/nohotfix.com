import { describe, expect, it, vi } from 'vitest';

import type { ChangelogRepository } from '../../ports/changelog-repository.js';
import { recordSpecChanges, type SpecSnapshot } from '../record-spec-changes.js';

function buildMockRepo(): ChangelogRepository {
  return {
    findByEntity: vi.fn(),
    findBySpecWithMembership: vi.fn(),
    findByPlaybookWithMembership: vi.fn(),
    append: vi.fn().mockResolvedValue({ id: 'cl-1' }),
  };
}

function baseSnapshot(overrides: Partial<SpecSnapshot> = {}): SpecSnapshot {
  return {
    title: 'Original',
    description: null,
    tags: [],
    estimatedDurationMinutes: null,
    artifactRequirements: null,
    systemUnderTest: null,
    severity: null,
    preconditions: null,
    testSteps: null,
    expectedResult: null,
    testerNotes: null,
    ...overrides,
  };
}

const baseCommand = {
  orgId: 'org-1',
  specId: 'spec-1',
  actorId: 'user-1',
  actorName: 'admin@test.com',
};

describe('recordSpecChanges — extended field detection', () => {
  it('detects system_under_test_changed with old/new values', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ systemUnderTest: 'Auth Service' }),
        newSpec: baseSnapshot({ systemUnderTest: 'Billing Service' }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'system_under_test_changed',
        fieldChanges: { system_under_test: { old: 'Auth Service', new: 'Billing Service' } },
      }),
    );
  });

  it('detects severity_changed with old/new values', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ severity: 'low' }),
        newSpec: baseSnapshot({ severity: 'critical' }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'severity_changed',
        fieldChanges: { severity: { old: 'low', new: 'critical' } },
      }),
    );
  });

  it('detects preconditions_updated via JSON comparison', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ preconditions: { type: 'doc', content: [{ type: 'paragraph' }] } }),
        newSpec: baseSnapshot({ preconditions: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'New' }] }] } }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'preconditions_updated' }));
  });

  it('detects test_steps_updated via JSON comparison', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ testSteps: [{ instruction: 'Step 1', expectedOutcome: 'Result 1' }] }),
        newSpec: baseSnapshot({ testSteps: [{ instruction: 'Step 1 modified', expectedOutcome: 'Result 1' }] }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'test_steps_updated' }));
  });

  it('detects expected_result_updated', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ expectedResult: null }),
        newSpec: baseSnapshot({ expectedResult: { type: 'doc', content: [] } }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'expected_result_updated' }));
  });

  it('detects tester_notes_updated', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ testerNotes: null }),
        newSpec: baseSnapshot({ testerNotes: 'Run on staging' }),
      },
    );

    expect(repo.append).toHaveBeenCalledOnce();
    expect(repo.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'tester_notes_updated' }));
  });

  it('creates no entries when snapshots are identical (no-op)', async () => {
    const repo = buildMockRepo();
    const snapshot = baseSnapshot({
      title: 'Test',
      systemUnderTest: 'Auth',
      severity: 'high',
      testerNotes: 'Notes',
    });

    await recordSpecChanges({ changelogRepo: repo }, { ...baseCommand, oldSpec: snapshot, newSpec: { ...snapshot } });

    expect(repo.append).not.toHaveBeenCalled();
  });

  it('existing artifact detection still works — artifact_added', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ artifactRequirements: null }),
        newSpec: baseSnapshot({ artifactRequirements: [{ label: 'Screenshot', type: 'file' }] }),
      },
    );

    expect(repo.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'artifact_added' }));
  });

  it('detects multiple changes in a single save', async () => {
    const repo = buildMockRepo();
    await recordSpecChanges(
      { changelogRepo: repo },
      {
        ...baseCommand,
        oldSpec: baseSnapshot({ title: 'Old', severity: 'low' }),
        newSpec: baseSnapshot({ title: 'New', severity: 'high' }),
      },
    );

    expect(repo.append).toHaveBeenCalledTimes(2);
    const actions = (repo.append as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[0].action);
    expect(actions).toContain('title_changed');
    expect(actions).toContain('severity_changed');
  });
});
