'use client';

import { ScrollReveal } from './ScrollReveal';

const guarantees = [
  {
    icon: 'lock',
    iconColorVar: 'var(--color-primary)',
    iconBgVar: 'rgba(234,106,4,0.08)',
    iconBorderVar: 'rgba(234,106,4,0.18)',
    eyebrow: 'Artifact enforcement',
    heading: 'No artifact, no pass. Full stop.',
    body: 'The pass action is blocked until the required artifact is attached — screenshot, log, measurement, URL, or table. Six types. No workarounds.',
    link: { text: 'How enforcement works', href: '/features/artifact-enforcement' },
    visual: 'enforcement',
  },
  {
    icon: 'flag',
    iconColorVar: 'var(--color-go-700)',
    iconBgVar: 'rgba(0,204,128,0.08)',
    iconBorderVar: 'rgba(0,204,128,0.18)',
    eyebrow: 'Go/no-go gate',
    heading: 'The release decision, made once and locked.',
    body: 'Only an Admin can make the call, and only after every spec is terminal. A Go with failures requires a written justification, recorded permanently.',
    link: { text: 'Inside the decision', href: '/features/go-no-go' },
    visual: 'decision',
  },
  {
    icon: 'shield',
    iconColorVar: 'var(--color-slate-500)',
    iconBgVar: 'rgba(148,163,184,0.12)',
    iconBorderVar: 'rgba(148,163,184,0.24)',
    eyebrow: 'Immutable record',
    heading: 'The record is sealed when the call is made.',
    body: 'Sealed at three layers — API, service, and database. No edits. No overwrites. Send the URL.',
    link: { text: 'See the audit trail', href: '/features/audit-trail' },
    visual: 'immutable',
  },
];

export function ThreeGuarantees(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-[var(--bg-section-alt)]">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)] max-w-[600px] mx-auto"
          >
            Three guarantees, enforced every time.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)] max-w-[520px] mx-auto">
            Not reminders. Not suggestions. Constraints built into the release itself.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((g, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="brand-card brand-card-hover p-6 sm:p-8 h-full flex flex-col">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: g.iconBgVar,
                    border: `1px solid ${g.iconBorderVar}`,
                  }}
                >
                  <GuaranteeIcon type={g.icon} colorVar={g.iconColorVar} />
                </div>

                <span
                  className="text-[12px] font-medium uppercase tracking-[0.08em] mb-2"
                  style={{ color: g.iconColorVar }}
                >
                  {g.eyebrow}
                </span>

                <h3
                  className="text-[var(--text-primary)] text-xl sm:text-2xl font-semibold leading-8
                    tracking-[-0.01em] mb-4"
                >
                  {g.heading}
                </h3>

                <p className="text-[15px] leading-6 text-[var(--text-secondary)] mb-6 flex-1">
                  {g.body}
                </p>

                {/* Mini-UI visual — uses card-elevated surface to contrast with card */}
                <div
                  className="rounded-xl p-4 mb-6"
                  style={{
                    background: 'var(--bg-card-elevated)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <CardVisual type={g.visual} />
                </div>

                <a
                  href={g.link.href}
                  className="arrow-link text-sm font-medium no-underline hover:underline text-[var(--text-link)] hover:text-[var(--text-link-hover)]"
                >
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
          <span className="text-[var(--text-muted)]">Payment gateway</span>
          <span className="flex items-center gap-1 text-[var(--text-muted)] cursor-not-allowed opacity-40">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pass
          </span>
        </div>
        <div className="text-[11px] text-[var(--nogo-text)] bg-[var(--nogo-surface)] rounded px-2 py-1">
          2 of 3 artifacts required
        </div>
      </div>
    );
  }

  if (type === 'decision') {
    return (
      <div className="flex gap-2">
        <div
          className="flex-1 py-2 rounded text-center text-xs font-medium text-white shadow-[0_0_12px_rgba(0,204,128,0.30)]"
          style={{ background: 'var(--color-go-500)' }}
        >
          Ship it (Go)
        </div>
        <div className="flex-1 py-2 rounded text-center text-xs font-medium bg-[var(--nogo-surface)] text-[var(--nogo-text)] border border-[var(--nogo-border)]">
          Hold (No-Go)
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--go-surface)] text-[var(--go-text)] border border-[var(--go-border)]">
          LOCKED
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-go-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className="text-[11px] font-mono text-[var(--text-muted)]">
        Go &middot; Alex Chen &middot; Mar 8, 2026 14:32 UTC
      </div>
    </div>
  );
}

function GuaranteeIcon({ type, colorVar }: { type: string; colorVar: string }) {
  if (type === 'lock') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colorVar}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  if (type === 'flag') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colorVar}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorVar}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
