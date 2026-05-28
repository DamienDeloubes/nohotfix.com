import { useCallback, useEffect, useRef, useState } from 'react';

import type { PlaybookListItem } from '../hooks/use-playbook-list.js';

interface PlaybookListTableProps {
  playbooks: PlaybookListItem[];
  role: string;
  onRowClick: ((playbookId: string) => void) | undefined;
  isArchivedTab: boolean | undefined;
  onArchive: ((playbookId: string, playbookName: string) => void) | undefined;
  onUnarchive: ((playbookId: string) => void) | undefined;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function ActionMenu({
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

  const menuItems: { label: string; onClick: () => void }[] = [];

  if (isArchivedTab) {
    menuItems.push({ label: 'View', onClick: () => onRowClick?.(playbookId) });
    if (isAdmin && onUnarchive) {
      menuItems.push({ label: 'Unarchive', onClick: () => onUnarchive(playbookId) });
    }
  } else {
    menuItems.push({ label: 'Open', onClick: () => onRowClick?.(playbookId) });
    if (isAdmin && onArchive) {
      menuItems.push({ label: 'Archive', onClick: () => onArchive(playbookId, playbookName) });
    }
  }

  if (menuItems.length === 0) return null;

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
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
            minWidth: '140px',
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick();
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
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlaybookListTable({ playbooks, role, onRowClick, isArchivedTab, onArchive, onUnarchive }: PlaybookListTableProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
          <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Name</th>
          <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Environment</th>
          <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Specs</th>
          <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Created</th>
          <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', width: '60px' }} />
        </tr>
      </thead>
      <tbody>
        {playbooks.map((pb) => (
          <tr
            key={pb.id}
            onClick={() => onRowClick?.(pb.id)}
            style={{
              borderBottom: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          >
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{pb.name}</td>
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: pb.environmentName ? '#374151' : '#9ca3af' }}>{pb.environmentName ?? '—'}</td>
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{pb.specCount}</td>
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{formatDate(pb.createdAt)}</td>
            <td style={{ padding: '0.75rem 1rem' }}>
              <ActionMenu
                playbookId={pb.id}
                playbookName={pb.name}
                role={role}
                isArchivedTab={isArchivedTab ?? false}
                onRowClick={onRowClick}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
