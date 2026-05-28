import { describe, expect, it } from 'vitest';

import { AuthUserLastNameInvalidError } from '../../errors/index.js';
import { LastName } from '../value-objects/last-name.js';

describe('LastName', () => {
  it('creates from valid name', () => {
    const name = LastName.create('Doe');
    expect(name.value).toBe('Doe');
  });

  it('trims whitespace', () => {
    const name = LastName.create('  Doe  ');
    expect(name.value).toBe('Doe');
  });

  it('throws on empty string', () => {
    expect(() => LastName.create('')).toThrow(AuthUserLastNameInvalidError);
  });

  it('throws on whitespace-only string', () => {
    expect(() => LastName.create('   ')).toThrow(AuthUserLastNameInvalidError);
  });

  it('throws on name exceeding 50 chars', () => {
    expect(() => LastName.create('a'.repeat(51))).toThrow(AuthUserLastNameInvalidError);
  });

  it('allows exactly 50 chars', () => {
    const name = LastName.create('a'.repeat(50));
    expect(name.value.length).toBe(50);
  });

  it('equals same name', () => {
    const a = LastName.create('Doe');
    const b = LastName.create('Doe');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal different name', () => {
    const a = LastName.create('Doe');
    const b = LastName.create('Smith');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns value', () => {
    expect(LastName.create('Doe').toString()).toBe('Doe');
  });
});
