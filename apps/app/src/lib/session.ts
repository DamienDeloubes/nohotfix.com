import type { TokenManager } from '@nohotfix/api-client';
import type { QueryClient } from '@tanstack/react-query';

import { API_URL, WEB_URL } from '../config.js';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        accessToken = null;
        return null;
      }
      const data = (await res.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return accessToken;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function getAccessToken(): Promise<string | null> {
  if (accessToken) return accessToken;
  return refreshAccessToken();
}

export const tokenManager: TokenManager = {
  getToken: getAccessToken,
  refreshToken: refreshAccessToken,
};

export async function logout(queryClient: QueryClient): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      console.warn(`[logout] Server responded ${res.status}`);
    }
  } catch (err) {
    console.warn('[logout] Network error during server logout', err);
  }
  accessToken = null;
  queryClient.clear();
  window.location.replace(WEB_URL);
}
