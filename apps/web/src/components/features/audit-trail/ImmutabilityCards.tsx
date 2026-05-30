'use client';

import { useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { TextType } from '../../TextType';

/*
 * ImmutabilityCards — Section 3 "Three-layer immutability". Three equal-weight,
 * co-equal cards (API / service / database). Each carries a Geist Mono code-style
 * callout that types in once via TextType and stops — the one animated text
 * element in the set, literalizing "this is a real constraint, written into the
 * record in front of you".
 *
 * Reduced-motion: the TextType wrapper is `disabled`, so callouts render as
 * static Geist Mono immediately (the component does not self-read the media
 * query — the guard lives here).
 */
interface Card {
  layer: string;
  icon: ReactNode;
  heading: string;
  body: string;
  code: string;
}

const slate = {
  fill: 'none',
  stroke: 'var(--color-slate-700)',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Icon({ children }: { children: ReactNode }): ReactElement {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...slate} className="dark:[stroke:var(--color-slate-300)]" aria-hidden="true">
      {children}
    </svg>
  );
}

const CARDS: Card[] = [
  {
    layer: 'API',
    heading: 'No edit endpoints for completed runs.',
    body: 'The API exposes no mutation routes for runs in the Go, No-Go, or Abandoned state. There is no endpoint to call — not for admins, not for anyone. The immutability constraint is at the surface layer.',
    code: '404 Not Found — POST /runs/{id}/specs/{specId}',
    icon: (
      <Icon>
        <path d="M12 2 4 6v6c0 5 3.4 7.7 8 10 4.6-2.3 8-5 8-10V6z" />
        <path d="M9 12l-2 2 2 2" />
        <path d="M15 12l2 2-2 2" />
      </Icon>
    ),
  },
  {
    layer: 'Service',
    heading: 'The state machine rejects all mutations.',
    body: 'Even if a request bypasses the API routes, the service layer enforces the state machine — a completed run’s transitions are closed. Every mutation attempt returns a rejection.',
    code: 'RunCompletedError — mutations rejected on terminal runs',
    icon: (
      <Icon>
        <rect x="3" y="4" width="6" height="6" rx="1" />
        <rect x="15" y="14" width="6" height="6" rx="1" />
        <path d="M9 7h4a2 2 0 0 1 2 2v5" />
      </Icon>
    ),
  },
  {
    layer: 'Database',
    heading: 'DB constraints prevent writes.',
    body: 'At the data layer, completed runs are protected by database-level constraints. Even a direct database write cannot alter a sealed run’s records. The three layers are independent — each would hold if the other two failed.',
    code: "CHECK constraint — run_status IN ('go','no_go','abandoned') → immutable",
    icon: (
      <Icon>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </Icon>
    ),
  },
];

export function ImmutabilityCards({ headingId }: { headingId: string }): ReactElement {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px]">
        <ScrollReveal className="mx-auto max-w-[640px] text-center">
          <SectionLabel tone="slate">Three-layer immutability</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            A guarantee is only as good as its implementation.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            Three independent layers. Each one would hold on its own.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <ScrollReveal key={card.layer} delay={i * 100}>
              <article className="brand-card flex h-full flex-col p-6">
                <span aria-hidden="true">{card.icon}</span>
                <span className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-slate-500)]">
                  {card.layer} layer
                </span>
                <h3 className="mt-1 text-lg font-semibold leading-7 text-[var(--text-primary)]">{card.heading}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-6 text-[var(--text-secondary)]">{card.body}</p>
                <div className="mt-4 overflow-x-auto rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-3 py-2">
                  <code className="block whitespace-pre font-mono text-[11px] text-[var(--text-secondary)]">
                    <TextType
                      text={card.code}
                      disabled={reduced}
                      startOnVisible
                      initialDelay={i * 120}
                    />
                  </code>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="mt-10 text-center">
          <a
            href={`${HREF.goNoGo}#after-the-decision`}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            See how the run is sealed <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
