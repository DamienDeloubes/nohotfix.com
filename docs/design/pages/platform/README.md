# Platform Story Marketing Pages — Design Set Overview

**Product**: NoHotfix
**URLs**: `/platform` · `/how-it-works` · `/use-cases/qa-teams` · `/use-cases/compliance` · `/use-cases/engineering-managers`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. **Copy is indicative working text, not final.**
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0, especially Phase 12 — Per-Page Design Vision)
**Content/IA owner**: docs/marketing/sitemap.md (the `/platform`, `/how-it-works`, and three `/use-cases/*` entries)
**Design references**: Cloudflare (light-first, orange-as-architecture) · Linear (card discipline) · Stripe (screenshot-as-argument, technical precision)

---

## This directory

These are the **platform-story** marketing surfaces — the pages that explain *what NoHotfix is*, *how the loop works*, and *who it's for*. They sit alongside the already-specified [homepage](../homepage.md) and [feature pages](../features/README.md). The design docs mirror the sitemap's URL structure.

| URL | Spec file | Archetype |
|---|---|---|
| `/platform` | [platform.md](platform.md) | Narrative / two-register (shipped vs roadmap) |
| `/how-it-works` | [how-it-works.md](how-it-works.md) | Sequential six-step vertical spine |
| `/use-cases/qa-teams` | [use-cases/qa-teams.md](use-cases/qa-teams.md) | Persona / pain-first matched pairs |
| `/use-cases/compliance` | [use-cases/compliance.md](use-cases/compliance.md) | Persona / pain-first matched pairs (compliance-formal) |
| `/use-cases/engineering-managers` | [use-cases/engineering-managers.md](use-cases/engineering-managers.md) | Persona / pain-first matched pairs |

Read this overview first, then the individual page spec. Each page spec assumes the global treatments below and only records its own sections and deviations.

---

## How to read these documents

Each is a **section-by-section design spec**: what each section looks like, what product UI it shows, how it animates, how the visitor interacts. They deliberately do **not** finalize marketing copy — bracketed lines like *[working: "…"]* communicate intent and length, to be replaced when the copy deck is written (same convention as homepage.md / features/).

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

---

## Global treatments (inherited — not re-specified per page)

All items from [homepage.md §"Global treatments"](../homepage.md) and the [features set overview](../features/README.md) apply **verbatim** and are governed by `website-vision.md`. The page specs only note deviations. In brief:

- **Theme**: light-first (`--bg-page #FAFAFA`), dark co-equal (`#111110`). `prefers-color-scheme` default, feature-031 toggle override.
- **Section rhythm**: 120–160px vertical padding (desktop); each section is a "room"; alternating `--bg-section-alt` (`#F4F4F5` light / `#161513` dark).
- **Section entrance motion**: `opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`. Once on scroll-into-view.
- **Section label pills**: all-caps Inter 500 13px. Orange recipe by default; recolored to the page's accent where noted.
- **Cards**: solid recipe both themes (white + `1px rgba(0,0,0,0.08)` + shadow / `#1E1D1B` + inset highlight + shadow). Hover `translateY(-4px)` + shadow deepen, 200ms `--ease-out`.
- **Typography**: DM Sans 700 hero (74px / -0.04em), DM Sans 600 H2 (36px / -0.025em), Inter body/labels/buttons, Geist Mono product data.
- **Orange discipline**: max two orange elements per viewport. CTAs `#EA6B04` light / `#F97316` dark; inline links `#9A3F05` light. Never orange as a section background beyond a ≤10% tint. Orange marks **shipped, actionable** things only.
- **Screenshot treatment (light)**: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, soft two-layer shadow, no glow.
- **Sticky nav (§0)**: per homepage.md §0; the only per-page difference is the current-page active indicator.
- **Closing CTA**: every page ends with the shared "Ship it once." final-CTA section, adapted to the page's conversion goal.
- **Footer**: always-dark `#111110` on both themes.
- **`prefers-reduced-motion`**: disables all animation; content renders in final state immediately.

---

## The two shared archetypes in this set

This set is **not** a single archetype the way the three feature pages are. It contains two coherent sub-families plus one singular page.

### The persona archetype — the three `/use-cases/*` pages

A visitor moving qa-teams → compliance → engineering-managers should feel they are reading three chapters addressed to three readers, in one consistent grammar:

- **Pain-acknowledgment hero** in DM Sans 700 — speaks the persona's daily reality back to them; **no product screenshot in the hero** (the structural opposite of the feature pages; empathy first, mechanic second).
- **Matched pairs** as the page spine: each named pain (muted Slate, left) → the specific NoHotfix mechanic that resolves it (full-contrast, right), with a directional marker/connector between them.
- **One product-proof band** anchoring the persona's key mechanic (real UI, never invented).
- **A reserved testimonial slot** — bordered placeholder only; **no fabricated quotes, logos, or stats** (Phase 11 honesty rule).
- **Shared "Ship it once." final CTA**, adapted to the conversion goal.

The **only** color that varies between the three is the persona accent (Phase 10) — applied to the section pill, the matched-pair markers, and the testimonial top stripe, **never** as a background fill:

| Page | Persona | Accent | Register | Primary CTA |
|---|---|---|---|---|
| qa-teams | QA Lead (daily user) | **Orange-500** | Practical, hands-on, "stop chasing" | Start free |
| compliance | Compliance buyer | **Slate-400** | Formal, evidence-driven, audit-grade (leans on the audit-trail "certified document" treatment) | Talk to us / Start free |
| engineering-managers | VP Eng (buyer) | **Go-500** green | Governance, accountability, executive visibility | Start free / Talk to us |

### The sequence archetype — `/how-it-works`

A single linear narrative: a **left-anchored vertical progress spine** (1px rule with an orange fill + numbered nodes) that advances as the visitor scrolls, six step-bands alternating text/screenshot sides. Each step shows the real mechanic for that step. The two heaviest moments are **Step 4 (the blocked Pass action)** and **Step 6 (the sealed record)**. Per Phase 6, the sealed/locked treatment **does not animate** — "sealed things don't move." Step 6 breaks into a chrome-less "certified document" frame in Geist Mono.

### The narrative page — `/platform`

A two-register credibility page, **not** a conversion funnel:

1. **Shipped register** (§1 the wedge today, §2 the thesis) — full-contrast, orange-touched, real product cards + a typographic pyramid (the signature moment, built from CSS hairlines, not an image).
2. **Roadmap register** (§3 where we're going) — **visually subordinate Slate** treatment: dashed borders, no orange, no hover lift, **no live product screenshots**, and an explicit "On the roadmap · not yet available" pill on every card. This is what keeps the hybrid framing honest. §4 the guardrail is a single quiet typographic line; §5 closes with genuinely co-equal "Start free" / "Talk to us" CTAs.

---

## Honesty rules (apply across the whole set)

- **Orange = shipped + actionable. Slate = future.** Roadmap/post-launch items never get orange, never get a live product screenshot, and always carry a "not yet available" marker.
- **Post-launch items are never shown as current features**: audit-grade export (PDF / structured JSON) and Scale's compliance-operations layer (viewer role for auditors, retention controls, uptime SLA). The launch audit capability is **browser print-to-PDF of the sealed record + the shareable URL**.
- **No fabricated logos, stats, or testimonials** — none of these pages have real customer proof yet. Quote slots are reserved with placeholder borders only.
- **The product UI is the only imagery** — no illustrations, no stock photography, no gradient blobs (Phase 8 / Phase 11).
- **Roadmap vision surfaces on `/platform` only.** No other page in this set names unshipped work (UAT sign-off, Jira, release-level gating) as a current capability.

---

## Cross-page navigation

Internal linking is distributed across sections (not dumped in the footer), per the set discipline:

- **`/platform`** → all three `/features/*` pages (§1 wedge cards), `/how-it-works`, `/pricing`, `/contact`.
- **`/how-it-works`** → `/features/artifact-enforcement` (Steps 2/4), `/features/go-no-go` (Step 5), `/features/audit-trail` (Step 6), `/pricing`, and at least one `/use-cases/*` page.
- **`/use-cases/qa-teams`** → `/features/artifact-enforcement`, `/how-it-works`, `/pricing`.
- **`/use-cases/compliance`** → `/features/audit-trail`, `/how-it-works`, `/pricing`, `/contact`, `/platform` (the export-roadmap honesty note).
- **`/use-cases/engineering-managers`** → `/features/go-no-go`, `/how-it-works`, `/pricing`, `/contact`.

The use-case pages do **not** cross-link to each other (each speaks to one buyer; sending a QA lead to the compliance page dilutes the message). They route up to features and the loop, not sideways.

---

## SEO discipline (shared)

- One `<h1>` per page (the hero statement). All other section headings `<h2>`; subpoints `<h3>`. No skipped levels.
- `<section aria-labelledby>` per content band; `<main>` wraps content below nav.
- All product-UI labels (artifact types, badge states, button labels, field names) rendered as real DOM text — never baked into a raster image — so the mechanic claims stay indexable.
- LCP target: the hero headline (DM Sans 700, `font-display: swap`, woff2 preloaded). Below-fold UI fragments `loading="lazy"` with explicit `width/height`.
- Each page carries appropriate JSON-LD (`SoftwareApplication` + `ItemPage`/`HowTo` as fits) and a `BreadcrumbList`.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal — five platform-story page specs (`/platform`, `/how-it-works`, three `/use-cases/*`) authored against brand-identity.md v5.0 + website-vision.md v3.0 (Phase 12). Directory mirrors the sitemap URL structure; shared global treatments, persona/sequence/narrative archetypes, honesty rules, and cross-page navigation recorded here once. |
