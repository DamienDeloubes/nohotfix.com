'use client';

import { ScrollReveal } from './ScrollReveal';

export function PainHook(): React.ReactElement {
  return (
    <section className="relative py-24 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[760px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="text-[13px] font-medium text-[var(--color-primary)] uppercase tracking-[0.08em]">
            THE PROBLEM WITH CHECKLISTS
          </span>
          <h2
            className="mt-4 font-display font-semibold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px]
              tracking-[-0.025em] text-[var(--text-primary)] max-w-[640px] mx-auto"
          >
            The checklist is a shared lie.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)] max-w-[560px] mx-auto">
            Anyone can tick the box. NoHotfix makes it impossible to tick without the proof.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch">
          {/* Left card — Current way */}
          <ScrollReveal delay={0}>
            <div className="h-full">
              <p className="text-[13px] font-medium text-[var(--text-muted)] mb-3">
                The way it works now
              </p>
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 h-[calc(100%-28px)] shadow-[var(--shadow-card)]">
                <div className="space-y-4">
                  <ChecklistRow checked label="API authentication flow — passed" />
                  <ChecklistRow checked label="Payment gateway — passed" />
                  <ChecklistRow checked={false} label="Error handling — not started" />
                </div>
                <p className="mt-6 text-[13px] text-[var(--text-muted)]">
                  Anyone can tick this. No evidence required.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* VS separator */}
          <div className="hidden md:flex flex-col items-center justify-center px-6">
            <div className="w-px h-full bg-[var(--border-default)] relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-full px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                VS
              </span>
            </div>
          </div>

          {/* Mobile VS */}
          <div className="md:hidden flex items-center justify-center">
            <div className="h-px w-full bg-[var(--border-default)] relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-full px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                VS
              </span>
            </div>
          </div>

          {/* Right card — NoHotfix (dark surface to show the product UI contrast) */}
          <ScrollReveal delay={150}>
            <div className="h-full">
              <p className="text-[13px] font-medium text-[var(--color-primary)] mb-3">NoHotfix</p>
              <div
                className="rounded-xl p-6 sm:p-8 h-[calc(100%-28px)]"
                style={{
                  background: 'var(--bg-card-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div className="space-y-4">
                  <EnforcedRow status="Passed" statusColor="green" label="API authentication flow" hasArtifact />
                  <EnforcedRow status="In Progress" statusColor="inprogress" label="Payment gateway integration" blocked />
                  <EnforcedRow status="Pending" statusColor="slate" label="Error handling — 500 responses" />
                </div>
                <p className="mt-6 text-[13px] text-[var(--text-secondary)]">
                  The pass action is blocked. Not warned.{' '}
                  <strong className="text-[var(--text-primary)]">Blocked.</strong>
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
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
          checked
            ? 'bg-[var(--color-go-100)] border-[var(--color-go-600)]'
            : 'border-[var(--border-default)] bg-[var(--bg-input)]'
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-go-700)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

function EnforcedRow({
  status,
  statusColor,
  label,
  hasArtifact,
  blocked,
}: {
  status: string;
  statusColor: string;
  label: string;
  hasArtifact?: boolean;
  blocked?: boolean;
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-[var(--go-surface)] text-[var(--go-text)] border-[var(--go-border)]',
    slate: 'bg-[var(--bg-section-alt)] text-[var(--text-muted)] border-[var(--border-default)]',
    inprogress: 'bg-[var(--bg-section-alt)] text-[var(--text-secondary)] border-[var(--border-default)]',
  };

  const resolvedColor = colorMap[statusColor] ? statusColor : 'slate';

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium border ${colorMap[resolvedColor]}`}
        >
          {status}
        </span>
        <span className="text-sm text-[var(--text-primary)] truncate">{label}</span>
      </div>
      {hasArtifact && (
        <div className="w-8 h-8 rounded bg-[var(--bg-section-alt)] border border-[var(--border-default)] shrink-0" />
      )}
      {blocked && (
        <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] animate-lock-glow rounded px-2 py-1">
          <svg
            width="10"
            height="10"
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
          Blocked
        </span>
      )}
    </div>
  );
}
