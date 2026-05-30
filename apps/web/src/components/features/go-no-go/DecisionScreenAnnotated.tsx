'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';

import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { SpecRow } from '../shared/fragments/SpecRow';

/*
 * DecisionScreenAnnotated — Section 2 "What the decision screen shows". A
 * four-item explainer paired with an annotated fragment. Hovering OR focusing a
 * left item highlights the corresponding numbered callout on the right
 * (keyboard-accessible via aria-controls + state). Orange is reserved for the
 * two most important callouts (severity sort, role gate); the rest are slate,
 * keeping ≤2 orange elements per viewport.
 */
interface Item {
  id: string;
  n: number;
  tone: 'orange' | 'slate';
  heading: string;
  body: string;
  /** position of the callout circle over the fragment */
  pos: string;
}

const ITEMS: Item[] = [
  {
    id: 'gng-callout-1',
    n: 1,
    tone: 'orange',
    heading: 'Full spec list, sorted by severity.',
    body: 'Critical and high-severity specs are reviewed first. Every failed spec is visible before the call is made.',
    pos: 'left-3 top-16',
  },
  {
    id: 'gng-callout-2',
    n: 2,
    tone: 'slate',
    heading: 'Outcome counts at a glance.',
    body: 'X passed, Y failed, Z skipped — the summary is the first thing the Admin sees.',
    pos: 'right-3 top-3',
  },
  {
    id: 'gng-callout-3',
    n: 3,
    tone: 'slate',
    heading: 'Out-of-tolerance measurements surface explicitly.',
    body: 'If a measured-value spec breached its threshold, that is flagged here — so the Admin knows before deciding.',
    pos: 'left-3 bottom-20',
  },
  {
    id: 'gng-callout-4',
    n: 4,
    tone: 'orange',
    heading: 'Role gate: Admins only, specs all terminal.',
    body: 'The screen is inaccessible until every spec has a result. Members cannot trigger a decision. The gate is structural, not trust-based.',
    pos: 'right-3 bottom-3',
  },
];

function Callout({ item, active }: { item: Item; active: boolean }): ReactElement {
  const bg = item.tone === 'orange' ? 'var(--color-primary)' : 'var(--color-slate-700)';
  return (
    <span
      id={item.id}
      aria-hidden="true"
      className={`absolute ${item.pos} z-10 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white transition-transform duration-150 ease-out`}
      style={{ background: bg, transform: active ? 'scale(1.25)' : 'scale(1)' }}
    >
      {item.n}
    </span>
  );
}

export function DecisionScreenAnnotated({ headingId }: { headingId: string }): ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px]">
        <ScrollReveal className="mx-auto max-w-[640px] text-center">
          <SectionLabel>What the screen shows</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            The decision is made with full visibility.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            No surprises, no guesses. Everything the Admin needs is on one screen.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[45fr_55fr] md:items-center">
          {/* Left: explainer items */}
          <ul className="space-y-3">
            {ITEMS.map((item) => (
              <ScrollReveal key={item.id} delay={item.n * 100}>
                <li
                  tabIndex={0}
                  aria-describedby={item.id}
                  onMouseEnter={() => setActive(item.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(item.id)}
                  onBlur={() => setActive(null)}
                  className={`brand-card brand-card-hover cursor-default rounded-lg p-4 outline-none transition-colors ${
                    active === item.id ? 'border-[var(--color-primary)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ background: item.tone === 'orange' ? 'var(--color-primary)' : 'var(--color-slate-700)' }}
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
                <Callout key={item.id} item={item} active={active === item.id} />
              ))}
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2 text-xs">
                <span className="font-mono text-[var(--text-primary)]">v4.2.1 — Staging</span>
                <span className="text-[var(--text-muted)]">11 · 2 · 1</span>
              </div>
              <div className="mt-3 divide-y divide-[var(--border-default)] overflow-hidden rounded-md border border-[var(--border-default)]">
                <SpecRow title="Checkout total recalculation" severity="critical" result="failed" tintFailed />
                <SpecRow title="API p95 latency" severity="high" result="passed" />
                <SpecRow title="SSO session refresh" severity="medium" result="passed" />
              </div>
              <div
                className="mt-3 rounded-md px-3 py-1.5 text-[11px]"
                style={{ background: 'var(--nogo-surface)', color: 'var(--nogo-text)' }}
              >
                Measured value out of tolerance: p95 2400 ms (≤ 2000 ms)
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <span className="rounded-full bg-[var(--color-slate-100)] px-2 py-0.5 text-[var(--color-slate-500)]">
                  Admin only
                </span>
                Decision available — all specs terminal
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
