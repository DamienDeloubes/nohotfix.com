import { AuthInviteNotFoundError, AuthInviteResendTooSoonError } from '../errors/index.js';
import type { EmailPort } from '../ports/email-port.js';
import type { InviteRepository } from '../ports/invite-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';
import type { UserRepository } from '../ports/user-repository.js';

export interface ResendInviteDeps {
  inviteRepo: InviteRepository;
  organisationRepo: OrganisationRepository;
  userRepo: UserRepository;
  emailPort: EmailPort;
  webUrl: string;
}

export interface ResendInviteCommand {
  orgId: string;
  inviteId: string;
}

export interface ResendInviteOutput {
  id: string;
  lastSentAt: string;
  tokenExpiresAt: string;
}

export async function resendInvite(deps: ResendInviteDeps, command: ResendInviteCommand): Promise<ResendInviteOutput> {
  const invite = await deps.inviteRepo.findById(command.orgId, command.inviteId);
  if (!invite || invite.status !== 'pending') {
    throw new AuthInviteNotFoundError();
  }

  if (!invite.canResend()) {
    throw new AuthInviteResendTooSoonError();
  }

  // Regenerate token and reset expiry
  const updated = invite.resend();
  await deps.inviteRepo.update(updated);

  // Get org name and inviter name for email
  const org = await deps.organisationRepo.findById(command.orgId);
  const inviter = await deps.userRepo.findById(invite.invitedBy);
  const orgName = org?.name.toString() ?? 'your organisation';
  const inviterName = inviter ? [inviter.firstName?.toString(), inviter.lastName?.toString()].filter(Boolean).join(' ') || inviter.email.toString() : 'A team member';

  const inviteUrl = `${deps.webUrl}/invite/${updated.token.toString()}`;
  await deps.emailPort.sendInviteEmail({
    to: updated.email.toString(),
    inviterName,
    orgName,
    inviteUrl,
  });

  return {
    id: updated.id,
    lastSentAt: updated.lastSentAt.toISOString(),
    tokenExpiresAt: updated.tokenExpiresAt.toISOString(),
  };
}
