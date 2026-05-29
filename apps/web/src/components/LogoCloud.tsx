'use client';

import { GridFrame } from './GridFrame';
import { ScrollReveal } from './ScrollReveal';

type Brand = { name: string; src?: string; width?: number; height?: number };

/*
 * Brands shown in the "working with" ticker.
 * To use a real logo: drop the file in apps/web/public/logos/ and add
 *   { name: 'Acme', src: '/logos/acme.svg', width: 120, height: 28 }
 * Without `src`, the brand name renders as a text wordmark placeholder.
 * Prefer monochrome SVGs — they're tinted grayscale and brighten on hover.
 */
const brands: Brand[] = [
  { name: 'Acme' },
  { name: 'Globex' },
  { name: 'Initech' },
  { name: 'Umbrella' },
  { name: 'Soylent' },
];

/*
 * Framed, two-column brands block (Scalora "Trusted Company" structure):
 * GridFrame border + corner markers · left = eyebrow + headline (no fabricated
 * stats) · right = a dual-row logo ticker scrolling in opposite directions.
 */
export function LogoCloud(): React.ReactElement {
  return (
    <section className="relative py-12 sm:py-16 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-semibold text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]">
            We&apos;re working with
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          {/* GridFrame's lines/corners are position:absolute, so they don't
              occupy grid tracks — only the two columns lay out as the grid. */}
          <GridFrame className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
            {/* Left: eyebrow + headline */}
            <div className="flex flex-col justify-center gap-3 p-8 border-b md:border-b-0 md:border-r border-[var(--grid-line)]">
              <p className="text-lg sm:text-xl font-medium leading-snug text-[var(--text-primary)]">
                Teams who ship it once.
              </p>
            </div>

            {/* Right: dual-row ticker, rows scroll in opposite directions */}
            <div className="flex flex-col overflow-hidden">
              <TickerRow />
              <TickerRow reverse />
            </div>
          </GridFrame>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TickerRow({ reverse = false }: { reverse?: boolean }) {
  // Two identical copies so the track loops seamlessly (translateX -50%).
  const track = [...brands, ...brands];
  return (
    <div
      className={`logo-marquee group relative overflow-hidden py-6 ${
        reverse ? '' : 'border-b border-[var(--grid-line)]'
      }`}
    >
      <div
        className={`logo-marquee__track flex w-max items-center group-hover:[animation-play-state:paused] ${
          reverse ? 'logo-marquee__track--reverse' : ''
        }`}
      >
        {track.map((brand, i) => (
          <BrandMark key={i} brand={brand} isDuplicate={i >= brands.length} />
        ))}
      </div>
    </div>
  );
}

function BrandMark({ brand, isDuplicate }: { brand: Brand; isDuplicate: boolean }) {
  const common =
    'mr-14 shrink-0 opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0';

  if (brand.src) {
    return (
      <img
        src={brand.src}
        alt={brand.name}
        width={brand.width ?? 120}
        height={brand.height ?? 32}
        loading="lazy"
        aria-hidden={isDuplicate || undefined}
        className={`${common} h-7 w-auto object-contain`}
      />
    );
  }

  return (
    <span
      aria-hidden={isDuplicate || undefined}
      className={`${common} whitespace-nowrap text-lg font-semibold tracking-tight text-[var(--text-primary)]`}
    >
      {brand.name}
    </span>
  );
}
