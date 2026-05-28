import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { LordiconIcon, type LordiconIconHandle } from '../ui/LordiconIcon.js';
import { useTheme } from '../ui/ThemeProvider.js';

interface NavLinkProps {
  to: string;
  params: Record<string, string>;
  label: string;
  icon: object;
}

export function NavLink({ to, params, label, icon }: NavLinkProps) {
  const iconRef = useRef<LordiconIconHandle>(null);
  const [hovered, setHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const activeColor = resolvedTheme === 'dark' ? '#ffffff' : 'var(--color-primary)';
  const inactiveColor = 'var(--color-muted)';

  return (
    <Link
      to={to}
      activeOptions={{ exact: true, includeSearch: false }}
      params={params}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-(--duration-fast) text-muted hover:text-primary [&.active]:text-primary"
      onMouseEnter={() => {
        setHovered(true);
        iconRef.current?.play();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <>
          <LordiconIcon ref={iconRef} icon={icon} size={24} colors={isActive || hovered ? activeColor : inactiveColor} />
          {label}
        </>
      )}
    </Link>
  );
}
