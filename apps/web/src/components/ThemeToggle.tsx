'use client';

import { useTheme, type ThemePreference } from '@/lib/theme';

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1M8 13.5v1M2.75 2.75l.7.7M12.55 12.55l.7.7M1.5 8h1M13.5 8h1M2.75 13.25l.7-.7M12.55 3.45l.7-.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 8.5a5.5 5.5 0 1 1-7-7 4.5 4.5 0 0 0 7 7z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2.5" width="12" height="8" rx="1" />
      <path d="M5.5 13.5h5M8 10.5v3" />
    </svg>
  );
}

const ICON: Record<ThemePreference, () => React.ReactElement> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

const LABEL: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle(): React.ReactElement {
  const { preference, cycle } = useTheme();
  const Icon = ICON[preference];
  const label = `Theme: ${LABEL[preference]} — click to change`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md
        text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]
        transition-colors duration-150"
    >
      <Icon />
    </button>
  );
}
