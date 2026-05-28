import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';

export class ArtifactDescription {
  private constructor(readonly value: string | null) {}

  static create(raw: string | null | undefined): ArtifactDescription {
    if (raw == null) {
      return new ArtifactDescription(null);
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return new ArtifactDescription(null);
    }
    if (trimmed.length > 1000) {
      throw new AuthorArtifactRequirementsInvalidError('Artifact description must not exceed 1,000 characters');
    }
    return new ArtifactDescription(trimmed);
  }

  equals(other: ArtifactDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value ?? '';
  }
}
