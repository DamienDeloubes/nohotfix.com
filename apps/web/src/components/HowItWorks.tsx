'use client';

import { ScrollReveal } from './ScrollReveal';

const steps = [
  {
    number: '01',
    name: 'Build a playbook',
    description: 'Assemble reusable specs into a template your whole team runs.',
    icon: 'layers',
  },
  {
    number: '02',
    name: 'Declare the evidence',
    description: 'Each spec names the artifact it requires. The tester has no path around it.',
    icon: 'file',
  },
  {
    number: '03',
    name: 'Execute, and get blocked',
    description: 'Pass stays blocked until the evidence is attached. Each run is a frozen snapshot.',
    icon: 'lock',
  },
  {
    number: '04',
    name: 'Make the call, seal the run',
    description: 'An Admin reviews every outcome, decides go or no-go, and the record locks.',
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
  if (type === 'file') {
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    );
  }
  if (type === 'lock') {
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
