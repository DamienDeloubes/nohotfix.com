'use client';

import { ScrollReveal } from './ScrollReveal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    priceNote: '',
    tagline: 'For solo evaluation',
    features: ['Full enforcement triad', '1 seat', 'Unlimited playbooks + runs'],
    ctaText: 'Start free',
    ctaStyle: 'secondary' as const,
  },
  {
    name: 'Growth',
    price: '$29/mo',
    priceNote: 'early bird',
    tagline: 'For QA teams',
    badge: 'Most popular',
    features: ['Everything in Free', 'Up to 10 seats', 'Audit-grade export (PDF/JSON)', 'Email notifications'],
    ctaText: 'Start free',
    ctaStyle: 'primary' as const,
    featured: true,
  },
  {
    name: 'Scale',
    price: '$99/mo',
    priceNote: 'early bird',
    tagline: 'For compliance-driven teams',
    features: ['Everything in Growth', 'Up to 40 seats', '1-day SLA', 'Priority support'],
    ctaText: 'Start free',
    ctaStyle: 'tertiary' as const,
  },
];

export function PricingSummary(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[960px] mx-auto">
        <ScrollReveal className="text-center mb-8">
          <h2
            className="font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Start free. Pay when you invite your team.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            Flat monthly fee per team. No per-seat pricing. The enforcement triad is on every
            tier — including Free.
          </p>
        </ScrollReveal>

        <ScrollReveal className="text-center mb-12" delay={100}>
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-medium"
            style={{
              background: 'var(--go-surface)',
              border: '1px solid var(--go-border)',
              color: 'var(--go-text)',
            }}
          >
            Early bird pricing — first 100 paying organisations. Locked for life.
          </span>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div
                className="rounded-xl p-6 sm:p-8 flex flex-col h-full relative"
                style={{
                  background: 'var(--bg-card)',
                  border: tier.featured
                    ? '1px solid var(--color-primary)'
                    : '1px solid var(--border-default)',
                  boxShadow: tier.featured
                    ? 'var(--shadow-card-hover)'
                    : 'var(--shadow-card)',
                }}
              >
                {/* Featured top accent stripe */}
                {tier.featured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-[var(--text-muted)] uppercase">
                    {tier.name}
                  </span>
                  {tier.badge && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(234,106,4,0.10)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(234,106,4,0.20)',
                      }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div className="mb-1">
                  <span className="font-display font-semibold text-5xl text-[var(--text-primary)]">
                    {tier.price}
                  </span>
                  {tier.priceNote && (
                    <span className="ml-2 text-[13px] text-[var(--color-primary)]">
                      {tier.priceNote}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-6">{tier.tagline}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-go-600)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`${API_URL}/auth/login?screen_hint=sign-up`}
                  className="block w-full text-center py-3 rounded-md text-sm font-medium no-underline transition-all duration-150"
                  style={
                    tier.ctaStyle === 'primary'
                      ? {
                          background: 'var(--color-primary)',
                          color: '#ffffff',
                          boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset',
                        }
                      : tier.ctaStyle === 'secondary'
                        ? {
                            background: 'var(--text-primary)',
                            color: 'var(--bg-page)',
                          }
                        : {
                            background: 'var(--bg-section-alt)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-default)',
                          }
                  }
                >
                  {tier.ctaText}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-10" delay={400}>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Need 40+ seats, SSO, or custom data residency?{' '}
            <a
              href="/contact"
              className="arrow-link text-[var(--text-link)] no-underline hover:underline hover:text-[var(--text-link-hover)] transition-colors duration-150"
            >
              Talk to us <span className="arrow">&rarr;</span>
            </a>
          </p>
          <a
            href="/pricing"
            className="arrow-link inline-block mt-4 text-[15px] font-medium text-[var(--text-link)] no-underline hover:underline hover:text-[var(--text-link-hover)] transition-colors duration-150"
          >
            See full pricing <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
