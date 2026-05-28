import { Button, Dropdown, Label } from '@heroui/react';

import { useTheme, type ThemePreference } from '../ui/ThemeProvider.js';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1M8 13.5v1M2.75 2.75l.7.7M12.55 12.55l.7.7M1.5 8h1M13.5 8h1M2.75 13.25l.7-.7M12.55 3.45l.7-.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 8.5a5.5 5.5 0 1 1-7-7 4.5 4.5 0 0 0 7 7z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2.5" width="12" height="8" rx="1" />
      <path d="M5.5 13.5h5M8 10.5v3" />
    </svg>
  );
}

function CurrentIcon() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
}

const OPTIONS: { key: ThemePreference; label: string; icon: () => JSX.Element }[] = [
  { key: 'light', label: 'Light', icon: SunIcon },
  { key: 'dark', label: 'Dark', icon: MoonIcon },
  { key: 'system', label: 'System', icon: MonitorIcon },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          variant="ghost"
          isIconOnly
          aria-label="Theme preference"
          className="min-w-0 p-2 text-secondary hover:text-muted transition-colors [transition-duration:var(--duration-fast)]"
        >
          <CurrentIcon />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="bg-[var(--bg-card)] border border-[var(--border-default)] [box-shadow:var(--shadow-card)]">
        <Dropdown.Menu aria-label="Theme preference" selectionMode="single" selectedKeys={new Set([preference])} onAction={(key) => setPreference(key as ThemePreference)}>
          {OPTIONS.map(({ key, label, icon: Icon }) => (
            <Dropdown.Item key={key} id={key} className={preference === key ? 'text-muted' : 'text-secondary'}>
              <span className="flex items-center gap-2">
                <Icon />
                <Label>{label}</Label>
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
