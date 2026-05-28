import type { UserEntity } from '../entities/user.js';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | undefined>;
  findByWorkosId(workosUserId: string): Promise<UserEntity | undefined>;
  upsertByWorkosId(data: { workosUserId: string; email: string; firstName?: string; lastName?: string }): Promise<UserEntity>;
  update(id: string, data: { firstName?: string; lastName?: string }): Promise<UserEntity | undefined>;
}
