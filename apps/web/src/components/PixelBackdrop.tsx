'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const PixelBlast = dynamic(() => import('./PixelBlast'), { ssr: false });

/*
 * Subtle PixelBlast backdrop — the same animation as the hero, tuned as a quiet
 * texture behind a content block (e.g. the footer brand cell). Theme-aware
 * orange, scrimmed for legibility, ripples off, disabled under reduced-motion.
 * Render inside a `relative overflow-hidden` parent; keep the content at z-10.
 */
export function PixelBackdrop(): React.ReactElement | null {
  const [isDark, setIsDark] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (reduced) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <PixelBlast
        variant="square"
        pixelSize={4}
        color={isDark ? '#F97316' : '#EA6B04'}
        patternScale={3}
        patternDensity={0.9}
        pixelSizeJitter={0.4}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.1}
        rippleIntensityScale={1.5}
        speed={0.4}
        edgeFade={0.55}
        transparent
      />
      {/* Legibility scrim — pointer-events-none so clicks fall through to the
          canvas (which owns the click-ripple). Kept moderate so ripples show. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'color-mix(in srgb, var(--bg-page) 55%, transparent)' }}
      />
    </div>
  );
}
