'use client';

import { useState } from 'react';

import { ScrollReveal } from './ScrollReveal';

const faqs = [
  {
    q: 'Is the free tier really free?',
    a: 'Yes. One seat, full enforcement, no credit card, no time limit. The moment you invite a teammate you move to Growth — that’s the only gate.',
  },
  {
    q: 'Can the gate be turned off or bypassed?',
    a: 'No. The pass action is blocked at the system level until the required artifact is attached. There is no setting that makes enforcement advisory.',
  },
  {
    q: 'Does this replace TestRail, Jira, or our CI?',
    a: 'No. Keep your test library and pipeline. NoHotfix gates the final release decision and seals the record.',
  },
  {
    q: 'Is the early-bird price locked forever?',
    a: 'Yes. The first 100 paying organisations keep their early-bird price for life.',
  },
  {
    q: 'How long does setup take?',
    a: 'A playbook is live in an afternoon. No implementation project, no dedicated admin, no onboarding call.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your sealed run records stay readable. Seat limits apply going forward; your history is never deleted on a downgrade.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function FAQ(): React.ReactElement {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32 px-6 bg-[var(--bg-page)]">
      {/* FAQPage structured data — emitted in the SSR HTML for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-[760px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2
            className="font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Questions, answered.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <ul className="border-y border-[var(--border-default)]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={i}
                  className={i > 0 ? 'border-t border-[var(--border-default)]' : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                      {f.q}
                    </span>
                    <svg
                      className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ease-page ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-[15px] leading-7 text-[var(--text-secondary)] max-w-[640px]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
