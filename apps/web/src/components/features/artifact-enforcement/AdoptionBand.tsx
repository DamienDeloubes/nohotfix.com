'use client';

import type { ReactElement } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { FactCells } from '../shared/FactCells';
import { ReservedTestimonial } from '../shared/ReservedTestimonial';
import { SectionLabel } from '../shared/SectionLabel';

/*
 * AdoptionBand — Section 5 (added, not in sitemap). Handles the "this looks
 * like a heavy implementation project" objection before the final CTA. One
 * honest fact row + a reserved (empty) testimonial slot. No fabricated proof.
 */
export function AdoptionBand({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[760px]">
        <ScrollReveal className="text-center">
          <SectionLabel>Adoption</SectionLabel>
          <h2 id={headingId} className="sr-only">
            Adoption and credibility
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100} className="mt-8">
          <FactCells
            facts={[
              { lead: 'An afternoon', caption: 'A playbook is live in an afternoon. No implementation project, no onboarding call.' },
              { lead: 'Every type, free', caption: 'Full enforcement on the free tier — every artifact type, every gate, one seat.' },
              { lead: 'Tools stay', caption: 'NoHotfix gates the final release step. It doesn’t replace TestRail or Jira.' },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={200} className="mt-10">
          <ReservedTestimonial
            accentTone="orange"
            placeholder="Reserved for a QA lead quote. To be added at our first paying customer. No fabricated testimonials. No stock faces."
          />
        </ScrollReveal>

        <ScrollReveal delay={300} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          <a
            href={HREF.useCasesQa}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            Built for QA teams <span className="arrow">&rarr;</span>
          </a>
          <a
            href={HREF.pricing}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            See pricing <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
