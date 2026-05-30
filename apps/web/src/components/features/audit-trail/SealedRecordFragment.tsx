import type { ReactElement } from 'react';

import { DecisionRecordBlock } from '../shared/fragments/DecisionRecordBlock';
import { SealedLockIcon } from '../shared/fragments/SealedLockIcon';
import { SpecRow } from '../shared/fragments/SpecRow';
import { StatusBadge } from '../shared/fragments/StatusBadge';

/*
 * SealedRecordFragment — the Audit Trail hero. A sealed run record that reads
 * like a formal document, not an app screen: run header with Go badge + SEALED
 * label + a STATIC lock (with tooltip), the decision record block, and a
 * read-only spec list with one expanded row showing an inline artifact preview.
 *
 * Entirely static — nothing in this fragment animates (the silence is the
 * argument). Document-dense by intent.
 */
export function SealedRecordFragment(): ReactElement {
  return (
    <div className="bg-[var(--bg-card)] p-5 text-left">
      {/* Run header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Release v4.2.1 — Staging</span>
          <StatusBadge kind="go" />
          <span className="flex items-center gap-1">
            <SealedLockIcon size={14} tooltip="This record is permanently sealed. No edits are possible." />
            <StatusBadge kind="sealed" />
          </span>
        </div>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
        <div className="flex gap-2">
          <dt className="text-[var(--text-muted)]">Started</dt>
          <dd className="font-mono text-[var(--text-secondary)]">2026-03-08 13:10 UTC</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--text-muted)]">Completed</dt>
          <dd className="font-mono text-[var(--text-secondary)]">2026-03-08 14:32 UTC</dd>
        </div>
      </dl>

      {/* Decision record */}
      <div className="mt-4">
        <DecisionRecordBlock
          sealed
          decision="go"
          deciderName="Alex Chen (Admin)"
          timestamp="2026-03-08 14:32 UTC"
          justification="Checkout edge case is a known issue, fix scheduled for v4.2.2. Stakeholders accepted the risk."
        />
      </div>

      {/* Read-only spec list */}
      <div className="mt-4 divide-y divide-[var(--border-default)] overflow-hidden rounded-md border border-[var(--border-default)]">
        <SpecRow title="SSO session refresh" severity="high" result="passed" executedBy="Priya N." timestamp="13:58 UTC" />
        {/* Expanded spec row with inline artifact */}
        <div className="bg-[var(--bg-section-alt)] px-4 py-3">
          <SpecRow title="Payment gateway smoke test" severity="critical" result="passed" executedBy="Sam O." timestamp="14:02 UTC" />
          <div className="mt-2 flex items-center gap-3 rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] p-2">
            <div className="flex h-12 w-16 items-center justify-center rounded bg-[var(--bg-section-alt)] text-[10px] text-[var(--text-muted)]">
              after.png
            </div>
            <div className="font-mono text-[10px] text-[var(--text-muted)]">
              after.png · Uploaded by Sam O. · 2026-03-08 14:01 UTC
            </div>
          </div>
        </div>
        <SpecRow title="Email receipt formatting" severity="medium" result="passed" executedBy="Sam O." timestamp="13:40 UTC" />
      </div>
    </div>
  );
}
