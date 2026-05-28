import { describe, expect, it } from 'vitest';

import { UrlArtifactRequirement } from '../value-objects/url-artifact-requirement.js';

describe('UrlArtifactRequirement', () => {
  it('creates with valid data', () => {
    const req = UrlArtifactRequirement.create({
      index: 0,
      label: 'CI Pipeline URL',
      description: 'Provide the GitHub Actions run URL',
      required: true,
    });
    expect(req.index).toBe(0);
    expect(req.type).toBe('url');
    expect(req.label.value).toBe('CI Pipeline URL');
    expect(req.description.value).toBe('Provide the GitHub Actions run URL');
    expect(req.required).toBe(true);
  });

  it('defaults required to false', () => {
    const req = UrlArtifactRequirement.create({
      index: 1,
      label: 'Staging URL',
    });
    expect(req.required).toBe(false);
  });

  it('handles null description', () => {
    const req = UrlArtifactRequirement.create({
      index: 0,
      label: 'Staging URL',
      description: null,
    });
    expect(req.description.value).toBeNull();
  });

  it('normalizes whitespace-only description to null', () => {
    const req = UrlArtifactRequirement.create({
      index: 0,
      label: 'Staging URL',
      description: '   ',
    });
    expect(req.description.value).toBeNull();
  });

  it('accepts label at 200-char boundary', () => {
    const label = 'a'.repeat(200);
    const req = UrlArtifactRequirement.create({ index: 0, label });
    expect(req.label.value).toBe(label);
  });

  it('rejects label exceeding 200 characters', () => {
    const label = 'a'.repeat(201);
    expect(() => UrlArtifactRequirement.create({ index: 0, label })).toThrow();
  });

  it('rejects empty label', () => {
    expect(() => UrlArtifactRequirement.create({ index: 0, label: '' })).toThrow();
  });

  it('rejects whitespace-only label', () => {
    expect(() => UrlArtifactRequirement.create({ index: 0, label: '   ' })).toThrow();
  });

  it('accepts description at 1000-char boundary', () => {
    const desc = 'b'.repeat(1000);
    const req = UrlArtifactRequirement.create({ index: 0, label: 'URL', description: desc });
    expect(req.description.value).toBe(desc);
  });

  it('rejects description exceeding 1000 characters', () => {
    const desc = 'b'.repeat(1001);
    expect(() => UrlArtifactRequirement.create({ index: 0, label: 'URL', description: desc })).toThrow();
  });

  it('produces correct toJson() output', () => {
    const req = UrlArtifactRequirement.create({
      index: 2,
      label: 'CI Pipeline URL',
      description: 'GitHub Actions link',
      required: true,
    });
    expect(req.toJson()).toEqual({
      index: 2,
      type: 'url',
      label: 'CI Pipeline URL',
      description: 'GitHub Actions link',
      required: true,
    });
  });

  it('produces toJson() with null description', () => {
    const req = UrlArtifactRequirement.create({
      index: 0,
      label: 'Staging URL',
    });
    expect(req.toJson()).toEqual({
      index: 0,
      type: 'url',
      label: 'Staging URL',
      description: null,
      required: false,
    });
  });

  it('compares equality', () => {
    const a = UrlArtifactRequirement.create({ index: 0, label: 'A', required: true });
    const b = UrlArtifactRequirement.create({ index: 0, label: 'A', required: true });
    const c = UrlArtifactRequirement.create({ index: 1, label: 'A', required: true });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const req = UrlArtifactRequirement.create({ index: 0, label: 'My URL' });
    expect(req.toString()).toBe('UrlArtifactRequirement(0: My URL)');
  });
});
