import { OrgContext, useUserOrganisations } from '@nohotfix/domain-identity/ui';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

import { orgKeys } from '../../api/query-keys.js';
import { AppShell } from '../../components/layout/AppShell.js';
import { SubheaderProvider } from '../../components/layout/SubheaderContext.js';

export const Route = createFileRoute('/_authenticated/$orgSlug')({
  component: OrgScopedLayout,
});

function OrgScopedLayout() {
  const { orgSlug } = Route.useParams();
  const navigate = useNavigate();
  const { data: orgs, isLoading } = useUserOrganisations({ queryKey: orgKeys.userOrgs() });

  const currentOrg = orgs?.find((o) => o.slug === orgSlug);

  useEffect(() => {
    if (!isLoading && orgs && !currentOrg) {
      void navigate({ to: '/' });
    }
  }, [isLoading, orgs, currentOrg, navigate]);

  const contextValue = useMemo(() => (currentOrg ? { orgId: currentOrg.id, orgSlug: currentOrg.slug, orgName: currentOrg.name, role: currentOrg.role } : null), [currentOrg]);

  if (isLoading || !contextValue) {
    return <div>Loading...</div>;
  }

  return (
    <OrgContext.Provider value={contextValue}>
      <SubheaderProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </SubheaderProvider>
    </OrgContext.Provider>
  );
}
