import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorSpecStepInvalidError } from '../../errors/index.js';
import { TestStep } from '../value-objects/test-step.js';

describe('TestStep', () => {
  it('creates a valid test step with expected outcome', () => {
    const step = TestStep.create({ instruction: 'Click login', expectedOutcome: 'Form submits' });
    expect(step.instruction).toBe('Click login');
    expect(step.expectedOutcome).toBe('Form submits');
  });

  it('creates a valid test step without expected outcome', () => {
    const step = TestStep.create({ instruction: 'Click login' });
    expect(step.instruction).toBe('Click login');
    expect(step.expectedOutcome).toBeUndefined();
  });

  it('treats empty expected outcome as undefined', () => {
    const step = TestStep.create({ instruction: 'Click login', expectedOutcome: '   ' });
    expect(step.expectedOutcome).toBeUndefined();
  });

  it('trims whitespace', () => {
    const step = TestStep.create({ instruction: '  padded  ', expectedOutcome: '  result  ' });
    expect(step.instruction).toBe('padded');
    expect(step.expectedOutcome).toBe('result');
  });

  it('rejects empty instruction with AuthorSpecStepInvalidError', () => {
    expect(() => TestStep.create({ instruction: '', expectedOutcome: 'Valid' })).toThrow(AuthorSpecStepInvalidError);
    try {
      TestStep.create({ instruction: '' });
    } catch (e) {
      const err = e as AuthorSpecStepInvalidError;
      expect(err.code).toBe(ErrorCode.AUTHOR_SPEC_STEP_INVALID);
      expect(err.details?.field).toBe('instruction');
    }
  });

  it('rejects whitespace-only instruction', () => {
    expect(() => TestStep.create({ instruction: '   ', expectedOutcome: 'Valid' })).toThrow(AuthorSpecStepInvalidError);
  });

  it('accepts instruction at exactly 500 chars', () => {
    const step = TestStep.create({ instruction: 'a'.repeat(500) });
    expect(step.instruction).toBe('a'.repeat(500));
  });

  it('rejects instruction at 501 chars', () => {
    try {
      TestStep.create({ instruction: 'a'.repeat(501) });
      expect.unreachable();
    } catch (e) {
      const err = e as AuthorSpecStepInvalidError;
      expect(err).toBeInstanceOf(AuthorSpecStepInvalidError);
      expect(err.code).toBe(ErrorCode.AUTHOR_SPEC_STEP_INVALID);
      expect(err.details?.field).toBe('instruction');
      expect(err.details?.maxLength).toBe(500);
    }
  });

  it('accepts expectedOutcome at exactly 500 chars', () => {
    const step = TestStep.create({ instruction: 'Step', expectedOutcome: 'a'.repeat(500) });
    expect(step.expectedOutcome).toBe('a'.repeat(500));
  });

  it('rejects expectedOutcome at 501 chars', () => {
    try {
      TestStep.create({ instruction: 'Step', expectedOutcome: 'a'.repeat(501) });
      expect.unreachable();
    } catch (e) {
      const err = e as AuthorSpecStepInvalidError;
      expect(err).toBeInstanceOf(AuthorSpecStepInvalidError);
      expect(err.code).toBe(ErrorCode.AUTHOR_SPEC_STEP_INVALID);
      expect(err.details?.field).toBe('expectedOutcome');
      expect(err.details?.maxLength).toBe(500);
    }
  });

  it('compares equality', () => {
    const a = TestStep.create({ instruction: 'A', expectedOutcome: 'B' });
    const b = TestStep.create({ instruction: 'A', expectedOutcome: 'B' });
    const c = TestStep.create({ instruction: 'A', expectedOutcome: 'C' });
    const d = TestStep.create({ instruction: 'A' });
    const e = TestStep.create({ instruction: 'A' });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
    expect(d.equals(e)).toBe(true);
    expect(a.equals(d)).toBe(false);
  });

  it('converts to string with expected outcome', () => {
    const step = TestStep.create({ instruction: 'Do X', expectedOutcome: 'See Y' });
    expect(step.toString()).toBe('Do X → See Y');
  });

  it('converts to string without expected outcome', () => {
    const step = TestStep.create({ instruction: 'Do X' });
    expect(step.toString()).toBe('Do X');
  });
});
