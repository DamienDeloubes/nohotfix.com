import { describe, expect, it } from 'vitest';

import { AuthorArtifactLabelInvalidError, AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { FileArtifactRequirement } from '../value-objects/file-artifact-requirement.js';

describe('FileArtifactRequirement', () => {
  it('creates with all fields', () => {
    const req = FileArtifactRequirement.create({
      index: 0,
      label: 'Screenshot of confirmation page',
      description: 'Upload a PNG screenshot',
      required: true,
    });
    expect(req.type).toBe('file');
    expect(req.index).toBe(0);
    expect(req.label.value).toBe('Screenshot of confirmation page');
    expect(req.description.value).toBe('Upload a PNG screenshot');
    expect(req.required).toBe(true);
  });

  it('creates with only label', () => {
    const req = FileArtifactRequirement.create({ index: 0, label: 'Upload file' });
    expect(req.type).toBe('file');
    expect(req.label.value).toBe('Upload file');
    expect(req.description.value).toBeNull();
    expect(req.required).toBe(false);
  });

  it('trims label whitespace', () => {
    const req = FileArtifactRequirement.create({ index: 0, label: '  padded  ' });
    expect(req.label.value).toBe('padded');
  });

  it('accepts label at 200 characters', () => {
    const label = 'a'.repeat(200);
    const req = FileArtifactRequirement.create({ index: 0, label });
    expect(req.label.value).toBe(label);
  });

  it('rejects label exceeding 200 characters', () => {
    expect(() => FileArtifactRequirement.create({ index: 0, label: 'a'.repeat(201) })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('rejects empty label', () => {
    expect(() => FileArtifactRequirement.create({ index: 0, label: '' })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('rejects whitespace-only label', () => {
    expect(() => FileArtifactRequirement.create({ index: 0, label: '   ' })).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('accepts description at 1000 characters', () => {
    const desc = 'b'.repeat(1000);
    const req = FileArtifactRequirement.create({ index: 0, label: 'Test', description: desc });
    expect(req.description.value).toBe(desc);
  });

  it('rejects description exceeding 1000 characters', () => {
    expect(() => FileArtifactRequirement.create({ index: 0, label: 'Test', description: 'b'.repeat(1001) })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('normalises whitespace-only description to null', () => {
    const req = FileArtifactRequirement.create({ index: 0, label: 'Test', description: '   ' });
    expect(req.description.value).toBeNull();
  });

  it('defaults required to false', () => {
    const req = FileArtifactRequirement.create({ index: 0, label: 'Test' });
    expect(req.required).toBe(false);
  });

  it('serialises to JSON via toJson()', () => {
    const req = FileArtifactRequirement.create({
      index: 2,
      label: 'Error log',
      description: 'Upload the log file',
      required: true,
    });
    expect(req.toJson()).toEqual({
      index: 2,
      type: 'file',
      label: 'Error log',
      description: 'Upload the log file',
      required: true,
    });
  });

  it('compares equality', () => {
    const a = FileArtifactRequirement.create({ index: 0, label: 'Same', required: true });
    const b = FileArtifactRequirement.create({ index: 0, label: 'Same', required: true });
    const c = FileArtifactRequirement.create({ index: 0, label: 'Different', required: true });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const req = FileArtifactRequirement.create({ index: 1, label: 'Screenshot' });
    expect(req.toString()).toBe('FileArtifactRequirement(1: Screenshot)');
  });
});
