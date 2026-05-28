'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const DarkVeil = dynamic(() => import('./DarkVeil'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

export function Hero(): React.ReactElement {
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
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
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 bg-[var(--bg-page)] transition-colors duration-300">
        {/*
         * Background effects.
         * DarkVeil is a WebGL canvas — rendered ONLY in dark mode.
         * Light mode: clean warm-white surface with no background effects (per brand spec).
         */}
        {isDark && (
          <div className="absolute top-0 left-0 w-full h-screen z-0" aria-hidden="true">
            <DarkVeil
              beamWidth={3}
              beamHeight={80}
              beamNumber={20}
              lightColor="#ea6b04"
              speed={2}
              noiseIntensity={1.75}
              scale={0.2}
              rotation={30}
            />
            {/* Fade overlay to blend into the page background below */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-page)]" />
          </div>
        )}

        {/* Light mode: subtle warm radial gradient accent, no WebGL */}
        {!isDark && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 900px 600px at 50% 0%, rgba(234,106,4,0.06) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Hero content — z-10 to sit above the canvas */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Pre-headline badge */}
          <div
            className={`mb-6 inline-flex items-center px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-600
              border-[var(--border-default)] bg-[var(--bg-section-alt)] text-[var(--text-secondary)]
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            Release readiness — built for engineering teams
          </div>

          {/* Main headline */}
          <h1
            className={`font-display font-bold text-[46px] sm:text-[74px] leading-[52px] sm:leading-[84px]
              tracking-[-0.04em] text-center max-w-3xl text-[var(--text-primary)]
              transition-all duration-700 delay-200
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Ship it once.
          </h1>

          {/* Sub-headline */}
          <p
            className={`mt-6 text-center text-lg leading-7 text-[var(--text-secondary)] max-w-[560px]
              transition-all duration-600 delay-500
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            Your team can&apos;t mark a spec as passed without the evidence. The go/no-go decision is
            permanent. The record writes itself.
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary-hover)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary)')
              }
            >
              Start free — no credit card <span className="arrow">&rarr;</span>
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
            Free tier available. No credit card required. Full enforcement on every plan.
          </p>

          {/* Product Preview */}
          <div
            className={`mt-16 w-full max-w-[960px] transition-all duration-700 delay-[1100ms]
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <ProductPreview />
          </div>
        </div>
      </section>
    </>
  );
}

function ProductPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Execute specs', 'Go/No-Go', 'Record'];

  const advanceTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % 3);
  }, []);

  useEffect(() => {
    const interval = setInterval(advanceTab, 600000);
    return () => clearInterval(interval);
  }, [advanceTab]);

  return (
    <div
      className="relative rounded-2xl sm:rounded-[28px] overflow-hidden"
      style={{
        boxShadow:
          '0 0 0 1px var(--border-default), 0 24px 80px rgba(0,0,0,0.12)',
      }}
    >
      {/* Browser chrome */}
      <div
        className="border-b border-[var(--border-default)] px-4 py-3 flex items-center gap-3 bg-[var(--bg-section-alt)]"
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-full bg-[var(--border-default)] text-[12px] font-mono text-[var(--text-muted)]">
            nohotfix.com/runs/release-v2.4.1
          </div>
        </div>
        <div className="w-[52px]" />
      </div>

      {/* Tab nav */}
      <div
        className="border-b border-[var(--border-default)] px-6 flex gap-6 bg-[var(--bg-card)]"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === i
                ? 'text-[var(--text-primary)] border-[var(--color-primary)]'
                : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[var(--bg-card)] p-4 sm:p-6 min-h-[320px] sm:min-h-[360px]">
        {activeTab === 0 && <TabExecuteSpecs />}
        {activeTab === 1 && <TabGoNoGo />}
        {activeTab === 2 && <TabRecord />}
      </div>
    </div>
  );
}

function SpecRow({
  name,
  status,
  statusColor,
  artifact,
  blocked,
}: {
  name: string;
  status: string;
  statusColor: string;
  artifact?: string;
  blocked?: boolean;
}) {
  // Light: --go-surface / --go-text / --go-border etc. resolve per theme from tokens.css
  const colorMap: Record<string, string> = {
    green: 'bg-[var(--go-surface)] text-[var(--go-text)] border-[var(--go-border)]',
    slate:
      'bg-[var(--bg-section-alt)] text-[var(--text-muted)] border-[var(--border-default)]',
    amber: 'bg-[var(--nogo-surface)] text-[var(--nogo-text)] border-[var(--nogo-border)]',
    // In-progress: slate neutral (blue is retired)
    inprogress:
      'bg-[var(--bg-section-alt)] text-[var(--text-secondary)] border-[var(--border-default)]',
  };

  const resolvedColor =
    statusColor === 'blue' || statusColor === 'inprogress' ? 'inprogress' : colorMap[statusColor] ? statusColor : 'slate';

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--bg-section-alt)] border border-[var(--border-default)]">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[resolvedColor]}`}
        >
          {status}
        </span>
        <span className="text-sm text-[var(--text-primary)] truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {artifact && (
          <span className="hidden sm:inline text-xs text-[var(--text-muted)] bg-[var(--bg-section-alt)] px-2 py-1 rounded border border-[var(--border-default)]">
            {artifact}
          </span>
        )}
        {blocked ? (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[var(--bg-section-alt)] text-[var(--text-muted)] text-xs font-medium cursor-not-allowed animate-lock-glow border border-[var(--border-default)]">
            <LockIcon /> Pass
          </span>
        ) : status === 'Passed' ? (
          <CheckCircleIcon />
        ) : null}
      </div>
    </div>
  );
}

function TabExecuteSpecs() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-primary)] text-sm font-semibold">
          Release v2.4.1 — Specs
        </h3>
        <span className="text-xs text-[var(--text-muted)]">2 of 3 complete</span>
      </div>
      <SpecRow name="API authentication flow" status="Passed" statusColor="green" artifact="auth-screenshot.png" />
      <SpecRow name="Payment gateway integration" status="In Progress" statusColor="inprogress" blocked />
      <SpecRow name="Error handling — 500 responses" status="Pending" statusColor="slate" />

      {/* Annotation */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--nogo-text)] bg-[var(--nogo-surface)] border border-[var(--nogo-border)] rounded-lg px-3 py-2">
        <LockIcon />
        <span>Blocked — artifact required before spec can pass</span>
      </div>
    </div>
  );
}

function TabGoNoGo() {
  return (
    <div className="space-y-4">
      <h3 className="text-[var(--text-primary)] text-sm font-semibold">
        Release v2.4.1 — Go / No-Go Review
      </h3>

      <div className="space-y-2">
        <SpecRow name="API authentication flow" status="Passed" statusColor="green" />
        <SpecRow name="Payment gateway integration" status="Passed" statusColor="green" />
        <SpecRow name="Error handling — 500 responses" status="Failed" statusColor="amber" />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          className="flex-1 py-2.5 rounded-md text-white text-sm font-medium shadow-[0_0_12px_rgba(0,204,128,0.30)]"
          style={{ background: 'var(--color-go-500)' }}
        >
          Ship it (Go)
        </button>
        <button className="flex-1 py-2.5 rounded-md text-sm font-medium bg-[var(--nogo-surface)] text-[var(--nogo-text)] border border-[var(--nogo-border)]">
          Hold (No-Go)
        </button>
      </div>

      <div className="mt-2">
        <label className="text-xs text-[var(--text-muted)] mb-1 block">
          Justification required for Go with failures
        </label>
        <div className="bg-[var(--bg-section-alt)] border border-[var(--border-default)] rounded-md p-3 text-sm font-mono text-[var(--text-secondary)]">
          Minor auth token edge case in low-traffic scenario. Mitigation: server-side session...
        </div>
      </div>
    </div>
  );
}

function TabRecord() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] text-sm font-semibold flex items-center gap-2">
          Release v2.4.1
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--go-surface)] text-[var(--go-text)] border border-[var(--go-border)] flex items-center gap-1">
            <LockIcon /> LOCKED
          </span>
        </h3>
      </div>

      <div className="bg-[var(--bg-section-alt)] border border-[var(--border-default)] rounded-xl p-4 space-y-2">
        <div className="text-xs text-[var(--text-muted)]">Go decision</div>
        <div className="text-sm text-[var(--text-primary)] font-medium">Alex Chen</div>
        <div className="text-xs font-mono text-[var(--text-secondary)]">March 8, 2026 at 14:32 UTC</div>
      </div>

      <div className="bg-[var(--bg-section-alt)] border border-[var(--border-default)] rounded-xl p-4">
        <div className="text-xs text-[var(--text-muted)] mb-2">Justification</div>
        <p className="text-[13px] font-mono text-[var(--text-secondary)] leading-5">
          Minor auth token edge case in low-traffic scenario. Mitigation: server-side session
          invalidation on next request. Accepted risk.
        </p>
      </div>

      <div className="space-y-2">
        <SpecRow name="API authentication flow" status="Passed" statusColor="green" />
        <SpecRow name="Payment gateway integration" status="Passed" statusColor="green" />
        <SpecRow name="Error handling — 500 responses" status="Failed" statusColor="amber" />
      </div>

      <div className="text-xs text-[var(--text-muted)] text-center italic">
        The record is sealed. Nothing in it can be changed.
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-go-500)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
