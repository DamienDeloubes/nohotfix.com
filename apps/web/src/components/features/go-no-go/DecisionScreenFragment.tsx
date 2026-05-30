import type { ReactElement } from 'react';

import { SpecRow } from '../shared/fragments/SpecRow';
import { StatusBadge } from '../shared/fragments/StatusBadge';

/*
 * DecisionScreenFragment — the go/no-go decision screen as it appears when all
 * specs are terminal and the Admin is reviewing. Severity-sorted spec list
 * (failed surfaced first + tinted), semantic-colored outcome counts, an
 * un-decided Go/No-Go action pair, and the mandatory-justification field that
 * communicates the mechanic before the copy explains it.
 *
 * Faithful static product DOM — the buttons are not interactive.
 */
export function DecisionScreenFragment(): ReactElement {
  return (
    <div className="bg-[var(--bg-card)] p-5 text-left">
      {/* Run header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[var(--text-primary)]">v4.2.1 — Staging</span>
          <StatusBadge kind="awaiting" />
        </div>
        <span className="text-xs">
          <span className="font-medium text-[var(--go-text)]">11 Passed</span>
          <span className="text-[var(--text-muted)]"> · </span>
          <span className="font-medium text-[var(--error-text)]">2 Failed</span>
          <span className="text-[var(--text-muted)]"> · </span>
          <span className="font-medium text-[var(--color-slate-500)]">1 Skipped</span>
        </span>
      </div>

      {/* Severity-sorted spec list — failed first */}
      <div className="mt-3 divide-y divide-[var(--border-default)] overflow-hidden rounded-md border border-[var(--border-default)]">
        <SpecRow
          title="Checkout total recalculation"
          severity="critical"
          result="failed"
          executedBy="Priya N."
          timestamp="14:22 UTC"
          tintFailed
        />
        <SpecRow title="SSO session refresh" severity="high" result="passed" executedBy="Alex C." timestamp="13:58 UTC" />
        <SpecRow title="Email receipt formatting" severity="medium" result="passed" executedBy="Sam O." timestamp="13:40 UTC" />
      </div>
      <p className="mt-2 text-center text-xs text-[var(--text-muted)]">…and 11 more specs</p>

      {/* Decision action panel */}
      <div className="mt-4 flex gap-2">
        <span
          className="flex-1 rounded-md py-2 text-center text-sm font-medium"
          style={{ background: 'var(--go-surface)', color: 'var(--go-text)', border: '1px solid var(--go-border)' }}
        >
          Go
        </span>
        <span
          className="flex-1 rounded-md py-2 text-center text-sm font-medium"
          style={{ background: 'var(--nogo-surface)', color: 'var(--nogo-text)', border: '1px solid var(--nogo-border)' }}
        >
          No-Go
        </span>
      </div>
      <div className="mt-2 rounded-md border border-[var(--border-strong)] bg-[var(--bg-input)] px-3 py-2 text-xs text-[var(--text-muted)]">
        Written justification is required if any specs are failed (2 are failed in this run)
      </div>
    </div>
  );
}
