'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const DarkVeil = dynamic(() => import('./DarkVeil'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.io';

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <DarkVeil2 hueShift={0} noiseIntensity={0} scanlineIntensity={0} speed={0.5} scanlineFrequency={0} warpAmount={0} />
      </div> */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">
        {/* Dark Veil background effect */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" aria-hidden="true">
          {/* <DarkVeil speed={0.3} hueShift={220} noiseIntensity={0.02} scanlineIntensity={0} scanlineFrequency={0} warpAmount={0.4} resolutionScale={0.5} /> */}
          {/* <DarkVeil hueShift={0} noiseIntensity={0} scanlineIntensity={0} speed={0.5} scanlineFrequency={0} warpAmount={0} /> */}
          <DarkVeil beamWidth={3} beamHeight={80} beamNumber={20} lightColor="#424bcd" speed={2} noiseIntensity={1.75} scale={0.2} rotation={30} />
          {/* Fade overlay to blend into the page gradient below */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f071d]" />
        </div>

        {/* Hero content — z-10 to sit above the canvas */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Pre-headline badge */}
          <div
            className={`mb-6 inline-flex items-center px-4 py-1.5 rounded-full border border-[rgba(0,54,255,0.30)]
          bg-[rgba(0,54,255,0.15)] text-blue-300 text-[13px] font-medium transition-all duration-600
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            Release readiness — built for engineering teams
          </div>

          {/* Main headline */}
          <h1
            className={`font-display font-medium text-[46px] sm:text-[74px] leading-[52px] sm:leading-[84px]
          tracking-[-0.03em] text-center max-w-3xl
              bg-gradient-to-b from-white/90 to-white/75 bg-clip-text text-transparent

          transition-all duration-700 delay-200
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Release with proof.
          </h1>

          {/* Sub-headline */}
          <p
            className={`mt-6 text-center text-lg leading-7 text-slate-600 max-w-[560px]
          transition-all duration-600 delay-500
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ color: 'rgba(255,255,255,0.70)' }}
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
              className="arrow-link inline-flex items-center gap-2 px-7 py-3.5 bg-blue-500 text-white text-[15px] font-medium
            rounded-md no-underline shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_4px_16px_rgba(0,54,255,0.40)]
            hover:bg-blue-400 hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_8px_24px_rgba(0,54,255,0.50)]
            hover:scale-[1.02] transition-all duration-300 ease-premium"
            >
              Start free — no credit card <span className="arrow">&rarr;</span>
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center px-7 py-3.5 bg-[rgba(255,255,255,0.08)] text-white text-[15px] font-medium
            rounded-md no-underline border border-[rgba(255,255,255,0.15)]
            shadow-[0_1px_3px_rgba(0,0,0,0.30)]
            hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)]
            transition-all duration-300"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <p
            className={`mt-6 text-[13px] text-[rgba(255,255,255,0.45)] text-center
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
        {/* end hero content wrapper */}

        {/* Decorative orbiting dots */}
        {/* <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-orbit-slow" style={{ '--orbit-radius': '480px' } as React.CSSProperties} />
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/30 animate-orbit-slower" style={{ '--orbit-radius': '520px' } as React.CSSProperties} />
        </div> */}
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
    <div className="relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-[0_0_0_1px_rgba(0,54,255,0.20),0_24px_80px_rgba(0,54,255,0.15)]">
      {/* Browser chrome */}
      <div className="bg-[rgba(13,9,32,0.06)] border-b border-[rgba(0,0,0,0.10)] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-full bg-[rgba(0,0,0,0.06)] text-[12px] font-mono text-[rgba(0,0,0,0.40)]">nohotfix.io/runs/release-v2.4.1</div>
        </div>
        <div className="w-[52px]" />
      </div>

      {/* Tab nav */}
      <div className="bg-base-900 border-b border-[rgba(255,255,255,0.08)] px-6 flex gap-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === i ? 'text-white border-blue-500' : 'text-[rgba(255,255,255,0.50)] border-transparent hover:text-[rgba(255,255,255,0.70)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-base-900 p-4 sm:p-6 min-h-[320px] sm:min-h-[360px]">
        {activeTab === 0 && <TabExecuteSpecs />}
        {activeTab === 1 && <TabGoNoGo />}
        {activeTab === 2 && <TabRecord />}
      </div>
    </div>
  );
}

function SpecRow({ name, status, statusColor, artifact, blocked }: { name: string; status: string; statusColor: string; artifact?: string; blocked?: boolean }) {
  const colorMap: Record<string, string> = {
    green: 'bg-[rgba(0,204,128,0.15)] text-go-500 border-[rgba(0,204,128,0.25)]',
    blue: 'bg-[rgba(0,54,255,0.15)] text-blue-300 border-[rgba(0,54,255,0.25)]',
    slate: 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.50)] border-[rgba(255,255,255,0.10)]',
    amber: 'bg-[rgba(245,158,11,0.15)] text-nogo-500 border-[rgba(245,158,11,0.25)]',
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[statusColor]}`}>{status}</span>
        <span className="text-sm text-[rgba(255,255,255,0.80)] truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {artifact && <span className="hidden sm:inline text-xs text-[rgba(255,255,255,0.40)] bg-[rgba(255,255,255,0.06)] px-2 py-1 rounded">{artifact}</span>}
        {blocked ? (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.30)] text-xs font-medium cursor-not-allowed animate-lock-glow">
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
        <h3 className="text-white text-sm font-semibold">Release v2.4.1 — Specs</h3>
        <span className="text-xs text-[rgba(255,255,255,0.40)]">2 of 3 complete</span>
      </div>
      <SpecRow name="API authentication flow" status="Passed" statusColor="green" artifact="auth-screenshot.png" />
      <SpecRow name="Payment gateway integration" status="In Progress" statusColor="blue" blocked />
      <SpecRow name="Error handling — 500 responses" status="Pending" statusColor="slate" />

      {/* Annotation */}
      <div className="mt-4 flex items-center gap-2 text-xs text-nogo-500 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] rounded-lg px-3 py-2">
        <LockIcon />
        <span>Blocked — artifact required before spec can pass</span>
      </div>
    </div>
  );
}

function TabGoNoGo() {
  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">Release v2.4.1 — Go / No-Go Review</h3>

      <div className="space-y-2">
        <SpecRow name="API authentication flow" status="Passed" statusColor="green" />
        <SpecRow name="Payment gateway integration" status="Passed" statusColor="green" />
        <SpecRow name="Error handling — 500 responses" status="Failed" statusColor="amber" />
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 py-2.5 rounded-md bg-go-500 text-white text-sm font-medium shadow-[0_0_12px_rgba(0,204,128,0.30)]">Ship it (Go)</button>
        <button className="flex-1 py-2.5 rounded-md bg-[rgba(245,158,11,0.15)] text-nogo-500 text-sm font-medium border border-[rgba(245,158,11,0.25)]">Hold (No-Go)</button>
      </div>

      <div className="mt-2">
        <label className="text-xs text-[rgba(255,255,255,0.50)] mb-1 block">Justification required for Go with failures</label>
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.10)] rounded-md p-3 text-sm font-mono text-[rgba(255,255,255,0.60)]">
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
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          Release v2.4.1
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(0,204,128,0.15)] text-go-500 border border-[rgba(0,204,128,0.25)] flex items-center gap-1">
            <LockIcon /> LOCKED
          </span>
        </h3>
      </div>

      <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 space-y-2">
        <div className="text-xs text-[rgba(255,255,255,0.40)]">Go decision</div>
        <div className="text-sm text-white font-medium">Alex Chen</div>
        <div className="text-xs font-mono text-[rgba(255,255,255,0.50)]">March 8, 2026 at 14:32 UTC</div>
      </div>

      <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
        <div className="text-xs text-[rgba(255,255,255,0.40)] mb-2">Justification</div>
        <p className="text-[13px] font-mono text-[rgba(255,255,255,0.60)] leading-5">
          Minor auth token edge case in low-traffic scenario. Mitigation: server-side session invalidation on next request. Accepted risk.
        </p>
      </div>

      <div className="space-y-2">
        <SpecRow name="API authentication flow" status="Passed" statusColor="green" />
        <SpecRow name="Payment gateway integration" status="Passed" statusColor="green" />
        <SpecRow name="Error handling — 500 responses" status="Failed" statusColor="amber" />
      </div>

      <div className="text-xs text-[rgba(255,255,255,0.35)] text-center italic">The record is sealed. Nothing in it can be changed.</div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CC80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
