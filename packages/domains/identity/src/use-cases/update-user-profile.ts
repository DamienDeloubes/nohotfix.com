import type { UpdateUserProfileDto } from '@releasepilot/shared';

import { AuthUserNotFoundError } from '../errors/index.js';
import type { UserRepository } from '../ports/repositories.js';

export interface UpdateUserProfileDeps {
  userRepo: UserRepository;
}

export interface UpdateUserProfileCommand {
  userId: string;
  firstName: string;
  lastName: string;
}

export async function updateUserProfile(deps: UpdateUserProfileDeps, input: UpdateUserProfileCommand): Promise<UpdateUserProfileDto> {
  const existing = await deps.userRepo.findById(input.userId);
  if (!existing) {
    throw new AuthUserNotFoundError({ userId: input.userId });
  }

  const updated = existing.updateProfile({ firstName: input.firstName, lastName: input.lastName });

  const saved = await deps.userRepo.update(updated.id, {
    firstName: updated.firstName!.toString(),
    lastName: updated.lastName!.toString(),
  });

  if (!saved) {
    throw new AuthUserNotFoundError({ userId: input.userId });
  }

  return {
    id: saved.id,
    email: saved.email.toString(),
    firstName: saved.firstName?.toString() ?? null,
    lastName: saved.lastName?.toString() ?? null,
    updatedAt: saved.updatedAt.toISOString(),
  };
}
