export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSessionProvider {
  getAuthorizationUrl(params: { clientId: string; redirectUri: string; screenHint?: 'sign-up' | 'sign-in'; state?: string; loginHint?: string }): string;
  exchangeCode(params: { code: string; clientId: string }): Promise<AuthTokenPair>;
  refreshSession(params: { refreshToken: string; clientId: string }): Promise<AuthTokenPair>;
  revokeSession(sessionId: string): Promise<void>;
}
