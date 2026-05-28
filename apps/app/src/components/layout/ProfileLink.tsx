import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { LordiconIcon, type LordiconIconHandle } from '../ui/LordiconIcon.js';
import { useTheme } from '../ui/ThemeProvider.js';

interface ProfileLinkProps {
  to: string;
  params: Record<string, string>;
  label: string;
  icon: object;
}

export function ProfileLink({ to, params, label, icon }: ProfileLinkProps) {
  const iconRef = useRef<LordiconIconHandle>(null);
  const [hovered, setHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const activeColor = resolvedTheme === 'dark' ? '#ffffff' : 'var(--primary)';
  const inactiveColor = resolvedTheme === 'dark' ? '#9c9ba0' : 'var(--primary)';

  return (
    <Link
      to={to}
      activeOptions={{ exact: true, includeSearch: false }}
      params={params}
      className="flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium transition-colors duration-(--duration-fast) text-muted hover:text-primary [&.active]:text-primary"
      onMouseEnter={() => {
        setHovered(true);
        iconRef.current?.play();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <>
          <LordiconIcon ref={iconRef} icon={icon} size={20} colors={isActive || hovered ? activeColor : inactiveColor} />
          {label}
        </>
      )}
    </Link>
  );
}
