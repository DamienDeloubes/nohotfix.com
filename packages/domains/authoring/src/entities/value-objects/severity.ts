export type SeverityValue = 'critical' | 'high' | 'medium' | 'low';

const VALID_SEVERITIES: ReadonlySet<string> = new Set<string>(['critical', 'high', 'medium', 'low']);

export class Severity {
  private constructor(readonly value: SeverityValue) {}

  static create(raw: string): Severity {
    if (!VALID_SEVERITIES.has(raw)) {
      throw new Error(`Invalid severity: ${raw}. Must be 'critical', 'high', 'medium', or 'low'`);
    }
    return new Severity(raw as SeverityValue);
  }

  static default(): Severity {
    return new Severity('medium');
  }

  equals(other: Severity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
