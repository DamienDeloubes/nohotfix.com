'use client';

import type { ReactElement } from 'react';

import { BrowserFrame } from '../../BrowserFrame';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { SealedLockIcon } from '../shared/fragments/SealedLockIcon';
import { StatusBadge } from '../shared/fragments/StatusBadge';

/*
 * RoleGateFragment — Section 3 "Role gating". Shows what a non-Admin Member
 * sees when they reach the go/no-go screen: an inert informational state with a
 * static lock and no ability to act. The supporting paragraph makes the
 * governance argument: the gate is structural, not a toggle.
 *
 * The lock is static (Phase 6 — locked states don't move).
 */
export function RoleGateFragment({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[760px]">
        <ScrollReveal className="text-center">
          <SectionLabel>Role gating</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            Only Admins make the call.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-12">
          <BrowserFrame url="app.nohotfix.com/runs/8421/decision">
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
                <span className="font-mono text-sm text-[var(--text-primary)]">v4.2.1 — Staging</span>
                <StatusBadge kind="awaiting" />
              </div>
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <SealedLockIcon size={28} />
                <p className="max-w-[420px] text-sm text-[var(--text-secondary)]">
                  Only Admins can make the go/no-go decision. This run is awaiting a decision from an Admin.
                </p>
                <span className="text-xs font-medium text-[var(--text-link)] underline-offset-2 hover:underline">
                  Who are the Admins?
                </span>
              </div>
            </div>
          </BrowserFrame>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mx-auto mt-8 max-w-[620px] text-center text-[15px] leading-7 text-[var(--text-secondary)]">
            The Admin-only gate is not a permission setting — it cannot be toggled off. The go/no-go decision is a
            formal accountability act. It requires a named decision-maker and a permanent record. That requires a
            role boundary.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
