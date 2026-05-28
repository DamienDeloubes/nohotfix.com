import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionProvider } from '../../ports/auth-session-provider.js';
import { refreshSession } from '../refresh-session.js';

describe('refreshSession', () => {
  it('delegates to authSessionProvider.refreshSession', async () => {
    const provider: AuthSessionProvider = {
      getAuthorizationUrl: vi.fn(),
      exchangeCode: vi.fn(),
      refreshSession: vi.fn().mockResolvedValue({ accessToken: 'at_new', refreshToken: 'rt_new' }),
      revokeSession: vi.fn(),
    };

    const result = await refreshSession({ authSessionProvider: provider }, { refreshToken: 'rt_old', clientId: 'client_1' });

    expect(result).toEqual({ accessToken: 'at_new', refreshToken: 'rt_new' });
    expect(provider.refreshSession).toHaveBeenCalledWith({ refreshToken: 'rt_old', clientId: 'client_1' });
  });
});
