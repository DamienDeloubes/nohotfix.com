import { useCallback, useEffect, useRef } from 'react';

import { usePlaybookArchiveInfo } from '../hooks/use-playbook-archive-info.js';

interface ArchivePlaybookDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  playbookName: string;
  orgSlug: string;
  playbookId: string;
  queryKey: readonly unknown[];
}

export function ArchivePlaybookDialog({ open, onConfirm, onCancel, playbookName, orgSlug, playbookId, queryKey }: ArchivePlaybookDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: archiveInfo, isLoading } = usePlaybookArchiveInfo({
    orgSlug,
    playbookId,
    queryKey,
    enabled: open,
  });

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onCancel();
      }
    },
    [onCancel],
  );

  if (!open) return null;

  const activeRunCount = archiveInfo?.activeRunCount ?? 0;
  const hasActiveRuns = activeRunCount > 0;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: 0,
        maxWidth: '480px',
        width: '90vw',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#111827' }}>Archive this playbook?</h2>

        {isLoading ? (
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>Loading...</p>
        ) : (
          <>
            <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: '1.5', color: '#6b7280' }}>
              Archiving &quot;{playbookName}&quot; will hide it from the active list and prevent modifications. You can unarchive it at any time.
            </p>

            {hasActiveRuns && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '6px',
                  border: '1px solid #fcd34d',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                  This playbook has {activeRunCount} active {activeRunCount === 1 ? 'run' : 'runs'}. Active runs will not be affected by archiving.
                </p>
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: '#fff',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '6px',
              background: isLoading ? '#9ca3af' : '#dc2626',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.background = '#dc2626';
            }}
          >
            Archive playbook
          </button>
        </div>
      </div>
    </dialog>
  );
}
