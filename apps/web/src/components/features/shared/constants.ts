/*
 * Shared constants for the three /features/* marketing pages.
 *
 * Single source of truth for cross-link hrefs, the signup URL, and the
 * breadcrumb/site base — so the pages, JSON-LD, and CTAs can never drift.
 * Some destinations (e.g. /how-it-works, /contact, /use-cases/*, /platform)
 * may 404 until those routes ship; hrefs are still correct so they resolve
 * the moment those pages exist (see research.md R8).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

/** Public marketing origin — used to build absolute URLs for SEO/JSON-LD. */
export const SITE_ORIGIN = 'https://nohotfix.com';

/** WorkOS-hosted signup entry (matches FinalCTA.tsx / Navigation.tsx). */
export const SIGNUP_URL = `${API_URL}/auth/login?screen_hint=sign-up`;

/** Shared in-content link targets used across the feature pages. */
export const HREF = {
  // The enforcement triad (cross-link triangle)
  artifactEnforcement: '/features/artifact-enforcement',
  goNoGo: '/features/go-no-go',
  auditTrail: '/features/audit-trail',
  // Deeper content
  howItWorks: '/how-it-works',
  howItWorksStep2: '/how-it-works#step-2',
  howItWorksStep4: '/how-it-works#step-4',
  pricing: '/pricing',
  platform: '/platform',
  contact: '/contact',
  // Persona use-cases
  useCasesQa: '/use-cases/qa-teams',
  useCasesEngineeringManagers: '/use-cases/engineering-managers',
  useCasesCompliance: '/use-cases/compliance',
} as const;

/** Breadcrumb base shared by all three pages (Home → Features → page). */
export const BREADCRUMB_BASE = [
  { name: 'Home', url: `${SITE_ORIGIN}/` },
  { name: 'Features', url: `${SITE_ORIGIN}/features` },
] as const;
