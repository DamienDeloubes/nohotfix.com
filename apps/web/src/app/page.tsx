import type { ReactElement } from 'react';

import { ComparisonTable } from '@/components/ComparisonTable';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Navigation } from '@/components/Navigation';
import { PainHook } from '@/components/PainHook';
import { PlatformThread } from '@/components/PlatformThread';
import { PricingSummary } from '@/components/PricingSummary';
import { ThreeGuarantees } from '@/components/ThreeGuarantees';
import { TrustStrip } from '@/components/TrustStrip';
import { WhoItsFor } from '@/components/WhoItsFor';

export default function HomePage(): ReactElement {
  return (
    <>
      <Navigation />

      <main>
        <Hero />
        <TrustStrip />
        <PainHook />
        <ThreeGuarantees />
        <HowItWorks />
        <ComparisonTable />
        <PlatformThread />
        <WhoItsFor />
        <PricingSummary />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
