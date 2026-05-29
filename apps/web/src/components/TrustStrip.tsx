'use client';

import { useEffect, useRef, useState } from 'react';

import { GridFrame } from './GridFrame';
import { ScrollReveal } from './ScrollReveal';

const stats = [
  { value: 6, label: 'Artifact types', desc: 'Every kind of evidence a release needs.' },
  { value: 3, label: 'Layers of immutability', desc: 'Sealed at the API, service, and database.' },
  { value: 0, label: 'Ways to bypass the gate', desc: 'By design. No setting makes it advisory.', accent: true },
  { value: 1, label: 'Free seat, forever', desc: 'Full enforcement, no credit card.' },
];

/*
 * "By the numbers" — Scalora's framed stat-bento structure, with our own honest
 * facts (product mechanics, not growth metrics) and the technical grid framing.
 */
export function TrustStrip(): React.ReactElement {
  return (
    <section className="relative py-20 sm:py-24 px-6 bg-[var(--bg-section-alt)]">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <span className="block text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--color-primary)] mb-4">
            By the numbers
          </span>
          <h2 className="font-display font-semibold text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]">
            The math behind the gate.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            Product facts, not growth charts.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          {/* Framed stat bento — gap-px over bg-gridline draws the dividers; GridFrame
              adds the fading edge lines + corner markers. */}
          <GridFrame className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gridline">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col p-7 sm:p-8 bg-[var(--bg-card)]">
                <CountUp target={s.value} accent={s.accent ?? false} />
                <span className="mt-4 text-[15px] font-medium text-[var(--text-primary)]">{s.label}</span>
                <span className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{s.desc}</span>
              </div>
            ))}
          </GridFrame>
        </ScrollReveal>

        <p className="mt-10 text-center text-[15px] text-[var(--text-secondary)]">
          We run our own releases through NoHotfix before we ship them.
        </p>
        <p className="mt-2 text-center text-[13px] text-[var(--text-muted)]">
          Tamper-evident records built for SOC2 and PCI-DSS evidence.
        </p>
      </div>
    </section>
  );
}

function CountUp({ target, accent }: { target: number; accent?: boolean }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target === 0) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const duration = 600;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setValue(Math.round(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className={`font-display font-bold text-[56px] sm:text-[64px] leading-none tabular-nums ${
        accent ? 'text-[var(--color-primary)]' : 'text-[var(--text-primary)]'
      }`}
    >
      {value}
    </span>
  );
}
