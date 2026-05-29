'use client';

import { GridFrame } from './GridFrame';
import { ScrollReveal } from './ScrollReveal';

const personas = [
  {
    label: 'For QA Teams',
    heading: 'Stop chasing testers for screenshots.',
    body: 'The screenshot gets attached before the spec passes. The system enforces it — you don’t chase.',
    painPoints: [
      'Testers mark specs passed without running them',
      'Screenshots arrive after the fact — or never',
    ],
    link: { text: 'For QA teams', href: '/use-cases/qa-teams' },
    accentColor: 'var(--color-primary)',
  },
  {
    label: 'For Engineering Managers',
    heading: 'Make the call on the record.',
    body: 'One decision screen. Every outcome visible. The record is permanent.',
    painPoints: [
      'Go/no-go decided in a Slack thread',
      'No record of what the team knew before shipping',
    ],
    link: { text: 'For engineering managers', href: '/use-cases/engineering-managers' },
    accentColor: 'var(--color-go-600)',
  },
  {
    label: 'For Compliance Teams',
    heading: 'The audit package builds itself.',
    body: 'Every run is an auditable record, automatically. Send the auditor the URL.',
    painPoints: [
      'Evidence scattered across Slack, laptops, and tickets',
      'Reconstruction takes days every cycle',
    ],
    link: { text: 'For compliance teams', href: '/use-cases/compliance' },
    accentColor: 'var(--color-slate-500)',
  },
];

export function WhoItsFor(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Built for the people who own the release.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          {/* Framed bento: outer fading guide-lines + corner markers (GridFrame),
              inner hairline dividers between cells via gap-px over bg-gridline. */}
          <GridFrame>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gridline">
              {personas.map((p) => (
                <div
                  key={p.label}
                  className="relative flex flex-col overflow-hidden p-8 bg-[var(--bg-card)] transition-colors duration-200 hover:bg-[var(--bg-hover)]"
                >
                  {/* Top accent stripe — persona accent */}
                  <div
                    className="absolute top-0 left-8 w-[60px] h-[2px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${p.accentColor}, transparent)` }}
                  />

                  <span
                    className="text-[13px] font-medium uppercase tracking-[0.08em] mb-4"
                    style={{ color: p.accentColor }}
                  >
                    {p.label}
                  </span>

                  <h3
                    className="text-[var(--text-primary)] text-xl sm:text-2xl font-semibold leading-8
                      tracking-[-0.015em] mb-4"
                  >
                    {p.heading}
                  </h3>

                  <p className="text-[15px] leading-6 text-[var(--text-secondary)] mb-6">{p.body}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {p.painPoints.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--nogo-text)] shrink-0 mt-0.5">&times;</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={p.link.href}
                    className="arrow-link text-[15px] font-semibold no-underline hover:underline
                      text-[var(--text-link)] hover:text-[var(--text-link-hover)] transition-colors duration-150"
                  >
                    {p.link.text} <span className="arrow">&rarr;</span>
                  </a>
                </div>
              ))}
            </div>
          </GridFrame>
        </ScrollReveal>
      </div>
    </section>
  );
}
