import { useSubheader } from '@/components/layout/SubheaderContext.js';
import { AppButton } from '@/components/ui/AppButton.js';
import { AppInput } from '@/components/ui/AppInput.js';
import { AppSelect } from '@/components/ui/AppSelect.js';
import { ArchiveConfirmDialog, SpecLibraryEmptyState, SpecLibraryPagination, SpecLibraryTable, useArchiveSpec, useSpecList, useUnarchiveSpec } from '@nohotfix/domain-authoring/ui';
import { useOrgContext } from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

import { playbookKeys, specKeys } from '../../../../api/query-keys.js';
import { useToast } from '../../../../components/ui/Toast.js';
import ChecklistIcon from './../../../../assets/icons/check-list.json';

const searchSchema = z.object({
  tab: z.enum(['active', 'archived']).default('active').catch('active'),
  q: z.string().optional().catch(undefined),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional().catch(undefined),
  sort: z.enum(['title', 'system', 'severity', 'updated']).default('updated').catch('updated'),
  order: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  page: z.coerce.number().int().min(1).default(1).catch(1),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_authenticated/$orgSlug/spec-library/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: SpecLibraryPage,
});

/* ------------------------------------------------------------------ */
/*  Subheader toolbar                                                 */
/* ------------------------------------------------------------------ */

function SubheaderActions({
  q,
  severity,
  tab,
  orgSlug,
  onSearchChange,
  onSeverityChange,
  onTabChange,
}: {
  q: string | undefined;
  severity: string | undefined;
  tab: 'active' | 'archived';
  orgSlug: string;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: string | undefined) => void;
  onTabChange: (value: 'active' | 'archived') => void;
}) {
  const [localSearch, setLocalSearch] = useState(q ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navigate = useNavigate({ from: '/$orgSlug/spec-library/' });

  useEffect(() => {
    setLocalSearch(q ?? '');
  }, [q]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleSearchInput(value: string) {
    setLocalSearch(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  }

  return (
    <>
      <AppInput aria-label="Search specs" placeholder="Search specs..." value={localSearch} onChange={(e) => handleSearchInput(e.target.value)} className="max-w-[280px]" />
      <AppSelect
        aria-label="Filter by severity"
        placeholder="All severities"
        value={severity ?? null}
        onChange={(val) => onSeverityChange(val ? String(val) : undefined)}
        options={[
          { key: 'critical', label: 'Critical' },
          { key: 'high', label: 'High' },
          { key: 'medium', label: 'Medium' },
          { key: 'low', label: 'Low' },
        ]}
        className="w-[160px]"
      />
      <AppSelect
        aria-label="Filter by status"
        value={tab}
        onChange={(val) => {
          if (val) onTabChange(val as 'active' | 'archived');
        }}
        options={[
          { key: 'active', label: 'Active' },
          { key: 'archived', label: 'Archived' },
        ]}
        className="w-[130px]"
      />
      <AppButton intent="primary" onPress={() => void navigate({ to: '/$orgSlug/spec-library/new', params: { orgSlug } })}>
        + New spec
      </AppButton>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

function SpecLibraryPage() {
  const { orgSlug, role } = useOrgContext();
  const { setSubheader } = useSubheader();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { toast } = useToast();

  const isAdmin = requireRole(role, { minimum: 'admin' });

  const { tab, q, severity, sort, order, page } = search;

  const [archiveDialogSpecId, setArchiveDialogSpecId] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useSpecList({
    orgSlug,
    queryKey: specKeys.list(orgSlug, { tab, q, severity, sort, order, page }),
    params: { tab, q, severity, sort, order, page },
  });

  const [archiveDialogSpecTitle, setArchiveDialogSpecTitle] = useState('');

  const archiveMutation = useArchiveSpec({
    orgSlug,
    specId: archiveDialogSpecId ?? '',
    invalidateKeys: [specKeys.lists(orgSlug), playbookKeys.lists(orgSlug), playbookKeys.details(orgSlug)],
  });

  const [unarchiveSpecId, setUnarchiveSpecId] = useState<string | null>(null);
  const unarchiveMutation = useUnarchiveSpec({
    orgSlug,
    specId: unarchiveSpecId ?? '',
    invalidateKeys: [specKeys.lists(orgSlug)],
  });

  const updateSearch = useCallback(
    (updates: Partial<SearchParams>) => {
      void navigate({
        search: (prev) => ({ ...prev, ...updates }),
      });
    },
    [navigate],
  );

  const handleTabChange = useCallback(
    (newTab: 'active' | 'archived') => {
      void navigate({
        search: { tab: newTab, sort: 'updated', order: 'desc', page: 1 },
      });
    },
    [navigate],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      updateSearch({ q: value || undefined, page: 1 });
    },
    [updateSearch],
  );

  const handleSeverityChange = useCallback(
    (value: string | undefined) => {
      updateSearch({ severity: value as SearchParams['severity'], page: 1 });
    },
    [updateSearch],
  );

  function handleSortChange(params: { sort: string; order: string }) {
    updateSearch({ sort: params.sort as SearchParams['sort'], order: params.order as SearchParams['order'], page: 1 });
  }

  function handlePageChange(newPage: number) {
    updateSearch({ page: newPage });
  }

  function handleRowClick(specId: string) {
    void navigate({
      to: '/$orgSlug/spec-library/$specId',
      params: { orgSlug, specId },
    });
  }

  function handleEditClick(specId: string) {
    void navigate({
      to: '/$orgSlug/spec-library/$specId/edit',
      params: { orgSlug, specId },
    });
  }

  function handleCreateSpec() {
    void navigate({
      to: '/$orgSlug/spec-library/new',
      params: { orgSlug },
    });
  }

  function handleClearSearch() {
    updateSearch({ q: undefined, severity: undefined, page: 1 });
  }

  function handleArchiveClick(specId: string) {
    const spec = data?.items.find((item) => item.id === specId);
    setArchiveDialogSpecTitle(spec?.title ?? 'this spec');
    setArchiveDialogSpecId(specId);
  }

  function handleArchiveConfirm() {
    if (!archiveDialogSpecId) return;
    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        toast('Spec archived.', 'success');
        setArchiveDialogSpecId(null);
      },
      onError: () => {
        toast('Failed to archive spec. Please try again.', 'error');
        setArchiveDialogSpecId(null);
      },
    });
  }

  function handleUnarchiveClick(specId: string) {
    setUnarchiveSpecId(specId);
    setTimeout(() => {
      unarchiveMutation.mutate(undefined, {
        onSuccess: () => {
          toast('Spec unarchived.', 'success');
          setUnarchiveSpecId(null);
        },
        onError: () => {
          toast('Failed to unarchive spec. Please try again.', 'error');
          setUnarchiveSpecId(null);
        },
      });
    }, 0);
  }

  function getEmptyVariant(): 'empty-library' | 'no-results' | 'no-archived' | 'invalid-page' | null {
    if (!data || data.items.length > 0) return null;
    if (data.total === 0 && !q && !severity) {
      return tab === 'archived' ? 'no-archived' : 'empty-library';
    }
    if (data.total === 0 && (q || severity)) return 'no-results';
    if (page > data.totalPages && data.totalPages > 0) return 'invalid-page';
    return null;
  }

  const emptyVariant = isError ? 'error' : getEmptyVariant();

  useEffect(() => {
    setSubheader({
      title: 'Spec Library',
      description: 'Manage your Specs',
      icon: ChecklistIcon,
      actions: (
        <SubheaderActions
          q={q}
          severity={severity}
          tab={tab}
          orgSlug={orgSlug}
          onSearchChange={handleSearchChange}
          onSeverityChange={handleSeverityChange}
          onTabChange={handleTabChange}
        />
      ),
    });
  }, [q, severity, tab, orgSlug, handleSearchChange, handleSeverityChange, handleTabChange, setSubheader]);

  return (
    <div className="main-top-padding">
      {emptyVariant ? (
        <SpecLibraryEmptyState variant={emptyVariant} onClearSearch={handleClearSearch} onCreateSpec={handleCreateSpec} onRetry={() => void refetch()} />
      ) : (
        <>
          <SpecLibraryTable
            items={data?.items ?? []}
            isLoading={isLoading || isFetching}
            onRowClick={handleRowClick}
            onEditClick={isAdmin ? handleEditClick : undefined}
            sort={sort}
            order={order}
            onSortChange={handleSortChange}
            tab={tab}
            userRole={role as 'owner' | 'admin' | 'member'}
            onArchiveClick={isAdmin ? handleArchiveClick : undefined}
            onUnarchiveClick={isAdmin ? handleUnarchiveClick : undefined}
          />
          {data && <SpecLibraryPagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={handlePageChange} />}
        </>
      )}

      {archiveDialogSpecId && (
        <ArchiveConfirmDialog
          open={archiveDialogSpecId !== null}
          specTitle={archiveDialogSpecTitle}
          orgSlug={orgSlug}
          specId={archiveDialogSpecId}
          queryKey={specKeys.impact(orgSlug, archiveDialogSpecId)}
          onConfirm={handleArchiveConfirm}
          onCancel={() => setArchiveDialogSpecId(null)}
        />
      )}
    </div>
  );
}
