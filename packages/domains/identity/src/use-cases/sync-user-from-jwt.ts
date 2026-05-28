import type { UserEntity } from '../entities/user.js';
import type { UserRepository } from '../ports/repositories.js';

export interface SyncUserFromJwtDeps {
  userRepo: UserRepository;
}

export async function syncUserFromJwt(deps: SyncUserFromJwtDeps, data: { workosUserId: string; email: string; firstName?: string; lastName?: string }): Promise<UserEntity> {
  return deps.userRepo.upsertByWorkosId(data);
}
