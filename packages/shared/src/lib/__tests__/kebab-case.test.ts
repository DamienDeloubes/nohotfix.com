import { describe, expect, it } from 'vitest';

import { toKebabCase } from '../kebab-case.js';

describe('toKebabCase', () => {
  it('lowercases input', () => {
    expect(toKebabCase('HELLO')).toBe('hello');
  });

  it('replaces spaces with hyphens', () => {
    expect(toKebabCase('smoke test')).toBe('smoke-test');
  });

  it('replaces underscores with hyphens', () => {
    expect(toKebabCase('smoke_test')).toBe('smoke-test');
  });

  it('handles mixed case with spaces', () => {
    expect(toKebabCase('Smoke Test')).toBe('smoke-test');
  });

  it('strips special characters', () => {
    expect(toKebabCase('hello@world!')).toBe('helloworld');
  });

  it('collapses consecutive hyphens', () => {
    expect(toKebabCase('hello---world')).toBe('hello-world');
  });

  it('trims leading hyphens', () => {
    expect(toKebabCase('---hello')).toBe('hello');
  });

  it('trims trailing hyphens', () => {
    expect(toKebabCase('hello---')).toBe('hello');
  });

  it('handles mixed special characters and spaces', () => {
    expect(toKebabCase('API Test @2024!')).toBe('api-test-2024');
  });

  it('returns empty string for empty input', () => {
    expect(toKebabCase('')).toBe('');
  });

  it('returns empty string for only special characters', () => {
    expect(toKebabCase('!@#$%')).toBe('');
  });

  it('preserves numbers', () => {
    expect(toKebabCase('test123')).toBe('test123');
  });

  it('handles multiple spaces and underscores together', () => {
    expect(toKebabCase('hello  _ _world')).toBe('hello-world');
  });
});
