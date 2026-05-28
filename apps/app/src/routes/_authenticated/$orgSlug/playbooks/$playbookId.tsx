import { PlaybookHistoryTimeline, usePlaybookHistory } from '@nohotfix/domain-audit/ui';
import {
  ArchivePlaybookDialog,
  PlaybookEditor,
  useAddSpecToPlaybook,
  useArchivePlaybook,
  useCreateSection,
  useDeleteSection,
  usePlaybookDetail,
  useRemoveSpecFromPlaybook,
  useUnarchivePlaybook,
  useUpdatePlaybook,
  useUpdateSection,
} from '@nohotfix/domain-authoring/ui';
import { useEnvironments, useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { environmentKeys, playbookKeys, specKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/playbooks/$playbookId')({
  component: PlaybookDetailPage,
});

const TABS = ['editor', 'history'] as const;
type Tab = (typeof TABS)[number];

function PlaybookDetailPage() {
  const { playbookId } = Route.useParams();
  const { orgSlug, role } = useOrgContext();
  const navigate = useNavigate();
  const isAdmin = requireRole(role, { minimum: 'admin' });
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const detailQueryKey = playbookKeys.detail(orgSlug, playbookId);
  const invalidateKeys = [detailQueryKey, playbookKeys.all(orgSlug)];

  const { data, isLoading, error } = usePlaybookDetail({
    orgSlug,
    playbookId,
    queryKey: detailQueryKey,
  });

  const { data: envData } = useEnvironments({
    orgSlug,
    queryKey: environmentKeys.list(orgSlug),
  });

  const historyQuery = usePlaybookHistory({
    orgSlug,
    playbookId,
    queryKey: playbookKeys.history(orgSlug, playbookId),
  });

  const updatePlaybook = useUpdatePlaybook({ orgSlug, playbookId, invalidateKeys });
  const addSpec = useAddSpecToPlaybook({ orgSlug, playbookId, invalidateKeys });
  const removeSpec = useRemoveSpecFromPlaybook({ orgSlug, playbookId, invalidateKeys });
  const createSec = useCreateSection({ orgSlug, playbookId, invalidateKeys });
  const updateSec = useUpdateSection({ orgSlug, playbookId, invalidateKeys });
  const deleteSec = useDeleteSection({ orgSlug, playbookId, invalidateKeys });
  const archiveMutation = useArchivePlaybook({ orgSlug, playbookId, invalidateKeys });
  const unarchiveMutation = useUnarchivePlaybook({ orgSlug, playbookId, invalidateKeys });

  const isArchived = data?.playbook.isArchived ?? false;

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>Loading playbook...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: '2rem' }}>Playbook not found</div>;
  }

  const handleArchiveConfirm = () => {
    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        setShowArchiveDialog(false);
        void navigate({ to: '/$orgSlug/playbooks', params: { orgSlug } });
      },
    });
  };

  const handleUnarchive = () => {
    unarchiveMutation.mutate(undefined);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        {isArchived && (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#92400e',
              backgroundColor: '#fef3c7',
              borderRadius: '9999px',
              border: '1px solid #fcd34d',
            }}
          >
            Archived
          </span>
        )}
        {isAdmin && <PlaybookActionMenu isArchived={isArchived} onArchive={() => setShowArchiveDialog(true)} onUnarchive={handleUnarchive} />}
      </div>

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
              color: activeTab === t ? 'var(--color-primary)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              borderBottom: activeTab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-1px',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'editor' && (
        <PlaybookEditor
          data={data}
          orgSlug={orgSlug}
          specSearchQueryKey={specKeys.lists(orgSlug)}
          environments={envData?.environments?.map((e) => ({ id: e.id, name: e.name })) ?? []}
          {...(isAdmin && !isArchived
            ? {
                onUpdatePlaybook: (fields: { name?: string; description?: string; environmentId?: string | null }) => {
                  void updatePlaybook.mutateAsync(fields);
                },
                onAddSpec: (specLibraryId: string, sectionId: string | null) => {
                  void addSpec.mutateAsync({ specLibraryId, ...(sectionId != null ? { sectionId } : {}) });
                },
                onRemoveSpec: (specId: string) => {
                  void removeSpec.mutateAsync({ specId });
                },
                onAddSection: (name: string) => {
                  void createSec.mutateAsync({ name });
                },
                onRenameSection: (sectionId: string, name: string) => {
                  void updateSec.mutateAsync({ sectionId, name });
                },
                onDeleteSection: (sectionId: string) => {
                  void deleteSec.mutateAsync({ sectionId });
                },
              }
            : {})}
        />
      )}

      {activeTab === 'history' && (
        <>
          {historyQuery.isLoading && <div style={{ padding: '1rem', color: '#6b7280' }}>Loading history...</div>}
          {historyQuery.isError && <div style={{ padding: '1rem', color: '#ef4444' }}>Failed to load history.</div>}
          {historyQuery.data && <PlaybookHistoryTimeline entries={historyQuery.data.entries} />}
        </>
      )}

      {showArchiveDialog && (
        <ArchivePlaybookDialog
          open
          playbookName={data.playbook.name}
          orgSlug={orgSlug}
          playbookId={playbookId}
          queryKey={playbookKeys.archiveInfo(orgSlug, playbookId)}
          onCancel={() => setShowArchiveDialog(false)}
          onConfirm={handleArchiveConfirm}
        />
      )}
    </div>
  );
}

function PlaybookActionMenu({ isArchived, onArchive, onUnarchive }: { isArchived: boolean; onArchive: () => void; onUnarchive: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={menuRef} style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#6b7280',
        }}
        aria-label="Actions"
      >
        &#8943;
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '4px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            minWidth: '160px',
          }}
        >
          {isArchived ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onUnarchive();
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#374151',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              Unarchive
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onArchive();
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#dc2626',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              Archive playbook
            </button>
          )}
        </div>
      )}
    </div>
  );
}
