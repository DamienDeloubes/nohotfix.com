export class WorkosUserId {
  private constructor(readonly value: string) {}

  static create(raw: string): WorkosUserId {
    if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
      throw new Error('WorkOS user ID must be a non-empty string');
    }
    return new WorkosUserId(raw.trim());
  }

  equals(other: WorkosUserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
