import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionProvider } from '../../ports/auth-session-provider.js';
import { initiateLogin } from '../initiate-login.js';

function mockProvider(overrides: Partial<AuthSessionProvider> = {}): AuthSessionProvider {
  return {
    getAuthorizationUrl: vi.fn().mockReturnValue('https://auth.test/authorize'),
    exchangeCode: vi.fn(),
    refreshSession: vi.fn().mockResolvedValue({ accessToken: 'at_new', refreshToken: 'rt_new' }),
    revokeSession: vi.fn(),
    ...overrides,
  };
}

describe('initiateLogin', () => {
  it('refreshes session when existing refresh token is provided', async () => {
    const provider = mockProvider();
    const result = await initiateLogin({ authSessionProvider: provider }, { clientId: 'client_1', redirectUri: 'http://localhost/callback', existingRefreshToken: 'rt_old' });

    expect(result).toEqual({ action: 'redirect-to-app', accessToken: 'at_new', refreshToken: 'rt_new' });
    expect(provider.refreshSession).toHaveBeenCalledWith({ refreshToken: 'rt_old', clientId: 'client_1' });
  });

  it('falls through to provider URL when refresh fails', async () => {
    const provider = mockProvider({
      refreshSession: vi.fn().mockRejectedValue(new Error('expired')),
    });

    const result = await initiateLogin({ authSessionProvider: provider }, { clientId: 'client_1', redirectUri: 'http://localhost/callback', existingRefreshToken: 'rt_old' });

    expect(result).toEqual({ action: 'redirect-to-provider', url: 'https://auth.test/authorize' });
  });

  it('generates provider URL when no refresh token exists', async () => {
    const provider = mockProvider();
    const result = await initiateLogin({ authSessionProvider: provider }, { clientId: 'client_1', redirectUri: 'http://localhost/callback' });

    expect(result).toEqual({ action: 'redirect-to-provider', url: 'https://auth.test/authorize' });
    expect(provider.refreshSession).not.toHaveBeenCalled();
  });

  it('passes screenHint to getAuthorizationUrl', async () => {
    const provider = mockProvider();
    await initiateLogin({ authSessionProvider: provider }, { clientId: 'client_1', redirectUri: 'http://localhost/callback', screenHint: 'sign-up' });

    expect(provider.getAuthorizationUrl).toHaveBeenCalledWith({
      clientId: 'client_1',
      redirectUri: 'http://localhost/callback',
      screenHint: 'sign-up',
    });
  });
});
