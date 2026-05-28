import type { AuthSessionProvider, AuthTokenPair } from '../ports/auth-session-provider.js';

export interface HandleAuthCallbackDeps {
  authSessionProvider: AuthSessionProvider;
}

export interface HandleAuthCallbackCommand {
  code: string;
  clientId: string;
}

export async function handleAuthCallback(deps: HandleAuthCallbackDeps, input: HandleAuthCallbackCommand): Promise<AuthTokenPair> {
  return deps.authSessionProvider.exchangeCode({ code: input.code, clientId: input.clientId });
}
