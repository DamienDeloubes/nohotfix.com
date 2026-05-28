import { describe, expect, it } from 'vitest';

import { TextArtifactRequirement } from '../value-objects/text-artifact-requirement.js';

describe('TextArtifactRequirement', () => {
  it('creates with valid data', () => {
    const req = TextArtifactRequirement.create({
      index: 0,
      label: 'Error log output',
      description: 'Include the full stack trace',
      required: true,
    });
    expect(req.index).toBe(0);
    expect(req.type).toBe('text');
    expect(req.label.value).toBe('Error log output');
    expect(req.description.value).toBe('Include the full stack trace');
    expect(req.required).toBe(true);
  });

  it('defaults required to false', () => {
    const req = TextArtifactRequirement.create({
      index: 1,
      label: 'Notes',
    });
    expect(req.required).toBe(false);
  });

  it('handles null description', () => {
    const req = TextArtifactRequirement.create({
      index: 0,
      label: 'Notes',
      description: null,
    });
    expect(req.description.value).toBeNull();
  });

  it('produces correct toJson() output', () => {
    const req = TextArtifactRequirement.create({
      index: 2,
      label: 'Error log',
      description: 'Full trace',
      required: true,
    });
    expect(req.toJson()).toEqual({
      index: 2,
      type: 'text',
      label: 'Error log',
      description: 'Full trace',
      required: true,
    });
  });

  it('produces toJson() with null description', () => {
    const req = TextArtifactRequirement.create({
      index: 0,
      label: 'Notes',
    });
    expect(req.toJson()).toEqual({
      index: 0,
      type: 'text',
      label: 'Notes',
      description: null,
      required: false,
    });
  });

  it('compares equality', () => {
    const a = TextArtifactRequirement.create({ index: 0, label: 'A', required: true });
    const b = TextArtifactRequirement.create({ index: 0, label: 'A', required: true });
    const c = TextArtifactRequirement.create({ index: 1, label: 'A', required: true });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const req = TextArtifactRequirement.create({ index: 0, label: 'My label' });
    expect(req.toString()).toBe('TextArtifactRequirement(0: My label)');
  });
});
