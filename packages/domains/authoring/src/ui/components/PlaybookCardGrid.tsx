import { useCallback, useEffect, useRef, useState } from 'react';

import type { PlaybookListItem } from '../hooks/use-playbook-list.js';

interface PlaybookCardGridProps {
  playbooks: PlaybookListItem[];
  role: string;
  onRowClick: ((playbookId: string) => void) | undefined;
  isArchivedTab: boolean | undefined;
  onArchive: ((playbookId: string, playbookName: string) => void) | undefined;
  onUnarchive: ((playbookId: string) => void) | undefined;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(iso);
}

function CardActionMenu({
  playbookId,
  playbookName,
  role,
  isArchivedTab,
  onRowClick,
  onArchive,
  onUnarchive,
}: {
  playbookId: string;
  playbookName: string;
  role: string;
  isArchivedTab: boolean;
  onRowClick: ((playbookId: string) => void) | undefined;
  onArchive: ((playbookId: string, playbookName: string) => void) | undefined;
  onUnarchive: ((playbookId: string) => void) | undefined;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAdmin = role === 'admin' || role === 'owner';

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

  const menuItems: { label: string; onClick: () => void; destructive?: boolean }[] = [];

  if (isArchivedTab) {
    menuItems.push({ label: 'View', onClick: () => onRowClick?.(playbookId) });
    if (isAdmin && onUnarchive) {
      menuItems.push({ label: 'Unarchive', onClick: () => onUnarchive(playbookId) });
    }
  } else {
    menuItems.push({ label: 'Open', onClick: () => onRowClick?.(playbookId) });
    if (isAdmin && onArchive) {
      menuItems.push({
        label: 'Archive',
        onClick: () => onArchive(playbookId, playbookName),
        destructive: true,
      });
    }
  }

  if (menuItems.length === 0) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-secondary opacity-0 transition-opacity duration-150 group-hover/card:opacity-100 hover:bg-[var(--glass-8)]"
        aria-label="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-[var(--glass-border)] bg-surface-elevated shadow-[var(--shadow-2)]">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick();
              }}
              className={`block w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-[var(--glass-8)] ${item.destructive ? 'text-error-500' : 'text-secondary'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlaybookCardGrid({ playbooks, role, onRowClick, isArchivedTab, onArchive, onUnarchive }: PlaybookCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playbooks.map((pb) => (
        <button
          key={pb.id}
          type="button"
          onClick={() => onRowClick?.(pb.id)}
          className={`group/card relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--glass-border)] bg-surface-card text-left transition-all duration-300 hover:border-[var(--glass-border-strong)] hover:shadow-[var(--shadow-2)] ${
            isArchivedTab ? 'opacity-75 hover:opacity-100' : ''
          }`}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
        >
          {/* Accent left border */}
          <div className={`absolute inset-y-0 left-0 w-1 ${isArchivedTab ? 'bg-slate-300 dark:bg-slate-700' : 'bg-blue-400'}`} />

          {/* Card content */}
          <div className="flex flex-1 flex-col gap-3 py-4 pl-5 pr-4">
            {/* Header row: name + action menu */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold leading-snug text-base-900 dark:text-slate-50">{pb.name}</h3>
              <CardActionMenu
                playbookId={pb.id}
                playbookName={pb.name}
                role={role}
                isArchivedTab={isArchivedTab ?? false}
                onRowClick={onRowClick}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
              />
            </div>

            {/* Description */}
            {pb.description && <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{pb.description}</p>}

            {/* Metadata row */}
            <div className="mt-auto flex items-center gap-3 pt-1">
              {pb.environmentName && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--glass-8)] px-2.5 py-0.5 text-xs font-medium text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-go-400" />
                  {pb.environmentName}
                </span>
              )}
              <span className="text-xs text-muted">
                {pb.specCount} {pb.specCount === 1 ? 'spec' : 'specs'}
              </span>
              <span className="ml-auto text-xs text-muted">{formatRelativeDate(pb.createdAt)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
