import {
  ArchiveConfirmDialog,
  SpecDetail,
  SpecDetailActions,
  SpecHistoryTimeline,
  useArchiveSpec,
  useSpecDetail,
  useSpecHistory,
  useUnarchiveSpec,
} from '@nohotfix/domain-authoring/ui';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { playbookKeys, specKeys } from '../../../../api/query-keys.js';
import { useToast } from '../../../../components/ui/Toast.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/spec-library/$specId/')({
  component: SpecDetailPage,
});

const TABS = ['details', 'history'] as const;
type Tab = (typeof TABS)[number];

function SpecDetailPage() {
  const { orgSlug, role } = useOrgContext();
  const { specId } = Route.useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = requireRole(role, { minimum: 'admin' });
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const specQuery = useSpecDetail({ orgSlug, specId, queryKey: specKeys.detail(orgSlug, specId) });
  const isArchived = specQuery.data?.isArchived ?? false;

  const archiveMutation = useArchiveSpec({
    orgSlug,
    specId,
    invalidateKeys: [specKeys.lists(orgSlug), specKeys.detail(orgSlug, specId), specKeys.history(orgSlug, specId), playbookKeys.lists(orgSlug), playbookKeys.details(orgSlug)],
  });

  const unarchiveMutation = useUnarchiveSpec({
    orgSlug,
    specId,
    invalidateKeys: [specKeys.lists(orgSlug), specKeys.detail(orgSlug, specId), specKeys.history(orgSlug, specId)],
  });

  const historyQuery = useSpecHistory({
    orgSlug,
    specId,
    queryKey: specKeys.history(orgSlug, specId),
  });

  function handleEditClick() {
    void navigate({
      to: '/$orgSlug/spec-library/$specId/edit',
      params: { orgSlug, specId },
    });
  }

  function handleArchiveConfirm() {
    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        toast('Spec archived.', 'success');
        setShowArchiveDialog(false);
        void navigate({
          to: '/$orgSlug/spec-library',
          params: { orgSlug },
          search: { tab: 'active' as const, sort: 'updated' as const, order: 'desc' as const, page: 1 },
        });
      },
      onError: () => {
        toast('Failed to archive spec. Please try again.', 'error');
        setShowArchiveDialog(false);
      },
    });
  }

  function handleUnarchiveClick() {
    unarchiveMutation.mutate(undefined, {
      onSuccess: () => {
        toast('Spec unarchived.', 'success');
      },
      onError: () => {
        toast('Failed to unarchive spec. Please try again.', 'error');
      },
    });
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Access Denied</h2>
        <p>You need admin access to view specs.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <SpecDetailActions
        isArchived={isArchived}
        userRole={role as 'owner' | 'admin' | 'member'}
        onEditClick={!isArchived ? handleEditClick : undefined}
        onArchiveClick={!isArchived ? () => setShowArchiveDialog(true) : undefined}
        onUnarchiveClick={isArchived ? handleUnarchiveClick : undefined}
      />

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === t ? 600 : 400,
              color: activeTab === t ? '#2563eb' : '#6b7280',
              fontSize: '0.875rem',
              borderBottom: activeTab === t ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-1px',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'details' && <SpecDetail orgSlug={orgSlug} specId={specId} queryKey={specKeys.detail(orgSlug, specId)} isArchived={isArchived} />}

      {activeTab === 'history' && (
        <>
          {historyQuery.isLoading && <div style={{ padding: '1rem', color: '#6b7280' }}>Loading history...</div>}
          {historyQuery.isError && <div style={{ padding: '1rem', color: '#ef4444' }}>Failed to load history.</div>}
          {historyQuery.data && <SpecHistoryTimeline entries={historyQuery.data.entries} />}
        </>
      )}

      <ArchiveConfirmDialog
        open={showArchiveDialog}
        specTitle={specQuery.data?.title ?? 'this spec'}
        orgSlug={orgSlug}
        specId={specId}
        queryKey={specKeys.impact(orgSlug, specId)}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setShowArchiveDialog(false)}
      />
    </div>
  );
}
