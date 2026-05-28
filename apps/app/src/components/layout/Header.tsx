import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { Link } from '@tanstack/react-router';

import BookIcon from '../../assets/icons/book.json'; // new
import CheckListIcon from '../../assets/icons/check-list.json'; // new
import HistoryIcon from '../../assets/icons/history.json'; // new
import RunIcon from '../../assets/icons/run.json'; // new
import SpeedIcon from '../../assets/icons/speed.json'; // new

import { NavLink } from './NavLink.js';
import { OrgSwitcher } from './OrgSwitcher.js';
import { ThemeToggle } from './ThemeToggle.js';
import { UserMenu } from './UserMenu.js';

export function Header() {
  const { orgSlug } = useOrgContext();

  const params = { orgSlug };

  return (
    <header className="layout-area-navigation-header navigation-header">
      {/* Left zone: Logo + OrgSwitcher */}
      <div className="layout-area-logo">
        <div className="flex flex-row items-center gap-3">
          <Link to="/$orgSlug" params={params} className="flex flex-row text-lg tracking-[0.01em] text-muted">
            <span className="font-normal">NoHotfix</span>
          </Link>
          <OrgSwitcher />
        </div>
      </div>

      {/* Center zone: Nav links */}
      <nav className="layout-area-navigation">
        <div className="flex flex-row items-center">
          <NavLink to={`/${orgSlug}`} params={params} label="Dashboard" icon={SpeedIcon} />
          <NavLink to={`/${orgSlug}/runs`} params={params} label="Runs" icon={RunIcon} />
          <NavLink to={`/${orgSlug}/playbooks`} params={params} label="Playbooks" icon={BookIcon} />
          <NavLink to={`/${orgSlug}/spec-library`} params={params} label="Spec Library" icon={CheckListIcon} />
          <NavLink to={`/${orgSlug}/history`} params={params} label="History" icon={HistoryIcon} />
        </div>
      </nav>

      {/* Right zone: Settings gear + UserMenu */}
      <div className="layout-area-profile">
        <div className="flex justify-end items-center">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
