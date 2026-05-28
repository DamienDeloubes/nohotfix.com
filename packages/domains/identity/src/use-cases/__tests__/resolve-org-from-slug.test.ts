import { describe, expect, it, vi } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { MembershipEntity } from '../../entities/membership.js';
import { OrganisationEntity } from '../../entities/organisation.js';
import type { MembershipRepository } from '../../ports/membership-repository.js';
import type { OrganisationRepository } from '../../ports/organisation-repository.js';
import { resolveOrgFromSlug } from '../resolve-org-from-slug.js';

const mockOrg = OrganisationEntity.create({ id: 'org-1', name: 'Acme Corp', slug: 'acme-corp' });
const mockMembership = MembershipEntity.create({ id: 'mem-1', orgId: 'org-1', userId: 'user-1', role: 'admin' });

function createMockDeps(overrides?: { org?: OrganisationEntity | null; membership?: MembershipEntity | null }) {
  const organisationRepo: Pick<OrganisationRepository, 'findBySlug'> = {
    findBySlug: vi.fn().mockResolvedValue(overrides?.org === null ? undefined : (overrides?.org ?? mockOrg)),
  };
  const membershipRepo: Pick<MembershipRepository, 'findByOrgAndUser'> = {
    findByOrgAndUser: vi.fn().mockResolvedValue(overrides?.membership === null ? undefined : (overrides?.membership ?? mockMembership)),
  };
  return { organisationRepo, membershipRepo } as { organisationRepo: OrganisationRepository; membershipRepo: MembershipRepository };
}

describe('resolveOrgFromSlug', () => {
  it('returns org and membership info for valid slug and member', async () => {
    const deps = createMockDeps();
    const result = await resolveOrgFromSlug(deps, { slug: 'acme-corp', userId: 'user-1' });

    expect(result).toEqual({
      orgId: 'org-1',
      orgName: 'Acme Corp',
      orgSlug: 'acme-corp',
      membershipId: 'mem-1',
      role: 'admin',
    });
    expect(deps.organisationRepo.findBySlug).toHaveBeenCalledWith('acme-corp');
    expect(deps.membershipRepo.findByOrgAndUser).toHaveBeenCalledWith('org-1', 'user-1');
  });

  it('throws AUTH_ORG_NOT_FOUND when slug does not exist', async () => {
    const deps = createMockDeps({ org: null });

    await expect(resolveOrgFromSlug(deps, { slug: 'no-such-org', userId: 'user-1' })).rejects.toMatchObject({
      code: ErrorCode.AUTH_ORG_NOT_FOUND,
      statusCode: 404,
    });
    expect(deps.membershipRepo.findByOrgAndUser).not.toHaveBeenCalled();
  });

  it('throws AUTH_MEMBERSHIP_NOT_FOUND when user is not a member', async () => {
    const deps = createMockDeps({ membership: null });

    await expect(resolveOrgFromSlug(deps, { slug: 'acme-corp', userId: 'user-stranger' })).rejects.toMatchObject({
      code: ErrorCode.AUTH_MEMBERSHIP_NOT_FOUND,
      statusCode: 403,
    });
  });
});
