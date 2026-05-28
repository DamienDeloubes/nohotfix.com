'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 6, caption: 'Artifact types — every kind of evidence a release needs.' },
  { value: 3, caption: 'Layers of immutability: API, service, and database.' },
  { value: 0, caption: 'Ways to bypass the gate. By design.' },
  { value: 1, caption: 'Free seat, forever. Full enforcement included.' },
];

export function TrustStrip(): React.ReactElement {
  return (
    <section className="relative py-16 px-6 bg-[var(--bg-section-alt)] border-y border-[var(--border-default)]">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center px-4 ${
                i > 0 ? 'md:border-l md:border-[var(--border-default)]' : ''
              }`}
            >
              <CountUp target={s.value} />
              <p className="mt-3 text-[13px] leading-5 text-[var(--text-muted)] max-w-[200px]">
                {s.caption}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[15px] text-[var(--text-secondary)]">
          We run our own releases through NoHotfix before we ship them.
        </p>
        <p className="mt-2 text-center text-[13px] text-[var(--text-muted)]">
          Tamper-evident records built for SOC2 and PCI-DSS evidence.
        </p>
      </div>
    </section>
  );
}

function CountUp({ target }: { target: number }): React.ReactElement {
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
      className="font-display font-bold text-[52px] sm:text-[56px] leading-none text-[var(--text-primary)] tabular-nums"
    >
      {value}
    </span>
  );
}
