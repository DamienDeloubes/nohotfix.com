import { OrganisationSettingsForm, useOrganisationDetails, useOrgContext, useRenameOrganisation } from '@nohotfix/domain-identity/ui';
import { createFileRoute } from '@tanstack/react-router';

import { orgKeys, settingsKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/profile')({
  component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
  const { orgSlug, role } = useOrgContext();
  const { data, isLoading, error } = useOrganisationDetails({
    orgSlug,
    queryKey: settingsKeys.org(orgSlug),
  });
  const {
    mutateAsync,
    isPending,
    error: renameError,
  } = useRenameOrganisation({
    orgSlug,
    invalidateKeys: [settingsKeys.org(orgSlug), orgKeys.userOrgs()],
  });

  const handleRename = async (newName: string) => {
    await mutateAsync(newName);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">General</h3>
      <OrganisationSettingsForm organisation={data} isLoading={isLoading} error={error} role={role} onRename={handleRename} isRenaming={isPending} renameError={renameError} />
    </div>
  );
}
