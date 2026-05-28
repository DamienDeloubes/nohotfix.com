interface PlaybookListEmptyStateProps {
  role: string;
  onCreateClick: (() => void) | undefined;
  message: string | undefined;
}

export function PlaybookListEmptyState({ role, onCreateClick, message }: PlaybookListEmptyStateProps) {
  const canCreate = role === 'admin' || role === 'owner';

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--glass-border-strong)] py-16 px-4">
      <p className="text-sm text-muted mb-4">{message ?? 'No playbooks yet.'}</p>
      {canCreate && onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          + New playbook
        </button>
      )}
    </div>
  );
}
