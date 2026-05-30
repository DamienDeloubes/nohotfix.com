import type { Metadata, Viewport } from 'next';
import type { ReactElement } from 'react';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ComplianceContext } from '@/components/features/audit-trail/ComplianceContext';
import { ImmutabilityCards } from '@/components/features/audit-trail/ImmutabilityCards';
import { PrintPreviewFragment } from '@/components/features/audit-trail/PrintPreviewFragment';
import { RecordContents } from '@/components/features/audit-trail/RecordContents';
import { SealedRecordFragment } from '@/components/features/audit-trail/SealedRecordFragment';
import { FeatureFinalCTA } from '@/components/features/shared/FeatureFinalCTA';
import { FeatureHero } from '@/components/features/shared/FeatureHero';
import { HREF, SIGNUP_URL } from '@/components/features/shared/constants';
import { FeatureJsonLd } from '@/components/features/shared/structured-data';

export const metadata: Metadata = {
  title: 'Immutable Audit Trail — the record is sealed | NoHotfix',
  description:
    'When the go/no-go call is made, the run is sealed at three layers — API, service, and database. No edits, no overwrites. Tamper-evident release evidence for SOC2 and PCI-DSS audits.',
  alternates: { canonical: 'https://nohotfix.com/features/audit-trail' },
  openGraph: {
    title: 'The record is sealed when the call is made.',
    description:
      'Every artifact, every decision, every tester’s identity — sealed at three layers when the go/no-go call is recorded. Send the URL.',
    type: 'website',
    url: 'https://nohotfix.com/features/audit-trail',
  },
};

export const viewport: Viewport = { themeColor: '#fafafa' };

export default function AuditTrailPage(): ReactElement {
  return (
    <>
      <FeatureJsonLd
        meta={{
          slug: 'audit-trail',
          pillarHeadline: 'The record is sealed when the call is made.',
          pageName: 'Audit Trail',
          description:
            'An immutable, tamper-evident run record sealed at three layers (API, service, database) the moment the go/no-go decision is recorded. Browser print-to-PDF produces compliance-ready evidence.',
        }}
      />
      <Navigation />
      <main className="overflow-x-clip">
        <FeatureHero
          headingId="at-hero"
          label="Immutable record"
          labelTone="slate"
          headline="The record is sealed when the call is made."
          sub={
            <>
              No edits. No overwrites. Every artifact, every decision, every tester’s identity — sealed at three layers
              when the go/no-go call is recorded. Send the URL. It begins with{' '}
              <a href={HREF.artifactEnforcement} className="text-[var(--text-link)] underline-offset-2 hover:underline">
                artifact enforcement
              </a>
              .
            </>
          }
          primary={{ label: 'Talk to us', href: HREF.contact }}
          secondary={{ label: 'Start free', href: SIGNUP_URL }}
          fragmentUrl="app.nohotfix.com/runs/8421"
        >
          <SealedRecordFragment />
        </FeatureHero>

        <RecordContents headingId="at-contents" />
        <ImmutabilityCards headingId="at-immutability" />
        <PrintPreviewFragment headingId="at-print" />
        <ComplianceContext headingId="at-compliance" />

        <FeatureFinalCTA
          headingId="at-cta"
          eyebrow="The record exists from the moment the run started."
          headline="When the auditor asks, send them the URL."
          body="Nothing in the record can be altered. Every artifact is preserved. Every decision is documented."
          primary={{ label: 'Talk to us', href: HREF.contact }}
          secondary={{ label: 'Start free', href: SIGNUP_URL }}
        />
      </main>
      <Footer />
    </>
  );
}
