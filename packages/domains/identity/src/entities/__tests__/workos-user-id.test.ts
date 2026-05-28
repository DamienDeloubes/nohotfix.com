import { describe, expect, it } from 'vitest';

import { WorkosUserId } from '../value-objects/workos-user-id.js';

describe('WorkosUserId', () => {
  it('creates from valid string', () => {
    const id = WorkosUserId.create('user_01ABC');
    expect(id.value).toBe('user_01ABC');
  });

  it('trims whitespace', () => {
    const id = WorkosUserId.create('  user_01ABC  ');
    expect(id.value).toBe('user_01ABC');
  });

  it('throws on empty string', () => {
    expect(() => WorkosUserId.create('')).toThrow('non-empty');
  });

  it('throws on whitespace-only string', () => {
    expect(() => WorkosUserId.create('   ')).toThrow('non-empty');
  });

  it('equals same ID', () => {
    const a = WorkosUserId.create('user_01');
    const b = WorkosUserId.create('user_01');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal different ID', () => {
    const a = WorkosUserId.create('user_01');
    const b = WorkosUserId.create('user_02');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns value', () => {
    expect(WorkosUserId.create('user_01').toString()).toBe('user_01');
  });
});
