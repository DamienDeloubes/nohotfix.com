# Use Case: QA Teams — Design + Information Architecture

**Product**: NoHotfix
**URL**: `/use-cases/qa-teams`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. Copy is indicative working text, not final.
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md `/use-cases/qa-teams` entry
**Part of the use-case set**: `/use-cases/qa-teams` · `/use-cases/compliance` · `/use-cases/engineering-managers` — read the shared-archetype notes in website-vision.md Phase 12 before this file. The three pages cohere as a set; this file specifies only what is unique to the QA Teams page.

---

## How to read this document

This is a **section-by-section design spec** for the QA Teams use-case page. It does not finalize marketing copy — bracketed lines like *[working: "…"]* are placeholders communicating intent and length. The same conventions as homepage.md and features/README.md apply here.

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

**Locked decisions for this page:**

- **Shared archetype**: pain-first. The hero is a pain-acknowledgment statement in DM Sans 700, not a product screenshot. The emotional register differs from feature pages: empathy first, mechanic second.
- **Core device**: matched pairs — each named pain on the left, the specific NoHotfix mechanic that resolves it on the right. This is the spine of the page.
- **Product-proof band**: one real UI screenshot anchors the persona's primary mechanic (spec library + enforcement).
- **Testimonial slot**: a reserved placeholder card — no fabricated quote, no stock face, no logo.
- **Persona accent color**: Orange-500 (`#F97316`) — applied to the section label pill, the matched-pair markers, and the top accent stripe on the lead card. Never as a background fill.
- **Conversion goal**: Start free. Every CTA on this page points to `/signup`.
- **Internal links**: `/features/artifact-enforcement` (primary mechanic), `/how-it-works`, `/pricing`.
- **No fabricated social proof** — no customer logos, fabricated traction stats, or invented testimonials.

---

## Global treatments (do not redefine — reference only)

All items from homepage.md §"Global treatments" and features/README.md §"Global treatments" apply verbatim. The items below are reminders of which tokens govern this page — no new treatments are introduced.

- **Theme**: light-first `--bg-page #FAFAFA`, dark co-equal `#111110`. `prefers-color-scheme` default.
- **Section rhythm**: 120–160px vertical padding desktop. Sections are rooms. Alternating sections use `--bg-section-alt` (`#F4F4F5` light / `#161513` dark).
- **Section entrance motion**: `opacity 0→1` + `translateY(24px→0)`, 400ms, `--ease-page`. Once on scroll-into-view.
- **Section label pills**: all-caps Inter 500 13px. Light: Orange-600 text `#EA6B04`, `rgba(234,107,4,0.10)` bg, `rgba(234,107,4,0.20)` border. Dark: Orange-500 text, `rgba(249,115,22,0.10)` bg.
- **Cards**: solid recipe both themes. Light: `#FFFFFF`, `1px solid rgba(0,0,0,0.08)`, shadow-1. Dark: `#1E1D1B`, `1px solid rgba(255,255,255,0.09)`, inset top highlight, shadow-1. Hover: `translateY(-4px)` + shadow deepen, 200ms `--ease-out`.
- **Typography**: DM Sans 700 hero H1 (display scale), DM Sans 600 section H2 (36px / -0.025em). Inter for body, labels, buttons. Geist Mono for product data.
- **Orange discipline**: max two orange elements per viewport. CTAs `#EA6B04` light / `#F97316` dark. Inline links `#9A3F05` light. Never orange as a section background beyond a ≤10% tint.
- **Screenshot treatment (light)**: `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`. No glow.
- **Persona accent**: Orange-500 (`#F97316`) applied as the top-edge stripe on the lead card and the matched-pair marker circles. The pill uses Orange-600 on light (as all section label pills do). Orange-500 is not the fill of any large surface.
- **`prefers-reduced-motion`**: disables all animation. Content renders in final state immediately. No exceptions.

---

## SEO intent cluster

- Primary intent: "QA checklist enforcement," "release readiness for QA teams," "stop chasing testers for evidence," "artifact-gated QA process"
- Single `<h1>`: *[working: "Stop chasing testers for screenshots."]*
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Use Cases → QA Teams)
- Internal links: `/features/artifact-enforcement`, `/how-it-works`, `/pricing`
- Crawlable claims: "blocked," "enforced," "spec library," "reusable," "write once," "live in an afternoon" — all in live DOM text

---

## Section 0 · Sticky navigation

See homepage.md §0 — identical treatment. Current page indicator: "Use Cases" nav item in the active state; "QA Teams" item within the Use Cases dropdown shows the active Orange-600 underline. No deviations.

---

## Section 1 · Hero — Pain acknowledgment

**Purpose** — Land in the QA Lead's daily reality in the first viewport. This is not a product hero — it is an acknowledgment of the job before it is explained how NoHotfix helps. The emotional register is: *"we know what your day looks like."* The visitor must feel seen before they feel sold to.

**Layout** — Single column, centered, `min-height: 90vh`. Top-to-bottom: section label pill → H1 pain statement → pain inventory (four short lines) → CTA row → trust micro-line. No product UI fragment in the hero — the pain acknowledgment stands alone. The hero is pure copy: this is the structural differentiator between the use-case archetype and the feature-page archetype.

**What's shown** — Section label pill: `QA TEAMS` (standard pill, Orange-600 text on `rgba(234,107,4,0.10)` bg). Below it, the H1 in DM Sans 700 at display scale (74px desktop / 46px mobile). Below the H1, a **pain inventory**: four lines in Inter 400, Body Large (18px, 1.6 line-height), each preceded by a quiet em dash or hairline bullet rendered in Slate-400. Lines read as a list of recognizable failures, not rhetorical questions. Then the CTA row: one primary orange button + one secondary text link. Then a trust micro-line in Inter 400 Body Small (14px, Slate-500): a short factual assurance.

*[working H1: "Stop chasing testers for screenshots."]*

*[working pain inventory — four lines:]*
- *[working: "— Testers mark specs as passed without running them."]*
- *[working: "— Screenshots uploaded after the fact — or not at all."]*
- *[working: "— New team members miss steps the veterans never skip."]*
- *[working: "— An auditor asks for evidence. You spend three days reconstructing it."]*

*[working CTA: primary "Start for free" → `/signup`; secondary "See how it works →" → `/how-it-works`]*

*[working trust micro-line: "One seat. Full enforcement. No credit card. Live in an afternoon."]*

**Look & feel** — Warm-white canvas. DM Sans 700 headline is the loudest element. The pain inventory reads as a quiet indictment: no caps, no exclamation marks, no rhetorical framing. The em-dash bullets are a typographic choice — they look like a list someone dictated aloud, not a marketing slide. Each line ends without punctuation drama. This restraint makes the pain feel real, not performed. Orange appears on exactly two things in the first viewport: the logo fire glyph and the primary CTA. The section label pill is the third orange touch but sits above the fold at low visual weight — acceptable.

**Motion** — Choreographed entrance, once: section label pill fades in (600ms after load) → H1 fades+rises 24px (500ms, `--ease-page`) → pain inventory lines stagger in 80ms apart, each rising 12px → CTA row fades+rises → trust micro-line fades. All `--ease-page`. No hero product preview to wait for — the entrance is fast.

**Interactivity** — Primary CTA hover: background-color shift `#EA6B04 → #C05A00`, 150ms. No scale. Secondary link shows Orange-800 underline on hover. The pain inventory lines are not interactive — they are statements, not links.

**SEO** — Only `<h1>` on the page, in live text. Pain inventory is crawlable Inter text — the specific phrases "screenshots," "passed without running," "reconstructing" are long-tail QA search vocabulary. CTA is real `<a href="/signup">`. Trust micro-line is DOM text.

---

## Section 2 · How NoHotfix addresses each — matched pairs

**Purpose** — The mechanical answer to each pain named in the hero. This is the load-bearing section of the page: the matched pair layout is the core device of the use-case archetype, and this page must execute it with discipline. Each pair closes the loop opened in the hero inventory. By the bottom of this section, the visitor knows the exact mechanic that resolves their exact problem — not a vague feature name.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-sentence, then **four matched-pair rows**, one per pain from the hero. Each row: two columns at `max-width: 1000px`, 50/50 split. Left column: the pain (framed as a named failure — short, honest). Right column: the mechanic (specific, jargon-free, written as "the system does X"). A thin hairline rule separates rows. The left column carries a small marker circle (24px diameter, Orange-500 fill on light / Orange-500 on dark, white number inside, Inter 600 12px) numbered 1–4, echoing the hero inventory order. Between the two columns, a thin connector stroke (1px, Slate-300 / Slate-500 dark) runs horizontally with a small arrow-right glyph at the midpoint — a structural line, not a decorative one. It communicates "pain → resolution" without text.

On mobile (<768px): the connector is hidden; rows stack (pain above, mechanic below), with the numbered circle sitting above the pain line.

**What's shown** — The four pairs:

**Pair 1 — "Testers mark specs as passed without running them."**
- Left: *[working: "A tester marks a spec passed. No screenshot, no log, no verification. The run completes. The evidence never arrives."]*
- Right: *[working: "The Pass button is disabled. It does not warn — it does not allow. The spec cannot be marked passed until every required artifact is attached. This is not a policy. It is a mechanical constraint."]*

**Pair 2 — "Screenshots uploaded after the fact — or not at all."**
- Left: *[working: "The screenshot request goes out after the run. Some arrive. Some don't. The record is incomplete and reconstruction is guesswork."]*
- Right: *[working: "Artifacts are attached before the spec can pass. The system collects the evidence at the moment the work happens — not two days later when you ask for it."]*

**Pair 3 — "New team members miss steps the veterans never skip."**
- Left: *[working: "A new tester runs a playbook for the first time. They don't know which specs have tricky gotchas. Veterans know. The knowledge isn't in the playbook."]*
- Right: *[working: "The spec library holds every artifact requirement, every step definition. New members run the same spec as veterans — the system holds the institutional knowledge, not the individual."]*

**Pair 4 — "An auditor asks for evidence. You spend three days reconstructing it."**
- Left: *[working: "The auditor asks for evidence on a release from six months ago. You dig through Slack, email, and screenshots folders. The record was never in one place."]*
- Right: *[working: "Every run produces a sealed, permanent record before anyone asks for it. Send the URL. That's it."]*

**Look & feel** — The left column reads in Slate-700 (`#334155`) — slightly muted, because it is describing a bad state. The right column reads in `--text-primary` (`#111110`) — full weight, because it is the answer. This color contrast communicates directionality without an arrow. The numbered circles are the only orange fills in this section — they count against the orange-per-viewport budget, so the section label pill above the H2 uses the standard pill recipe (which is borderline — if both the pill and four circles land in the same scroll position, reduce the pill's orange presence by increasing its bg opacity and reducing the border weight, or omit the pill on this section only). The connector arrow is Slate-400 — structural, not decorative.

**Motion** — Section entrance: H2 + sub-sentence fade+rise. Then pairs stagger in at 0/120/240/360ms, each rising 16px (`--ease-page`). Left and right columns of each pair animate together — they are one idea, not two. Numbered circles pop in with `--ease-spring` (scale 0.5→1.0, 200ms) as their row enters. Once only.

**Interactivity** — Hovering a pain (left column) subtly dims the left text to Slate-500 and brightens the right column from its base weight to `#111110` with a very slight `translateX(4px)` nudge — a 150ms `--ease-out` micro-animation that physically enacts the "pain → resolution" transition. Keyboard-accessible: focus on each row triggers the same treatment.

**SEO** — `<h2>` with vocabulary: "enforcement," "artifact requirement," "spec library," "sealed record." The four right-column mechanics are crawlable live text — they are the specific phrase targets for QA-focused searches. Internal link at the close of Pair 1: *"See how artifact enforcement works →"* → `/features/artifact-enforcement`.

---

## Section 3 · The spec library

**Purpose** — Show the QA Lead that NoHotfix is not a one-run tool — it is a system that compounds with use. The spec library makes their QA process portable, consistent, and ownership-independent. This section reframes "adoption" as "investment that pays off every subsequent run."

**Layout** — Default background. Section label pill + H2 + sub-paragraph, then a **two-column layout** at `max-width: 1040px`: left column (~45%) a three-item explainer list; right column (~55%) a product-UI fragment.

**What's shown** — Left column: three items, each with a small icon (24px, 2px stroke, Slate-700 — standard icon style), a short Inter 600 H3 heading, and one body sentence.

1. *[working heading: "Write a spec once."]*. Body: *[working: "Define the fields, the required artifacts, the acceptance criteria. It lives in the library — not in a document someone might misplace."]*

2. *[working heading: "Use it across every playbook."]*. Body: *[working: "Add the same spec to a staging playbook, a production checklist, a partner-release runbook. It runs consistently every time — the artifact requirements travel with it."]*

3. *[working heading: "Update once. Propagate everywhere."]*. Body: *[working: "If a spec changes — new screenshot requirement, updated acceptance criteria — update it in the library. Playbooks that include it run the updated version on their next run."]*

Right column: A product-UI fragment of the spec library view. The fragment shows a list of three to four specs in the library panel: each row displays the spec title, a small metadata line (Inter 400 Body Small, Slate-500) showing how many playbooks use it (e.g., `Used in 3 playbooks`), and the artifact requirement count (e.g., `2 artifacts required`). One spec row in the list is in a hovered/selected state — highlighted with a subtle `--bg-hover` tint — showing an expanded drawer below it with the spec's artifact requirements: a file requirement labeled `"Post-deployment screenshot (required)"` and a checkbox requirement labeled `"Smoke test confirmed (required)"`. The artifact types use their system labels in Geist Mono (small, 12px), names in Inter. The fragment has the standard light screenshot treatment.

*[working H2: "Write your QA process once. Run it everywhere."]*
*[working sub: "The spec library is the foundation. Every playbook draws from it. Every run applies the same requirements."]*

**Look & feel** — The left column is an explainer, not a bullet list — each item has a full sentence. The right fragment is evidence that the library UI exists and is legible, not a flashy hero showcase. The `Used in 3 playbooks` line is the key detail — it communicates reuse in one phrase without requiring any explanation. The artifact drawer shows exactly two requirements so it stays readable at screenshot scale.

**Motion** — Section entrance: H2 + sub fades+rises. Left-column items stagger 0/100/200ms, each rising 16px. Right fragment fades in at 150ms. The spec row hover-state in the fragment is already in its expanded state on page load — not animated, just shown. Once only.

**Interactivity** — The fragment is static. Left-column items: hovering any item highlights it (Inter text weight shifts 400→500, 150ms `--ease-out`) but there is no paired fragment interaction — the fragment shows one state throughout. Internal link at section close: *"See how artifact enforcement works →"* → `/features/artifact-enforcement`.

**SEO** — `<h2>` with "spec library," "QA process," "reusable specs." Three `<h3>` items with vocabulary: "write once," "playbook," "propagate." The `Used in 3 playbooks` fragment label rendered as DOM text so the reuse claim is indexable. Internal link to `/features/artifact-enforcement`.

---

## Section 4 · The enforcement mechanic, in QA terms

**Purpose** — Establish the inversion that makes NoHotfix different from every checklist tool: the QA Lead configures the requirements; the system does the chasing. This is the section that earns the page's headline. After this section, the visitor understands they are not adopting a more disciplined process — they are offloading enforcement to a structure.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-paragraph, then a **single centered product-UI fragment** at `max-width: 760px`. Below the fragment, two body paragraphs. At the bottom of the section, a single quiet internal link.

**What's shown** — The fragment shows the tester's view of a spec mid-execution. The spec has two artifact requirements configured:

- A `file` requirement: label `"Post-deployment screenshot"`, status: not yet attached — shown with a Slate-400 dashed upload zone (`border: 1.5px dashed`, `border-radius: 8px`, centered caption `"Drop file or click to attach"` in Slate-500, Body Small).
- A `checkbox` requirement: label `"Smoke test confirmed"`, an unchecked checkbox in the standard form style.

At the bottom of the spec view: the Pass button. Rendered in its **disabled state** — `opacity: 0.45`, `cursor: not-allowed`, lock icon (16px, Slate-400) to the left of the label. The button label reads *[working: "Attach required artifacts to pass"]*. The tooltip on hover (desktop only): *[working: "Post-deployment screenshot is required."]*

This is the same disabled-button treatment as the feature pages and homepage hero — the single most important pixel in the NoHotfix UI. It must read instantly as blocked, not loading.

*[working H2: "You configured the requirements. The system enforces them."]*
*[working sub: "You don't chase. You don't remind. The spec doesn't pass until the work is done."]*

Body paragraph 1: *[working: "When you add a spec to your library, you set the artifact requirements. Screenshots, checkboxes, measured values, structured tables — whatever your QA process requires. From that moment, the system is the enforcer."]*

Body paragraph 2: *[working: "Every tester who runs the spec encounters the same gate. Junior engineers, contractors, testers on their first week — the requirements are the same. The Pass button stays disabled until they are met. No workarounds. No overrides."]*

**Look & feel** — The disabled button is the hero of this section. The two-requirement layout is deliberately minimal — only two requirements so the fragment reads at a glance. The dashed upload zone communicates affordance without cluttering the argument. The Pass button's disabled state is the payoff: after reading "the system enforces them," the visitor sees a button they cannot click. The copy and the UI fragment say the same thing simultaneously. This is the Stripe principle in full effect — the screenshot is the argument.

**Motion** — Standard section entrance. Fragment fades in after H2. Body paragraphs stagger 100ms each after the fragment. No idle animation on the disabled button — it is not loading, it is blocked. Once only.

**Interactivity** — The disabled Pass button shows the tooltip on hover (desktop): `title` attribute or a small DOM tooltip positioned above the button, Inter 400 12px, dark fill `#111110`, `border-radius: 6px`. The upload zone shows a hover state (border shifts from `rgba(0,0,0,0.20)` to `rgba(234,107,4,0.40)` — a faint orange emphasis suggesting the interaction is available). Neither action is actually functional in the static fragment. The lock icon does not animate on hover (Phase 6 applies to locked states).

**SEO** — `<h2>` with "enforcement," "artifact requirements." Body text carries "file," "checkbox," "measured values," "no workarounds" as crawlable text. Internal link at section close: *"See all six artifact types →"* → `/features/artifact-enforcement`.

---

## Section 5 · Adoption speed

**Purpose** — Eliminate the "implementation project" objection. This is the section that converts the QA Lead who is interested but imagining a multi-week rollout. The argument: NoHotfix is live in an afternoon, not a quarter. This section has no product screenshot — it is a direct, confident claim delivered typographically.

**Layout** — Default background. Section label pill + H2 + a **single centered, typographic moment** in DM Sans 600 at 36px. Below it, three short claim lines in Inter 400 Body Large. Then a CTA row.

**What's shown** — Section label pill: `GETTING STARTED` (standard pill). H2 in DM Sans 600: *[working: "Live in an afternoon."]*. Below it, three claim lines — each in Inter 400 18px, centered, with a small Go-500 check-circle glyph (`#00CC80`, 16px, solid) to the left:

- *[working: "First playbook under an hour — spec library, requirements, first run."]*
- *[working: "No implementation project. No dedicated admin. No professional services."]*
- *[working: "Your first tester runs their first spec today — not after a migration."]*

Below the three claims: a CTA row. Primary: "Start for free" → `/signup`. Secondary text link: "See the full how-it-works →" → `/how-it-works`.

**Look & feel** — This section is deliberately lighter than the others — it is a confidence statement, not an explanation. The DM Sans 600 H2 at 36px carries authority. The three check-lines are the only use of Go-500 green on this page — a semantic color that communicates "done / available / yes" without overloading it. No product screenshot means no visual complexity — the simplicity of the layout enacts the simplicity of the adoption claim. The warm-white background at full brightness (not `--bg-section-alt`) keeps the section airy.

**Motion** — Section entrance: H2 fades+rises 24px. Then the three claim lines stagger in at 0/100/200ms, each rising 12px. The Go-500 check-circles pop in with `--ease-spring` (scale 0.5→1.0, 200ms) as their line enters. CTA row fades in last. Once only.

**Interactivity** — CTA hover: primary button `#EA6B04 → #C05A00`, 150ms. Secondary link shows Orange-800 underline on hover. No other interactions.

**SEO** — `<h2>` with "live in an afternoon." Three claim lines carry crawlable text: "first playbook," "no implementation project," "first run today." The Go-500 check-circles are CSS/SVG elements, not images — no `alt` required; the text carries the claim. Internal link to `/how-it-works`.

---

## Section 6 · Testimonial slot

**Purpose** — Reserve social proof from a real QA lead or senior QA engineer. This slot is a placeholder — it must exist in the information architecture so that a real testimonial can be dropped in without a design change. Per the honesty rule: no fabricated quote, no stock face, no invented company name, no placeholder that could be mistaken for real proof.

**Layout** — `--bg-section-alt`. Single centered card at `max-width: 680px`, standard solid card recipe. The card has a 4px top-edge stripe in Orange-500 (`#F97316`) — the persona accent color, consistent with the homepage "Who it's for" persona card treatment. Inside the card: a bordered placeholder treatment.

**What's shown** — Inside the card:

- A horizontal rule at the top of the quote area (Slate-200, 1px) with a large typographic quotation mark (`"`) in DM Sans 700 at 48px, Orange-200 (`#FED7AA`) color — present but deliberately soft so it reads as a structural placeholder, not a polished layout with a missing quote.
- Below it: a placeholder body in Inter 400 italic, Slate-400: *[placeholder: "A quote from a QA lead or senior QA engineer will appear here once available. Reach out if you'd like to share your experience with NoHotfix."]*
- Below the quote area: a two-column attribution row: left has a 40px circle avatar placeholder (Slate-200 fill, `border-radius: 9999px`); right has two placeholder lines (Inter 500 14px Slate-400 for name, Inter 400 12px Slate-300 for role + company).
- The card carries a `border: 1.5px dashed rgba(0,0,0,0.14)` (light) / `border: 1.5px dashed rgba(255,255,255,0.12)` (dark) — a dashed border explicitly signals "to be filled," distinguishing it from a published card. When a real testimonial is available, replace the dashed border with the standard solid recipe.

**Look & feel** — The card reads as a held slot, not a broken UI. The dashed border and Slate-400 placeholder text communicate intentional absence. The Orange-500 top stripe makes the card feel connected to the QA Teams color identity. No orange anywhere else inside the card — the stripe is the accent, and it has to count.

**Motion** — Standard section entrance. Card fades in. No hover lift on the placeholder card — hover lift signals interactivity; this card has none. Once only.

**Interactivity** — None. The card is entirely static. No hover effect. A future real testimonial card will restore hover lift.

**SEO** — `<section aria-labelledby>` with an offscreen H2 label (e.g., `id="testimonials-heading"`, text: "QA teams on NoHotfix") so the section is a crawlable landmark even while empty. When a real testimonial is added, the quote text becomes indexed content.

---

## Section 7 · Final CTA — "Start building your spec library."

**Purpose** — The conversion close. The persona-specific closing statement that returns to the page's original framing — the spec library is the asset the QA Lead is building; starting free is how they start building it today. Matches the shared closing rhythm across all pages.

**Layout** — Centered, full-width, ~120–140px top/bottom padding. Default background with the sanctioned warm radial: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(234,107,4,0.08), transparent)` light / `rgba(249,115,22,0.10)` dark — the one sanctioned atmospheric wash (used on homepage §11, feature pages §6). No other decoration.

**What's shown** — Top-to-bottom:

- Section label pill: `SHIP IT ONCE` (standard pill).
- H2 in DM Sans 600: *[working: "Start building your spec library."]*
- Sub-copy in Inter 400 Body Large (18px): *[working: "Your QA process — defined, enforced, recorded. One seat, full enforcement, the go/no-go gate, sealed records. No credit card."]*
- Primary CTA button: "Start for free" → `/signup`. Orange-600 fill (`#EA6B04`), white text, `border-radius: --radius-md (10px)`.
- Secondary text link (Inter 400, Slate-500, below the button): *[working: "Have questions? Talk to us →"* → `/contact`].
- Closing tagline: "Ship it once." in Inter 500 Slate-400, 14px. Centered, below the secondary link. A quiet structural period on the page.

**Look & feel** — The warm radial is subtle — it provides a visual anchor for the closing section without introducing a new graphic element. The page ends on warm white (not on a dark CTA block). The DM Sans 600 H2 echoes the hero tone while completing the arc: the hero asked you to recognize the pain; the closing CTA offers the specific action that resolves it. "Start building your spec library" is concrete — not "start your free trial," not "get started" — because the spec library is the thing the QA Lead cares about owning.

**Motion** — H2 + sub fades+rises 24px on reveal (400ms, `--ease-page`). CTA fades in 100ms after. Secondary link and tagline fade in 150ms after CTA. CTA hover: `#EA6B04 → #C05A00`, 150ms. No scale. Once only.

**Interactivity** — Primary CTA → `/signup`. Secondary → `/contact`. "Ship it once." tagline is not a link. All interactive elements keyboard-accessible with the Orange-600 focus ring.

**SEO** — `<h2>` reinforcing the spec library (keyword: "spec library"). Sub-copy carries "enforcement," "go/no-go gate," "sealed records" as crawlable text. Final internal links to `/signup` and `/contact`.

---

## Narrative arc

*Pain* (hero — four failures the QA Lead knows by name) → *Mechanism* (matched pairs — each pain answered by a specific structural response) → *Foundation* (spec library — the reusable asset that makes the mechanism compound) → *Inversion* (enforcement mechanic — you configure, the system enforces; you don't chase) → *Adoption* (live in an afternoon — no objection handling needed after this) → *Proof* (testimonial slot — held for when the evidence exists) → *Convert* (start building your spec library → `/signup`).

The visitor enters with a familiar frustration (chasing evidence). They leave understanding that the frustration is structural — and that the fix is structural, not a better process, not more discipline, not a new Slack reminder. The system enforces it. They don't have to.

---

## Interaction & Animation summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Section entrance (all sections) | fade + rise 24px | 400ms `--ease-page` | once on view | Every section |
| Hero pain inventory lines | stagger rise 12px | 80ms apart, `--ease-page` | once | After H1 settles |
| Matched-pair rows (§2) | stagger rise 16px | 120ms apart, `--ease-page` | once | Pairs animate as units |
| Numbered circles (§2) | scale 0.5→1.0 `--ease-spring` | 200ms, stagger 80ms | once | Pop in after row enters |
| Paired-hover (§2) | left dims to Slate-500 + right nudges 4px | 150ms `--ease-out` | per hover | Keyboard-accessible |
| Left-column items (§3) | stagger rise 16px | 100ms apart, `--ease-page` | once | After H2 |
| Go-500 check-circles (§5) | scale 0.5→1.0 `--ease-spring` | 200ms, stagger 100ms | once | Claim lines in §5 |
| Claim lines (§5) | stagger rise 12px | 100ms apart, `--ease-page` | once | After H2 |
| Warm radial (§7) | static | — | — | Pre-rendered CSS gradient |
| Disabled Pass button (§4) | **none** | — | never | Blocked states don't move (Phase 6) |
| Testimonial card (§6) | **no hover lift** | — | per hover | Placeholder state: no interactivity |
| Card hover (§3) | lift −4px + shadow | 200ms `--ease-out` | per hover | Cards in §3; NOT §6 placeholder |
| CTA hover | bg-color shift | 150ms | per hover | No scale |

All motion suppressed under `prefers-reduced-motion`. Content renders in final state immediately.

---

## Responsive behavior

**≥1040px**: Full layouts as specified. Two-column §2 (matched pairs) and §3 (spec library) at full width.

**768–1039px**:
- §2 matched pairs: maintain two-column but tighten the column gap; connector arrow scales down to 12px. If columns become too compressed, relax to 45/55 split.
- §3 spec library: stack text column above fragment column. Fragment full-width.
- §5 adoption speed: claim lines stay centered; no column changes needed.

**<768px**:
- §2 matched pairs: stack vertically — numbered circle + pain line, then mechanic line below it. Connector arrow hidden (stack order communicates directionality). Row separation via increased vertical spacing (24px between pairs).
- §3 spec library: single column, text above fragment. Fragment scales to content width.
- §4 enforcement fragment: scale to content width; blocked Pass button must remain legible — minimum 44×44px touch target even in disabled state.
- §5 adoption speed: centered single column, no changes needed.

**<576px**:
- Hero H1: 46px (from 74px display) per the type scale.
- §2 numbered circles: 20px diameter (from 24px) — readable at phone scale.
- §3 spec library fragment: show the list view only; collapse the expanded drawer if it clips.

---

## Cross-page navigation

**From this page:**
- §2 Pair 1 close + §3 close + §4 close: all link to `/features/artifact-enforcement` — the primary feature this page explains.
- §5 close: links to `/how-it-works` — the process walkthrough.
- §7 final CTA secondary: links to `/contact`.
- Implied path from nav: visitors exploring `/pricing` next are well-served by what they've read here (the enforcement triad is on every tier including Free — a fact mentioned in §5's sub-copy).

**From the homepage:**
- Homepage §8 "Who it's for" — QA Teams card links here. The pain bullets in the homepage card (`Stop chasing testers for screenshots`, `The system enforces the checklist`) directly match the H1 and §4 of this page. The visitor arrives pre-warmed.
- Homepage §3 "Pain hook" — the blocked Pass button demo names the same mechanic this page explains. The visitor who clicks "QA Teams" from the homepage already saw the demo; this page names the persona and goes deeper.

**From the feature pages:**
- `/features/artifact-enforcement` links here as the primary use-case match (see features/README.md cross-page navigation table).

**To the other use-case pages:**
- No explicit cross-links to `/use-cases/compliance` or `/use-cases/engineering-managers` from this page — a visitor who arrived here is a QA Lead; sending them sideways dilutes the conversion path. The nav provides the route to sibling pages for those who want it.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal — full section-by-section spec for the QA Teams use-case page. Shared archetype applied (pain hero, matched pairs, product proof, testimonial slot, shared CTA). All mechanics grounded in brand-identity.md v5.0, website-vision.md v3.0, and the features/README.md shared archetype. |
