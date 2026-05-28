# NoHotfix.com — Website Design Vision

**Product**: NoHotfix
**Version**: 3.0
**Date**: 2026-05-28
**Scope**: Whole site. Phases 1–11 define the design system and the homepage; **Phase 12** extends the design direction to every other page in the sitemap.
**Source documents**: docs/design/brand-identity.md, docs/marketing/positioning.md, docs/marketing/messaging.md, docs/product-vision.md, docs/marketing/sitemap.md (rebuilt v1.0), docs/design/pages/homepage.md

---

## The Core Feeling

A visitor who lands on nohotfix.com should feel the same thing they feel when they first read the name: *this product means business.* Not aggressive, not alarming — precise. The site communicates that the people who built it have shipped software, dealt with the compliance call at midnight, and decided to fix the problem at the root rather than manage the symptoms.

The one-sentence brief for any designer working on this site: **"A tool that engineers trust to hold the gate should look like it holds the gate."**

---

## Phase 1: Aesthetic & Emotional Direction

### Three adjectives

- **Clinically confident** — the site makes claims without raising its voice. It states facts; it does not perform urgency. The quiet assurance of a surgeon who has done this a thousand times.
- **Structurally warm** — orange in a light context does not shout; it invites. The warmth is in the color and in plain-spoken copy, not in personality theatre.
- **Deliberately legible** — every element earns its place. Signal-to-noise discipline. Not "clean" (generic) but legible: the information architecture is as deliberate as a well-engineered API contract.

### Brand archetype: The Sentinel

Not a Sage (too passive) and not a Hero (too performative). NoHotfix is the Sentinel: the thing that stands at the gate, doesn't negotiate, and makes the record. The site embodies this — it doesn't seduce, it demonstrates. The product UI is the argument. The copy is the gate.

### Brand essence

> "Ship with the confidence that comes from a process that cannot be bypassed."

### What this site is NOT

- Alarming / "fire-everything-is-on-fire" alarmism — the orange and fire gradient are used with restraint; they express energy and warmth, not emergency
- Playful or startup-quirky — no illustrations, no mascots, no irreverent microcopy
- Enterprise-gray — the dark theme is premium, not corporate; orange keeps it alive
- A feature catalog — the site is an argument, not a menu
- A Cloudflare clone — we borrow its light/orange confidence, not its specific visual vocabulary

### Analogies

- If this site were a film: *Margin Call* — tense, precise, no wasted frames, orange light in a clean room
- If it were a material: poured concrete with a warm-aggregate finish — structural, honest, unmistakably intentional
- If it were a city: Zurich — ordered, precise, warmer than you expect, unambiguously reliable
- If it were a piece of software: the Linear issue tracker — fast, nothing decorative, every element earning its place

---

## Phase 2: Light + Dark — Two Equal Worlds

**The marketing site is light-first, with dark as an equally designed peer.**

Neither theme is an afterthought. OS `prefers-color-scheme` governs the default. The user preference toggle (feature 031) allows manual override. Both themes are fully specified.

### Light theme — the primary world

The light theme is the site's public face: every marketing page, pricing page, docs surface. It is the first impression for buyers.

**Surface character:** warm white, not clinical. Page background `#FAFAFA` — just warm enough that orange lands as an architectural detail, not a traffic cone. Cards are `#FFFFFF` on the warm-white ground, lifted by a 1px `rgba(0,0,0,0.08)` border and a soft shadow.

**Orange on light:** the interactive orange shifts from `#F97316` to `#EA6B04` (Orange-600) for CTAs, and to `#9A3F05` (Orange-800) for inline links — darker, more considered, clearly legible. Full-saturation `#F97316` is reserved for hero CTAs at large scale where the contrast ratio supports it. **`#F97316` must never appear as body-weight text or an inline link on a light surface — it fails AA.**

**Structure:** clean horizontal grid, generous vertical rhythm (120–160px section padding on desktop). Sections feel like distinct rooms. Dividers are hairline rules or whitespace, never heavy boxes.

**Elevation:** shadow + 1px border only. No `backdrop-filter` on cards. Glass belongs to nav, dropdowns, and modals only (glass model A — see brand-identity.md).

**Typography:** DM Sans 700 at hero scale — tight tracking, architectural weight. Inter at body scale — invisible in the best way.

**The light theme in one image:** the first frame of a Cloudflare product page, but warmer and more typographically bold.

### Dark theme — the peer world

The dark theme is the dashboard's natural home and the preference for many engineers evaluating the product.

**Surface character:** warm near-black. Page background `#111110` (Dark-900) — not the retired blue-violet `#0D0920`. The warm near-black allows orange to read as warmth rather than competing with a purple undertone. Cards are solid `#1E1D1B` with a mandatory inset top-edge highlight.

**Orange on dark:** `#F97316` (Orange-500) unchanged — ~7.2:1 on near-black, warm and clear. The fire glyph stays gradient in the logo.

**Elevation:** solid cards + shadow + mandatory inset highlight. No `backdrop-filter` on cards — glass applies to nav and overlays only.

**The dark theme in one image:** a precision instrument panel — calibrated, quiet, every element earning its place.

---

## Phase 3: Color Application Strategy

### How orange is deployed

Orange is a punctuation mark, not a background. The rule: **orange appears where the eye should go and where action should be taken — nowhere else.**

| Context | Treatment | Rationale |
|---|---|---|
| Primary CTA buttons | `Orange-600` fill (light) / `Orange-500` (dark), white text | The most important action on every page. If everything is orange, nothing is. |
| Inline text links | `Orange-800` (light, `#9A3F05`) / `Orange-500` (dark) | AA-compliant at body weight |
| Active nav link / current page | `Orange-600` (light) / `Orange-500` (dark) | Wayfinding signal |
| Focus rings | 2px `Orange-600` (light) / `Orange-500` (dark), offset 2px | Accessibility and brand coherence |
| Section label pills | `Orange-600` text, `rgba(234,107,4,0.10)` bg, `rgba(234,107,4,0.20)` border | Small accent treatment |
| Feature card links | `Orange-400` text, brightens on hover | Warm link color |
| Step icons | `Orange-400` — icon fill | Slightly dimmed from CTA orange |
| Comparison table — NoHotfix column | `rgba(234,107,4,0.06)` subtle column wash | Very subtle warm highlight |

### What keeps orange from feeling cheap

Three disciplines hold this together:

1. **Surface contrast:** On light surfaces, the architectural orange (`#EA6B04`) lands against warm white — the sympathy between the warm-white background and the orange creates cohesion rather than clash. On dark surfaces, full-saturation `#F97316` stands out sharply against the warm near-black.

2. **Restraint by volume:** At any given scroll position, orange touches no more than two elements simultaneously — typically the logo fire glyph and one CTA button. Never use orange as a section background or a large surface fill.

3. **No orange backgrounds:** Orange-500 is never used as a section background or large surface fill on either theme. The Growth pricing card uses `rgba(234,107,4,0.10)` — a warm tint, not a background wash.

### The fire gradient: logo only

The fire gradient (`#FF8D28 → #FF0000`) is the logo's exclusive signature. On the marketing site, it appears nowhere else — no hero background accents, no section decorations, no feature callout icons. In a light-first world, a red-to-orange gradient splashed across a white page reads as alarming. The logo is where the fire lives; everywhere else, solid orange.

---

## Phase 4: Hero Concept

### Layout and atmosphere

The hero is full-viewport. A clean light page. The NoHotfix wordmark in the navigation — dark letterforms (`#111110`), fire glyph present in gradient. A large display headline in DM Sans 700 (tight tracking). A single CTA in the refined orange. No background illustration, no gradient overlay, no hero animation beyond a subtle entrance.

**Headline:** declarative, engineering-precise. Not a question, not a superlative promise.

> **"The release gate that holds."**

This is the hero headline for v5. It describes a mechanism, not a feeling. It is in the register of the brand's existing vocabulary ("the gate holds; that is the value").

**Dominant visual:** a product UI screenshot showing the go/no-go decision screen or an artifact-gated spec view, framed in a light-mode browser chrome or device frame with a subtle shadow. The screenshot is the argument — not an abstract diagram. Treatment: `border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`.

**Sub-headline** (below the headline):

Carry forward from the brand vocabulary — e.g.: "Your team can't mark a spec as passed without the evidence. The go/no-go decision is permanent. The record writes itself."

---

## Phase 5: Typography in Context

**DM Sans 700** for the hero display headline (74px, -0.04em tracking) and the main marketing H1 (48px, -0.03em tracking). DM Sans 600 for all section headings (H2, 36px, -0.025em tracking). Heavy + tight — architectural, not soft.

**Inter** for all sub-headlines, body, nav links, button labels, captions, and microcopy. Its neutrality is a feature.

**Geist Mono** for product preview content — run IDs, artifact captions, decision timestamps, the justification field. "Certified document" quality. When visitors see Geist Mono in the hero simulation, they read it as real product output, not a design mockup.

**The typographic hierarchy rule:** each section has one headline, one body level, and optionally one caption level. Never introduce a fourth size within a section. The restraint is the discipline.

---

## Phase 6: Motion Philosophy

**The brand motion tokens are the law.** Key principles for the website:

- **Section entrances:** `opacity 0 → 1` + `translateY(24px) → 0`, 400ms, `--ease-page` (`cubic-bezier(0.4, 0, 0.2, 1)`). Not slide-in from the side. Once only.
- **`--ease-premium`** (`cubic-bezier(0.6, 0.6, 0, 1)`) for dashboard-like interactive transitions — fast in, smooth deceleration.
- **CTA hover:** background-color shift + 1px border emphasis, 150ms. No scale. Buttons do not bounce.
- **Card hover (marketing):** `translateY(0) → translateY(-4px)` + shadow deepening, 200ms, `--ease-out`. Confident, not excitable.
- **Navigation scroll-transform:** transparent → light frosted (light mode) or near-black frosted (dark mode) at 40px scroll depth, 300ms transition. See nav recipe in brand-identity.md.
- **Dashboard state transitions:** `--ease-premium` curve. Fast in, smooth out.
- **`prefers-reduced-motion`:** disables all animation. No exceptions.

**The one-time fire glyph entrance:** When the page loads and the nav fades in, the fire glyph undergoes a single contained animation — the flame "kindles" from flat color to full gradient over 600ms (opacity/filter transition, not a path animation). After 600ms, static for the rest of the session. Fires once per page load, never repeats, never loops. This is the only moment the fire glyph moves.

**What does NOT animate:**
- The locked state badge on the immutable record card
- Comparison table competitor columns
- Navigation links (opacity on hover only, no motion)
- The fire glyph after its initial entrance

---

## Phase 7: Glass Model A — Application on the Marketing Site

Glass model A is the law: **nav and overlays only.** Cards are solid in both themes.

**Keep (glass survives here):**
- Nav on scroll — `backdrop-filter: blur(12px)`, theme-appropriate background (see nav recipe in brand-identity.md)
- Dropdown menus — `backdrop-filter: blur(20px)`, `rgba(255,255,255,0.08)` bg (works both themes)
- Modal/overlay surfaces

**Cards — both themes — are SOLID:**
- Light mode: `#FFFFFF` bg, 1px `rgba(0,0,0,0.08)` border, shadow (no backdrop-filter)
- Dark mode: `#1E1D1B` bg, 1px `rgba(255,255,255,0.09)` border, inset highlight, shadow (no backdrop-filter)

The product preview container (hero) may use the nav-level glass treatment as its outer frame, but the inner content surfaces must be solid.

---

## Phase 8: Product UI as Visual Hero

NoHotfix has no stock imagery, no abstract illustrations, no celebrity screenshots. **The product UI is the entire visual argument.**

The hero product preview is the centerpiece: a faithful representation of the enforcement mechanic. A visitor who reads "the pass action is blocked" and then *sees* the blocked button has experienced the product without signing up.

**Guidance for the product preview:**
- Use exact brand tokens from brand-identity.md — the correct badge colors, the correct disabled-button treatment
- The blocked pass button is the single most important pixel on the entire page — it must be instantly legible as "blocked," not "loading"
- Light-mode screenshot treatment applies inside the hero frame
- Geist Mono on all data fields, Inter on all labels
- In Progress badge: slate-colored (`#94A3B8` dark / `#475569` light) — blue is retired

**Beyond the hero:** every feature section should include a product UI fragment — a small but faithful crop of the relevant mechanic. These are evidence, not decoration.

---

## Phase 9: Section Rhythm and the "Slightly Minimal" Discipline

**Generous whitespace, never barren.** Sections have 120–160px vertical padding on desktop. Content within sections has breathing room. But sections are never empty — each carries a product moment, a UI fragment, or a data element.

**One visual hero per section.** The three guarantees section leads with three cards. The how it works section leads with the four-step stepper. Do not introduce competing visual focal points within a section.

**No decorative fills.** No gradient blobs, no abstract background patterns. The warm-white background is the texture — it does not need augmentation.

**Bento moments, sparingly.** One bento/card-cluster layout for the feature showcase is right. The whole site in bento becomes a template exercise.

---

## Phase 10: Across the Site — Shared Principles

**Navigation:** transparent at top, frosted glass on scroll (see nav recipe), always present. NoHotfix logo links to `/`. "Start free" in primary orange button (light: `#EA6B04`; dark: `#F97316`). Never changes. The nav CTA is always visible.

**Section labels:** small pill badges above section headings (e.g., "THE PROBLEM WITH CHECKLISTS"). Light mode: `Orange-600` text, `rgba(234,107,4,0.10)` bg, `rgba(234,107,4,0.20)` border. Dark mode: `Orange-500` text, `rgba(249,115,22,0.10)` bg. All-caps, Inter 500, 13px, letter-spacing +0.08em.

**Page-level CTA pattern:** every page ends with the same final CTA section — a "Ship it once." moment. Consistent closing rhythm across the site.

**Persona card accent colors:** QA Teams → Orange-500 accent. Engineering Managers → Go-500 green accent. Compliance Teams → Slate-400 accent.

**Comparison table NoHotfix column:** `rgba(234,107,4,0.06)` (light) / `rgba(249,115,22,0.06)` (dark) — very subtle warm wash.

**Footer:** flat dark surface (`#111110` / Dark-900), no gradient, no glass. Top border `1px solid rgba(255,255,255,0.06)`. NoHotfix logo in white (dark variant), tagline "Ship it once." below. On light-theme page at footer: footer remains dark — it is a deliberate ground-anchoring element.

---

## Phase 11: Imagery and Illustration Stance

Per brand identity: **no illustrations, no photography in the marketing site hero or feature sections.** The product UI is the imagery.

**If photography is ever added** (not recommended for v1): natural-light workspace environments, slightly warm-toned, high contrast, no stock-photo staging, no faces.

No:
- Isometric illustrations of software concepts
- Abstract gradient blobs or "vibe" art
- Character illustrations or metaphor imagery (no flames beyond the logo glyph)
- AI-generated imagery of any kind

---

## Phase 12: Per-Page Design Vision

Phases 1–11 are the law for every page. This phase says how each page *applies* them — its layout
archetype, which product-UI fragment carries the argument, its section rhythm, and any page-specific
treatment. The homepage is fully specified in [pages/homepage.md](pages/homepage.md); content and IA
for every page live in [../marketing/sitemap.md](../marketing/sitemap.md). No page introduces a new
color, motion token, or component recipe — only the existing system.

**Shared across all pages** (do not re-specify per page): sticky glass-on-scroll nav (Phase 7,
Phase 10); section label pills (Phase 10); the closing "Ship it once." final-CTA section (Phase 10);
the always-dark footer (Phase 10); section entrances (Phase 6); 120–160px section padding (Phase 9);
one visual hero per section; product UI as the only imagery (Phase 8, Phase 11).

### How It Works

- **Archetype**: a single vertical spine — a six-step sequence read top to bottom, one step per
  band, alternating text-left / fragment-right (desktop) and stacked (mobile). A thin connector
  between bands carries the eye; it is structural, not decorative.
- **Product-UI fragments**: each step shows the real mechanic for that step — playbook editor (1),
  a spec with artifact requirements (2), the run snapshot (3), the **blocked pass action** (4, the
  page's single most important crop), the go/no-go decision screen (5), the sealed read-only record
  (6). Geist Mono on all data; Inter on labels; light-mode screenshot treatment from Phase 4.
- **Rhythm**: the six steps are the whole page — resist adding feature-grid or comparison detours.
  Step 4 (blocked) and step 6 (sealed) are the two moments that should feel heaviest.
- **Page-specific**: the sealed-record fragment in step 6 has no idle animation (Phase 6 — sealed
  things don't move).

### Platform

- **Archetype**: a confident narrative page, not a conversion funnel. Three movements: *the wedge
  today* (three solid cards in the standard recipe) → *the thesis* (a typographic, full-width
  moment built from the product-vision pyramid) → *where we're going* (roadmap).
- **The thesis moment**: render the "expand from the wedge" pyramid as type and hairline rules on
  the warm-white ground — no gradient blobs, no illustration. This is the one place the platform
  story is allowed to be expansive; keep it typographic and quiet (Phase 9 discipline).
- **Roadmap treatment — the critical rule**: the "Where we're going" items must read as *future*
  and be visually subordinate to the shipped wedge above them:
  - Use the **Slate** neutral family, not orange. No orange CTA, no orange accent, no fire anywhere
    near roadmap cards (orange marks shipped, actionable things — Phase 3).
  - Each card carries a small Slate "On the roadmap · not yet available" pill (the section-label
    pill recipe from Phase 10, recolored to Slate-400 — `rgba(148,163,184,…)`).
  - **No live product screenshots** for roadmap items — a wireframe-weight line sketch or an icon at
    most. Shipped features get real UI; unshipped ones never do. This is what keeps the page honest.
  - Lower contrast, lighter weight, more whitespace than the wedge cards. The eye should land on
    "today" first and read "next" as clearly secondary.
- **Rhythm**: wedge cards solid and full-contrast; thesis airy; roadmap muted. The guardrail
  statement is a single quiet typographic line, not a card.

### Features — Artifact Enforcement / Go/No-Go / Audit Trail

These three share one archetype so they feel like a set:

- **Archetype**: a declarative hero statement (the pillar headline in DM Sans 700) over a large,
  faithful product-UI crop of the mechanic, then 3–5 explanatory bands beneath. The screenshot is
  the argument; the copy annotates it.
- **Per page, the hero fragment**:
  - *Artifact Enforcement* → the blocked pass action + the six-type requirement panel. The disabled
    button must read instantly as "blocked," not "loading" (Phase 8).
  - *Go/No-Go* → the decision screen: spec list sorted by severity, the Go / No-Go action, the
    justification field. Status badges in their exact semantic colors (Go-500, NoGo-500 yellow,
    Error-500 crimson, Slate In-Progress).
  - *Audit Trail* → the sealed read-only record with inline artifacts; a "sealed" lock state badge
    that does **not** animate (Phase 6).
- **Page-specific**: Artifact Enforcement may use the one allowed bento moment (Phase 9) for the
  six-type grid. Audit Trail leans slightly more compliance-formal — show the print-to-PDF layout as
  a "certified document" in Geist Mono.

### Use Cases — QA Teams / Compliance / Engineering Managers

These three share one archetype, differentiated only by persona accent (Phase 10):

- **Archetype**: pain-first. Open with a tight list of the persona's real pains, then matched
  pairs (pain → the mechanic that resolves it), then one supporting product fragment, a reserved
  testimonial slot, and the shared final CTA.
- **Persona accent** (the only color that varies between them — applied to the section pill, the
  matched-pair markers, and a top accent stripe on the lead card; never as a background):
  - QA Teams → **Orange-500**
  - Engineering Managers → **Go-500** green
  - Compliance Teams → **Slate-400**
- **Product-UI fragment per page**: QA Teams → the spec library + enforcement; Engineering Managers
  → the go/no-go screen + the team dashboard of active runs; Compliance → the sealed record + the
  print-to-PDF document.
- **Page-specific**: the testimonial slot renders as a quiet bordered card (standard recipe) with
  placeholder text until a real quote exists — never a fabricated quote, never a stock face
  (Phase 11).

### Pricing

- **Archetype**: a section headline ("The enforcement triad is free. Seats are what you pay for."),
  a four-tier table, an honest feature-gate matrix, then FAQ accordions.
- **Card treatment**: four solid cards (Free, Growth, Scale, Enterprise). **Growth** is the
  recommended tier — distinguished by a `rgba(234,107,4,0.10)` warm tint and a small orange "Most
  popular" pill, **not** an orange background (Phase 3, restraint by volume). Exactly one orange CTA
  is dominant on the page; the others are quieter secondary buttons.
- **Matrix**: reuse the comparison-table treatment (Phase 10) — a very subtle warm wash on the
  NoHotfix-relevant column; competitor-style "advisory" rows stay neutral. Be honest that the triad
  is on every tier.
- **Page-specific**: early-bird vs standard price shown together with standard anchored and early
  bird framed as the saving. FAQ accordions use the standard card border, no glass.

### About

- **Archetype**: a quiet, narrow, mostly-typographic page — the most text-forward surface on the
  site. Generous measure, DM Sans for the few headings, Inter for prose.
- **Imagery**: none, or — if ever — a single restrained natural-light workspace photo per Phase 11
  (not recommended for v1). No stock faces, no team grid with avatars unless real.
- **Page-specific**: the "internal-validation principle" gets a single emphasized typographic
  moment; everything else stays plain so that one line lands.

### Changelog

- **Archetype**: a reverse-chronological list. Each entry: a date in Geist Mono, a DM Sans 600
  title, Inter body. Hairline rules between entries; no cards needed.
- **Page-specific**: an optional small Go-500 / Slate dot to tag entry type (shipped / fixed) —
  the only color. A single-field subscribe input at the top or bottom (standard input recipe). Never
  ship this page empty.

### Blog

- **Archetype**: a post list (title, date, reading time, one-line description) on the warm-white
  ground; hairline separation, not heavy cards. Article pages: a single readable column, DM Sans
  headings, Inter body, Geist Mono for any code or product output.
- **Page-specific**: one contextual orange inline-CTA block per article (standard card, warm tint),
  never more — restraint by volume (Phase 3).

### Contact

- **Archetype**: a short, calm form on a narrow column. Minimal fields (name, work email, company,
  team size, one free-text field), standard input recipe, one orange submit button.
- **Page-specific**: a quiet "just want to try it? Start free — no call required" secondary path so
  the page never feels like a wall. No false-urgency copy or motion.

### Legal — Privacy & Terms

- **Archetype**: plain document layout — single narrow column, Inter body, clear heading hierarchy,
  generous line height. No marketing chrome beyond the shared nav and footer.
- **Page-specific**: these are not design showcases. Legibility and currency over styling.

---

## Reference Brands: What We're Borrowing (and From Where)

| Reference | Specific element we're referencing | What NOT to take |
|---|---|---|
| **Cloudflare** (cloudflare.com) | Light-first confidence; warm-white that makes orange feel architectural; generous whitespace; plain-spoken technical headlines; the equal light/dark philosophy | Their specific orange (`#F48120`); illustrated iconography style |
| **Linear** (linear.app) | Card discipline — nothing calls attention to itself; the sense that the UI is the brand argument; typographic precision | Very dark base as default; their product-category color coding |
| **Stripe** (stripe.com) | Screenshots as primary brand imagery; technical complexity without dumbing down; label copy precision | Gradient/color expressiveness (too playful for our governed register) |

What we are NOT referencing: Notion's light-and-airy consumer aesthetic, GitHub's gray utilitarian approach, or any SaaS that uses gradients as primary visual content. Todesktop is retired as a primary reference — the glass intensity it implied has been superseded by glass model A.

---

## Surprise Elements

**1. The blocked button, front and center.** The hero shows a product simulation where a button is *disabled*. The visitor's eye expects a CTA, finds a locked state instead, and the copy "The pass action is blocked. Not warned. Blocked." lands with precision. This is the single most memorable element on the site.

**2. The immutable record's silence.** The third tab of the hero simulation — the locked run record — has no idle animation. Everything dynamic is now still. This literalizes the product's value proposition: the record is sealed, and sealed things do not move.

**3. The 404 line.** "This page doesn't exist. It wasn't shipped." One moment of brand wit, earned because it is grounded in the product's logic. The only lightness in an otherwise precise voice.

---

## 30-Second Brief

> NoHotfix.com is a light-first, orange-accented marketing site for a B2B release governance tool. The default theme is clean warm-white — orange as an architectural detail the way Cloudflare uses it, not a shout. Dark mode is equally designed: warm near-black with orange reading as warm contrast, not fire-on-purple. The fire gradient in the logo kindles once on page load, settles, and is never repeated. Glass applies to nav and overlays only — cards are solid in both themes. The hero shows a declarative DM Sans 700 headline, "The release gate that holds.", and a faithful product screenshot showing the blocked pass button. Every section has one primary visual moment, generous whitespace, and copy that sounds like an engineer wrote it for engineers who are tired of advisory tools. The orange punctuates. The product does the talking.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-28 | Initial vision document — orange/dark system, replaces implied blue direction |
| 2.0 | 2026-05-28 | v5 rebrand — light-first + co-equal dark; DM Sans display; glass model A (nav/overlays only, solid cards); hero headline "The release gate that holds."; orange-on-white guidance; reference brands updated (Cloudflare/Linear/Stripe, retire todesktop); warm near-black replaces violet base |
| 3.0 | 2026-05-28 | Whole-site extension. Added Phase 12 — Per-Page Design Vision (archetype, product-UI fragment, rhythm, treatment) for every non-homepage page; defined the platform-page roadmap treatment (Slate, no orange, no live screenshots for unshipped items) to keep the hybrid framing honest; repointed source reference to the rebuilt sitemap v1.0 |
