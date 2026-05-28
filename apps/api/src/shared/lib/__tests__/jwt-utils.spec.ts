import { describe, expect, it } from 'vitest';

import { extractSessionId } from '../jwt-utils.js';

function fakeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.fake-signature`;
}

describe('extractSessionId', () => {
  it('extracts sid from a valid JWT', () => {
    const token = fakeJwt({ sid: 'sess_123', sub: 'user_1' });
    expect(extractSessionId(token)).toBe('sess_123');
  });

  it('returns null when sid claim is missing', () => {
    const token = fakeJwt({ sub: 'user_1' });
    expect(extractSessionId(token)).toBeNull();
  });

  it('returns null for malformed tokens', () => {
    expect(extractSessionId('not-a-jwt')).toBeNull();
    expect(extractSessionId('')).toBeNull();
    expect(extractSessionId('a.!!!.c')).toBeNull();
  });
});
