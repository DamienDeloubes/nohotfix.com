import type { ReactElement } from 'react';

/*
 * StatusBadge — run/decision status pill using the exact v5 semantic recipes
 * from @nohotfix/design-tokens (go / nogo / error / slate surfaces). Theme-aware.
 *
 * `sealed` is the quiet Geist-Mono record-state label (not a colored pill) —
 * the Go/No-Go badge carries the outcome; SEALED communicates the state.
 */
export type StatusKind = 'in_progress' | 'awaiting' | 'go' | 'no_go' | 'sealed';

const RECIPES: Record<
  Exclude<StatusKind, 'sealed'>,
  { label: string; bg: string; text: string; border: string }
> = {
  in_progress: {
    label: 'In Progress',
    bg: 'var(--color-slate-100)',
    text: 'var(--color-slate-500)',
    border: 'var(--border-default)',
  },
  awaiting: {
    label: 'Awaiting Go/No-Go',
    bg: 'var(--color-slate-100)',
    text: 'var(--color-slate-500)',
    border: 'var(--border-default)',
  },
  go: {
    label: 'Go',
    bg: 'var(--go-surface)',
    text: 'var(--go-text)',
    border: 'var(--go-border)',
  },
  no_go: {
    label: 'No-Go',
    bg: 'var(--nogo-surface)',
    text: 'var(--nogo-text)',
    border: 'var(--nogo-border)',
  },
};

interface StatusBadgeProps {
  kind: StatusKind;
  /** Override the default label (e.g. a custom "Awaiting decision" wording). */
  label?: string;
  /** Larger size for the hero/after-decision "Go" badge that must dominate. */
  size?: 'sm' | 'lg';
  className?: string;
}

export function StatusBadge({
  kind,
  label,
  size = 'sm',
  className = '',
}: StatusBadgeProps): ReactElement {
  if (kind === 'sealed') {
    return (
      <span
        className={`font-mono font-medium tracking-[0.08em] text-[var(--color-slate-400)] ${
          size === 'lg' ? 'text-xs' : 'text-[11px]'
        } ${className}`}
      >
        {label ?? 'SEALED'}
      </span>
    );
  }

  const r = RECIPES[kind];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      } ${className}`}
      style={{ background: r.bg, color: r.text, border: `1px solid ${r.border}` }}
    >
      {label ?? r.label}
    </span>
  );
}
