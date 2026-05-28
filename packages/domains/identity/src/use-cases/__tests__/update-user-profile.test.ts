import { describe, expect, it, vi } from 'vitest';

import { UserEntity } from '../../entities/user.js';
import { Email } from '../../entities/value-objects/email.js';
import { FirstName } from '../../entities/value-objects/first-name.js';
import { LastName } from '../../entities/value-objects/last-name.js';
import { WorkosUserId } from '../../entities/value-objects/workos-user-id.js';
import { AuthUserFirstNameInvalidError, AuthUserLastNameInvalidError, AuthUserNotFoundError } from '../../errors/index.js';
import type { UserRepository } from '../../ports/repositories.js';
import { updateUserProfile } from '../update-user-profile.js';

const now = new Date();

function createUser(overrides?: { firstName?: string; lastName?: string }): UserEntity {
  return UserEntity.reconstitute({
    id: 'usr_1',
    workosUserId: WorkosUserId.create('wos_123'),
    email: Email.create('test@example.com'),
    firstName: overrides?.firstName ? FirstName.create(overrides.firstName) : null,
    lastName: overrides?.lastName ? LastName.create(overrides.lastName) : null,
    createdAt: now,
    updatedAt: now,
  });
}

function mockUserRepo(existing?: UserEntity): UserRepository {
  const updated = existing
    ? UserEntity.reconstitute({
        id: existing.id,
        workosUserId: existing.workosUserId,
        email: existing.email,
        firstName: FirstName.create('New'),
        lastName: LastName.create('Name'),
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      })
    : undefined;

  return {
    findById: vi.fn().mockResolvedValue(existing ?? undefined),
    findByWorkosId: vi.fn(),
    upsertByWorkosId: vi.fn(),
    update: vi.fn().mockResolvedValue(updated),
  };
}

describe('updateUserProfile', () => {
  it('updates firstName and lastName successfully', async () => {
    const user = createUser({ firstName: 'Old', lastName: 'Name' });
    const repo = mockUserRepo(user);

    const result = await updateUserProfile({ userRepo: repo }, { userId: 'usr_1', firstName: 'New', lastName: 'Name' });

    expect(repo.findById).toHaveBeenCalledWith('usr_1');
    expect(repo.update).toHaveBeenCalledWith('usr_1', { firstName: 'New', lastName: 'Name' });
    expect(result.id).toBe('usr_1');
    expect(result.email).toBe('test@example.com');
    expect(result.firstName).toBe('New');
    expect(result.lastName).toBe('Name');
    expect(result.updatedAt).toBeDefined();
  });

  it('throws AuthUserNotFoundError when user does not exist', async () => {
    const repo = mockUserRepo(undefined);

    await expect(updateUserProfile({ userRepo: repo }, { userId: 'usr_missing', firstName: 'Jane', lastName: 'Doe' })).rejects.toThrow(AuthUserNotFoundError);
  });

  it('throws AuthUserFirstNameInvalidError for empty firstName', async () => {
    const user = createUser({ firstName: 'Old', lastName: 'Name' });
    const repo = mockUserRepo(user);

    await expect(updateUserProfile({ userRepo: repo }, { userId: 'usr_1', firstName: '', lastName: 'Doe' })).rejects.toThrow(AuthUserFirstNameInvalidError);
  });

  it('throws AuthUserLastNameInvalidError for empty lastName', async () => {
    const user = createUser({ firstName: 'Old', lastName: 'Name' });
    const repo = mockUserRepo(user);

    await expect(updateUserProfile({ userRepo: repo }, { userId: 'usr_1', firstName: 'Jane', lastName: '' })).rejects.toThrow(AuthUserLastNameInvalidError);
  });

  it('throws AuthUserFirstNameInvalidError for whitespace-only firstName', async () => {
    const user = createUser({ firstName: 'Old', lastName: 'Name' });
    const repo = mockUserRepo(user);

    await expect(updateUserProfile({ userRepo: repo }, { userId: 'usr_1', firstName: '   ', lastName: 'Doe' })).rejects.toThrow(AuthUserFirstNameInvalidError);
  });

  it('throws AuthUserFirstNameInvalidError for firstName exceeding 50 chars', async () => {
    const user = createUser({ firstName: 'Old', lastName: 'Name' });
    const repo = mockUserRepo(user);

    await expect(updateUserProfile({ userRepo: repo }, { userId: 'usr_1', firstName: 'a'.repeat(51), lastName: 'Doe' })).rejects.toThrow(AuthUserFirstNameInvalidError);
  });
});
