import type { MembershipEntity } from '../entities/membership.js';
import type { RoleValue } from '../entities/value-objects/role.js';

export interface MemberWithUserDto {
  membershipId: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: RoleValue;
  joinedAt: Date;
}

export interface MembershipRepository {
  findMembersWithUsers(orgId: string): Promise<MemberWithUserDto[]>;
  findByOrg(orgId: string): Promise<MembershipEntity[]>;
  findByOrgAndUser(orgId: string, userId: string): Promise<MembershipEntity | undefined>;
  findByOrgAndEmail(orgId: string, email: string): Promise<MembershipEntity | undefined>;
  findByOrgAndId(orgId: string, id: string): Promise<MembershipEntity | undefined>;
  countAdmins(orgId: string): Promise<number>;
  create(data: { orgId: string; userId: string; role: RoleValue }): Promise<MembershipEntity>;
  updateRole(orgId: string, id: string, role: RoleValue): Promise<MembershipEntity | undefined>;
  transferOwnership(orgId: string, newOwnerId: string, previousOwnerId: string): Promise<void>;
  delete(orgId: string, id: string): Promise<boolean>;
}
