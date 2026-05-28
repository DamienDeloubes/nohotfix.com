import { AuthorSpecDurationInvalidError } from '../../errors/index.js';

export class EstimatedDuration {
  private constructor(readonly value: number) {}

  static create(raw: number): EstimatedDuration {
    if (!Number.isInteger(raw)) {
      throw new AuthorSpecDurationInvalidError('Estimated duration must be a whole number');
    }
    if (raw < 1 || raw > 999) {
      throw new AuthorSpecDurationInvalidError('Estimated duration must be between 1 and 999 minutes');
    }
    return new EstimatedDuration(raw);
  }

  equals(other: EstimatedDuration): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
