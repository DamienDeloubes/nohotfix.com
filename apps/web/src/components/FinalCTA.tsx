'use client';

import { ScrollReveal } from './ScrollReveal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-[120px] px-6 overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-glow-pulse"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(0,54,255,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-xl mx-auto text-center">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[13px] font-medium text-slate-400">Available on every plan, including Free.</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-display font-medium text-[48px] sm:text-[64px] leading-[56px] sm:leading-[72px] tracking-[-0.025em] bg-gradient-to-br from-slate-900 to-blue-500 bg-clip-text text-transparent">
            Release with proof.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-6 text-lg leading-7 text-slate-500 max-w-[480px] mx-auto">
            Start building your first playbook today. No credit card required. No time limit on the Free plan.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10">
            <a
              href={`${API_URL}/auth/login?screen_hint=sign-up`}
              className="inline-flex items-center px-9 py-4 bg-blue-500 text-white text-base font-medium
                rounded-xl no-underline shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_8px_40px_rgba(0,54,255,0.25)]
                hover:bg-blue-400 hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_12px_48px_rgba(0,54,255,0.35)]
                hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 ease-premium"
            >
              Start free
            </a>
          </div>
          <a href="/how-it-works" className="inline-block mt-4 text-sm text-slate-400 no-underline hover:text-slate-600 transition-colors duration-150">
            See how it works &rarr;
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
