'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';

import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { DecisionRecordBlock } from '../shared/fragments/DecisionRecordBlock';

/*
 * RecordContents — Section 2 "What the record contains". Five-item content
 * inventory paired with an annotated fragment. Hovering/focusing a left item
 * highlights the matching callout. Per this page's compliance register, the
 * callout circles are SLATE (not orange) — the compliance persona reads slate
 * as neutral authority.
 */
interface Item {
  id: string;
  n: number;
  heading: string;
  body: string;
  pos: string;
}

const ITEMS: Item[] = [
  {
    id: 'at-callout-1',
    n: 1,
    heading: 'The go/no-go decision — who made it, when, and why.',
    body: 'Decision type, decision maker’s full name, exact timestamp, and — for a Go with failed specs — the mandatory written justification.',
    pos: 'left-3 top-3',
  },
  {
    id: 'at-callout-2',
    n: 2,
    heading: 'Every spec, with its final outcome.',
    body: 'Full spec list grouped by section, each row showing result, the tester who executed it, and timestamp.',
    pos: 'left-3 top-1/2',
  },
  {
    id: 'at-callout-3',
    n: 3,
    heading: 'Every artifact, inline.',
    body: 'Screenshots render as thumbnails. Log text renders as readable text. URLs are clickable. Measured values show the threshold alongside the observed value.',
    pos: 'right-3 bottom-16',
  },
  {
    id: 'at-callout-4',
    n: 4,
    heading: 'Section-level context.',
    body: 'If a section or spec was skipped, the skip reason is recorded. Nothing is omitted.',
    pos: 'right-3 bottom-3',
  },
  {
    id: 'at-callout-5',
    n: 5,
    heading: 'Abandonment, if applicable.',
    body: 'If the run was abandoned rather than decided, the reason, the acting Admin’s identity, the timestamp, and any partial results are recorded.',
    pos: 'left-3 bottom-3',
  },
];

export function RecordContents({ headingId }: { headingId: string }): ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px]">
        <ScrollReveal className="mx-auto max-w-[640px] text-center">
          <SectionLabel tone="slate">What the record contains</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            Complete enough to hand to an auditor.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            Everything the run produced, in one sealed record. Send the URL.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          {/* Left: inventory */}
          <ul className="space-y-3">
            {ITEMS.map((item) => (
              <ScrollReveal key={item.id} delay={item.n * 80}>
                <li
                  tabIndex={0}
                  aria-describedby={item.id}
                  onMouseEnter={() => setActive(item.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(item.id)}
                  onBlur={() => setActive(null)}
                  className={`brand-card brand-card-hover cursor-default rounded-lg p-4 outline-none ${
                    active === item.id ? 'border-[var(--color-slate-500)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ background: 'var(--color-slate-700)' }}
                    >
                      {item.n}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{item.heading}</h3>
                      <p className="mt-1 text-[15px] leading-6 text-[var(--text-secondary)]">{item.body}</p>
                    </div>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ul>

          {/* Right: annotated fragment */}
          <ScrollReveal delay={150}>
            <div className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
              {ITEMS.map((item) => (
                <span
                  key={item.id}
                  id={item.id}
                  aria-hidden="true"
                  className={`absolute ${item.pos} z-10 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white transition-transform duration-150 ease-out`}
                  style={{ background: 'var(--color-slate-700)', transform: active === item.id ? 'scale(1.25)' : 'scale(1)' }}
                >
                  {item.n}
                </span>
              ))}
              <DecisionRecordBlock
                sealed
                decision="go"
                deciderName="Alex Chen (Admin)"
                timestamp="2026-03-08 14:32 UTC"
                justification="Known issue, fix scheduled. Stakeholders accepted the risk."
              />
              <div className="mt-3 flex items-center gap-3 rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] p-2">
                <div className="flex h-10 w-14 items-center justify-center rounded bg-[var(--bg-card)] text-[10px] text-[var(--text-muted)]">
                  scan.png
                </div>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  p95 latency: 1840 ms (≤ 2000 ms)
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
