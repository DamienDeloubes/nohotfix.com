import type { ReactElement } from 'react';

import { ComparisonTable } from '@/components/ComparisonTable';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Navigation } from '@/components/Navigation';
import { PainHook } from '@/components/PainHook';
import { PricingSummary } from '@/components/PricingSummary';
import { ThreeGuarantees } from '@/components/ThreeGuarantees';
import { WhoItsFor } from '@/components/WhoItsFor';

export default function HomePage(): ReactElement {
  return (
    <>
      {/* Page gradient background */}
      <div className="page-gradient" aria-hidden="true" />

      <Navigation />

      <main>
        <Hero />
        <PainHook />
        <ThreeGuarantees />
        <HowItWorks />
        <WhoItsFor />
        <ComparisonTable />
        <PricingSummary />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
