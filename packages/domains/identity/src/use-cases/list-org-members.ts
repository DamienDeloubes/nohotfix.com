import type { MembershipRepository, MemberWithUserDto } from '../ports/membership-repository.js';

export interface ListOrgMembersDeps {
  membershipRepo: MembershipRepository;
}

export async function listOrgMembers(deps: ListOrgMembersDeps, orgId: string): Promise<MemberWithUserDto[]> {
  return deps.membershipRepo.findMembersWithUsers(orgId);
}
