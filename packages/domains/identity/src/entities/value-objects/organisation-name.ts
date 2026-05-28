import { AuthOrgNameInvalidError } from '../../errors/index.js';

export class OrganisationName {
  private constructor(readonly value: string) {}

  static create(raw: string): OrganisationName {
    if (!raw || typeof raw !== 'string') {
      throw new AuthOrgNameInvalidError({ reason: 'Organisation name must be a non-empty string' });
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 100) {
      throw new AuthOrgNameInvalidError({ reason: 'Organisation name must be between 1 and 100 characters', length: trimmed.length });
    }
    return new OrganisationName(trimmed);
  }

  equals(other: OrganisationName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
