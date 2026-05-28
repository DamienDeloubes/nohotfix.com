'use client';

import { ScrollReveal } from './ScrollReveal';

export function PainHook() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-[760px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="text-[13px] font-medium text-blue-500 uppercase tracking-[0.08em]">THE PROBLEM WITH CHECKLISTS</span>
        </ScrollReveal>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch">
          {/* Left card — Current way */}
          <ScrollReveal delay={0}>
            <div className="h-full">
              <p className="text-[13px] font-medium text-slate-500 mb-3">Notion / Confluence checklist</p>
              <div className="bg-white border border-[rgba(0,0,0,0.10)] rounded-xl p-6 sm:p-8 h-[calc(100%-28px)]">
                <div className="space-y-4">
                  <ChecklistRow checked label="API authentication flow — passed" />
                  <ChecklistRow checked label="Payment gateway — passed" />
                  <ChecklistRow checked={false} label="Error handling — not started" />
                </div>
                <p className="mt-6 text-[13px] text-slate-400">Anyone can tick this. No evidence required.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* VS separator */}
          <div className="hidden md:flex flex-col items-center justify-center px-6">
            <div className="w-px h-full bg-[rgba(0,0,0,0.15)] relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[rgba(0,0,0,0.10)] rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                VS
              </span>
            </div>
          </div>

          {/* Mobile VS */}
          <div className="md:hidden flex items-center justify-center">
            <div className="h-px w-full bg-[rgba(0,0,0,0.15)] relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[rgba(0,0,0,0.10)] rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                VS
              </span>
            </div>
          </div>

          {/* Right card — NoHotfix */}
          <ScrollReveal delay={150}>
            <div className="h-full">
              <p className="text-[13px] font-medium text-blue-300 mb-3">NoHotfix</p>
              <div className="bg-base-900 border border-[rgba(255,255,255,0.10)] rounded-xl p-6 sm:p-8 h-[calc(100%-28px)]">
                <div className="space-y-4">
                  <EnforcedRow status="Passed" statusColor="green" label="API authentication flow" hasArtifact />
                  <EnforcedRow status="In Progress" statusColor="blue" label="Payment gateway integration" blocked />
                  <EnforcedRow status="Pending" statusColor="slate" label="Error handling — 500 responses" />
                </div>
                <p className="mt-6 text-[13px] text-[rgba(255,255,255,0.50)]">
                  The pass action is blocked. Not warned. <strong className="text-white">Blocked.</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ChecklistRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-blue-100 border-blue-300' : 'border-slate-300 bg-white'}`}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3361FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

function EnforcedRow({ status, statusColor, label, hasArtifact, blocked }: { status: string; statusColor: string; label: string; hasArtifact?: boolean; blocked?: boolean }) {
  const colorMap: Record<string, string> = {
    green: 'bg-[rgba(0,204,128,0.15)] text-go-500 border-[rgba(0,204,128,0.25)]',
    blue: 'bg-[rgba(0,54,255,0.15)] text-blue-300 border-[rgba(0,54,255,0.25)]',
    slate: 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.50)] border-[rgba(255,255,255,0.10)]',
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium border ${colorMap[statusColor]}`}>{status}</span>
        <span className="text-sm text-[rgba(255,255,255,0.80)] truncate">{label}</span>
      </div>
      {hasArtifact && <div className="w-8 h-8 rounded bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] shrink-0" />}
      {blocked && (
        <span className="flex items-center gap-1 text-[11px] text-[rgba(255,255,255,0.30)] animate-lock-glow rounded px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Blocked
        </span>
      )}
    </div>
  );
}
