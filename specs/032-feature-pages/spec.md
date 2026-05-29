# Feature Specification: Feature Marketing Pages (Artifact Enforcement · Go/No-Go · Audit Trail)

**Feature Branch**: `032-feature-pages` (work performed on `feature/homepage` per instruction — see Notes)
**Created**: 2026-05-29
**Status**: Draft
**Input**: User description: "create the feature pages described in the docs/design/pages/features folder, before you do read the docs/design/pages/features/readme.md and the relevant design guidelines in the docs/"

## Overview

Build the three deep feature marketing pages that make NoHotfix's enforcement argument concrete:

| URL | Page | Conversion goal |
|---|---|---|
| `/features/artifact-enforcement` | Artifact-Gated Execution | Start free |
| `/features/go-no-go` | Go/No-Go Decision Gate | Start free |
| `/features/audit-trail` | Immutable Audit Trail | Talk to us (primary) / Start free (secondary) |

These three pages are a **set** that shares one archetype: a declarative hero statement over a large, faithful product-UI crop, then 3–6 explanatory bands beneath. A visitor moving through the three should feel they are reading chapters of one technical argument. The screenshot is the argument; the copy annotates it. Each page is differentiated by its hero fragment and (for Audit Trail) a more compliance-formal register.

The pages reuse the homepage's already-built shared chrome — sticky navigation, footer, the "Ship it once." final-CTA rhythm, and the global visual treatments — and exist today as `404`s linked from the footer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - QA lead verifies the enforcement is real (Priority: P1)

A QA lead arrives at `/features/artifact-enforcement` skeptical that "enforcement" is more than an advisory reminder. In one viewport they must see the mechanic named, shown in action, and made viscerally clear that the pass action is a hard gate — blocked, not warned. They then want a complete inventory of the evidence types that map to their own workflow, a concrete walkthrough of how enforcement works, reassurance that the record is permanent, and reassurance that adoption is not a heavy project — before being asked to start free.

**Why this priority**: Artifact gating is the wedge mechanic and the primary differentiator. The QA lead is the primary persona for the whole product. This page is the most load-bearing of the three and is independently the most valuable single deliverable.

**Independent Test**: Ship only this page. A QA lead can land on it, understand the blocked-pass mechanic from the hero fragment alone, read the six artifact types, follow the three-step enforcement walkthrough, and click "Start free." Delivers value as a standalone conversion asset.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/features/artifact-enforcement`, **When** the hero renders, **Then** they see a single `<h1>` declarative statement, a sub-paragraph naming the mechanic, a primary "Start free" CTA, and a product-UI fragment showing a **disabled** Pass button (lock icon, reduced opacity, "not-allowed" affordance, an enabling-hint label) that reads instantly as blocked — not loading.
2. **Given** the visitor scrolls to the six-artifact-types section, **When** the section is in view, **Then** all six type names (File upload, Text, Checkbox, URL, Measured value, Structured table) appear as live, crawlable text, each with a use-case line, supporting detail, and a small faithful product fragment inset.
3. **Given** the visitor reaches "How enforcement works," **When** they read the three steps, **Then** they see the same disabled-Pass treatment in step 2 and the enabled (orange, clickable) Pass treatment in step 3 — the contrast being the conversion moment.
4. **Given** the visitor reaches "What gets locked," **When** they view the two-panel visual, **Then** they see an editable "active run" state beside a read-only "sealed" state with a static lock icon, plus a link to `/features/audit-trail`.
5. **Given** the visitor reaches the final CTA, **When** they click the primary CTA, **Then** they are taken to the signup destination; the secondary CTA goes to `/how-it-works`.

---

### User Story 2 - VP Engineering recognizes go/no-go as the governance they lack (Priority: P2)

A VP Engineering / QA Director arrives at `/features/go-no-go` making release calls informally (a Slack "are we good?"). The page must establish that go/no-go is a formal, role-gated, permanently recorded decision: the Admin sees every spec outcome sorted by severity, only Admins can decide, only after all specs are terminal, and a Go with failures requires a written justification recorded permanently. They leave understanding it protects them — the record shows what was known before shipping.

**Why this priority**: Go/No-Go is the second pillar and the governance argument for the buyer/decision-maker persona. Independently valuable but secondary to the wedge mechanic.

**Independent Test**: Ship only this page. A VP Engineering can land on it, understand the decision screen from the hero fragment, follow role-gating and the justification requirement, and click "Start free." Delivers value standalone.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/features/go-no-go`, **When** the hero renders, **Then** they see the decision-screen fragment: a severity-sorted spec list with failed specs surfaced first, outcome counts in semantic colors, a Go/No-Go action pair, and a mandatory-justification field with placeholder text — none of the buttons in a pre-decided/highlighted state.
2. **Given** the visitor reads "What the decision screen shows," **When** they hover a left-column explainer item, **Then** the corresponding numbered callout on the right-column fragment highlights (paired hover), and the same highlight is reachable by keyboard focus.
3. **Given** the visitor reaches "Role gating," **When** the fragment renders, **Then** it shows the non-Admin member's inert view (lock icon + informational message, no ability to act) and a supporting paragraph stating the gate is structural, not a toggle.
4. **Given** the visitor reaches "The justification requirement," **When** the confirmation-overlay fragment renders, **Then** it shows the failed-spec list, a required justification text area, and a **disabled** Confirm button until justification is written.
5. **Given** the visitor reaches "After the decision," **When** the fragment renders, **Then** they see a prominent `Go` status badge, a sealed decision record (decider, timestamp, justification), no edit controls, and a link to `/features/audit-trail`.

---

### User Story 3 - Compliance buyer trusts the sealed record enough to start a conversation (Priority: P3)

A compliance buyer or QA Director who has lived a painful audit-evidence reconstruction arrives at `/features/audit-trail`. The page must read more like a formal certified document than an app screen. They need a complete inventory of what the record contains, a precise statement of how immutability is technically enforced (three independent layers), a concrete view of the print-to-PDF compliance output, and an honest mapping to SOC2/PCI-DSS testing-evidence requirements — leading to a conversation ("Talk to us"), not a self-serve signup.

**Why this priority**: Audit Trail is the third pillar, serves the compliance persona, and has a different (conversation-led) conversion goal. Highest-formality register; depends on the typed-callout treatment. Independently valuable but third in sequence.

**Independent Test**: Ship only this page. A compliance buyer can land on it, verify the record is complete and tamper-evident, view the certified-document print layout, read the honest framework mapping, and click "Talk to us." Delivers value standalone.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/features/audit-trail`, **When** the hero renders, **Then** they see a sealed run record (run header with `Go` badge + `SEALED` label + a **static, never-animating** lock icon, decision record block, and a read-only spec list with an inline artifact preview), and the **primary** CTA is "Talk to us" with "Start free" secondary.
2. **Given** the visitor reaches "What the record contains," **When** the section renders, **Then** five content items appear with crawlable headings and a fragment with neutral (non-orange) numbered callouts, honoring the page's restrained-orange compliance register.
3. **Given** the visitor reaches "Three-layer immutability," **When** each card scrolls into view, **Then** the technical claim (API / service / database layer) is stated with a monospace code-style callout that types in once and stops (no loop, no idle caret), and renders as static text under reduced-motion.
4. **Given** the visitor reaches "Print-to-PDF for auditors," **When** the fragment renders, **Then** it shows a certified-document print-preview (plain sheet, monospace-dense), a content list of what prints, and an honest note that launch export is browser print-to-PDF with dedicated export on the roadmap (linking `/platform`).
5. **Given** the visitor reaches "Compliance context," **When** the section renders, **Then** SOC2/PCI-DSS mappings appear alongside a visible, non-buried disclaimer that NoHotfix holds no certification, plus a reserved (empty, non-fabricated) testimonial slot.

---

### User Story 4 - Visitor traverses the three-pillar argument (Priority: P2)

A visitor who enters any one feature page can reach the other two without returning to the homepage, forming a complete picture of the enforcement triad. Cross-links are distributed naturally across sections (not dumped in the footer) and form a navigational triangle.

**Why this priority**: The set's coherence and SEO link-equity depend on this. It is cross-cutting across all three pages, so it is only fully testable once at least two pages exist — hence P2 rather than P1.

**Independent Test**: With at least two pages live, verify each page links to the others at the specified in-content positions and that the current-page indicator in the nav reflects the active page.

**Acceptance Scenarios**:

1. **Given** the visitor is on Artifact Enforcement, **When** they reach the close of "What gets locked," **Then** they find links to both `/features/go-no-go` and `/features/audit-trail`.
2. **Given** the visitor is on Go/No-Go, **When** they read the hero sub-paragraph and the close of "After the decision," **Then** they find links to `/features/artifact-enforcement` and `/features/audit-trail` respectively.
3. **Given** the visitor is on Audit Trail, **When** they read the hero sub-paragraph and the close of "Three-layer immutability," **Then** they find links to `/features/artifact-enforcement` and `/features/go-no-go#after-the-decision` respectively.
4. **Given** the visitor is on any feature page, **When** the sticky nav renders, **Then** the "Features" nav item and the page's own entry within the Features dropdown show the active state.
5. **Given** the visitor is on any feature page, **When** they scan the content, **Then** the page also links to `/how-it-works`, `/pricing`, and at least one relevant `/use-cases/*` page.

---

### User Story 5 - Search engine indexes the mechanic claims (Priority: P3)

Each feature page is a standalone SEO asset targeting a distinct intent cluster. All product-UI labels and mechanic claims are live DOM text (never baked into images) so they are crawlable, the page has a single correct heading hierarchy, and it carries structured data.

**Why this priority**: SEO drives inbound discovery but is not required for the page to deliver value on a direct visit. Cross-cutting and verifiable independently of conversion.

**Independent Test**: Crawl each page; verify one `<h1>`, correct `<h2>`/`<h3>` nesting, semantic landmarks, structured data, and that artifact-type names, badge states, and mechanic vocabulary appear as text.

**Acceptance Scenarios**:

1. **Given** a crawler fetches any feature page, **When** it parses headings, **Then** there is exactly one `<h1>` (the pillar headline) and no skipped heading levels.
2. **Given** a crawler parses the hero product fragment, **When** it reads labels (artifact type names, badge states, button labels, field names), **Then** those are real text nodes, not raster image content.
3. **Given** a crawler reads page metadata, **When** it parses structured data, **Then** it finds `SoftwareApplication` + `ItemPage` JSON-LD and a `BreadcrumbList` (Home → Features → [page]).
4. **Given** a crawler reads each page, **When** it compares them, **Then** each has a distinct title/description/intent cluster (not duplicate content).

---

### Edge Cases

- **Reduced motion**: With `prefers-reduced-motion` set, all section entrances, staggers, count-ups, connector draws, and the typed monospace callout are suppressed; content renders in its final state immediately. The typed callout must not mount its typing component at all — it renders static text.
- **Disabled-control legibility on mobile**: The blocked Pass button must remain legible and meet a minimum 44×44px touch target even in its disabled state at the smallest breakpoint.
- **Callout annotations on small screens**: Below the mobile breakpoint, fragment callout annotations are hidden (the fragment is too small to annotate legibly); the left-column descriptive text must carry the argument alone.
- **Orange-discipline overflow**: When more than two orange elements would appear in a single viewport (e.g. three callout circles plus a label), the lowest-priority elements fall back to neutral (Slate) so no more than two orange elements appear per viewport.
- **Links to not-yet-built routes**: CTAs and cross-links may point to routes that currently 404 (e.g. `/how-it-works`, `/contact`, `/use-cases/*`, `/platform`, signup). Links must still be rendered with their correct destinations so they resolve when those routes are built; a 404 today is acceptable and expected.
- **No fabricated proof**: Testimonial slots render as reserved, visibly empty placeholders with no invented names, companies, logos, or stats.
- **Honesty on roadmap items**: Post-launch capabilities (dedicated audit-grade PDF/JSON export, Scale's compliance-operations layer) must never be presented as current. The only launch audit export is browser print-to-PDF plus the shareable URL.
- **Sealed things don't move**: Any lock icon or `SEALED` badge on the Audit Trail page (and the sealed-state lock on Artifact Enforcement §4 / Go/No-Go §5) never animates — no pulse, no glow, no idle motion — even when other motion is permitted.

## Requirements *(mandatory)*

### Functional Requirements

#### Shared archetype & chrome (all three pages)

- **FR-001**: Each page MUST follow the shared archetype: a declarative hero statement in the display heading style over a large, faithful product-UI crop of the mechanic, followed by 3–6 explanatory bands.
- **FR-002**: Each page MUST render the existing sticky navigation, footer, and "Ship it once." final-CTA rhythm consistent with the homepage's global treatments (light-first theme with co-equal dark, section entrance motion, section label pills, card recipes, screenshot treatment, orange discipline).
- **FR-003**: The hero product-UI fragment on each page MUST be presented inside the standard browser-chrome frame and read as real product output at a glance.
- **FR-004**: All product-UI fragments MUST be built as faithful HTML/DOM components (labels, badges, fields as real text), never as baked raster images, so the mechanic claims remain legible and crawlable.
- **FR-005**: Each page MUST end with the shared closing final-CTA section adapted to that page's conversion goal.
- **FR-006**: No more than two orange elements MUST appear per viewport on any page; orange is reserved for CTAs, the logo glyph, and (where permitted) primary callouts/labels — never as a section background beyond a ≤10% tint.

#### Artifact Enforcement page (`/features/artifact-enforcement`)

- **FR-010**: The page MUST present six sections in order: (1) Hero, (2) Six artifact types (the one permitted bento moment), (3) How enforcement works, (4) What gets locked, (5) Adoption / credibility, (6) Final CTA "Start free."
- **FR-011**: The hero MUST show a disabled Pass button treatment (lock icon, ~0.45 opacity, not-allowed cursor, an enabling-hint label) that reads as blocked rather than loading, with no spinner and no animation, alongside the artifact-requirements panel and a six-type configuration preview.
- **FR-012**: The disabled Pass button MUST expose an accessible, keyboard-reachable, crawlable tooltip explaining how to enable it (not a CSS pseudo-element).
- **FR-013**: The six-artifact-types section MUST present all six types (File upload, Text, Checkbox, URL, Measured value, Structured table) as equal-weight cards, each with a use-case line, supporting detail, and a small product-fragment inset, with each type name as an `<h3>`.
- **FR-014**: "How enforcement works" MUST show three steps with the disabled-Pass treatment in step 2 and the enabled-Pass treatment (orange fill, clickable) in step 3, using a visible contrast as the argument.
- **FR-015**: "What gets locked" MUST show an active (editable) run state beside a sealed (read-only, static lock icon) state and link to `/features/audit-trail`.
- **FR-016**: The adoption/credibility section MUST present three honest product-fact cells and a reserved (empty) testimonial slot, with no fabricated content.
- **FR-017**: The final CTA primary action MUST be "Start free" and the secondary "See how it works" (`/how-it-works`).

#### Go/No-Go page (`/features/go-no-go`)

- **FR-020**: The page MUST present six sections in the sitemap order: (1) Hero, (2) What the decision screen shows, (3) Role gating, (4) The justification requirement, (5) After the decision, (6) Final CTA.
- **FR-021**: The hero fragment MUST show the decision screen: a severity-sorted spec list (failed specs surfaced first, with a failed-row tint), outcome counts rendered in semantic colors, an available-but-not-decided Go/No-Go action pair, and a mandatory-justification field with placeholder text.
- **FR-022**: "What the decision screen shows" MUST present a four-item explainer paired with an annotated fragment, where hovering or focusing an explainer item highlights the corresponding callout (keyboard-accessible paired hover).
- **FR-023**: "Role gating" MUST show the non-Admin member's inert view (static lock icon, informational message) and state that the Admin-only gate is structural and cannot be toggled off.
- **FR-024**: "The justification requirement" MUST show a confirmation-overlay fragment with the failed-spec list, a required justification text area, and a disabled Confirm button until justification is written.
- **FR-025**: "After the decision" MUST show a prominent `Go` badge, a sealed decision record (decider, timestamp, justification), no edit controls, a static `SEALED` label, and link to `/features/audit-trail`.
- **FR-026**: The final CTA primary action MUST be "Start free" and the secondary "Talk to us" (`/contact`).

#### Audit Trail page (`/features/audit-trail`)

- **FR-030**: The page MUST present six sections in the sitemap order: (1) Hero, (2) What the record contains, (3) Three-layer immutability, (4) Print-to-PDF for auditors, (5) Compliance context, (6) Final CTA.
- **FR-031**: The page MUST adopt a more compliance-formal register than the other two, signaled by a monospace-dense "certified document" treatment and more restrained orange usage (callout circles neutral/Slate, not orange).
- **FR-032**: The hero fragment MUST show a sealed run record (run header with `Go` badge + `SEALED` label + a static lock icon, decision record block, read-only spec list with at least one inline artifact preview) and MUST be entirely static (no animation within it).
- **FR-033**: Every lock icon and `SEALED` badge on this page MUST never animate (no pulse, glow, or idle motion); the lock icon MUST expose a tooltip on hover stating the record is permanently sealed.
- **FR-034**: "What the record contains" MUST present five content items (decision, spec outcomes, inline artifacts, section-level context, abandonment) and an annotated fragment with neutral callouts.
- **FR-035**: "Three-layer immutability" MUST present three equal-weight cards (API, service, database layers) each with a monospace code-style callout; each callout MUST type in once and stop (no loop, no deletion, no persistent idle caret) and MUST render as static text under reduced motion.
- **FR-036**: "Print-to-PDF for auditors" MUST show a certified-document print-preview fragment (plain sheet, no browser chrome), a content list of what prints, and an honest note that launch export is browser print-to-PDF with dedicated PDF/JSON export on the roadmap (linking `/platform`).
- **FR-037**: "Compliance context" MUST present SOC2 and PCI-DSS mappings plus a visible, non-buried disclaimer that NoHotfix holds no certification, alongside a reserved (empty) testimonial slot.
- **FR-038**: The final CTA primary action MUST be "Talk to us" (`/contact`, filled orange) and the secondary "Start free" (`/signup`, bordered), with the swapped order reflecting the conversion goal.

#### Cross-page navigation & internal linking

- **FR-040**: Each feature page MUST link to the other two feature pages at the specified in-content positions, forming a navigational triangle (not dumped in the footer).
- **FR-041**: Each feature page MUST link to `/how-it-works`, `/pricing`, and at least one relevant `/use-cases/*` page (Artifact Enforcement → qa-teams; Go/No-Go → engineering-managers; Audit Trail → compliance and `/contact` and `/platform`).
- **FR-042**: The sticky nav current-page indicator MUST show the "Features" item active and the page's own entry within the Features dropdown active.

#### SEO, semantics & accessibility

- **FR-050**: Each page MUST have exactly one `<h1>` (the pillar headline) with all other section headings as `<h2>` and subpoints as `<h3>`, with no skipped levels.
- **FR-051**: Each page MUST use semantic landmarks: `<main>` wrapping content below nav and `<section aria-labelledby>` for every content band.
- **FR-052**: Each page MUST carry `SoftwareApplication` + `ItemPage` JSON-LD and a `BreadcrumbList` (Home → Features → [page]), plus a distinct title/description matching its intent cluster.
- **FR-053**: The hero headline MUST be the LCP target (display heading, swap-loaded preloaded font); below-fold UI fragments MUST be lazy-loaded with explicit dimensions.
- **FR-054**: Each page MUST define an OG image as its hero fragment cropped to 1200×630.
- **FR-055**: All interactive demonstrations (disabled buttons, paired hovers, tooltips) MUST be keyboard-accessible and expose appropriate ARIA, and the standard orange focus ring MUST be present on focusable elements.

#### Motion & responsive

- **FR-060**: All section entrances MUST animate once on scroll-into-view (fade + rise) and all motion MUST be fully suppressed under `prefers-reduced-motion`, with content rendered in final state.
- **FR-061**: Each page MUST be responsive across the defined breakpoints: full layouts ≥1040px; relaxed two-column/bento stacks 768–1039px; single-column <768px (with connectors and callout annotations hidden where specified); reduced hero headline size and simplified browser chrome <576px.
- **FR-062**: No product-UI fragment MUST auto-cycle or perform idle animation; fragments are static product states (the only animated text element in the set is the Audit Trail §3 typed monospace callout, which runs once and stops).

#### Honesty & content integrity

- **FR-070**: No page MUST present fabricated logos, statistics, or testimonials; all testimonial/quote slots are reserved with placeholder treatment only.
- **FR-071**: No page MUST present post-launch capabilities as current features; roadmap items MUST be clearly labeled as not-yet-available where referenced.
- **FR-072**: Marketing copy in the build MAY use the design docs' indicative working text as a starting point but MUST be treated as placeholder pending a final copy deck; mechanic vocabulary (gate, blocked, artifact, sealed, terminal, immutable, run, playbook, go/no-go, enforcement, the record) MUST be used and banned-list terms avoided.

### Key Entities *(include if feature involves data)*

- **Feature page**: One of three marketing pages, each with a unique URL, pillar headline (`<h1>`), conversion goal, SEO intent cluster, ordered set of sections, and a signature hero fragment.
- **Shared archetype**: The common page structure and global visual/motion treatments inherited by all three pages from the homepage's design system.
- **Product-UI fragment**: A faithful HTML/DOM rendering of a real product surface (run-execution panel, decision screen, sealed record, print preview) used as the primary argument; built from real text and components, never as a raster image.
- **Cross-link triangle**: The set of in-content links connecting the three feature pages to each other and to `/how-it-works`, `/pricing`, relevant `/use-cases/*`, and (Audit Trail) `/contact` and `/platform`.
- **Reserved testimonial slot**: A visibly empty, non-fabricated placeholder reserved for future customer proof.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three feature pages are reachable at their canonical URLs and no longer return 404; the footer links resolve to live pages.
- **SC-002**: On each page, a first-time visitor can identify the page's core mechanic from the hero (within one viewport, no scrolling) — validated in usability testing with ≥80% of participants correctly describing the mechanic (blocked pass / formal locked decision / sealed record) after viewing only the hero.
- **SC-003**: Each page passes an automated accessibility audit with no critical violations, meets WCAG AA color-contrast on all text and interactive states, and is fully operable by keyboard.
- **SC-004**: Each page has exactly one `<h1>`, a valid non-skipping heading hierarchy, semantic landmarks, and valid `SoftwareApplication`/`ItemPage`/`BreadcrumbList` structured data (validated by a structured-data testing tool with zero errors).
- **SC-005**: All product-UI labels and mechanic claims are present as live DOM text (verifiable by disabling images and confirming the artifact-type names, badge states, button labels, and field names remain readable).
- **SC-006**: With `prefers-reduced-motion` enabled, no animation plays on any page and all content (including the Audit Trail typed callout) renders in its final state.
- **SC-007**: Each page renders correctly without layout breakage at ≥1040px, 768–1039px, <768px, and <576px, with the blocked Pass button keeping a ≥44×44px touch target on mobile.
- **SC-008**: The cross-link triangle is complete — from any one feature page a visitor can reach the other two and `/how-it-works`, `/pricing`, and a relevant `/use-cases/*` page without returning to the homepage.
- **SC-009**: The Largest Contentful Paint element on each page is the hero headline, and below-fold fragments are lazy-loaded (verifiable via a performance trace).
- **SC-010**: No fabricated logos, stats, or testimonials appear on any page, and no post-launch capability is presented as a current feature (content review checklist passes).

## Assumptions

- **Work happens on the existing branch.** The user explicitly instructed "stay on the current PR," so this feature was numbered (`032-feature-pages`) and specified without creating a new git branch; all work proceeds on `feature/homepage`. (The standard speckit branch-creation step was intentionally skipped.)
- **Copy is indicative, not final.** The bracketed working text in the design docs communicates intent and length; it may seed the build but is placeholder pending a final copy deck.
- **Shared chrome is reused, not rebuilt.** The homepage's existing navigation, footer, final-CTA, browser-frame, scroll-reveal, and related components are the source of the global treatments; the Features dropdown / current-page indicator may need to be added to the existing flat nav.
- **CTA and cross-link destinations may not exist yet.** Routes such as `/how-it-works`, `/contact`, `/use-cases/*`, `/platform`, and the signup destination are not all built; links are rendered with correct hrefs and may 404 until those pages exist.
- **Reduced-motion guarding is owned by the page.** The typed monospace callout treatment does not self-honor `prefers-reduced-motion`; the page wrapper must guard it and render static text instead.
- **Launch audit export = browser print-to-PDF + shareable URL.** Dedicated audit-grade PDF/JSON export and Scale's compliance-operations layer are post-launch and referenced only as roadmap.
- **The three pages are a deliverable set but independently shippable.** Each page can be built, tested, and deployed on its own; the cross-link triangle is fully verifiable once at least two are live.

## Dependencies

- Homepage shared components and global design treatments (`docs/design/pages/homepage.md`, `apps/web/src/components/*`).
- Brand and motion law (`docs/design/brand-identity.md` v5.0, `docs/design/website-vision.md` v3.0).
- The feature design specs (`docs/design/pages/features/README.md` + the three page specs).
- Content/IA ownership (`docs/marketing/sitemap.md` — the three `/features/*` entries).
- Feature-mechanics source docs (artifact-gated spec execution, run-execution UI, go/no-go decision gate, run immutability, run-history audit trail) for faithful fragment accuracy.

## Out of Scope

- Building `/how-it-works`, `/platform`, `/use-cases/*`, `/about`, `/contact`, `/changelog`, `/blog`, the full `/pricing` page, or the signup flow.
- Implementing the Features / Use Cases nav dropdowns beyond what is needed for the feature pages' current-page indicator (the broader nav restructure is its own effort).
- Final marketing copy / copy deck.
- Any backend, API, or database change — these are static marketing pages with no data persistence.
- Real customer testimonials, logos, or case studies (reserved slots only).
- Dedicated audit-grade PDF/JSON export and Scale compliance-operations features (post-launch).

## Notes

This spec was generated via `/speckit.specify`. Per the user's instruction to "stay on the current PR," the feature was assigned the next sequential number (`032`, following `031-dark-mode-toggle`) and the spec directory was created manually on the `feature/homepage` branch instead of running the branch-creating script. If a dedicated branch is desired later, the standard speckit flow can be resumed.
