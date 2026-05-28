import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorSpecDurationInvalidError } from '../../../errors/index.js';
import { EstimatedDuration } from '../estimated-duration.js';

describe('EstimatedDuration', () => {
  it('creates a valid duration of 1 minute', () => {
    const d = EstimatedDuration.create(1);
    expect(d.value).toBe(1);
  });

  it('creates a valid duration of 500 minutes', () => {
    const d = EstimatedDuration.create(500);
    expect(d.value).toBe(500);
  });

  it('creates a valid duration of 999 minutes', () => {
    const d = EstimatedDuration.create(999);
    expect(d.value).toBe(999);
  });

  it('rejects zero', () => {
    expect(() => EstimatedDuration.create(0)).toThrow(AuthorSpecDurationInvalidError);
    try {
      EstimatedDuration.create(0);
    } catch (e) {
      expect((e as AuthorSpecDurationInvalidError).code).toBe(ErrorCode.AUTHOR_SPEC_DURATION_INVALID);
    }
  });

  it('rejects 1000', () => {
    expect(() => EstimatedDuration.create(1000)).toThrow(AuthorSpecDurationInvalidError);
  });

  it('rejects negative values', () => {
    expect(() => EstimatedDuration.create(-5)).toThrow(AuthorSpecDurationInvalidError);
  });

  it('rejects non-integer values', () => {
    expect(() => EstimatedDuration.create(2.5)).toThrow(AuthorSpecDurationInvalidError);
  });

  it('compares equality', () => {
    const a = EstimatedDuration.create(30);
    const b = EstimatedDuration.create(30);
    const c = EstimatedDuration.create(60);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const d = EstimatedDuration.create(45);
    expect(d.toString()).toBe('45');
  });
});
