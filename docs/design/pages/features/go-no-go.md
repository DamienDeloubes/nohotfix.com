# Page: Go/No-Go Decision Gate — Design + Information Architecture

**Part of the feature set** — read [README.md](README.md) first for the shared archetype, global treatments, sticky-nav (§0) spec, cross-page navigation, and the set-level motion + responsive summaries. This file records only this page's sections and deviations.

**URL**: `/features/go-no-go`
**Pillar headline**: The release decision, made once and locked.
**Conversion goal**: Start free

---

## SEO intent cluster

- Primary intent: "go no-go decision software," "release go/no-go process," "release approval workflow," "Admin-only release decision"
- Single `<h1>`: *[working: "The release decision, made once and locked."]*
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Features → Go/No-Go Gate)
- Internal links to: `/features/artifact-enforcement`, `/features/audit-trail`, `/how-it-works`, `/use-cases/engineering-managers`, `/pricing`
- Crawlable claims: "Admin-only," "mandatory justification," "severity-sorted," "permanent" in live text

(Shared SEO rules — single h1, semantic landmarks, crawlable DOM labels, LCP target, OG image — are in [README.md](README.md) §"SEO discipline.")

---

## Sitemap order reconciliation

Sitemap specifies six sections: (1) hero statement, (2) decision screen contents, (3) role gating, (4) justification requirement, (5) after the decision, (6) final CTA. This proposal preserves that order exactly. No additions or changes. The sitemap order is well-structured for this page's argument and needs no refinement.

---

## Section 0 · Sticky navigation

See [README.md](README.md) §"Sticky navigation" and homepage.md §0. Current page indicator: "Go/No-Go Gate" item in the Features dropdown shows active state.

---

## Section 1 · Hero — "The release decision, made once and locked."

**Purpose** — Establish the governance claim in one viewport: this is a formal, role-gated decision with a permanent record — not an informal "are we good to go?" in Slack.

**Layout** — Single column, centered, `min-height: 100vh`. Top-to-bottom: section label pill → H1 hero statement → sub-paragraph → CTA row → hero product-UI fragment.

Hero fragment in browser chrome, `max-width: 960px`, light screenshot treatment. The fragment shows the go/no-go decision screen as it appears when all specs are terminal and the Admin is reviewing before making the call.

**What's shown** — The hero fragment is the decision screen:

**Top of the decision screen**: A run header showing run name (Geist Mono, e.g., `v4.2.1 — Staging`), playbook name, and a status badge `Awaiting Go/No-Go` in a Slate badge. Below it, a summary bar: `11 Passed · 2 Failed · 1 Skipped` — the counts rendered in their respective semantic colors (Go-700 for passed count text; Error-600 for failed count text; Slate-500 for skipped count text on light).

**Spec list (center of the frame)**: Three visible spec rows (representative sample), sorted by severity with failed specs surfaced first:
- Row 1: `Critical` severity badge (Error-600 text, Error-100 bg), spec title, result badge `Failed` (same Error treatment), executed-by name, timestamp.
- Row 2: `High` severity badge (NoGo-700 text, NoGo-100 bg), spec title, result badge `Passed` (Go-700 text, Go-100 bg).
- Row 3: `Medium` severity badge (Slate-500 text, Slate-100 bg), spec title, result badge `Passed`.
- A "...and 11 more specs" quiet indicator below the visible rows — suggesting the full list is scrollable.

**Decision action panel (bottom of the frame)**: Two action buttons side-by-side. `Go` button: Go-600 border, Go-50 bg, Go-700 text — available but not yet clicked. `No-Go` button: NoGo-600 border, NoGo-50 bg, NoGo-700 text — also available. Neither is highlighted (the Admin hasn't decided yet). Below the buttons: a text area field with a placeholder: *[working: "Written justification is required if any specs are failed (2 are failed in this run)"]*. The field is the key visual anchor — it communicates the mandatory-justification mechanic before the copy explains it.

**Look & feel** — Warm-white canvas, DM Sans 700 hero headline. The decision screen fragment reads as the most important surface in the product — it is where the formal call is made. Status badges in exact v5 semantic colors (no approximations). Geist Mono on the run ID and timestamps. Inter on all labels. The failed spec row in the list carries a faint Error-50 row background tint to surface it visually — `rgba(255,228,230,0.5)` on light.

*[working hero H1: "The release decision, made once and locked."]*
*[working sub: "Only Admins can make the call. Only after every spec is terminal. A Go with failures requires a written justification, recorded permanently."]*

**Motion** — Standard choreographed page entrance: pill → H1 → sub-paragraph → CTA row → hero fragment (slides up 24px + fades, 700ms after CTAs). All `--ease-page`. Once only. The decision screen fragment has no idle animation — buttons do not pulse, the text area cursor does not blink. This is a decisive moment; it does not perform urgency.

**Interactivity** — The Go and No-Go buttons in the fragment show a hover state on desktop (Go button: `rgba(0,153,98,0.12)` bg tint; No-Go button: `rgba(202,138,4,0.12)` bg tint) — not clickable, but the hover teaches the interaction model. The text area shows a focus-style ring on hover to indicate it is a required field. Neither button is actually interactive — the fragment is a faithful static representation.

**SEO** — Only `<h1>` on the page. Sub-paragraph text is live DOM — "Admin-only," "terminal," "mandatory justification," "permanent" are crawlable. Decision screen spec row labels are DOM text. `alt` on `<img>` fallbacks: *"NoHotfix go/no-go decision screen showing a spec list sorted by severity with two failed specs and a mandatory justification field."*

---

## Section 2 · What the decision screen shows

**Purpose** — Give the VP Engineering or QA Director a complete picture of the information available at the moment of decision. This section makes the case that the decision is made with full visibility — no surprises, no guesses.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-sentence, then a **two-column layout** at `max-width: 1100px`. Left column (~45%): a vertical list of four annotated items. Right column (~55%): a cropped product fragment of the decision screen with callout annotations.

**What's shown** — Left column: four items, each with a small icon, a short heading (Inter 600 H3), and one body line:

1. *[working heading: "Full spec list, sorted by severity."]*. Body: *[working: "Critical and high-severity specs are reviewed first. Every failed spec is visible before the call is made."]*
2. *[working heading: "Outcome counts at a glance."]*. Body: *[working: "X passed, Y failed, Z skipped — the summary is the first thing the Admin sees."]*
3. *[working heading: "Out-of-tolerance measurements surface explicitly."]*. Body: *[working: "If a measured-value spec breached its threshold, that is flagged here — so the Admin knows before deciding."]*
4. *[working heading: "Role gate: Admins only, specs all terminal."]*. Body: *[working: "The screen is inaccessible until every spec has a result. Members cannot trigger a decision. The gate is structural, not trust-based."]*

Right column: A cropped fragment of the decision screen (a different angle from the hero — this time showing the spec list scroll with more rows visible, emphasizing the full-visibility claim). The fragment uses numbered callout annotations (1–4) in small orange circles pointing to the corresponding elements — summary bar, severity sort, a threshold-warning indicator on a measured-value row, and the Admin-only role badge. Callout annotations are rendered as DOM overlays, not baked into the image.

**Look & feel** — Left column reads as a structured explainer. Right column reads as evidence. The fragment is the same screenshot treatment as the hero. Annotations are small orange filled circles (`#EA6B04`, 20px diameter, white number inside, Inter 600) — exactly two orange elements in the viewport (annotations + section label pill); the CTA is below the fold at this scroll position. If three callouts are in-view simultaneously, the annotation circles count against the two-orange-elements-per-viewport rule — use Slate-700 circles for callouts 3 and 4, reserving orange for the two most important (severity sort and role gate).

**Motion** — Section entrance: H2 + sub-sentence fade+rise. Left-column items stagger in at 0/100/200/300ms, each rising 16px. Right-column fragment fades in at 150ms after the first left-column item. Callout annotations pop in with `--ease-spring` scale (0.5→1.0), staggered 80ms each, after the fragment fades in. Once only.

**Interactivity** — Hovering a left-column item highlights the corresponding callout annotation on the right fragment (annotation circle scales to 1.1×, 150ms `--ease-out`). This is a paired-hover interaction — the only interactive element in this section. Keyboard-accessible: focus on each left-column item triggers the same highlight behavior via `aria-controls` + JavaScript.

**SEO** — `<h2>` + four `<h3>` items with vocabulary: "severity," "failed," "terminal," "role gate." Body text crawlable. Fragment labels are DOM text.

---

## Section 3 · Role gating

**Purpose** — Explain the Admin-only requirement and why it is structural, not configurational. The governance argument for the VP Engineering persona.

**Layout** — Default background. Section label pill + H2 + sub-paragraph, then a **single product-UI fragment** at `max-width: 760px`, centered. Below the fragment, a short clarifying paragraph.

**What's shown** — The fragment shows what a non-Admin Member sees when they attempt to access the go/no-go screen: a clean message rendered inside the decision screen layout. The screen header is present (run name, playbook, status badge), but the decision action area is replaced with a quiet informational state: a lock icon (Slate-400, 2px stroke, 24px), and below it the text: *[working: "Only Admins can make the go/no-go decision. This run is awaiting a decision from an Admin."]*. Below that, a quiet "Who are the Admins?" expandable link (no full dropdown in the fragment — just the affordance visible). The overall impression: this surface exists for the Member to see that the decision is pending; it gives them no ability to act.

Supporting paragraph below the fragment: *[working: "The Admin-only gate is not a permission setting — it cannot be toggled off. The go/no-go decision is a formal accountability act. It requires a named decision-maker and a permanent record. That requires a role boundary."]*

**Look & feel** — The fragment is deliberately quieter than the hero fragment. It shows an inactive state — the purpose is to communicate the gate, not to show a busy operational screen. The lock icon and the informational text are the entire content. Slate colors throughout the gate message (no orange here — orange belongs to CTA and labels).

**Motion** — Standard section entrance. Fragment fades in after the heading. No idle animation on the lock icon (Phase 6 applies here too — locked states don't move).

**Interactivity** — The lock icon does not animate on hover. The "Who are the Admins?" expandable link shows a hover state (underline, Orange-800 text) but does not open an actual dropdown in this static fragment.

**SEO** — `<h2>` with "Admin-only," "role gate." Supporting paragraph body text crawlable. Internal link at section close: *"See roles and permissions in the docs →"* → `/docs` (deferred to an actual docs URL when docs exist).

---

## Section 4 · The justification requirement

**Purpose** — Show the mandatory written justification for a Go decision with failed specs. This is the section that makes the governance argument concrete: a Go with failures is not a bypass — it is a documented, permanent decision with a named author.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-paragraph, then a **large, faithful product fragment** of the justification flow, `max-width: 800px`, centered. Then two body paragraphs below the fragment.

**What's shown** — The fragment shows the decision confirmation overlay as it appears when the Admin clicks "Go" with two failed specs. This is the elevated card treatment (modal/overlay): `background: #FFFFFF`, `border: 1px solid rgba(0,0,0,0.10)`, `border-radius: 20px`, `box-shadow: shadow-3`.

Inside the overlay:
- Heading: *[working: "Go decision — 2 specs failed"]*. Inter 600, H4.
- A quiet error-tinted informational row: *[working: "The following specs were failed at time of this decision. You must justify proceeding:"]*. Error-50 background tint, Error-600 text, small warning icon.
- A short list of the two failed specs: spec title + severity badge each.
- A text area with a required indicator: *[working label: "Written justification (required)"]*. The text area contains a Geist Mono placeholder text: *[working placeholder: "e.g., Known issue — will be resolved in the next release. Stakeholder accepted risk."]*. The text area border is `1px solid rgba(0,0,0,0.14)` — the `--border-strong` token.
- Below the text area, the Confirm button is disabled (`opacity: 0.45`, lock icon) with label: *[working: "Write justification to confirm"]*.
- A "Cancel" text link in Slate-600 beneath.

Body paragraph 1 below the fragment: *[working: "The justification is not optional. It is not stored in a comment or a separate note — it is written into the go/no-go decision record and sealed when the run is sealed. The record will always include exactly what the Admin wrote and which specs were failed at the moment of the call."]*

Body paragraph 2: *[working: "This is not a bureaucratic hurdle. It is the record of what was known, what was decided, and who made the call — before the release went out, not after something went wrong."]*

**Look & feel** — The overlay is the single most important visual in this section. The warm-white elevated card on the warm-white page background uses shadow-3 to lift it clearly. The failed spec list inside the overlay carries a subtle Error-50 row tint — the same treatment as the hero fragment's failed row. Geist Mono in the text area placeholder communicates that this is a real data field, not a design sketch.

**Motion** — Section entrance: heading fades+rises, then the overlay fragment fades in (no scale animation — it is showing a static state, not a modal opening). Body paragraphs stagger in 150ms after the fragment. Once only.

**Interactivity** — The fragment is static. The Confirm button tooltip on hover: *[working: "Write the justification to enable confirm"]*. The Cancel link shows Orange-800 hover state to indicate it is a real control in the product.

**SEO** — `<h2>` with "justification," "Go with failures," "permanent." Body text crawlable. Internal link: *"See the full audit trail →"* → `/features/audit-trail`.

---

## Section 5 · After the decision

**Purpose** — Complete the arc: what happens the moment the decision is confirmed? The run is sealed. The record exists. This section serves two purposes — it closes the feature explanation and primes the visitor for the Audit Trail feature page.

**Layout** — Default background. Section label pill + H2 + sub-paragraph, then a single **compact product fragment** and a short two-item summary list.

**What's shown** — The fragment shows the run immediately after a Go decision is recorded. Run header with the `Go` status badge (prominent, Go-700 text, Go-100 bg, 24px — large enough to be the first thing the eye resolves). Below the header: the go/no-go decision record block, rendered as a "compliance receipt" — a visually distinct panel with: decision label "Go," decision maker name, timestamp in Geist Mono, and — because this run had failed specs — the justification text rendered in the panel. No edit controls anywhere in the fragment. A quiet `SEALED` label in Geist Mono 500 Slate-400 in the header area.

Two-item list below the fragment:
1. *[working: "The run is immediately read-only. No tester, no Admin, no one — can alter what happened."]*
2. *[working: "The record includes the full spec list, every artifact, the decision, the decider, the timestamp, and the justification. Send the URL to anyone who needs to see it."]*

*(Email notification on decision: not mentioned here. The sitemap notes this is post-launch. Do not reference it.)*

**Look & feel** — The `Go` status badge dominates the fragment by design. It is Go-700 text on Go-100 background — unmistakably green, unmistakably terminal. The `SEALED` label is quiet and secondary — the badge communicates the outcome, the label communicates the state. The decision record block is visually distinct from the spec list area (a hairline rule above it, slightly more padding, Geist Mono on all timestamps and identifiers).

**Motion** — Standard section entrance. Fragment fades in after heading. List items stagger 100ms each. No idle animation on the sealed badge (Phase 6).

**Interactivity** — Fragment is static. Link at section close: *"Explore the Audit Trail →"* → `/features/audit-trail`.

**SEO** — `<h2>` with "sealed," "read-only," "record." Internal link to `/features/audit-trail`.

---

## Section 6 · Final CTA — "Start for free"

**Purpose** — The conversion close. Matching the shared closing rhythm.

**Layout** — Centered, full-width, ~120px top/bottom padding. Display headline, sub-copy, primary CTA, quiet secondary.

**What's shown** — *[working H2: "Start for free."]*. *[working body: "One seat, full enforcement, the go/no-go gate, sealed records. No credit card."]*. Primary CTA: "Start for free" → `/signup`. Secondary CTA: "Talk to us" → `/contact` (for the VP Engineering / enterprise path). Closing tagline: "Ship it once."

**Look & feel** — Sanctioned warm radial. Same treatment as homepage §11 and artifact enforcement §6.

**Motion** — Heading + CTA fade+rise on reveal. CTA hover: 150ms background shift, no scale.

**Interactivity** — Primary → `/signup`. Secondary → `/contact`.

**SEO** — `<h2>` reinforcing the mechanic. Final internal links to signup and contact.

---

## Narrative arc

*Claim* (hero) → *Full picture* (what the decision screen shows: Admin sees everything) → *Boundary* (role gating: structural, not trust-based) → *Accountability* (justification: even a Go with failures is documented) → *Outcome* (after the decision: the record exists) → *Convert* (start free).

The visitor (VP Engineering persona) moves from "I make this call informally in Slack" to "there is a formal interface designed for exactly this" to "it protects me — the record shows what I knew before I shipped" to "I can start today." Each section builds the governance argument without using the word "governance."
