'use client';

import { ScrollReveal } from './ScrollReveal';

const steps = [
  {
    number: '01',
    name: 'Build a playbook',
    description:
      'Create reusable specs in the Spec Library. Assemble them into playbook sections. Define exactly what evidence each spec requires.',
    icon: 'layers',
  },
  {
    number: '02',
    name: 'Start a run',
    description:
      "The playbook is frozen at start time — a snapshot. Template changes don't affect the in-progress run.",
    icon: 'play',
  },
  {
    number: '03',
    name: 'Execute with evidence',
    description:
      'Testers work through specs. Each one requires the declared evidence before the pass action unlocks.',
    icon: 'upload',
  },
  {
    number: '04',
    name: 'Make the call',
    description:
      'The Admin reviews every outcome, makes the go/no-go decision, and the run locks permanently.',
    icon: 'check',
  },
];

export function HowItWorks(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[900px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2
            className="font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Build once. Enforce every time.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            The core loop, from playbook to permanent record.
          </p>
        </ScrollReveal>

        {/* Desktop: horizontal stepper */}
        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="relative flex flex-col items-center text-center group">
                {i < 3 && (
                  <div
                    className="absolute top-8 left-[calc(50%+24px)] w-[calc(100%-48px)] border-t border-dashed
                      border-[var(--border-strong)] group-hover:border-[var(--color-primary)] transition-colors duration-300"
                  />
                )}

                <div className="w-16 h-16 rounded-2xl brand-card flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-200">
                  <StepIcon type={step.icon} />
                </div>

                <span className="text-xs font-medium text-[var(--text-muted)] mb-1">{step.number}</span>

                <h3 className="text-[var(--text-primary)] text-base font-semibold mb-2">{step.name}</h3>

                <p className="text-sm leading-5 text-[var(--text-secondary)] max-w-[180px]">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="flex gap-4 pb-8 relative">
                {i < 3 && (
                  <div className="absolute left-8 top-16 bottom-0 w-px border-l border-dashed border-[var(--border-strong)]" />
                )}

                <div className="w-16 h-16 rounded-2xl brand-card flex items-center justify-center shrink-0">
                  <StepIcon type={step.icon} />
                </div>

                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">{step.number}</span>
                  <h3 className="text-[var(--text-primary)] text-base font-semibold mt-1 mb-2">
                    {step.name}
                  </h3>
                  <p className="text-sm leading-5 text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400} className="text-center mt-12">
          <a
            href="/how-it-works"
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline
              hover:text-[var(--text-link-hover)] transition-colors duration-150"
          >
            See the full walkthrough <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StepIcon({ type }: { type: string }) {
  // Last step (check) uses go-green; others use primary orange
  const color = type === 'check' ? 'var(--color-go-600)' : 'var(--color-primary)';

  if (type === 'layers') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (type === 'play') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }
  if (type === 'upload') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
