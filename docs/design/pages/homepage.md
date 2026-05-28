# Homepage — Section Design Proposal

**Product**: NoHotfix
**URL**: `/`
**Version**: 3.0 (proposal)
**Date**: 2026-05-28
**Status**: Proposal for review — section look/feel, motion, and interactivity. **Copy is indicative working text, not final.**
**Brand law**: docs/design/brand-identity.md (v5.0), docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md (Homepage entry)
**Design references**: Scalora (premium SaaS motion, centered confidence, bento rhythm — flipped light) · Cloudflare (light-first, orange-as-architecture) · Linear (card discipline) · Stripe (screenshot-as-argument)

---

## How to read this document

This is a **section-by-section design spec** — what each section looks like, what product UI it shows, how it animates, and how the visitor interacts with it. It deliberately does **not** finalize marketing copy; bracketed lines like *[working: "…"]* are placeholders that communicate intent and length, to be replaced when copy is written. Six decisions are locked from review:

- **Hero direction**: *Centered + blocked button* (Variation A). Alternatives B/C/D are preserved in the appendix.
- **Trust/credibility band**: *Honest trust strip* — no fabricated logos, stats, or testimonials.
- **Trust-strip treatment**: the *honest-numbers band* (Scalora "by the numbers," made truthful). Conversion assurances stay in the hero micro-line to avoid duplication.
- **FAQ**: included on the homepage (objection-handling + `FAQPage` schema).
- **Who it's for**: *three* persona cards — QA Teams, Engineering Managers, Compliance.
- **Final-CTA warm radial**: approved as the single sanctioned atmospheric wash.

Each section is specified under a consistent set of headings: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

---

## Design DNA — borrowing from Scalora, honestly

Scalora's appeal is its *premium calm*: a centered hero with one confident idea, huge type, generous air, soft-elevated cards in a steady bento rhythm, and motion that reveals rather than performs. We take all of that — and flip its dark canvas to NoHotfix's light-first warm white.

| Borrow from Scalora | Flip / adapt | Reject (conflicts with NoHotfix law) |
|---|---|---|
| Centered hero, one idea, big display type | Dark canvas → warm-white `#FAFAFA`, orange as the single accent | Decorative gradient **glows/blobs** behind sections (brand forbids — Phase 9/11) |
| Scroll-reveal motion (fade + rise), staggered | DM Sans 700/600, tight tracking (heavier than Scalora's lighter type) | Fabricated **logo walls, growth stats, testimonials** (no customers yet — honesty rule) |
| Soft-elevated card bento rhythm | Glass model A: cards are **solid**; glass only on nav/overlays | A busy multi-product **"ecosystem"** grid (we have one product, one wedge) |
| "By the numbers" stat band | Re-cast as **honest product facts** (6 artifact types, 3-layer immutability, 0 bypasses) | Auto-playing video, parallax theatrics, mascot/illustration |
| FAQ accordion near the close | Used for objection handling + FAQ structured data | False-urgency banners, countdowns |

The governing principle stays NoHotfix's: **the product UI is the only imagery, orange touches no more than two elements per viewport, and the page is an argument, not a feature menu.** Scalora gives us the *poise and pacing*; the enforcement mechanic gives us the *substance*.

---

## Global treatments (specified once — not repeated per section)

These come from brand law and apply to every section below. Sections only note **deviations**.

- **Theme**: light-first (`--bg-page #FAFAFA`), dark as a co-equal peer (`#111110`); `prefers-color-scheme` sets default, feature-031 toggle overrides. No vertical page gradient in either theme — sections differentiate by surface + whitespace.
- **Section rhythm**: 120–160px vertical padding (desktop); each section is a "room." Alternating sections use `--bg-section-alt` (`#F4F4F5` light / `#161513` dark).
- **Section entrance motion**: `opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`; fires **once** on scroll-into-view. Governs every section unless noted.
- **Section label pill**: small all-caps Inter 500 13px pill above each section heading (orange text, faint orange tint bg + border). The recurring wayfinding accent.
- **Cards**: solid recipe both themes (white + 1px `rgba(0,0,0,0.08)` + shadow / `#1E1D1B` + inset highlight + shadow). Card hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`.
- **Headings**: DM Sans 700 display (hero only), DM Sans 600 for H2 section headings (36–48px, tight tracking). Body/labels/buttons in Inter. Product-data in Geist Mono.
- **Orange discipline**: CTAs `#EA6B04` (light) / `#F97316` (dark); inline links `#9A3F05` (light). Never orange as a background fill or section wash beyond a ≤10% tint.
- **Screenshot treatment (light)**: `1px solid rgba(0,0,0,0.08)`, `border-radius 12px`, soft two-layer shadow. No glow.
- **`prefers-reduced-motion`**: disables all motion described below, no exceptions — content renders in final state immediately.

---

## SEO discipline (called out because it's a stated goal)

The homepage is the site's strongest ranking surface for *"release checklist software," "pre-deployment checklist tool," "go/no-go release process," "release readiness."* SEO is a structural requirement, not a section:

- **One `<h1>`** — the hero headline, in live text (never baked into the screenshot). Every other section heading is an `<h2>`; sub-points are `<h3>`. Strict, linear hierarchy — no skipped levels.
- **Semantic landmarks**: `<header><nav>`, a single `<main>`, each section a `<section aria-labelledby>`, closing `<footer>`. The page is fully readable and navigable as a document with CSS disabled.
- **All claims are crawlable HTML text.** Product-UI previews render labels/values as real DOM text overlaid on the chrome (or as faithful HTML components), **not** as flat raster images with text inside. Where a true `<img>` is used, it carries descriptive `alt` (e.g. *"NoHotfix run screen with the Pass action blocked until a screenshot artifact is attached"*).
- **LCP target = the hero headline** (DM Sans, `font-display: swap`, preloaded woff2). The hero product preview is **not** the LCP element — it loads progressively so type paints first. Below-fold product images `loading="lazy"`, explicit `width/height` to prevent CLS.
- **Structured data**: `Organization` + `SoftwareApplication` (with `offers` reflecting the Free tier) in JSON-LD; `FAQPage` schema generated from the FAQ section; `BreadcrumbList` not needed at root.
- **Internal linking**: in-context links to `/how-it-works`, `/features/artifact-enforcement`, `/features/go-no-go`, `/features/audit-trail`, `/platform`, `/pricing` — distributed naturally across sections, not stuffed in the footer alone.
- **Meta**: title ≈ *"NoHotfix — the release gate that holds"*; description leads with the mechanic; OG image is the light-mode hero with the blocked-button crop. Canonical `/`.
- **Performance budget**: motion via transform/opacity only (GPU-friendly); no layout-thrashing scroll listeners (IntersectionObserver for reveals); auto-cycling timers pause when offscreen and on reduced-motion.

---

# Section-by-section specification

Order (top → bottom): **Nav → Hero → Trust strip → Pain hook → Enforcement triad → How it works → Comparison → Platform thread → Who it's for → Pricing → FAQ → Final CTA → Footer.**

This refines the currently-built order by (1) adding the honest **trust strip** directly under the hero (Scalora's social-proof slot, filled truthfully), (2) inserting the required **platform thread** band, and (3) adding a compact **FAQ** before the close for objection-handling + FAQ structured data.

---

## 0 · Sticky navigation

**Purpose** — Persistent wayfinding and an always-available "Start free."

**Layout** — Full-width `position: sticky; top: 0`. Left: logo wordmark. Center: How It Works · Features (dropdown) · Use Cases (dropdown) · Platform · Pricing · Changelog. Right: "Log in" text link + "Start free" orange button.

**Look & feel** — Transparent over the hero (0–39px scroll). At 40px it transforms to frosted glass (the only glass on the page besides dropdowns): light `rgba(250,250,250,0.90)` + blur(12px) + hairline bottom border; dark `rgba(17,17,16,0.85)` + blur(12px). The CTA never changes state or leaves.

**What's shown** — Fire-in-the-o wordmark. Dropdowns (Features, Use Cases) are glass overlays: each item an icon + label + one-line description.

**Motion** — On first paint the fire glyph **kindles once** (flat `#E05C00` → full gradient, 600ms `ease-out`), then never moves again. Scroll-transform is a 300ms `--ease-page` background/border transition. Dropdowns fade+rise 8px on open, 150ms.

**Interactivity** — Hover dropdowns open on intent (with a small close delay); links show an orange active state on the current page; below 957px the center nav collapses to a hamburger sheet; below 576px "Log in" moves into the sheet.

**SEO** — `<nav aria-label="Primary">` with real `<a>` links (crawlable internal-link equity to every key page). Logo links to `/` with `aria-label`.

---

## 1 · Hero — *Centered + blocked button* (chosen)

**Purpose** — In ~5 seconds: what NoHotfix is, why it matters, and what to do next. The single most important pixel on the site lives here: a **disabled Pass button**.

**Layout** — Centered single column, `min-height: 100vh`, content vertically centered with a slight upward bias. Top-to-bottom: section pill → display headline → sub-headline → CTA row → trust micro-line → **product preview** (the centerpiece, below the fold of the headline but mostly in view on a laptop).

**What's shown** — Below the copy, a browser-chrome-framed product preview (`max-width 960px`, `radius 28px`, light screenshot treatment, three traffic-light dots, a Geist-Mono fake URL `app.nohotfix.com/runs/…`). Inside, the **Execute Specs** screen with a spec row marked `FAILED`/artifact-required and, dead-center, the **Pass button rendered disabled with a lock glyph**. The disabled treatment must read instantly as *blocked*, not *loading* (`opacity ~0.45`, `cursor: not-allowed`, lock icon, no spinner). Status badges use exact v5 semantic colors; In Progress is slate.

**Look & feel** — Warm-white canvas, dark headline (`#111110`) carrying authority through DM Sans 700 weight + tight tracking (74px desktop / 46px mobile). Orange appears on exactly two things in this viewport: the logo glyph and the primary CTA. No background graphic, no glow, no gradient behind the type — the air is the texture. *[working headline: "The release gate that holds." · working sub: "Specs don't pass until the evidence does. The go/no-go call is permanent. The record writes itself."]*

**Motion** — A choreographed entrance, once: pill fades in (~600ms after load) → headline fades+rises (500ms) → sub-headline (150ms later) → CTA row fades+rises 12px → trust micro-line → product preview slides up from 24px + fades (700ms after CTAs). Dark mode *may* add a single amber shimmer sweep across the headline (fires once, never loops). The preview's three states (Execute → Go/No-Go → Sealed record) **auto-cycle every 6s** with a crossfade; the **Sealed-record state has no idle motion** (immutability is a fact, not a transition).

**Interactivity** — Tabbed control above the preview ("Execute specs · Go/No-Go · Immutable record") with an orange active underline; manual click overrides and pauses the auto-cycle. The disabled Pass button shows a tooltip on hover ("Attach the required screenshot to enable") — it teaches without being clickable. Below 768px the tabs collapse to indicator pills and the preview shows the Execute state only.

**SEO** — The only `<h1>` on the page, in live text. CTAs are real `<a href="/signup">` / `<a href="/how-it-works">`. The preview's spec name, badge, and "artifact required" labels are DOM text overlaid on the chrome so the enforcement claim is crawlable. Preview assets load after the headline paints (LCP protection).

> **Why A over the alternatives**: the centered layout is the most faithful Scalora homage while staying unmistakably NoHotfix; making the *blocked button* the hero's focal pixel turns the brand's strongest surprise element (Phase-level "the blocked button, front and center") into the first thing a visitor sees. Variations B/C/D are preserved in the appendix — B is the natural future move if we ever want more kinetic energy.

---

## 2 · Honest trust strip

**Purpose** — Scalora's immediately-after-hero credibility slot — filled with signals that are **true today**, never fabricated logos or metrics. Lowers risk perception before the argument begins.

**Layout** — A single low-height band on `--bg-section-alt`, full-width inside the content column: the **honest-numbers band** *(the Scalora "by the numbers" homage, made truthful)* — four stat cells in a row stating **product facts, not traction**: `6` artifact types · `3`-layer immutability · `0` ways to bypass the gate · `1` seat free, forever. Big DM Sans number, Inter caption beneath. Hairline dividers between cells.

> Decided over the alternative "signal row" (free tier / no credit card / full enforcement every plan): those conversion assurances already live in the **hero trust micro-line**, so the strip uses the numbers beat instead of repeating them.

**What's shown** — No third-party logos. No customer counts. Beneath the numbers, one quiet credibility line — *[working: "We run our own releases through NoHotfix before we ship them."]* — and optionally a factual compliance-posture line (e.g. *"Tamper-evident records suited to SOC2 / PCI-DSS evidence"*), phrased as fit, never as a held certification.

**Look & feel** — Quiet and confident. This band must feel like *fine print with good posture*, not a hype bar. Orange is absent here (it belongs to CTAs); icons are Slate, numbers are near-black.

**Motion** — Standard section entrance, then the numbers count up once on reveal (e.g. 0→6), 600ms `--ease-out`; reduced-motion shows the final value immediately. No marquee scroll (Scalora's marquee implies many logos we don't have).

**Interactivity** — Static. The compliance line may link to `/use-cases/compliance`.

**SEO** — `<section aria-labelledby>` with an offscreen-or-visible heading; the "we run our own releases" line is genuine, indexable differentiation copy. Internal link to compliance use-case.

---

## 3 · Pain hook — "the problem with checklists"

**Purpose** — The "yes, exactly that" recognition moment for a QA lead. Establishes the antagonist: advisory checklists.

**Layout** — Centered, `max-width ~760px`. A **before/after contrast pair**: left "the way it works now" card, right "NoHotfix" card, with a small "VS" pill on the dividing rule.

**What's shown** — Left: a flat, deliberately-uninspiring Notion-style checkbox list anyone can tick (caption: *anyone can tick this, no evidence required*). Right: the enforcement-state spec list with the blocked pass action and correct badge colors (caption: *the pass action is blocked — not warned, blocked*).

**Look & feel** — The "before" card is intentionally lower-energy: section-alt fill, no inset highlight, flat. The NoHotfix card uses the full solid-card recipe with lift — the visual hierarchy *is* the argument.

**Motion** — On scroll-into-view: left card enters from −20px X, right card from +20px X, both fade in (500ms `--ease-out`). A subtle one-time emphasis on the right card's lock icon; no looping.

**Interactivity** — Largely static; cards lift slightly on hover. Below 768px the pair stacks and "VS" becomes a horizontal divider.

**SEO** — `<h2>` naming the problem (keyword-relevant: *checklist*); the contrast captions are crawlable. No text-in-image.

---

## 4 · The enforcement triad — *the bento moment*

**Purpose** — The three core mechanics as concrete guarantees, not vague benefits. This is the page's **one permitted bento moment** (Phase 9).

**Layout** — On `--bg-section-alt`. Section heading + sub-heading, then **three equal cards** (max-width ~1100px). Scalora-style bento: cards may be unequal in internal density (each leads with a small live UI fragment) but sit on a steady grid.

**What's shown** — Card 1 **Artifact Enforcement**: lock icon + a disabled pass button fragment. Card 2 **Go/No-Go Gate**: flag icon (Go-green) + a decision-row fragment with Go/No-Go controls. Card 3 **Run Immutability**: shield-check (Slate) + a "SEALED / LOCKED" record fragment. Each card ends with a feature link to its `/features/*` page.

**Look & feel** — Solid cards, generous padding. Each card's accent follows persona/semantic color: Card 1 orange, Card 2 Go-green, Card 3 Slate — keeping orange volume in check across the trio.

**Motion** — Heading fades+rises; cards stagger-reveal at 0/100/200ms, each rising 20px (`--ease-page`). Card 1's lock has a faint one-time emphasis; Card 2's Go control a faint green pulse on reveal; **Card 3's LOCKED badge is static by design** — the literal "sealed things don't move." Hover lifts each card −4px.

**Interactivity** — Whole card is a hover target; the trailing link's arrow nudges right 4px on hover. Cards are keyboard-focusable with the orange focus ring.

**SEO** — `<h2>` + three `<h3>` card headings carrying the feature names (artifact enforcement, go/no-go, immutable audit trail) — strong internal anchors to the three `/features/*` pages.

---

## 5 · How it works (compressed)

**Purpose** — A 30-second mental model of the full loop, without leaving the homepage. Links deeper to `/how-it-works`.

**Layout** — Centered, `max-width ~900px`. A **4-step horizontal stepper** on desktop (Build a playbook → Declare the evidence → Execute & get blocked → Make the call & seal), connected by a thin connector line. Vertical timeline below 768px.

**What's shown** — Each step node: a step number, an Inter heading, one line of body, and a tiny product glyph/fragment. Step 3 (blocked) and step 4 (sealed) get marginally more visual weight — they're the payoff.

**Look & feel** — Light, airy, structural. Step icons in Orange-400 for steps 1–3, Go-green for step 4. The connector is a hairline, not decorative.

**Motion** — Nodes stagger-reveal (80ms apart); the connector line **draws left-to-right** (`width 0→100%`, 400ms `--ease-out`) after the nodes settle. Once only.

**Interactivity** — Each node is a link into the matching step on `/how-it-works`. A single "See the full walkthrough →" link closes the section.

**SEO** — Ordered structure communicates a process; consider `HowTo` structured data (optional). Internal links to `/how-it-works`.

---

## 6 · Comparison — "this isn't a checklist tool"

**Purpose** — Dismantle the "we already have Notion / TestRail / Jira" objection with a side-by-side capability table.

**Layout** — Centered table, `max-width ~900px`, in a bordered container. Columns: capability rows × {Notion-style checklist, generic test tool, **NoHotfix**}. The NoHotfix column carries a 3px orange top border and a `rgba(234,107,4,0.06)` warm column wash (the subtle comparison-table treatment from brand law).

**What's shown** — 5–6 rows of real, defensible capabilities (enforced evidence, blocked pass, Admin-only permanent decision, sealed record, audit export). Go-green filled check-circles for NoHotfix; muted crosses elsewhere. Competitor columns stay neutral and fair (no strawman).

**Look & feel** — Calm, factual, "the gate doesn't argue." The warm wash is the only color on the NoHotfix column besides the green checks.

**Motion** — Table fades in on reveal; NoHotfix-column checkmarks animate in with `--ease-spring`, staggered 60ms per row (once). Competitor columns do not animate.

**Interactivity** — Static. Rows may carry a tooltip linking the capability to its feature page.

**SEO** — A real HTML `<table>` with `<th scope>` — crawlable, accessible, and a natural home for comparison long-tail keywords. `<h2>` keyword: *checklist tool*.

---

## 7 · Platform thread (required by sitemap)

**Purpose** — Signal NoHotfix is *more than one gate* without competing with the enforcement hero. The single homepage surface for the platform stance.

**Layout** — A **one-line, low-weight band** (not a card, not a heading) between the comparison and pricing. Centered, quiet, on the default background.

**What's shown** — A single sentence + link. *[working: "Anchored by the gate. Built to grow around it — UAT sign-off, Jira, and release-level gating are next." → "See where we're going →"]*

**Look & feel** — Visually subordinate by design: Inter, muted text, Slate (not orange) — roadmap is *future*, and orange marks shipped/actionable. No screenshot, no icon row, no card.

**Motion** — Standard fade-in only. Nothing kinetic — this thread must not pull focus from the wedge.

**Interactivity** — The inline link to `/platform` is the only affordance.

**SEO** — One crawlable internal link to `/platform`; no unshipped features named as current capabilities anywhere else on the page.

---

## 8 · Who it's for

**Purpose** — Make each buyer feel directly addressed; route them to the matching use-case page.

**Layout** — Centered, `max-width ~1100px`. **Three** persona cards in a 3-up grid (QA Teams, Engineering Managers, Compliance), each with a top-edge accent stripe. The three-card rhythm intentionally echoes the enforcement triad and routes to all three `/use-cases/*` pages.

**What's shown** — Each card: persona name, 2–3 pain bullets in their language, the resolving mechanic, and a link to the use-case page. A small product fragment relevant to the persona (QA → spec library/enforcement; Eng Manager → go/no-go + active-runs dashboard; Compliance → sealed record).

**Look & feel** — Solid cards with a 60px top-edge gradient stripe in the **persona accent** (QA → Orange-500, Eng Managers → Go-green, Compliance → Slate). The accent stripe is the only place these colors appear as a fill, and it's a hairline.

**Motion** — Cards stagger-reveal 0/100/200ms, each rising 20px (600ms `--ease-page`); pain bullets stagger 80ms each within a card. Hover lift.

**Interactivity** — Whole card hover-lifts; CTA link arrow nudges; cards keyboard-focusable. Below 1040px the grid relaxes to 2-up + 1; below 768px stack vertically.

**SEO** — `<h3>` per persona carrying role keywords (QA teams, engineering managers, compliance); internal links to all three `/use-cases/*` pages.

---

## 9 · Pricing summary

**Purpose** — Remove the "how much?" barrier without sending the visitor to `/pricing`.

**Layout** — Centered, `max-width ~960px`, on `--bg-section-alt`. Three tier cards: Free · **Growth (recommended)** · Scale. A link to the full `/pricing` page.

**What's shown** — Each card: tier name, price (Free $0; Growth and Scale with early-bird shown as the saving against an anchored standard price), 3–4 included lines, one CTA. The enforcement triad is noted as present on **every** tier including Free.

**Look & feel** — Free and Scale use the standard solid card. **Growth** is distinguished by a `rgba(234,107,4,0.10)` warm tint + a small orange "Most popular" pill + a 3px orange top border — **not** an orange background (restraint by volume). Exactly one dominant orange CTA on the page lives on the Growth card.

**Motion** — Stagger-reveal 0/100/200ms; the Growth card scales subtly 0.97→1.0 on entrance. No looping glow.

**Interactivity** — CTAs link to signup (Free/Growth/Scale) ; a "Compare all plans →" link to `/pricing`. Below 768px stack vertically with **Growth first**.

**SEO** — `<h2>` with pricing keywords; prices in crawlable text; `Offer` data feeds the `SoftwareApplication` JSON-LD. Internal link to `/pricing`.

---

## 10 · FAQ (Scalora-borrow · objection handling · FAQ schema)

**Purpose** — Pre-empt the last objections ("is Free really free?", "can the gate be bypassed?", "what about my data?") and earn `FAQPage` rich results.

**Layout** — Centered, `max-width ~760px`. A clean **accordion** of 5–7 items, hairline dividers, no heavy cards (Scalora's progressive-disclosure pattern, NoHotfix's card discipline).

**What's shown** — Questions drawn from the real objection set: why Free is free (the invite gate), whether enforcement can be turned off (it can't), data/retention on downgrade, early-bird lock, security basics. Answers are short, plain, and link out where deeper pages exist (`/pricing`, `/use-cases/compliance`, `/docs`).

**Look & feel** — Quiet and legible. The expand chevron is the only moving affordance; an open row gets a faint left orange tick or hairline, nothing more.

**Motion** — Accordion expand/collapse on a height/opacity transition, ~250ms `--ease-page`; chevron rotates 180°. One row open at a time (configurable). Reduced-motion → instant toggle.

**Interactivity** — Click/keyboard-toggle rows (`button[aria-expanded]` + `aria-controls`). Fully operable without a mouse.

**SEO** — Real `<details>/<summary>` or ARIA-disclosure markup with crawlable Q&A text; emits `FAQPage` JSON-LD. High-value long-tail capture.

---

## 11 · Final CTA — "Ship it once."

**Purpose** — The conversion close; the shared site-wide closing rhythm.

**Layout** — Centered, full-width, ~120px top/bottom padding. Display headline, one line of sub-copy, the primary orange CTA (+ a quiet secondary "Talk to us" for the compliance/enterprise path).

**What's shown** — No product UI here — this is the exhale. *[working headline: "Ship it once." · sub: "Full enforcement on the free tier. No credit card."]*

**Look & feel** — The brand's one sanctioned atmospheric touch: a *barely-there* warm radial behind the content (`rgba(234,107,4,0.08)` light / `rgba(249,115,22,0.10)` dark, fading to transparent by 70%). This is the **only** place a soft warm wash is allowed, and it must read as warmth, not a glow blob — if it's noticeable as a shape, it's too strong.

**Motion** — Headline + CTA fade+rise on reveal (once). CTA hover: background shift + 1px border emphasis, 150ms, no scale.

**Interactivity** — Primary CTA → signup; secondary → `/contact`.

**SEO** — `<h2>` reinforcing the brand phrase; final crawlable internal links to signup and contact.

---

## 12 · Footer (always dark)

**Purpose** — Comprehensive wayfinding + ground-anchor; deliberately dark on both themes.

**Layout** — Flat `#111110` surface (dark even on the light page), hairline top border. Four link columns (Product · Use Cases · Company · Resources) per the sitemap, logo (white variant) + "Ship it once." tagline, theme toggle, legal links.

**Look & feel** — Quiet, structural, no gradient, no glass. The dark footer is a deliberate full-stop to the warm-white page.

**Motion** — None (footer doesn't animate). Theme toggle transitions per its own component.

**Interactivity** — Full link set; theme toggle (feature 031); links hover to full opacity.

**SEO** — `<footer>` with the complete internal-link graph (every key page reachable); `Organization` JSON-LD can anchor here.

---

# Appendix A — Hero variations considered

Captured so the decision is traceable and the alternates are reusable.

| | Concept | Strength | Why not (now) |
|---|---|---|---|
| **A ✅** | Centered + blocked-button crop | Most faithful Scalora homage; puts the brand's strongest surprise (the blocked button) first; lowest risk | — chosen |
| **B** | Rotating-word hero (animated word swap) | Highest kinetic "Scalora feel"; memorable | Looping motion sits in tension with the "clinical, things-don't-move" brand register; **strongest future option** if we want more energy |
| **C** | Split: copy left / live product right | Most product-forward; Stripe/Linear premium | Departs from Scalora's centered layout the user responded to; product competes with headline for the first beat |
| **D** | Interactive enforcement demo (click the disabled button) | Most memorable; teaches by interaction | Highest build effort/QA surface; better as a `/how-it-works` or feature-page centerpiece than the homepage's first paint |

**Recommendation if energy is wanted later**: keep A's layout and graft B's single rotating word into the sub-headline (not the H1), so the `<h1>` stays static for SEO/LCP while one word animates beneath it.

---

# Appendix B — Motion inventory (summary)

| Element | Motion | Timing | Loops? |
|---|---|---|---|
| Fire glyph (nav) | kindle flat→gradient | 600ms `ease-out` | once/load |
| Section entrance | fade + rise 24px | 400ms `--ease-page` | once on view |
| Hero choreography | staggered fade/rise | ~150–700ms chain | once/load |
| Hero preview tabs | crossfade auto-cycle | 6s/tab | loops (pauses offscreen / on click) |
| Sealed-record fragments | **none** | — | never |
| Card hover | lift −4px + shadow | 200ms `--ease-out` | per hover |
| Triad reveal | stagger 0/100/200ms | 600ms | once |
| Stepper connector | draw 0→100% width | 400ms `--ease-out` | once |
| Comparison checks | spring-in stagger 60ms | `--ease-spring` | once |
| Honest-numbers (if used) | count-up | 600ms | once |
| FAQ accordion | height/opacity + chevron | 250ms `--ease-page` | per toggle |
| Final-CTA warm radial | static wash (not animated) | — | — |

All of the above are suppressed under `prefers-reduced-motion`.

---

# Appendix C — Responsive behaviour (summary)

- **≥1040px**: full layouts as specified.
- **768–1039px**: hero preview to 100% width with side padding; multi-column sections relax to 2-up where natural.
- **<768px**: triad/persona/pricing cards stack single-column (Growth first in pricing); how-it-works → vertical timeline; hero tabs → indicator pills showing the Execute state; pain-hook pair stacks with horizontal "VS."
- **<576px**: hero headline 46px; "Log in" moves into the hamburger sheet; hero preview ~75% scale but the blocked Pass button stays legible.

---

# Resolved decisions (review round 1 — 2026-05-28)

1. **Trust strip treatment** → **honest-numbers band**. The signal-row assurances (free tier / no credit card / full enforcement every plan) already live in the hero trust micro-line; the strip uses the Scalora "by the numbers" beat instead, made truthful (product facts, not traction).
2. **FAQ on the homepage** → **included.** Worth the section for objection-handling and `FAQPage` rich results; complements (does not duplicate) the deeper FAQ on `/pricing`.
3. **Who it's for** → **three cards** (QA Teams · Engineering Managers · Compliance). Matches the three `/use-cases/*` pages and echoes the triad rhythm; relaxes to 2-up then single-column on smaller breakpoints.
4. **Final-CTA warm radial** → **approved** as the single sanctioned atmospheric wash, with the guardrail: if it reads as a discernible shape rather than ambient warmth, it's too strong.

No open questions remain for this round. Next step when ready: write the finalized copy per section and produce the product-UI preview assets (hero blocked-button state first).
