'use client';

import { ScrollReveal } from './ScrollReveal';

const personas = [
  {
    label: 'For QA Teams',
    labelColor: '#0036FF',
    accentColor: '#0036FF',
    heading: 'Stop chasing testers for screenshots.',
    body: "You own the release process but can't control whether testers actually do the work. NoHotfix makes it impossible to close a spec without the evidence. The process enforces itself.",
    painPoints: [
      'Testers marking specs as passed without running them',
      'Screenshots uploaded after the fact — or not at all',
      'Evidence reconstruction before every compliance audit',
    ],
    link: { text: 'For QA teams', href: '/use-cases/qa-teams', color: '#0036FF' },
  },
  {
    label: 'For Engineering Managers',
    labelColor: '#009962',
    accentColor: '#009962',
    heading: 'Know your release is ready before you ship.',
    body: "The go/no-go call happens in a Slack thread. You trust the QA spreadsheet is current. If something goes wrong, there's no record of what you knew. NoHotfix gives you a formal decision interface and an immutable record of every call you make.",
    painPoints: [
      'Go/no-go decisions with no documented basis',
      'No single view of what has been tested and what failed',
      'Post-incident with no record of what was known before shipping',
    ],
    link: { text: 'For engineering managers', href: '/use-cases/engineering-managers', color: '#009962' },
  },
];

export function WhoItsFor() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="max-w-[880px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px] tracking-[-0.025em] text-slate-900">
            Built for the people who own the release.
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {personas.map((p, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="light-card light-card-hover p-8 sm:p-10 h-full flex flex-col relative overflow-hidden">
                {/* Top accent stripe */}
                <div className="absolute top-0 left-8 w-[60px] h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${p.accentColor}, transparent)` }} />

                <span className="text-[13px] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: p.labelColor }}>
                  {p.label}
                </span>

                <h3 className="text-slate-900 text-2xl sm:text-[30px] font-semibold leading-[38px] tracking-[-0.015em] mb-4">{p.heading}</h3>

                <p className="text-base leading-[26px] text-slate-500 mb-6">{p.body}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {p.painPoints.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-amber-500 shrink-0 mt-0.5">&times;</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <a href={p.link.href} className="arrow-link text-[15px] font-semibold no-underline hover:underline" style={{ color: p.link.color }}>
                  {p.link.text} <span className="arrow">&rarr;</span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
