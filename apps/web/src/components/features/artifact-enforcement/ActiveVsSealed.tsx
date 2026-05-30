'use client';

import type { ReactElement } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { SealedLockIcon } from '../shared/fragments/SealedLockIcon';
import { StatusBadge } from '../shared/fragments/StatusBadge';

/*
 * ActiveVsSealed — Section 4 "What gets locked". A two-panel contrast: an
 * editable active run beside the same run sealed (read-only, static lock). The
 * visual contrast IS the argument. Bridges to the Audit Trail feature page.
 */
export function ActiveVsSealed({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[960px]">
        <ScrollReveal className="mx-auto max-w-[640px] text-center">
          <SectionLabel>What gets locked</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            The moment the call is made, every artifact is sealed.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            During execution the run is an operational surface. After the decision it is a document — read-only,
            permanently.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            {/* Active (editable) */}
            <div>
              <p className="mb-3 text-center text-sm font-medium text-[var(--text-muted)] md:text-left">
                During execution — editable
              </p>
              <div className="brand-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <StatusBadge kind="in_progress" />
                  <span className="text-xs text-[var(--text-muted)]">8 passed · 2 in progress · 1 failed</span>
                </div>
                <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] p-3">
                  <p className="mb-2 text-xs font-semibold text-[var(--text-primary)]">Payment gateway smoke test</p>
                  <div className="flex h-12 items-center justify-center rounded-md border border-dashed border-[var(--border-strong)] text-[11px] text-[var(--text-muted)]">
                    Upload file
                  </div>
                </div>
              </div>
            </div>

            {/* Transition arrow — static */}
            <div className="flex justify-center md:px-2" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-slate-400)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-90 md:rotate-0"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* Sealed (read-only) */}
            <div>
              <p className="mb-3 text-center text-sm font-medium text-[var(--text-muted)] md:text-left">
                After the decision — read-only. Permanently.
              </p>
              <div className="brand-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <StatusBadge kind="go" />
                  <span className="flex items-center gap-1.5">
                    <SealedLockIcon size={14} tooltip="This record is permanently sealed." />
                    <StatusBadge kind="sealed" />
                  </span>
                </div>
                <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] p-3">
                  <p className="mb-2 text-xs font-semibold text-[var(--text-primary)]">Payment gateway smoke test</p>
                  <div className="relative flex h-12 items-center justify-center rounded-md bg-[var(--bg-card)] text-[11px] text-[var(--text-muted)]">
                    after.png
                    <span className="absolute bottom-1 right-1">
                      <SealedLockIcon size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          <a
            href={HREF.goNoGo}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            See the go/no-go gate <span className="arrow">&rarr;</span>
          </a>
          <a
            href={HREF.auditTrail}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            Explore the full audit trail <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
