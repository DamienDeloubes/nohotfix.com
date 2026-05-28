import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { ArtifactDescription } from '../value-objects/artifact-description.js';

describe('ArtifactDescription', () => {
  it('creates a valid description', () => {
    const desc = ArtifactDescription.create('Include the full stack trace');
    expect(desc.value).toBe('Include the full stack trace');
  });

  it('trims whitespace', () => {
    const desc = ArtifactDescription.create('  padded  ');
    expect(desc.value).toBe('padded');
  });

  it('accepts null', () => {
    const desc = ArtifactDescription.create(null);
    expect(desc.value).toBeNull();
  });

  it('accepts undefined', () => {
    const desc = ArtifactDescription.create(undefined);
    expect(desc.value).toBeNull();
  });

  it('normalises whitespace-only to null', () => {
    const desc = ArtifactDescription.create('   ');
    expect(desc.value).toBeNull();
  });

  it('accepts exactly 1000 characters', () => {
    const longDesc = 'a'.repeat(1000);
    const desc = ArtifactDescription.create(longDesc);
    expect(desc.value).toBe(longDesc);
  });

  it('rejects 1001 characters with AuthorArtifactRequirementsInvalidError', () => {
    expect(() => ArtifactDescription.create('a'.repeat(1001))).toThrow(AuthorArtifactRequirementsInvalidError);
    try {
      ArtifactDescription.create('a'.repeat(1001));
    } catch (e) {
      expect((e as AuthorArtifactRequirementsInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID);
    }
  });

  it('compares equality', () => {
    const a = ArtifactDescription.create('Same');
    const b = ArtifactDescription.create('Same');
    const c = ArtifactDescription.create('Different');
    const d = ArtifactDescription.create(null);
    const e = ArtifactDescription.create(null);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
    expect(d.equals(e)).toBe(true);
    expect(a.equals(d)).toBe(false);
  });

  it('converts to string', () => {
    expect(ArtifactDescription.create('Test').toString()).toBe('Test');
    expect(ArtifactDescription.create(null).toString()).toBe('');
  });
});
