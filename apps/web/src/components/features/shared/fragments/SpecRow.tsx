import type { ReactElement } from 'react';

/*
 * SpecRow — one spec line as it appears in the run-execution / decision /
 * sealed-record views. Severity + result badges use exact v5 semantic recipes.
 * Geist Mono on the timestamp. Optional faint Error-50 tint on failed rows.
 *
 * Faithful product DOM (not a raster) so every label stays crawlable (FR-004).
 */
export type Severity = 'critical' | 'high' | 'medium';
export type SpecResult = 'passed' | 'failed' | 'skipped' | 'in_progress';

const SEVERITY: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
  critical: {
    label: 'Critical',
    bg: 'var(--error-surface)',
    text: 'var(--error-text)',
    border: 'var(--error-border)',
  },
  high: {
    label: 'High',
    bg: 'var(--nogo-surface)',
    text: 'var(--nogo-text)',
    border: 'var(--nogo-border)',
  },
  medium: {
    label: 'Medium',
    bg: 'var(--color-slate-100)',
    text: 'var(--color-slate-500)',
    border: 'var(--border-default)',
  },
};

const RESULT: Record<SpecResult, { label: string; bg: string; text: string; border: string }> = {
  passed: { label: 'Passed', bg: 'var(--go-surface)', text: 'var(--go-text)', border: 'var(--go-border)' },
  failed: { label: 'Failed', bg: 'var(--error-surface)', text: 'var(--error-text)', border: 'var(--error-border)' },
  skipped: {
    label: 'Skipped',
    bg: 'var(--color-slate-100)',
    text: 'var(--color-slate-500)',
    border: 'var(--border-default)',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'var(--color-slate-100)',
    text: 'var(--color-slate-500)',
    border: 'var(--border-default)',
  },
};

function Pill({
  recipe,
}: {
  recipe: { label: string; bg: string; text: string; border: string };
}): ReactElement {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: recipe.bg, color: recipe.text, border: `1px solid ${recipe.border}` }}
    >
      {recipe.label}
    </span>
  );
}

interface SpecRowProps {
  title: string;
  severity: Severity;
  result: SpecResult;
  executedBy?: string;
  timestamp?: string;
  /** Faint Error-50 row tint to surface a failed row visually. */
  tintFailed?: boolean;
  className?: string;
}

export function SpecRow({
  title,
  severity,
  result,
  executedBy,
  timestamp,
  tintFailed = false,
  className = '',
}: SpecRowProps): ReactElement {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${className}`}
      style={tintFailed ? { background: 'var(--error-surface)' } : undefined}
    >
      <Pill recipe={SEVERITY[severity]} />
      <span className="flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">{title}</span>
      <Pill recipe={RESULT[result]} />
      {executedBy ? (
        <span className="hidden sm:inline text-xs text-[var(--text-muted)]">{executedBy}</span>
      ) : null}
      {timestamp ? (
        <span className="hidden md:inline font-mono text-[11px] text-[var(--text-muted)]">{timestamp}</span>
      ) : null}
    </div>
  );
}
