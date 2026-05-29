# Implementation Plan: Feature Marketing Pages (Artifact Enforcement · Go/No-Go · Audit Trail)

**Branch**: `032-feature-pages` (work performed on `feature/homepage` per instruction) | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/032-feature-pages/spec.md`

## Summary

Build three deep feature marketing pages in the Next.js marketing site (`apps/web`) — `/features/artifact-enforcement`, `/features/go-no-go`, `/features/audit-trail` — that share one archetype: a declarative DM Sans hero statement over a large, faithful product-UI crop, then 3–6 explanatory bands. The pages reuse the homepage's existing chrome and design system (Navigation, Footer, `BrowserFrame`, `ScrollReveal`, design tokens, fonts) and are differentiated by their hero fragment and (for Audit Trail) a more compliance-formal register.

**Technical approach**: Each page is a Next.js App Router server component (`page.tsx`) that exports route-level `metadata`, injects `SoftwareApplication`/`ItemPage`/`BreadcrumbList` JSON-LD, and composes section components. Product-UI "fragments" are built as faithful HTML/DOM components (real text, badges, fields) inside the existing `BrowserFrame` — never raster images — so mechanic claims stay crawlable and theme-aware. Motion reuses the existing `ScrollReveal` + CSS-keyframe system (already `prefers-reduced-motion`-safe); the one new motion primitive is a hand-ported `TextType` component (modeled on `Magnet.tsx`) for the Audit Trail §3 typed callout, reduced-motion-guarded at the call site. A parameterized final-CTA component replaces the hardcoded `FinalCTA` for per-page conversion goals (Audit Trail swaps primary/secondary). The nav gains a current-page active indicator. **No backend, domain, database, or API work.**

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js ≥20
**Primary Dependencies**: Next.js 15 (App Router), React 18, Tailwind CSS 3, `@nohotfix/design-tokens` (CSS-variable tokens), `next/font` (DM Sans / Inter / Geist Mono), Lenis (smooth scroll, already wired). No new runtime dependency required (TextType is copy-in, like `Magnet.tsx`).
**Storage**: N/A — static marketing pages, no persistence.
**Testing**: `apps/web-e2e` (Playwright) for render/links/SEO/reduced-motion; `tsc --noEmit` typecheck; `eslint`. No unit/integration/domain tests (no domain logic).
**Target Platform**: Server-rendered + statically optimizable web pages; modern evergreen browsers; responsive ≥320px.
**Project Type**: Web — marketing frontend (`apps/web`), distinct from the `apps/app` SPA.
**Performance Goals**: Hero headline is LCP (< 2.5s on simulated 4G per constitution); below-fold fragments lazy with explicit dimensions; no layout shift; no heavy JS for static fragments (server components where possible).
**Constraints**: Light-first theme with co-equal dark (class strategy, pre-paint script); WCAG AA contrast; ≤2 orange elements per viewport; all motion suppressed under `prefers-reduced-motion`; sealed/locked elements never animate; no fabricated proof; roadmap items never shown as current.
**Scale/Scope**: 3 routes; ~18 sections total (6 per page); ~12–18 new presentational components (shared + per-page fragments); 1 ported motion primitive; nav active-state enhancement.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This is a **frontend-only marketing feature in `apps/web`** with no domain logic, run data, services, DB queries, or API endpoints. Principles scoped to the backend/domain layer are therefore N/A; the applicable ones (II code quality, IV UX consistency, plus testing-by-appropriate-layer under III) are satisfied.

| # | Principle | Check | Notes |
|---|-----------|-------|-------|
| I | **Bounded Context Integrity** | ✅ N/A | No domain package touched. `apps/web` consumes only `@nohotfix/design-tokens` and `@nohotfix/shared`; no cross-domain or infrastructure imports introduced. |
| II | **Code Quality & Simplicity** | ✅ Pass | Named exports only; `PascalCase.tsx` components, `kebab-case` dirs; `strict: true`; YAGNI (no abstraction without a present need). Shared components (`SectionLabel`, `FeatureFinalCTA`, fragment primitives) justified by use across all 3 pages (≥3-use rule). No `org_id`/DB concerns. |
| III | **Testing Discipline** | ✅ Pass (by layer) | Domain/unit/immutability test rules are N/A (no domain logic). Coverage is provided at the correct layer for marketing pages: `apps/web-e2e` Playwright specs assert each route renders, has one `<h1>`, valid heading order, working cross-links/CTAs, JSON-LD presence, and reduced-motion behavior. |
| IV | **UX Consistency** | ✅ Pass | Terminal/sealed states rendered as visually read-only (no edit affordances) — directly honored by the sealed-record and blocked-pass fragments. Loading/polling/query-key rules are `apps/app`-specific and N/A here. Accessibility (keyboard, ARIA, focus ring, AA contrast) enforced per spec. |
| V | **Run Immutability** | ✅ N/A | No run data. Fragments are static depictions of sealed/blocked states; there is nothing mutable to guard. |
| VI | **Domain Errors** | ✅ N/A | No new error paths, services, or codes. Static pages throw no domain errors. |
| VII | **Observability (OTel)** | ✅ N/A | No service methods or DB queries. Web Vitals (LCP) are the relevant signal and are addressed via the LCP/lazy-load requirements, not OTel spans. |

**Result**: No violations. Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/032-feature-pages/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output — content/prop "data shapes" (no DB)
├── quickstart.md        # Phase 1 output — run & verify
├── contracts/           # Phase 1 output — route + JSON-LD + component prop contracts
│   ├── routes.md
│   ├── json-ld.md
│   └── components.md
├── checklists/
│   └── requirements.md  # from /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

All work is confined to `apps/web`. New files marked `(new)`.

```text
apps/web/src/
├── app/
│   └── features/
│       ├── artifact-enforcement/
│       │   └── page.tsx                 # (new) server component: metadata + JSON-LD + sections
│       ├── go-no-go/
│       │   └── page.tsx                 # (new)
│       └── audit-trail/
│           └── page.tsx                 # (new)
│
├── components/
│   ├── Navigation.tsx                   # (edit) pass current pathname for active state
│   ├── BrowserFrame.tsx                 # (reuse) hero/section fragment chrome
│   ├── ScrollReveal.tsx                 # (reuse) entrance motion (reduced-motion safe)
│   ├── Footer.tsx                       # (reuse)
│   ├── Magnet.tsx                       # (reference) port pattern for TextType
│   ├── TextType.tsx                     # (new) React Bits port — type-once, reduced-motion guarded
│   │
│   ├── nav/
│   │   ├── nav-content.tsx              # (reuse) already has the 3 feature hrefs
│   │   └── DesktopNav.tsx               # (edit) accept/apply activeHref for current-page state
│   │
│   └── features/                        # (new dir) feature-page presentational components
│       ├── shared/
│       │   ├── SectionLabel.tsx         # (new) all-caps Inter pill (orange/slate variants)
│       │   ├── FeatureHero.tsx          # (new) hero scaffold: pill→h1→sub→CTAs→fragment
│       │   ├── FeatureFinalCTA.tsx       # (new) parameterized closing CTA (swap-order support)
│       │   ├── FactCells.tsx            # (new) honest product-fact row (count-up optional)
│       │   ├── ReservedTestimonial.tsx  # (new) empty, non-fabricated quote slot
│       │   └── fragments/               # (new) faithful product-UI fragment primitives
│       │       ├── PassButton.tsx       # blocked + enabled states (shared AE hero/§3, GNG)
│       │       ├── ArtifactRequirementPanel.tsx
│       │       ├── SpecRow.tsx          # severity/result badges, executed-by, timestamp
│       │       ├── StatusBadge.tsx      # In Progress / Awaiting / Go / No-Go / SEALED
│       │       ├── SealedLockIcon.tsx   # static, never animates
│       │       └── DecisionRecordBlock.tsx
│       ├── artifact-enforcement/
│       │   ├── SixTypesBento.tsx        # the one permitted bento (2×3)
│       │   ├── EnforcementSteps.tsx     # 3-step sequence + connector
│       │   ├── ActiveVsSealed.tsx       # §4 two-panel
│       │   └── AdoptionBand.tsx         # §5 fact cells + reserved testimonial
│       ├── go-no-go/
│       │   ├── DecisionScreenFragment.tsx
│       │   ├── DecisionScreenAnnotated.tsx  # §2 paired-hover callouts
│       │   ├── RoleGateFragment.tsx
│       │   └── JustificationOverlay.tsx
│       └── audit-trail/
│           ├── SealedRecordFragment.tsx  # hero (entirely static)
│           ├── RecordContents.tsx        # §2 paired-hover, slate callouts
│           ├── ImmutabilityCards.tsx     # §3 — uses TextType
│           ├── PrintPreviewFragment.tsx  # §4 certified-document layout
│           └── ComplianceContext.tsx     # §5 + disclaimer + reserved testimonial
│
└── app/globals.css                      # (edit, if needed) any feature-specific print/util styles

apps/web-e2e/
└── features.spec.ts                     # (new) render/links/SEO/reduced-motion E2E
```

**Structure Decision**: Confine everything to `apps/web` (the Next.js marketing site). Routes follow the App Router convention already used by `app/pricing/page.tsx` and `app/(legal)/*`. Feature-page components are grouped under `components/features/` to keep the existing flat `components/` root (homepage sections) uncluttered, while genuinely shared primitives (`SectionLabel`, `FeatureFinalCTA`, fragment parts) live in `features/shared/` because they are used by all three pages. The nav already links to the three URLs via `nav-content.tsx`; only an active-state enhancement is needed.

## Complexity Tracking

*No constitution violations — section intentionally empty.*
