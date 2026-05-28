import { describe, expect, it } from 'vitest';

import { Email } from '../value-objects/email.js';

describe('Email', () => {
  it('creates from valid email', () => {
    const email = Email.create('Test@Example.COM');
    expect(email.value).toBe('test@example.com');
  });

  it('trims whitespace', () => {
    const email = Email.create('  user@test.com  ');
    expect(email.value).toBe('user@test.com');
  });

  it('throws on empty string', () => {
    expect(() => Email.create('')).toThrow('non-empty');
  });

  it('throws on invalid format', () => {
    expect(() => Email.create('not-an-email')).toThrow('Invalid email format');
  });

  it('throws on missing domain', () => {
    expect(() => Email.create('user@')).toThrow('Invalid email format');
  });

  it('throws on missing local part', () => {
    expect(() => Email.create('@domain.com')).toThrow('Invalid email format');
  });

  it('equals another Email with same value', () => {
    const a = Email.create('user@test.com');
    const b = Email.create('USER@test.com');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal different email', () => {
    const a = Email.create('a@test.com');
    const b = Email.create('b@test.com');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns value', () => {
    const email = Email.create('user@test.com');
    expect(email.toString()).toBe('user@test.com');
  });
});
