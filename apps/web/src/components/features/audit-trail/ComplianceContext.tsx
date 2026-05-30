'use client';

import type { ReactElement } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { ReservedTestimonial } from '../shared/ReservedTestimonial';
import { SectionLabel } from '../shared/SectionLabel';

/*
 * ComplianceContext — Section 5. Connects the capability to SOC2 / PCI-DSS
 * testing-evidence requirements, with a VISIBLE, non-buried disclaimer that
 * NoHotfix holds no certification (honesty is the brand value). Plus a reserved
 * (empty) compliance-buyer testimonial slot.
 */
export function ComplianceContext({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[960px]">
        <ScrollReveal className="text-center">
          <SectionLabel tone="slate">Compliance context</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            Evidence as a natural output of the release process.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <ScrollReveal>
              <p className="text-[15px] leading-7 text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">SOC2 Type II</span> requires evidence that
                software changes are tested before they go to production. NoHotfix records that evidence in real time —
                spec results, attached artifacts, and the final go/no-go decision — in a tamper-evident record you
                don’t have to reconstruct.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="text-[15px] leading-7 text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">PCI-DSS</span> requires that changes to
                in-scope systems are tested and that evidence of testing is available for audit. Every NoHotfix run
                produces that evidence as a natural output of the release process.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-[15px] leading-7 text-[var(--color-slate-500)] dark:text-[var(--text-muted)]">
                NoHotfix does not hold a SOC2 certification or PCI-DSS certification. These statements describe how the
                product’s tamper-evident records map to testing-evidence requirements — teams should confirm fitness for
                purpose with their own compliance counsel.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="flex flex-wrap gap-x-8 gap-y-2 pt-2">
                <a
                  href={HREF.useCasesCompliance}
                  className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
                >
                  For compliance teams <span className="arrow">&rarr;</span>
                </a>
                <a
                  href={HREF.howItWorks}
                  className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
                >
                  How it works <span className="arrow">&rarr;</span>
                </a>
                <a
                  href={HREF.pricing}
                  className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
                >
                  See pricing <span className="arrow">&rarr;</span>
                </a>
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <ReservedTestimonial
              accentTone="slate"
              placeholder="Reserved for a compliance-buyer quote or case study excerpt. To be added at our first paying compliance customer. No fabricated testimonials."
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
