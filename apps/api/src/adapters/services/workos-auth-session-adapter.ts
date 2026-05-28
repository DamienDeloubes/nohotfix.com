import { AuthCallbackFailedError, AuthProviderUnavailableError, type AuthSessionProvider, type AuthTokenPair } from '@nohotfix/domain-identity';
import type { WorkOS } from '@workos-inc/node';

export class WorkosAuthSessionAdapter implements AuthSessionProvider {
  constructor(private readonly workos: WorkOS) {}

  getAuthorizationUrl(params: { clientId: string; redirectUri: string; screenHint?: 'sign-up' | 'sign-in'; state?: string; loginHint?: string }): string {
    try {
      return this.workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: params.clientId,
        redirectUri: params.redirectUri,
        ...(params.screenHint ? { screenHint: params.screenHint } : {}),
        ...(params.state ? { state: params.state } : {}),
        ...(params.loginHint ? { loginHint: params.loginHint } : {}),
      });
    } catch (err) {
      throw new AuthProviderUnavailableError({ cause: (err as Error).message, operation: 'getAuthorizationUrl' });
    }
  }

  async exchangeCode(params: { code: string; clientId: string }): Promise<AuthTokenPair> {
    try {
      const result = await this.workos.userManagement.authenticateWithCode({
        code: params.code,
        clientId: params.clientId,
      });
      return { accessToken: result.accessToken, refreshToken: result.refreshToken };
    } catch (err) {
      throw new AuthCallbackFailedError({ cause: (err as Error).message });
    }
  }

  async refreshSession(params: { refreshToken: string; clientId: string }): Promise<AuthTokenPair> {
    const result = await this.workos.userManagement.authenticateWithRefreshToken({
      refreshToken: params.refreshToken,
      clientId: params.clientId,
    });
    return { accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.workos.userManagement.revokeSession({ sessionId });
  }
}
