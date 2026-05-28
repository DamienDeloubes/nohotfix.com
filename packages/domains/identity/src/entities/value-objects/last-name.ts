import { AuthUserLastNameInvalidError } from '../../errors/index.js';

export class LastName {
  private constructor(readonly value: string) {}

  static create(raw: string): LastName {
    if (!raw || typeof raw !== 'string') {
      throw new AuthUserLastNameInvalidError();
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 50) {
      throw new AuthUserLastNameInvalidError();
    }
    return new LastName(trimmed);
  }

  equals(other: LastName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
