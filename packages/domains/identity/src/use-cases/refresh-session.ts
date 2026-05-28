import type { AuthSessionProvider, AuthTokenPair } from '../ports/auth-session-provider.js';

export interface RefreshSessionDeps {
  authSessionProvider: AuthSessionProvider;
}

export interface RefreshSessionCommand {
  refreshToken: string;
  clientId: string;
}

export async function refreshSession(deps: RefreshSessionDeps, input: RefreshSessionCommand): Promise<AuthTokenPair> {
  return deps.authSessionProvider.refreshSession({ refreshToken: input.refreshToken, clientId: input.clientId });
}
