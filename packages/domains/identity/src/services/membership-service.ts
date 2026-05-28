import { AuthLastAdminError } from '../errors/index.js';
import type { MembershipRepository } from '../ports/repositories.js';

export class MembershipService {
  constructor(private readonly membershipRepo: MembershipRepository) {}

  async enforceLastAdminConstraint(orgId: string, targetUserId: string): Promise<void> {
    const membership = await this.membershipRepo.findByOrgAndUser(orgId, targetUserId);
    if (!membership || !membership.isAdmin()) {
      return;
    }

    const adminCount = await this.membershipRepo.countAdmins(orgId);
    if (adminCount <= 1) {
      throw new AuthLastAdminError();
    }
  }
}
