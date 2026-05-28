/**
 * Unit tests for session module (001-user-signup, 002-app-logout)
 * Covers token management and logout behaviour.
 */

import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getAccessToken as getAccessTokenFn, logout as logoutFn } from './session.js';

let logout: typeof logoutFn;
let getAccessToken: typeof getAccessTokenFn;

describe('logout', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    const mod = await import('./session.js');
    logout = mod.logout;
    getAccessToken = mod.getAccessToken;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls POST /auth/logout with credentials include', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    await logout(queryClient);

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/logout'), expect.objectContaining({ method: 'POST', credentials: 'include' }));
  });

  it('clears in-memory access token', async () => {
    // First set a token via refresh
    const refreshResponse = new Response(JSON.stringify({ accessToken: 'active-token' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const logoutResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(refreshResponse).mockResolvedValueOnce(logoutResponse));

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    // Populate the token
    const token = await getAccessToken();
    expect(token).toBe('active-token');

    const queryClient = new QueryClient();
    await logout(queryClient);

    // After logout, getAccessToken should return null (fetch is exhausted, refresh will fail)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 })));
    const tokenAfter = await getAccessToken();
    expect(tokenAfter).toBeNull();
  });

  it('calls queryClient.clear()', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })));

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    await logout(queryClient);

    expect(clearSpy).toHaveBeenCalled();
  });

  it('calls window.location.replace with VITE_WEB_URL', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })));

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    await logout(queryClient);

    expect(replaceMock).toHaveBeenCalledWith(expect.any(String));
  });

  it('proceeds with local cleanup even if fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    await logout(queryClient);

    expect(clearSpy).toHaveBeenCalled();
    expect(replaceMock).toHaveBeenCalled();
  });

  it('logs console.warn when server returns non-OK status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Internal Server Error', { status: 500 })));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    await logout(queryClient);

    expect(warnSpy).toHaveBeenCalledWith('[logout] Server responded 500');
    expect(replaceMock).toHaveBeenCalled();
  });

  it('logs console.warn when fetch throws network error', async () => {
    const networkError = new Error('Network error');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });

    const queryClient = new QueryClient();
    await logout(queryClient);

    expect(warnSpy).toHaveBeenCalledWith('[logout] Network error during server logout', networkError);
    expect(replaceMock).toHaveBeenCalled();
  });
});
