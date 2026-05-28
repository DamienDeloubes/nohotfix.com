import { AuthOrgSlugInvalidError } from '../../errors/index.js';

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 50;

export class OrganisationSlug {
  private constructor(readonly value: string) {}

  static create(raw: string): OrganisationSlug {
    if (!raw || typeof raw !== 'string') {
      throw new AuthOrgSlugInvalidError({ reason: 'Organisation slug must be a non-empty string' });
    }
    const trimmed = raw.trim();
    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new AuthOrgSlugInvalidError({ reason: `Organisation slug must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`, length: trimmed.length });
    }
    if (!SLUG_REGEX.test(trimmed)) {
      throw new AuthOrgSlugInvalidError({ reason: 'Organisation slug must contain only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)', slug: trimmed });
    }
    return new OrganisationSlug(trimmed);
  }

  equals(other: OrganisationSlug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
