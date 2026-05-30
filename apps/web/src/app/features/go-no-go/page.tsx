import type { Metadata, Viewport } from 'next';
import type { ReactElement } from 'react';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollReveal } from '@/components/ScrollReveal';
import { DecisionScreenAnnotated } from '@/components/features/go-no-go/DecisionScreenAnnotated';
import { DecisionScreenFragment } from '@/components/features/go-no-go/DecisionScreenFragment';
import { JustificationOverlay } from '@/components/features/go-no-go/JustificationOverlay';
import { RoleGateFragment } from '@/components/features/go-no-go/RoleGateFragment';
import { FeatureFinalCTA } from '@/components/features/shared/FeatureFinalCTA';
import { FeatureHero } from '@/components/features/shared/FeatureHero';
import { SectionLabel } from '@/components/features/shared/SectionLabel';
import { HREF, SIGNUP_URL } from '@/components/features/shared/constants';
import { DecisionRecordBlock } from '@/components/features/shared/fragments/DecisionRecordBlock';
import { StatusBadge } from '@/components/features/shared/fragments/StatusBadge';
import { FeatureJsonLd } from '@/components/features/shared/structured-data';

export const metadata: Metadata = {
  title: 'Go/No-Go Decision Gate — made once and locked | NoHotfix',
  description:
    'A formal, Admin-only release decision: every spec outcome visible, sorted by severity. A Go with failures requires a written justification, recorded permanently. Start free.',
  alternates: { canonical: 'https://nohotfix.com/features/go-no-go' },
  openGraph: {
    title: 'The release decision, made once and locked.',
    description:
      'Only Admins decide, and only after every spec is terminal. A Go with failures requires a written, permanent justification.',
    type: 'website',
    url: 'https://nohotfix.com/features/go-no-go',
  },
};

export const viewport: Viewport = { themeColor: '#fafafa' };

/* Section 5 — "After the decision": the sealed compliance receipt. */
function AfterDecision({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-page)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[760px]">
        <ScrollReveal className="text-center">
          <SectionLabel>After the decision</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            The call is made. The record exists.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-12">
          <div className="brand-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <StatusBadge kind="go" size="lg" />
              <StatusBadge kind="sealed" />
            </div>
            <DecisionRecordBlock
              sealed
              decision="go"
              deciderName="Alex Chen (Admin)"
              timestamp="2026-03-08 14:32 UTC"
              justification="Checkout edge case is a known issue, fix scheduled for v4.2.2. Stakeholders accepted the risk."
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} className="mx-auto mt-8 max-w-[620px] space-y-3">
          <p className="flex gap-3 text-[15px] leading-7 text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">1.</span>
            The run is immediately read-only. No tester, no Admin, no one — can alter what happened.
          </p>
          <p className="flex gap-3 text-[15px] leading-7 text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">2.</span>
            The record includes the full spec list, every artifact, the decision, the decider, the timestamp, and the
            justification. Send the URL to anyone who needs to see it.
          </p>
          <p className="flex flex-wrap gap-x-8 gap-y-3 pt-3">
            <a
              href={HREF.auditTrail}
              className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
            >
              Explore the Audit Trail <span className="arrow">&rarr;</span>
            </a>
            <a
              href={HREF.useCasesEngineeringManagers}
              className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
            >
              For engineering managers <span className="arrow">&rarr;</span>
            </a>
            <a
              href={HREF.pricing}
              className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
            >
              See pricing <span className="arrow">&rarr;</span>
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function GoNoGoPage(): ReactElement {
  return (
    <>
      <FeatureJsonLd
        meta={{
          slug: 'go-no-go',
          pillarHeadline: 'The release decision, made once and locked.',
          pageName: 'Go/No-Go Gate',
          description:
            'An Admin-only go/no-go release decision gate. The screen is available only when every spec is terminal; a Go with failed specs requires a mandatory, permanently recorded written justification.',
        }}
      />
      <Navigation />
      <main className="overflow-x-clip">
        <FeatureHero
          headingId="gng-hero"
          label="Go/No-Go gate"
          headline="The release decision, made once and locked."
          sub={
            <>
              Only Admins can make the call. Only after every spec is terminal. A Go with failures requires a written
              justification, recorded permanently — the third guarantee alongside{' '}
              <a href={HREF.artifactEnforcement} className="text-[var(--text-link)] underline-offset-2 hover:underline">
                artifact enforcement
              </a>
              .
            </>
          }
          primary={{ label: 'Start for free', href: SIGNUP_URL }}
          secondary={{ label: 'Talk to us', href: HREF.contact }}
          fragmentUrl="app.nohotfix.com/runs/8421/decision"
        >
          <DecisionScreenFragment />
        </FeatureHero>

        <DecisionScreenAnnotated headingId="gng-screen" />
        <RoleGateFragment headingId="gng-role" />
        <JustificationOverlay headingId="gng-justification" />
        <AfterDecision headingId="gng-after" />

        <FeatureFinalCTA
          headingId="gng-cta"
          eyebrow="Available on every plan, including Free."
          headline="Start for free."
          body="One seat, full enforcement, the go/no-go gate, sealed records. No credit card."
          primary={{ label: 'Start for free', href: SIGNUP_URL }}
          secondary={{ label: 'Talk to us', href: HREF.contact }}
        />
      </main>
      <Footer />
    </>
  );
}
