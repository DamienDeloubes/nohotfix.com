import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { Link, useRouterState } from '@tanstack/react-router';

import creditCardIcon from '../../assets/icons/credit-card.json';
import serverIcon from '../../assets/icons/server.json';
import slidersIcon from '../../assets/icons/sliders.json';
import userGearIcon from '../../assets/icons/user-gear.json';
import usersIcon from '../../assets/icons/users.json';
import { LordiconIcon } from '../ui/LordiconIcon.js';
import { useTheme } from '../ui/ThemeProvider.js';

interface SidebarItemProps {
  to: string;
  params: Record<string, string>;
  label: string;
  icon: object;
}

function SidebarItem({ to, params, label, icon }: SidebarItemProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || pathname.startsWith(to + '/');
  const { resolvedTheme } = useTheme();
  const activeColor = resolvedTheme === 'dark' ? '#ffffff' : '#0f172a';
  const inactiveColor = resolvedTheme === 'dark' ? '#9c9ba0' : '#908abc';

  return (
    <Link
      to={to}
      params={params}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors [transition-duration:var(--duration-fast)] ${
        isActive ? 'bg-[var(--surface-active)] text-muted' : 'text-secondary hover:bg-[var(--glass-12)] hover:text-muted'
      }`}
    >
      <LordiconIcon icon={icon} size={20} colors={isActive ? activeColor : inactiveColor} />
      {label}
    </Link>
  );
}

export function SettingsSidebar() {
  const { orgSlug } = useOrgContext();
  const params = { orgSlug };

  return (
    <nav className="flex flex-col gap-6 p-4">
      {/* Organisation group */}
      <div className="flex flex-col gap-1">
        <span className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted">Organisation</span>
        <SidebarItem to={`/${orgSlug}/settings/general`} params={params} label="General" icon={slidersIcon} />
        <SidebarItem to={`/${orgSlug}/settings/members`} params={params} label="Members" icon={usersIcon} />
        <SidebarItem to={`/${orgSlug}/settings/environments`} params={params} label="Environments" icon={serverIcon} />
        <SidebarItem to={`/${orgSlug}/settings/billing`} params={params} label="Billing" icon={creditCardIcon} />
      </div>

      {/* Account group */}
      <div className="flex flex-col gap-1">
        <span className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted">Account</span>
        <SidebarItem to={`/${orgSlug}/settings/account`} params={params} label="Account settings" icon={userGearIcon} />
      </div>
    </nav>
  );
}
