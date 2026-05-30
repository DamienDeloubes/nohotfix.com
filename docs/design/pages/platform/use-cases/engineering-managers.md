# Page: Use Cases — For Engineering Managers — Design + Information Architecture

**Product**: NoHotfix
**URL**: `/use-cases/engineering-managers`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. Copy is indicative working text, not final.
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md (`/use-cases/engineering-managers` entry)
**Design references**: Cloudflare (light-first, orange-as-architecture) · Linear (card discipline, UI as brand argument) · Stripe (screenshot-as-argument, technical precision)

---

## How to read this document

This is a **section-by-section design spec** for the Engineering Managers use-case page. It does
not finalize marketing copy — bracketed lines like *[working: "…"]* are placeholders that
communicate intent and length, to be replaced when the copy deck is written.

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion ·
Interactivity · SEO**.

This page is one of three persona use-case pages (qa-teams · compliance · engineering-managers)
that **must feel like a coherent set**. The shared archetype for that set is documented here under
"Shared archetype." Global site treatments (sticky nav, footer, section label pills, section
entrance motion, card recipe, orange discipline, screenshot treatment, `prefers-reduced-motion`)
are specified once in features/README.md and homepage.md — they are not repeated here. Only
page-specific or archetype-level decisions are recorded below.

---

## Shared archetype — the three use-case pages

All three use-case pages (qa-teams, compliance, engineering-managers) share one structural model.
Record it here once; it applies identically to the companion pages.

**Hero = pain acknowledgment, not product screenshot.**
The hero opens with a DM Sans 700 statement that speaks the persona's reality back at them — not a
product screenshot. The feature pages open with a product crop; the use-case pages open with a
recognition moment. The visitor reads the hero headline and thinks "yes, that is exactly my
problem" before the product is shown. This is the IA inversion that separates use-case pages from
feature pages in the set.

**Core device = matched pairs.**
Each pain (before) is paired directly with the specific NoHotfix mechanic that resolves it (after).
This is the spine of every use-case page. The matched-pair layout is two columns at desktop
(≥1040px): left column pain label, right column mechanic. At tablet and below they stack (pain
above, mechanic below), separated by a hairline rule. The pairs are not bullet lists; each pair is
a discrete visual unit — a narrow card or a ruled row — so the correspondence is unmistakable.

**Product-proof band.**
After the matched pairs, one product-UI band anchors the page's primary mechanic in a faithful
UI fragment. This is the only place a product screenshot appears on these pages. It is not
decorative — it is the evidence that the mechanic described in the matched pairs is real and
operational.

**Reserved testimonial slot.**
Before the final CTA, a single card reserves space for a testimonial. At launch, the card renders
as a placeholder border with no text inside — no fabricated quote, no stock avatar, no invented
company name. The border is a signal to the development team and to the visitor (when real): this
space is intentional, not empty. See Phase 11 of website-vision.md: no photography, no fabricated
social proof.

**Shared closing CTA.**
Every use-case page ends with the same "Ship it once." final-CTA section, adapted only in the
button label and target where the conversion goal differs.

**Persona accent color.**
Per website-vision.md Phase 10: Engineering Managers accent color is **Go-500** (`#00CC80`). This
color is applied to:
- The section label pill on Section 1 (pain framing), replacing the default orange pill on that
  one section only. All other section pills use the standard orange.
- The left-column matched-pair "before" markers (a small filled circle, 8px, Go-500).
- A 3px top accent stripe on the testimonial placeholder card.
- Nowhere else. Never as a section background fill. Never as a CTA. This persona accent is a
  thread, not a theme.

---

## Global treatments — reference only

All of the following apply exactly as specified in features/README.md §"Global treatments" and
homepage.md §"Global treatments":

- Theme, section rhythm, section entrance motion, section label pills (orange, except the one
  Go-500 pill noted above), card recipe (solid, both themes), card hover, typography (DM Sans 700
  display / DM Sans 600 H2 / Inter body / Geist Mono product data), orange discipline (max two
  orange elements per viewport, CTAs only, no orange section fills), screenshot treatment (light:
  1px `rgba(0,0,0,0.08)`, `border-radius: 12px`, two-layer shadow), `prefers-reduced-motion`
  (disables all motion, final state rendered immediately).

Page-specific deviations are called out explicitly in each section below.

---

## SEO intent cluster

- Primary intent: "engineering manager release process," "go/no-go release decision tool," "release
  governance software," "VP engineering release readiness"
- Secondary intent: "release accountability," "release sign-off process," "team QA visibility"
- Single `<h1>`: the hero pain-acknowledgment headline (Section 1)
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList`
  (Home → Use Cases → For Engineering Managers)
- Internal links to: `/features/go-no-go` (primary mechanic), `/how-it-works`, `/pricing`,
  `/contact`
- Crawlable claims: "Admin-only," "mandatory justification," "sealed," "permanent record," "role
  gate" in live DOM text
- OG image: the go/no-go decision screen fragment from Section 3, cropped to 1200×630, light mode
- Meta title: *"NoHotfix for Engineering Managers — the release decision, on the record"*
- Meta description: *"The go/no-go call is formal, Admin-only, and permanently recorded. Know your
  release is ready before you ship — and prove it if anyone ever asks."*

---

## Section 0 · Sticky navigation

See homepage.md §0 and features/README.md §"Sticky navigation." No deviation. Current-page
indicator: "Use Cases" nav item shows the Orange-600 active state; the "For Engineering Managers"
item within the Use Cases dropdown shows the active state.

---

## Section 1 · Hero — pain acknowledgment

**Purpose** — Make the Engineering Manager feel recognized before the product is introduced. The
visitor is a buyer, not a daily user. They are evaluating: "does this tool address the governance
problem I have, or is it another QA tool for testers?" The hero headline answers that question
directly, in the register of the person who makes the call, not the person who executes the specs.
This section must earn enough trust for the visitor to read past it.

**Layout** — Single column, centered, `min-height: 100vh`. Top-to-bottom: Go-500 section label
pill → H1 pain-acknowledgment statement → sub-paragraph → CTA row. No product screenshot in this
section. The page holds the product proof until Section 3, after the visitor has been recognized
by the pain framing and seen the matched pairs. The hero is copy-dominant — the headline is the
visual event.

H1 text block at `max-width: 760px`, centered on the warm-white canvas. Sub-paragraph at
`max-width: 600px`. CTA row immediately below, centered.

**What's shown** — The Go-500 section label pill above the headline carries the text:
*[working: "FOR ENGINEERING MANAGERS"]* — Inter 500 13px, letter-spacing +0.08em, all-caps.
Go-500 text (`#00CC80`), background `rgba(0,204,128,0.10)`, border `1px solid rgba(0,204,128,0.20)`.
This is the one Go-500 pill on the page; all subsequent section pills revert to the standard
orange treatment.

H1 headline — DM Sans 700, display scale (74px desktop / 46px mobile), letter-spacing -0.04em,
`--text-primary` (`#111110` light / `#F5F4F0` dark):

*[working: "You make the release call in a Slack thread. There's no record of what you knew before
you shipped."]*

Sub-paragraph — Inter 400, Body Large (18px), `--text-secondary` (`#52514C` light / `#C5C2BB`
dark), `max-width: 580px`:

*[working: "NoHotfix gives the go/no-go decision a formal home — Admin-only, with every spec
outcome visible, a mandatory written justification for any Go with failures, and a permanent record
that can't be altered. Know your release is ready before you ship. Prove it if anyone ever asks."]*

CTA row — primary: "Start for free" button (`#EA6B04` bg, white text, `border-radius: 10px`,
Inter 500 16px) → `/signup`. Secondary: "Talk to us" text link (Inter 500, `#9A3F05`, underline
on hover, `--duration-fast` 150ms) → `/contact`. The secondary path is present here and in the
final CTA because VP Engineering/Compliance buyers sometimes want a conversation before committing.

**Look & feel** — Warm-white canvas, no product image. The absence of a product screenshot in the
hero is deliberate and differentiating — the feature pages open with screenshots; the use-case
pages open with recognition. The H1 is the visual event. DM Sans 700 at 74px on warm white reads
with architectural authority. No decorative elements, no background tints, no radial gradients in
this section — the warmth is in the copy register, not in surface treatments. The one orange
element is the primary CTA. The Go-500 pill is the persona accent — a quiet signal that this page
is calibrated for this person.

**Motion** — Standard choreographed entrance: pill → H1 → sub-paragraph → CTA row, each fading
in + rising 24px, 400ms `--ease-page`, staggered 80ms. Once on page load (not scroll-triggered —
the hero is above the fold). No idle animation.

**Interactivity** — Primary CTA: hover state `#C05A00` bg, 150ms color shift, no scale. Secondary
link: Orange-700 color on hover, underline. No other interactive elements in this section.

**SEO** — Only `<h1>` on the page. Sub-paragraph text is live DOM — "Admin-only," "mandatory
written justification," "Go with failures," "permanent record" are crawlable. Section label pill
text is live DOM, not an image. `<section aria-labelledby>` wraps the hero.

---

## Section 2 · Matched pairs — pain to mechanic

**Purpose** — This is the spine of the use-case archetype. Four matched pairs map the Engineering
Manager's specific pains onto the exact NoHotfix mechanic that resolves each one. The pairs must
be precise — not a benefits list, not marketing copy. Each "before" states the pain as a mechanism
(how the problem actually manifests). Each "after" states the mechanic (how NoHotfix structurally
resolves it, with the name of the specific feature). The visitor should be able to read the "after"
column and navigate to the relevant feature page to verify.

**Layout** — `--bg-section-alt`. Section label pill + H2 + one-line sub-sentence, then four
matched-pair rows. Each row is a full-width horizontal unit at `max-width: 1060px`, divided into
two equal columns separated by a vertical hairline rule (`1px solid --border-default`). Left column
= before (the pain). Right column = after (the mechanic). At tablet (768–1039px): columns remain
side-by-side but the hairline rule becomes a horizontal rule below each pair. At mobile (<768px):
each pair stacks — pain label above, mechanic below, horizontal hairline separating them.

Each pair row has 40px top/bottom padding and a hairline rule below it (last row has no bottom
rule). The rows are not cards — no border-radius, no shadow. They are ruled rows on the
section-alt background.

**What's shown** — Section pill (standard orange). H2 (DM Sans 600, 36px, -0.025em):
*[working: "The problems you manage. The mechanics that remove them."]*

Sub-sentence (Inter 400, 18px, `--text-secondary`):
*[working: "Each of these is a structural fix, not a process reminder."]*

Four matched-pair rows:

**Row 1**
- Left (before): Small 8px filled circle in Go-500 (`#00CC80`), then Inter 600 16px label
  *[working: "The release call is informal"]*, then Inter 400 14px body *[working: "The go/no-go
  decision lives in Slack, email, or verbal confirmation. There is no formal record of the call or
  what was known at the time."]*
- Right (after): Inter 600 16px label *[working: "A formal go/no-go screen, Admin-only"]*,
  then body *[working: "The go/no-go screen is the single interface where the call is made — with
  every spec outcome visible, sorted by severity, before the Admin confirms."]*. Below the body:
  a small text link (Orange-800, Inter 500 14px): *"See the go/no-go gate →"* → `/features/go-no-go`.

**Row 2**
- Left (before): Go-500 circle, label *[working: "No record of what you collectively knew"]*, body
  *[working: "When something goes wrong post-release, there is no audit trail of what was
  tested, what passed, what failed, and what the team decided to accept."]*
- Right (after): label *[working: "A permanent, sealed run record"]*, body *[working: "The moment
  the go/no-go decision is recorded, the run is sealed. Every spec outcome, every submitted
  artifact, the decision, the decider, the timestamp — none of it can be edited."]*. Text link:
  *"See the audit trail →"* → `/features/audit-trail`.

**Row 3**
- Left (before): Go-500 circle, label *[working: "You trust the QA lead's spreadsheet is current"]*,
  body *[working: "The release process is only as consistent as the person maintaining the
  checklist. New team members, unfamiliar with the spec, are a blind spot."]*
- Right (after): label *[working: "Spec execution is enforced, not trusted"]*, body *[working:
  "The run executes the playbook spec by spec. Each spec requires its declared evidence before it
  can pass. The process doesn't depend on discipline — it depends on the gate."]*. Text link:
  *"See artifact enforcement →"* → `/features/artifact-enforcement`.

**Row 4**
- Left (before): Go-500 circle, label *[working: "A Go with known failures has no record"]*, body
  *[working: "Sometimes you ship with a known issue, accepted after a deliberate risk call. But
  that decision is made in someone's head, not in a document."]*
- Right (after): label *[working: "A written justification, permanently attached"]*, body *[working:
  "A Go decision with failed specs requires a written justification before the Confirm button
  activates. That text is written into the run record and sealed with it — not a comment
  added later."]*. Text link: *"See the justification requirement →"* → `/features/go-no-go`.

**Look & feel** — The ruled-row layout is borrowed from Stripe's precision-table aesthetic: equal
width, clean hairlines, no decorative elements. The Go-500 filled circles (8px, `border-radius:
9999px`) in the left column are the only persona-accent color below the hero pill — a consistent
thread that associates the "before" column with the Engineering Manager persona. The text links in
the right column are Orange-800 — the inline link color for light surfaces. At any scroll position
on this section, the two orange elements in view are: one inline text link + one section label
pill. If a second text link is simultaneously visible, that is within tolerance (they are 14px,
not CTAs).

**Motion** — Section entrance: H2 + sub-sentence fade+rise (standard). Matched-pair rows stagger
in at 0/120/240/360ms, each rising 16px (shorter than the section-level 24px — rows are compact
content, not major sections). The Go-500 circles scale in with `--ease-spring` (0.5→1.0),
staggered 40ms after their row's text. Once only.

**Interactivity** — No hover state on the rows themselves. Inline text links at the close of each
right-column entry follow standard link behavior (Orange-700 on hover, underline). No accordion or
expand — every pair is fully visible. Keyboard-navigable through the text links in natural DOM
order.

**SEO** — `<h2>` + four implicit `<h3>` pair labels. Vocabulary: "go/no-go," "sealed," "artifact
enforcement," "justification," "Admin-only," "permanent." All text is live DOM. Internal links
distributed across the four pairs (two to `/features/go-no-go`, one to `/features/audit-trail`,
one to `/features/artifact-enforcement`).

---

## Section 3 · Product-proof band — the decision screen

**Purpose** — This is the product-UI anchor for the page. After the pain recognition (Section 1)
and the structural mapping (Section 2), the visitor needs to see that the mechanic is real and
operational — not abstract. This section shows the go/no-go decision screen as it appears to an
Admin: the formal interface where the release call is made. It is the primary product fragment on
this page, chosen because go/no-go is the Engineering Manager's signature mechanic — the
governance instrument they have been operating without.

The decision screen fragment is also used on `/features/go-no-go` as the hero image, but its
framing here is different: on the feature page, it is annotated and explained in detail. Here, it
is shown in full — large, faithful, minimal annotation — as the answer to "is this a real product
or a landing page?"

**Layout** — Default background (warm white). Section label pill + H2 + sub-paragraph, then the
product fragment centered at `max-width: 960px`. Below the fragment, a short two-column supporting
block (two observations, one in each column, at `max-width: 860px`).

The product fragment uses the standard screenshot treatment: `border: 1px solid rgba(0,0,0,0.08)`,
`border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`.

**What's shown** — Section pill (standard orange). H2 (DM Sans 600, 36px):
*[working: "The go/no-go decision screen."]*

Sub-paragraph (Inter 400, 18px, `--text-secondary`, `max-width: 640px`, centered):
*[working: "One screen. Every spec outcome visible, sorted by severity. The call is Admin-only.
A Go with failed specs requires written justification before the record is sealed."]*

The product fragment shows the go/no-go decision screen in the state immediately before the Admin
confirms. It is identical in content to the hero fragment of `/features/go-no-go` (Section 1),
reproduced faithfully using exact brand tokens:

- Run header: run name in Geist Mono (e.g., `v4.2.1 — Staging`), playbook name, status badge
  *Awaiting Go/No-Go* in Slate (Inter 500, 12px, `background: #f1f5f9`, `color: #475569`,
  `border: 1px solid rgba(100,116,139,0.30)`, `border-radius: 9999px`, `padding: 2px 10px`).
- Summary bar: *11 Passed · 2 Failed · 1 Skipped*. Counts in semantic colors: Go-700 (`#007A4E`)
  for passed; Error-600 (`#E11D48`) for failed; Slate-500 (`#64748B`) for skipped. Inter 500 14px.
- Spec list — three visible rows, severity-sorted (failed specs surfaced first):
  - Row 1: `Critical` severity badge (Error-600 text, Error-100 bg, `border-radius: 9999px`,
    `padding: 2px 10px`), spec title Inter 500, result badge `Failed` (same Error treatment),
    tester name, timestamp Geist Mono 12px. Row background: `rgba(255,228,230,0.5)` (Error-50
    tint) — the failed row is the first thing the Admin's eye resolves.
  - Row 2: `High` severity badge (NoGo-700 text, NoGo-100 bg), spec title, `Passed` badge (Go-700
    text, Go-100 bg).
  - Row 3: `Medium` severity badge (Slate-500 text, Slate-100 bg), spec title, `Passed` badge.
  - *"...and 11 more specs"* quiet indicator below (Slate-400, 13px) — signals a scrollable list.
- Decision action panel: two buttons side-by-side.
  - `Go` button: Go-600 border, Go-50 bg (`#E8FDF4`), Go-700 text (`#007A4E`), Inter 500 14px,
    `border-radius: 10px`, `padding: 8px 24px`. Not yet clicked.
  - `No-Go` button: NoGo-600 border, NoGo-50 bg (`#FEFCE8`), NoGo-700 text (`#A16207`), same
    sizing. Not yet clicked.
  - Justification text area below the buttons: label *"Written justification"* + a required
    indicator (Error-600 asterisk). Placeholder in Geist Mono 14px:
    *[working placeholder: "Required if any specs are failed (2 are failed in this run)"]*.
    Border: `1px solid rgba(0,0,0,0.14)` (`--border-strong`).

Below the fragment, a two-column supporting block separated by a centered vertical hairline rule,
at `max-width: 860px`, each column ~420px wide:

Left column: *[working H3: "Role-gated."]*. Body: *[working: "The screen is accessible to Admins
only. A non-Admin member who navigates to this screen sees a locked state — a named accountability
boundary, not a UI toggle."]*

Right column: *[working H3: "Specs all terminal."]*. Body: *[working: "The decision screen is
unavailable while any spec is Pending or In Progress. Every result must be recorded before the
Admin can make the call. The gate doesn't open early."]*

**Look & feel** — The fragment is the dominant visual — it occupies the full content column width
at desktop. Semantic badge colors are exact (no approximations — if the decision screen looks
different from the actual product, the page's claim loses credibility). Geist Mono on all IDs and
timestamps is mandatory. The two-column supporting block below the fragment uses Inter 600 H3 for
the headings and Inter 400 body — no cards, no borders, just type on the warm-white ground with a
hairline separator. The supporting block reads as annotation, not a second section.

**Motion** — Section entrance: H2 + sub-paragraph fade+rise (standard 400ms `--ease-page`). The
decision screen fragment enters after the sub-paragraph: fade in + rise 24px, 600ms `--ease-page`
(deliberate — this is a significant visual element). The Go and No-Go buttons show a subtle hover
tint on desktop (`rgba(0,153,98,0.08)` for Go, `rgba(202,138,4,0.08)` for No-Go), 150ms, to
communicate the interaction model — they are not clickable but the hover teaches what they do. The
supporting two-column block fades in 200ms after the fragment. Once only.

**Interactivity** — The Go and No-Go buttons show hover tint states (see Motion). The justification
text area shows a focus-style border on hover (`#EA6B04` border, transitioning from
`rgba(0,0,0,0.14)`, 150ms) — not functional, but teaches the required-field model. No other
interactivity. No annotation callout circles on this page (those are the feature page's device).
The fragment is a faithful static representation.

**SEO** — `<h2>`. Supporting H3s crawlable: "Role-gated," "Specs all terminal." Fragment labels
(spec titles, badge states, button labels, field name) are DOM text overlaid on the browser chrome
or within a faithful HTML component — not baked into a raster image. `alt` for any `<img>`
fallback: *"NoHotfix go/no-go decision screen showing a severity-sorted spec list, two failed
specs with a mandatory justification field, and Go/No-Go action buttons."* Internal link at section
close (in the sub-paragraph): `"Only Admins can make the call"` links to `/features/go-no-go`.

---

## Section 4 · Accountability without micromanagement

**Purpose** — Address the Engineering Manager's implicit anxiety: "If I adopt this tool, am I
adding overhead for my team or am I just watching a dashboard all day?" This section makes the
case that the enforcement mechanic does the chasing — the manager doesn't. The process enforces
itself; the manager gets accountability as a natural output, not as an extra task. This is the
section that converts the evaluating buyer who is sold on the governance argument but worried about
adoption friction.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-paragraph, then a **three-item
horizontal layout** at `max-width: 1060px` — three solid cards in a row. Each card: `#FFFFFF` bg,
`1px solid rgba(0,0,0,0.08)`, `border-radius: 16px`, shadow-1, `padding: 32px`. At tablet: three
cards collapse to a 2+1 grid (two above, one centered below). At mobile: single column stack.

No product screenshot in this section. The cards are copy-driven — the argument here is
organizational, not mechanical. The product-UI proof was given in Section 3; this section
translates the mechanic into manager language.

**What's shown** — Section pill (standard orange). H2 (DM Sans 600, 36px):
*[working: "The process does the enforcing. You get the record."]*

Sub-paragraph (Inter 400, 18px, `--text-secondary`):
*[working: "You don't need to review every run. You need to know that when something goes out,
the team followed the process — and if it didn't, you'll know exactly where it deviated."]*

Three cards:

**Card 1 — The pass action is blocked (not reminded)**
- Small icon: a padlock, 24px, 2px stroke, Slate-700 (`#334155`), above the heading. No fill.
  Per iconography spec: linear style, rounded caps.
- Heading: Inter 600, H4 (24px): *[working: "Blocked, not reminded."]*
- Body: Inter 400, 16px, `--text-secondary`: *[working: "The spec cannot be marked as passed until
  the required artifact is attached. Not a warning. Not a nudge. Blocked. The tester doesn't skip
  the step; the system doesn't allow it."]*

**Card 2 — Severity-sorted visibility at decision time**
- Icon: a checklist mark or filter icon, same spec.
- Heading: *[working: "Every failure is visible before the call."]*
- Body: *[working: "When you reach the go/no-go screen, failed specs surface first — sorted by
  severity. You make the call with full information, not a summary someone assembled for you."]*

**Card 3 — The justification is the record**
- Icon: a document or signature-line icon, same spec.
- Heading: *[working: "A Go with failures is still documented."]*
- Body: *[working: "If the team ships with a known issue — an accepted risk — the written
  justification is in the run record. Not in a Slack thread from six months ago. Permanently
  attached to the decision."]*

**Look & feel** — Three equal-width solid cards on the section-alt background. No accent color on
these cards — no top stripe, no orange tint. The persona-accent Go-500 thread was introduced in
the matched pairs (Section 2); here the cards are in the standard neutral recipe. Icons are Slate
— functional, not branded. The cards are three equal arguments, not a ranked list. No "most
popular" treatment.

**Motion** — Section entrance: H2 + sub-paragraph (standard). Three cards stagger in — left to
right — at 0/120/240ms, each rising 24px + fading in, 400ms `--ease-page`. Card hover: `translateY(-4px)` + shadow-2, 200ms `--ease-out`. Once only.

**Interactivity** — Card hover lift (standard). No expand, no internal links within the cards. At
the close of the section, one line of body text links to the `/how-it-works` walkthrough:
*"See how the full release loop works →"* → `/how-it-works`. This is an Orange-800 inline link,
not a button.

**SEO** — `<h2>` + three `<h4>` card headings with vocabulary: "blocked," "severity," "justification,"
"decision." Body text crawlable. Internal link at section close.

---

## Section 5 · Team-level visibility

**Purpose** — Show that NoHotfix is not a one-run tool — it gives the Engineering Manager a
consolidated view of what is happening across all active runs and the full history of completed
ones. This addresses the "what do I actually see day-to-day?" question. The persona accent
(Go-500) appears one more time here as a small detail on the run-history fragment, linking the
visibility concept back to the go/no-go outcome.

**Layout** — Default background (warm white). Section label pill + H2 + sub-paragraph, then a
product fragment at `max-width: 880px`, centered. Below the fragment, two short body paragraphs
at `max-width: 680px`, centered.

The product fragment here shows the **run history / active runs dashboard view** — a table or list
view of multiple runs across the team. This is a different surface from the decision screen in
Section 3; showing a second screen demonstrates that NoHotfix is a platform, not a single-screen
tool.

**What's shown** — Section pill (standard orange). H2 (DM Sans 600, 36px):
*[working: "Active runs and run history, in one view."]*

Sub-paragraph (Inter 400, 18px, `--text-secondary`, centered, `max-width: 580px`):
*[working: "See which playbooks are in progress, who's executing, and what the outcome was on
every completed run — without opening a single Slack thread."]*

Product fragment — a faithful representation of the run history table, showing:
- Column headers (Inter 500, 13px, Slate-500): Run · Playbook · Started by · Status · Decision.
- Five representative rows:
  - Row 1: run name Geist Mono (`v4.2.1 — Staging`), playbook *Mobile Release v3*, user name,
    `Go` status badge (Go-700 text, Go-100 bg).
  - Row 2: run name Geist Mono, playbook *API Gateway v2*, user name, `No-Go` badge (NoGo-700
    text, NoGo-100 bg).
  - Row 3: run name Geist Mono, playbook *Mobile Release v3*, user name, `In Progress` badge
    (Slate-500 text, Slate-100 bg) — no Decision column value yet (an em-dash in Slate-400 Geist
    Mono).
  - Row 4: run name Geist Mono, playbook *Payments Integration*, user name, `Go` badge.
  - Row 5: run name Geist Mono, playbook *Auth Service*, user name, `Go` badge.
- A filter/search bar above the table: two quiet filter chips — *All statuses* (active,
  `border-radius: 9999px`, `background: #FFFFFF`, `border: 1px solid rgba(0,0,0,0.14)`, Inter 500
  13px, `#52514C`) and *All playbooks* (same treatment). A search field at the right.
- Pagination indicator: *"Showing 1–5 of 38 runs"* in Slate-500, Geist Mono 12px.

Fragment screenshot treatment: `border: 1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`,
shadow-1.

Two body paragraphs below the fragment (Inter 400, 16px, `--text-secondary`, `max-width: 680px`,
centered, stacked with 20px gap):

Paragraph 1: *[working: "Every completed run is in history — filterable by playbook, by tester,
by outcome. If an auditor, a stakeholder, or a post-incident review asks what the team knew before
a specific release, the run record is the answer. The URL is shareable. The record can't be
altered."]*

Paragraph 2: *[working: "The In Progress view shows which runs are active right now, who's
executing, and where they are in the playbook. No status update required. No Slack ping needed."]*

**Look & feel** — The run history table is precise and legible — Geist Mono run IDs, semantic
badges in exact v5 colors, Inter labels. The `Go` and `No-Go` badges carry the full semantic color
weight: Go is unmistakably green, No-Go is unmistakably yellow. The table does not use alternating
row background colors (too dense) — row separation is via hairline rules (`1px solid --border-default`).
The filter chips above the table are the only interactive-looking elements; they communicate that
this is a real data surface, not a curated screenshot.

The persona accent (Go-500) appears in the `Go` status badges in the table — this is not a design
addition but a natural consequence of showing real badge colors. The green termination states are
Go-500 family, which serves as a quiet visual echo of the persona accent thread from Sections 1–2.
Do not add additional Go-500 elements beyond the badges.

**Motion** — Section entrance: H2 + sub-paragraph (standard). Fragment slides up 24px + fades,
600ms `--ease-page`, after the sub-paragraph settles. The table rows cascade in with a subtle
stagger: rows 1–5 appear at 0/80/160/240/320ms delay, each fading in (opacity 0→1, no translateY
on rows — the table is a compact data surface and row-level rise would feel excessive). Body
paragraphs appear 200ms after the last table row settles. Once only.

**Interactivity** — Fragment is static. Filter chips are not interactive but show a hover border
tint (`rgba(0,0,0,0.04)` bg) to communicate they are real UI. Run name cells in the table show
Orange-800 underline on hover to signal they are linkable in the real product — not actually linked
in this fragment. At section close, a text link: *"Learn how runs are executed →"* → `/how-it-works`.

**SEO** — `<h2>`. Body paragraphs contain vocabulary: "run history," "filterable," "shareable
URL," "In Progress," "auditor." Table column labels and badge text are DOM text. Internal link at
section close.

---

## Section 6 · Testimonial slot (reserved)

**Purpose** — Reserve the social proof position without fabricating a quote. At launch, a single
bordered placeholder card occupies this space. When the first real Engineering Manager or VP
Engineering testimonial is available, this slot accepts it without a layout change. The border
communicates intentionality; the emptiness communicates honesty.

**Layout** — `--bg-section-alt`. Centered. A single card at `max-width: 720px`, centered on the
section-alt background.

**What's shown** — No section label pill. No heading. The card alone.

The card:
- Light recipe: `background: #FFFFFF`, `border: 1px solid rgba(0,0,0,0.08)`, `border-radius: 16px`,
  shadow-1, `padding: 48px`.
- A 3px top accent stripe in Go-500 (`#00CC80`), running full card width, `border-radius: 16px 16px
  0 0` on the top two corners — the only Go-500 surface appearance on the page. This is the
  persona-accent stripe referenced in the shared archetype.
- Inside the card: a single horizontal line of text, centered, Inter 400 16px, `--text-muted`
  (`#78776F`): *"Customer quote reserved — add when available."*
- Below the text line, three dots in Slate-300 (`#CBD5E1`), centered, spaced 8px apart —
  a minimal placeholder gesture that signals "content lives here" without drawing attention.
- Dark mode: card `background: #1E1D1B`, `border: 1px solid rgba(255,255,255,0.09)`, mandatory
  inset top-edge highlight. The 3px Go-500 top stripe remains — it reads on the dark card surface
  at full saturation.

**Look & feel** — The card is quiet. No avatar area, no company logo placeholder, no star icons.
Those decorative testimonial conventions invite fabrication — by not including them, the empty
state cannot pretend to have content it doesn't. The Go-500 top stripe is the only designed
element; it anchors the card in the persona set without requiring text.

**Motion** — Standard section entrance: card fades in + rises 24px, 400ms `--ease-page`. No hover
lift — a placeholder card does not invite interaction.

**Interactivity** — None. The card is purely presentational.

**SEO** — No heading in this section. No crawlable claim. When a real quote replaces the
placeholder: add the speaker's name, title, and company in `<cite>`, wrap the quote in
`<blockquote>`, and the section earns a section label pill. Until then, this section is invisible
to crawlers beyond its wrapping `<section>` tag.

---

## Section 7 · Final CTA — "Ship it once."

**Purpose** — The conversion close. The visitor has been recognized (pain framing), shown the
structural resolution (matched pairs), seen the product (decision screen), understood the
organizational benefit (accountability without micromanagement), and inspected the data surface
(team visibility). The final CTA re-states the value proposition in one line and asks for the
commitment.

For the Engineering Manager persona, both paths are present: Start free (solo evaluation) and
Talk to us (team/enterprise evaluation). The primary CTA is Start free — consistent with the site
conversion goal. The secondary CTA is Talk to us — present because VP Engineering at a
compliance-sensitive org will sometimes want a conversation before inviting the team.

**Layout** — Default background (warm white). Centered, full-width, `padding: 120px 24px`. A
warm radial tint is the one sanctioned atmospheric wash: `background: radial-gradient(ellipse
600px at 50% 100%, rgba(234,107,4,0.08) 0%, transparent 70%)` (light) / `rgba(249,115,22,0.10)`
(dark) — the same treatment as homepage §11 and features §6. The tint anchors the bottom of the
page without competing with the type.

**What's shown** — No section label pill. H2 in DM Sans 700 (display weight for the closing
moment — not the standard DM Sans 600 used for section headings), centered:

*[working: "Know your release is ready before you ship."]*

Sub-paragraph (Inter 400, 18px, `--text-secondary`, centered, `max-width: 520px`):
*[working: "One seat, full enforcement, the go/no-go gate, sealed records. No credit card. Invite
the team when you're ready — that's when paid plans start."]*

CTA row — two buttons, centered:
- Primary: "Start for free" → `/signup`. `#EA6B04` bg, white text, Inter 500 16px,
  `border-radius: 10px`, `padding: 12px 28px`.
- Secondary: "Talk to us" → `/contact`. Quiet button: `background: transparent`,
  `border: 1px solid rgba(0,0,0,0.14)` (light) / `rgba(255,255,255,0.14)` (dark),
  `color: --text-primary`, Inter 500 16px, same sizing. No orange on the secondary button here
  (it would create three orange elements in view — the primary CTA already holds the orange).

Closing tagline below the CTA row: "Ship it once." — Inter 400 14px, `--text-muted`, centered.
This is the brand tagline, not a CTA label.

Internal links to `/features/go-no-go` and `/pricing` appear in the sub-paragraph as inline
Orange-800 links: *"…the go/no-go gate…"* → `/features/go-no-go`; a quiet
*"See pricing →"* link in Slate-500, Inter 400 14px, centered below the tagline.

**Look & feel** — The warm radial is the only atmospheric element on the page. It does not appear
in any other section. The H2 here uses DM Sans 700 (display weight) rather than the DM Sans 600
used for all other section headings — this is a deliberate upgrade in weight for the closing moment,
matching the feature-page closing CTA pattern. The tagline below the buttons is the only place the
brand tagline appears on this page.

**Motion** — Standard section entrance: H2 + sub-paragraph + CTA row + tagline cascade in, 400ms
`--ease-page`, 80ms stagger. CTA hover: primary button `#C05A00` bg, 150ms; secondary button
`rgba(0,0,0,0.06)` bg, 150ms. No scale on either.

**Interactivity** — Primary → `/signup`. Secondary → `/contact`. Inline link `go/no-go gate` →
`/features/go-no-go`. See pricing link → `/pricing`.

**SEO** — `<h2>`. Sub-paragraph vocabulary: "enforcement," "go/no-go gate," "sealed records,"
"no credit card." Tagline in live DOM. Internal links distributed.

---

## Narrative arc

*Recognition* (hero pain statement: the informal Slack call, the missing record) →
*Resolution mapping* (matched pairs: each pain structurally addressed by a named mechanic) →
*Product evidence* (decision screen: formal, severity-sorted, role-gated, with mandatory
justification — the governance instrument they have been operating without) →
*Organizational benefit* (accountability without micromanagement: the process enforces; the
manager receives the record) →
*Data layer* (team visibility: active runs and run history in one view, no status-update overhead) →
*Social proof placeholder* (testimonial slot, honest) →
*Convert* (Start free / Talk to us).

The arc moves the Engineering Manager from recognition ("this page is for me") through structural
confidence ("the mechanic does what it says") to organizational trust ("I don't add overhead by
adopting this") to conversion ("I can start solo"). The governance argument is built in every
section without using the word "governance."

---

## Interaction & Animation summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Section entrance (all sections) | fade + rise 24px | 400ms `--ease-page` | once on view | Standard — every section |
| Hero pill → H1 → sub → CTA row | cascade fade+rise | 80ms stagger | once | Page load, not scroll |
| Matched-pair rows (§2) | stagger rise 16px | 0/120/240/360ms | once | Shorter rise than section-level |
| Go-500 circles (§2) | scale 0.5→1.0 `--ease-spring` | 40ms after row | once | Persona-accent markers |
| Decision screen fragment (§3) | slide up 24px + fade | 600ms `--ease-page` | once | Deliberate — significant visual |
| Three cards (§4) | stagger fade+rise | 0/120/240ms | once | Cards, not rows |
| Run history table rows (§5) | stagger fade (no rise) | 0/80/160/240/320ms | once | Data table — rise would be excessive |
| Run history fragment (§5) | slide up 24px + fade | 600ms `--ease-page` | once | Same treatment as §3 fragment |
| Testimonial card (§6) | fade + rise 24px | 400ms `--ease-page` | once | Standard |
| Final CTA row (§7) | cascade fade+rise | 80ms stagger | once | Closes the page |
| Card hover (§4 only) | lift −4px + shadow-2 | 200ms `--ease-out` | per hover | Accountability cards only |
| Go/No-Go button hover tint (§3) | bg-color shift | 150ms | per hover | Teaches interaction model |
| Filter chip hover (§5) | bg tint `rgba(0,0,0,0.04)` | 150ms | per hover | Signals real UI |
| CTA button hover | bg-color shift | 150ms | per hover | No scale |
| Sealed badge / lock icon | none | — | never | Phase 6: locked states don't move |

All motion suppressed under `prefers-reduced-motion`. No exceptions. Content renders in final state.

---

## Responsive behavior

**≥1040px** — Full layouts as specified. Matched-pair rows are two equal columns with a vertical
hairline. Three accountability cards are a single row. Run history table is full-width.

**768–1039px** —
- Matched-pair rows: columns remain side-by-side but compress; the vertical hairline rule is
  replaced by a horizontal hairline below each pair. Text wraps naturally.
- Three accountability cards: collapse to a 2+1 grid (two above one centered below).
- Product fragments: scale to 100% content width with 24px side padding. The decision screen
  fragment at §3 compresses the visible spec rows; the three visible rows remain legible at tablet
  scale.
- Run history table: last column (Decision) hides if viewport is tight; status badge remains.

**<768px** —
- Hero H1: 46px (from 74px display scale per the type scale in brand-identity.md).
- Matched-pair rows: each pair stacks — pain label above, mechanic below, horizontal hairline
  separating the two. The left-column Go-500 circles sit on their own line above the pain label.
- Three accountability cards: single column.
- Product fragments: scale to content width. Decision screen fragment: the spec list is visible
  with 2 rows; the action panel (Go/No-Go buttons + justification field) remains visible. Go and
  No-Go buttons are minimum 44×44px touch targets. Justification text area minimum 44px height.
- Run history table: collapses to card-style rows — each run displayed as a mini-card (run name
  Geist Mono, playbook name, status badge). The table chrome (headers, hairlines) is removed;
  the card layout is more legible at mobile than a compressed table.
- Two-column supporting block (§3): stacks to single column, centered.

**<576px** —
- Hero H1: 40px.
- All section label pills remain visible (they are 12px text; legible at all scales).
- Testimonial card padding reduces to 24px.
- CTA row: buttons stack vertically, full-width. Primary above secondary.

---

## Cross-page navigation

| Destination | Placement | Intent |
|---|---|---|
| `/features/go-no-go` | §2 (row 1 + row 4 text links), §3 (sub-paragraph inline), §7 (sub-paragraph inline) | Primary mechanic — the decision screen is this page's product core |
| `/features/audit-trail` | §2 (row 2 text link) | The record and sealed state — accountability's evidence layer |
| `/features/artifact-enforcement` | §2 (row 3 text link) | Enforcement mechanic — the manager's assurance that testers can't bypass |
| `/how-it-works` | §4 (section close inline link), §5 (section close inline link) | The full release loop — for visitors who want the process walkthrough |
| `/pricing` | §7 (sub-paragraph inline + quiet link below tagline) | Conversion path — Early-bird pricing, invite gate trigger |
| `/contact` | Hero CTA (secondary), §7 CTA (secondary) | Enterprise / compliance conversation path |

The page does not link to `/use-cases/qa-teams` or `/use-cases/compliance` — the use-case pages
are peer-level; they are not sub-pages of each other. Cross-linking between persona pages risks
confusing the persona-specific argument. The nav makes the other use-case pages discoverable;
the body copy does not reference them.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal. Shared archetype established (pain-acknowledgment hero, matched pairs, product-proof band, testimonial slot, closing CTA). Engineering Manager persona-specific treatments: Go-500 accent color, decision screen as primary product fragment, four matched pairs targeting governance pains, accountability-without-micromanagement framing, run-history team visibility. |
