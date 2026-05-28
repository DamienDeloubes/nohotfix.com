import type { AuthSessionProvider } from '../ports/auth-session-provider.js';

export interface LogoutDeps {
  authSessionProvider: AuthSessionProvider;
}

export interface LogoutCommand {
  sessionId?: string;
}

export async function logout(deps: LogoutDeps, input: LogoutCommand): Promise<void> {
  if (!input.sessionId) return;

  try {
    await deps.authSessionProvider.revokeSession(input.sessionId);
  } catch {
    // Best-effort revocation — swallow errors
  }
}
