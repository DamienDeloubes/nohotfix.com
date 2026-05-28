import { describe, expect, it } from 'vitest';

import { UserEntity } from '../user.js';
import { Email } from '../value-objects/email.js';
import { FirstName } from '../value-objects/first-name.js';
import { LastName } from '../value-objects/last-name.js';
import { WorkosUserId } from '../value-objects/workos-user-id.js';

describe('UserEntity', () => {
  it('creates with all fields', () => {
    const user = UserEntity.create({
      id: 'u-1',
      workosUserId: 'wos_123',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(user.id).toBe('u-1');
    expect(user.workosUserId.value).toBe('wos_123');
    expect(user.email.value).toBe('test@example.com');
    expect(user.firstName?.value).toBe('Jane');
    expect(user.lastName?.value).toBe('Doe');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('creates without names', () => {
    const user = UserEntity.create({ id: 'u-1', workosUserId: 'wos_123', email: 'test@example.com' });
    expect(user.firstName).toBeNull();
    expect(user.lastName).toBeNull();
  });

  it('reconstitutes from props', () => {
    const now = new Date();
    const user = UserEntity.reconstitute({
      id: 'u-1',
      workosUserId: WorkosUserId.create('wos_123'),
      email: Email.create('test@example.com'),
      firstName: FirstName.create('Jane'),
      lastName: LastName.create('Doe'),
      createdAt: now,
      updatedAt: now,
    });
    expect(user.id).toBe('u-1');
    expect(user.firstName?.value).toBe('Jane');
    expect(user.lastName?.value).toBe('Doe');
  });

  it('updateProfile returns new instance with updated firstName', () => {
    const user = UserEntity.create({ id: 'u-1', workosUserId: 'wos_123', email: 'test@test.com', firstName: 'Old' });
    const updated = user.updateProfile({ firstName: 'New' });

    expect(updated).not.toBe(user);
    expect(updated.firstName?.value).toBe('New');
    expect(user.firstName?.value).toBe('Old');
  });

  it('updateProfile returns new instance with updated lastName', () => {
    const user = UserEntity.create({ id: 'u-1', workosUserId: 'wos_123', email: 'test@test.com' });
    const updated = user.updateProfile({ lastName: 'Smith' });

    expect(updated.lastName?.value).toBe('Smith');
    expect(user.lastName).toBeNull();
  });

  it('updateProfile preserves unchanged fields', () => {
    const user = UserEntity.create({
      id: 'u-1',
      workosUserId: 'wos_123',
      email: 'test@test.com',
      firstName: 'Keep',
      lastName: 'This',
    });
    const updated = user.updateProfile({ firstName: 'Changed' });
    expect(updated.lastName?.value).toBe('This');
    expect(updated.workosUserId.value).toBe('wos_123');
    expect(updated.createdAt).toBe(user.createdAt);
  });
});
