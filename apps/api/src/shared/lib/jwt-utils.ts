export function extractSessionId(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return decoded.sid ?? null;
  } catch {
    return null;
  }
}
