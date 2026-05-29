# Page: Artifact-Gated Execution — Design + Information Architecture

**Part of the feature set** — read [README.md](README.md) first for the shared archetype, global treatments, sticky-nav (§0) spec, cross-page navigation, and the set-level motion + responsive summaries. This file records only this page's sections and deviations.

**URL**: `/features/artifact-enforcement`
**Pillar headline**: No artifact, no pass. Full stop.
**Conversion goal**: Start free

---

## SEO intent cluster

- Primary intent: "artifact-gated testing," "require screenshot before passing a test," "enforce evidence in QA workflow," "blocked pass action testing tool"
- Single `<h1>`: the hero pillar headline (*[working: "No artifact, no pass. Full stop."]*) — in live text, never baked into a screenshot
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Features → Artifact Enforcement)
- Internal links to: `/features/go-no-go`, `/features/audit-trail`, `/how-it-works`, `/use-cases/qa-teams`, `/pricing`
- Crawlable claims: all six artifact type names as DOM text; "blocked," "enforced," "gate" in live headings

(Shared SEO rules — single h1, semantic landmarks, crawlable DOM labels, LCP target, OG image — are in [README.md](README.md) §"SEO discipline.")

---

## Sitemap order reconciliation

Sitemap specifies five sections: (1) hero statement, (2) six artifact types, (3) how enforcement works, (4) what gets locked, (5) final CTA. This proposal adds a sixth band — an optional credibility/adoption band between "what gets locked" and the final CTA — to carry the lightweight-adoption message and a reserved testimonial slot. This is consistent with the sitemap's silence on that band (not prohibited, and the persona needs the objection handled). The change is called out explicitly here per the instruction to note refinements.

**Revised section order**:
1. Hero statement
2. Six artifact types (the one bento moment)
3. How enforcement works
4. What gets locked (active → sealed)
5. Adoption / credibility band *(added — not in sitemap, justified above)*
6. Final CTA — "Start free"

---

## Section 0 · Sticky navigation

See [README.md](README.md) §"Sticky navigation" and homepage.md §0. Identical treatment. Current page indicator: "Features" nav item shows Orange-600 active state; "Artifact Enforcement" item within the Features dropdown shows active state.

---

## Section 1 · Hero — "No artifact, no pass."

**Purpose** — In one viewport: name the mechanic, show it in action, and make it viscerally clear that this is a hard gate, not an advisory reminder.

**Layout** — Single column, centered, `min-height: 100vh`, content vertically centered with a slight upward bias. Top-to-bottom: section label pill → H1 hero statement → sub-paragraph → CTA row → hero product-UI fragment.

The hero fragment is displayed below the copy and fills the width of the content column (`max-width: 960px`), rendered inside the standard browser-chrome frame (traffic-light dots, `app.nohotfix.com/runs/…` URL bar, light/dark screenshot treatment). The fragment must read as real product output at a glance.

**What's shown** — The hero fragment shows two elements simultaneously, side-by-side inside the browser frame:

**Left panel (~40% width)**: A spec row in the run-execution view. Spec title in Inter 600, severity badge (e.g. `Critical` in Error-600 on Error-100), system under test label, and the artifact requirements panel showing three requirements:
- File upload requirement: label "Required: Before / After screenshots (2 files)" with two upload slots — one filled (thumbnail preview of a screenshot), one empty with a dashed border upload zone.
- Measured value requirement: label "Page load time (ms) ≤ 3000" with a numeric input field filled with `2340`.
- URL requirement: label "Link to CI test run" with an empty URL input field.

The Pass button sits at the bottom of this left panel. It is rendered disabled: `opacity: 0.45`, `cursor: not-allowed`, a lock icon (2px stroke, 16px) to the left of the label "Pass", and a label beneath reading *[working: "Attach required screenshot to enable"]*. The button must read instantly as **blocked**, not loading. No spinner. No animation. The disabled state is a fact.

**Right panel (~60% width)**: The six-type artifact requirement configuration panel, showing the admin's view of artifact requirement types available for a spec. Six tiles in a 2×3 bento grid (this is the setup for Section 2's full bento — the hero crops a subset): File upload, Text, Checkbox, URL, Measured value, Structured table. Each tile: an icon (2px Linear-style stroke, 24px), a type name in Inter 600, a one-line description in Inter 400 muted text. The tiles that correspond to requirements already on the spec (File, Measured value, URL) carry a faint orange `rgba(234,107,4,0.06)` tint to show they're "in use."

**Look & feel** — Warm-white canvas, dark headline authority through DM Sans 700. The disabled Pass button is the single most important pixel on this page and must be the first thing the eye resolves within the hero fragment. Orange touches exactly two things in this viewport: the logo fire glyph and the primary CTA button. The browser chrome carries the standard light screenshot treatment: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, soft two-layer shadow, `border-radius: 28px` on the outer chrome frame.

*[working hero H1: "No artifact, no pass. Full stop."]*
*[working sub: "The pass action is blocked — not warned, not reminded, blocked — until every declared artifact is attached. Six types. No workarounds."]*

**Motion** — Standard page entrance: pill fades in, H1 fades+rises (500ms), sub-paragraph (150ms delay), CTA row, then hero fragment slides up 24px + fades (700ms after CTAs). All `--ease-page`. Once only. The hero fragment itself has no idle animation — it is a static product state. No auto-cycling tabs (the hero on this page shows one clear blocked state, not a sequence).

**Interactivity** — The disabled Pass button shows a tooltip on hover: *[working: "Attach the required screenshot to enable"]*. The tooltip must be implemented as a real `title` or accessible tooltip pattern, not a CSS pseudo-element — it needs to be keyboard-accessible and crawlable. Beyond the tooltip, the hero fragment is static (not an interactive demo — that lives in Section 3).

**SEO** — The only `<h1>` on the page. Hero sub-paragraph text is live DOM — the mechanic claim ("blocked," "six types," "no workarounds") is crawlable. Artifact requirement labels in the fragment are DOM text. `alt` on any `<img>` fallbacks: *"NoHotfix spec execution panel showing the Pass button disabled while a required screenshot artifact is missing"*. CTAs are `<a href="/signup">` and `<a href="/how-it-works">`.

---

## Section 2 · The six artifact types (the bento moment)

**Purpose** — Give the visitor a complete, concrete picture of the six evidence types so they can mentally map their own QA workflow onto the system. This is the page's one permitted bento moment (Phase 9). It must not look like a generic feature grid — each tile leads with the practical use case, not the type name.

**Layout** — `--bg-section-alt`. Section label pill + H2 heading + sub-sentence, then a **2×3 bento grid** of six tiles at `max-width: 1100px`. Desktop: two rows of three. Tablet (768–1039px): three rows of two. Mobile: six stacked single-column cards.

Each tile is a standard solid card (`border-radius: 16px`, light: `#FFFFFF` + shadow-1; dark: `#1E1D1B` + inset highlight + shadow-1). Generous internal padding. The tiles are equal height within each row — no hero tile, no featured tile. This is a complete set, not a hierarchy.

**What's shown** — Six tiles, in this order (left-to-right, top row then bottom row):

**Tile 1 — File upload**: Icon: document with upward arrow. Name: "File upload." Use-case line: *[working: "Screenshots, scan outputs, recordings — anything a tester captures during execution."]*. Supporting detail: *[working: "PNG, JPG, PDF, MP4, log files. Up to 50 MB. Inline preview for images. Minimum file count enforced."]* A small product fragment inset: two upload slots, one filled with a screenshot thumbnail, one empty with a dashed upload zone.

**Tile 2 — Text**: Icon: document with text lines. Name: "Text entry." Use-case line: *[working: "Log output, observed errors, notes that need to be on the record — not just in a Slack message."]*. Supporting detail: *[working: "Free-text field. Required before pass. Stored as part of the immutable record."]* Product fragment inset: a short text area with a filled-in log excerpt.

**Tile 3 — Checkbox**: Icon: checkbox checked. Name: "Explicit confirmation." Use-case line: *[working: "Steps that must be consciously acknowledged — 'I ran the migration and verified it completed.'"]*. Supporting detail: *[working: "A required confirmation checkbox. Not checkable unless the tester is present in the spec panel."]* Product fragment inset: a labelled checkbox rendered checked, adjacent to a faint unchecked state for contrast.

**Tile 4 — URL**: Icon: chain link. Name: "URL." Use-case line: *[working: "CI pipeline results, Loom recordings, Sentry traces — any external evidence worth linking."]*. Supporting detail: *[working: "Validated as a well-formed URL before pass is enabled. Stored as a clickable link in the run record."]* Product fragment inset: a URL input field with a filled value (`https://ci.example.com/runs/...`).

**Tile 5 — Measured value**: Icon: ruler or gauge. Name: "Measured value." Use-case line: *[working: "API response times, error rates, load times — the number on the record, with a threshold."]*. Supporting detail: *[working: "Tester enters the observed value. A configured threshold triggers a warning if breached. Value required before pass."]*. Product fragment inset: a number input showing `2340` with a threshold label `≤ 3000 ms` and a quiet "Within threshold" indicator in Go-600 text.

**Tile 6 — Structured table**: Icon: grid/table. Name: "Structured table." Use-case line: *[working: "Browser matrices, device compatibility grids, load-test scenario tables — structured evidence that a screenshot can't capture."]*. Supporting detail: *[working: "Admin defines columns (text, number, pass/fail). Tester fills rows during execution. Minimum row count enforced."]* Product fragment inset: a 3-row data grid with columns Browser / Version / Result, first two rows filled, third partially filled.

**Look & feel** — Six identical solid cards, no tile elevated above the others. Each tile's icon is in Orange-400 (slightly dimmed from the CTA orange — step-icon treatment per Phase 3). No tile carries an orange accent fill. The product fragment insets are the evidence that this is a real system, not a marketing diagram. Geist Mono on all data values inside the insets; Inter on all labels.

**Motion** — Section entrance: H2 + sub-sentence fade+rise. Then the six tiles reveal in two staggered waves: top row (0ms / 80ms / 160ms), bottom row (240ms / 320ms / 400ms) after the heading settles. Each tile rises 20px, `--ease-page`, 400ms. Once only. No idle animation on any tile.

**Interactivity** — Card hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`. The tile is not a link — it is self-contained content. No expand/collapse needed at this detail level. Keyboard-focusable for accessibility; no focus-ring interactivity beyond the standard orange focus ring.

**SEO** — `<h2>` for the section; `<h3>` for each artifact type name — these are the crawlable vocabulary terms ("file upload," "measured value," "structured table") that match search intent. The use-case line and supporting detail are body text. Internal link at the bottom of the section: *"See how requirements are configured in the playbook →"* → `/how-it-works#step-2`.

---

## Section 3 · How enforcement works

**Purpose** — Show the three-step flow from the author's configuration through tester execution to the blocked/unblocked state transition. Converts a conceptual claim ("blocked") into a concrete walkthrough.

**Layout** — Default background. Section label pill + H2 + sub-sentence, then a **three-step vertical sequence** at `max-width: 900px`. Each step: step number (DM Sans 700, large, Orange-400), step heading (Inter 600, H3), one–two body lines, and a product-UI fragment to the right (desktop alternates text-left/fragment-right; mobile stacks text above fragment). A thin connector line runs between steps — structural, 1px, `rgba(0,0,0,0.08)` light / `rgba(255,255,255,0.09)` dark.

**What's shown** — Three steps:

**Step 1 — Author configures requirements**: *[working heading: "The author declares what evidence the tester must provide."]*. Body: *[working: "Each artifact requirement is set on the spec — type, minimum count, threshold if applicable. The tester has no path around what is declared."]*. Fragment: a spec in the authoring view showing the artifact requirements configuration panel, with one requirement of type "File / Screenshot × 2" configured and a "+Add requirement" affordance visible. This is a compact crop — just the requirements panel, not the full editor.

**Step 2 — Tester executes and submits evidence**: *[working heading: "The pass button stays blocked until every requirement is satisfied."]*. Body: *[working: "The tester uploads the file, fills the table, enters the measurement, or provides the URL. Each requirement shows its completion state inline. Only when all are satisfied does the pass button become active."]*. Fragment: the run execution panel for a single spec, showing two artifact requirements: first one (file upload) filled with a green checkmark completion state; second one (URL) empty with an incomplete indicator. The Pass button below is visibly disabled. This is the money shot for this section — the disabled state is the point.

**Step 3 — Pass unblocks when all requirements are met**: *[working heading: "When the evidence is complete, the gate opens."]*. Body: *[working: "All requirements satisfied — the pass button activates. One click. The artifact, the result, and the tester's identity are recorded in the run record, permanently."]*. Fragment: the same execution panel from Step 2, but now both requirements show green completion states, and the Pass button is fully enabled (`#EA6B04` orange fill, white label "Pass", full opacity, `cursor: pointer`). The contrast with Step 2's disabled state is the argument.

**Look & feel** — Clean, airy, structural. The three fragments are the argument — the text explains what to look at. Step icons in Orange-400. Connector in `--border-default`. Step 2's disabled Pass button must maintain the same visual treatment as the hero's disabled button — `opacity: 0.45`, lock icon, `cursor: not-allowed`. Step 3's enabled Pass button must be clearly the same button, now active — the contrast is the conversion moment.

**Motion** — Section entrance: heading fades+rises. Then the three steps stagger-reveal at 0ms / 200ms / 400ms, each rising 20px. The connector line draws top-to-bottom (`height 0→100%`) after the steps settle, 400ms `--ease-out`. Once only. No idle animation.

**Interactivity** — The fragments are static product crops, not interactive. Hover on step cards produces the standard `translateY(-4px)` lift. Step headings are `<h3>` anchors if the page needs deep-link support (e.g., from `/how-it-works`).

**SEO** — `<h2>` + three `<h3>` step headings carrying the mechanic vocabulary ("blocked," "evidence," "requirements," "pass action"). Body text is crawlable. Internal link at section close: *"See the full execution walkthrough →"* → `/how-it-works#step-4`.

---

## Section 4 · What gets locked

**Purpose** — Bridge from the enforcement mechanic to the immutability guarantee. Show that every artifact collected during execution becomes part of a permanent, tamper-evident record the moment the go/no-go decision is made. Prepares the visitor for the Audit Trail feature page.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-sentence, then a **side-by-side two-panel visual** at `max-width: 960px`. Left panel: an "active run" state crop. Right panel: the same run in the "sealed" state. A right-arrow or transition indicator between the panels (hairline + small arrow glyph, not an animated transition). Desktop: side-by-side. Mobile: stacked, with arrow rotated to point down.

**What's shown** —

Left panel (active run): A cropped run header showing status badge `In Progress` in the slate badge recipe (`#475569` light text, `#F1F5F9` bg), spec summary "8 passed · 2 in progress · 1 failed," and below it a spec row showing an artifact upload zone (still editable — dashed border, "Upload file" affordance visible). Label above the panel in Inter 500 muted text: *[working: "During execution — editable"]*. The overall panel carries no special visual treatment beyond the standard screenshot treatment.

Right panel (sealed run): The same run header, now showing status badge `Go` in the Go badge recipe (Go-700 text, Go-100 bg, `rgba(0,153,98,0.30)` border). The spec row below shows the same artifact, now rendered as an inline image preview with a lock icon overlay on the bottom-right corner of the image (not animated — static). The upload zone is gone; no "edit" affordance anywhere. A "SEALED" text label in Geist Mono 500 appears in the run header area, small and quiet, in Slate-500. Label above: *[working: "After the decision — read-only. Permanently."]*.

**Look & feel** — The visual contrast between the two panels is the argument. The left panel reads as an operational surface (affordances present, action possible). The right panel reads as a document (no affordances, no edit controls, the lock icon is the only indicator and it is static). Both panels use the standard light screenshot treatment. The section's background tint creates a slight visual separation from the surrounding default-bg sections.

**Motion** — Section entrance: heading fades+rises, then the two panels fade in together (not staggered — they're a pair, not a sequence). The transition arrow is static. Once only.

**Interactivity** — Static panels. No hover interaction needed — this section communicates a state, not a process. A link at the close of the section: *"Explore the full audit trail →"* → `/features/audit-trail`.

**SEO** — `<h2>` with vocabulary: "sealed," "locked," "immutable." Body text is crawlable. Internal link to `/features/audit-trail` and `/features/go-no-go` (cross-page navigation).

---

## Section 5 · Adoption / credibility (added, not in sitemap)

**Purpose** — Handle the "this looks like a heavy implementation project" objection before the final CTA. Keep it short. One stat row and a quiet reserved testimonial slot.

**Layout** — Default background. Narrow, centered, `max-width: 760px`. A single row of three honest product-fact cells (matching the homepage trust strip treatment), then below it a placeholder testimonial card (bordered, no content — an honest reserved slot).

**What's shown** — Three fact cells (hairline dividers, DM Sans number, Inter caption):
- *A playbook in an afternoon.* No implementation project, no onboarding call.
- *Full enforcement on the free tier.* Every artifact type, every gate, one seat.
- *Existing test tools stay.* NoHotfix gates the final release step — it doesn't replace TestRail or Jira.

Below the fact row: a solid card (`#FFFFFF` / `#1E1D1B`) with a reserved-quote slot. The card has a 60px top accent stripe in Orange-500 (the QA Teams persona accent from Phase 10 and homepage §8 — this page's primary persona is the QA lead). Inside: *[working placeholder: "Reserved for a QA lead quote. To be added at first paying customer. No fabricated testimonials. No stock faces."]*. Style the placeholder text in Slate-400, Inter 400 italic, clearly indicating it is a placeholder.

**Look & feel** — Quiet and confident, matching the homepage trust strip's register. Orange is absent from the fact cells (it belongs to CTAs, not stats). The top accent stripe on the testimonial card is the only orange fill in this section, and it is a 60px strip, not a background.

**Motion** — Standard section entrance, then the three fact cells count up their numbers once on reveal (600ms `--ease-out`). Reduced-motion: show final value immediately. The testimonial card fades in with the section entrance.

**Interactivity** — Static. No hover effects needed on the fact cells (they are not links or cards). The testimonial card hover: standard `translateY(-4px)` lift.

**SEO** — Section is not a heading-driven SEO asset — it is conversion copy. The three fact cells are descriptive `<p>` text, not headings. No `<h3>` here (would interrupt the heading hierarchy unnecessarily).

---

## Section 6 · Final CTA — "Start for free"

**Purpose** — The conversion close. Identical shared archetype with the homepage final CTA, adapted for this page's primary CTA: "Start for free."

**Layout** — Centered, full-width, ~120px top/bottom padding. Display headline, sub-copy, primary CTA (orange), secondary CTA (quiet).

**What's shown** — *[working H2: "Start for free."]*. *[working body: "One seat, full enforcement, all six artifact types. No credit card. The gate is live in an afternoon."]*. Primary CTA: "Start for free" → `/signup`. Secondary CTA: "See how it works" → `/how-it-works`. A quiet closing line: "Ship it once."

**Look & feel** — The single sanctioned atmospheric warm radial: `rgba(234,107,4,0.08)` light / `rgba(249,115,22,0.10)` dark, fading to transparent by 70%. Must read as warmth, not a glow blob.

**Motion** — Heading + CTA fade+rise on reveal. CTA hover: background-color shift + 1px border emphasis, 150ms, no scale.

**Interactivity** — Primary → `/signup`. Secondary → `/how-it-works`.

**SEO** — `<h2>` reinforcing the feature (not a generic "Get started" — it references the mechanic). Internal links to signup and how-it-works.

---

## Narrative arc

*Claim* (hero) → *Inventory* (six types: this is comprehensive) → *Process* (how it works: three steps) → *Permanence* (what gets locked: this connects to the audit trail) → *Objection* (adoption: this isn't heavy) → *Convert* (start free).

The visitor who arrives skeptical ("our team already uses Notion/Jira") experiences: a blocked Pass button they did not expect → a complete inventory of evidence types that map to their workflow → a clear three-step process → reassurance that the record is permanent → reassurance that adoption is not a project → a low-friction CTA. The mechanic resolves each objection before the visitor has to raise it.
