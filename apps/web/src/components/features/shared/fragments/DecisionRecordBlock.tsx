import type { ReactElement } from 'react';

import { SealedLockIcon } from './SealedLockIcon';
import { StatusBadge } from './StatusBadge';

/*
 * DecisionRecordBlock — the go/no-go decision record, rendered as a
 * "compliance receipt": decision, decider identity, timestamp (Geist Mono),
 * and — for a Go with failures — the mandatory justification.
 *
 * When `sealed`, it renders a static SealedLockIcon + SEALED label and NO edit
 * affordances anywhere (terminal states are read-only — Constitution IV).
 */
interface DecisionRecordBlockProps {
  decision: 'go' | 'no_go';
  deciderName: string;
  timestamp: string;
  /** Shown for a Go-with-failures decision. */
  justification?: string;
  sealed?: boolean;
  className?: string;
}

export function DecisionRecordBlock({
  decision,
  deciderName,
  timestamp,
  justification,
  sealed = false,
  className = '',
}: DecisionRecordBlockProps): ReactElement {
  return (
    <div
      className={`rounded-lg border border-[var(--border-default)] bg-[var(--bg-card-elevated)] p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Decision
          </span>
          <StatusBadge kind={decision} />
        </div>
        {sealed ? (
          <span className="flex items-center gap-1.5">
            <SealedLockIcon size={14} tooltip="This record is permanently sealed. No edits are possible." />
            <StatusBadge kind="sealed" />
          </span>
        ) : null}
      </div>

      <dl className="mt-3 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[var(--text-muted)]">Decided by</dt>
          <dd className="text-[var(--text-primary)]">{deciderName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[var(--text-muted)]">Timestamp</dt>
          <dd className="font-mono text-[var(--text-primary)]">{timestamp}</dd>
        </div>
        {justification ? (
          <div className="flex gap-2 pt-1">
            <dt className="w-24 shrink-0 text-[var(--text-muted)]">Justification</dt>
            <dd className="italic text-[var(--text-secondary)]">{justification}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
