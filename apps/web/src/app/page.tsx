import type { ReactElement } from 'react';

import { ComparisonTable } from '@/components/ComparisonTable';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { LogoCloud } from '@/components/LogoCloud';
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

      {/* overflow-x-clip contains the decorative grid-line overshoot (GridFrame)
          without creating a scroll container — vertical overshoot stays visible. */}
      <main className="overflow-x-clip">
        <Hero />
        <LogoCloud />
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
