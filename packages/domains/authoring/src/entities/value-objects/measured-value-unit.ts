import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';

const VALID_UNITS = ['ms', 's', '%', 'MB', 'GB', 'req/s'] as const;
type MeasuredValueUnitValue = (typeof VALID_UNITS)[number];

export class MeasuredValueUnit {
  private constructor(readonly value: MeasuredValueUnitValue) {}

  static create(raw: string): MeasuredValueUnit {
    if (!VALID_UNITS.includes(raw as MeasuredValueUnitValue)) {
      throw new AuthorArtifactRequirementsInvalidError(`Invalid measured value unit: ${raw}. Must be one of: ${VALID_UNITS.join(', ')}`);
    }
    return new MeasuredValueUnit(raw as MeasuredValueUnitValue);
  }

  equals(other: MeasuredValueUnit): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
