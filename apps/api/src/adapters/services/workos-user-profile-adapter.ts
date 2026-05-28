import { AuthProviderUnavailableError, AuthUserNotFoundError, type UserProfile, type UserProfileProvider } from '@nohotfix/domain-identity';
import type { WorkOS } from '@workos-inc/node';

export class WorkosUserProfileAdapter implements UserProfileProvider {
  constructor(private readonly workos: WorkOS) {}

  async getByWorkosId(workosUserId: string): Promise<UserProfile> {
    try {
      const user = await this.workos.userManagement.getUser(workosUserId);
      return {
        workosUserId: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        lastSignInAt: user.lastSignInAt,
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'NotFoundException') {
        throw new AuthUserNotFoundError({ workosUserId });
      }
      throw new AuthProviderUnavailableError({ cause: (err as Error).message });
    }
  }
}
