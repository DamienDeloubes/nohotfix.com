import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@nohotfix/shared';

import { AuthorSpecTitleInvalidError } from '../../errors/index.js';
import { SpecTitle } from '../value-objects/spec-title.js';

describe('SpecTitle', () => {
  it('creates a valid title', () => {
    const title = SpecTitle.create('Login smoke test');
    expect(title.value).toBe('Login smoke test');
  });

  it('trims whitespace', () => {
    const title = SpecTitle.create('  padded title  ');
    expect(title.value).toBe('padded title');
  });

  it('accepts a single character', () => {
    const title = SpecTitle.create('A');
    expect(title.value).toBe('A');
  });

  it('accepts exactly 200 characters', () => {
    const longTitle = 'a'.repeat(200);
    const title = SpecTitle.create(longTitle);
    expect(title.value).toBe(longTitle);
  });

  it('rejects empty string with AuthorSpecTitleInvalidError', () => {
    expect(() => SpecTitle.create('')).toThrow(AuthorSpecTitleInvalidError);
    try {
      SpecTitle.create('');
    } catch (e) {
      expect((e as AuthorSpecTitleInvalidError).code).toBe(ErrorCode.AUTHOR_SPEC_TITLE_INVALID);
    }
  });

  it('rejects whitespace-only string', () => {
    expect(() => SpecTitle.create('   ')).toThrow(AuthorSpecTitleInvalidError);
  });

  it('rejects 201 characters', () => {
    expect(() => SpecTitle.create('a'.repeat(201))).toThrow(AuthorSpecTitleInvalidError);
  });

  it('compares equality', () => {
    const a = SpecTitle.create('Same');
    const b = SpecTitle.create('Same');
    const c = SpecTitle.create('Different');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const title = SpecTitle.create('Test');
    expect(title.toString()).toBe('Test');
  });
});
