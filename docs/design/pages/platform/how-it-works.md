# How It Works — Section Design Proposal

**Product**: NoHotfix
**URL**: `/how-it-works`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. Copy is indicative working text, not final.
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md (`/how-it-works` entry)
**Design references**: Cloudflare (light-first, orange-as-architecture) · Linear (card discipline, UI as brand argument) · Stripe (screenshot as argument, technical precision)

---

## How to read this document

This is a **section-by-section design spec** — what each section looks like, which product UI it shows, how it animates, and how the visitor progresses through it. It does not finalize marketing copy; bracketed lines like *[working: "…"]* are placeholders to be replaced by the copy deck.

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

**Locked decisions for this page:**

- **Archetype**: a single vertical spine — six numbered steps, one step per band, alternating text-left / screenshot-right (desktop), stacked text-above / screenshot-below (mobile). A structural progress spine connects the bands visually.
- **Page's two signature moments**: Step 4 (blocked Pass action) and Step 6 (sealed record). These receive the heaviest visual treatment. The sealed record never animates (Phase 6 — sealed things don't move).
- **No feature-grid detours**: per website-vision.md Phase 12 §"How It Works," the six steps are the whole page. No comparison table, no bento, no persona cards.
- **Honesty rule**: the launch audit capability is browser print-to-PDF of the sealed record + a shareable URL. The dedicated audit-grade PDF/JSON export is post-launch and must not appear anywhere on this page as a current capability.
- **No fabricated logos, stats, or testimonials** — none of these sections have real customer proof yet. Conversion relies on the product UI argument alone.

---

## Design DNA — the sequential narrative challenge

This page has one architectural challenge that the feature pages do not: it must communicate a **linear, ordered process** rather than a single mechanic. The six steps must feel like a structured journey, not a scrolled list of independent sections.

The solution is a **structural progress spine** — a vertical line that runs through the left margin of the content column, broken into step nodes at each band. The spine is not decorative; it performs a real wayfinding function: it communicates "you are reading a sequence" to a visitor who lands mid-page, and it gives the eye a tracking element that draws it downward.

Every step has the same internal layout grammar: a step marker (numbered node on the spine), a textual argument (left column), and a screenshot fragment (right column). The grammar is rigid so the narrative can be loose — the visitor's brain allocates its pattern-recognition to the story, not to parsing new layouts.

The Stripe influence is strongest here: single large product screenshot per step, treated as the primary brand asset, with copy that annotates what the visitor is seeing rather than performing enthusiasm. The visitor should be able to understand each step from the screenshot alone.

The two moments where the grammar intentionally adds visual weight — Step 4 (blocked) and Step 6 (sealed) — are the page's emotional climax and resolution, respectively. Step 4 is where the visitor experiences the enforcement in simulation. Step 6 is where the system's permanence becomes real.

---

## Global treatments

All items from homepage.md §"Global treatments" apply verbatim. This section records only what is page-specific or what extends the global set.

- **Theme**: light-first (`--bg-page #FAFAFA`), dark co-equal (`#111110`). `prefers-color-scheme` default, feature-031 toggle overrides. Per homepage.md §"Global treatments."
- **Section rhythm**: 120–160px vertical padding desktop. Each step band is a room. Alternating sections use `--bg-section-alt` (`#F4F4F5` light / `#161513` dark) to create visual separation between steps.
- **Section entrance motion**: `opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`. Once on scroll-into-view. Every section. Per homepage.md §"Global treatments."
- **Section label pills**: all-caps Inter 500 13px. Light: Orange-600 text, `rgba(234,107,4,0.10)` bg, `rgba(234,107,4,0.20)` border. Dark: Orange-500 text, `rgba(249,115,22,0.10)` bg. Per homepage.md §"Global treatments."
- **Cards**: solid recipe both themes. Light: `#FFFFFF` + `1px solid rgba(0,0,0,0.08)` + shadow-1. Dark: `#1E1D1B` + `1px solid rgba(255,255,255,0.09)` + inset top highlight + shadow-1. Card hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`. Per homepage.md §"Global treatments."
- **Typography**: DM Sans 700 at display scale (74px / -0.04em) for hero; DM Sans 600 for H2 step headings (36px / -0.025em); Inter 600 for H3 sub-headings; Inter for body/labels/buttons; Geist Mono for all product data (run IDs, field values, timestamps, decision records). Per brand-identity.md §"Typography."
- **Orange discipline**: max two orange elements per viewport. CTAs `#EA6B04` light / `#F97316` dark. Step node numbers `#EA6B04` light / `#F97316` dark (structural accent, not a third orange element — they read as part of the spine, not competing with the CTA). Inline links `#9A3F05` light. Never orange as a section background beyond a ≤10% tint. Per Phase 3 of website-vision.md.
- **Screenshot treatment (light)**: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`. No glow. All product-UI fragments use this treatment on light; dark-mode fragments use the standard dark card recipe (solid `#1E1D1B` bg, inset highlight). Per brand-identity.md §"Illustrations & Imagery."
- **Closing CTA**: the page ends with the shared "Ship it once." final-CTA section. Per Phase 12 §"Shared across all pages."
- **Footer**: always-dark `#111110`, hairline top border `1px solid rgba(255,255,255,0.06)`, logo white variant, "Ship it once." tagline. Per Phase 10 of website-vision.md.
- **Sticky navigation**: identical treatment to homepage.md §0. Current-page indicator: "How It Works" nav item shows Orange-600 active state.
- **`prefers-reduced-motion`**: disables all motion. Content renders in final state immediately. No exceptions.

### Page-specific treatment: the progress spine

The spine is the key structural element unique to this page. It is specified here rather than per-section to avoid repetition.

**Desktop (≥1040px):**
A 1px vertical line (`rgba(0,0,0,0.10)` light / `rgba(255,255,255,0.10)` dark) runs from the top of Step 1's node to the bottom of Step 6's node, positioned in the left gutter of the content column (approximately 40px from the left edge of the text column). Each step band punctuates the spine with a **step node**: a circle 32px diameter, `border-radius: 9999px`, filled `#EA6B04` (light) / `#F97316` (dark), containing the step number in DM Sans 700 14px white. The node sits centered on the spine line, at the vertical midpoint of the step's text column.

The spine draws on first scroll into the intro band (§1 below), extending downward as the visitor scrolls — the drawn portion of the spine advances to the next node as each step band enters the viewport. This uses a scroll-position-driven `height` on a `::after` pseudo-element or a thin `<div>` overlaid on the static background line, advancing at `transition: height 600ms --ease-out` per step. Under `prefers-reduced-motion`, the spine is rendered at full height immediately; nodes appear at full opacity.

**Tablet (768–1039px):** spine and nodes collapse to a top-centered sticky step-counter row below the nav — a simplified "Step N of 6" indicator that sticks (`position: sticky; top: 64px`) while the page scrolls. The per-section text+screenshot stacks vertically (text above, screenshot below).

**Mobile (<768px):** the sticky step counter is replaced by a static pill badge within each step band's section label (e.g. "STEP 4 OF 6"), same pill recipe as section labels (Orange-600 text, faint orange tint bg). No spine line. No progress indicator in the nav area.

---

## SEO intent cluster

- Primary intent: "how does NoHotfix work," "release checklist workflow," "release readiness process," "pre-deployment checklist with enforcement," "how to enforce QA evidence"
- Single `<h1>`: the intro headline (§1). Every step heading is `<h2>`. Sub-headings within steps are `<h3>`. No skipped levels.
- `<section aria-labelledby>` for every content band. `<main>` wraps the content below nav.
- All product-UI labels rendered as real DOM text overlaid on the chrome or within faithful HTML components — never baked into a raster image. The mechanic claims ("blocked," "sealed," "snapshot," "terminal") must be crawlable.
- LCP target: the §1 intro headline (DM Sans 700, `font-display: swap`, woff2 preloaded). Step screenshots load progressively; below-fold assets `loading="lazy"`, explicit `width/height`.
- OG image: Step 4's blocked Pass button fragment, cropped 1200×630 — the page's single most important pixel, as the face of the page in social previews and link unfurls.
- `SoftwareApplication` + `HowTo` JSON-LD (optional but appropriate for a six-step process walkthrough). `BreadcrumbList`: Home → How It Works.
- Internal links distributed across the page to: `/features/artifact-enforcement` (§2 and §5), `/features/go-no-go` (§6), `/features/audit-trail` (§7), `/pricing` (§8 final CTA), `/use-cases/qa-teams` (§5).

---

## Section 0 · Sticky navigation

See homepage.md §0. Identical treatment. Current-page indicator: "How It Works" nav item shows Orange-600 active state (light) / Orange-500 (dark). No dropdown — this is a top-level nav item.

---

## Section 1 · Intro — the frame

**Purpose** — Orient the visitor in one sentence before the six-step sequence begins. State the page's thesis: NoHotfix is a structured release cycle, not a flexible checklist. Establish the reading contract (you are about to read six steps; they are sequential; the order matters).

**Layout** — Centered single column, `max-width: 760px`, ~96px top padding. No `min-height: 100vh` — this is a chapter opener, not a landing-page hero. Top-to-bottom: section label pill → H1 headline → single body sentence. The spine does not appear above this band; the first node appears at the transition between this section and §2.

**What's shown** — Section label pill: *[working: "THE FULL LOOP"]*. H1 headline in DM Sans 700, display scale (74px desktop / 46px mobile): *[working: "Six steps from playbook to proof."]*. One body sentence in Inter 400 Body Large (18px): *[working: "NoHotfix has one job: answer 'are we ready to ship, and can we prove it?' Here is how it does that."]*

No product UI fragment. No CTA. No screenshot. This section is pure type — the signal that what follows is a structured argument, not a feature list.

**Look & feel** — Warm-white canvas, default `--bg-page`. Dark headline weight through DM Sans 700 at display scale. Orange appears on exactly one element in this viewport: the section label pill (its tint bg + Orange-600 text). No other accent. The restraint sets the tone for the sequence that follows.

**Motion** — Standard page entrance: pill fades in (~400ms), H1 fades+rises 24px (500ms, `--ease-page`), body sentence fades+rises (150ms after H1). Once only. No idle animation.

**Interactivity** — Static. No CTA, no interaction. The visitor's task here is to read one sentence and continue scrolling.

**SEO** — The only `<h1>` on the page. Body sentence is crawlable, keyword-relevant text ("ready to ship," "prove it," "six steps"). No headings skipped.

---

## Section 2 · Step 1 — Build a playbook

**Purpose** — Introduce the authoring model: a shared spec library + reusable playbook templates that define sections and specs in a drag-and-drop editor. Establish the "build once, run many times" principle. This is where the release process is designed, not where it is executed.

**Layout** — Default `--bg-page`. Two-column split, `max-width: 1100px`. Left column (~45% width): step node on spine + section label pill + H2 step heading + body paragraphs + in-context link. Right column (~55% width): screenshot fragment in standard light screenshot treatment. Step node anchored to the spine at the top-left of the left column. Desktop: text left, screenshot right. Mobile: text above, screenshot below.

**What's shown** —

**Left column:**
Section label pill: *[working: "STEP 1 OF 6"]*. H2 step heading in DM Sans 600 (36px): *[working: "Build a playbook."]*. Body in Inter 400 Body Large (18px): *[working: "Start with the spec library — a shared repository of specs your team owns and reuses across every release. Each spec carries a severity (Critical · High · Medium · Low) and the artifact requirements a tester must satisfy to pass it."]*. Second paragraph: *[working: "Organize specs into a playbook: sections and sub-sections in the order you want them executed. Drag-and-drop to reorder. Build it once; run it for every release."]*. In-context link (Inter 500, `#9A3F05` light, underline on hover): *[working: "See how enforcement is configured on a spec →"]* → `/features/artifact-enforcement`.

**Right column:**
A screenshot fragment inside the standard browser-chrome frame (traffic-light dots, `app.nohotfix.com/<org>/playbooks/…` URL bar). The frame contains:
- A sidebar listing two sections: "Pre-deployment checks" (expanded, showing three spec rows below with drag handles on their left edges) and "Post-deployment validation" (collapsed).
- The main panel shows one spec open in its config view: spec title in Inter 600, severity badge `Critical` in Error-600 on Error-100, a description field, and the artifact requirements panel with one requirement configured ("File upload — Required: 2 screenshots").
- At the top of the main panel, a section label strip reads "Pre-deployment checks" — establishing the authoring hierarchy.

All text in the fragment (spec titles, severity badge labels, field names) is DOM text. Geist Mono on IDs and system-generated values; Inter on all user-facing labels.

**Look & feel** — The screenshot is crisp and readable but not zoomed to near-100% — it shows enough context that the visitor understands they are looking at an editing environment. The drag handles on the spec rows and the "+ Add spec" affordance are visible, confirming editability. The section's vertical rhythm (120–160px) gives the two columns breathing room.

**Motion** — Section entrance: spine draws to Step 1 node (600ms `--ease-out`), node pops in with `--ease-spring` (scale 0.5→1.0, 300ms). Text column fades+rises (400ms `--ease-page`). Screenshot fragment fades+rises 24px (700ms `--ease-page`, 100ms delay). Once only. The spine draw is the section's signature motion — it arrives before the content, pulling the eye into the step.

**Interactivity** — Static screenshot. In-context link to `/features/artifact-enforcement`. No tooltip needed on this step's fragment.

**SEO** — `<h2>` carrying vocabulary: "playbook," "spec library," "sections," "drag-and-drop." Body text is crawlable. Internal link to `/features/artifact-enforcement`. `<section aria-labelledby="step-1-heading">`.

---

## Section 3 · Step 2 — Declare the evidence

**Purpose** — Introduce the six artifact types and their role in enforcement. The spec author declares required evidence; the tester has no path around what is declared. This is the configuration side of enforcement — the decision about what proof is required happens here, at authoring time, not at execution time.

**Layout** — `--bg-section-alt`. Two-column split, `max-width: 1100px`, text-left / screenshot-right (same column grammar as §2). Step 2 node anchored on the spine. The screenshot is wider than the text column on this step, to accommodate the six-type panel without compression.

**What's shown** —

**Left column:**
Section label pill: *[working: "STEP 2 OF 6"]*. H2 step heading in DM Sans 600: *[working: "Declare the evidence."]*. Body: *[working: "For each spec, the author configures which artifacts a tester must provide before the Pass button activates. Six types cover every form of evidence a QA workflow produces."]*. A six-item inline list (Inter 400, 16px, 2-column within the left column on desktop for compactness) naming the types: File upload · Text entry · Checkbox confirmation · URL · Measured value · Structured table. Below the list, one key mechanic sentence: *[working: "Every declared requirement is a hard gate. The tester cannot substitute a different type of evidence — the field only accepts what was configured."]*. In-context link: *[working: "See the six types in detail →"]* → `/features/artifact-enforcement#artifact-types`.

**Right column:**
A screenshot fragment showing a single spec's artifact requirements configuration panel in the admin/authoring view. Three configured requirements, stacked vertically:
- Requirement 1: type chip "File upload," label "Before/after screenshots," min-count "2," `Required` badge in Inter 500 12px.
- Requirement 2: type chip "Measured value," label "Page load time (ms)," threshold "≤ 3000," `Required` badge.
- Requirement 3: type chip "URL," label "CI pipeline result," `Required` badge.

Below the three configured requirements: an "+ Add requirement" affordance row showing a dropdown open, revealing all six available types in a compact list — making the full type inventory visible without a separate bento grid.

All type names in the fragment are DOM text (crawlable). Geist Mono on numeric values and threshold values (`≤ 3000`); Inter on labels.

**Look & feel** — The `--bg-section-alt` surface separates this step from §2 while maintaining the same two-column rhythm. The screenshot is tight — just the requirements panel, not the full spec editor. The six-type dropdown in the "+ Add requirement" affordance is the visual proof that the system is comprehensive. No bento grid on this page — the homepage and `/features/artifact-enforcement` carry that treatment; here the six types appear as a tight prose list and as options in a visible dropdown.

**Motion** — Spine draws from Step 1 node to Step 2 node (600ms `--ease-out`), node pops in (`--ease-spring`). Text column fades+rises (400ms `--ease-page`). Screenshot fragment fades+rises 24px (700ms `--ease-page`, 100ms delay). Once only.

**Interactivity** — Static screenshot. In-context link to `/features/artifact-enforcement#artifact-types`.

**SEO** — `<h2>` carrying: "declare evidence," "artifact requirements," "six types." Six type names as crawlable text in the inline list. Internal link to `/features/artifact-enforcement`. `<section aria-labelledby="step-2-heading">`.

---

## Section 4 · Step 3 — Start a run

**Purpose** — Introduce the snapshot behavior: starting a run freezes the playbook as it exists at that moment. Later edits to the playbook template do not touch the in-progress run. Optional section-level pre-assignment at start. This establishes the foundational concept of run isolation that makes the record trustworthy.

**Layout** — Default `--bg-page`. Two-column split, `max-width: 1100px`, **text-right / screenshot-left** — the first column flip, signaling a new phase. The alternating column arrangement breaks the page's visual rhythm and registers subconsciously as a transition: the visitor moves from configuring the system (§2–§3) to operating it (§4–§7). Desktop: screenshot left, text right. Mobile: text above, screenshot below (mobile always stacks text first regardless of desktop column order).

Step 3 node anchored on the spine.

**What's shown** —

**Right column (text):**
Section label pill: *[working: "STEP 3 OF 6"]*. H2 step heading: *[working: "Start a run."]*. Body: *[working: "Launching a run takes a snapshot of the playbook at that moment. The run is now its own frozen copy — if you update the playbook template the next day, those changes don't touch this run."]*. Second paragraph: *[working: "At the start, you can optionally pre-assign sections to team members. The assignments travel with the frozen snapshot — testers see only what is assigned to them when they open the run."]*. Key mechanic sentence, styled with a thick orange left-rule (`3px solid #EA6B04` light / `3px solid #F97316` dark, 8px left padding, `border-radius: 2px`): *[working: "The run you open is the run you sealed. No drift."]*. This pull-quote treatment gives the snapshot mechanic a visual anchor — it is the most important principle in this step.

**Left column (screenshot):**
A screenshot fragment showing the "Start a run" modal or initiating screen. The modal shows:
- Playbook name: "v2.4.1 Release — QA Sign-off" in Inter 600.
- A "Snapshot preview" section (compact read-only list): three sections with their spec counts ("Pre-deployment checks — 6 specs," "Smoke tests — 4 specs," "Post-deployment validation — 3 specs"). The list carries no edit affordances — it is a preview of what will be frozen.
- An optional pre-assignment section below: one section ("Pre-deployment checks") assigned to a user avatar + name ("Alex M."), a second section unassigned with a dropdown affordance showing it can be assigned.
- A primary "Start run" button in the standard orange CTA treatment at the modal bottom.

The modal is rendered in the elevated-card treatment (`border-radius: 20px`, `box-shadow: var(--shadow-modal)` — shadow-3 recipe) against a lightly scrimmed page background (`rgba(17,17,16,0.32)` light / `rgba(0,0,0,0.60)` dark), establishing it as a dialog. The scrim behind the modal is the only non-card use of a translucent layer — it is the nav-and-overlays glass model applying correctly.

**Look & feel** — The column flip and the modal's elevated-card treatment communicate a distinct moment: something is being initialized. The orange left-rule pull-quote is the only strong orange accent in this section beyond the step node and the CTA inside the modal screenshot.

**Motion** — Spine draws from Step 2 to Step 3 node (600ms `--ease-out`), node pops in (`--ease-spring`). Screenshot fades+rises 24px from the left-side position (400ms `--ease-page`). Text column fades+rises with 100ms delay (400ms `--ease-page`). Once only. (On the alternating step, the screenshot enters from the left side of its column while the text enters from the right — paired entry reinforcing the two-column relationship.)

**Interactivity** — Static screenshot of the modal (not an interactive demo). No in-context links needed on this step — it is a transitional step. The primary in-context links belong in §5 where the snapshot's consequences become visible.

**SEO** — `<h2>` carrying: "start a run," "playbook snapshot," "run isolation," "pre-assignment." Body text is crawlable. `<section aria-labelledby="step-3-heading">`.

---

## Section 5 · Step 4 — Execute specs

**Purpose** — Show the run execution UI, with emphasis on the BLOCKED pass action. This is the page's single most important moment: the pass button is disabled until every declared artifact is attached. The spec state machine (Pending → In Progress → Passed / Failed / Skipped) is shown in context below the primary visual. The visitor must experience the enforcement mechanic in simulation — seeing the blocked button in a faithful product crop is as close to using the product as the page can offer.

**Layout** — `--bg-section-alt`. Two-column split, `max-width: 1100px`, **text-left / screenshot-right** (returns to the standard column order). Step 4 node anchored on the spine.

This step receives marginally more vertical space than the others — the screenshot fragment is taller, and a secondary visual element appears below the main two-column block: a small spec-status state machine diagram (centered, `max-width: 640px`). This secondary element communicates the Pending → In Progress → Passed / Failed / Skipped flow without interrupting the primary visual argument (the blocked button).

**What's shown** —

**Left column (text):**
Section label pill: *[working: "STEP 4 OF 6"]*. H2 step heading: *[working: "Execute specs."]*. Body: *[working: "Each tester opens their assigned specs and works through them. For each spec, they fill in the required artifact fields — screenshot, measurement, URL, whatever was configured."]*. Key mechanic sentence in orange left-rule pull-quote treatment (same recipe as §4, `3px solid #EA6B04` left-rule): *[working: "The Pass button is blocked. Not warned. Not reminded. Blocked — until every declared artifact is attached."]*. This sentence must receive typographic weight: Inter 600, 18px, not muted. Secondary body: *[working: "A tester can mark a spec Failed or Skipped without providing artifacts — but they cannot mark it Passed. That path is structurally closed."]*. In-context links:
- *[working: "See how enforcement works →"]* → `/features/artifact-enforcement`
- *[working: "See how QA teams use enforcement →"]* → `/use-cases/qa-teams`

**Right column (screenshot):**
A screenshot fragment showing a single spec open in the run execution view. Full browser chrome at `max-width` for this step. The spec panel shows:

- Spec header: title "Login regression — OAuth2 flow" in Inter 600, severity badge `Critical` (Error-600 `#E11D48` text on Error-100 `#FFE4E6` bg, `rgba(225,29,72,0.30)` border), status badge `In Progress` (slate recipe: `#475569` light text, `#F1F5F9` bg, `rgba(100,116,139,0.30)` border).
- Artifact requirements section, three requirements stacked:
  - Requirement 1 (File upload): label "Before/after screenshots (2 required)." One slot shows a filled thumbnail preview (a stylized blurred screenshot). Second slot is empty with a dashed upload zone and "Upload file" affordance. Completion indicator: "1 of 2" in Slate-500.
  - Requirement 2 (Measured value): label "Page load time (ms) ≤ 3000." Numeric input field is empty. Completion indicator: empty state.
  - Requirement 3 (URL): label "Link to CI test run." URL field is empty. Completion indicator: empty state.
- The Pass button: `opacity: 0.45`, `cursor: not-allowed`, lock icon (Linear-style, 2px stroke, 16px, solid-filled) to the left of the "Pass" label in Inter 600. A sub-label below the button in Slate-500 Inter 400 12px (always visible, not a hover tooltip): *[working: "Upload 1 more screenshot and fill all required fields to enable."]*
- Below the Pass button row: "Mark as Failed" link (Inter 500, `#9A3F05` light) and "Skip" link (Slate-500) — confirming these alternate paths are accessible without artifacts.

The disabled button must read instantly as **blocked, not loading**: no spinner, no shimmer, the lock icon is a static solid-filled lock (not animating), full `cursor: not-allowed`. The opacity treatment is definitive. Per the established disabled treatment in homepage.md §1 and artifact-enforcement.md §1.

**Secondary element — spec state machine diagram** (below the two-column split, centered, `max-width: 640px`):
A quiet three-node horizontal flow diagram:
- Node 1: "Pending" — badge in pending recipe (`#ede9e2` bg, `#7a7166` text, `rgba(0,0,0,0.12)` border, light mode).
- Arrow connector (1px `--border-strong`, 24px, small arrowhead).
- Node 2: "In Progress" — badge in in-progress recipe (`#f1f5f9` bg, `#475569` text, `rgba(100,116,139,0.30)` border).
- Arrow connector branching to three terminal nodes: "Passed" (Go-700 `#007A4E` text on Go-100 `#D0FAE9` bg) · "Failed" (Error-600 `#E11D48` text on Error-100 `#FFE4E6` bg) · "Skipped" (Slate-500 `#64748B` text on `#F5F3EF` bg).
- One-line caption in Slate-500 Inter 400 14px below the diagram: *[working: "Failed and Skipped require a written reason. Only Passed requires artifacts."]*

The diagram uses exact badge tokens from brand-identity.md. No custom colors. The branching arrow is an SVG hairline. All badge text is DOM text (crawlable).

**Look & feel** — This step is the page's heaviest moment. The blocked Pass button is the single most important pixel on this page. The orange left-rule pull-quote isolates the "blocked, not warned, blocked" sentence so it lands at full weight. The spec state machine diagram is a structural footnote — visually subordinate (smaller, more muted, centered below the main split), but complete enough that the visitor understands all paths, not just the blocked one.

**Motion** — Spine draws from Step 3 to Step 4 node (600ms `--ease-out`), node pops in (`--ease-spring`). Text column fades+rises (400ms `--ease-page`). Screenshot fragment fades+rises 24px (700ms `--ease-page`, 100ms delay). Spec state machine diagram fades in last (200ms additional delay, 400ms `--ease-page`). Once only. **The disabled Pass button has no animation on entrance or at rest.** Not loading. Not transitioning. Just blocked.

**Interactivity** — The disabled Pass button shows a keyboard-focus tooltip: *[working: "Upload all required artifacts to enable."]*. Must be a real accessible tooltip (`role="tooltip"`, `aria-describedby`), not a CSS pseudo-element. The always-visible sub-label below the button carries the same information for non-keyboard visitors. Spec state machine nodes are not links. In-context links to `/features/artifact-enforcement` and `/use-cases/qa-teams`.

**SEO** — `<h2>` carrying: "execute specs," "blocked pass action," "artifact required," "spec state." The "blocked, not warned, blocked" sentence in the pull-quote is crawlable — do not render it as an image. Badge state labels in the state machine diagram are DOM text. Internal links to `/features/artifact-enforcement` and `/use-cases/qa-teams`. `<section aria-labelledby="step-4-heading">`.

---

## Section 6 · Step 5 — Make the go/no-go call

**Purpose** — Introduce the decision gate: available only when all specs are in a terminal state (passed / failed / skipped), Admin-only, specs sorted by severity (Critical first), mandatory written justification when going with failures. The decision is permanent — this is the moment the record is about to be sealed.

**Layout** — Default `--bg-page`. Two-column split, `max-width: 1100px`, **text-right / screenshot-left** (the column flip — signals the transition from execution to decision). Step 5 node anchored on the spine.

**What's shown** —

**Right column (text):**
Section label pill: *[working: "STEP 5 OF 6"]*. H2 step heading: *[working: "Make the call."]*. Body: *[working: "When all specs reach a terminal state — passed, failed, or skipped — the go/no-go decision screen becomes available. Only Admins can make the call."]*. Three mechanic bullets (Inter 400, 16px, contained in a left-bordered block `rgba(234,107,4,0.20)` 2px border, lighter than the pull-quote — for lists of mechanics, not singular emphasis):
- *[working: "Specs are sorted by severity — Critical failures at the top. The decision is informed by what matters most."]*
- *[working: "Going with failures on the record requires a written justification. It is stored in the sealed record, permanently."]*
- *[working: "Once the Admin clicks Go or No-Go, the decision cannot be edited, reversed, or deleted."]*

In-context link: *[working: "See the go/no-go gate in detail →"]* → `/features/go-no-go`.

**Left column (screenshot):**
A screenshot fragment showing the go/no-go decision screen. Full browser chrome. The screen shows:
- Run summary header: run name "v2.4.1 Release — QA Sign-off." Run status badge `Awaiting Decision` (`rgba(234,179,8,0.14)` bg, `#a16207` text, `rgba(202,138,4,0.30)` border — the pre-decision pending-yellow state).
- Spec summary row: "11 passed · 2 failed · 1 skipped" in Inter 500.
- Spec list sorted by severity: Critical specs first (2 rows, Error-600 severity badge, spec title, result badge `Failed` in Error-100 bg / Error-600 text), then High (1 row, `Skipped` badge in slate), then Medium and Low (all `Passed`, Go badge). The severity sort order and badges are visible — Critical failures at the top is the argument.
- "Written justification (required for Go with failures)" text area field, empty, with placeholder text in Slate-400: *[working: "Explain why proceeding is acceptable given the failures above."]*
- Two action buttons: "Go" (Inter 600, Go-700 `#007A4E` text, Go-100 `#D0FAE9` bg, `rgba(0,153,98,0.30)` border — green outlined) and "No-Go" (Inter 600, NoGo-700 `#A16207` text, NoGo-100 `#FEF9C3` bg, `rgba(202,138,4,0.30)` border — yellow outlined). Neither button uses the page's primary orange CTA treatment — they are semantic product-UI buttons.

All spec titles, badge labels, and field labels are DOM text. Geist Mono on the run ID. Inter on all user-facing copy.

**Look & feel** — The column flip and the return to default `--bg-page` communicate a transition: the execution phase is over. The "Awaiting Decision" badge in pending-yellow reads as a system prompt — something is waiting for a human action. The spec list sorted by severity is the key information-architecture argument of this step: the decision-maker sees the worst problems first, not a flat alphabetical list. The Go/No-Go buttons are semantic product colors, deliberately not orange — they are choices with consequences, not marketing CTAs.

**Motion** — Spine draws from Step 4 to Step 5 node (600ms `--ease-out`), node pops in (`--ease-spring`). Screenshot fades+rises from left (400ms `--ease-page`). Text column fades+rises with 100ms delay. Three mechanic bullets stagger-reveal at 0ms / 80ms / 160ms after text settles (each rises 12px, 300ms `--ease-page`). Once only. The Go/No-Go buttons in the screenshot do not animate.

**Interactivity** — Static screenshot. In-context link to `/features/go-no-go`. Mechanic bullets are plain text.

**SEO** — `<h2>` carrying: "go/no-go decision," "release gate," "Admin approval," "severity-sorted." Mechanic bullets are crawlable body text. Internal link to `/features/go-no-go`. `<section aria-labelledby="step-5-heading">`.

---

## Section 7 · Step 6 — The sealed record

**Purpose** — Show the completed run in its read-only state: three-layer immutability, the sealed badge, the shareable URL, and the browser print-to-PDF path for auditors. This is the page's resolution. The record is the proof.

**Layout** — `--bg-section-alt`. Two-column split, `max-width: 1100px`, **text-left / screenshot-right** (returns to the standard column order for the final step — the alternating pattern completes one full cycle across Steps 3–6, and this return signals closure). Step 6 node anchored on the spine. The spine terminates at Step 6's node — no line continues below it.

**The Step 6 node is the one visual departure from the numbered-node convention:** the circle retains the same 32px diameter and orange fill (`#EA6B04` light / `#F97316` dark), but the step number is replaced by a lock icon (Linear-style, 2px stroke, 16px, white fill). The lock on the final node communicates that the spine itself has closed — this step is not "do this action," it is "this is what you have when the process is complete." The departure is earned because Step 6 is the sealed state.

**What's shown** —

**Left column (text):**
Section label pill: *[working: "STEP 6 OF 6"]*. H2 step heading: *[working: "The sealed record."]*. Body: *[working: "The moment a Go or No-Go decision is recorded, the run is sealed. Three things become permanent simultaneously: the decision, the justification, and every artifact attached to every spec."]*. Three immutability bullets in a left-bordered block (`rgba(0,0,0,0.08)` 2px border light — neutral, not orange, because this is a system guarantee, not a user action prompt):
- *[working: "No spec result can be edited. No artifact can be removed. No justification can be rewritten."]*
- *[working: "The record is shareable via URL. Send the link to the compliance auditor — they see the same read-only view you do."]*
- *[working: "Print to PDF from the browser for a portable, formatted audit document. The sealed record is designed to be printed."]*

Honesty caption below the bullets (Slate-500 Inter 400 14px, visible, not hidden): *[working: "At launch: browser print-to-PDF and shareable URL. Dedicated audit-grade PDF and JSON export are on the roadmap."]*

In-context link: *[working: "Explore the audit trail →"]* → `/features/audit-trail`.

**Right column (screenshot):**
A screenshot fragment showing the sealed run record in read-only state. Full browser chrome. The screen shows:
- Run header: run name "v2.4.1 Release — QA Sign-off." Run status badge `Go` (Go-700 `#007A4E` text, Go-100 `#D0FAE9` bg, `rgba(0,153,98,0.30)` border, light mode). A `SEALED` label in Geist Mono 500 12px Slate-500, immediately adjacent to the Go badge.
- **Lock indicator**: a lock icon (Linear-style, 2px stroke, 20px, Slate-700 `#334155`) at the top-right of the run header panel. **This icon is static — it does not animate, pulse, or glow under any circumstance.** Phase 6: sealed things don't move. The lock communicates permanence through stillness, not motion.
- Attribution line: "Decided by: Sarah K. (Admin) · 2026-05-29 14:03 UTC" in Geist Mono 12px Slate-500.
- Justification block: a bordered read-only text area (`1px --border-default`, `border-radius: 10px`, `#F5F3EF` bg, no edit affordance, no cursor visible), content in Geist Mono 13px: *[working: "Two critical failures are in non-blocking UI paths; all revenue-critical specs passed. Proceeding with documented risk acceptance."]*
- Two inline secondary actions in Inter 500 14px: "Share link" (copy icon + label, Slate-700) and "Print to PDF" (printer icon + label, Slate-700). These are the launch-available export paths, styled as secondary actions — the record itself is the product of the page, not an action prompt.
- One collapsed spec row at the bottom of the fragment: spec title, `Passed` badge (Go recipe), artifact preview thumbnail — confirming read-only state of spec results.

All labels, justification text, badge text, and attribution lines in the fragment are DOM text. Geist Mono on all system-generated values (timestamps, run IDs, the `SEALED` label, the justification text). The justification text in Geist Mono signals "certified record output" — consistent with the Audit Trail feature page's compliance-formal register.

**Look & feel** — This step reads as complete: a `Go` badge, a lock that does not move, a justification in monospace, two quiet export paths. No orange CTAs inside the screenshot. No edit affordances. The fragment looks like a document, not an application panel. The `SEALED` label in Geist Mono is the authorial voice of the system saying this record is final. The neutral left-rule border on the immutability bullets (no orange) communicates that these are system facts, not user prompts — a deliberate register shift from Step 4's orange pull-quote.

**Motion** — Spine draws from Step 5 to Step 6 node (600ms `--ease-out`). Lock-node circle fades in at full opacity; lock icon scales in with `--ease-spring` (scale 0.5→1.0, 300ms). **After the lock icon settles, it never animates again.** Text column fades+rises (400ms `--ease-page`). Screenshot fragment fades+rises 24px (700ms `--ease-page`, 100ms delay). Three immutability bullets stagger-reveal at 0ms / 80ms / 160ms after text settles. Honesty caption fades in with the bullet group. Once only.

**What does NOT animate in this section — explicit list:**
- The `SEALED` badge in the run header — static at all times.
- The `Go` status badge — static.
- The lock icon in the run header screenshot — static. No pulse, no glow, no shimmer.
- The lock icon on the step node — animates in once on entrance (scale pop), then static forever after.
- The justification text area — no typing animation, no typewriter effect.

**Interactivity** — Static screenshot. The "Share link" and "Print to PDF" elements in the screenshot are not interactive (it is a read-only fragment). In-context link to `/features/audit-trail`. The honesty caption is plain text.

**SEO** — `<h2>` carrying: "sealed run record," "immutable," "audit," "print to PDF," "shareable URL." Immutability bullets and honesty caption are crawlable body text. The `SEALED` label, "Go" badge text, Geist Mono attribution, and justification text in the fragment are DOM text. Internal link to `/features/audit-trail`. `<section aria-labelledby="step-6-heading">`.

---

## Section 8 · Final CTA — "Start building your first playbook."

**Purpose** — The conversion close. The visitor has read the full six-step loop and understands exactly what they are adopting. Remove friction and invite them to begin.

**Layout** — Default `--bg-page`. Centered, full-width, ~120px top/bottom padding. Display headline, sub-copy line, primary CTA, secondary CTA link, closing line. The standard "Ship it once." closing rhythm per Phase 12 §"Shared across all pages."

**What's shown** — H2 headline in DM Sans 600 (48px desktop / 32px mobile): *[working: "Start building your first playbook."]*. Sub-copy in Inter 400 Body Large (18px), centered, `max-width: 640px`: *[working: "One seat, full enforcement, all six artifact types. Free, forever. No credit card."]*. Primary CTA button: "Start free" → `/signup` (Orange-600 `#EA6B04` fill light / Orange-500 `#F97316` dark, white Inter 600 label, `border-radius: 10px`, standard button recipe). Secondary CTA as a text link (Inter 500, `#9A3F05` light): "See the pricing →" → `/pricing`. Closing line in Slate-500 Inter 400 14px: "Ship it once."

No product UI in this section — this is the exhale.

**Look & feel** — The one sanctioned atmospheric warm radial: `radial-gradient(ellipse at center, rgba(234,107,4,0.08) 0%, transparent 70%)` centered behind the headline, light mode; `radial-gradient(ellipse at center, rgba(249,115,22,0.10) 0%, transparent 70%)` dark mode. Per homepage.md §11 — the only permitted atmospheric touch, and it must read as warmth, not a visible glow shape.

**Motion** — Headline + sub-copy + CTA row fade+rise on reveal (400ms `--ease-page`). CTA hover: background-color shift + 1px border emphasis, 150ms, no scale, no bounce. "Ship it once." closing line fades in last (200ms additional delay). Once only.

**Interactivity** — Primary CTA → `/signup`. Secondary link → `/pricing`. "Ship it once." is plain text.

**SEO** — `<h2>` reinforcing the page's primary vocabulary ("playbook," "free," "enforcement"). Sub-copy crawlable. Internal links to `/signup` and `/pricing`. `<section aria-labelledby="final-cta-heading">`.

---

## Narrative arc

*Frame* (§1: one sentence — the thesis) → *Design* (§2–§3: the author's world — build once, declare evidence) → *Snapshot* (§4: the handoff moment — the run is now its own frozen thing) → *Block* (§5: the gate holds — the page's visceral moment) → *Decide* (§6: the call, informed by severity, permanent) → *Seal* (§7: the record, immutable, exportable, honest) → *Convert* (§8: start free).

The visitor's emotional trajectory: curiosity → recognition (the authoring model is familiar; it resembles what they already do) → surprise (the snapshot behavior is distinctive — edits to the template don't affect running releases) → visceral understanding (the Pass button is blocked, not warned) → trust (the decision is Admin-only and permanent) → confidence (the record is the proof, and it exists forever) → low-friction conversion (free, no credit card).

Steps 4 (blocked) and 6 (sealed) are the two emotional climaxes and are designed accordingly. The pull-quote treatment in Step 4 (orange left-rule, Inter 600) and the static lock icon in Step 6 (the only element on the page that never animates) are the two moments where the design language departs from neutral to say: *this is the point.*

Everything else is structural connective tissue. The spine draws the eye through each step, one node at a time, making a page that could feel like an endless scroll feel like a guided sequence.

---

## Interaction & Animation summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Spine draw (per step) | height 0→N of segment | 600ms `--ease-out` | once per step on scroll-in | Drives pacing; fires before node and content |
| Step node entrance (Steps 1–5) | scale 0.5→1.0 | 300ms `--ease-spring` | once per step | After spine segment completes |
| Step 6 lock-node entrance | scale 0.5→1.0 | 300ms `--ease-spring` | once | Same timing; fully static after settling |
| Section entrance (all) | opacity 0→1 + translateY(24px→0) | 400ms `--ease-page` | once on view | Per global treatments |
| Screenshot fragment entrance | opacity 0→1 + translateY(24px→0) | 700ms `--ease-page`, 100ms delay | once | After text column |
| Mechanic bullet stagger (§6, §7) | opacity 0→1 + translateY(12px→0) | 300ms `--ease-page`, 80ms between | once | After text column settles |
| Spec state machine diagram (§5) | opacity 0→1 | 400ms `--ease-page`, 200ms delay | once | After main columns |
| Card hover | translateY(-4px) + shadow deepen | 200ms `--ease-out` | per hover | Standard global treatment |
| CTA hover (§8) | bg-color shift + 1px border | 150ms | per hover | No scale, no bounce |
| Disabled Pass button (§5 fragment) | none | — | never | Blocked, not loading — static |
| `SEALED` badge (§7 fragment) | none | — | never | Phase 6: sealed things don't move |
| `Go` status badge (§7 fragment) | none | — | never | Phase 6: result badges at rest are static |
| Lock icon in run header (§7 fragment) | none | — | never | Phase 6: sealed things don't move |
| Lock icon on Step 6 node | scale 0.5→1.0 once on entrance | 300ms `--ease-spring` | once | Fully static after settling |
| Orange pull-quote left-rule (§4, §5) | none | — | — | Structural element, not animated |

All motion suppressed under `prefers-reduced-motion`. Content renders in final state immediately. No exceptions.

---

## Responsive behavior summary

**≥1040px (desktop):** Full two-column alternating layout. Spine visible in left gutter, full-height. Step nodes at 32px diameter. Screenshots at specified widths within the column.

**768–1039px (tablet):**
- Two-column layouts stack: text above, screenshot below, regardless of desktop column order. Screenshots scale to 100% content width with side padding.
- Spine collapses. Sticky step-counter row appears below the nav (`position: sticky; top: 64px`), updating as each step enters the viewport. Counter uses section-label pill recipe.
- Spec state machine diagram (§5): scales down to content width; nodes may reduce to badge-size for legibility.

**<768px (mobile):**
- All layouts single-column, text before screenshot.
- Spine and sticky counter hidden. Step label pill within each section label (e.g., "STEP 4 OF 6") serves as step indicator.
- Disabled Pass button (§5): minimum 44×44px touch target even in its disabled state. Always-visible sub-label below the button remains visible; replaces hover tooltip.
- Spec state machine diagram (§5): stack the three terminal states vertically beneath the In Progress node; hide the branching arrow; show three separate badge rows.
- Step 6 lock node: retains the lock icon treatment (does not revert to a number) — the visual closure is more important than sequential consistency at mobile.

**<576px:**
- H1 (§1): 46px per the brand type scale.
- Step screenshots: crop tighter. Step 5 (§5): crop to disabled Pass button + artifact requirement slots. Step 6 (§7): crop to run header (Go badge + SEALED label + lock icon) + justification block.
- Browser chrome: retain URL text, hide traffic-light dots.

---

## Cross-page navigation

| Link text | Destination | Section |
|---|---|---|
| "See how enforcement is configured on a spec →" | `/features/artifact-enforcement` | §2 (Step 1) |
| "See the six types in detail →" | `/features/artifact-enforcement#artifact-types` | §3 (Step 2) |
| "See how enforcement works →" | `/features/artifact-enforcement` | §5 (Step 4) |
| "See how QA teams use enforcement →" | `/use-cases/qa-teams` | §5 (Step 4) |
| "See the go/no-go gate in detail →" | `/features/go-no-go` | §6 (Step 5) |
| "Explore the audit trail →" | `/features/audit-trail` | §7 (Step 6) |
| "See the pricing →" | `/pricing` | §8 (Final CTA) |

**Inbound links to this page:**
- Homepage §5 "How it works (compressed)" — the "See the full walkthrough →" link.
- All three feature pages (each links back to `/how-it-works` in their closing sections).
- The homepage compressed stepper step nodes each link to the matching anchor (`/how-it-works#step-N`) on this page.

This page is the hub of the feature triangle. It links to all three feature pages contextually within the steps they correspond to, and all three feature pages link back to it. A visitor arriving from any feature page lands in the full loop context. A visitor who reads all six steps leaves with pointers to the deep-dives.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal — six-step sequential narrative, progress spine, two signature moments (Step 4 blocked / Step 6 sealed), full section-by-section spec, motion summary, responsive behavior, cross-page navigation table. |
