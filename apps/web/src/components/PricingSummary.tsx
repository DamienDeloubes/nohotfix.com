'use client';

import { ScrollReveal } from './ScrollReveal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.io';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    priceNote: '',
    tagline: 'For solo evaluation',
    features: ['Full enforcement triad', '1 seat', 'Unlimited playbooks + runs'],
    ctaText: 'Start free',
    ctaStyle: 'secondary' as const,
    cardStyle: 'bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.08)]',
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
    cardStyle: 'bg-white/80 backdrop-blur-sm border border-blue-500/30 shadow-[0_0_40px_rgba(0,54,255,0.10)]',
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
    cardStyle: 'bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.08)]',
  },
];

export function PricingSummary() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="max-w-[960px] mx-auto">
        <ScrollReveal className="text-center mb-8">
          <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px] tracking-[-0.025em] text-slate-900">
            Start free. Pay when you invite your team.
          </h2>
          <p className="mt-4 text-lg leading-7 text-slate-500">Flat monthly fee per team. No per-seat pricing. The enforcement triad is on every tier — including Free.</p>
        </ScrollReveal>

        <ScrollReveal className="text-center mb-12" delay={100}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[rgba(0,153,98,0.08)] border border-[rgba(0,153,98,0.20)] text-go-600 text-[13px] font-medium">
            Early bird pricing — first 100 paying organisations. Locked for life.
          </span>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className={`rounded-xl p-6 sm:p-8 flex flex-col h-full relative shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${tier.cardStyle}`}>
                {tier.featured && <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500 rounded-t-xl" />}

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-400 uppercase">{tier.name}</span>
                  {tier.badge && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">{tier.badge}</span>}
                </div>

                <div className="mb-1">
                  <span className="font-display font-medium text-5xl text-slate-900">{tier.price}</span>
                  {tier.priceNote && <span className="ml-2 text-[13px] text-blue-500">{tier.priceNote}</span>}
                </div>

                <p className="text-sm text-slate-400 mb-6">{tier.tagline}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#009962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`${API_URL}/auth/login?screen_hint=sign-up`}
                  className={`block w-full text-center py-3 rounded-md text-sm font-medium no-underline transition-all duration-150 ${
                    tier.ctaStyle === 'primary'
                      ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]'
                      : tier.ctaStyle === 'secondary'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {tier.ctaText}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-10" delay={400}>
          <p className="text-[15px] text-slate-500">
            Need 40+ seats, SSO, or custom data residency?{' '}
            <a href="/contact" className="arrow-link text-blue-500 no-underline hover:underline">
              Talk to us <span className="arrow">&rarr;</span>
            </a>
          </p>
          <a href="/pricing" className="arrow-link inline-block mt-4 text-[15px] font-medium text-blue-500 no-underline hover:underline">
            See full pricing <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
