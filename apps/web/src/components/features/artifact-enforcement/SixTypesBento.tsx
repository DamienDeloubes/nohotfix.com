'use client';

import type { ReactElement, ReactNode } from 'react';

import { HREF } from '../shared/constants';
import { SectionLabel } from '../shared/SectionLabel';
import { ScrollReveal } from '../../ScrollReveal';
import type { ArtifactType } from '../shared/fragments/ArtifactRequirementPanel';

/*
 * SixTypesBento — Section 2. The one permitted bento moment (Phase 9): six
 * equal-weight artifact-type tiles. Each leads with the practical use case, not
 * the type name. Type names are <h3> — the crawlable vocabulary terms.
 * 2×3 desktop · 3×2 tablet · stacked mobile. Two-wave staggered reveal.
 *
 * Copy is indicative working text (final copy deck pending).
 */
interface Tile {
  type: ArtifactType;
  name: string;
  useCase: string;
  detail: string;
  icon: ReactNode;
  inset: ReactNode;
}

const stroke = {
  fill: 'none',
  stroke: 'var(--color-orange-400)',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Icon({ children }: { children: ReactNode }): ReactElement {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      {children}
    </svg>
  );
}

const TILES: Tile[] = [
  {
    type: 'file',
    name: 'File upload',
    useCase: 'Screenshots, scan outputs, recordings — anything a tester captures during execution.',
    detail: 'PNG, JPG, PDF, MP4, log files. Up to 50 MB. Inline preview for images. Minimum file count enforced.',
    icon: (
      <Icon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M9 15l3-3 3 3" />
      </Icon>
    ),
    inset: (
      <div className="flex gap-2">
        <div className="flex h-12 flex-1 items-center justify-center rounded-md bg-[var(--bg-section-alt)] text-[10px] text-[var(--text-muted)]">
          before.png
        </div>
        <div className="flex h-12 flex-1 items-center justify-center rounded-md border border-dashed border-[var(--border-strong)] text-[10px] text-[var(--text-muted)]">
          Upload file
        </div>
      </div>
    ),
  },
  {
    type: 'text',
    name: 'Text entry',
    useCase: 'Log output, observed errors, notes that need to be on the record — not just in a Slack message.',
    detail: 'Free-text field. Required before pass. Stored as part of the immutable record.',
    icon: (
      <Icon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </Icon>
    ),
    inset: (
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-2 py-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
        ERR_CONN_RESET on retry #2 — recovered after failover
      </div>
    ),
  },
  {
    type: 'checkbox',
    name: 'Explicit confirmation',
    useCase: '“I ran the migration and verified it completed.” — steps that must be consciously acknowledged.',
    detail: 'A required confirmation checkbox. Not checkable unless the tester is present in the spec panel.',
    icon: (
      <Icon>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12l3 3 5-6" />
      </Icon>
    ),
    inset: (
      <label className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--color-go-600)]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" aria-hidden="true">
            <path d="M5 12l5 5L20 6" />
          </svg>
        </span>
        Migration verified complete
      </label>
    ),
  },
  {
    type: 'url',
    name: 'URL',
    useCase: 'CI pipeline results, Loom recordings, Sentry traces — any external evidence worth linking.',
    detail: 'Validated as a well-formed URL before pass is enabled. Stored as a clickable link in the run record.',
    icon: (
      <Icon>
        <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
      </Icon>
    ),
    inset: (
      <div className="truncate rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-2 py-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
        https://ci.example.com/runs/8421
      </div>
    ),
  },
  {
    type: 'measured',
    name: 'Measured value',
    useCase: 'API response times, error rates, load times — the number on the record, with a threshold.',
    detail: 'Tester enters the observed value. A configured threshold triggers a warning if breached. Value required before pass.',
    icon: (
      <Icon>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-4 3 2 4-6" />
      </Icon>
    ),
    inset: (
      <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--bg-section-alt)] px-2 py-1.5">
        <span className="font-mono text-[11px] text-[var(--text-primary)]">
          2340 <span className="text-[var(--text-muted)]">≤ 3000 ms</span>
        </span>
        <span className="text-[10px] font-medium text-[var(--go-text)]">Within threshold</span>
      </div>
    ),
  },
  {
    type: 'table',
    name: 'Structured table',
    useCase: 'Browser matrices, device grids, load-test scenarios — structured evidence a screenshot can’t capture.',
    detail: 'Admin defines columns (text, number, pass/fail). Tester fills rows during execution. Minimum row count enforced.',
    icon: (
      <Icon>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18" />
      </Icon>
    ),
    inset: (
      <div className="overflow-hidden rounded-md border border-[var(--border-default)] font-mono text-[10px]">
        <div className="grid grid-cols-3 bg-[var(--bg-section-alt)] text-[var(--text-muted)]">
          <span className="px-2 py-1">Browser</span>
          <span className="px-2 py-1">Version</span>
          <span className="px-2 py-1">Result</span>
        </div>
        <div className="grid grid-cols-3 text-[var(--text-secondary)]">
          <span className="px-2 py-1">Chrome</span>
          <span className="px-2 py-1">126</span>
          <span className="px-2 py-1 text-[var(--go-text)]">Pass</span>
        </div>
      </div>
    ),
  },
];

export function SixTypesBento({ headingId }: { headingId: string }): ReactElement {
  return (
    <section aria-labelledby={headingId} className="bg-[var(--bg-section-alt)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px]">
        <ScrollReveal className="mx-auto max-w-[640px] text-center">
          <SectionLabel>Six artifact types</SectionLabel>
          <h2
            id={headingId}
            className="mt-5 font-display text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[48px] sm:leading-[52px]"
          >
            Every kind of evidence a QA team collects.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            Map your own workflow onto the six. Each is enforced the same way: no artifact, no pass.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border-default)] bg-gridline sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <ScrollReveal key={tile.type} delay={(i % 3) * 80 + (i >= 3 ? 240 : 0)}>
              <article className="flex h-full flex-col gap-3 bg-[var(--bg-card)] p-6 sm:p-7">
                <span aria-hidden="true">{tile.icon}</span>
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--text-primary)]">{tile.name}</h3>
                <p className="text-[15px] leading-6 text-[var(--text-secondary)]">{tile.useCase}</p>
                <p className="text-[13px] leading-5 text-[var(--text-muted)]">{tile.detail}</p>
                <div className="mt-auto pt-2">{tile.inset}</div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="mt-10 text-center">
          <a
            href={HREF.howItWorksStep2}
            className="arrow-link text-[15px] font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
          >
            See how requirements are configured in the playbook <span className="arrow">&rarr;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
