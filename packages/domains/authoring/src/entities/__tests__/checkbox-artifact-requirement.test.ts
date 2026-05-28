import { describe, expect, it } from 'vitest';

import { AuthorArtifactLabelInvalidError } from '../../errors/index.js';
import { CheckboxArtifactRequirement } from '../value-objects/checkbox-artifact-requirement.js';

describe('CheckboxArtifactRequirement', () => {
  it('creates with valid label and required true', () => {
    const req = CheckboxArtifactRequirement.create({
      index: 0,
      label: 'I verified this in staging',
      required: true,
    });
    expect(req.type).toBe('checkbox');
    expect(req.index).toBe(0);
    expect(req.label.value).toBe('I verified this in staging');
    expect(req.required).toBe(true);
  });

  it('defaults required to false', () => {
    const req = CheckboxArtifactRequirement.create({ index: 0, label: 'Confirmed' });
    expect(req.required).toBe(false);
  });

  it('trims label whitespace', () => {
    const req = CheckboxArtifactRequirement.create({ index: 0, label: '  padded  ' });
    expect(req.label.value).toBe('padded');
  });

  it('accepts label at 200 characters', () => {
    const label = 'a'.repeat(200);
    const req = CheckboxArtifactRequirement.create({ index: 0, label });
    expect(req.label.value).toBe(label);
  });

  it('rejects label exceeding 200 characters', () => {
    expect(() => CheckboxArtifactRequirement.create({ index: 0, label: 'a'.repeat(201) })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('rejects empty label', () => {
    expect(() => CheckboxArtifactRequirement.create({ index: 0, label: '' })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('rejects whitespace-only label', () => {
    expect(() => CheckboxArtifactRequirement.create({ index: 0, label: '   ' })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('serialises to JSON via toJson() — no description key', () => {
    const req = CheckboxArtifactRequirement.create({
      index: 2,
      label: 'No regressions observed',
      required: true,
    });
    const json = req.toJson();
    expect(json).toEqual({
      index: 2,
      type: 'checkbox',
      label: 'No regressions observed',
      required: true,
    });
    expect('description' in json).toBe(false);
  });

  it('compares equality', () => {
    const a = CheckboxArtifactRequirement.create({ index: 0, label: 'Same', required: true });
    const b = CheckboxArtifactRequirement.create({ index: 0, label: 'Same', required: true });
    const c = CheckboxArtifactRequirement.create({ index: 0, label: 'Different', required: true });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const req = CheckboxArtifactRequirement.create({ index: 1, label: 'Verified' });
    expect(req.toString()).toBe('CheckboxArtifactRequirement(1: Verified)');
  });
});
