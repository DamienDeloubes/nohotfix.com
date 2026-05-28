import { useSubheader } from '@/components/layout/SubheaderContext.js';
import { LordiconIcon } from '@/components/ui/LordiconIcon.js';
import { ArchivePlaybookDialog, PlaybookListEmptyState, useArchivePlaybook, usePlaybookList } from '@nohotfix/domain-authoring/ui';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { playbookKeys } from '../../../../api/query-keys.js';
import BookIcon from './../../../../assets/icons/book.json';
import ChecklistIcon from './../../../../assets/icons/check-list.json';
import ClockIcon from './../../../../assets/icons/clock.json';

export const Route = createFileRoute('/_authenticated/$orgSlug/playbooks/')({
  component: PlaybooksPage,
});

const TABS = ['active', 'archived'] as const;
type Tab = (typeof TABS)[number];

function PlaybooksPage() {
  const { orgSlug, role } = useOrgContext();
  const { setSubheader, subheader } = useSubheader();
  const navigate = useNavigate();
  const isAdmin = requireRole(role, { minimum: 'admin' });
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [archiveTarget, setArchiveTarget] = useState<{ id: string; name: string } | null>(null);

  const isArchived = activeTab === 'archived';
  const invalidateKeys = [playbookKeys.all(orgSlug)];

  const { data, isLoading, error } = usePlaybookList({
    orgSlug,
    queryKey: playbookKeys.list(orgSlug, { isArchived }),
    isArchived,
  });

  const handleCreateClick = () => {
    void navigate({ to: '/$orgSlug/playbooks/new', params: { orgSlug } });
  };

  useEffect(() => {
    console.log('subheader: ', subheader);
  }, [subheader]);

  useEffect(() => {
    setSubheader({
      title: 'Playbooks',
      description: 'Manage your Playbook templates',
      icon: BookIcon,
      actions:
        isAdmin && activeTab === 'active'
          ? [
              <button type="button" onClick={handleCreateClick}>
                + New playbook
              </button>,
            ]
          : [],
    });
  }, [isAdmin, activeTab]);

  return (
    <main className="layout-area-main layout-main">
      <div className="layout-area-tab">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`rounded-lg cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors duration-150 capitalize ${
                  activeTab === t
                    ? 'bg-[var(--glass-12)] text-[var(--text-primary)]'
                    : 'text-secondary hover:bg-[var(--glass-8)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="layout-area-main ">
        <div className="max-w-7xl mx-auto py-6">
          {isLoading && <div className="py-12 text-center text-sm text-muted">Loading playbooks...</div>}

          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-600 dark:border-error-800 dark:bg-error-900/20 dark:text-error-400">
              Failed to load playbooks: {error.message}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {data && data.playbooks.length > 0
              ? data.playbooks.map((playbook) => (
                  //   <Card className="w-[400px] rounded-lg border-surface-border" key={playbook.id}>
                  //     {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
                  //     <LordiconIcon icon={BookIcon} size={24} colors="var(--color-primary)" />

                  //     <Card.Header>
                  //       <Card.Title>{playbook.name}</Card.Title>
                  //       <Card.Description>{playbook.description}</Card.Description>
                  //     </Card.Header>
                  //     <Card.Footer>
                  //       <Link aria-label="Go to Acme Creator Hub (opens in new tab)" href="https://heroui.com" rel="noopener noreferrer" target="_blank">
                  //         View playbook
                  //         <Link.Icon aria-hidden="true" />
                  //       </Link>
                  //     </Card.Footer>
                  //   </Card>
                  <div key={playbook.id} className="bg-white rounded-md border border-surface-border p-6 relative">
                    <div className="">
                      <h4 className="text-[var(--text-primary)] font-semibold text-xl">{playbook.name}</h4>
                      {playbook.description && <span className="text-muted text-sm">{playbook.description}</span>}
                    </div>

                    <div className="mt-4">
                      <ul className="space-x-2">
                        <li className="inline-block">
                          <div className="flex items-center gap-1">
                            <LordiconIcon icon={ChecklistIcon} size={16} colors="var(--color-muted)" />
                            <span className="text-muted text-sm">{!playbook.specCount ? 'No specs added' : `${playbook.specCount} specs`}</span>
                          </div>
                        </li>

                        {playbook.specCount > 0 && (
                          <li className="inline-block">
                            <div className="flex items-center gap-1">
                              <LordiconIcon icon={ClockIcon} size={16} colors="var(--color-muted)" />
                              <span className="text-muted text-sm">{playbook.specCount} minutes</span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="absolute right-0 bottom-0 p-1">
                      <div className="flex flex-row gap-1">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="bg-go-500 rounded-full w-2 min-h-24"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>

          {data && data.playbooks.length === 0 && (
            <PlaybookListEmptyState
              role={role}
              onCreateClick={activeTab === 'active' ? handleCreateClick : undefined}
              message={activeTab === 'archived' ? 'No archived playbooks.' : undefined}
            />
          )}

          {/* {data && data.playbooks.length > 0 && (
        <PlaybookCardGrid
          playbooks={data.playbooks}
          role={role}
          onRowClick={handleRowClick}
          isArchivedTab={isArchived}
          onArchive={isAdmin ? (id, name) => setArchiveTarget({ id, name }) : undefined}
          onUnarchive={isAdmin ? handleUnarchive : undefined}
        />
      )} */}

          {archiveTarget && (
            <ArchivePlaybookDialogWrapper
              orgSlug={orgSlug}
              playbookId={archiveTarget.id}
              playbookName={archiveTarget.name}
              invalidateKeys={invalidateKeys}
              onClose={() => setArchiveTarget(null)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function ArchivePlaybookDialogWrapper({
  orgSlug,
  playbookId,
  playbookName,
  invalidateKeys,
  onClose,
}: {
  orgSlug: string;
  playbookId: string;
  playbookName: string;
  invalidateKeys: readonly (readonly unknown[])[];
  onClose: () => void;
}) {
  const archiveMutation = useArchivePlaybook({ orgSlug, playbookId, invalidateKeys });

  return (
    <ArchivePlaybookDialog
      open
      playbookName={playbookName}
      orgSlug={orgSlug}
      playbookId={playbookId}
      queryKey={playbookKeys.archiveInfo(orgSlug, playbookId)}
      onCancel={onClose}
      onConfirm={() => {
        archiveMutation.mutate(undefined, {
          onSuccess: () => onClose(),
        });
      }}
    />
  );
}
