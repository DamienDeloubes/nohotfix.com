'use client';

import type { ReactElement, ReactNode } from 'react';

import { HREF } from '../shared/constants';
import { ScrollReveal } from '../../ScrollReveal';
import { SectionLabel } from '../shared/SectionLabel';
import { ArtifactRequirementPanel } from '../shared/fragments/ArtifactRequirementPanel';
import { PassButton } from '../shared/fragments/PassButton';

/*
 * EnforcementSteps — Section 3. Three-step flow: author configures → tester
 * executes (pass BLOCKED) → all requirements met (pass ENABLED). The contrast
 * between step 2's blocked button and step 3's enabled button is the argument.
 * A thin connector runs between steps (hidden < md).
 */
interface Step {
  n: string;
  heading: string;
  body: string;
  fragment: ReactNode;
}

const STEPS: Step[] = [
  {
    n: '01',
    heading: 'The author declares what evidence the tester must provide.',
    body: 'Each artifact requirement is set on the spec — type, minimum count, threshold if applicable. The tester has no path around what is declared.',
    fragment: (
      <ArtifactRequirementPanel
        requirements={[
          { type: 'file', label: 'Required: Before / After screenshots (2 files)', status: 'incomplete' },
          { type: 'url', label: 'Link to CI test run', status: 'incomplete' },
        ]}
      />
    ),
  },
  {
    n: '02',
    heading: 'The pass button stays blocked until every requirement is satisfied.',
    body: 'The tester uploads the file, fills the table, enters the measurement, or provides the URL. Each requirement shows its completion state inline. Only when all are satisfied does the pass button become active.',
    fragment: (
      <div className="space-y-3">
        <ArtifactRequirementPanel
          requirements={[
            { type: 'file', label: 'Before / After screenshots', status: 'complete', value: 'before.png, after.png' },
            { type: 'url', label: 'Link to CI test run', status: 'incomplete' },
          ]}
        />
        <PassButton state="blocked" hint="Attach the required URL to enable" />
      </div>
    ),
  },
  {
    n: '03',
    heading: 'When the evidence is complete, the gate opens.',
    body: 'All requirements satisfied — the pass button activates. One click. The artifact, the result, and the tester’s identity are recorded in the run record, permanently.',
    fragment: (
      <div className="space-y-3">
        <ArtifactRequirementPanel
          requirements={[
            { type: 'file', label: 'Before / After screenshots', status: 'complete', value: 'before.png, after.png' },
            { type: 'url', label: 'Link to CI test run', status: 'complete', value: 'https://ci.example.com/runs/8421' },
          ]}
        />
        <PassButton state="enabled" />
      </div>
    ),
  },
];

export function EnforcementSteps({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[900px]">
        <ScrollReveal className="mx-auto max-w-[620px] text-center">
          <SectionLabel>How enforcement works</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            From declaration to a blocked — then unblocked — pass.
          </h2>
        </ScrollReveal>

        <ol className="relative mt-14 space-y-12">
          {/* Connector — structural hairline, hidden on mobile (stack communicates order). */}
          <div
            className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-[var(--border-default)] md:block"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.n} delay={i * 200}>
              <li className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
                <div className="flex gap-4">
                  <span className="z-10 font-display text-3xl font-bold text-[var(--color-orange-400)]">{step.n}</span>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-[var(--text-primary)]">{step.heading}</h3>
                    <p className="mt-2 text-[15px] leading-6 text-[var(--text-secondary)]">{step.body}</p>
                  </div>
                </div>
                <div className="brand-card p-4">{step.fragment}</div>
              </li>
            </ScrollReveal>
          ))}
        </ol>

        <ScrollReveal delay={200} className="mt-12 text-center">
          <a
            href={HREF.howItWorksStep4}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            See the full execution walkthrough <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
