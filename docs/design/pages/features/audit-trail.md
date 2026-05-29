# Page: Immutable Audit Trail — Design + Information Architecture

**Part of the feature set** — read [README.md](README.md) first for the shared archetype, global treatments, sticky-nav (§0) spec, cross-page navigation, and the set-level motion + responsive summaries. This file records only this page's sections and deviations.

**URL**: `/features/audit-trail`
**Pillar headline**: The record is sealed when the call is made.
**Conversion goal**: Talk to us (primary) / Start free (secondary)

---

## Design register note

This page leans slightly more compliance-formal than the other two, per Phase 12. The "certified document" treatment in Geist Mono is the primary visual differentiator. The copy register is more deliberate and less operational — this page speaks to a compliance buyer or QA Director doing due diligence, not a QA lead evaluating a tool for their team. The hero fragment shows a sealed, static record — and the page's entire argument is that sealed things do not change.

---

## SEO intent cluster

- Primary intent: "immutable audit trail release testing," "release evidence for SOC2 audit," "tamper-evident release record," "compliance-ready testing record"
- Single `<h1>`: *[working: "The record is sealed when the call is made."]*
- `SoftwareApplication` + `ItemPage` JSON-LD; `BreadcrumbList` (Home → Features → Audit Trail)
- Internal links to: `/features/artifact-enforcement`, `/features/go-no-go`, `/use-cases/compliance`, `/contact`, `/pricing`
- Crawlable claims: "sealed," "three-layer immutability," "tamper-evident," "print-to-PDF" in live text

(Shared SEO rules — single h1, semantic landmarks, crawlable DOM labels, LCP target, OG image — are in [README.md](README.md) §"SEO discipline.")

---

## Sitemap order reconciliation

Sitemap specifies six sections: (1) hero statement, (2) what the record contains, (3) three-layer immutability, (4) print-to-PDF, (5) compliance context, (6) final CTA. This proposal preserves that order exactly. No additions or changes.

---

## Section 0 · Sticky navigation

See [README.md](README.md) §"Sticky navigation" and homepage.md §0. Current page indicator: "Audit Trail" item in the Features dropdown shows active state.

---

## Section 1 · Hero — "The record is sealed when the call is made."

**Purpose** — In one viewport: communicate the terminal, irrevocable nature of the sealed run record to a compliance-minded visitor. The hero fragment must read as a formal document, not an application screen.

**Layout** — Single column, centered, `min-height: 100vh`. Top-to-bottom: section label pill → H1 hero statement → sub-paragraph → CTA row → hero product-UI fragment.

Hero fragment in browser chrome, `max-width: 960px`, light screenshot treatment. The fragment shows the sealed run detail view — the compliance-facing record.

**What's shown** — The hero fragment:

**Run header**: Run name in Inter 600 (e.g., `Release v4.2.1 — Staging`). Prominent status badge `Go` in Go-700/Go-100 recipe. A `SEALED` label in Geist Mono 500 Slate-400 immediately to the right of the status badge. Playbook name and environment tag below. Started by + timestamp, Completed + timestamp — both in Geist Mono. The overall density is intentionally higher than an operational screen: this is a record, and records are document-dense.

**Decision record block**: Rendered below the run header, visually distinct with a hairline top rule and slightly elevated card treatment. Contents: decision label "Go" (Go-500 text), decision maker full name, timestamp (Geist Mono), justification text (if applicable — shown here with a short justification in Inter 400 italic). A small **lock icon** (2px stroke, 16px, Slate-400) appears to the left of the "SEALED" label in the run header. This lock icon does NOT animate. It does not pulse. It does not glow. It is static. The run is sealed; sealed things do not move.

**Spec list (partial)**: Below the decision block, three visible spec rows in the read-only collapsed state: spec title, severity badge, result badge (Passed/Failed/Skipped in their respective colors), executed-by name, timestamp. One spec row is shown in the expanded state: all spec fields visible (severity, description, expected result), then the artifact panel showing an inline image preview (a screenshot, rendered as a thumbnail with filename + "Uploaded by [name] · [timestamp]" in Geist Mono beneath). The inline artifact rendering is the visual proof that the record contains everything.

**Look & feel** — The hero fragment reads more like a formal document than an application. The Geist Mono timestamps and identifiers are the visual signature of this — they communicate "this is a real, precise record." The lock icon is the critical element: it must be unambiguous that the record is sealed, but it must not animate. The lock icon is evidence, not a motion event. Orange appears only on the logo fire glyph and the secondary "Start free" CTA — the primary CTA on this page is "Talk to us."

*[working hero H1: "The record is sealed when the call is made."]*
*[working sub: "No edits. No overwrites. Every artifact, every decision, every tester's identity — sealed at three layers when the go/no-go call is recorded. Send the URL."]*

**Motion** — Standard choreographed page entrance: pill → H1 → sub-paragraph → CTA row → hero fragment. All `--ease-page`. Once only. The hero fragment is entirely static — no animation within it. No badge animation, no lock icon animation, no idle cycling. The silence is the argument.

**Interactivity** — The lock icon shows a tooltip on hover: *[working: "This record is permanently sealed. No edits are possible."]*. This reinforces the claim without animating the lock. The artifact thumbnail in the expanded spec row shows a hover state (very slight shadow lift) to indicate it is a real image — not clickable in the static fragment, but the hover teaches the interaction.

**SEO** — Only `<h1>` on the page. Sub-paragraph live DOM: "sealed," "three layers," "no edits," "no overwrites," "tamper-evident." Fragment labels are DOM text. `alt` on `<img>` fallbacks: *"NoHotfix sealed run record showing a go/no-go decision block with decision maker identity and timestamp, followed by a spec list with inline artifact previews, all in read-only state."* CTAs: primary "Talk to us" → `/contact`; secondary "Start free" → `/signup`.

---

## Section 2 · What the record contains

**Purpose** — Give the compliance buyer a complete inventory of what is in the run record. This is the "send the auditor this URL" argument — they need to know the record is complete before they trust it.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-sentence, then a **two-column layout** at `max-width: 1100px`. Left column (~50%): an annotated content list. Right column (~50%): a cropped product fragment of the run detail view's decision record block + one expanded spec, with callout annotations.

**What's shown** — Left column: five content items, each with a small icon (Slate-400, 2px stroke) and Inter 600 H3 heading + body line:

1. *[working heading: "The go/no-go decision — who made it, when, and why."]*. Body: *[working: "Decision type (Go / No-Go), decision maker's full name, exact timestamp, and — for a Go with failed specs — the mandatory written justification."]*
2. *[working heading: "Every spec, with its final outcome."]*. Body: *[working: "Full spec list grouped by section, each row showing result, the tester who executed it, and timestamp."]*
3. *[working heading: "Every artifact, inline."]*. Body: *[working: "Screenshots render as thumbnails. Log text renders as readable text. URLs are clickable links. Measured values show the configured threshold alongside the observed value."]*
4. *[working heading: "Section-level context."]*. Body: *[working: "If a section was skipped, the skip reason is recorded. If a spec was skipped, its skip reason is recorded. Nothing is omitted."]*
5. *[working heading: "Abandonment, if applicable."]*. Body: *[working: "If the run was abandoned rather than decided, the abandonment reason, the acting Admin's identity, and the timestamp are recorded — along with any partial results collected before abandonment."]*

Right column: A product fragment crop showing the decision record block (items 1) + one expanded spec with an inline image artifact and a measured-value artifact below it (items 2, 3). Callout annotations (numbered circles, Slate-700 for this page's compliance-formal register — see orange restraint note below) pointing to: decision block, spec result, inline image, measured value with threshold.

*Orange restraint note for this section*: The compliance-formal register of this page means orange should be used even more sparingly. Section label pill is the only orange element above the fold in this section. Callout annotations on the fragment use Slate-700 circles (not orange), because the compliance persona reads Slate as neutral authority, not brand accent. Orange-800 inline links are still correct per brand law.

**Look & feel** — Left column: structured, document-like. The five items read as a checklist a compliance buyer would mentally tick off: "Yes, the record has this. Yes, it has that." Right column: the fragment is the evidence for the checklist. Geist Mono on all timestamps and identifiers inside the fragment. The record must read as complete and definitive.

**Motion** — Section entrance. Left-column items stagger 0/80/160/240/320ms, each rising 16px. Fragment fades in after the first item. Callout circles pop in with `--ease-spring` after the fragment, staggered 80ms each.

**Interactivity** — Left-column hover highlights the corresponding callout on the right fragment (callout circle scales 1.1×, 150ms). The inline image thumbnail in the fragment shows a hover shadow-lift (not clickable in the static fragment). Keyboard-accessible paired hover.

**SEO** — `<h2>` + five `<h3>` headings with vocabulary: "decision record," "spec outcomes," "artifact," "inline," "abandonment." Body text crawlable. Internal link: *"See three-layer immutability →"* → anchors down to Section 3.

---

## Section 3 · Three-layer immutability

**Purpose** — State the technical implementation of immutability precisely. The audience reads like engineers. Do not hide the architecture. This section is the most technical in the set and earns its place because the compliance and VP Engineering personas evaluate tools by their stated guarantees, and a guarantee is only as good as its implementation.

**Layout** — Default background. Section label pill + H2 + sub-paragraph, then a **three-card row** at `max-width: 1100px` (standard solid card recipe, equal-width, no bento — this is a simple three-item set, not a feature showcase).

**What's shown** — Three cards, one per layer:

**Card 1 — API layer**: Icon: shield with slash (2px stroke, Slate-700 on light / Slate-200 on dark). Heading: *[working: "No edit endpoints for completed runs."]*. Body: *[working: "The API exposes no mutation routes for runs in the Go, No-Go, or Abandoned state. There is no endpoint to call — not for admins, not for anyone. The immutability constraint is at the surface layer."]*. Quiet code-style callout in Geist Mono, small, muted: `404 Not Found — POST /runs/{id}/specs/{specId}` (if the run is completed). This illustrates the claim with the actual HTTP behavior.

**Card 2 — Service layer**: Icon: state machine / flowchart glyph (2px stroke, Slate-700). Heading: *[working: "The state machine rejects all mutations."]*. Body: *[working: "Even if a mutation request bypasses the API routes, the service layer enforces the state machine — a completed run's state transitions are closed. Every mutation attempt returns a rejection."]*. Quiet Geist Mono callout: `RunCompletedError — mutations rejected on terminal runs`.

**Card 3 — Database layer**: Icon: database / cylinder (2px stroke, Slate-700). Heading: *[working: "DB constraints prevent writes."]*. Body: *[working: "At the data layer, completed runs are protected by database-level constraints. Even a direct database write cannot alter a sealed run's records. The three layers are independent — each one would hold if the other two failed."]*. Quiet Geist Mono callout: `CHECK constraint — run_status IN ('go','no_go','abandoned') → immutable`.

**Look & feel** — The three cards are the most technical element on the site outside the product itself. The Geist Mono code-style callouts are the visual signature: they communicate to the engineering reader that this is a real constraint, not a design claim. No orange on the card icons (Slate — this section is Sentinel-register, not CTA-register). The three cards are equal-weight; no card is "more important" than the others — the three layers are independent and co-equal.

**Motion** — Section entrance. Cards stagger 0/100/200ms, rising 20px, `--ease-page`. The Geist Mono callout in each card types in character-by-character after the card fades in — the one animated typing element in the set, used here because it literalizes the "this is a real constraint" claim (the line is *written into* the record in front of you).

Implement with the **React Bits `TextType`** component (reactbits.dev/text-animations/text-type), ported into the codebase by hand the way `Magnet.tsx` already is (`apps/web/src/components/Magnet.tsx` — "Ported to TypeScript from reactbits.dev") — React Bits is copy-in, not an npm dependency. Configuration for this use:
- `startOnVisible` — typing begins when the card scrolls into view, not on page load, so it stays in sync with the per-card stagger.
- `loop={false}` — types once and stops. It never re-types and never deletes. This is mandatory: per the brand motion philosophy, sealed things don't move — a looping/deleting cursor on an immutability claim would contradict the message.
- `typingSpeed` tuned so each callout completes in ~400ms (these are short single lines); `initialDelay` offset per card to land just after that card's fade-in.
- `showCursor` with a single blinking caret while typing; the caret is removed once the line is complete (no persistent idle cursor — nothing on this section animates after it settles).
- Cursor/caret color: Slate (not orange — Sentinel register, Phase 3).

`prefers-reduced-motion`: do **not** mount `TextType` — render the final callout string immediately as static Geist Mono text. (The component does not itself honor `prefers-reduced-motion`, so the guard lives in our wrapper, exactly as the global reduced-motion rule requires.)

**Interactivity** — Card hover: standard `translateY(-4px)` + shadow deepen. The Geist Mono callout does not animate on hover (it is already in its final state). No links from individual cards — the section is self-contained.

**SEO** — `<h2>` with "immutability," "three-layer," "completed runs." `<h3>` per card: "API," "service layer," "database constraints" — technical vocabulary that matches the searches of engineering teams evaluating tools. Body text crawlable. Internal link at section close: *"See how the run is sealed →"* → `/features/go-no-go#after-the-decision`.

---

## Section 4 · Print-to-PDF for auditors

**Purpose** — Show the print-to-PDF capability as the practical compliance output. Make the "send the auditor the URL" story concrete by showing what the printed document looks like. Be honest that this is browser print-to-PDF (not a dedicated one-click export) and that the dedicated export is post-launch.

**Layout** — `--bg-section-alt`. Section label pill + H2 + sub-paragraph, then a **large product fragment** showing the print layout, `max-width: 800px`, centered. Below the fragment, a content list and an honesty note.

**What's shown** — The fragment is the "certified document" treatment per Phase 12. This is the most compliance-formal visual on the site. It shows a browser print preview of the run detail view:

The print-preview frame is different from the standard browser chrome frame: it uses a plain white sheet context (no traffic-light dots, no URL bar) with a faint gray page-edge shadow to evoke a printed document. The inner content is the same run detail view but in print layout:
- Page header (repeated across pages): run name in Inter 600, playbook name, completion date, status label "Go" — all in black/dark text.
- Below: the decision record block — identical content to the live view, rendered in a more document-appropriate single-column layout. Geist Mono on timestamps and identifiers.
- Below: spec list in expanded state (all specs fully expanded, matching the print layout rule: `all spec rows are expanded automatically for print`). Artifact image thumbnails shown inline at reduced size. File-type-only items shown as `filename · [file type]` in Geist Mono (download links hidden in print).
- A faint page-border rule on the outer edge of the visible page, and below it a partial second page beginning (to communicate multi-page document).

The overall effect: a Geist Mono–heavy, formally structured document that reads as real compliance evidence, not a design mockup.

Below the fragment, a four-item list:
1. *[working: "All spec rows are expanded automatically — nothing is hidden in the printed document."]*
2. *[working: "Artifact images print inline at reduced size. Files print as filename + type. URLs print as plain text."]*
3. *[working: "The go/no-go decision block is kept on a single page where possible. The decision record is never split across pages."]*
4. *[working: "Page headers repeat: run name, playbook, completion date, status — on every page, for multi-page records."]*

Honesty note (Inter 400, Slate-600, quiet, below the list): *[working: "At launch, audit export is browser print-to-PDF — available on every plan, no special setup. A dedicated one-click PDF and structured JSON export is on the roadmap for a future release. See the platform page for what's coming."]*. Internal link: "See the platform roadmap" → `/platform`.

**Look & feel** — The print-preview fragment is the most visually distinctive element on this page. The plain-sheet context (no browser chrome) reads as a document rather than a UI, which is the intent. Geist Mono throughout communicates formal precision. The "certified document" quality comes from the font and the layout density — not from any added decorative elements (no stamps, no watermarks, no icons). The honesty note is small and quiet — visible, not buried, but not the focus.

**Motion** — Section entrance. Heading fades+rises. Print-preview fragment slides up 24px + fades (700ms, `--ease-page`). Content list items stagger 80ms each after the fragment. Honesty note fades in last. Once only.

**Interactivity** — The fragment is static. A "Print" button affordance is shown in the fragment's top-right action bar — not functional in the marketing fragment, but it teaches the interaction. Hovering the "Print" button in the fragment shows a hover state (background shift) to indicate it is a real button in the product.

**SEO** — `<h2>` with "print to PDF," "audit," "compliance." Content list items as body text: "expanded," "inline artifacts," "decision block." Honesty note is crawlable — it accurately describes the launch capability. Internal link to `/platform`.

---

## Section 5 · Compliance context

**Purpose** — Connect the product capability to the regulatory frameworks the compliance buyer cares about. Make non-prescriptive, honest claims. No certification language NoHotfix hasn't earned.

**Layout** — Default background. Section label pill + H2 + sub-paragraph, then a **two-column text layout** at `max-width: 960px`. Left: framework context. Right: a reserved testimonial slot.

**What's shown** — Left column (two-thirds width): three short paragraphs, one per framework family:

Paragraph 1 (SOC2 context): *[working: "SOC2 Type II requires evidence that software changes are tested before they go to production. NoHotfix records that evidence in real time — spec results, attached artifacts, and the final go/no-go decision — in a tamper-evident record you don't have to reconstruct."]*

Paragraph 2 (PCI-DSS context): *[working: "PCI-DSS requires that changes to in-scope systems are tested and that evidence of testing is available for audit. Every NoHotfix run produces that evidence as a natural output of the release process."]*

Paragraph 3 (General): *[working: "NoHotfix does not hold a SOC2 certification or PCI-DSS certification. These statements describe how the product's tamper-evident records map to testing-evidence requirements — teams should confirm fitness for purpose with their own compliance counsel."]*. Style this paragraph in Slate-600, Inter 400 — the disclaimer register. It is not buried or hidden; it is part of the visible copy. Honesty is the brand value.

Right column (one-third width): A reserved testimonial slot card. Standard solid card recipe, top accent stripe in Slate-400 (the compliance persona accent from Phase 10). Inside: *[working placeholder text in Slate-400, Inter 400 italic: "Reserved for a compliance-buyer quote or case study excerpt. To be added at first paying compliance customer. No fabricated testimonials."]*. Below the placeholder text, a quiet reserved author block with empty name, title, and company fields — communicating the structure without filling it with fiction.

**Look & feel** — Left column is document-formal in register. The disclaimer paragraph is visually quieter (Slate-600) but not hidden — this is the brand's "clinically confident" voice applied to legal honesty. The right column testimonial card's Slate-400 accent stripe is the only color accent in this section beyond the section label pill.

**Motion** — Section entrance. Left column paragraphs stagger 0/150/300ms. Right column card fades in at 200ms. Once only.

**Interactivity** — Static. Link at the close of the left column: *"Talk to us about compliance use cases →"* → `/use-cases/compliance`. Link at the close of the section: *"Talk to us →"* → `/contact`.

**SEO** — `<h2>` with "compliance," "SOC2," "PCI-DSS," "audit evidence." All three paragraphs crawlable, including the disclaimer (which is genuinely useful search content for compliance-evaluating readers). Internal links to `/use-cases/compliance` and `/contact`.

---

## Section 6 · Final CTA — "Talk to us" (primary) + "Start free" (secondary)

**Purpose** — The conversion close. This page has a different conversion hierarchy than the other two: compliance buyers need a conversation, not just a signup. Primary CTA is "Talk to us"; secondary is "Start free."

**Layout** — Centered, full-width, ~120px top/bottom padding. Display headline, sub-copy, **primary CTA "Talk to us"** (orange), secondary CTA "Start free" (quiet, bordered, not filled).

**What's shown** — *[working H2: "When the auditor asks, send them the URL."]*. *[working body: "The record exists from the moment the run started. Nothing in it can be altered. Every artifact is preserved. Every decision is documented."]*. Primary CTA: "Talk to us" → `/contact`. Secondary CTA: "Start free" → `/signup`. Closing tagline: "Ship it once."

**Look & feel** — Sanctioned warm radial. Primary "Talk to us" CTA is `#EA6B04` fill, white label — the one dominant orange CTA. Secondary "Start free" is a bordered button (no fill), `#EA6B04` border, `#9A3F05` label — clearly secondary. The swapped CTA order from the other two pages communicates the difference to a returning visitor.

**Motion** — Heading + CTAs fade+rise on reveal. 150ms hover, no scale.

**Interactivity** — Primary → `/contact`. Secondary → `/signup`.

**SEO** — `<h2>` with "audit," "record," "URL." Final internal links to contact and signup.

---

## Narrative arc

*Claim* (hero: sealed, static, document-like) → *Completeness* (what the record contains: inventory for the compliance checklist) → *Guarantee* (three-layer immutability: how it's technically enforced) → *Practical output* (print-to-PDF: what the auditor actually receives) → *Framework fit* (SOC2/PCI-DSS context: honest and non-prescriptive) → *Convert* (talk to us: this needs a conversation).

The compliance buyer moves from "I need to reconstruct evidence for audits" to "the record is already there and complete" to "I can trust it because it's technically sealed" to "I can print it and hand it to the auditor" to "this maps to what my framework requires" to "I need to talk to someone." The page converts a skeptic into a conversation, not a signup.
