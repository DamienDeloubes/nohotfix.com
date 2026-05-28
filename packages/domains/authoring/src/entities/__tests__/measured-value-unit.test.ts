import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { MeasuredValueUnit } from '../value-objects/measured-value-unit.js';

describe('MeasuredValueUnit', () => {
  it.each(['ms', 's', '%', 'MB', 'GB', 'req/s'] as const)('creates with valid unit: %s', (unit) => {
    const vu = MeasuredValueUnit.create(unit);
    expect(vu.value).toBe(unit);
  });

  it('rejects invalid unit string', () => {
    expect(() => MeasuredValueUnit.create('bytes')).toThrow(AuthorArtifactRequirementsInvalidError);
    try {
      MeasuredValueUnit.create('bytes');
    } catch (e) {
      expect((e as AuthorArtifactRequirementsInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID);
    }
  });

  it('rejects empty string', () => {
    expect(() => MeasuredValueUnit.create('')).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('is case sensitive (MS is not valid)', () => {
    expect(() => MeasuredValueUnit.create('MS')).toThrow(AuthorArtifactRequirementsInvalidError);
    expect(() => MeasuredValueUnit.create('Mb')).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('equals returns true for same unit', () => {
    const a = MeasuredValueUnit.create('ms');
    const b = MeasuredValueUnit.create('ms');
    expect(a.equals(b)).toBe(true);
  });

  it('equals returns false for different units', () => {
    const a = MeasuredValueUnit.create('ms');
    const b = MeasuredValueUnit.create('s');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns the unit value', () => {
    expect(MeasuredValueUnit.create('req/s').toString()).toBe('req/s');
    expect(MeasuredValueUnit.create('%').toString()).toBe('%');
  });
});
