import { DomainError, type UserDto } from '@releasepilot/shared';

import type { UserEntity } from '../entities/user.js';
import { AuthProviderUnavailableError, AuthUserProvisionFailedError } from '../errors/index.js';
import type { UserRepository } from '../ports/repositories.js';
import type { UserProfileProvider } from '../ports/user-profile-provider.js';

export interface ResolveUserFromJwtDeps {
  userRepo: UserRepository;
  userProfileProvider: UserProfileProvider;
}

export interface ResolveUserFromJwtCommand {
  workosUserId: string;
}

export async function resolveUserFromJwt(deps: ResolveUserFromJwtDeps, input: ResolveUserFromJwtCommand): Promise<UserDto> {
  const existing = await deps.userRepo.findByWorkosId(input.workosUserId);
  if (existing) {
    return toOutput(existing);
  }

  // First encounter — fetch profile from WorkOS
  let profile;
  try {
    profile = await deps.userProfileProvider.getByWorkosId(input.workosUserId);
  } catch (err) {
    if (err instanceof DomainError) throw err;
    throw new AuthProviderUnavailableError({ cause: (err as Error).message, operation: 'getUser', workosUserId: input.workosUserId });
  }

  let user;
  try {
    user = await deps.userRepo.upsertByWorkosId({
      workosUserId: input.workosUserId,
      email: profile.email,
      ...(profile.firstName ? { firstName: profile.firstName } : {}),
      ...(profile.lastName ? { lastName: profile.lastName } : {}),
    });
  } catch (err) {
    if (err instanceof DomainError) throw err;
    throw new AuthUserProvisionFailedError({ cause: (err as Error).message, workosUserId: input.workosUserId });
  }

  return toOutput(user);
}

function toOutput(user: UserEntity): UserDto {
  return {
    id: user.id,
    workosUserId: user.workosUserId.toString(),
    email: user.email.toString(),
    firstName: user.firstName?.toString() ?? null,
    lastName: user.lastName?.toString() ?? null,
  };
}
