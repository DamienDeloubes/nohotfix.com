import { AuthorSpecTagsInvalidError } from '../../errors/index.js';
import { SpecTag } from './spec-tag.js';

const MAX_TAGS = 10;

export class SpecTags {
  private constructor(readonly tags: SpecTag[]) {}

  static create(raw: string[]): SpecTags {
    const created = raw.map((r) => SpecTag.create(r));
    // Deduplicate by value
    const unique = created.filter((tag, i, arr) => arr.findIndex((t) => t.equals(tag)) === i);
    if (unique.length > MAX_TAGS) {
      throw new AuthorSpecTagsInvalidError(`Cannot exceed ${MAX_TAGS} tags`);
    }
    return new SpecTags(unique);
  }

  toArray(): string[] {
    return this.tags.map((t) => t.value);
  }

  get length(): number {
    return this.tags.length;
  }
}
