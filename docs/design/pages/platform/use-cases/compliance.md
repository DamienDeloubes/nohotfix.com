# Use Case: For Compliance-Driven Teams — Design + Information Architecture

**Product**: NoHotfix
**URL**: `/use-cases/compliance`
**Version**: 1.0
**Date**: 2026-05-30
**Status**: Proposal for review — section look/feel, motion, and interactivity. Copy is indicative working text, not final.
**Brand law**: docs/design/brand-identity.md (v5.0) · docs/design/website-vision.md (v3.0)
**Content/IA owner**: docs/marketing/sitemap.md `/use-cases/compliance` entry

---

## How to read this document

This is a section-by-section design spec for one page in a three-page set (QA Teams · Compliance · Engineering Managers). It shares an archetype with the other two; this file records only this page's sections and any compliance-formal deviations. Bracketed lines like *[working: "…"]* are indicative copy placeholders — intent and length only.

Each section is specified under: **Purpose · Layout · What's shown · Look & feel · Motion · Interactivity · SEO**.

---

## Shared archetype and persona differentiation

The three use-case pages (QA Teams · Compliance · Engineering Managers) share one structural archetype defined in docs/design/website-vision.md Phase 12:

- **Hero = pain-acknowledgment statement** in DM Sans 700. Not a product screenshot. Speak the persona's reality back to them.
- **Spine = matched pairs**: each pain (before state) paired with the specific NoHotfix mechanic that resolves it (after state).
- **Product-proof band**: one faithful product-UI crop, anchoring the persona's primary mechanic.
- **Reserved testimonial slot**: standard solid card, placeholder border, no fabricated content.
- **Shared close**: "Ship it once." final-CTA section, adapted for the conversion goal.

**This page is the most formal of the three.** The compliance persona — QA Director, VP Engineering at a regulated-sector SaaS — is doing due diligence, not evaluating a productivity tool. They are accountable to an auditor. The design register should feel like it understands that weight.

Persona accent per Phase 10: **Slate-400** (`#94A3B8`). Applied to the section label pill, matched-pair "before/after" markers, and the top accent stripe on the testimonial card. Never as a background. Callout circles (where used) are Slate-700 — consistent with the compliance-formal treatment established in `/features/audit-trail` Section 2.

---

## Global treatments

Do not re-specify here. All global treatments from homepage.md §"Global treatments" and features/README.md §"Global treatments" apply verbatim. This section notes compliance-page deviations only.

**Compliance-page deviations:**

- **Section label pill accent**: uses Slate-400 text with `rgba(148,163,184,0.12)` bg and `rgba(148,163,184,0.22)` border — overrides the standard orange pill treatment. The orange pill treatment (website-vision.md Phase 10) explicitly permits persona-accent substitution for use-case pages.
- **Matched-pair markers**: Slate-400 for the "before" marker icons; Orange-600 for the "after" mechanic markers. This creates a visual grammar: Slate = problem state, Orange = resolved state. Applied consistently across Section 2 (the spine).
- **Orange restraint**: this page has one fewer orange touchpoint than the QA Teams page. The primary CTA is "Talk to us"; there is no dominant orange CTA above the fold. The hero CTA row shows "Talk to us" as the primary (Orange-600 fill) and "Start free" as quiet-secondary (bordered, no fill) — identical hierarchy to `/features/audit-trail`.
- **Geist Mono presence**: higher than any other use-case page. Timestamps, run IDs, the sealed record crop, and the "certified document" print-preview fragment all use Geist Mono — the same visual signature as `/features/audit-trail`.
- **No animated elements in the product-proof band** (Section 3): the sealed record is static. Per website-vision.md Phase 6: sealed things don't move.

---

## SEO intent cluster

- **Primary intent**: "compliance evidence release testing," "SOC2 release audit trail," "tamper-evident release record," "HIPAA release testing evidence," "release checklist compliance tool"
- **Single `<h1>`**: the hero pain-acknowledgment statement (see Section 1 below)
- **Structured data**: `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Use Cases → Compliance)
- **Internal links** (distributed across sections, not footer-dumped):
  - `/features/audit-trail` — primary mechanic (Sections 2, 3, final CTA)
  - `/how-it-works` — the process walkthrough (Section 2 close)
  - `/pricing` — plans section (Section 5)
  - `/contact` — primary conversion (hero CTA row, final CTA)
  - `/platform` — honesty note on the export roadmap (Section 5)
- **Crawlable claims**: "tamper-evident," "sealed," "immutable," "no reconstruction required," "SOC2," "PCI-DSS," "HIPAA-adjacent," "go/no-go," "shareable URL," "browser print-to-PDF" — all in live DOM text

---

## Section 0 · Sticky navigation

See homepage.md §0 and features/README.md §"Sticky navigation." Identical treatment. Current-page indicator: the "Use Cases" nav item shows Orange-600 active state; "Compliance" within the Use Cases dropdown shows the active state.

---

## Section 1 · Hero — pain-acknowledgment statement

**Purpose** — Open with the compliance buyer's exact lived experience: the three-day scramble to assemble audit evidence from scattered Slack threads and Jira tickets. This is not a product pitch. It is evidence that the product understands the problem. The visitor should feel recognized before they are asked to believe anything.

**Layout** — Single column, centered, `min-height: 100vh`. Top-to-bottom: section label pill → H1 pain statement → body paragraph → CTA row. No product screenshot in the hero. The pain statement earns the scroll.

`max-width: 760px` for the headline and copy column — narrow enough to feel intentional, wide enough to land with weight at DM Sans 700.

**What's shown**

Section label pill: *[working: "FOR COMPLIANCE-DRIVEN TEAMS"]* — Slate-400 text on `rgba(148,163,184,0.12)` background, `rgba(148,163,184,0.22)` border. All-caps Inter 500 13px +0.08em tracking. (Compliance persona accent — deviates from orange pill per global treatments note above.)

H1 — DM Sans 700, display scale (74px desktop / 46px mobile), `-0.04em` tracking, `--text-primary` (`#111110` light / `#F5F4F0` dark):

*[working: "Three days before the audit closes, you're rebuilding the evidence from Slack."]*

This is the exact language from the sitemap's key section 1 anchor. It is a statement of what happens to the compliance buyer, not a claim about the product. It earns the next two lines.

Body paragraph — Inter 400 Body Large (18px), `--text-secondary` (`#52514C` light):

*[working: "Testing happened. The go/no-go call was made. But the evidence — screenshots, log files, the tester's name, the timestamp — is scattered across threads, tickets, and a shared drive that nobody can find. NoHotfix records it all in real time, sealed at the moment of the decision, and available at a URL."]*

CTA row — horizontal flex, gap `--space-4` (16px), centered:
- Primary: "Talk to us" → `/contact`. Orange-600 fill (`#EA6B04` light), white label Inter 600 16px, `--radius-md` (10px), `--shadow-card`. Hover: bg shifts to Orange-700 (`#C05A00`), 150ms.
- Secondary: "Start free" → `/signup`. No fill, `1px solid rgba(0,0,0,0.14)` border, `--text-primary` label Inter 600 16px, same radius. Hover: bg `--bg-hover` (`#F4F4F5`), 150ms.

No product fragment in this section. The hero intentionally withholds the product UI — the pain statement sets the expectation; the product evidence arrives in Section 2 onward.

**Look & feel** — Sparse and deliberately quiet. Warm-white ground (`#FAFAFA`). Large type, one idea. The Slate-400 section pill is the only color accent — no orange in the hero beyond the CTA button. The narrow column and the absence of a product fragment communicate that this page is not here to demo — it is here to be understood.

The hero has the register of an opening paragraph in a case study, not a product page. That register shift — from marketing to audit-grade documentation — is intentional and must be preserved in the copy deck.

**Motion** — Choreographed entrance, once per page load. Elements enter sequentially: pill fades in (0ms, 200ms duration) → H1 fades + rises 24px (100ms, 400ms `--ease-page`) → body fades + rises 24px (200ms, 400ms `--ease-page`) → CTA row fades in (350ms, 300ms). No hero fragment to animate. The absence of a motion-heavy hero is itself a design statement — the compliance buyer does not need theatrics.

**Interactivity** — Static apart from CTA hover states. No scroll-triggered split, no parallax. `prefers-reduced-motion`: all content in final state.

**SEO** — Single `<h1>` on the page. Contains: "audit," "Slack," "evidence" — real search vocabulary from compliance teams. Body paragraph crawlable: "screenshots," "log files," "tester," "timestamp," "sealed," "URL." CTAs: primary "Talk to us" → `/contact`; secondary "Start free" → `/signup`.

---

## Section 2 · Matched pairs — pain → mechanic

**Purpose** — This is the spine of the page. Every pain the compliance buyer has named out loud is paired with the specific NoHotfix mechanic that resolves it. The format is symmetrical: before state (what they do today) on the left, after state (what NoHotfix does) on the right. Four pairs. No generic benefits — each after-state names the exact mechanic.

**Layout** — `--bg-section-alt` (`#F4F4F5` light / `#161513` dark). Section label pill + H2 + sub-sentence, then four matched-pair rows stacked vertically at `max-width: 920px`, centered.

Each row is a two-column layout (desktop): left column ~48%, right column ~48%, separated by a thin vertical divider line in `--border-default` (`rgba(0,0,0,0.08)` light / `rgba(255,255,255,0.09)` dark). The divider is a structural separator, not a decorative element.

Mobile (< 768px): left and right columns stack vertically. Left ("Before") appears first, right ("After") below, with a horizontal `--border-default` rule between them. The row pair sits within a standard solid card at mobile scale (adds containment when the divider disappears).

Desktop layout detail: the four row pairs are separated by `--border-default` horizontal rules (not cards — the section has its own alt background container; individual row borders provide separation without boxing every row in a card).

**What's shown**

Section label pill: *[working: "BEFORE & AFTER"]*. Slate-400 accent.

H2 — DM Sans 600, 36px, `-0.025em`: *[working: "What changes when the evidence is built-in."]*

Sub-sentence — Inter 400 18px, `--text-secondary`: *[working: "Each of these is a real exchange — the one before NoHotfix, and what replaces it."]*

**Row 1 — Evidence reconstruction**

Left column — "Before" marker: a small Slate-400 dot (8px filled circle, 2px Slate-300 border) + label "TODAY" in Inter 500 12px Slate-500, +0.08em tracking. Below: Inter 600 16px `--text-primary` heading + Inter 400 16px body:

*[working heading: "Evidence reconstruction"]*
*[working body: "Before the audit, your team spends two to three days reconstructing which tests ran, what failed, who approved, and what they knew when they approved it. Slack search. Jira ticket comments. Shared drives. Nothing is authoritative."]*

Right column — "After" marker: a small Orange-600 dot (8px, same spec) + label "WITH NOHOTFIX" in Inter 500 12px Orange-700, +0.08em. Below: Inter 600 16px heading + body:

*[working heading: "Every run is already a record"]*
*[working body: "The moment the run starts, NoHotfix is building the record. Spec outcomes, artifact uploads, tester identities, timestamps — all captured in real time. By the time the go/no-go decision is made, the record is complete."]*

Inline mechanic link — Inter 400 14px Orange-800 (`#9A3F05`) underline: *"See what the record contains →"* → `/features/audit-trail`.

**Row 2 — Trust in the evidence**

Left — Today:
*[working heading: "Did anyone actually run the tests?"]*
*[working body: "Your QA lead's spreadsheet says passed. But you've been burned before — a spec was marked done and the screenshot was from a previous release. You have no way to verify the evidence was collected at the time the test ran."]*

Right — With NoHotfix:
*[working heading: "Artifacts are attached at the time of execution"]*
*[working body: "Each spec's Pass action is blocked until every required artifact is submitted. A screenshot, a log file, a measured value — whatever the spec requires, the tester can't mark it passed without it. The attachment timestamp is part of the record."]*

Inline mechanic link: *"How artifact enforcement works →"* → `/features/artifact-enforcement`.

**Row 3 — Who made the call**

Left — Today:
*[working heading: "No documented go/no-go"]*
*[working body: "The shipping decision happens in a Slack thread or a standup. There's no formal record of who decided, what they knew, whether anything was still failing, or why they chose to ship anyway."]*

Right — With NoHotfix:
*[working heading: "The decision is formal, documented, and permanent"]*
*[working body: "Only designated Admins can issue the go/no-go decision. The decision screen shows every spec result grouped by severity before the call is made. If specs are failing, a written justification is required. The decision — including the justification — is sealed into the record."]*

Inline mechanic link: *"See the go/no-go decision gate →"* → `/features/go-no-go`.

**Row 4 — Tamper-evidence**

Left — Today:
*[working heading: "Records can be edited after the fact"]*
*[working body: "Even if someone ran tests and filled in a spreadsheet, the spreadsheet can be changed. If an auditor ever challenged the evidence, you couldn't prove the record reflects what actually happened."]*

Right — With NoHotfix:
*[working heading: "The record is sealed and cannot be altered"]*
*[working body: "After the go/no-go decision, the run record is locked at three layers: the API exposes no mutation routes for completed runs, the service layer's state machine rejects mutations, and database constraints prevent writes. There is nothing to edit, for anyone."]*

Inline mechanic link: *"How immutability works →"* → `/features/audit-trail#three-layer-immutability`.

Below the four rows, a single closing line — Inter 400 16px `--text-secondary`, centered:

*[working: "All of this is a natural output of the process — your team doesn't do anything extra to produce audit evidence. They run the release. The record writes itself."]*

Internal link below: *"See how a run works →"* → `/how-it-works`.

**Look & feel** — The matched-pair format is the most structured layout on the page. The visual grammar is precise: Slate-400 on the left signals "problem"; Orange-600 on the right signals "resolved." The divider line between columns is structural — it separates two states of the same situation, not two unrelated ideas. The four-row stack should feel like a structured table, not a card grid.

The "after" right column headings should read as declarative statements, not promises. Enforcement vocabulary: "blocked," "sealed," "locked," "required," "no mutation routes." The register is factual and precise.

**Motion** — Section entrance (heading + sub). Matched-pair rows stagger in: each row fades + rises 16px with 100ms delay per row (0/100/200/300ms). Within each visible row, left column slightly precedes right column by 60ms — the sequence communicates "before" coming into view before "after." `--ease-page`, 400ms per element. Once on scroll-into-view.

**Interactivity** — Inline links use standard Orange-800 link treatment with hover underline. Row pairs have no hover state — they are not cards. The divider is structural; no interaction. `prefers-reduced-motion`: all rows render in final state.

**SEO** — `<h2>` + four `<h3>` headings per pair (for each left and right heading). Vocabulary: "evidence reconstruction," "artifact enforcement," "go/no-go," "tamper-evident," "sealed," "immutable," "documented decision," "real-time record." All crawlable body text. Three internal links to feature pages + one to `/how-it-works`.

---

## Section 3 · Product-proof band — the sealed record

**Purpose** — Anchor the matched-pair claims in a real product UI. This is the one product screenshot moment on this page. It shows the compliance buyer exactly what they would hand to an auditor: a sealed run record with spec outcomes, inline artifacts, the decision block, and the immutability indicators. The product UI is the argument.

**Layout** — Default background (`--bg-page`). Section label pill + H2 + sub-sentence, then a **large product fragment** at `max-width: 920px`, centered with standard light screenshot treatment. Below the fragment, a short three-point list annotating what the auditor sees.

The fragment uses a browser chrome frame (traffic-light dots visible, URL bar shows `app.nohotfix.com/runs/[run-id]`). This communicates: this is a URL you can send.

**What's shown**

Section label pill: *[working: "WHAT THE AUDITOR SEES"]*. Slate-400 accent.

H2 — DM Sans 600 36px: *[working: "Send them the URL. The record is already complete."]*

Sub-sentence — Inter 400 18px `--text-secondary`: *[working: "This is what a sealed run record looks like. Every item an auditor would ask for is here."]*

**The product fragment** shows the sealed run detail view — the same visual language as `/features/audit-trail` Section 1, adapted to highlight the full record for compliance:

- Run header: run name in Inter 600 (`Release v3.9.0 — Staging`). Go badge in Go-700/Go-100 recipe. `SEALED` label in Geist Mono 500 Slate-400 to the right of the badge. Started by + completion timestamps in Geist Mono.
- Lock icon: 2px stroke, 16px, Slate-400. Static. Does not animate. Does not glow. (Phase 6 — sealed things don't move.)
- Decision record block: raised card treatment. Decision label "Go" in Go-500. Decision maker name + timestamp in Geist Mono. Justification field shown (indicates a justification was required and provided — a Go with one non-blocking failure present).
- Spec list (three rows visible): each row shows spec title, severity badge, result badge (two Passed in Go-700/Go-100 recipe, one No-Go badge with yellow NoGo treatment to show a pre-existing failure that was justified), executed-by name, timestamp. One row is in expanded state: all fields open, artifact panel showing an inline image thumbnail labeled `login-screen.png · Uploaded by A. Chen · 14 Apr 2026 09:41 UTC` in Geist Mono.

Three callout annotations — numbered circles (1, 2, 3) in Slate-700 (compliance-formal, consistent with `/features/audit-trail` Section 2). Not orange — orange restraint note applies here.

Annotation 1 → points to the SEALED label + lock icon: *"Sealed at the moment of decision. No edits possible."*
Annotation 2 → points to the decision record block (justification visible): *"Written justification, captured at decision time — not reconstructed later."*
Annotation 3 → points to the inline artifact thumbnail: *"Evidence attached at execution. Timestamp is part of the record."*

Fragment screenshot treatment (light): `1px solid rgba(0,0,0,0.08)`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`. No glow.

Below the fragment, a three-point list — Inter 400 16px `--text-secondary`, `max-width: 720px`, centered:

1. *[working: "The URL is shareable. Any stakeholder with the link can view the sealed record — no login required for read access."]*
2. *[working: "Browser print-to-PDF produces a formatted document with all spec rows expanded and artifacts inline. Available at launch on every plan."]*
3. *[working: "For teams with SOC2 or PCI-DSS reporting obligations, a one-click PDF export and structured JSON export are on the roadmap. See what's coming."]*

Item 3 contains an internal link in Orange-800: *"See the platform roadmap"* → `/platform`.

**Look & feel** — The fragment is more document-dense than the hero fragments on `/features/artifact-enforcement` or `/features/go-no-go`. This is intentional: a compliance record is not a clean UI state, it is a complete record with multiple items. The density communicates completeness.

Geist Mono on all timestamps, run IDs, and the `SEALED` label — these are the visual signatures of a formal record. The lock icon is the critical element and must be visually unambiguous: sealed, static, authoritative.

The three-point list below the fragment is document-like in register. Item 3 (the roadmap honesty note) is the same slate-register treatment used in `/features/audit-trail` Section 4 — quiet, visible, not buried.

**Motion** — Section entrance. H2 + sub fade+rise. Fragment slides up 24px + fades, 700ms `--ease-page`. The three callout circles pop in with `--ease-spring` (scale 0.5→1.0), staggered 80ms each, after the fragment settles. The fragment content is entirely static — no animation within it. Lock icon: no animation, ever. Three-point list items stagger 80ms after the circles. Once on scroll-into-view.

**Interactivity** — Callout circles are not interactive. Fragment is static (no hover states within it). The "See the platform roadmap" link in item 3 is the only interactive element below the fragment. Artifact thumbnail in the fragment shows a subtle hover shadow-lift (to communicate it is a real image, not decorative) — hover only, no click.

**SEO** — `<h2>` with "sealed record," "URL," "auditor." Body text crawlable: "shareable," "print-to-PDF," "artifacts inline," "JSON export," "SOC2," "PCI-DSS," "roadmap." Alt on the fragment `<img>`: *"NoHotfix sealed run record showing a Go decision with a written justification, three spec rows with result badges, and an inline artifact thumbnail — all in read-only state."* Internal link to `/platform`.

---

## Section 4 · Relevant frameworks — compliance context

**Purpose** — Connect the product's evidence output to the specific regulatory frameworks the compliance buyer is operating under. Non-prescriptive, honest, no certifications claimed. This section must earn trust through precision, not reassurance.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-sentence, then a **two-column layout** at `max-width: 960px`. Left column (~65%): three short framework paragraphs. Right column (~35%): reserved testimonial slot card.

**What's shown**

Section label pill: *[working: "REGULATORY CONTEXT"]*. Slate-400 accent.

H2 — DM Sans 600 36px: *[working: "Your evidence already maps to what these frameworks require."]*

Sub-sentence — Inter 400 18px `--text-secondary`: *[working: "NoHotfix doesn't hold certifications. These statements describe how its output maps to testing-evidence requirements."]*

**Left column — three framework paragraphs**

Paragraph 1 — SOC2:
*[working: "SOC2 Type II requires evidence that software changes are tested before they go to production. NoHotfix captures that evidence in real time — spec results, attached artifacts, tester identities, and the go/no-go decision — in a tamper-evident record. No reconstruction exercise at audit time."]*

Paragraph 2 — PCI-DSS:
*[working: "PCI-DSS requires that changes to in-scope systems are tested and that evidence of testing is retained. Every NoHotfix run produces that evidence as a natural output of the release process, sealed at decision time."]*

Paragraph 3 — HIPAA-adjacent:
*[working: "Engineering teams building HIPAA-adjacent software often face internal policies requiring documented testing and approval before production deployments. NoHotfix formalizes that approval into a documented, timestamped, tamper-evident record."]*

Below the three paragraphs, a **disclaimer paragraph** in Slate-600 Inter 400 — the disclaimer register, identical to the treatment in `/features/audit-trail` Section 5. Visible, not buried:

*[working: "NoHotfix does not hold a SOC2, PCI-DSS, or HIPAA certification. These statements describe how the product's tamper-evident records map to testing-evidence requirements in each framework. Teams should confirm fitness for their specific compliance program with their own counsel."]*

Internal link at section close: *"Talk to us about your compliance requirements →"* → `/contact`.

**Right column — reserved testimonial slot**

Standard solid card recipe (light: `#FFFFFF`, `1px solid rgba(0,0,0,0.08)`, `border-radius: 16px`, shadow-1). Top accent stripe: 3px Slate-400 line at the top edge of the card (compliance persona accent per Phase 10). This is the sole color accent on this card — no orange.

Inside: *[working placeholder text in Slate-400 Inter 400 italic: "Reserved for a compliance-buyer quote or case study excerpt — a QA Director or VP Engineering at a regulated-sector SaaS. To be added at first qualifying customer reference. No fabricated testimonials."]*

Below the placeholder, an empty author block: three Slate-300 ruled lines in place of name, title, company — the structure is visible without content. Communicates that the slot is intentional and structured, not an oversight.

**Look & feel** — Left column is document-formal, matching the register of compliance documentation the buyer reads every day. No bullet points — full prose paragraphs, because the claim is contextual and nuanced. The disclaimer paragraph is quiet in color but not in hierarchy — it is part of the primary copy, not a footnote. Honesty is the brand value; hiding the disclaimer would betray it.

Right column testimonial card has no fill beyond white. The Slate-400 top stripe is the only mark of the compliance persona. The card communicates: this slot exists for the right evidence. It is deliberately quiet — a placeholder with structural integrity, not a design decoration.

**Motion** — Section entrance. Left paragraphs stagger 0/120/240/360ms, each rising 16px, 400ms `--ease-page`. Right card fades in at 100ms offset. Once only.

**Interactivity** — Static. Internal link at section close uses standard Orange-800 inline link treatment. Testimonial card has no hover state — it is not a CTA. `prefers-reduced-motion`: all content in final state.

**SEO** — `<h2>` with "SOC2," "PCI-DSS," "HIPAA," "compliance," "testing evidence." All three framework paragraphs and the disclaimer crawlable — the disclaimer copy is genuine content for compliance-evaluating searchers. Internal link to `/contact`.

---

## Section 5 · Plans for compliance teams

**Purpose** — Answer the "what plan do I need?" question with honesty about what's available at launch versus what's on the roadmap. Do not upsell post-launch features as current. Link clearly to pricing for the full tier detail.

**Layout** — Default background. Section label pill + H2 + sub-sentence, then a **two-card row** at `max-width: 800px`, centered. Below the cards, an honesty note. Below that, a single link to `/pricing`.

**What's shown**

Section label pill: *[working: "PLANS"]*. Slate-400 accent.

H2 — DM Sans 600 36px: *[working: "Start with any plan. The record writes itself."]*

Sub-sentence — Inter 400 18px `--text-secondary`: *[working: "The enforcement triad — artifact gating, go/no-go, immutable record — is on every plan, including Free."]*

**Card 1 — Available at launch (all plans)**

Standard solid card. Top accent stripe: 3px Orange-600 line (these are shipped, current capabilities — orange marks live features per website-vision.md Phase 12). Heading in Inter 600 20px: *[working: "At launch — every plan"]*. Body list (Inter 400 16px, `--text-primary`):

- *"Immutable sealed run record"*
- *"Artifact-gated spec execution (all six artifact types)"*
- *"Go/no-go decision with decider identity + timestamp + justification"*
- *"Shareable run record URL"*
- *"Browser print-to-PDF of the sealed record"*
- *"Run history — filterable, permanent"*

Footer note in Geist Mono 12px Slate-500: *"Free · Growth · Scale — all plans."*

**Card 2 — On the roadmap (post-launch)**

Standard solid card. Top accent stripe: 3px Slate-400 line (roadmap items — Slate, not orange, per Phase 12 roadmap treatment). Heading in Inter 600 20px Slate-600: *[working: "Coming — roadmap items"]*. Body list (Inter 400 16px Slate-600 — lower contrast, visually subordinate):

- *"One-click PDF export of the sealed record"*
- *"Structured JSON export for automated evidence pipelines"*
- *"Viewer role — read-only access for auditors without a team seat"*
- *"Retention controls"*
- *"Uptime SLA (Scale tier)"*

Footer note in Geist Mono 12px Slate-400: *"Scale + Enterprise · post-launch."*

A small Slate-300 pill badge in the card header area (not orange) matching the roadmap pill treatment from website-vision.md Phase 12: *"On the roadmap · not yet available"*. Inter 500 12px Slate-400.

**Below the two cards:**

Honesty note — Inter 400 14px Slate-600, `max-width: 680px` centered, top margin `--space-8` (32px):

*[working: "The compliance-operations layer (viewer role, retention controls, and uptime SLA) is being built for Scale and Enterprise. These items are on the roadmap and not available at launch. What is available at launch — on every plan — is the tamper-evident sealed record, the shareable URL, and browser print-to-PDF."]*

Internal link in Slate-500 (not orange — this is a low-emphasis editorial link, not a CTA): *"See the platform roadmap"* → `/platform`.

Primary link below: "See full pricing and tier detail →" in Orange-800 with underline → `/pricing`. This is an inline editorial link, not a CTA button — the section does not have a button CTA. The final CTA section (Section 6) is the conversion moment.

**Look & feel** — The two-card layout visually separates what exists today from what's coming. Card 1 is high-contrast with an orange top stripe — shipped, actionable, this is the value you get now. Card 2 is lower-contrast with a Slate stripe — future, subordinate, the eye should land on Card 1 first. This is the roadmap treatment from Phase 12 applied to a use-case page for the first time: same visual language as the Platform page roadmap section.

The honesty note is the most direct copy on the page. It should be set in a plain, quiet register — no softening language, no qualifications about "soon." The reader is a compliance buyer. They read small print for a living.

**Motion** — Section entrance. H2 + sub fade+rise. Cards fade+rise with 80ms stagger (Card 1 then Card 2). Honesty note fades in last (200ms offset). Once only. No per-item animation within cards.

**Interactivity** — Card 1: no hover (it is a content panel, not a CTA). Card 2: no hover — same reason. The two editorial links use standard Orange-800 and Slate-500 link treatments. `prefers-reduced-motion`: all content in final state.

**SEO** — `<h2>` with "compliance," "audit," "plans." Body text crawlable: "PDF export," "JSON export," "viewer role," "retention," "SLA," "tamper-evident," "shareable URL," "print-to-PDF," "at launch," "roadmap." Internal links to `/platform` and `/pricing`. The honesty note is genuine search content for compliance buyers evaluating readiness.

---

## Section 6 · Final CTA — "Talk to us" (primary) + "Start free" (secondary)

**Purpose** — Convert. This page's conversion goal is a conversation, not a self-serve signup. The compliance buyer has due diligence requirements and likely needs to confirm team fit, data handling, and SLA terms before committing. The final CTA acknowledges this — it does not pressure; it invites.

**Layout** — Full-width, centered, 120px top/bottom padding. Warm radial atmospheric treatment (the one sanctioned atmospheric wash, per homepage.md §"Final CTA" global approval): `radial-gradient(ellipse 800px 600px at 50% 50%, rgba(234,107,4,0.08) 0%, transparent 70%)` on the light theme; `rgba(249,115,22,0.10)` on the dark theme. Applied behind the text content only — no section-wide background change.

**What's shown**

H2 — DM Sans 600 48px, `-0.03em` tracking, centered: *[working: "When the auditor asks, send them the URL."]*

Body — Inter 400 18px `--text-secondary`, `max-width: 560px`, centered, top margin `--space-4` (16px):

*[working: "The record exists from the moment the run starts. Nothing in it can be altered. Every artifact is preserved. Every decision is documented. The evidence doesn't need to be assembled — it's already there."]*

CTA row — horizontal flex, gap `--space-4` (16px), centered, top margin `--space-8` (32px):
- Primary: "Talk to us" → `/contact`. Orange-600 fill, white Inter 600 16px label, `--radius-md`. Hover: Orange-700, 150ms, no scale.
- Secondary: "Start free" → `/signup`. No fill, `1px solid rgba(0,0,0,0.14)` border, `--text-primary` label Inter 600 16px, same radius. Hover: `--bg-hover`, 150ms.

Closing tagline — Inter 400 14px Slate-500, centered, top margin `--space-6` (24px): *"Ship it once."*

**Look & feel** — The warm radial is the page's one sanctioned atmospheric moment — quiet, not a background wash. The H2 is the page's clearest statement of the product's compliance value: the auditor already has what they need. The CTA hierarchy is identical to `/features/audit-trail` Section 6: "Talk to us" is the dominant action, "Start free" is clearly secondary (bordered, no fill).

No urgency language. No "limited time" copy. The compliance buyer responds to certainty, not pressure.

**Motion** — H2 fades+rises 24px on scroll-into-view (400ms `--ease-page`). Body fades in at 100ms offset. CTA row fades in at 200ms. Tagline fades in at 350ms. Once only.

**Interactivity** — CTA hover states as specified. No other interaction. `prefers-reduced-motion`: all content in final state.

**SEO** — `<h2>` with "audit," "URL," "record." Body: "artifacts preserved," "evidence," "documented," "not assembled." Final internal links to `/contact` and `/signup`.

---

## Narrative arc

*Recognition* (hero: the audit scramble — the buyer feels seen) → *Resolution* (matched pairs: four specific pains and the four mechanics that resolve them — concrete, not abstract) → *Evidence* (product-proof band: the sealed record as a URL you can send — the compliance buyer's primary need) → *Framework fit* (regulatory context: honest, non-prescriptive, disclaimer included) → *Commit clarity* (plans: what's available now versus roadmap, no false promises) → *Conversion* (final CTA: the conversation, not the form).

The compliance buyer moves from "this product understands my problem" to "these mechanics address my specific pains" to "I can see exactly what the auditor would receive" to "this maps to the framework I'm operating under" to "I know what I'm signing up for" to "I need to talk to someone." The page converts a skeptical evaluator into a qualified conversation, not a signup. The entire arc is grounded: no vague benefits, no certification overreach, no upselling of features that don't exist yet.

---

## Cross-page navigation

| From this page | To | Placement |
|---|---|---|
| Section 2 (Row 1 inline link) | `/features/audit-trail` | "See what the record contains →" |
| Section 2 (Row 2 inline link) | `/features/artifact-enforcement` | "How artifact enforcement works →" |
| Section 2 (Row 3 inline link) | `/features/go-no-go` | "See the go/no-go decision gate →" |
| Section 2 (Row 4 inline link) | `/features/audit-trail#three-layer-immutability` | "How immutability works →" |
| Section 2 (section close) | `/how-it-works` | "See how a run works →" |
| Section 3 (three-point list, item 3) | `/platform` | "See the platform roadmap" |
| Section 4 (section close) | `/contact` | "Talk to us about your compliance requirements →" |
| Section 5 (plans section) | `/platform` | "See the platform roadmap" |
| Section 5 (plans section) | `/pricing` | "See full pricing and tier detail →" |
| Section 6 (primary CTA) | `/contact` | "Talk to us" |
| Section 6 (secondary CTA) | `/signup` | "Start free" |

This page is the primary conversion destination from `/features/audit-trail` Section 5 (the compliance context section closes with a link here) and from the homepage's "Compliance" persona card in the "Who it's for" section.

---

## Interaction and animation summary

| Element | Motion | Timing | Loops? | Note |
|---|---|---|---|---|
| Section entrance (all sections) | fade + rise 24px | 400ms `--ease-page` | once on view | Every section |
| Hero H1 | fade + rise 24px | 400ms `--ease-page`, 100ms delay | once | After pill |
| Matched-pair rows | stagger fade + rise 16px | 100ms per row | once | Left column 60ms before right |
| Product-proof fragment | slide up 24px + fade | 700ms `--ease-page` | once | Section 3 |
| Callout circles (Section 3) | scale 0.5→1.0 `--ease-spring` | 80ms stagger | once | After fragment settles |
| Lock icon (Section 3 fragment) | **none** | — | never | Phase 6: sealed things don't move |
| Plan cards (Section 5) | fade + rise, 80ms stagger | 400ms `--ease-page` | once | Card 1 then Card 2 |
| CTA hover | bg-color shift | 150ms | per hover | No scale |
| Card hover | lift −4px + shadow | 200ms `--ease-out` | per hover | Not applicable: matched pairs are not cards |

All motion suppressed under `prefers-reduced-motion`. No exceptions.

---

## Responsive behavior summary

**≥1040px**: Full layouts as specified. Two-column matched pairs with vertical divider. Two-column framework section. Two-card plans row.

**768–1039px**:
- Matched pairs (Section 2): two-column layout maintained; divider narrows; left/right column padding reduces.
- Product-proof fragment (Section 3): scale to 100% content width with `--space-6` (24px) side padding.
- Framework section (Section 4): stack to single column; testimonial card drops below the three paragraphs.
- Plans cards (Section 5): maintain two-column if space allows; stack at 840px threshold.

**<768px**:
- Matched pairs: each row becomes a stacked pair within a standard solid card. Left ("Before") above, right ("After") below, horizontal rule between. Card `border-radius: 16px`, shadow-1.
- Product-proof fragment: scale to content width. Callout annotations: hide (fragment is too small to annotate legibly at mobile scale). Descriptive copy below the fragment carries the claim.
- Hero H1: 46px (from 74px display) per the type scale.
- CTA rows: stack vertically, full-width buttons, gap `--space-3` (12px).

**<576px**:
- Plans cards: single column.
- Framework paragraphs: Inter 400 16px (from 18px Body Large — reduces line length pressure).
- Honesty note (Section 5): Inter 400 13px.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-30 | Initial proposal — six sections, shared archetype, compliance-formal deviations, full section-by-section spec. Sitemap order preserved exactly. All mechanics grounded in feature spec files and audit-trail sibling page. |
