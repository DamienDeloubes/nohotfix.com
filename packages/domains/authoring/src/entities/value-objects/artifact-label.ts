import { AuthorArtifactLabelInvalidError } from '../../errors/index.js';

export class ArtifactLabel {
  private constructor(readonly value: string) {}

  static create(raw: string): ArtifactLabel {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new AuthorArtifactLabelInvalidError('Artifact label must not be empty');
    }
    if (trimmed.length > 200) {
      throw new AuthorArtifactLabelInvalidError('Artifact label must not exceed 200 characters');
    }
    return new ArtifactLabel(trimmed);
  }

  equals(other: ArtifactLabel): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
