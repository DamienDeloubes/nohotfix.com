import type { RoleValue } from '../entities/value-objects/role.js';
import { AuthOwnerCannotBeRemovedError, AuthRoleInsufficientError, AuthTargetNotFoundError } from '../errors/index.js';
import type { MembershipRepository } from '../ports/membership-repository.js';

export interface RemoveMemberDeps {
  membershipRepo: MembershipRepository;
}

export interface RemoveMemberCommand {
  orgId: string;
  memberId: string;
  actorUserId: string;
  actorRole: RoleValue;
}

export interface RemoveMemberOutput {
  isSelfRemoval: boolean;
}

export async function removeMember(deps: RemoveMemberDeps, command: RemoveMemberCommand): Promise<RemoveMemberOutput> {
  const { membershipRepo } = deps;
  const { orgId, memberId, actorUserId, actorRole } = command;

  // 1. Look up target membership
  const target = await membershipRepo.findByOrgAndId(orgId, memberId);
  if (!target) {
    throw new AuthTargetNotFoundError();
  }

  // 2. Owner cannot be removed (must transfer ownership first)
  const targetRole = target.role.toString() as RoleValue;
  if (targetRole === 'owner') {
    throw new AuthOwnerCannotBeRemovedError();
  }

  // 3. Member-role actors can only remove themselves
  const isSelfRemoval = actorUserId === target.userId;
  if (!isSelfRemoval && actorRole === 'member') {
    throw new AuthRoleInsufficientError();
  }

  // 4. Delete the membership
  await membershipRepo.delete(orgId, memberId);

  return { isSelfRemoval };
}
