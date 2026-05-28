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

  const confirmColor = variant === 'destructive' ? '#dc2626' : '#2563eb';
  const confirmHoverColor = variant === 'destructive' ? '#b91c1c' : '#1d4ed8';

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: 0,
        maxWidth: '440px',
        width: '90vw',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#111827' }}>{title}</h2>
        <p style={{ margin: '0 0 24px', fontSize: '14px', lineHeight: '1.5', color: '#6b7280' }}>{description}</p>
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
              borderRadius: '6px',
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
