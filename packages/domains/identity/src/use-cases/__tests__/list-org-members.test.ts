import { describe, expect, it, vi } from 'vitest';

import type { MembershipRepository, MemberWithUserDto } from '../../ports/membership-repository.js';
import { listOrgMembers } from '../list-org-members.js';

function createMockRepo(members: MemberWithUserDto[]): MembershipRepository {
  return {
    findMembersWithUsers: vi.fn().mockResolvedValue(members),
    findByOrg: vi.fn(),
    findByOrgAndUser: vi.fn(),
    countAdmins: vi.fn(),
    create: vi.fn(),
    updateRole: vi.fn(),
    delete: vi.fn(),
  };
}

describe('listOrgMembers', () => {
  it('delegates to findMembersWithUsers with the given orgId', async () => {
    const repo = createMockRepo([]);
    await listOrgMembers({ membershipRepo: repo }, 'org-123');
    expect(repo.findMembersWithUsers).toHaveBeenCalledWith('org-123');
  });

  it('returns empty array for org with no members', async () => {
    const repo = createMockRepo([]);
    const result = await listOrgMembers({ membershipRepo: repo }, 'org-empty');
    expect(result).toEqual([]);
  });

  it('returns members as provided by the repository', async () => {
    const members: MemberWithUserDto[] = [
      { membershipId: 'm1', userId: 'u1', firstName: 'Alice', lastName: null, email: 'alice@test.com', role: 'owner', joinedAt: new Date('2026-01-01') },
      { membershipId: 'm2', userId: 'u2', firstName: null, lastName: null, email: 'bob@test.com', role: 'member', joinedAt: new Date('2026-02-01') },
    ];
    const repo = createMockRepo(members);
    const result = await listOrgMembers({ membershipRepo: repo }, 'org-456');
    expect(result).toHaveLength(2);
    expect(result[0]!.firstName).toBe('Alice');
    expect(result[1]!.firstName).toBeNull();
    expect(result[1]!.email).toBe('bob@test.com');
  });
});
