import { CreatePlaybookForm } from '@nohotfix/domain-authoring/ui';
import { useEnvironments, useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { environmentKeys, playbookKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/playbooks/new')({
  component: NewPlaybookPage,
});

function NewPlaybookPage() {
  const { orgSlug, role } = useOrgContext();
  const navigate = useNavigate();
  const isAdmin = requireRole(role, { minimum: 'admin' });

  const { data: envData } = useEnvironments({
    orgSlug,
    queryKey: environmentKeys.list(orgSlug),
  });

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Access Denied</h2>
        <p>You need admin access to create playbooks.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create New Playbook</h1>
      <CreatePlaybookForm
        orgSlug={orgSlug}
        invalidateKeys={[playbookKeys.lists(orgSlug)]}
        environments={envData?.environments?.map((e) => ({ id: e.id, name: e.name })) ?? []}
        onSuccess={(playbook) => {
          void navigate({ to: '/$orgSlug/playbooks/$playbookId', params: { orgSlug, playbookId: playbook.id } });
        }}
        onCancel={() => {
          void navigate({ to: '/$orgSlug/playbooks', params: { orgSlug } });
        }}
      />
    </div>
  );
}
