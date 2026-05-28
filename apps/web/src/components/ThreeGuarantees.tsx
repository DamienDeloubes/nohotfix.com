'use client';

import { ScrollReveal } from './ScrollReveal';

const guarantees = [
  {
    icon: 'lock',
    iconColor: '#0036FF',
    iconBg: 'rgba(0,54,255,0.08)',
    iconBorder: 'rgba(0,54,255,0.15)',
    heading: "Specs don't pass until the evidence does.",
    body: 'Every spec declares exactly what evidence is required — a file, a log, a measurement, a URL. The pass action is blocked until every requirement is satisfied. No exceptions, no workarounds.',
    link: { text: 'Artifact enforcement', href: '/features/artifact-enforcement', color: '#0036FF' },
    visual: 'enforcement',
  },
  {
    icon: 'flag',
    iconColor: '#009962',
    iconBg: 'rgba(0,204,128,0.08)',
    iconBorder: 'rgba(0,204,128,0.15)',
    heading: 'One screen. One decision. The record is sealed.',
    body: 'The release decision is formal: role-gated to Admins, only available after every spec reaches a terminal state. A Go with failures requires mandatory written justification — permanently recorded.',
    link: { text: 'Go/No-Go gate', href: '/features/go-no-go', color: '#009962' },
    visual: 'decision',
  },
  {
    icon: 'shield',
    iconColor: '#0036FF',
    iconBg: 'rgba(0,54,255,0.08)',
    iconBorder: 'rgba(0,54,255,0.15)',
    heading: 'After the decision, nothing changes.',
    body: 'Once the go/no-go decision is recorded, the run is locked — permanently. No edits, no overwrites. The record contains every artifact submitted, the decision with decider identity and timestamp, and any written justification. Send the URL to your auditor.',
    link: { text: 'Immutable audit trail', href: '/features/audit-trail', color: '#0036FF' },
    visual: 'immutable',
  },
];

export function ThreeGuarantees() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px] tracking-[-0.025em] text-slate-900 max-w-[600px] mx-auto">
            Three things we guarantee every time.
          </h2>
          <p className="mt-4 text-lg leading-7 text-slate-500 max-w-[520px] mx-auto">Not reminders. Not suggestions. Hard constraints built into the release workflow.</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((g, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="light-card light-card-hover p-6 sm:p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ background: g.iconBg, border: `1px solid ${g.iconBorder}` }}>
                  <GuaranteeIcon type={g.icon} color={g.iconColor} />
                </div>

                <h3 className="text-slate-900 text-xl sm:text-2xl font-semibold leading-8 tracking-[-0.01em] mb-4">{g.heading}</h3>

                <p className="text-[15px] leading-6 text-slate-500 mb-6 flex-1">{g.body}</p>

                {/* Dark mini-UI visual */}
                <div className="rounded-xl bg-base-900 p-4 mb-6">
                  <CardVisual type={g.visual} />
                </div>

                <a href={g.link.href} className="arrow-link text-sm font-medium no-underline hover:underline" style={{ color: g.link.color }}>
                  {g.link.text} <span className="arrow">&rarr;</span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardVisual({ type }: { type: string }) {
  if (type === 'enforcement') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[rgba(255,255,255,0.50)]">Payment gateway</span>
          <span className="flex items-center gap-1 text-[rgba(255,255,255,0.30)] cursor-not-allowed opacity-40">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pass
          </span>
        </div>
        <div className="text-[11px] text-nogo-500 bg-[rgba(245,158,11,0.08)] rounded px-2 py-1">2 of 3 artifacts required</div>
      </div>
    );
  }

  if (type === 'decision') {
    return (
      <div className="flex gap-2">
        <div className="flex-1 py-2 rounded text-center text-xs font-medium bg-go-500 text-white shadow-[0_0_12px_rgba(0,204,128,0.30)]">Ship it (Go)</div>
        <div className="flex-1 py-2 rounded text-center text-xs font-medium bg-[rgba(245,158,11,0.15)] text-nogo-500 border border-[rgba(245,158,11,0.25)]">Hold (No-Go)</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(0,204,128,0.15)] text-go-500 border border-[rgba(0,204,128,0.25)]">LOCKED</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00CC80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className="text-[11px] font-mono text-[rgba(255,255,255,0.45)]">Go &middot; Alex Chen &middot; Mar 8, 2026 14:32 UTC</div>
    </div>
  );
}

function GuaranteeIcon({ type, color }: { type: string; color: string }) {
  if (type === 'lock') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  if (type === 'flag') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
