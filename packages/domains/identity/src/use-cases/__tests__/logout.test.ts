import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionProvider } from '../../ports/auth-session-provider.js';
import { logout } from '../logout.js';

function mockProvider(overrides: Partial<AuthSessionProvider> = {}): AuthSessionProvider {
  return {
    getAuthorizationUrl: vi.fn(),
    exchangeCode: vi.fn(),
    refreshSession: vi.fn(),
    revokeSession: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('logout', () => {
  it('revokes session when sessionId is provided', async () => {
    const provider = mockProvider();
    await logout({ authSessionProvider: provider }, { sessionId: 'sess_123' });
    expect(provider.revokeSession).toHaveBeenCalledWith('sess_123');
  });

  it('does nothing when sessionId is undefined', async () => {
    const provider = mockProvider();
    await logout({ authSessionProvider: provider }, {});
    expect(provider.revokeSession).not.toHaveBeenCalled();
  });

  it('swallows errors from revokeSession', async () => {
    const provider = mockProvider({
      revokeSession: vi.fn().mockRejectedValue(new Error('API error')),
    });

    await expect(logout({ authSessionProvider: provider }, { sessionId: 'sess_fail' })).resolves.toBeUndefined();
    expect(provider.revokeSession).toHaveBeenCalledWith('sess_fail');
  });
});
