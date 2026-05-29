# Feature Marketing Pages — Design Set Overview

**Product**: NoHotfix
**URLs**: `/features/artifact-enforcement` · `/features/go-no-go` · `/features/audit-trail`
**Version**: 1.1
**Date**: 2026-05-29
**Status**: Proposal for review — section look/feel, motion, and interactivity. **Copy is indicative working text, not final.**
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md (three `/features/*` entries)
**Design references**: Cloudflare (light-first, orange-as-architecture) · Linear (card discipline, UI as brand argument) · Stripe (screenshot as argument, technical precision)
**Feature mechanics source**: docs/development/features/must-have/artifact-gated-spec-execution.md · run-execution-ui.md · go-no-go-decision-gate.md · run-immutability.md · run-history-audit-trail.md

---

## This directory

The design docs mirror the sitemap's URL structure. Each `/features/*` page has its own spec file; this overview holds everything shared across the set so it isn't duplicated three times.

| URL | Spec file |
|---|---|
| `/features/artifact-enforcement` | [artifact-enforcement.md](artifact-enforcement.md) |
| `/features/go-no-go` | [go-no-go.md](go-no-go.md) |
| `/features/audit-trail` | [audit-trail.md](audit-trail.md) |

Read this overview first, then the individual page spec. Each page spec assumes the global treatments and shared archetype defined here and only records its own sections and deviations.

---

## How to read these documents

This is a **section-by-section design spec** for three pages that share one archetype. It does not finalize marketing copy — bracketed lines like *[working: "…"]* are placeholders that communicate intent and length, to be replaced when the copy deck is written. The same convention used in homepage.md applies here.

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

**Locked decisions for this set:**

- **Shared archetype**: declarative DM Sans 700 hero statement over a large faithful product-UI crop, then 3–5 explanatory bands beneath. The screenshot is the argument; the copy annotates it. Per Phase 12 of website-vision.md — this is law, not a choice.
- **Hero fragments per page**: Artifact Enforcement → blocked Pass button + six-type requirement panel; Go/No-Go → decision screen with severity-sorted spec list + Go/No-Go action + justification field; Audit Trail → sealed read-only record with inline artifacts + lock badge that does NOT animate.
- **Audit Trail conversion goal is different**: primary CTA is "Talk to us," secondary is "Start free." The other two are "Start free" only. This is the sitemap's explicit instruction and reflects the compliance-buyer persona.
- **Audit Trail print treatment**: the print-to-PDF layout is shown as a "certified document" in Geist Mono. This is the Phase 12 compliance-formal treatment.
- **Artifact Enforcement bento**: the one permitted bento moment (Phase 9) is used for the six-type grid on this page only. The other two pages do not use bento.
- **Sealed badge is static**: the lock badge on the Audit Trail hero never animates. Phase 6 is explicit: "sealed things don't move."
- **Honesty rule**: post-launch items (dedicated audit-grade PDF/JSON export; Scale's compliance-operations layer) are never presented as current features. The launch audit capability is browser print-to-PDF of the sealed record plus the shareable URL.
- **No fabricated logos, stats, or testimonials** — none of these pages have real customer proof yet. Testimonial/quote slots are reserved with placeholder borders only.

---

## Design DNA — the shared archetype

These three pages are a set. A visitor who moves from `/features/artifact-enforcement` to `/features/go-no-go` to `/features/audit-trail` should feel like they are reading chapters of the same technical argument, not separate marketing pages.

The archetype (Phase 12): **a declarative hero statement in DM Sans 700, over a large faithful product-UI crop of the mechanic, then 3–5 explanatory bands beneath.** The screenshot is the argument. The copy annotates it.

The Stripe influence is strongest here: a single large product screenshot, treated as the primary brand asset, with copy that explains what the visitor is looking at rather than performing enthusiasm about it. The visitor should be able to understand the mechanic from the screenshot alone; the copy is there to be precise, not to persuade.

The three pages are differentiated by their hero fragment — each one is the single most important visual element on that page — and by the compliance register of the Audit Trail, which leans more formal than the other two.

---

## Global treatments (specified once — applies to all three pages)

All items from homepage.md §"Global treatments" apply verbatim. Recorded here only what is not in that block or what is specific to the feature-page context.

- **Theme**: light-first (`--bg-page #FAFAFA`), dark co-equal (`#111110`). `prefers-color-scheme` default, feature-031 override.
- **Section rhythm**: 120–160px vertical padding desktop. Sections are rooms.
- **Section entrance motion**: `opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`. Once on scroll-into-view. Every section.
- **Section label pills**: all-caps Inter 500 13px. Light: Orange-600 text, `rgba(234,107,4,0.10)` bg, `rgba(234,107,4,0.20)` border. Dark: Orange-500 text, `rgba(249,115,22,0.10)` bg.
- **Cards**: solid recipe. Light: `#FFFFFF`, `1px solid rgba(0,0,0,0.08)`, shadow-1. Dark: `#1E1D1B`, `1px solid rgba(255,255,255,0.09)`, inset top highlight, shadow-1. Card hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`.
- **Typography**: DM Sans 700 hero statement (display scale, 74px / -0.04em); DM Sans 600 section H2 (36px / -0.025em); Inter body/labels/buttons; Geist Mono product data.
- **Orange discipline**: max two orange elements per viewport. CTAs `#EA6B04` light / `#F97316` dark. Inline links `#9A3F05` light. Never orange as a section background beyond a ≤10% tint.
- **Screenshot treatment (light)**: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`. No glow.
- **Closing CTA**: every page ends with the shared "Ship it once." final-CTA section (same structure as homepage §11, adapted for the page's conversion goal).
- **Footer**: always-dark `#111110`, hairline top border, logo white variant, "Ship it once." tagline. Dark on both themes.
- **Sticky navigation (§0 on every page)**: see homepage.md §0 — identical treatment. The only per-page difference is the current-page indicator: the "Features" nav item shows the Orange-600 active state, and the page's own item within the Features dropdown shows the active state.
- **`prefers-reduced-motion`**: disables all animation. Content renders in final state immediately.
- **Internal linking discipline**: every feature page links to `/how-it-works`, `/pricing`, at least one `/use-cases/*` page, and the other two feature pages. Distributed across sections, not dumped in the footer.

---

## SEO discipline — shared rules

Each feature page has a distinct intent cluster (recorded in that page's own spec file) and must be treated as a standalone SEO asset, not a duplicate. The rules below apply across all three pages:

- One `<h1>` per page (the pillar headline). All other section headings `<h2>`. Subpoints `<h3>`. No skipped levels.
- `<section aria-labelledby>` for every content band; `<main>` wraps the content below nav.
- All product-UI labels (artifact type names, badge states, button labels, field names) rendered as real DOM text overlaid on the browser chrome or within a faithful HTML component — never baked into a raster image. This keeps the mechanic claims indexable.
- LCP target: the hero headline (DM Sans 700, `font-display: swap`, woff2 preloaded). Hero UI fragment loads progressively so type paints first. Below-fold UI fragments `loading="lazy"`, explicit `width/height`.
- OG image: the hero fragment for each page (blocked pass button / go/no-go decision screen / sealed record), cropped to 1200×630.
- Each page carries `SoftwareApplication` + `ItemPage` JSON-LD and a `BreadcrumbList` (Home → Features → [page]).

---

## Cross-page navigation

### Between the three feature pages

Each feature page links to the other two. The placement of these links:
- Artifact Enforcement → links to `/features/go-no-go` at the close of Section 4 ("What gets locked") — *"See the go/no-go gate →"*
- Artifact Enforcement → links to `/features/audit-trail` at the close of Section 4 — *"Explore the audit trail →"*
- Go/No-Go → links to `/features/artifact-enforcement` in the hero sub-paragraph (the triad is established)
- Go/No-Go → links to `/features/audit-trail` at the close of Section 5 — *"Explore the Audit Trail →"*
- Audit Trail → links to `/features/artifact-enforcement` in the hero sub-paragraph
- Audit Trail → links to `/features/go-no-go` at Section 3 close — *"See how the run is sealed →"*

These cross-links form a triangle, distributing PageRank and giving visitors a complete picture of the three pillars without requiring them to return to the homepage.

### To deeper content

- All three pages link to `/how-it-works` (the process walkthrough) and `/pricing` (the tier answer)
- Artifact Enforcement links to `/use-cases/qa-teams` (primary persona)
- Go/No-Go links to `/use-cases/engineering-managers` (primary persona)
- Audit Trail links to `/use-cases/compliance` (primary persona) and `/contact` (primary conversion)
- Audit Trail links to `/platform` (honesty note — the export roadmap)

### From the homepage

The homepage's "Three guarantees" section (§4) carries the link triangle into all three feature pages via the card trailing links. The homepage is the primary entry point into the feature set; the feature pages deepen the claims already introduced on the homepage.

---

## Interaction & Animation — set-level summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Section entrance (all sections) | fade + rise 24px | 400ms `--ease-page` | once on view | Every section |
| Hero fragment (all three pages) | slide up 24px + fade | 700ms `--ease-page` | once | After CTA row |
| Six-type bento tiles (AE §2) | stagger-reveal, rise 20px | 0–400ms chain | once | Top row then bottom row |
| Three-step connector (AE §3) | draw top→bottom | 400ms `--ease-out` | once | After steps settle |
| Numbered callout circles (GNG §2, AT §2) | scale 0.5→1.0 `--ease-spring` | stagger 80ms | once | After fragment fades in |
| Typed Geist Mono callout (AT §3) | React Bits `TextType` — character-by-character, `loop=false`, `startOnVisible` | ~400ms/line | once, no idle caret | Immutability cards; ported like `Magnet.tsx`; reduced-motion → static text |
| Honest-numbers count-up (AE §5) | 0→N | 600ms `--ease-out` | once | Reduced-motion: final value |
| Lock icon (AT hero + AT §2) | **none** | — | never | Phase 6: sealed things don't move |
| Sealed badge (AT hero + AT §5) | **none** | — | never | Phase 6 |
| Card hover | lift −4px + shadow | 200ms `--ease-out` | per hover | All card sections |
| CTA hover | bg-color shift + 1px border | 150ms | per hover | No scale |
| Section label pill | static | — | — | No entrance animation needed |

All motion suppressed under `prefers-reduced-motion`. No exceptions.

---

## Responsive behavior summary

**≥1040px**: Full layouts as specified. Side-by-side two-column layouts. 2×3 bento for artifact types.

**768–1039px**:
- Bento (AE §2): 3×2 grid (three rows of two tiles).
- Two-column sections: relax to a stack (text above, fragment below) with generous vertical spacing.
- Three-step sequence (AE §3): stack vertically, connector draws downward.
- Decision screen hero fragment: scale down to 100% content width with side padding.

**<768px**:
- All bento and multi-column layouts: single column.
- Hero fragments: scale down to content width; the blocked Pass button must remain legible at mobile scale — minimum 44×44px touch target even in its disabled state.
- Three-step connector: hide (redundant at mobile scale — the stacked order communicates sequence).
- Callout annotations: hidden on mobile (the fragment is too small to annotate legibly); left-column descriptive text carries the argument alone.

**<576px**:
- Hero headline: 46px (from 74px display) per the type scale.
- Browser chrome header dots: hidden; URL bar retains just the URL text.
- Print-preview fragment (AT §4): scale to content width; maintain the page-document visual character.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-29 | Initial proposal — three feature pages, shared archetype, full section-by-section spec. Sitemap order preserved for all three pages (one addition on Artifact Enforcement §5 noted). All mechanics grounded in feature spec files. Authored as a single `features.md`. |
| 1.1 | 2026-05-29 | Split into a `features/` directory mirroring the sitemap URL structure: one spec file per `/features/*` page, plus this shared overview (archetype, global treatments, cross-page navigation, motion + responsive summaries). No content changes to the page specs themselves. |
