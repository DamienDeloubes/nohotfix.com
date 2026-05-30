import type { Metadata, Viewport } from 'next';
import type { ReactElement } from 'react';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { AdoptionBand } from '@/components/features/artifact-enforcement/AdoptionBand';
import { ActiveVsSealed } from '@/components/features/artifact-enforcement/ActiveVsSealed';
import { EnforcementSteps } from '@/components/features/artifact-enforcement/EnforcementSteps';
import { SixTypesBento } from '@/components/features/artifact-enforcement/SixTypesBento';
import { FeatureFinalCTA } from '@/components/features/shared/FeatureFinalCTA';
import { FeatureHero } from '@/components/features/shared/FeatureHero';
import { HREF, SIGNUP_URL } from '@/components/features/shared/constants';
import { ArtifactRequirementPanel } from '@/components/features/shared/fragments/ArtifactRequirementPanel';
import { PassButton } from '@/components/features/shared/fragments/PassButton';
import { FeatureJsonLd } from '@/components/features/shared/structured-data';

export const metadata: Metadata = {
  title: 'Artifact Enforcement — No artifact, no pass | NoHotfix',
  description:
    'The pass action is blocked — not warned, not reminded, blocked — until every declared artifact is attached. Six evidence types, enforced per spec. Start free.',
  alternates: { canonical: 'https://nohotfix.com/features/artifact-enforcement' },
  openGraph: {
    title: 'No artifact, no pass. Full stop.',
    description:
      'Artifact-gated execution: the pass action stays blocked until the required evidence is attached. Six types. No workarounds.',
    type: 'website',
    url: 'https://nohotfix.com/features/artifact-enforcement',
  },
};

export const viewport: Viewport = { themeColor: '#fafafa' };

/* Hero fragment — the disabled Pass button beside the six-type config preview. */
function HeroFragment(): ReactElement {
  const types = [
    { name: 'File upload', inUse: true },
    { name: 'Text', inUse: false },
    { name: 'Checkbox', inUse: false },
    { name: 'URL', inUse: true },
    { name: 'Measured value', inUse: true },
    { name: 'Structured table', inUse: false },
  ];
  return (
    <div className="grid grid-cols-1 gap-px bg-gridline md:grid-cols-[2fr_3fr]">
      {/* Left: spec row + requirements + blocked Pass */}
      <div className="bg-[var(--bg-card)] p-5 text-left">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Payment gateway smoke test</span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: 'var(--error-surface)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
          >
            Critical
          </span>
        </div>
        <ArtifactRequirementPanel
          requirements={[
            { type: 'file', label: 'Required: Before / After screenshots (2 files)', status: 'incomplete' },
            { type: 'measured', label: 'Page load time (ms)', status: 'complete', value: '2340', threshold: '≤ 3000' },
            { type: 'url', label: 'Link to CI test run', status: 'incomplete' },
          ]}
        />
        <div className="mt-4">
          <PassButton state="blocked" hint="Attach required screenshot to enable" />
        </div>
      </div>

      {/* Right: six-type artifact requirement configuration preview */}
      <div className="bg-[var(--bg-card)] p-5 text-left">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Artifact requirement types
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {types.map((t) => (
            <div
              key={t.name}
              className="rounded-md border border-[var(--border-default)] p-2.5 text-[11px] text-[var(--text-secondary)]"
              style={t.inUse ? { background: 'rgba(234,107,4,0.06)' } : undefined}
            >
              <span className="block font-medium text-[var(--text-primary)]">{t.name}</span>
              {t.inUse ? <span className="text-[10px] text-[var(--color-orange-600)]">In use</span> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArtifactEnforcementPage(): ReactElement {
  return (
    <>
      <FeatureJsonLd
        meta={{
          slug: 'artifact-enforcement',
          pillarHeadline: 'No artifact, no pass. Full stop.',
          pageName: 'Artifact Enforcement',
          description:
            'Artifact-gated execution that blocks the pass action until every declared evidence artifact is attached. Six artifact types, configured per spec.',
        }}
      />
      <Navigation />
      <main className="overflow-x-clip">
        <FeatureHero
          headingId="ae-hero"
          label="Artifact enforcement"
          headline="No artifact, no pass. Full stop."
          sub="The pass action is blocked — not warned, not reminded, blocked — until every declared artifact is attached. Six types. No workarounds."
          primary={{ label: 'Start for free', href: SIGNUP_URL }}
          secondary={{ label: 'See how it works', href: HREF.howItWorks }}
          fragmentUrl="app.nohotfix.com/runs/8421"
        >
          <HeroFragment />
        </FeatureHero>

        <SixTypesBento headingId="ae-six-types" />
        <EnforcementSteps headingId="ae-enforcement" />
        <ActiveVsSealed headingId="ae-locked" />
        <AdoptionBand headingId="ae-adoption" />

        <FeatureFinalCTA
          headingId="ae-cta"
          eyebrow="Available on every plan, including Free."
          headline="Start for free."
          body="One seat, full enforcement, all six artifact types. No credit card. The gate is live in an afternoon."
          primary={{ label: 'Start for free', href: SIGNUP_URL }}
          secondary={{ label: 'See how it works', href: HREF.howItWorks }}
        />
      </main>
      <Footer />
    </>
  );
}
