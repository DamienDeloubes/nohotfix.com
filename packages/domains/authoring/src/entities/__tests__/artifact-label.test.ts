import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@nohotfix/shared';

import { AuthorArtifactLabelInvalidError } from '../../errors/index.js';
import { ArtifactLabel } from '../value-objects/artifact-label.js';

describe('ArtifactLabel', () => {
  it('creates a valid label', () => {
    const label = ArtifactLabel.create('Error log output');
    expect(label.value).toBe('Error log output');
  });

  it('trims whitespace', () => {
    const label = ArtifactLabel.create('  padded label  ');
    expect(label.value).toBe('padded label');
  });

  it('accepts a single character', () => {
    const label = ArtifactLabel.create('A');
    expect(label.value).toBe('A');
  });

  it('accepts exactly 200 characters', () => {
    const longLabel = 'a'.repeat(200);
    const label = ArtifactLabel.create(longLabel);
    expect(label.value).toBe(longLabel);
  });

  it('rejects empty string with AuthorArtifactLabelInvalidError', () => {
    expect(() => ArtifactLabel.create('')).toThrow(AuthorArtifactLabelInvalidError);
    try {
      ArtifactLabel.create('');
    } catch (e) {
      expect((e as AuthorArtifactLabelInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_LABEL_INVALID);
    }
  });

  it('rejects whitespace-only string', () => {
    expect(() => ArtifactLabel.create('   ')).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('rejects 201 characters', () => {
    expect(() => ArtifactLabel.create('a'.repeat(201))).toThrow(AuthorArtifactLabelInvalidError);
  });

  it('compares equality', () => {
    const a = ArtifactLabel.create('Same');
    const b = ArtifactLabel.create('Same');
    const c = ArtifactLabel.create('Different');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('converts to string', () => {
    const label = ArtifactLabel.create('Test');
    expect(label.toString()).toBe('Test');
  });
});
