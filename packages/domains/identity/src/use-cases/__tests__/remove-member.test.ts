import { describe, expect, it, vi } from 'vitest';

import { MembershipEntity, Role } from '../../entities/index.js';
import { AuthOwnerCannotBeRemovedError, AuthRoleInsufficientError, AuthTargetNotFoundError } from '../../errors/index.js';
import type { MembershipRepository } from '../../ports/membership-repository.js';
import { removeMember } from '../remove-member.js';

function makeMembership(overrides: { id?: string; orgId?: string; userId?: string; role?: string } = {}): MembershipEntity {
  return MembershipEntity.reconstitute({
    id: overrides.id ?? 'target-mem-1',
    orgId: overrides.orgId ?? 'org-1',
    userId: overrides.userId ?? 'target-user-1',
    role: Role.create(overrides.role ?? 'member'),
    createdAt: new Date(),
  });
}

function makeDeps(repoOverrides: Partial<MembershipRepository> = {}) {
  const membershipRepo: MembershipRepository = {
    findMembersWithUsers: vi.fn().mockResolvedValue([]),
    findByOrg: vi.fn().mockResolvedValue([]),
    findByOrgAndUser: vi.fn().mockResolvedValue(undefined),
    findByOrgAndEmail: vi.fn().mockResolvedValue(undefined),
    findByOrgAndId: vi.fn().mockResolvedValue(undefined),
    countAdmins: vi.fn().mockResolvedValue(0),
    create: vi.fn(),
    updateRole: vi.fn(),
    transferOwnership: vi.fn(),
    delete: vi.fn().mockResolvedValue(true),
    ...repoOverrides,
  };
  return { membershipRepo };
}

describe('removeMember', () => {
  // ── Happy paths ──────────────────────────────────────────────────────

  it('admin removes a member', async () => {
    const target = makeMembership({ role: 'member' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'actor-user-1',
      actorRole: 'admin',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(false);
  });

  it('admin removes another admin', async () => {
    const target = makeMembership({ role: 'admin', userId: 'other-admin' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'actor-user-1',
      actorRole: 'admin',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(false);
  });

  it('owner removes a member', async () => {
    const target = makeMembership({ role: 'member' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'owner-user-1',
      actorRole: 'owner',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(false);
  });

  it('owner removes an admin', async () => {
    const target = makeMembership({ role: 'admin' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'owner-user-1',
      actorRole: 'owner',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(false);
  });

  // ── Self-removal ─────────────────────────────────────────────────────

  it('admin self-removal is allowed', async () => {
    const target = makeMembership({ role: 'admin', userId: 'self-user' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'self-user',
      actorRole: 'admin',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(true);
  });

  it('member self-removal is allowed', async () => {
    const target = makeMembership({ role: 'member', userId: 'self-user' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    const result = await removeMember(deps, {
      orgId: 'org-1',
      memberId: 'target-mem-1',
      actorUserId: 'self-user',
      actorRole: 'member',
    });

    expect(deps.membershipRepo.delete).toHaveBeenCalledWith('org-1', 'target-mem-1');
    expect(result.isSelfRemoval).toBe(true);
  });

  // ── Error paths ──────────────────────────────────────────────────────

  it('throws AuthTargetNotFoundError when target not found', async () => {
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(undefined) });

    await expect(
      removeMember(deps, {
        orgId: 'org-1',
        memberId: 'non-existent',
        actorUserId: 'actor-user-1',
        actorRole: 'admin',
      }),
    ).rejects.toThrow(AuthTargetNotFoundError);
  });

  it('throws AuthOwnerCannotBeRemovedError when target is owner', async () => {
    const target = makeMembership({ role: 'owner' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    await expect(
      removeMember(deps, {
        orgId: 'org-1',
        memberId: 'target-mem-1',
        actorUserId: 'admin-user-1',
        actorRole: 'admin',
      }),
    ).rejects.toThrow(AuthOwnerCannotBeRemovedError);
  });

  it('throws AuthRoleInsufficientError when member removes another member', async () => {
    const target = makeMembership({ role: 'member', userId: 'other-user' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    await expect(
      removeMember(deps, {
        orgId: 'org-1',
        memberId: 'target-mem-1',
        actorUserId: 'actor-user-1',
        actorRole: 'member',
      }),
    ).rejects.toThrow(AuthRoleInsufficientError);
  });

  it('throws AuthOwnerCannotBeRemovedError when owner tries self-removal', async () => {
    const target = makeMembership({ role: 'owner', userId: 'owner-user' });
    const deps = makeDeps({ findByOrgAndId: vi.fn().mockResolvedValue(target) });

    await expect(
      removeMember(deps, {
        orgId: 'org-1',
        memberId: 'target-mem-1',
        actorUserId: 'owner-user',
        actorRole: 'owner',
      }),
    ).rejects.toThrow(AuthOwnerCannotBeRemovedError);
  });
});
