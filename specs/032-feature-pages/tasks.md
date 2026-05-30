---
description: "Task list for Feature Marketing Pages (Artifact Enforcement · Go/No-Go · Audit Trail)"
---

# Tasks: Feature Marketing Pages (Artifact Enforcement · Go/No-Go · Audit Trail)

**Input**: Design documents from `/specs/032-feature-pages/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅
**Branch**: work performed on `feature/homepage` (spec numbered `032-feature-pages`)

**Tests**: E2E tests ARE included — research R9 / Constitution Testing-by-layer opted into Playwright coverage for these marketing pages (`apps/web-e2e`). No unit/integration/domain tests (this feature has no domain logic, services, DB, or API).

**Organization**: Tasks grouped by user story. All work is confined to `apps/web` and `apps/web-e2e`. No backend, domain, database, or API changes — therefore no migration / entity / route command-delegation hints apply.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US5 (maps to spec.md user stories)
- Exact file paths included in every task

## Path Conventions

- Pages: `apps/web/src/app/features/<slug>/page.tsx`
- Components: `apps/web/src/components/features/{shared,shared/fragments,<page>}/`
- Reused: `apps/web/src/components/{BrowserFrame,ScrollReveal,Footer,Navigation,Magnet}.tsx`
- E2E: `apps/web-e2e/tests/*.spec.ts` (Playwright, dev server port 3000)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding and shared constants for all three pages

- [X] T001 Create the directory structure in `apps/web/src`: route folders `app/features/artifact-enforcement/`, `app/features/go-no-go/`, `app/features/audit-trail/`; component folders `components/features/shared/`, `components/features/shared/fragments/`, `components/features/artifact-enforcement/`, `components/features/go-no-go/`, `components/features/audit-trail/`.
- [X] T002 [P] Create shared feature-page constants in `apps/web/src/components/features/shared/constants.ts` — cross-link hrefs (`/features/*`, `/how-it-works`, `/pricing`, `/use-cases/*`, `/platform`, `/contact`), the signup URL helper (`${NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com'}/auth/login?screen_hint=sign-up`, matching `FinalCTA.tsx`/`Navigation.tsx`), and the breadcrumb base (`https://nohotfix.com`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared presentational components, fragment primitives, and the JSON-LD helper that ALL three page stories compose. Each is used across ≥2 pages (satisfies the ≥3-use rule for shared abstractions).

**⚠️ CRITICAL**: No page story (US1/US2/US3) can be completed until this phase is done. Tasks touch distinct files and are mostly parallelizable.

### Shared layout components (`components/features/shared/`)

- [X] T003 [P] Create `SectionLabel.tsx` in `apps/web/src/components/features/shared/` — all-caps Inter 500 13px pill, `tone: 'orange' | 'slate'` (orange/slate token recipes per brand spec), static (no entrance animation).
- [X] T004 [P] Create `FeatureHero.tsx` in `apps/web/src/components/features/shared/` — hero scaffold: `SectionLabel` → `<h1>` (DM Sans 700 display, the LCP element) → sub-paragraph → CTA row → fragment slot (children); fragment slides up 24px + fades 700ms once after CTAs via `ScrollReveal`.
- [X] T005 [P] Create `FeatureFinalCTA.tsx` in `apps/web/src/components/features/shared/` — parameterized closing CTA (props per `data-model.md` `FeatureFinalCTAProps`): eyebrow, headline, body, primary `{label,href}`, secondary `{label,href}`, `swapEmphasis?`, `tagline` (default "Ship it once."); sanctioned warm radial background (reuse the `FinalCTA.tsx` radial recipe).
- [X] T006 [P] Create `FactCells.tsx` in `apps/web/src/components/features/shared/` — honest product-fact row (DM Sans number + Inter caption, hairline dividers); optional count-up on reveal (reduced-motion → final value immediately).
- [X] T007 [P] Create `ReservedTestimonial.tsx` in `apps/web/src/components/features/shared/` — visibly empty quote slot, `accentTone: 'orange' | 'slate'` top stripe; italic Slate placeholder; MUST render no fabricated name/company/quote (empty author block only).

### Fragment primitives (`components/features/shared/fragments/`)

- [X] T008 [P] Create `StatusBadge.tsx` in `apps/web/src/components/features/shared/fragments/` — `kind: 'in_progress' | 'awaiting' | 'go' | 'no_go' | 'sealed'` mapped to exact v5 semantic color recipes (Go-700/Go-100, NoGo, Error, Slate); Geist Mono for `sealed`.
- [X] T009 [P] Create `SealedLockIcon.tsx` in `apps/web/src/components/features/shared/fragments/` — static lock glyph (2px stroke). **Never animates** (no pulse/glow/idle) on any page; supports an accessible tooltip prop.
- [X] T010 [P] Create `SpecRow.tsx` in `apps/web/src/components/features/shared/fragments/` — severity badge (`critical`/`high`/`medium`) + result badge (`passed`/`failed`/`skipped`/`in_progress`) in semantic colors, executed-by, Geist Mono timestamp, optional failed-row Error-50 tint.
- [X] T011 [P] Create `PassButton.tsx` in `apps/web/src/components/features/shared/fragments/` — `state: 'blocked' | 'enabled'`. Blocked: lock icon, ~0.45 opacity, `aria-disabled="true"`, not-allowed cursor, accessible keyboard-reachable tooltip (`title`/ARIA, NOT a CSS pseudo-element), min 44×44px even when blocked, NO spinner/animation (reads blocked, not loading). Enabled: orange `var(--color-primary)` fill, `cursor: pointer`.
- [X] T012 [P] Create `ArtifactRequirementPanel.tsx` in `apps/web/src/components/features/shared/fragments/` — renders `ArtifactRequirement[]` with inline completion state (checkmark vs incomplete), Geist Mono on values/thresholds (file slots, measured value `2340 ≤ 3000 ms`, URL field, etc.).
- [X] T013 [P] Create `DecisionRecordBlock.tsx` in `apps/web/src/components/features/shared/fragments/` — decision label + decider name + Geist Mono timestamp + optional justification; when `sealed`, renders `SealedLockIcon` + `SEALED` label and NO edit affordances.

### Structured-data helper

- [X] T014 [P] Create the JSON-LD helper in `apps/web/src/components/features/shared/structured-data.tsx` — builds `SoftwareApplication` + `ItemPage` + `BreadcrumbList` objects from a `FeaturePageMeta` and renders them as inline `<script type="application/ld+json">` (per `contracts/json-ld.md`); no rating/review/testimonial markup, no unearned certification claims.

**Checkpoint**: Shared building blocks ready — page stories US1/US2/US3 can now be built independently and in parallel.

---

## Phase 3: User Story 1 - Artifact Enforcement page (Priority: P1) 🎯 MVP

**Goal**: Ship `/features/artifact-enforcement` — the wedge mechanic page proving the pass action is a hard, blocked gate.

**Independent Test**: Visit `/features/artifact-enforcement`; the hero shows a disabled Pass button that reads as blocked (lock, not-allowed, tooltip); the six artifact types appear as `<h3>` text; §3 shows blocked (step 2) vs enabled (step 3) contrast; §4 shows active→sealed with a static lock; primary CTA "Start free", secondary "See how it works".

### Page-specific components (`components/features/artifact-enforcement/`)

- [X] T015 [P] [US1] Create `SixTypesBento.tsx` in `apps/web/src/components/features/artifact-enforcement/` — the one permitted bento (2×3 desktop → 3×2 tablet → stacked mobile); six equal-weight cards, each `<h3>` type name + use-case line + supporting detail + small inset fragment; two-wave staggered reveal (top row 0/80/160ms, bottom 240/320/400ms) via `ScrollReveal` delays.
- [X] T016 [P] [US1] Create `EnforcementSteps.tsx` in `apps/web/src/components/features/artifact-enforcement/` — 3-step vertical sequence; step 2 uses `PassButton state="blocked"`, step 3 uses `PassButton state="enabled"` (the contrast is the argument); connector line draws top→bottom after steps settle (hidden <768px); uses `SpecRow`/`ArtifactRequirementPanel`.
- [X] T017 [P] [US1] Create `ActiveVsSealed.tsx` in `apps/web/src/components/features/artifact-enforcement/` — §4 two-panel: editable "active run" (upload affordance, `In Progress` badge) beside read-only "sealed" run (`Go` badge, inline artifact + static `SealedLockIcon`, `SEALED` label, no edit affordances); static transition arrow; closing link to `/features/audit-trail`.
- [X] T018 [P] [US1] Create `AdoptionBand.tsx` in `apps/web/src/components/features/artifact-enforcement/` — §5: three `FactCells` (afternoon setup / full enforcement on Free / existing tools stay) + `ReservedTestimonial` (orange accent, QA persona).

### Page assembly

- [X] T019 [US1] Create `apps/web/src/app/features/artifact-enforcement/page.tsx` — server component: `export const metadata` (unique title/description for the artifact-gated intent cluster; OG image auto-wired via `opengraph-image.tsx`, T041), the JSON-LD helper (T014) with this page's `FeaturePageMeta`, and compose `<Navigation /> → <main>` with the six sections in order (Hero via `FeatureHero` + hero fragment built from `ArtifactRequirementPanel`/`PassButton`/six-type preview → `SixTypesBento` → `EnforcementSteps` → `ActiveVsSealed` → `AdoptionBand` → `FeatureFinalCTA` primary "Start free" / secondary "See how it works") → `<Footer />`. Single `<h1>`, `<section aria-labelledby>` per band.
- [X] T020 [US1] Add this page's distributed cross-links in `apps/web/src/app/features/artifact-enforcement/page.tsx` — close of §4 links to `/features/go-no-go` and `/features/audit-trail`; §2 close link to `/how-it-works#step-2`; a `/use-cases/qa-teams` link; `/pricing` reachable. (Destinations may 404 today — hrefs still correct, per research R8.)

### Test

- [X] T021 [US1] Create `apps/web-e2e/tests/features-artifact-enforcement.spec.ts` — Playwright: route returns 200; exactly one `<h1>` with no skipped heading levels; the blocked `PassButton` has `aria-disabled` + accessible tooltip and is NOT a loading spinner; the six artifact-type `<h3>` names are present as text; §3 step-2 blocked vs step-3 enabled both render; CTAs/cross-links point to the specified hrefs; JSON-LD blocks present and parse.

**Checkpoint**: `/features/artifact-enforcement` is fully functional and independently testable — this is the MVP. (Cross-links to GNG/AT 404 until those pages land — expected.)

---

## Phase 4: User Story 2 - Go/No-Go page (Priority: P2)

**Goal**: Ship `/features/go-no-go` — the formal, role-gated, permanently-recorded release decision.

**Independent Test**: Visit `/features/go-no-go`; hero decision screen shows severity-sorted spec list (failed-first tint), semantic-colored counts, an un-decided Go/No-Go pair, and a mandatory-justification field; §2 paired-hover highlights callouts (keyboard too); §3 shows the non-Admin inert view; §4 Confirm disabled until justification typed; secondary CTA "Talk to us".

### Page-specific components (`components/features/go-no-go/`)

- [X] T022 [P] [US2] Create `DecisionScreenFragment.tsx` in `apps/web/src/components/features/go-no-go/` — run header (`Awaiting Go/No-Go` badge), summary counts in semantic colors, severity-sorted `SpecRow`s (failed first + tint), Go/No-Go action pair (neither pre-selected; hover tints teach the model, not interactive), mandatory-justification textarea with placeholder.
- [X] T023 [P] [US2] Create `DecisionScreenAnnotated.tsx` in `apps/web/src/components/features/go-no-go/` — §2: four-item left explainer + annotated fragment; hovering/focusing an item highlights the matching numbered callout via `aria-controls` (keyboard-accessible paired hover); ≤2 orange callouts per viewport, remainder Slate.
- [X] T024 [P] [US2] Create `RoleGateFragment.tsx` in `apps/web/src/components/features/go-no-go/` — §3: non-Admin inert view (static `SealedLockIcon`-style lock + informational message, no action affordance), with the "structural, not a toggle" supporting paragraph.
- [X] T025 [P] [US2] Create `JustificationOverlay.tsx` in `apps/web/src/components/features/go-no-go/` — §4: elevated overlay card; failed-spec list (Error-50 tint); required justification textarea with Geist Mono placeholder; Confirm button disabled (`PassButton`-style disabled treatment) until justification written, with hover tooltip; Cancel link.

### Page assembly

- [X] T026 [US2] Create `apps/web/src/app/features/go-no-go/page.tsx` — server component: unique `metadata` (go/no-go intent cluster; OG image auto-wired via `opengraph-image.tsx`, T041), JSON-LD helper, compose six sections in sitemap order (Hero via `FeatureHero` + `DecisionScreenFragment` → `DecisionScreenAnnotated` → `RoleGateFragment` → `JustificationOverlay` → §5 "after the decision" using `DecisionRecordBlock` + `StatusBadge kind="go"` → `FeatureFinalCTA` primary "Start free" / secondary "Talk to us"). Single `<h1>`, landmarks.
- [X] T027 [US2] Add this page's distributed cross-links in `apps/web/src/app/features/go-no-go/page.tsx` — hero sub-paragraph links to `/features/artifact-enforcement`; §5 close links to `/features/audit-trail`; §4 link to `/features/audit-trail`; a `/use-cases/engineering-managers` link; `/how-it-works` and `/pricing` reachable.

### Test

- [X] T028 [US2] Create `apps/web-e2e/tests/features-go-no-go.spec.ts` — Playwright: 200 + single `<h1>` + heading order; severity-sorted spec list renders with failed-first tint; §2 paired-hover highlight reachable via keyboard focus (`aria-controls`); §4 Confirm is `disabled` initially; CTAs/cross-links correct; JSON-LD present.

**Checkpoint**: `/features/go-no-go` works independently; AE↔GNG cross-links now resolve.

---

## Phase 5: User Story 4 - Cross-page navigation & nav active state (Priority: P2)

**Goal**: Close the three-page navigational triangle and add the sticky-nav current-page indicator so a visitor can traverse the enforcement triad without returning home.

**Independent Test**: From any feature page, the "Features" nav item and the page's own entry in the Features mega-panel show the active state; in-content links reach the other feature pages + `/how-it-works`, `/pricing`, and a relevant `/use-cases/*` at the specified positions.

- [X] T029 [US4] Edit `apps/web/src/components/nav/DesktopNav.tsx` — accept the active pathname and apply the active state to the "Features" trigger (Orange-600) and to the matching item inside the Features mega-panel. Hrefs in `nav-content.tsx` are unchanged.
- [X] T030 [US4] Edit `apps/web/src/components/Navigation.tsx` — read the current path via `usePathname()` and pass it to `DesktopNav` (and the mobile menu groups) so the indicator reflects the active feature page.
- [X] T031 [US4] Create `apps/web-e2e/tests/features-navigation.spec.ts` — Playwright, scoped to the pages live at this phase (Artifact Enforcement + Go/No-Go): the "Features" nav item is active and the correct mega-panel item is active on each; assert the **AE↔GNG** cross-links resolve (each links to the other) and that each links to `/how-it-works`, `/pricing`, and its persona `/use-cases/*`. (Full three-way triangle closure is asserted in T040 once the Audit Trail page exists — see F1 in the analysis report.)

**Checkpoint**: Nav indicator and the AE↔GNG portion of the triangle verified; AT's corner completes in Phase 6.

---

## Phase 6: User Story 3 - Audit Trail page (Priority: P3)

**Goal**: Ship `/features/audit-trail` — the compliance-formal sealed-record page; conversion goal "Talk to us" (primary) / "Start free" (secondary).

**Independent Test**: Visit `/features/audit-trail`; hero shows an entirely-static sealed record (`Go` + `SEALED` + static lock with tooltip, decision block, read-only spec list with inline artifact); §3 callouts type once and stop (no idle caret); §4 certified-document print preview + honesty note linking `/platform`; §5 visible SOC2/PCI-DSS disclaimer + reserved testimonial; final CTA primary "Talk to us" (filled), secondary "Start free" (bordered).

### Motion primitive

- [X] T032 [P] [US3] Create `apps/web/src/components/TextType.tsx` — hand-port the React Bits `TextType` (modeled on `Magnet.tsx`'s "Ported to TypeScript from reactbits.dev" pattern): `startOnVisible`, `loop={false}`, tuned `typingSpeed` (~400ms/line) + per-instance `initialDelay`, single blinking caret while typing that is removed on completion (no idle caret), Slate caret color, and a `disabled` prop that renders the final string as static Geist Mono (driven by `prefers-reduced-motion` at the call site). No new npm dependency.

### Page-specific components (`components/features/audit-trail/`)

- [X] T033 [P] [US3] Create `SealedRecordFragment.tsx` in `apps/web/src/components/features/audit-trail/` — hero fragment, **entirely static**: run header (`StatusBadge kind="go"` + `SEALED` + static `SealedLockIcon` with "permanently sealed" tooltip), `DecisionRecordBlock` (sealed), read-only `SpecRow` list with one expanded row showing an inline artifact thumbnail + Geist Mono "Uploaded by … · …".
- [X] T034 [P] [US3] Create `RecordContents.tsx` in `apps/web/src/components/features/audit-trail/` — §2: five content items + annotated fragment; paired-hover highlight (keyboard-accessible); callouts use Slate circles (compliance register), not orange.
- [X] T035 [P] [US3] Create `ImmutabilityCards.tsx` in `apps/web/src/components/features/audit-trail/` — §3: three equal cards (API / service / database) each with a Geist Mono code callout rendered via `TextType` (T032) with `loop={false}` and reduced-motion-guarded `disabled` → static text; `<h3>` per card with technical vocabulary; cards stagger 0/100/200ms.
- [X] T036 [P] [US3] Create `PrintPreviewFragment.tsx` in `apps/web/src/components/features/audit-trail/` — §4: certified-document depiction — plain white sheet (NO browser chrome), page-edge shadow, Geist Mono-dense, expanded specs, inline reduced-size artifacts, partial second-page hint; decorative "Print" button (teaches the interaction, non-functional).
- [X] T037 [P] [US3] Create `ComplianceContext.tsx` in `apps/web/src/components/features/audit-trail/` — §5: SOC2 + PCI-DSS paragraphs + a visible, non-buried disclaimer (Slate-600) that NoHotfix holds no certification; `ReservedTestimonial` (slate accent, empty author block).

### Page assembly

- [X] T038 [US3] Create `apps/web/src/app/features/audit-trail/page.tsx` — server component: unique `metadata` (audit-trail/SOC2 intent cluster; OG image auto-wired via `opengraph-image.tsx`, T041), JSON-LD helper, compose six sections (Hero via `FeatureHero` + `SealedRecordFragment` → `RecordContents` → `ImmutabilityCards` → `PrintPreviewFragment` → `ComplianceContext` → `FeatureFinalCTA` with `swapEmphasis` so primary = "Talk to us" filled, secondary = "Start free" bordered). Single `<h1>`, landmarks. Hero/lock are entirely static.
- [X] T039 [US3] Add this page's distributed cross-links + honesty note in `apps/web/src/app/features/audit-trail/page.tsx` — hero sub-paragraph links to `/features/artifact-enforcement`; §3 close links to `/features/go-no-go#after-the-decision`; §4 honesty note links to `/platform`; §5 links to `/use-cases/compliance` and `/contact`; `/how-it-works` and `/pricing` reachable.

### Test

- [X] T040 [US3] Create `apps/web-e2e/tests/features-audit-trail.spec.ts` — Playwright: 200 + single `<h1>` + heading order; the sealed lock has a tooltip and (with motion enabled) does NOT animate; with `prefers-reduced-motion` emulation the §3 callouts render as static Geist Mono (TextType not animating); §5 disclaimer text present; final CTA primary = "Talk to us" / secondary = "Start free"; cross-links + JSON-LD correct. **Also assert full cross-link triangle closure** now that all three pages exist: each of the three feature pages links to the other two (completes the AE↔GNG check from T031).

**Checkpoint**: All three pages live; the cross-link triangle is fully closed.

---

## Phase 7: User Story 5 - SEO assets & structured-data hardening (Priority: P3)

**Goal**: Each page is a distinct, valid SEO asset (unique metadata, valid structured data, OG images, correct semantics).

**Independent Test**: Crawl each page — exactly one `<h1>`, valid non-skipping hierarchy, `<main>` + `<section aria-labelledby>`; `SoftwareApplication` + `ItemPage` + `BreadcrumbList` validate with zero errors; each page has a distinct title/description; OG images resolve at 1200×630.

- [X] T041 [P] [US5] Generate each page's OG image (1200×630) via Next's per-route file convention — add `apps/web/src/app/features/<slug>/opengraph-image.tsx` exporting `size`, `contentType`, and a default `ImageResponse` that renders a branded social card (pillar headline in DM Sans + the page's signature mechanic motif + the NoHotfix logo, on the `--bg-page` canvas). This keeps OG generation in-code and in sync with the page; `metadata.openGraph.images` is then auto-populated by Next (no manual `images` array needed). Note: `ImageResponse` supports only a flexbox CSS subset (no Tailwind classes, fonts must be loaded explicitly), so the card is an on-brand simplification of the hero, not a pixel-perfect DOM crop. (Fallback if a literal hero crop is required: export static 1200×630 PNGs under `apps/web/public/og/features-<slug>.png` and wire `openGraph.images` manually — see F2 in the analysis report.)
- [X] T042 [US5] Validate structured data across all three pages (Schema.org validator / Rich Results): fix any `SoftwareApplication`/`ItemPage`/`BreadcrumbList` errors in `apps/web/src/components/features/shared/structured-data.tsx` and per-page `FeaturePageMeta`; confirm no rating/review/unearned-certification markup.
- [X] T043 [US5] Audit semantic structure + metadata distinctness across the three `page.tsx` files: exactly one `<h1>` each, no skipped heading levels, `<main>` + `<section aria-labelledby>` landmarks present, and titles/descriptions are distinct per intent cluster (no duplicate content).
- [X] T044 [US5] Extend `apps/web-e2e/tests/features-navigation.spec.ts` (or add `features-seo.spec.ts`) — assert per page: one `<h1>`, JSON-LD parse + required `@type`s present, distinct `<title>`, and that disabling images leaves artifact-type names / badge states / button labels / field names readable (SC-005).

**Checkpoint**: All three pages are valid, distinct SEO assets.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality, accessibility, motion, performance, and content-integrity passes across all three pages

- [X] T045 [P] Responsive QA across all three `page.tsx` and their fragments at ≥1040px / 768–1039px / <768px / <576px — bento/multi-column relax to stacks, connectors + callout annotations hidden <768px, hero headline 46px <576px, browser-chrome dots hidden <576px; blocked `PassButton` keeps ≥44×44px touch target on mobile.
- [X] T046 [P] Accessibility audit (axe/Lighthouse) on all three pages — no critical violations; WCAG AA contrast on all text + interactive states incl. the disabled `PassButton`; visible orange focus ring on all focusable elements; keyboard operability of paired-hover highlights and tooltips.
- [X] T047 [P] Reduced-motion verification with `prefers-reduced-motion` — confirm no animation plays anywhere; `ScrollReveal` content is final-state; `TextType` renders static text and is not mounted/animating; every `SealedLockIcon`/`SEALED` badge is static regardless.
- [X] T048 [P] Performance/LCP verification — hero headline is the LCP element on each page; below-fold fragments lazy with explicit width/height; no layout shift; minimal client JS (static fragments stay server components).
- [X] T049 Content-integrity review across all three pages — ≤2 orange elements per viewport (overflow falls back to Slate); no fabricated logos/stats/testimonials (reserved slots visibly empty); no post-launch capability shown as current (Audit Trail §4 honesty note + §5 disclaimer present); approved mechanic vocabulary used, banned terms avoided.
- [X] T050 Run quality gates from `apps/web`: `npm run typecheck`, `npm run lint`, `npm run build` — all pass.
- [X] T051 Execute `specs/032-feature-pages/quickstart.md` manual verification checklist (SC-001..SC-010) and the page-specific spot checks; record results.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all page stories.
- **US1 (Phase 3)**: Depends on Foundational. The MVP. No dependency on other stories (its GNG/AT cross-links may 404 until those land — accepted).
- **US2 (Phase 4)**: Depends on Foundational. Independent of US1.
- **US4 (Phase 5)**: Nav edits depend only on Foundational; the triangle audit is most meaningful once US1+US2 exist (full closure after US3).
- **US3 (Phase 6)**: Depends on Foundational (+ its own `TextType`). Independent of US1/US2.
- **US5 (Phase 7)**: Depends on the three pages existing (US1–US3) to validate structured data and OG images.
- **Polish (Phase 8)**: Depends on all desired stories being complete.

### User Story Independence

- US1, US2, US3 each render and are testable on their own once Foundational is done; cross-links to not-yet-built pages 404 by design (research R8).
- US4 (nav/triangle) and US5 (SEO hardening) are cross-cutting layers added on top — they verify/complete rather than block individual page delivery.

### Within Each Page Story

- Page-specific components (the `[P]` tasks) before page assembly (`page.tsx`).
- Page assembly before its cross-link task and its E2E test.

### Parallel Opportunities

- Setup T002 ∥ (after T001).
- All Foundational T003–T014 are `[P]` — different files, parallelizable.
- US1 components T015–T018 ∥; US2 T022–T025 ∥; US3 T032–T037 ∥.
- After Foundational, US1 / US2 / US3 can be built in parallel by different developers.
- Polish T045–T048 ∥.

---

## Parallel Example: Foundational (Phase 2)

```bash
# All shared building blocks are independent files — launch together:
Task: "Create SectionLabel.tsx (T003)"
Task: "Create FeatureHero.tsx (T004)"
Task: "Create FeatureFinalCTA.tsx (T005)"
Task: "Create StatusBadge.tsx (T008)"
Task: "Create PassButton.tsx (T011)"
Task: "Create structured-data.tsx JSON-LD helper (T014)"
# …T006, T007, T009, T010, T012, T013 likewise
```

## Parallel Example: User Story 1

```bash
# Page-specific components first, in parallel:
Task: "Create SixTypesBento.tsx (T015)"
Task: "Create EnforcementSteps.tsx (T016)"
Task: "Create ActiveVsSealed.tsx (T017)"
Task: "Create AdoptionBand.tsx (T018)"
# then T019 (page.tsx) → T020 (cross-links) → T021 (E2E)
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup (T001–T002)
2. Phase 2: Foundational (T003–T014) — shared components + JSON-LD helper
3. Phase 3: US1 — Artifact Enforcement page (T015–T021)
4. **STOP and VALIDATE**: `/features/artifact-enforcement` renders, hero blocked-pass reads correctly, six types crawlable, E2E green. Deploy/demo. (GNG/AT cross-links 404 until built — expected.)

### Incremental Delivery

1. Setup + Foundational → ready.
2. US1 → test → demo (MVP).
3. US2 → test → demo (AE↔GNG links resolve).
4. US4 → nav indicator + triangle audit.
5. US3 → test → demo (triangle fully closed).
6. US5 → SEO/OG/structured-data hardening.
7. Polish → responsive / a11y / reduced-motion / perf / content integrity / gates.

### Parallel Team Strategy

After Foundational: Dev A → US1, Dev B → US2, Dev C → US3 (independent). US4 and US5 fold in once ≥2 / all three pages exist. Polish is a shared final pass.

---

## Notes

- `[P]` = different files, no dependency on incomplete tasks.
- No command-delegation hints: this feature has no migrations, domain entities, or API routes (frontend-only, `apps/web`).
- E2E uses Playwright in `apps/web-e2e/tests/` (port 3000); `.spec.ts` naming per testing skill.
- Reused components (`BrowserFrame`, `ScrollReveal`, `Footer`) are not re-created; only `Navigation`/`DesktopNav` are edited (T029–T030).
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
