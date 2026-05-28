import { toKebabCase } from '@nohotfix/shared';

import { AuthorSpecTagsInvalidError } from '../../errors/index.js';

const MAX_TAG_LENGTH = 30;

export class SpecTag {
  private constructor(readonly value: string) {}

  static create(raw: string): SpecTag {
    const kebab = toKebabCase(raw);
    if (kebab.length === 0) {
      throw new AuthorSpecTagsInvalidError('Tag must not be empty after normalisation');
    }
    if (kebab.length > MAX_TAG_LENGTH) {
      throw new AuthorSpecTagsInvalidError(`Tag must not exceed ${MAX_TAG_LENGTH} characters`);
    }
    return new SpecTag(kebab);
  }

  equals(other: SpecTag): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
