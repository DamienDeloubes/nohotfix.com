'use client';

import { useCallback, useEffect, useState } from 'react';

/*
 * Standalone theme hook for the marketing site. Mirrors the dashboard's
 * ThemeProvider logic (apps/app/src/components/ui/ThemeProvider.tsx) and shares
 * the same localStorage key, so a preference set in either surface carries over.
 * The FOUC-safe initial paint is handled by the inline script in layout.tsx;
 * this hook owns runtime switching + OS sync once React has mounted.
 */
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme-preference';
const ORDER: ThemePreference[] = ['light', 'dark', 'system'];

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
  return 'system';
}

function getSystemTheme(): ResolvedTheme {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // matchMedia unavailable
  }
  return 'light'; // light-first default
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return getSystemTheme();
}

function applyThemeClass(resolved: ResolvedTheme): void {
  if (resolved === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

interface UseThemeResult {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
  cycle: () => void;
}

export function useTheme(): UseThemeResult {
  // SSR-safe defaults that match the server render; corrected on mount below.
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Sync to the real stored preference after hydration (avoids SSR mismatch).
  useEffect(() => {
    const stored = getStoredPreference();
    setPreferenceState(stored);
    setResolvedTheme(resolveTheme(stored));
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    const resolved = resolveTheme(pref);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // persists for this session only
    }
  }, []);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length] ?? 'system';
    setPreference(next);
  }, [preference, setPreference]);

  // Follow the OS while in "system" mode.
  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const resolved: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  return { preference, resolvedTheme, setPreference, cycle };
}
