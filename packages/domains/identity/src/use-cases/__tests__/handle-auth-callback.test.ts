import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionProvider } from '../../ports/auth-session-provider.js';
import { handleAuthCallback } from '../handle-auth-callback.js';

describe('handleAuthCallback', () => {
  it('exchanges code for token pair', async () => {
    const provider: AuthSessionProvider = {
      getAuthorizationUrl: vi.fn(),
      exchangeCode: vi.fn().mockResolvedValue({ accessToken: 'at_1', refreshToken: 'rt_1' }),
      refreshSession: vi.fn(),
      revokeSession: vi.fn(),
    };

    const result = await handleAuthCallback({ authSessionProvider: provider }, { code: 'code_abc', clientId: 'client_1' });

    expect(result).toEqual({ accessToken: 'at_1', refreshToken: 'rt_1' });
    expect(provider.exchangeCode).toHaveBeenCalledWith({ code: 'code_abc', clientId: 'client_1' });
  });
});
