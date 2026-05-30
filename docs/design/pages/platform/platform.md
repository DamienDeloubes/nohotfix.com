# Page: Platform — A Platform Anchored by the Gate

**Product**: NoHotfix
**URL**: `/platform`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. **Copy is indicative working text, not final.**
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md `/platform` entry
**Design references**: Cloudflare (light-first confidence, strategic narrative pages) · Linear (typographic restraint, UI as argument) · Stripe (precision copy, screenshot as trust)

---

## How to read this document

This is a section-by-section design spec. It does not finalize marketing copy — bracketed lines like *[working: "…"]* are placeholders that communicate intent and length. Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

**Locked decisions for this page:**

- **Page register**: credibility narrative, not a conversion funnel. This is the one place the forward-looking platform story is permitted. Low-pressure CTA cadence throughout.
- **Shipped vs. roadmap visual split**: shipped triad (§1) uses solid orange-accented cards and full product-UI treatment. Roadmap items (§3) use the Slate-register treatment defined in website-vision.md Phase 12 — explicitly muted, no orange, no live screenshots. This split is the page's primary visual argument: real things look real; future things look different.
- **The pyramid (§2) is the signature moment**: typographic and structural, built from hairline rules and DM Sans type on the warm-white ground. No illustrations, no gradient blobs — the restraint is the strength.
- **The guardrail (§4)**: a single typographic statement, not a card or a band. Minimal footprint; maximum conviction.
- **No fabricated logos, stats, or testimonials** — none exist yet. No placeholder "logos of integrations we'll build."
- **Roadmap items have no dates**: the spec is explicit. The future register communicates direction without commitment.

---

## Global treatments

All items from homepage.md §"Global treatments" and features/README.md §"Global treatments" apply verbatim. This section does not re-specify them. Page-specific deviations are called out explicitly within each section below.

Treatments that apply unchanged: theme (light-first `--bg-page #FAFAFA`, dark `#111110`), section rhythm (120–160px vertical padding), section entrance motion (`opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`, once), section label pills (all-caps Inter 500 13px, orange by default — deviation noted in §3 and §4), solid card recipe (both themes), DM Sans 700/600 headings, orange discipline (max two orange elements per viewport, never as section background beyond ≤10% tint), screenshot treatment (light: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, shadow-1), closing CTA structure, always-dark footer, sticky nav, `prefers-reduced-motion`.

---

## Page-specific character

This page sits at the intersection of two registers: the **concrete and shipped** (the triad, today) and the **directional and honest** (the roadmap, explicitly future). The design must hold both without letting them bleed into each other.

The shipped sections (§1, §2 partially) use the full-contrast, orange-touched treatment the site uses everywhere for real product. The roadmap section (§3) reads visually quieter — lower contrast, Slate palette, blueprint weight — so a visitor who reads the page top-to-bottom feels the weight shift the moment they cross into "not yet available" territory. They should never have to read the label pill to know they've left the present.

The page is also the most narrative-forward surface on the site. Unlike the feature pages, which demonstrate a specific mechanic, this page makes an **argument about direction**. The copy will do more work here. The design creates the space for that argument to breathe.

**Page-specific design decisions:**

- §1 (wedge today): compact three-card row, not a bento. This is a recap, not a showcase — full showcase is at `/features/*`. Cards are smaller than the homepage enforcement-triad cards and include a trailing link to the full feature page.
- §2 (thesis pyramid): full-width typographic moment, `--bg-section-alt` surface to give it its own room. The pyramid is structured with hairline SVG or CSS rules, not a raster image. It must be accessible as DOM text.
- §3 (roadmap): Slate-palette cards — muted, dashed border, no orange. Each card carries a Slate "On the roadmap · not yet available" pill (Slate-400 text, not Orange-600). No product screenshots inside the cards.
- §4 (guardrail): a narrow, centered typographic statement — no card border, no pill, no section background change. The quietest moment on the page.
- §5 (CTA): the shared closing rhythm with a minor adjustment — both primary and secondary CTAs are equal-weight here (not one dominant + one quiet), because the page serves two equal conversion paths: the Free user starting now and the enterprise buyer wanting a conversation.

---

## SEO intent cluster

- Primary intent: "release readiness platform," "QA platform for engineering teams," "release gate software," "NoHotfix roadmap"
- Single `<h1>`: the hero statement (§1 heading or page-level intro headline — see §1 layout note)
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Platform)
- Internal links to: `/features/artifact-enforcement`, `/features/go-no-go`, `/features/audit-trail`, `/how-it-works`, `/pricing`, `/contact`
- Crawlable claims: the pyramid text, the roadmap item descriptions, the guardrail statement — all live DOM text, never baked into images
- OG image: the pyramid section cropped to 1200×630 — a typographic, architectural image that signals "strategic" without showing a busy product screen

---

# Section-by-section specification

Order (top → bottom): **Nav → §1 Wedge today → §2 Thesis pyramid → §3 Where we're going → §4 The guardrail → §5 Final CTA → Footer.**

---

## 0 · Sticky navigation

See homepage.md §0 and features/README.md §"Sticky navigation" — identical treatment. Current-page indicator: "Platform" nav item shows Orange-600 active state (light mode) / Orange-500 (dark mode). No dropdown — Platform is a top-level flat link.

---

## §1 · The wedge today

**Purpose** — Establish immediately that NoHotfix is a real, shipped product with three concrete enforcement mechanics — not a roadmap story dressed as a product. This section is the trust anchor for everything that follows. A strategic buyer reading this page in due-diligence mode needs to know the core product is not vaporware before they care about the vision.

**Layout** — `--bg-page` (warm white). Section label pill + H1 page headline + one-paragraph intro, then a **horizontal three-card row** at `max-width: 1100px`. Desktop: three equal-width cards side-by-side. Tablet (768–1039px): same three-card row, cards compress. Mobile (<768px): single-column stack.

The H1 is the page's only `<h1>`. It is the editorial claim of the whole page: *[working: "A platform anchored by the gate."]*. The sub-paragraph delivers the supporting context in one breath: *[working: "The enforced release gate is the core. Every run is blocked by evidence, closed by a formal decision, and sealed into a permanent record. That is what is available today. Everything we add extends the same promise."]*

**What's shown** — Three compact cards. Each card:
- A small icon (24×24, 2px stroke, rounded — the product icon for that pillar, in the card's semantic accent color)
- An H3 card heading (Inter 600, 20px)
- One sentence body (Inter 400, 16px, `--text-secondary`)
- A trailing link at the bottom: *"See [pillar name] →"* → the corresponding `/features/*` page

Card 1 — **Artifact Enforcement**: icon accent `#EA6B04` (Orange-600 light / Orange-500 dark). *[working heading: "Artifact Enforcement"]*. *[working body: "The pass action is blocked until every required artifact is attached. Not warned. Blocked."]*. Link → `/features/artifact-enforcement`.

Card 2 — **Go/No-Go Gate**: icon accent `#007A4E` (Go-700 light / Go-500 dark). *[working heading: "Go/No-Go Decision Gate"]*. *[working body: "Only Admins make the call, only after all specs are terminal. The decision — and any justification — is permanent."]*. Link → `/features/go-no-go`.

Card 3 — **Immutable Record**: icon accent `#475569` (Slate-600 light / Slate-400 dark). *[working heading: "Immutable Run Record"]*. *[working body: "When the decision is made, the run is sealed. The record writes itself and cannot be altered."]*. Link → `/features/audit-trail`.

The three-accent pattern (Orange / Go-green / Slate) mirrors the homepage enforcement-triad cards (§4 in homepage.md) — a deliberate callback that makes this recap feel like a set the visitor already knows.

**Look & feel** — Standard solid card recipe: light `#FFFFFF`, `1px solid rgba(0,0,0,0.08)`, `border-radius: 16px`, shadow-1. Dark: `#1E1D1B`, `1px solid rgba(255,255,255,0.09)`, inset top highlight, shadow-1. Cards are compact: ~280px wide at max layout. Internal padding `24px`. The icon sits at the top-left of each card at `40px` top + `24px` left. The card heading and body are mid-card. The trailing link is pushed to the card bottom with `margin-top: auto` — it stays at the card base regardless of text length variance.

The section does not use a product screenshot. This is a recap, not a showcase — the screenshots live on the feature pages. The icon + one-sentence mechanic is enough.

**Motion** — Section entrance: pill + H1 + intro paragraph fade+rise at section scroll-in, standard 400ms `--ease-page`. Cards stagger-reveal: card 1 at 0ms, card 2 at 100ms, card 3 at 200ms — each rising 20px, fading in. Card hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`. Trailing link arrow nudges 4px right on hover, 150ms. Stagger fires once on scroll-into-view.

**Interactivity** — Whole card is a hover target; keyboard-focusable with orange focus ring. Trailing link carries the navigation intent — clicking anywhere on the card navigates to the feature page (avoid wrapping the entire card in an `<a>` for accessibility reasons; instead use a full-card click handler with the `<a>` as the canonical link for screen readers).

**SEO** — The H1 ("A platform anchored by the gate.") is the crawlable page claim. The three card headings and body sentences are live DOM text — "blocked," "Admin-only," "permanent," "sealed" are all indexable. Internal links to all three `/features/*` pages carry PageRank distribution from this strategic page.

---

## §2 · The thesis

**Purpose** — State the platform's strategic architecture: the gate is the permanent core; everything else grows from it, serving the same promise. This section makes the "expand from the wedge" logic visible without requiring the visitor to read the product-vision doc. The pyramid is the argument in graphic form.

**Layout** — `--bg-section-alt` (`#F4F4F5` light / `#161513` dark) — its own visual room, distinct from the warm-white sections around it. Section label pill + H2 + one-sentence framing, then the **pyramid visual** (the signature moment of the page), then a supporting paragraph below.

`max-width: 860px` for the text and pyramid, centered. The section has 140px vertical padding (at the top of the 120–160px range) — the extra air is the breathing room the pyramid needs to read as a composed statement, not a bullet list.

**What's shown** — The pyramid is rendered as **type and hairline rules on the section background** — no raster image, no illustration, no gradient blobs. It is a structural, typographic object built from:

1. **Apex** — A horizontal hairline (`1px solid rgba(0,0,0,0.12)` light / `rgba(255,255,255,0.10)` dark) spans the full pyramid width (~640px). Above it, centered, in small Inter 500 caps, 13px, `--text-muted`: *[working: "THE PROMISE"]*. On the hairline, or just below it, the apex phrase in DM Sans 700 / 36px / `-0.025em` tracking: *[working: "Ship it once."]*. This is the only display-weight type inside the pyramid.

2. **Three horizontal bands** — Each band is defined by two hairlines (top and bottom), creating a row. From top to bottom:

   - **Band A — Today (the wedge)**: `background: rgba(234,107,4,0.05)` (a barely perceptible warm tint — the shipped zone). Left-side label in Geist Mono 500 12px, `--text-muted`, `letter-spacing: +0.06em`: `TODAY`. Center content in Inter 500 16px, `--text-primary`: *[working: "Artifact gating · Go/No-Go gate · Run immutability"]*. Right-side quiet badge: `SHIPPED` in Go-700 text, Go-100 bg — the badge confirms this is real. The orange tint on Band A is the only orange in the pyramid; it is structural, not decorative — it marks the shipped zone.

   - **Band B — Next phase**: `background: transparent` (no tint — unshipped, no warm signal). Left-side label `NEXT` in Geist Mono 500 12px, `--text-muted`. Center content in Inter 400 15px, `--text-secondary` (one weight step lighter than Band A): *[working: "UAT sign-off · Jira integration · Release-level gating"]*. No badge on this band — the absence of a badge communicates the absence of shipping.

   - **Band C — Later**: `background: transparent`. Left-side label `LATER` in Geist Mono 500 12px, `Slate-400` — even more muted. Center content in Inter 400 14px, `Slate-500`: *[working: "Standing QA layer · Deeper ecosystem integrations"]*. Italic style. The lighter size, lighter color, and italic register create a clear perceptual hierarchy: Today > Next > Later, without a single word of explanation.

3. **Base label** — Below the bottom hairline, centered, in Inter 400 13px `--text-muted`: *[working: "Every addition serves the same promise — catch it before production does."]*

The pyramid width narrows toward the apex. This is achieved by constraining the apex hairline to a shorter width than the base band. On desktop: apex hairline ≈ 480px, Band A ≈ 560px, Band B ≈ 640px, Band C ≈ 720px (wider base = later, more expansive). The visual weight narrows upward to the point, concentrating on the tagline. This is done with `max-width` constraints per row, centered — no CSS `clip-path` or SVG triangles needed.

**Supporting paragraph below the pyramid** (outside the pyramid structure): *[working: "The gate is not a feature inside a platform — it is the platform's point. Breadth without it would just be another test tool. Every phase above is evaluated by one question: does this help teams catch it before production does? If the answer is no, it does not ship."]*

**Look & feel** — The `--bg-section-alt` surface isolates the pyramid visually. The pyramid itself is very quiet — hairlines at `rgba` opacity, type in the standard type scale, no decoration. The only visual accent is the Band A warm tint (`rgba(234,107,4,0.05)`) and the `SHIPPED` Go-green badge. Everything reads as deliberate architectural drawing, not a marketing graphic. This is the Cloudflare influence at its strongest: a confident structural diagram that earns its place by being precise, not beautiful.

**Motion** — Section entrance: H2 + framing sentence fade+rise, 400ms `--ease-page`. Then the pyramid reveals with a staggered band-by-band entrance: apex + Band A fade in at 0ms; Band B at 180ms; Band C at 360ms. Each band fades from `opacity: 0` → `1` only — no vertical rise (the pyramid is a structural composition; it should feel like it is being drawn, not floating in). Hairlines draw in from center outward (`width: 0 → full`, 300ms `--ease-out`) simultaneously with their band's fade. Supporting paragraph fades in after Band C settles (200ms delay). All fires once on scroll-into-view. Under `prefers-reduced-motion`: all layers render at final opacity immediately.

**Interactivity** — The pyramid is static. No hover states on bands. The `SHIPPED` badge does not animate. The apex "Ship it once." text is not a link — it is a statement. The supporting paragraph may carry an inline text link on "does this help teams catch it before production does?" → `/platform#guardrail` (anchor to §4), if the implementer wants the continuity; otherwise leave plain.

**SEO** — `<h2>` + the pyramid content is entirely live DOM text (Geist Mono labels, Inter band content, apex headline). The pyramid is not a raster image. Screen readers receive the full hierarchy as text. `aria-label` on the pyramid container: *"NoHotfix platform strategy pyramid: Ship it once at the apex; today's shipped wedge (artifact gating, go/no-go, run immutability); next-phase items (UAT, Jira, planned releases); later directional items."* `role="img"` on the container for accessibility grouping, with the `aria-label` carrying the full description.

---

## §3 · Where we're going

**Purpose** — Show the three next-phase capabilities with complete honesty: these are not available now, they are on the roadmap, and every description is in the future tense. The purpose of this section is strategic credibility — a VP Engineering or compliance buyer evaluating NoHotfix for a longer-term investment needs to know the direction before committing. The purpose is not to pre-sell or create expectation debt.

**The critical visual rule**: every element in this section must read as visually subordinate to §1 and §2. A visitor who scans the page should immediately perceive §3 as a different register — future, not present. This is achieved through five simultaneous signals: (1) Slate palette instead of orange, (2) dashed card border instead of solid, (3) no product screenshots inside the cards, (4) an explicit "On the roadmap · not yet available" pill on each card, (5) lighter type weights and `--text-secondary` body color.

**Layout** — `--bg-page` (warm white — back to the base surface, away from the section-alt of §2). Section label pill + H2 + one-sentence framing, then **three cards in a horizontal row** at `max-width: 1100px`. Same grid as §1 (three equal-width cards). The label pill for this section deviates from the orange default: it uses Slate-400 text (`#94A3B8`), `rgba(148,163,184,0.10)` bg, `rgba(148,163,184,0.20)` border. This is the first visible signal that the register has changed.

**What's shown (all three cards)** — Each card follows the same internal structure:

- At the top of the card, an "On the roadmap · not yet available" pill. Inter 500, 12px, 9999px radius, padding `2px 10px`. Color: Slate-400 text (`#94A3B8` dark / `#475569` light), `rgba(148,163,184,0.10)` bg, `rgba(148,163,184,0.20)` border.
- A small icon. 24×24, 2px stroke, rounded. Color: Slate-500 (`#64748B`) — neither orange nor semantic green. The icon is schematic (a dashed-outline or blueprint-weight feel — 1.5px stroke instead of the standard 2px, at Slate-500) to reinforce the "not yet real" register.
- H3 card heading: Inter 600, 20px, `--text-primary`.
- Two to three sentences of body copy: Inter 400, 16px, `--text-secondary`. Future tense throughout. No imperative constructions ("will," "you'll be able to," "teams can look forward to") — match the approved voice: mechanical description of what the feature does, stated as future fact.
- No trailing link. These cards do not navigate anywhere — there is no `/features/uat` page. If a link is ever needed, it points to `/contact` with a query parameter. For v1 launch: no link.

**Card border treatment** — The dashed border is the key structural signal. Light mode: `border: 1.5px dashed rgba(0,0,0,0.14)` (`--border-strong` value, but dashed). Dark mode: `border: 1.5px dashed rgba(255,255,255,0.12)`. No shadow. `border-radius: 16px`. Background: `--bg-card` (`#FFFFFF` light / `#1E1D1B` dark) — same card surface as shipped cards, the sole distinction is the border treatment and the palette. The lack of shadow flattens the card slightly relative to the §1 cards — another subordination signal.

Card A — **UAT sign-off**: *[working heading: "UAT sign-off, caught before production too"]*. *[working body: "Author user-acceptance tests inside NoHotfix and send a partner or client a link to walk them and sign off. The same evidence-backed model, extended to the people outside your team who accept the work."]*

Card B — **Jira integration**: *[working heading: "Verification on the ticket they already watch"]*. *[working body: "NoHotfix tests will attach to Jira issues as subtasks and reflect their status back into the ticket. Teams will see 'it was verified' where the work already lives — without weakening the enforcement underneath."]*

Card C — **Release-level gating**: *[working heading: "A release that can't ship until every run has cleared"]*. *[working body: "Group the runs a release depends on. The release can't be marked shipped until each attached run has completed its go/no-go. The same gate, one level up."]*

**Look & feel** — The three cards sit on warm white, slightly quieter than §1's cards (no shadow, dashed border, Slate icons, `--text-secondary` body). The overall impression: a blueprint row. They look like something being designed, not something you can buy. The contrast with §1 should be immediately perceptible on scan — no one should need to read the pill to know they've crossed into future territory.

**Motion** — Section entrance: pill + H2 + framing sentence fade+rise, 400ms `--ease-page`. Cards stagger at 0/100/200ms, rising 20px — the same mechanic as §1, but the reduced visual weight of the cards means the stagger reads as quieter. No hover lift (`translateY` hover is suppressed on these cards — future items don't invite interaction the way shipped items do). The "On the roadmap" pill does not animate on card entrance; it is visible from the moment the card renders. Under `prefers-reduced-motion`: cards render at final state immediately.

**Interactivity** — Cards have no hover lift. No click target on the card body. No trailing link (no destination page). The pill is not a link. The card is intentionally non-interactive — the absence of interactivity reinforces the "not yet" message. On focus (keyboard), the card receives the standard focus ring (orange `#EA6B04` light / `#F97316` dark, 2px offset 2px) for accessibility, but the focus ring is the only visual response.

**SEO** — `<h2>` for the section heading. Card headings are `<h3>`. All body copy is live DOM text. The "On the roadmap · not yet available" label is DOM text — it is the correct, honest signal for search engines too (no one will be misled by a crawled claim about a future feature, because the claim explicitly states future). Internal: no trailing links from cards. The section heading and body carry roadmap vocabulary that may surface on branded search. `aria-label` on each card includes the pill text to ensure screen readers receive the availability status.

---

## §4 · The guardrail

**Purpose** — State the strategic constraint that governs every future addition and permanently differentiates NoHotfix from generic test management suites. This is Positioning Principle 6 made public. It is the page's most important sentence.

**Layout** — `--bg-section-alt` (`#F4F4F5` light / `#161513` dark) — a surface shift that gives this statement its own room without requiring a card or heavy visual chrome. Centered, `max-width: 680px`. No section label pill. No H2. A single large quotation or statement in DM Sans 600, rendered at H2 scale (36px, `-0.025em` tracking). Then a short supporting sentence in Inter 400, 18px body-large, `--text-secondary`, below it. Then — only here — a quiet internal text link: *"See how the gate works →"* → `/how-it-works`.

Vertical padding: 120px top and bottom. The section is narrow and tall — the generous air makes the single statement feel considered, not compact.

**What's shown** — The statement, live text, no card border, no container box:

*[working statement in DM Sans 600: "Breadth must never blunt the wedge."]*

Supporting sentence in Inter 400 18px, `--text-secondary`, ~20px below: *[working: "Every addition to the platform must answer one question: does this help teams catch it before production does? If the answer is no, it does not ship. We are not building the next TestRail."]*

The statement is left-aligned within its column (not centered) — left-alignment reads as conviction, not decoration. The supporting sentence is also left-aligned. The column sits centered within the page.

**Look & feel** — The quietest section on the page by design. No card, no pill, no accent color, no icon. The DM Sans 600 statement in `--text-primary` at H2 scale lands with the same weight as a section heading, but without any of the scaffolding (pill, card, separator) that would frame it as a feature claim. It reads as a direct editorial statement — which is what it is. The supporting sentence in `--text-secondary` at body-large scale creates the immediate contrast in weight that signals "this is the elaboration, not the claim." No orange touches this section — the statement belongs to the Sentinel's register, not the CTA's.

**Motion** — Statement fades+rises 24px on scroll-into-view, 400ms `--ease-page`. Supporting sentence fades in 150ms after the statement (a brief, deliberate delay so they read as distinct thoughts). Text link fades in with the supporting sentence. Once only. Under `prefers-reduced-motion`: all renders at final state immediately.

**Interactivity** — No hover states on the statement text. The internal text link (`--text-link` / `#9A3F05` light, `#F97316` dark) shows standard underline-on-hover and Orange-700 color shift, 150ms. No card click target — this is a reading surface, not a navigation target.

**SEO** — No `<h2>` for this section (it is intentionally not a section with a heading — it is an interstitial editorial statement). The DM Sans statement may be wrapped in a `<p>` or `<blockquote>` (appropriate given its editorial nature). Crawlable text includes "breadth must never blunt the wedge" — a distinctive phrase that may rank for branded searches. Internal link to `/how-it-works` distributes link equity. `<section aria-label="Strategic guardrail">` wraps the content for landmark navigation without requiring a visible heading.

---

## §5 · Final CTA — "Ship it once."

**Purpose** — Close the page with the shared rhythm. Two equal-weight CTAs: "Start free" for the visitor ready to try the product today; "Talk to us" for the strategic or enterprise buyer who has been reading this page precisely because they want a conversation.

**Layout** — `--bg-page` (warm white). Centered, full-width. Standard closing section with the sanctioned warm radial: `background: radial-gradient(ellipse at 50% 0%, rgba(234,107,4,0.08) 0%, transparent 70%)` light / `rgba(249,115,22,0.10)` dark — the one permitted atmospheric touch (per homepage.md §11, the "sanctioned warm radial"). 120px vertical padding.

Top-to-bottom: closing tagline → display statement → sub-copy → **two equal-weight CTA buttons** → closing micro-line.

**What's shown** —

- Small closing tagline pill (not the standard section pill — this is the page's closing statement in Inter 500 13px, Slate-400 text, no orange): *[working: "THE PLATFORM"]*
- DM Sans 600 closing headline, 48px, H1 scale: *[working: "Ship it once."]*
- Inter 400 18px body-large, `--text-secondary`, `max-width: 480px`, centered: *[working: "The gate is available today. The platform is growing. Start with one seat and full enforcement — no credit card — or talk to us about your team's direction."]*
- Two CTA buttons, side-by-side at 440px combined width, centered:
  - **Primary**: "Start free" — `background: #EA6B04` (Orange-600 light / `#F97316` Orange-500 dark), white text, `border-radius: 10px`, `padding: 12px 24px`, Inter 500 16px. → `/signup`
  - **Secondary**: "Talk to us" — `background: transparent`, `border: 1.5px solid rgba(0,0,0,0.14)` (light) / `rgba(255,255,255,0.16)` (dark), `--text-primary` text, same padding and radius. → `/contact`

The two buttons have equal visual weight by design. On this page only, the secondary CTA is not subordinate — it is a co-equal path. The border on the secondary button achieves parity with the orange fill of the primary without requiring a second orange element. At mobile (<576px): stack vertically, primary above secondary.

- Closing micro-line below the buttons: Inter 400 14px, `--text-muted`: *[working: "Free forever for 1 seat. Full enforcement triad on every plan."]*

**Look & feel** — The warm radial is centered at the top of the section and fades to transparent by mid-section. The headline "Ship it once." sits within the radial's warmth — the only time orange-adjacent atmosphere touches type on this page. The two buttons read as a genuine choice, not a hard push toward one path. The closing micro-line delivers the objection-handler ("free forever," "no credit card implied") without interrupting the momentum of the CTAs.

**Motion** — Standard section entrance: tagline + headline fade+rise 24px, 400ms `--ease-page`. Sub-copy follows 150ms later. CTA buttons appear 100ms after sub-copy. Micro-line last, 100ms after buttons. Stagger creates a composed close, not a simultaneous dump. CTA hover (both): `background-color` shift (150ms), no scale. Under `prefers-reduced-motion`: all at final state immediately.

**Interactivity** — Primary CTA → `/signup`. Secondary CTA → `/contact`. Both are `<a>` elements (not `<button>`) — they navigate, they do not submit. Standard focus ring (orange, 2px offset). Closing micro-line is static text.

**SEO** — `<h2>` closing headline. CTAs are crawlable `<a>` links to `/signup` and `/contact`. The micro-line is indexable text confirming the free tier. This section carries no dedicated structured data — the page-level `SoftwareApplication` JSON-LD covers it.

---

## Storytelling flow

The page makes one argument in five beats:

**§1 (Wedge today)**: Here is what exists. It is real. It is available. Click through and verify. — *Anchors the page in the present; removes any doubt that this is a vaporware story.*

**§2 (Thesis pyramid)**: Here is why it exists and where it points. The gate is not a feature — it is the foundation. The platform grows around it, never away from it. — *Elevates the page from product catalog to strategic argument; the pyramid makes the architecture visible.*

**§3 (Where we're going)**: Here is what comes next — honestly labeled as future, never dressed as present. — *Serves the strategic buyer without misleading anyone; the visual subordination does the work the copy doesn't have to.*

**§4 (The guardrail)**: Here is the constraint that ensures we do not drift. — *The conviction statement that differentiates NoHotfix from every "we'll add that too" roadmap. It earns trust by closing a door.*

**§5 (Final CTA)**: Start now or talk to us — the choice is yours, the path is clear. — *Low-pressure close; two equal options for two distinct buyer modes.*

The emotional arc is: *credibility* (§1) → *conviction* (§2) → *honesty* (§3) → *discipline* (§4) → *invitation* (§5). A visitor who reads this page in full should leave with one thought: "These people know what they're building and they're not going to ruin it." That is the conversion mechanism for a strategic buyer — not urgency, not features, but trust in direction.

---

## Interaction & Animation — page-level summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Section entrance (all sections) | fade + rise 24px | 400ms `--ease-page` | once on view | Every section |
| §1 card stagger-reveal | rise 20px + fade | 0 / 100 / 200ms chain | once | Standard card stagger |
| §1 card hover | lift −4px + shadow | 200ms `--ease-out` | per hover | Shipped cards only |
| §1 trailing link arrow | nudge 4px right | 150ms | per hover | |
| §2 pyramid band reveal | fade only (no rise) | 0 / 180 / 360ms chain | once | Structural composition; rising would disturb the pyramid read |
| §2 hairlines | draw center-outward (`width: 0 → full`) | 300ms `--ease-out` | once | Simultaneous with band fade |
| §2 supporting paragraph | fade | 200ms after Band C | once | |
| §3 card stagger-reveal | rise 20px + fade | 0 / 100 / 200ms chain | once | Quieter visual weight than §1 |
| §3 card hover | **none** — no lift | — | — | Future items do not invite interaction |
| §4 statement | fade + rise 24px | 400ms `--ease-page` | once | Statement enters first |
| §4 supporting sentence | fade | 150ms after statement | once | Deliberate pause |
| §5 CTA entrance | fade + rise 24px (staggered) | 400ms + 100ms increments | once | Composed close |
| CTA hover (both buttons) | bg-color shift | 150ms | per hover | No scale |
| "SHIPPED" badge (§2) | **none** | — | — | Shipped things are facts, not performances |
| All motion | suppressed | — | — | `prefers-reduced-motion` |

---

## Responsive behavior summary

**≥1040px**: Full layouts as specified. Three-card rows in §1 and §3. Pyramid at full 720px base width. Two-column CTA buttons.

**768–1039px**:
- §1 and §3: three-card rows compress to ~220px cards. If wrapping occurs naturally, allow two-card + one-card wrap rather than forcing single-column — the pyramid section above should not force a layout break.
- §2 pyramid: base narrows proportionally (base ≈ 520px at tablet). Band labels (`TODAY`, `NEXT`, `LATER`) shift from left-side position to above each band if horizontal space is insufficient.
- §4: single column, left-aligned statement within centered column — unchanged.
- §5: CTA buttons stay side-by-side if viewport allows; stack if not.

**<768px**:
- §1: single-column card stack. Cards full content-width.
- §2 pyramid: base ≈ content width minus 32px margin. Hairlines span full band width. Band labels appear above each band as a one-line label. The apex headline "Ship it once." stays at H2 scale (36px).
- §3: single-column card stack.
- §4: unchanged — already single-column.
- §5: CTA buttons stack vertically (primary above secondary).

**<576px**:
- H1 (§1 page headline) scales to 36px (DM Sans 600 H2 scale).
- §2 pyramid bands simplify: `TODAY` / `NEXT` / `LATER` labels shown only; band center content may truncate to the first item if width is too narrow for the full list. The supporting paragraph below stays at body-base (16px).
- §4 statement scales to 30px (H3 scale) — still distinctive, not crowded.
- CTA button pair stacks, full width each.

---

## Cross-page navigation

**Internal links on this page:**
- §1 three card trailing links → `/features/artifact-enforcement`, `/features/go-no-go`, `/features/audit-trail`
- §2 supporting paragraph optional anchor → `/platform#guardrail` (intra-page)
- §4 internal text link → `/how-it-works`
- §5 primary CTA → `/signup`
- §5 secondary CTA → `/contact`

**Links to this page from elsewhere:**
- Sticky nav: "Platform" top-level link
- Homepage §"Platform thread" band → `/platform` (the one-line teaser on the homepage)
- Features README cross-page nav: Audit Trail page links to `/platform` (honesty note on the export roadmap)
- Footer: Product column includes "Platform"

**What this page does not link to:** `/pricing` is absent from the in-page links by design — this is a credibility narrative page, not a pricing page. The nav carries the Pricing link; adding it here would push the page toward a conversion funnel it is not. The visitor who wants pricing can find it via nav. The visitor who finishes reading this page gets the CTA (start free or talk to us) — those are the right exits.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal — five-section page spec (wedge today, thesis pyramid, roadmap, guardrail, CTA). Sitemap order preserved. Roadmap register (Slate palette, dashed border, no orange, future tense) fully specified per website-vision.md Phase 12 platform-page note. Pyramid treatment specified as typographic DOM structure (no raster image). |
