'use client';

import { ScrollReveal } from './ScrollReveal';

/*
 * Platform thread — a single low-weight line that signals NoHotfix is more than
 * one gate, without competing with the enforcement story. Slate/muted styling,
 * NOT orange: roadmap is future, and orange marks shipped/actionable things.
 */
export function PlatformThread(): React.ReactElement {
  return (
    <section className="relative py-16 px-6 bg-[var(--bg-page)]">
      <ScrollReveal className="max-w-[760px] mx-auto text-center">
        <p className="text-[15px] sm:text-base leading-7 text-[var(--text-muted)]">
          Anchored by the gate. Built to grow around it — UAT sign-off, Jira, and release-level
          gating are next.{' '}
          <a
            href="/platform"
            className="arrow-link inline-flex items-center gap-1 font-medium text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] hover:underline transition-colors duration-150"
          >
            See where we&apos;re going <span className="arrow">&rarr;</span>
          </a>
        </p>
      </ScrollReveal>
    </section>
  );
}
