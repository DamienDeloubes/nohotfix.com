import { describe, expect, it } from 'vitest';

import { Severity } from '../value-objects/severity.js';

describe('Severity', () => {
  it.each(['critical', 'high', 'medium', 'low'])('creates valid severity "%s"', (value) => {
    const severity = Severity.create(value);
    expect(severity.value).toBe(value);
  });

  it('rejects unknown string', () => {
    expect(() => Severity.create('urgent')).toThrow('Invalid severity');
  });

  it('rejects empty string', () => {
    expect(() => Severity.create('')).toThrow('Invalid severity');
  });

  it('creates default as medium', () => {
    const severity = Severity.default();
    expect(severity.value).toBe('medium');
  });

  it('compares equality', () => {
    const a = Severity.create('high');
    const b = Severity.create('high');
    const c = Severity.create('low');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    expect(Severity.create('critical').toString()).toBe('critical');
  });
});
