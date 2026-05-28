import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@nohotfix/shared';

import { AuthorSpecTitleInvalidError } from '../../../errors/index.js';
import { SpecTitle } from '../spec-title.js';

describe('SpecTitle', () => {
  it('creates a valid title', () => {
    const title = SpecTitle.create('My Spec');
    expect(title.value).toBe('My Spec');
  });

  it('trims whitespace', () => {
    const title = SpecTitle.create('  padded  ');
    expect(title.value).toBe('padded');
  });

  it('accepts 1 character', () => {
    const title = SpecTitle.create('X');
    expect(title.value).toBe('X');
  });

  it('accepts exactly 200 characters', () => {
    const value = 'a'.repeat(200);
    const title = SpecTitle.create(value);
    expect(title.value).toBe(value);
  });

  it('throws AuthorSpecTitleInvalidError for empty string', () => {
    expect(() => SpecTitle.create('')).toThrow(AuthorSpecTitleInvalidError);
    try {
      SpecTitle.create('');
    } catch (e) {
      expect((e as AuthorSpecTitleInvalidError).code).toBe(ErrorCode.AUTHOR_SPEC_TITLE_INVALID);
    }
  });

  it('throws AuthorSpecTitleInvalidError for whitespace-only string', () => {
    expect(() => SpecTitle.create('   ')).toThrow(AuthorSpecTitleInvalidError);
  });

  it('throws AuthorSpecTitleInvalidError for 201 characters', () => {
    expect(() => SpecTitle.create('a'.repeat(201))).toThrow(AuthorSpecTitleInvalidError);
  });

  it('equals another SpecTitle with the same value', () => {
    const a = SpecTitle.create('Same');
    const b = SpecTitle.create('Same');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal a SpecTitle with a different value', () => {
    const a = SpecTitle.create('First');
    const b = SpecTitle.create('Second');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns the value', () => {
    const title = SpecTitle.create('Test');
    expect(title.toString()).toBe('Test');
  });
});
