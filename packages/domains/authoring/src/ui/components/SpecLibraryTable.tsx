import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { SpecListItem } from '@releasepilot/shared';

import { SeverityBadge } from './SeverityBadge.js';
import { TagPills } from './TagPills.js';

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) {
    const diffMonth = Math.floor(diffDay / 30);
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  }
  if (diffDay > 0) return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  if (diffHr > 0) return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`;
  if (diffMin > 0) return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  return 'just now';
}

const SORT_COLUMNS: Record<string, string> = {
  title: 'title',
  systemUnderTest: 'system',
  severity: 'severity',
  updatedAt: 'updated',
};

interface SpecLibraryTableProps {
  items: SpecListItem[];
  isLoading: boolean;
  onRowClick: (specId: string) => void;
  onEditClick?: ((specId: string) => void) | undefined;
  sort: string;
  order: string;
  onSortChange: (params: { sort: string; order: string }) => void;
  tab?: 'active' | 'archived' | undefined;
  userRole?: 'owner' | 'admin' | 'member' | undefined;
  onArchiveClick?: ((specId: string) => void) | undefined;
  onUnarchiveClick?: ((specId: string) => void) | undefined;
}

function ActionMenu({
  specId,
  tab,
  userRole,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
}: {
  specId: string;
  tab: 'active' | 'archived';
  userRole: 'owner' | 'admin' | 'member';
  onView: (specId: string) => void;
  onEdit?: ((specId: string) => void) | undefined;
  onArchive?: ((specId: string) => void) | undefined;
  onUnarchive?: ((specId: string) => void) | undefined;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdminOrOwner = userRole === 'admin' || userRole === 'owner';

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [open, handleClickOutside]);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        className="bg-transparent border-none cursor-pointer px-2 py-1 text-base text-white/30 leading-none hover:text-white/60 transition-colors [transition-duration:var(--duration-fast)]"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        title="Actions"
      >
        &#8942;
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 min-w-[140px] bg-base-800 border border-[var(--glass-border)] rounded-[var(--radius-sm)] [box-shadow:var(--shadow-3)] py-1">
          <MenuButton
            label="View"
            onClick={() => {
              setOpen(false);
              onView(specId);
            }}
          />
          {tab === 'active' && onEdit && (
            <MenuButton
              label="Edit spec"
              onClick={() => {
                setOpen(false);
                onEdit(specId);
              }}
            />
          )}
          {tab === 'active' && isAdminOrOwner && onArchive && (
            <MenuButton
              label="Archive"
              onClick={() => {
                setOpen(false);
                onArchive(specId);
              }}
              destructive
            />
          )}
          {tab === 'archived' && isAdminOrOwner && onUnarchive && (
            <MenuButton
              label="Unarchive"
              onClick={() => {
                setOpen(false);
                onUnarchive(specId);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MenuButton({ label, onClick, destructive }: { label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button
      type="button"
      className={`block w-full px-3 py-1.5 text-[0.8125rem] text-left bg-transparent border-none cursor-pointer transition-colors [transition-duration:var(--duration-fast)] ${
        destructive ? 'text-error-500 hover:bg-error-500/10' : 'text-white/60 hover:bg-[var(--glass-8)] hover:text-white'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const columnHelper = createColumnHelper<SpecListItem>();

export function SpecLibraryTable({
  items,
  isLoading,
  onRowClick,
  onEditClick,
  sort,
  order,
  onSortChange,
  tab = 'active',
  userRole = 'member',
  onArchiveClick,
  onUnarchiveClick,
}: SpecLibraryTableProps) {
  function handleHeaderClick(columnId: string) {
    const sortCol = SORT_COLUMNS[columnId];
    if (!sortCol) return;

    if (sort === sortCol && order === 'asc') {
      onSortChange({ sort: sortCol, order: 'desc' });
    } else if (sort === sortCol && order === 'desc') {
      onSortChange({ sort: 'updated', order: 'desc' });
    } else {
      onSortChange({ sort: sortCol, order: 'asc' });
    }
  }

  function getSortIndicator(columnId: string): string {
    const sortCol = SORT_COLUMNS[columnId];
    if (!sortCol || sort !== sortCol) return '';
    return order === 'asc' ? ' \u2191' : ' \u2193';
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <span className="block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('systemUnderTest', {
        header: 'System under test',
        cell: (info) => info.getValue() ?? <span className="text-white/20">&mdash;</span>,
      }),
      columnHelper.accessor('severity', {
        header: 'Severity',
        cell: (info) => <SeverityBadge severity={info.getValue() as 'critical' | 'high' | 'medium' | 'low' | null} />,
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        enableSorting: false,
        cell: (info) => <TagPills tags={info.getValue()} />,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last updated',
        cell: (info) => <span className="whitespace-nowrap text-white/40">{relativeTime(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <ActionMenu
            specId={info.row.original.id}
            tab={tab}
            userRole={userRole}
            onView={onRowClick}
            onEdit={tab === 'active' ? onEditClick : undefined}
            onArchive={onArchiveClick}
            onUnarchive={onUnarchiveClick}
          />
        ),
      }),
    ],
    [tab, userRole, onRowClick, onEditClick, onArchiveClick, onUnarchiveClick],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-base-950/60 flex items-center justify-center z-10">
          <span className="text-sm text-white/40">Loading...</span>
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.id in SORT_COLUMNS;
                return (
                  <th
                    key={header.id}
                    className={`px-3 py-2.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider border-b-2 border-[var(--glass-border)] whitespace-nowrap select-none ${
                      isSortable ? 'cursor-pointer hover:text-white/60 transition-colors [transition-duration:var(--duration-fast)]' : ''
                    } ${header.column.id === 'title' ? 'min-w-[200px]' : ''} ${header.column.id === 'actions' ? 'w-10' : ''}`}
                    onClick={isSortable ? () => handleHeaderClick(header.column.id) : undefined}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {getSortIndicator(header.column.id)}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer border-b border-[var(--glass-border)] hover:bg-[var(--glass-4)] transition-colors [transition-duration:var(--duration-fast)]"
              onClick={() => onRowClick(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-3 py-2.5 align-middle ${cell.column.id === 'actions' ? 'text-center whitespace-nowrap' : ''}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
