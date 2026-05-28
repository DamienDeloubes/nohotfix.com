import { AuthInviteNotFoundError } from '../errors/index.js';
import type { InviteRepository } from '../ports/invite-repository.js';

export interface RevokeInviteDeps {
  inviteRepo: InviteRepository;
}

export interface RevokeInviteCommand {
  orgId: string;
  inviteId: string;
}

export async function revokeInvite(deps: RevokeInviteDeps, command: RevokeInviteCommand): Promise<void> {
  const invite = await deps.inviteRepo.findById(command.orgId, command.inviteId);
  if (!invite || invite.status !== 'pending') {
    throw new AuthInviteNotFoundError();
  }

  const revoked = invite.revoke();
  await deps.inviteRepo.update(revoked);
}
