import { InviteEntity } from '../entities/invite.js';
import { AuthInviteAlreadyMemberError, AuthInviteDuplicateError, AuthInviteEmailFailedError, AuthInviteSelfError } from '../errors/index.js';
import type { EmailPort } from '../ports/email-port.js';
import type { InviteRepository } from '../ports/invite-repository.js';
import type { MembershipRepository } from '../ports/membership-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';
import type { UserRepository } from '../ports/user-repository.js';

export interface CreateInviteDeps {
  inviteRepo: InviteRepository;
  membershipRepo: MembershipRepository;
  organisationRepo: OrganisationRepository;
  userRepo: UserRepository;
  emailPort: EmailPort;
  webUrl: string;
}

export interface CreateInviteCommand {
  orgId: string;
  email: string;
  role: string;
  invitedByUserId: string;
  inviterEmail: string;
}

export interface CreateInviteOutput {
  id: string;
  email: string;
  role: string;
  status: string;
  invitedBy: string;
  lastSentAt: string;
  tokenExpiresAt: string;
  createdAt: string;
}

export async function createInvite(deps: CreateInviteDeps, command: CreateInviteCommand): Promise<CreateInviteOutput> {
  // 1. Self-invite check
  if (command.email.toLowerCase() === command.inviterEmail.toLowerCase()) {
    throw new AuthInviteSelfError();
  }

  // 2. Already a member check
  const existingMember = await deps.membershipRepo.findByOrgAndEmail(command.orgId, command.email);
  if (existingMember) {
    throw new AuthInviteAlreadyMemberError();
  }

  // 3. Duplicate pending invite check
  const existingInvite = await deps.inviteRepo.findPendingByOrgAndEmail(command.orgId, command.email);
  if (existingInvite) {
    throw new AuthInviteDuplicateError();
  }

  // 4. Create invite entity
  const draft = InviteEntity.create({
    orgId: command.orgId,
    email: command.email,
    role: command.role,
    invitedBy: command.invitedByUserId,
  });

  // 5. Persist invite (DB generates the UUID)
  const invite = await deps.inviteRepo.create(draft);

  // 6. Get org name and inviter name for email
  const org = await deps.organisationRepo.findById(command.orgId);
  const inviter = await deps.userRepo.findById(command.invitedByUserId);
  const orgName = org?.name.toString() ?? 'your organisation';
  const inviterName = inviter ? [inviter.firstName?.toString(), inviter.lastName?.toString()].filter(Boolean).join(' ') || inviter.email.toString() : 'A team member';

  // 7. Send email — rollback on failure
  const inviteUrl = `${deps.webUrl}/invite/${invite.token.toString()}`;
  try {
    await deps.emailPort.sendInviteEmail({
      to: invite.email.toString(),
      inviterName,
      orgName,
      inviteUrl,
    });
  } catch (error) {
    // Roll back: delete the invite record
    await deps.inviteRepo.delete(command.orgId, invite.id);
    throw new AuthInviteEmailFailedError({ cause: error instanceof Error ? error.message : 'Unknown email error' });
  }

  return {
    id: invite.id,
    email: invite.email.toString(),
    role: invite.role.toString(),
    status: invite.status,
    invitedBy: invite.invitedBy,
    lastSentAt: invite.lastSentAt.toISOString(),
    tokenExpiresAt: invite.tokenExpiresAt.toISOString(),
    createdAt: invite.createdAt.toISOString(),
  };
}
