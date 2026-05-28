import type { AuthSessionProvider } from '../ports/auth-session-provider.js';

export interface InitiateLoginDeps {
  authSessionProvider: AuthSessionProvider;
}

export interface InitiateLoginCommand {
  clientId: string;
  redirectUri: string;
  screenHint?: 'sign-up' | 'sign-in';
  existingRefreshToken?: string;
  state?: string;
  loginHint?: string;
}

export type InitiateLoginOutput = { action: 'redirect-to-app'; accessToken: string; refreshToken: string } | { action: 'redirect-to-provider'; url: string };

export async function initiateLogin(deps: InitiateLoginDeps, input: InitiateLoginCommand): Promise<InitiateLoginOutput> {
  if (input.existingRefreshToken) {
    try {
      const tokens = await deps.authSessionProvider.refreshSession({
        refreshToken: input.existingRefreshToken,
        clientId: input.clientId,
      });
      return { action: 'redirect-to-app', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    } catch {
      // Refresh failed — fall through to provider URL
    }
  }

  const url = deps.authSessionProvider.getAuthorizationUrl({
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    ...(input.screenHint ? { screenHint: input.screenHint } : {}),
    ...(input.state ? { state: input.state } : {}),
    ...(input.loginHint ? { loginHint: input.loginHint } : {}),
  });

  return { action: 'redirect-to-provider', url };
}
