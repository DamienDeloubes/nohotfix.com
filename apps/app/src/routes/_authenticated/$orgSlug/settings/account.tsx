import { AccountSettingsForm, useCurrentUser, useUpdateUserProfile } from '@nohotfix/domain-identity/ui';
import { createFileRoute } from '@tanstack/react-router';

import { userKeys } from '../../../../api/query-keys.js';
import { WEB_URL } from '../../../../config.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/account')({
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  const { orgSlug } = Route.useParams();
  const { data, isLoading, error } = useCurrentUser({
    queryKey: userKeys.me(orgSlug),
    orgSlug,
  });
  const {
    mutateAsync,
    isPending,
    error: saveError,
  } = useUpdateUserProfile({
    invalidateKeys: [userKeys.me(orgSlug)],
  });

  const handleSave = async (profileData: { firstName: string; lastName: string }) => {
    await mutateAsync(profileData);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
      <AccountSettingsForm
        user={data}
        isLoading={isLoading}
        error={error}
        onSave={handleSave}
        isSaving={isPending}
        saveError={saveError}
        guideUrl={`${WEB_URL}/docs/account/email-password`}
      />
    </div>
  );
}
