import { describe, expect, it } from 'vitest';

import { requireRole } from './role-predicates.js';

describe('requireRole', () => {
  describe('minimum check', () => {
    it('owner meets minimum owner', () => {
      expect(requireRole('owner', { minimum: 'owner' })).toBe(true);
    });

    it('admin does not meet minimum owner', () => {
      expect(requireRole('admin', { minimum: 'owner' })).toBe(false);
    });

    it('member does not meet minimum owner', () => {
      expect(requireRole('member', { minimum: 'owner' })).toBe(false);
    });

    it('owner meets minimum admin', () => {
      expect(requireRole('owner', { minimum: 'admin' })).toBe(true);
    });

    it('admin meets minimum admin', () => {
      expect(requireRole('admin', { minimum: 'admin' })).toBe(true);
    });

    it('member does not meet minimum admin', () => {
      expect(requireRole('member', { minimum: 'admin' })).toBe(false);
    });

    it('owner meets minimum member', () => {
      expect(requireRole('owner', { minimum: 'member' })).toBe(true);
    });

    it('admin meets minimum member', () => {
      expect(requireRole('admin', { minimum: 'member' })).toBe(true);
    });

    it('member meets minimum member', () => {
      expect(requireRole('member', { minimum: 'member' })).toBe(true);
    });
  });

  describe('exact check', () => {
    it('owner matches exact owner', () => {
      expect(requireRole('owner', { exact: 'owner' })).toBe(true);
    });

    it('admin does not match exact owner', () => {
      expect(requireRole('admin', { exact: 'owner' })).toBe(false);
    });

    it('admin matches exact admin', () => {
      expect(requireRole('admin', { exact: 'admin' })).toBe(true);
    });

    it('owner does not match exact admin', () => {
      expect(requireRole('owner', { exact: 'admin' })).toBe(false);
    });

    it('member matches exact member', () => {
      expect(requireRole('member', { exact: 'member' })).toBe(true);
    });

    it('owner does not match exact member', () => {
      expect(requireRole('owner', { exact: 'member' })).toBe(false);
    });

    it('admin does not match exact member', () => {
      expect(requireRole('admin', { exact: 'member' })).toBe(false);
    });
  });

  describe('invalid roles', () => {
    it('returns false for unknown role', () => {
      expect(requireRole('superadmin', { minimum: 'member' })).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(requireRole('', { minimum: 'member' })).toBe(false);
    });
  });
});
