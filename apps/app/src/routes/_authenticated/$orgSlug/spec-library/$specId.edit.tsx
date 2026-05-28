import { EditSpecForm, useSpecDetail, useSystemsUnderTest } from '@nohotfix/domain-authoring/ui';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useBlocker, useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';

import { specKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/spec-library/$specId/edit')({
  component: EditSpecPage,
});

function EditSpecPage() {
  const { orgSlug, role } = useOrgContext();
  const { specId } = Route.useParams();
  const navigate = useNavigate();
  const isAdmin = requireRole(role, { minimum: 'admin' });
  const isDirtyRef = useRef(false);

  useBlocker({
    shouldBlockFn: () => {
      if (!isDirtyRef.current) return false;
      return !window.confirm('You have unsaved changes. Are you sure you want to leave?');
    },
  });

  const specQuery = useSpecDetail({
    orgSlug,
    specId,
    queryKey: specKeys.detail(orgSlug, specId),
  });

  const { data: systemSuggestions } = useSystemsUnderTest({
    orgSlug,
    queryKey: specKeys.systemsUnderTest(orgSlug),
  });

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Access Denied</h2>
        <p>You need admin access to edit specs.</p>
      </div>
    );
  }

  if (specQuery.isLoading) {
    return <div style={{ padding: '2rem', color: '#6b7280' }}>Loading spec...</div>;
  }

  if (specQuery.isError || !specQuery.data) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Spec not found</h2>
        <p>The spec you are trying to edit does not exist or could not be loaded.</p>
      </div>
    );
  }

  if (specQuery.data.isArchived) {
    void navigate({ to: '/$orgSlug/spec-library/$specId', params: { orgSlug, specId } });
    return null;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Edit Spec</h1>
      <EditSpecForm
        orgSlug={orgSlug}
        specId={specId}
        spec={specQuery.data}
        invalidateKeys={[specKeys.detail(orgSlug, specId), specKeys.lists(orgSlug), specKeys.history(orgSlug, specId)]}
        onSuccess={() => {
          isDirtyRef.current = false;
          void navigate({ to: '/$orgSlug/spec-library/$specId', params: { orgSlug, specId } });
        }}
        onCancel={() => {
          void navigate({ to: '/$orgSlug/spec-library/$specId', params: { orgSlug, specId } });
        }}
        onDirtyChange={(dirty) => {
          isDirtyRef.current = dirty;
        }}
        systemSuggestions={systemSuggestions ?? []}
        tagsQueryKey={specKeys.tags(orgSlug)}
      />
    </div>
  );
}
