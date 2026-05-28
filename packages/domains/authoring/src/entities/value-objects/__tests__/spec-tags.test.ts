import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorSpecTagsInvalidError } from '../../../errors/index.js';
import { SpecTag } from '../spec-tag.js';
import { SpecTags } from '../spec-tags.js';

describe('SpecTag', () => {
  it('transforms to kebab-case', () => {
    const tag = SpecTag.create('Smoke Test');
    expect(tag.value).toBe('smoke-test');
  });

  it('preserves already-kebab input', () => {
    const tag = SpecTag.create('smoke-test');
    expect(tag.value).toBe('smoke-test');
  });

  it('handles underscores and mixed case', () => {
    const tag = SpecTag.create('My_Test_Case');
    expect(tag.value).toBe('my-test-case');
  });

  it('rejects empty tag after transform', () => {
    expect(() => SpecTag.create('!!!')).toThrow(AuthorSpecTagsInvalidError);
    try {
      SpecTag.create('!!!');
    } catch (e) {
      expect((e as AuthorSpecTagsInvalidError).code).toBe(ErrorCode.AUTHOR_SPEC_TAGS_INVALID);
    }
  });

  it('accepts tag at exactly 30 chars', () => {
    const tag = SpecTag.create('a'.repeat(30));
    expect(tag.value).toBe('a'.repeat(30));
  });

  it('rejects tag exceeding 30 chars', () => {
    expect(() => SpecTag.create('a'.repeat(31))).toThrow(AuthorSpecTagsInvalidError);
  });

  it('compares equality', () => {
    const a = SpecTag.create('smoke-test');
    const b = SpecTag.create('Smoke Test');
    const c = SpecTag.create('regression');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const tag = SpecTag.create('Smoke Test');
    expect(tag.toString()).toBe('smoke-test');
  });
});

describe('SpecTags', () => {
  it('creates from array of strings', () => {
    const tags = SpecTags.create(['smoke', 'regression', 'api']);
    expect(tags.toArray()).toEqual(['smoke', 'regression', 'api']);
    expect(tags.length).toBe(3);
  });

  it('deduplicates tags by value', () => {
    const tags = SpecTags.create(['Smoke Test', 'smoke-test', 'regression']);
    expect(tags.toArray()).toEqual(['smoke-test', 'regression']);
    expect(tags.length).toBe(2);
  });

  it('accepts exactly 10 unique tags', () => {
    const raw = Array.from({ length: 10 }, (_, i) => `tag-${i}`);
    const tags = SpecTags.create(raw);
    expect(tags.length).toBe(10);
  });

  it('rejects more than 10 unique tags', () => {
    const raw = Array.from({ length: 11 }, (_, i) => `tag-${i}`);
    expect(() => SpecTags.create(raw)).toThrow(AuthorSpecTagsInvalidError);
  });

  it('allows 12 raw tags that deduplicate to 10 unique', () => {
    const raw = Array.from({ length: 10 }, (_, i) => `tag-${i}`);
    raw.push('tag-0', 'tag-1'); // duplicates
    const tags = SpecTags.create(raw);
    expect(tags.length).toBe(10);
  });

  it('creates empty tags', () => {
    const tags = SpecTags.create([]);
    expect(tags.toArray()).toEqual([]);
    expect(tags.length).toBe(0);
  });
});
