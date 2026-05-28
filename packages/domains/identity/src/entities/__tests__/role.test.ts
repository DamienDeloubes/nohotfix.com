import { describe, expect, it } from 'vitest';

import { Role } from '../value-objects/role.js';

describe('Role', () => {
  it('creates admin role', () => {
    const role = Role.create('admin');
    expect(role.value).toBe('admin');
  });

  it('creates member role', () => {
    const role = Role.create('member');
    expect(role.value).toBe('member');
  });

  it('throws on invalid role', () => {
    expect(() => Role.create('superadmin')).toThrow('Invalid role');
  });

  it('admin() factory returns admin', () => {
    expect(Role.admin().value).toBe('admin');
  });

  it('member() factory returns member', () => {
    expect(Role.member().value).toBe('member');
  });

  it('isAdmin() returns true for admin', () => {
    expect(Role.admin().isAdmin()).toBe(true);
  });

  it('isAdmin() returns false for member', () => {
    expect(Role.member().isAdmin()).toBe(false);
  });

  it('equals same role', () => {
    expect(Role.admin().equals(Role.create('admin'))).toBe(true);
  });

  it('does not equal different role', () => {
    expect(Role.admin().equals(Role.member())).toBe(false);
  });

  it('toString returns value', () => {
    expect(Role.admin().toString()).toBe('admin');
  });
});
