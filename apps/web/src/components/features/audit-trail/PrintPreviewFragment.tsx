'use client';

import type { ReactElement } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';

/*
 * PrintPreviewFragment — Section 4 "Print-to-PDF for auditors". A "certified
 * document" depiction: a plain white sheet (NO browser chrome) with a page-edge
 * shadow, Geist Mono-dense content, expanded specs, and a partial second page.
 * The "Print" button is decorative (teaches the interaction).
 *
 * Honesty note: launch export is BROWSER print-to-PDF; the dedicated one-click
 * PDF / structured JSON export is on the roadmap (links to /platform). This is
 * a marketing depiction, not a real print stylesheet for this page.
 */
const LIST = [
  'All spec rows are expanded automatically — nothing is hidden in the printed document.',
  'Artifact images print inline at reduced size. Files print as filename + type. URLs print as plain text.',
  'The go/no-go decision block is kept on a single page where possible — never split across pages.',
  'Page headers repeat: run name, playbook, completion date, status — on every page, for multi-page records.',
];

export function PrintPreviewFragment({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[800px]">
        <ScrollReveal className="text-center">
          <SectionLabel tone="slate">Print-to-PDF for auditors</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            What the auditor actually receives.
          </h2>
        </ScrollReveal>

        {/* Certified-document print preview — plain sheet, no browser chrome */}
        <ScrollReveal delay={120} className="mt-12">
          <div className="relative mx-auto max-w-[560px]">
            {/* Decorative Print button (teaches the interaction; non-functional) */}
            <div className="mb-3 flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print
              </span>
            </div>

            {/* The page sheet */}
            <div className="rounded-sm bg-white p-8 text-[#111110] shadow-[0_2px_8px_rgba(0,0,0,0.10),0_12px_32px_rgba(0,0,0,0.12)]">
              <div className="border-b border-black/15 pb-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-black/60">Release v4.2.1 — Staging · Playbook: Web Release · 2026-03-08 · GO</p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold">Go/No-Go Decision</p>
                <dl className="mt-1 space-y-0.5 font-mono text-[11px] text-black/70">
                  <div>Decision: Go</div>
                  <div>Decided by: Alex Chen (Admin)</div>
                  <div>Timestamp: 2026-03-08 14:32 UTC</div>
                  <div>Justification: Known issue, fix in v4.2.2. Risk accepted.</div>
                </dl>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold">Specs (expanded)</p>
                <div className="mt-1 space-y-1 font-mono text-[11px] text-black/70">
                  <div>✓ SSO session refresh — Passed — Priya N. — 13:58 UTC</div>
                  <div>✓ Payment gateway smoke test — Passed — Sam O. — 14:02 UTC</div>
                  <div className="pl-4 text-black/50">after.png · image · Uploaded by Sam O.</div>
                  <div>✓ Email receipt formatting — Passed — Sam O. — 13:40 UTC</div>
                </div>
              </div>
            </div>
            {/* Partial second page beneath, to imply a multi-page document */}
            <div className="mx-3 h-6 rounded-b-sm bg-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.08)]" aria-hidden="true" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <ul className="mx-auto mt-10 max-w-[620px] space-y-2">
            {LIST.map((line) => (
              <li key={line} className="flex gap-2 text-[15px] leading-6 text-[var(--text-secondary)]">
                <span className="text-[var(--color-slate-400)]">·</span>
                {line}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={260}>
          <p className="mx-auto mt-8 max-w-[620px] text-[13px] leading-6 text-[var(--text-muted)]">
            At launch, audit export is browser print-to-PDF — available on every plan, no special setup. A dedicated
            one-click PDF and structured JSON export is on the roadmap for a future release.{' '}
            <a href={HREF.platform} className="text-[var(--text-link)] underline-offset-2 hover:underline">
              See the platform roadmap
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
