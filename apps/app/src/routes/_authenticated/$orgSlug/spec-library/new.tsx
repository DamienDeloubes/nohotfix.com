import { CreateSpecForm, useSystemsUnderTest } from '@nohotfix/domain-authoring/ui';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { specKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/spec-library/new')({
  component: NewSpecPage,
});

function NewSpecPage() {
  const { orgSlug, role } = useOrgContext();
  const navigate = useNavigate();
  const isAdmin = requireRole(role, { minimum: 'admin' });

  const { data: systemSuggestions } = useSystemsUnderTest({
    orgSlug,
    queryKey: specKeys.systemsUnderTest(orgSlug),
  });

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Access Denied</h2>
        <p>You need admin access to create specs.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create New Spec</h1>
      <CreateSpecForm
        orgSlug={orgSlug}
        invalidateKeys={[specKeys.lists(orgSlug)]}
        onSuccess={(spec) => {
          void navigate({ to: '/$orgSlug/spec-library/$specId', params: { orgSlug, specId: spec.id } });
        }}
        systemSuggestions={systemSuggestions ?? []}
        tagsQueryKey={specKeys.tags(orgSlug)}
        storageKey={`create-spec-draft:${orgSlug}`}
      />
    </div>
  );
}
