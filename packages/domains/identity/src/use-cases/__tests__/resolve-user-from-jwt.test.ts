import { describe, expect, it, vi } from 'vitest';

import { UserEntity } from '../../entities/user.js';
import { Email } from '../../entities/value-objects/email.js';
import { FirstName } from '../../entities/value-objects/first-name.js';
import { LastName } from '../../entities/value-objects/last-name.js';
import { WorkosUserId } from '../../entities/value-objects/workos-user-id.js';
import type { UserRepository } from '../../ports/repositories.js';
import type { UserProfileProvider } from '../../ports/user-profile-provider.js';
import { resolveUserFromJwt } from '../resolve-user-from-jwt.js';

const fakeUser = UserEntity.reconstitute({
  id: 'usr_1',
  workosUserId: WorkosUserId.create('user_workos_1'),
  email: Email.create('test@example.com'),
  firstName: FirstName.create('Test'),
  lastName: LastName.create('User'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

function mockUserRepo(existing?: UserEntity): UserRepository {
  return {
    findById: vi.fn(),
    findByWorkosId: vi.fn().mockResolvedValue(existing ?? undefined),
    upsertByWorkosId: vi.fn().mockResolvedValue(fakeUser),
    update: vi.fn(),
  };
}

function mockProfileProvider(): UserProfileProvider {
  return {
    getByWorkosId: vi.fn().mockResolvedValue({
      workosUserId: 'user_workos_1',
      email: 'test@example.com',
      emailVerified: true,
      firstName: 'Test',
      lastName: 'User',
      profilePictureUrl: null,
      lastSignInAt: null,
    }),
  };
}

describe('resolveUserFromJwt', () => {
  it('returns existing user from database lookup', async () => {
    const userRepo = mockUserRepo(fakeUser);
    const profileProvider = mockProfileProvider();

    const result = await resolveUserFromJwt({ userRepo, userProfileProvider: profileProvider }, { workosUserId: 'user_workos_1' });

    expect(result.id).toBe('usr_1');
    expect(result.email).toBe('test@example.com');
    expect(profileProvider.getByWorkosId).not.toHaveBeenCalled();
  });

  it('fetches from WorkOS and upserts on first encounter', async () => {
    const userRepo = mockUserRepo(undefined);
    const profileProvider = mockProfileProvider();

    const result = await resolveUserFromJwt({ userRepo, userProfileProvider: profileProvider }, { workosUserId: 'user_workos_1' });

    expect(result.id).toBe('usr_1');
    expect(profileProvider.getByWorkosId).toHaveBeenCalledWith('user_workos_1');
    expect(userRepo.upsertByWorkosId).toHaveBeenCalledWith({
      workosUserId: 'user_workos_1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  });
});
