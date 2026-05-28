import { AuthorSpecTitleInvalidError } from '../../errors/index.js';

export class SpecTitle {
  private constructor(readonly value: string) {}

  static create(raw: string): SpecTitle {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new AuthorSpecTitleInvalidError('Spec title must not be empty');
    }
    if (trimmed.length > 200) {
      throw new AuthorSpecTitleInvalidError('Spec title must not exceed 200 characters');
    }
    return new SpecTitle(trimmed);
  }

  equals(other: SpecTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
