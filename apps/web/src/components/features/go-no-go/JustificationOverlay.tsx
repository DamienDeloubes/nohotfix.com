'use client';

import type { ReactElement } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { PassButton } from '../shared/fragments/PassButton';

/*
 * JustificationOverlay — Section 4 "The justification requirement". The decision
 * confirmation overlay as it appears when an Admin clicks "Go" with failed
 * specs: failed-spec list, a required justification field, and a Confirm button
 * disabled until justification is written. A Go with failures is not a bypass —
 * it is a documented, permanent decision with a named author.
 */
function FailedSpec({ title, severity }: { title: string; severity: 'critical' | 'high' }): ReactElement {
  const recipe =
    severity === 'critical'
      ? { label: 'Critical', bg: 'var(--error-surface)', text: 'var(--error-text)', border: 'var(--error-border)' }
      : { label: 'High', bg: 'var(--nogo-surface)', text: 'var(--nogo-text)', border: 'var(--nogo-border)' };
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'var(--error-surface)' }}>
      <span className="text-xs font-medium text-[var(--text-primary)]">{title}</span>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
        style={{ background: recipe.bg, color: recipe.text, border: `1px solid ${recipe.border}` }}
      >
        {recipe.label}
      </span>
    </div>
  );
}

export function JustificationOverlay({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[800px]">
        <ScrollReveal className="text-center">
          <SectionLabel>The justification requirement</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            A Go with failures is documented, not bypassed.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-12">
          {/* Elevated overlay card */}
          <div className="brand-card-elevated mx-auto max-w-[520px] p-6 text-left">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Go decision — 2 specs failed</h3>
            <div
              className="mt-3 flex items-start gap-2 rounded-md px-3 py-2 text-xs"
              style={{ background: 'var(--error-surface)', color: 'var(--error-text)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="mt-0.5 shrink-0">
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              </svg>
              The following specs were failed at time of this decision. You must justify proceeding:
            </div>
            <div className="mt-3 space-y-2">
              <FailedSpec title="Checkout total recalculation" severity="critical" />
              <FailedSpec title="API p95 latency" severity="high" />
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-medium text-[var(--text-primary)]">Written justification (required)</span>
              <div className="mt-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-input)] px-3 py-2 font-mono text-[11px] text-[var(--text-muted)]">
                e.g., Known issue — will be resolved in the next release. Stakeholder accepted risk.
              </div>
            </label>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[var(--text-link)]">Cancel</span>
              <PassButton state="blocked" label="Confirm" hint="Write justification to confirm" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} className="mx-auto mt-10 max-w-[620px] space-y-4">
          <p className="text-[15px] leading-7 text-[var(--text-secondary)]">
            The justification is not optional. It is not stored in a comment or a separate note — it is written into
            the go/no-go decision record and sealed when the run is sealed. The record will always include exactly
            what the Admin wrote and which specs were failed at the moment of the call.
          </p>
          <p className="text-[15px] leading-7 text-[var(--text-secondary)]">
            This is not a bureaucratic hurdle. It is the record of what was known, what was decided, and who made the
            call — before the release went out, not after something went wrong.
          </p>
          <p className="pt-2">
            <a
              href={HREF.auditTrail}
              className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
            >
              See the full audit trail <span className="arrow">&rarr;</span>
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
