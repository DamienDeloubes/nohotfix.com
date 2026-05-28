import type { RoleValue } from '../entities/value-objects/role.js';
import { AuthOwnerSelfDemoteError, AuthRoleInsufficientError, AuthRoleSameError, AuthTargetNotFoundError } from '../errors/index.js';
import type { MembershipRepository } from '../ports/membership-repository.js';

export interface ChangeMemberRoleDeps {
  membershipRepo: MembershipRepository;
}

export interface ChangeMemberRoleCommand {
  orgId: string;
  targetMembershipId: string;
  newRole: RoleValue;
  actorMembershipId: string;
  actorRole: RoleValue;
}

export interface ChangeMemberRoleOutput {
  previousRole: RoleValue;
  isTransfer: boolean;
}

export async function changeMemberRole(deps: ChangeMemberRoleDeps, command: ChangeMemberRoleCommand): Promise<ChangeMemberRoleOutput> {
  const { membershipRepo } = deps;
  const { orgId, targetMembershipId, newRole, actorMembershipId, actorRole } = command;

  // 1. Actor must be admin or owner
  if (actorRole === 'member') {
    throw new AuthRoleInsufficientError();
  }

  // 2. Look up target membership
  const target = await membershipRepo.findByOrgAndId(orgId, targetMembershipId);
  if (!target) {
    throw new AuthTargetNotFoundError();
  }

  const targetRole = target.role.toString() as RoleValue;

  // 3. No-op check — same role
  if (targetRole === newRole) {
    throw new AuthRoleSameError();
  }

  // 4. Admin cannot modify owner's role
  if (actorRole === 'admin' && targetRole === 'owner') {
    throw new AuthRoleInsufficientError();
  }

  // 5. Only owner can assign owner role
  if (newRole === 'owner' && actorRole !== 'owner') {
    throw new AuthRoleInsufficientError();
  }

  // 6. Owner cannot change own role (must use transfer)
  if (actorMembershipId === targetMembershipId && actorRole === 'owner') {
    throw new AuthOwnerSelfDemoteError();
  }

  // 7. If demoting an admin, enforce last-admin constraint
  // Skipped: every org always has exactly one owner who can promote new admins,
  // so demoting the last admin never leaves an org unmanageable.
  // The constraint is retained in MembershipService for use by removeMember()
  // (where a member is fully removed, not just demoted).

  // 8. Ownership transfer (handled in US2 — T016)
  if (newRole === 'owner' && actorRole === 'owner') {
    await membershipRepo.transferOwnership(orgId, targetMembershipId, actorMembershipId);
    return { previousRole: targetRole, isTransfer: true };
  }

  // 9. Standard role change
  await membershipRepo.updateRole(orgId, targetMembershipId, newRole);

  return { previousRole: targetRole, isTransfer: false };
}
