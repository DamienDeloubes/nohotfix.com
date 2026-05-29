/*
 * Shared navigation + homepage content.
 *
 * This is the single source of truth for the product's feature/platform copy,
 * consumed by BOTH the homepage ThreeGuarantees bento and the navigation
 * mega-menu panels (DesktopNav / MegaPanel) and the mobile menu groups — so the
 * menu can never drift from the homepage.
 *
 * Pure data + types only (no 'use client'): safe to import from server and
 * client components alike.
 */
import type { FeatureIconType } from './FeatureIcon';

export interface FeatureItem {
  icon: FeatureIconType;
  iconColorVar: string;
  iconBgVar: string;
  iconBorderVar: string;
  eyebrow: string;
  heading: string;
  /** Full body copy — used by the homepage bento. */
  body: string;
  /** Trimmed one-liner — used by the mega-menu panel where space is tight. */
  short: string;
  link: { text: string; href: string };
  visual: string;
}

export const guarantees: FeatureItem[] = [
  {
    icon: 'lock',
    iconColorVar: 'var(--color-primary)',
    iconBgVar: 'rgba(234,106,4,0.08)',
    iconBorderVar: 'rgba(234,106,4,0.18)',
    eyebrow: 'Artifact enforcement',
    heading: 'No artifact, no pass. Full stop.',
    body: 'The pass action is blocked until the required artifact is attached — screenshot, log, measurement, URL, or table. Six types. No workarounds.',
    short: 'The pass action stays blocked until the required evidence is attached.',
    link: { text: 'How enforcement works', href: '/features/artifact-enforcement' },
    visual: 'enforcement',
  },
  {
    icon: 'flag',
    iconColorVar: 'var(--color-go-700)',
    iconBgVar: 'rgba(0,204,128,0.08)',
    iconBorderVar: 'rgba(0,204,128,0.18)',
    eyebrow: 'Go/no-go gate',
    heading: 'The release decision, made once and locked.',
    body: 'Only an Admin can make the call, and only after every spec is terminal. A Go with failures requires a written justification, recorded permanently.',
    short: 'One admin call, only when every spec is terminal — justified and recorded.',
    link: { text: 'Inside the decision', href: '/features/go-no-go' },
    visual: 'decision',
  },
  {
    icon: 'shield',
    iconColorVar: 'var(--color-slate-500)',
    iconBgVar: 'rgba(148,163,184,0.12)',
    iconBorderVar: 'rgba(148,163,184,0.24)',
    eyebrow: 'Immutable record',
    heading: 'The record is sealed when the call is made.',
    body: 'Sealed at three layers — API, service, and database. No edits. No overwrites. Send the URL.',
    short: 'Sealed at API, service, and database. No edits, no overwrites — just send the URL.',
    link: { text: 'See the audit trail', href: '/features/audit-trail' },
    visual: 'immutable',
  },
];

export interface PlatformItem {
  icon: FeatureIconType;
  /** 'primary' = shipped/actionable (orange); 'muted' = roadmap (slate). */
  accent: 'primary' | 'muted';
  /** Status pill text, e.g. "Live" / "Next". */
  status: string;
  heading: string;
  short: string;
  href: string;
}

/*
 * Platform pillars. Brand rule (see PlatformThread.tsx): roadmap items are
 * slate/muted — orange is reserved for shipped, actionable things. Only the
 * Release Gate is shipped today, so it alone carries the primary accent.
 */
export const platformItems: PlatformItem[] = [
  {
    icon: 'check-circle',
    accent: 'primary',
    status: 'Live',
    heading: 'The release gate',
    short: 'Artifact-enforced go/no-go with an immutable record — shipping today.',
    href: '/platform',
  },
  {
    icon: 'clipboard',
    accent: 'muted',
    status: 'Next',
    heading: 'UAT sign-off',
    short: 'Structured user-acceptance sign-off that feeds the same gate.',
    href: '/platform#uat',
  },
  {
    icon: 'link',
    accent: 'muted',
    status: 'Next',
    heading: 'Jira integration',
    short: 'Tie specs and evidence to the issues your team already tracks.',
    href: '/platform#jira',
  },
  {
    icon: 'layers',
    accent: 'muted',
    status: 'Next',
    heading: 'Release-level gating',
    short: 'Roll many gates up into a single, auditable release decision.',
    href: '/platform#releases',
  },
];
