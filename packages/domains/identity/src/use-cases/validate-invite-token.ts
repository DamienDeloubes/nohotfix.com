import type { InviteRepository } from '../ports/invite-repository.js';
import type { OrganisationRepository } from '../ports/organisation-repository.js';

export interface ValidateInviteTokenDeps {
  inviteRepo: InviteRepository;
  organisationRepo: OrganisationRepository;
}

export interface ValidateInviteTokenOutput {
  status: 'valid' | 'expired' | 'revoked' | 'accepted' | 'not_found';
  email?: string | undefined;
  orgSlug?: string | undefined;
  orgName?: string | undefined;
}

export async function validateInviteToken(deps: ValidateInviteTokenDeps, token: string): Promise<ValidateInviteTokenOutput> {
  const invite = await deps.inviteRepo.findByToken(token);

  if (!invite) {
    return { status: 'not_found' };
  }

  if (invite.status === 'revoked') {
    return { status: 'revoked' };
  }

  if (invite.status === 'accepted') {
    const org = await deps.organisationRepo.findById(invite.orgId);
    return {
      status: 'accepted',
      orgSlug: org?.slug.toString(),
      orgName: org?.name.toString(),
    };
  }

  // status === 'pending'
  if (invite.isExpired()) {
    return { status: 'expired' };
  }

  const org = await deps.organisationRepo.findById(invite.orgId);
  return {
    status: 'valid',
    email: invite.email.toString(),
    orgSlug: org?.slug.toString(),
    orgName: org?.name.toString(),
  };
}
