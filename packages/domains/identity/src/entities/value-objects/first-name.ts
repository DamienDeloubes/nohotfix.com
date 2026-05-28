import { AuthUserFirstNameInvalidError } from '../../errors/index.js';

export class FirstName {
  private constructor(readonly value: string) {}

  static create(raw: string): FirstName {
    if (!raw || typeof raw !== 'string') {
      throw new AuthUserFirstNameInvalidError();
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 50) {
      throw new AuthUserFirstNameInvalidError();
    }
    return new FirstName(trimmed);
  }

  equals(other: FirstName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
