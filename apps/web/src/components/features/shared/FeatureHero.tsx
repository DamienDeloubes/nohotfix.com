'use client';

import type { ReactElement, ReactNode } from 'react';

import { BrowserFrame } from '../../BrowserFrame';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from './SectionLabel';

/*
 * FeatureHero — the shared hero archetype for all three /features/* pages:
 * section label → H1 declarative statement (DM Sans 700, the LCP element) →
 * sub-paragraph → CTA row → large faithful product-UI fragment in browser chrome.
 *
 * The screenshot is the argument; the copy annotates it. The fragment slides up
 * + fades once after the CTAs (motion suppressed under prefers-reduced-motion
 * via the global .reveal rule). The fragment itself has no idle animation.
 */
interface CTA {
  label: string;
  href: string;
}

interface FeatureHeroProps {
  /** Section eyebrow pill text. */
  label: string;
  labelTone?: 'orange' | 'slate';
  /** The single <h1> pillar headline. */
  headline: string;
  /** Sub-paragraph — ReactNode so it can carry inline cross-links. */
  sub: ReactNode;
  /** Filled orange primary CTA. */
  primary: CTA;
  /** Quiet secondary CTA. */
  secondary: CTA;
  /** URL shown in the browser chrome of the hero fragment. */
  fragmentUrl: string;
  /** The faithful product-UI fragment. */
  children: ReactNode;
  /** aria-labelledby target id wiring (the <h1> id). */
  headingId: string;
}

export function FeatureHero({
  label,
  labelTone = 'orange',
  headline,
  sub,
  primary,
  secondary,
  fragmentUrl,
  children,
  headingId,
}: FeatureHeroProps): ReactElement {
  return (
    <section
      aria-labelledby={headingId}
      className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 pb-20 pt-32 sm:pt-40"
    >
      <div className="mx-auto w-full max-w-[960px] text-center">
        <ScrollReveal>
          <SectionLabel tone={labelTone}>{label}</SectionLabel>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h1
            id={headingId}
            className="mx-auto mt-6 max-w-[18ch] font-display font-bold tracking-[-0.04em] text-[var(--text-primary)]
              text-[44px] leading-[48px] sm:text-[60px] sm:leading-[64px] lg:text-[74px] lg:leading-[78px]"
          >
            {headline}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mx-auto mt-6 max-w-[620px] text-lg leading-7 text-[var(--text-secondary)]">{sub}</p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={primary.href}
              className="inline-flex items-center rounded-xl px-7 py-3.5 text-base font-medium text-white no-underline
                shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_8px_40px_rgba(234,106,4,0.25)]
                transition-all duration-300 ease-premium hover:-translate-y-0.5
                hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_12px_48px_rgba(234,106,4,0.35)]"
              style={{ background: 'var(--color-primary)' }}
            >
              {primary.label}
            </a>
            <a
              href={secondary.href}
              className="arrow-link inline-flex items-center gap-1 rounded-xl border border-[var(--border-strong)] px-7 py-3.5
                text-base font-medium text-[var(--text-primary)] no-underline transition-colors duration-150
                hover:border-[var(--color-primary)]"
            >
              {secondary.label} <span className="arrow">&rarr;</span>
            </a>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={360} className="mt-16 w-full max-w-[960px]">
        <BrowserFrame url={fragmentUrl}>{children}</BrowserFrame>
      </ScrollReveal>
    </section>
  );
}
