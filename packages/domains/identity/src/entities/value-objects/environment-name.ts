import { AuthEnvNameInvalidError } from '../../errors/index.js';

export class EnvironmentName {
  private constructor(readonly value: string) {}

  static create(raw: string): EnvironmentName {
    if (!raw || typeof raw !== 'string') {
      throw new AuthEnvNameInvalidError({ reason: 'Environment name must be a non-empty string' });
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 100) {
      throw new AuthEnvNameInvalidError({ reason: 'Environment name must be between 1 and 100 characters', length: trimmed.length });
    }
    return new EnvironmentName(trimmed);
  }

  equals(other: EnvironmentName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
