import type { RoleValue } from '../entities/value-objects/role.js';
import { AuthInviteEmailMismatchError, AuthInviteExpiredError, AuthInviteNotFoundError } from '../errors/index.js';
import type { InviteRepository } from '../ports/invite-repository.js';
import type { MembershipRepository } from '../ports/membership-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';
import type { UserRepository } from '../ports/user-repository.js';

export interface AcceptInviteDeps {
  inviteRepo: InviteRepository;
  membershipRepo: MembershipRepository;
  organisationRepo: OrganisationRepository;
  userRepo: UserRepository;
}

export interface AcceptInviteCommand {
  token: string;
  userId: string;
  userEmail: string;
}

export interface AcceptInviteOutput {
  orgSlug: string;
  orgName: string;
}

export async function acceptInvite(deps: AcceptInviteDeps, command: AcceptInviteCommand): Promise<AcceptInviteOutput> {
  const invite = await deps.inviteRepo.findByToken(command.token);

  if (!invite) {
    throw new AuthInviteNotFoundError();
  }

  // Already accepted — return org info for redirect
  if (invite.status === 'accepted') {
    const org = await deps.organisationRepo.findById(invite.orgId);
    return {
      orgSlug: org?.slug.toString() ?? '',
      orgName: org?.name.toString() ?? '',
    };
  }

  if (invite.status !== 'pending') {
    throw new AuthInviteNotFoundError();
  }

  if (invite.isExpired()) {
    throw new AuthInviteExpiredError();
  }

  // Email match check
  if (invite.email.toString().toLowerCase() !== command.userEmail.toLowerCase()) {
    throw new AuthInviteEmailMismatchError();
  }

  // Accept the invite (returns new entity)
  const acceptedInvite = invite.accept(command.userId);
  await deps.inviteRepo.update(acceptedInvite);

  // Create membership
  await deps.membershipRepo.create({
    orgId: invite.orgId,
    userId: command.userId,
    role: invite.role.toString() as RoleValue,
  });

  const org = await deps.organisationRepo.findById(invite.orgId);
  return {
    orgSlug: org?.slug.toString() ?? '',
    orgName: org?.name.toString() ?? '',
  };
}
