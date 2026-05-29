'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { BrowserFrame } from './BrowserFrame';
import { ScrollReveal } from './ScrollReveal';

/*
 * Pain hook — "The checklist is a shared lie."
 * A scripted, auto-advancing walkthrough of a release runbook inside a browser
 * frame. The arc proves the manifesto: it opens looking like an ordinary
 * checklist, then the gate blocks a pass with a missing screenshot, then the
 * evidence is attached and the run resolves into a go/no-go verdict.
 *
 * Forward design: the real run-execution + go/no-go screens aren't built yet, so
 * this is modelled faithfully on the real schema (severity critical/high/medium/
 * low; required `file` artifact; result passed/failed/skipped; decisions go/no_go).
 */
const STEPS = [
  'Execute the spec',
  'Blocked — evidence required',
  'Evidence attached',
  'Go / No-Go decision',
] as const;

// ms per frame; the blocked frame (1) and the verdict (3) are held longest.
const FRAME_DURATIONS = [3200, 5000, 2800, 5400] as const;

export function PainHook(): React.ReactElement {
  return (
    <section className="relative py-24 px-6 bg-[var(--bg-page)]">
      <div className="max-w-[960px] mx-auto">
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

        <ScrollReveal>
          <RunbookDemo />
        </ScrollReveal>
      </div>
    </section>
  );
}

function RunbookDemo() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Respect reduced motion: no auto-play; freeze on the blocked frame (the most
  // persuasive single state) and let the dots drive manual paging.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) setActive(1);
  }, [reduced]);

  useEffect(() => {
    if (hovering || reduced) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), FRAME_DURATIONS[active] ?? 3500);
    return () => clearTimeout(t);
  }, [active, hovering, reduced]);

  const url = `app.nohotfix.com/acme/runs/v2.4.1${active === 3 ? '/decision' : ''}`;

  return (
    <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <BrowserFrame url={url}>
        <div className="relative min-h-[440px] sm:min-h-[460px] bg-[var(--bg-card)]">
          <Frame index={0} active={active}>
            <SpecFrame />
          </Frame>
          <Frame index={1} active={active}>
            <BlockedFrame />
          </Frame>
          <Frame index={2} active={active}>
            <SubmittedFrame />
          </Frame>
          <Frame index={3} active={active}>
            <SummaryFrame />
          </Frame>
        </div>
      </BrowserFrame>

      {/* Step indicator — click to scrub */}
      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Demo steps">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={label}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i
                ? 'w-6 bg-[var(--color-primary)]'
                : 'w-2 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-[13px] text-[var(--text-muted)]">{STEPS[active] ?? ''}</p>
    </div>
  );
}

function Frame({ index, active, children }: { index: number; active: number; children: ReactNode }) {
  const isActive = active === index;
  return (
    <div
      aria-hidden={!isActive}
      className={`absolute inset-0 flex flex-col p-5 sm:p-7 transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}

/* ── Shared bits ───────────────────────────────────────────────────────── */

type Tone = 'go' | 'nogo' | 'error' | 'slate';

const TONE: Record<Tone, string> = {
  go: 'bg-[var(--go-surface)] text-[var(--go-text)] border-[var(--go-border)]',
  nogo: 'bg-[var(--nogo-surface)] text-[var(--nogo-text)] border-[var(--nogo-border)]',
  error: 'bg-[var(--error-surface)] text-[var(--error-text)] border-[var(--error-border)]',
  slate: 'bg-[var(--bg-section-alt)] text-[var(--text-secondary)] border-[var(--border-default)]',
};

function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TONE[tone]}`}>
      {children}
    </span>
  );
}

function SpecHeader({ tone, status }: { tone: Tone; status: string }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <div className="text-[12px] text-[var(--text-muted)]">Run · Release v2.4.1</div>
        <h4 className="text-[var(--text-primary)] text-base font-semibold truncate">
          Refund processing — declined card
        </h4>
      </div>
      <StatusBadge tone={tone}>{status}</StatusBadge>
    </div>
  );
}

function Findings({ typing = false }: { typing?: boolean }) {
  return (
    <div className="mb-4">
      <div className="text-xs text-[var(--text-muted)] mb-1.5">Findings</div>
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-section-alt)] p-3 font-mono text-[13px] leading-6 text-[var(--text-secondary)]">
        Declined-card path returns a clean decline; partial refund reconciles to the cent. JPY
        rounding within tolerance.
        {typing && (
          <span className="ml-0.5 inline-block h-4 w-[2px] align-middle bg-[var(--text-muted)] animate-pulse" />
        )}
      </div>
    </div>
  );
}

/* ── Frame 1 · Spec + findings (the "before") ──────────────────────────── */

function SpecFrame() {
  return (
    <>
      <SpecHeader tone="slate" status="In Progress" />
      <Findings typing />
      <div className="mb-auto flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-3 py-2.5">
        <FileIcon className="text-[var(--text-muted)]" />
        <span className="text-sm text-[var(--text-secondary)]">Screenshot</span>
        <span className="ml-auto text-xs text-[var(--text-muted)]">Required · not attached</span>
      </div>
      <ActionRow />
    </>
  );
}

/* ── Frame 2 · Blocked (the money frame) ───────────────────────────────── */

function BlockedFrame() {
  return (
    <>
      <SpecHeader tone="slate" status="In Progress" />
      <Findings />
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--error-border)] bg-[var(--error-surface)] px-3 py-2.5">
        <FileIcon className="text-[var(--error-text)]" />
        <span className="text-sm font-medium text-[var(--error-text)]">Screenshot</span>
        <span className="ml-auto text-xs font-medium text-[var(--error-text)]">Required · missing</span>
      </div>
      <div className="mb-auto flex items-center gap-2 rounded-md border border-[var(--error-border)] bg-[var(--error-surface)] px-3 py-2 text-sm text-[var(--error-text)]">
        <AlertIcon />
        Required screenshot not attached.
      </div>
      <ActionRow blocked />
    </>
  );
}

/* ── Frame 3 · Submitted ───────────────────────────────────────────────── */

function SubmittedFrame() {
  return (
    <>
      <SpecHeader tone="go" status="Passed" />
      <Findings />
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-[var(--go-border)] bg-[var(--go-surface)] px-3 py-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border-default)] bg-[var(--bg-card)]">
          <ImageIcon />
        </span>
        <span className="font-mono text-sm text-[var(--text-secondary)]">decline-refund.png</span>
        <CheckIcon className="ml-auto text-[var(--go-text)]" />
      </div>
      <div className="mb-auto flex items-center gap-2 rounded-md border border-[var(--go-border)] bg-[var(--go-surface)] px-3 py-2 text-sm text-[var(--go-text)]">
        <CheckIcon />
        Evidence recorded — spec passed.
      </div>
      <div className="flex gap-2 pt-4">
        <span
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--color-go-600)' }}
        >
          <CheckIcon /> Passed
        </span>
      </div>
    </>
  );
}

/* ── Frame 4 · Summary + go/no-go (the verdict) ────────────────────────── */

function SummaryFrame() {
  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h4 className="text-base font-semibold text-[var(--text-primary)]">
          Release v2.4.1 — Go / No-Go
        </h4>
        <span className="text-[12px] text-[var(--text-muted)]">12 specs · 10 passed · 2 failed</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <SevCell label="Critical" count={0} tone="error" />
        <SevCell label="High" count={1} tone="error" />
        <SevCell label="Medium" count={1} tone="nogo" />
        <SevCell label="Low" count={0} tone="slate" />
      </div>

      <div className="mb-auto space-y-2">
        <FailedRow name="Webhook retry on 5xx" sev="High" tone="error" />
        <FailedRow name="JPY rounding edge case" sev="Medium" tone="nogo" />
      </div>

      <div className="mt-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-3 py-2 text-xs text-[var(--text-muted)]">
        A Go with failures requires a written justification, recorded permanently.
      </div>

      <div className="flex gap-2 pt-4">
        <span
          className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-white"
          style={{ background: 'var(--color-go-600)' }}
        >
          Go
        </span>
        <span className="flex-1 rounded-md border border-[var(--nogo-border)] bg-[var(--nogo-surface)] py-2.5 text-center text-sm font-medium text-[var(--nogo-text)]">
          No-Go
        </span>
      </div>
    </>
  );
}

function SevCell({ label, count, tone }: { label: string; count: number; tone: Tone }) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-section-alt)] p-2.5 text-center">
      <div
        className={`font-display text-2xl font-semibold leading-none ${
          count > 0 ? '' : 'text-[var(--text-muted)]'
        }`}
        style={count > 0 ? { color: TONE_TEXT[tone] } : undefined}
      >
        {count}
      </div>
      <div className="mt-1 text-[11px] text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

const TONE_TEXT: Record<Tone, string> = {
  go: 'var(--go-text)',
  nogo: 'var(--nogo-text)',
  error: 'var(--error-text)',
  slate: 'var(--text-secondary)',
};

function FailedRow({ name, sev, tone }: { name: string; sev: string; tone: Tone }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <StatusBadge tone="nogo">Failed</StatusBadge>
        <span className="truncate text-sm text-[var(--text-primary)]">{name}</span>
      </div>
      <StatusBadge tone={tone}>{sev}</StatusBadge>
    </div>
  );
}

function ActionRow({ blocked = false }: { blocked?: boolean }) {
  return (
    <div className="flex gap-2 pt-4">
      {blocked ? (
        <span
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] opacity-60"
          title="Attach the required screenshot to enable"
        >
          <LockIcon /> Pass
        </span>
      ) : (
        <span
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          Pass
        </span>
      )}
      <span className="rounded-md border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
        Fail
      </span>
      <span className="rounded-md border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
        Skip
      </span>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────── */

function FileIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
