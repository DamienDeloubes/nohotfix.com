'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Magnet } from './Magnet';

const PixelBlast = dynamic(() => import('./PixelBlast'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

export function Hero(): React.ReactElement {
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Sync dark state with the <html> class set by the pre-paint script
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-[var(--bg-page)] p-3 sm:p-4 transition-colors duration-300">
      {/*
       * Inset rounded hero panel (Scalora pattern): a floating card with a ~16px
       * gutter so the page background frames it. overflow-hidden clips the bottom
       * glow (and the dark-mode WebGL veil) to the rounded corners.
       */}
      <div
        className="relative overflow-hidden rounded-[20px] sm:rounded-[28px]
          bg-[var(--bg-page)] border border-[var(--border-default)] shadow-[var(--shadow-card)]
          sm:min-h-[calc(100svh-2rem)]
          flex flex-col items-center justify-center pt-28 pb-20 sm:pt-32 sm:pb-24 px-6"
      >
        {/* Legibility scrim over the PixelBlast background. Uses color-mix instead
            of Tailwind's `/opacity` modifier: the `page` color is a bare var(--bg-page),
            and Tailwind can't inject alpha into a raw var(), so `from-page/75` renders
            transparent. color-mix applies the alpha and stays theme-aware. Sits above
            the canvas (z-0) and below the content (z-10). */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to bottom, color-mix(in srgb, var(--bg-page) 80%, transparent) 0%, color-mix(in srgb, var(--bg-page) 30%, transparent) 100%)',
          }}
        />
        {/* PixelBlast animated background — covers the entire panel, clipped to its
            rounded corners by the panel's overflow-hidden. Theme-aware orange.
            Disabled under prefers-reduced-motion (clean surface instead). */}
        {!reducedMotion && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <PixelBlast
              variant="square"
              pixelSize={4}
              color={isDark ? '#F97316' : '#EA6B04'}
              patternScale={3}
              patternDensity={1.1}
              pixelSizeJitter={0.4}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.1}
              rippleIntensityScale={1.4}
              speed={0.6}
              edgeFade={0.4}
              transparent
            />
          </div>
        )}

        {/* Hero content — z-10 to sit above the background */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Pre-headline badge */}
          <div
            className={`mb-6 inline-flex items-center px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-600
              border-[var(--border-default)] bg-[var(--bg-section-alt)] text-[var(--text-secondary)]
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            QA &amp; release readiness
          </div>

          {/* Main headline */}
          <h1
            className={`font-display font-bold text-[46px] sm:text-[74px] leading-[52px] sm:leading-[84px]
              tracking-[-0.04em] text-center max-w-3xl text-[var(--text-primary)]
              transition-all duration-700 delay-200
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            The release gate that holds.
          </h1>

          {/* Sub-headline */}
          <p
            className={`mt-6 text-center text-lg leading-7 text-[var(--text-secondary)] max-w-[560px]
              transition-all duration-600 delay-500
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            Your team can&apos;t mark a spec as passed without the evidence. The go/no-go decision is permanent. The record writes itself.
          </p>

          {/* CTA Row */}
          <div
            className={`mt-10 flex flex-col sm:flex-row items-center gap-3
              transition-all duration-600 delay-700
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            <a
              href={`${API_URL}/auth/login?screen_hint=sign-up`}
              className="arrow-link inline-flex items-center gap-2 px-7 py-3.5 text-white text-[15px] font-medium
                rounded-md no-underline shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_4px_16px_rgba(234,106,4,0.35)]
                hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_8px_24px_rgba(234,106,4,0.45)]
                hover:scale-[1.02] transition-all duration-300 ease-premium"
              style={{ background: 'var(--color-primary)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary)')}
            >
              Start for free <span className="arrow">&rarr;</span>
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center px-7 py-3.5 text-[var(--text-secondary)] text-[15px] font-medium
                rounded-md no-underline border border-[var(--border-strong)]
                bg-[var(--bg-card)] shadow-[var(--shadow-card)]
                hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)]
                transition-all duration-300"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <p
            className={`mt-6 text-[13px] text-[var(--text-muted)] text-center
              transition-all duration-600 delay-[900ms]
              ${loaded ? 'opacity-100' : 'opacity-0'}`}
          >
            Free tier, one seat, full enforcement. No credit card.
          </p>

          {/* Product Preview — platform demo video */}
          <div
            className={`mt-16 w-full max-w-[960px] transition-all duration-700 delay-[1100ms]
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <VideoPreview reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoPreview({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-[28px] bg-[var(--bg-card)]"
      style={{
        boxShadow: '0 0 0 1px var(--border-default), 0 24px 80px rgba(0,0,0,0.12)',
      }}
    >
      {/*
       * Platform demo video goes here. Drop in once available — e.g.:
       *
       *   <video
       *     className="absolute inset-0 h-full w-full object-cover"
       *     autoPlay muted loop playsInline
       *     poster="/platform-demo-poster.jpg"
       *   >
       *     <source src="/platform-demo.mp4" type="video/mp4" />
       *   </video>
       *
       * The aspect-video ratio fixes the height at every breakpoint, so the hero
       * no longer shifts (this replaced the auto-cycling tabbed product preview).
       */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[var(--bg-section-alt)]">
        {/* Magnet pulls the button toward the cursor when it's near; disabled
            under prefers-reduced-motion. The button itself grows on hover and
            dips on press. */}
        <Magnet padding={120} magnetStrength={3} disabled={reducedMotion}>
          <button
            type="button"
            aria-label="Play platform demo"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]
              shadow-[0_8px_24px_rgba(234,106,4,0.35)]
              transition-transform duration-200 ease-premium
              hover:scale-110 hover:bg-[var(--color-primary-hover)]
              active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-section-alt)]"
          >
            <PlayIcon />
          </button>
        </Magnet>
        <p className="text-sm font-medium text-[var(--text-muted)]">See NoHotfix in action</p>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
