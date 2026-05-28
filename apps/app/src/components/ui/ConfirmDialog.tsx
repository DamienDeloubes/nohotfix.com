import { useCallback, useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({ open, onConfirm, onCancel, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'default' }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const confirmColor = variant === 'destructive' ? 'var(--color-error-600)' : 'var(--color-primary)';
  const confirmHoverColor = variant === 'destructive' ? 'var(--color-error-700)' : 'var(--color-primary-hover)';

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: '10px',
        padding: 0,
        maxWidth: '440px',
        width: '90vw',
        background: 'var(--bg-card-elevated)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-modal)',
      }}
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ margin: '0 0 24px', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '10px',
              background: confirmColor,
              color: '#fff',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = confirmHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = confirmColor;
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
