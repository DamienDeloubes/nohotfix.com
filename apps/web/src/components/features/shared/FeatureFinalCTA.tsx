'use client';

import type { ReactElement } from 'react';

import { ScrollReveal } from '../../ScrollReveal';

/*
 * FeatureFinalCTA — the shared "Ship it once." closing section, parameterized
 * per page's conversion goal. `primary` is always the filled (dominant) action
 * and `secondary` the bordered one. The CTA "swap" on the Audit Trail page is
 * expressed simply by passing primary="Talk to us" / secondary="Start free".
 *
 * The single sanctioned atmospheric warm radial — static, never animated.
 */
interface CTA {
  label: string;
  href: string;
}

interface FeatureFinalCTAProps {
  eyebrow?: string;
  headline: string;
  body: string;
  /** Filled, dominant action. */
  primary: CTA;
  /** Bordered, quiet action. */
  secondary: CTA;
  tagline?: string;
  headingId: string;
}

export function FeatureFinalCTA({
  eyebrow,
  headline,
  body,
  primary: filled,
  secondary: bordered,
  tagline = 'Ship it once.',
  headingId,
}: FeatureFinalCTAProps): ReactElement {
  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden bg-[var(--bg-section-alt)] px-6 py-24 sm:py-[120px]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(234,106,4,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-xl text-center">
        {eyebrow ? (
          <ScrollReveal>
            <p className="mb-6 text-[13px] font-medium text-[var(--text-muted)]">{eyebrow}</p>
          </ScrollReveal>
        ) : null}

        <ScrollReveal delay={100}>
          <h2
            id={headingId}
            className="font-display text-[40px] font-semibold leading-[48px] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[56px] sm:leading-[64px]"
          >
            {headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mx-auto mt-6 max-w-[480px] text-lg leading-7 text-[var(--text-secondary)]">{body}</p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={filled.href}
              className="inline-flex items-center rounded-xl px-9 py-4 text-base font-medium text-white no-underline
                shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_8px_40px_rgba(234,106,4,0.25)]
                transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:scale-[1.02]
                hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_12px_48px_rgba(234,106,4,0.35)]"
              style={{ background: 'var(--color-primary)' }}
            >
              {filled.label}
            </a>
            <a
              href={bordered.href}
              className="arrow-link inline-flex items-center gap-1 rounded-xl border px-9 py-4 text-base font-medium no-underline
                transition-colors duration-150"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--text-link)' }}
            >
              {bordered.label} <span className="arrow">&rarr;</span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="mt-12 font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[28px]">
            {tagline}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
