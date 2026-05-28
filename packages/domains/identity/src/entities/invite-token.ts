const TOKEN_LENGTH_HEX = 64; // 32 bytes = 64 hex chars

export class InviteToken {
  private constructor(readonly value: string) {}

  static generate(): InviteToken {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return new InviteToken(hex);
  }

  static create(raw: string): InviteToken {
    if (!raw || typeof raw !== 'string') {
      throw new Error('Invite token must be a non-empty string');
    }
    if (raw.length !== TOKEN_LENGTH_HEX || !/^[0-9a-f]+$/.test(raw)) {
      throw new Error('Invite token must be a 64-character hex string');
    }
    return new InviteToken(raw);
  }

  equals(other: InviteToken): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
