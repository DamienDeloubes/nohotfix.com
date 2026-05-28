interface SpecDetailActionsProps {
  isArchived: boolean;
  userRole: 'owner' | 'admin' | 'member';
  onEditClick?: (() => void) | undefined;
  onArchiveClick?: (() => void) | undefined;
  onUnarchiveClick?: (() => void) | undefined;
}

const BTN_STYLE = {
  display: 'inline-block',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  textDecoration: 'none',
} as const;

export function SpecDetailActions({ isArchived, userRole, onEditClick, onArchiveClick, onUnarchiveClick }: SpecDetailActionsProps) {
  const isAdminOrOwner = userRole === 'admin' || userRole === 'owner';

  if (!isAdminOrOwner) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
      {!isArchived && onEditClick && (
        <button type="button" onClick={onEditClick} style={{ ...BTN_STYLE, color: '#fff', background: '#2563eb' }}>
          Edit spec
        </button>
      )}
      {!isArchived && onArchiveClick && (
        <button type="button" onClick={onArchiveClick} style={{ ...BTN_STYLE, color: '#dc2626', background: 'transparent', border: '1px solid #fca5a5' }}>
          Archive spec
        </button>
      )}
      {isArchived && onUnarchiveClick && (
        <button type="button" onClick={onUnarchiveClick} style={{ ...BTN_STYLE, color: '#fff', background: '#2563eb' }}>
          Unarchive
        </button>
      )}
    </div>
  );
}
