import { SettingsLink } from '@/components/layout/SettingsLink';
import { useSubheader } from '@/components/layout/SubheaderContext';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import AccountIcon from './../../../../assets/icons/account.json';
import BriefcaseIcon from './../../../../assets/icons/briefcase.json';
import WalletIcon from './../../../../assets/icons/coin.json';
import EnvironmentIcon from './../../../../assets/icons/environments.json';
import GroupIcon from './../../../../assets/icons/group.json';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings')({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { setSubheader } = useSubheader();
  const { orgSlug } = useOrgContext();

  useEffect(() => {
    setSubheader({ title: 'Settings', description: 'Manage your organization settings' });
  }, []);

  return (
    <div className="layout-settings h-full">
      <div className="layout-area-navigation settings-menu py-6 min-w-3xs pr-6 space-y-6">
        <div>
          <h3 className="text-slate-700 text-sm">Account</h3>
          <ul className="mt-1">
            <li>
              <SettingsLink to="/$orgSlug/settings/account" params={{ orgSlug }} label="Account" icon={AccountIcon} />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-700 text-sm">Organisation</h3>
          <ul className="mt-1 space-y-1">
            <li>
              <SettingsLink to="/$orgSlug/settings/profile" params={{ orgSlug }} label="Profile" icon={BriefcaseIcon} />
            </li>
            <li>
              <SettingsLink to="/$orgSlug/settings/members" params={{ orgSlug }} label="Members" icon={GroupIcon} />
            </li>
            <li>
              <SettingsLink to="/$orgSlug/settings/environments" params={{ orgSlug }} label="Environments" icon={EnvironmentIcon} />
            </li>

            <li>
              <SettingsLink to="/$orgSlug/settings/billing" params={{ orgSlug }} label="Billing" icon={WalletIcon} />
            </li>
          </ul>
        </div>
      </div>
      <div className="layout-area-main p-6">
        <Outlet />
      </div>
    </div>
  );
}
