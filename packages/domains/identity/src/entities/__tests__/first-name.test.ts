import { describe, expect, it } from 'vitest';

import { AuthUserFirstNameInvalidError } from '../../errors/index.js';
import { FirstName } from '../value-objects/first-name.js';

describe('FirstName', () => {
  it('creates from valid name', () => {
    const name = FirstName.create('Jane');
    expect(name.value).toBe('Jane');
  });

  it('trims whitespace', () => {
    const name = FirstName.create('  Jane  ');
    expect(name.value).toBe('Jane');
  });

  it('throws on empty string', () => {
    expect(() => FirstName.create('')).toThrow(AuthUserFirstNameInvalidError);
  });

  it('throws on whitespace-only string', () => {
    expect(() => FirstName.create('   ')).toThrow(AuthUserFirstNameInvalidError);
  });

  it('throws on name exceeding 50 chars', () => {
    expect(() => FirstName.create('a'.repeat(51))).toThrow(AuthUserFirstNameInvalidError);
  });

  it('allows exactly 50 chars', () => {
    const name = FirstName.create('a'.repeat(50));
    expect(name.value.length).toBe(50);
  });

  it('equals same name', () => {
    const a = FirstName.create('Jane');
    const b = FirstName.create('Jane');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal different name', () => {
    const a = FirstName.create('Jane');
    const b = FirstName.create('John');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns value', () => {
    expect(FirstName.create('Jane').toString()).toBe('Jane');
  });
});
