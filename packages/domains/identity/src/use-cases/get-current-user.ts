import type { UserRepository } from '../ports/repositories.js';
import type { UserProfile, UserProfileProvider } from '../ports/user-profile-provider.js';

// import { syncUserFromJwt } from './sync-user-from-jwt.js';

export interface GetCurrentUserDeps {
  userProfileProvider: UserProfileProvider;
  userRepo: UserRepository;
}

export type GetCurrentUserOutput = UserProfile;

export async function getCurrentUser(deps: GetCurrentUserDeps, input: { workosUserId: string }): Promise<GetCurrentUserOutput> {
  return deps.userProfileProvider.getByWorkosId(input.workosUserId);
}
