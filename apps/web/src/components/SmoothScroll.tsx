'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/*
 * Lenis smooth scroll (the Scalora feel). Lenis smooths the native window scroll,
 * so sticky nav, anchor links, and IntersectionObserver reveals keep working.
 * Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll(): null {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
