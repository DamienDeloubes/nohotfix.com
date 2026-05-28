import { useCallback, useEffect, useRef } from 'react';

import { useArchiveImpact } from '../hooks/use-archive-impact.js';

interface ArchiveConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  specTitle: string;
  orgSlug: string;
  specId: string;
  queryKey: readonly unknown[];
}

const MAX_VISIBLE = 3;

function PlaybookList({ label, playbooks }: { label: string; playbooks: { id: string; name: string }[] }) {
  if (playbooks.length === 0) return null;

  const visible = playbooks.slice(0, MAX_VISIBLE);
  const remaining = playbooks.length - MAX_VISIBLE;

  return (
    <div className="mb-3">
      <div className="text-[13px] font-semibold text-white mb-1">{label}</div>
      <ul className="m-0 pl-5 text-[13px] text-white/60 leading-relaxed">
        {visible.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
        {remaining > 0 && (
          <li className="text-white/30 italic">
            and {remaining} {remaining === 1 ? 'other' : 'others'}.
          </li>
        )}
      </ul>
    </div>
  );
}

export function ArchiveConfirmDialog({ open, onConfirm, onCancel, specTitle, orgSlug, specId, queryKey }: ArchiveConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: impact, isLoading } = useArchiveImpact({
    orgSlug,
    specId,
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

  const hasActivePlaybooks = (impact?.activePlaybooks.length ?? 0) > 0;
  const hasArchivedPlaybooks = (impact?.archivedPlaybooks.length ?? 0) > 0;
  const hasAnyPlaybooks = hasActivePlaybooks || hasArchivedPlaybooks;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="border-none rounded-[var(--radius-md)] p-0 max-w-[480px] w-[90vw] [box-shadow:var(--shadow-4)] bg-base-800 backdrop:bg-black/60"
    >
      <div className="p-6">
        <h2 className="m-0 mb-2 text-lg font-semibold text-white">Archive this spec?</h2>

        {isLoading ? (
          <p className="m-0 mb-6 text-sm text-white/40">Loading impact...</p>
        ) : (
          <>
            <p className="m-0 mb-4 text-sm leading-relaxed text-white/60">
              {hasAnyPlaybooks
                ? `Archiving "${specTitle}" will remove it from the following playbook templates:`
                : 'Archived specs are hidden from the Active library and can no longer be edited. You can unarchive at any time.'}
            </p>

            {hasAnyPlaybooks && (
              <div className="mb-4">
                <PlaybookList label="Active playbooks:" playbooks={impact?.activePlaybooks ?? []} />
                <PlaybookList label="Archived playbooks:" playbooks={impact?.archivedPlaybooks ?? []} />
                <p className="m-0 text-[13px] text-white/30 italic">Specs removed from playbooks will not be restored on unarchive.</p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white/60 cursor-pointer hover:bg-[var(--glass-12)] hover:text-white transition-colors [transition-duration:var(--duration-fast)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium border-none rounded-[var(--radius-sm)] cursor-pointer transition-colors [transition-duration:var(--duration-fast)] ${
              isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-error-500 text-white hover:bg-error-500/80'
            }`}
          >
            Archive spec
          </button>
        </div>
      </div>
    </dialog>
  );
}
