import type { InviteRepository, InviteWithInviterDto } from '../ports/invite-repository.js';

export interface ListPendingInvitesDeps {
  inviteRepo: InviteRepository;
}

export async function listPendingInvites(deps: ListPendingInvitesDeps, orgId: string): Promise<InviteWithInviterDto[]> {
  return deps.inviteRepo.findPendingByOrg(orgId);
}
