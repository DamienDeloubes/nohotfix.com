import { describe, expect, it } from 'vitest';

import { MembershipEntity } from '../membership.js';
import { Role } from '../value-objects/role.js';

describe('MembershipEntity', () => {
  it('creates with valid role', () => {
    const m = MembershipEntity.create({ id: 'm-1', orgId: 'org-1', userId: 'u-1', role: 'admin' });
    expect(m.id).toBe('m-1');
    expect(m.orgId).toBe('org-1');
    expect(m.userId).toBe('u-1');
    expect(m.role.value).toBe('admin');
    expect(m.createdAt).toBeInstanceOf(Date);
  });

  it('reconstitutes from props', () => {
    const now = new Date();
    const m = MembershipEntity.reconstitute({
      id: 'm-1',
      orgId: 'org-1',
      userId: 'u-1',
      role: Role.member(),
      createdAt: now,
    });
    expect(m.role.value).toBe('member');
    expect(m.createdAt).toBe(now);
  });

  it('isAdmin returns true for admin', () => {
    const m = MembershipEntity.create({ id: 'm-1', orgId: 'org-1', userId: 'u-1', role: 'admin' });
    expect(m.isAdmin()).toBe(true);
  });

  it('isAdmin returns false for member', () => {
    const m = MembershipEntity.create({ id: 'm-1', orgId: 'org-1', userId: 'u-1', role: 'member' });
    expect(m.isAdmin()).toBe(false);
  });

  it('changeRole returns new instance', () => {
    const m = MembershipEntity.create({ id: 'm-1', orgId: 'org-1', userId: 'u-1', role: 'admin' });
    const changed = m.changeRole('member');

    expect(changed).not.toBe(m);
    expect(changed.role.value).toBe('member');
    expect(m.role.value).toBe('admin');
    expect(changed.id).toBe(m.id);
    expect(changed.createdAt).toBe(m.createdAt);
  });

  it('changeRole throws on invalid role', () => {
    const m = MembershipEntity.create({ id: 'm-1', orgId: 'org-1', userId: 'u-1', role: 'admin' });
    expect(() => m.changeRole('superadmin')).toThrow('Invalid role');
  });
});
