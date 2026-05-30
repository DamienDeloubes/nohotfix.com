'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

/*
 * FactCells — a quiet row of honest product facts (DM Sans lead + Inter
 * caption), matching the homepage trust-strip register. Orange is absent here
 * (it belongs to CTAs, not stats).
 *
 * If a cell provides `countTo`, its number counts up once on reveal; under
 * prefers-reduced-motion the final value is shown immediately.
 */
export interface Fact {
  /** Display lead — string (e.g. "An afternoon") or a number to count up to. */
  lead: string;
  /** Optional numeric target; when set, the lead animates 0→countTo on view. */
  countTo?: number;
  /** Suffix appended after a counted number (e.g. "%", "+"). */
  suffix?: string;
  caption: string;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }): ReactElement {
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 600;
        const tick = (now: number): void => {
          const t = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function FactCells({ facts, className = '' }: { facts: Fact[]; className?: string }): ReactElement {
  return (
    <div
      className={`grid grid-cols-1 divide-y divide-[var(--border-default)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${className}`}
    >
      {facts.map((f, i) => (
        <div key={i} className="px-6 py-6 text-center">
          <p className="font-display text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            {f.countTo !== undefined ? <CountUp to={f.countTo} suffix={f.suffix ?? ''} /> : f.lead}
          </p>
          <p className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">{f.caption}</p>
        </div>
      ))}
    </div>
  );
}
