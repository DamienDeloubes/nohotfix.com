# Phase 0 Research: Feature Marketing Pages

All decisions below are resolved from the existing `apps/web` codebase and the design docs. **No `NEEDS CLARIFICATION` markers remain.**

---

## R1 — Page composition & rendering model

- **Decision**: Each route is a Next.js App Router **server component** `page.tsx` that exports `metadata`, renders inline JSON-LD `<script type="application/ld+json">`, and composes `<Navigation /> → <main> sections → <Footer />`. Sections that need interaction/observers (`ScrollReveal`, paired-hover, `TextType`) are `'use client'` leaf components; static fragments stay server components.
- **Rationale**: Mirrors the homepage (`app/page.tsx` composes Navigation + main + Footer) and the existing metadata pattern in `app/layout.tsx`. Server-first keeps the hero text in initial HTML (good for LCP + crawlability); only interactive leaves ship JS.
- **Alternatives considered**: A single shared `<FeaturePageLayout>` wrapper — rejected as premature; the three pages differ enough per-section that explicit composition is clearer (YAGNI).

## R2 — Product-UI fragments as DOM, not images

- **Decision**: Build every fragment (blocked Pass button, six-type bento, decision screen, sealed record, print preview) as faithful **HTML/DOM components** using design tokens, hosted in the existing `BrowserFrame`. No raster screenshots for the mechanic surfaces.
- **Rationale**: Spec FR-004 / SEO rules require labels (artifact-type names, badge states, button labels, field names) to be live, crawlable text and theme-aware (light/dark). `BrowserFrame.tsx` already provides the chrome (traffic lights + mono URL bar) and token-based styling. Reuses the badge/row vocabulary already present in `nav-content.tsx`.
- **Alternatives considered**: Static PNGs/Storybook captures — rejected: not crawlable, not theme-aware, fail FR-004 and the "disable images, labels still readable" success criterion (SC-005).

## R3 — Entrance motion & reduced-motion

- **Decision**: Reuse `ScrollReveal` (`IntersectionObserver` → `.reveal`/`.revealed`) plus the CSS keyframes already in `tailwind.config.ts` (`fade-in-up`, `scale-in`, `draw-line`) and `reveal-delay-{1..4}` utilities for staggers. Count-up (AE §5) and connector draw (AE §3) use existing `draw-line`/a small count-up hook.
- **Rationale**: `globals.css` already contains a global `@media (prefers-reduced-motion: reduce)` block that forces `.reveal { opacity:1; transform:none }` and neutralizes animations — so reduced-motion is handled for free for anything built on these primitives. Matches set-level motion spec (fade+rise 400ms, staggers, once-on-view).
- **Alternatives considered**: framer-motion — rejected: not a dependency of `apps/web`, and the CSS/observer system already covers every required motion except typed text.

## R4 — The typed monospace callout (Audit Trail §3)

- **Decision**: Hand-port a `TextType.tsx` component from React Bits (`reactbits.dev/text-animations/text-type`), exactly as `Magnet.tsx` was ported ("Ported to TypeScript from reactbits.dev"). Configure: `startOnVisible`, `loop={false}`, `typingSpeed` tuned to ~400ms/line, `initialDelay` offset per card, single blinking caret while typing that is **removed on completion** (no idle caret), Slate caret color. The wrapper accepts a `disabled` prop (driven by `prefers-reduced-motion` at the call site, like `Magnet`) and renders the final string statically when disabled.
- **Rationale**: React Bits is copy-in, not an npm dependency (per the brand doc and the existing `Magnet.tsx` precedent) — keeps the dependency surface unchanged. `loop={false}` + caret-removal satisfies the "sealed things don't move" law (FR-035): the line is written once and stops.
- **Alternatives considered**: CSS `steps()` typewriter — rejected: can't cleanly do per-character timing with a caret that disappears on completion and a reduced-motion static fallback in one primitive; the React Bits port is the spec-named approach.

## R5 — SEO: metadata, structured data, semantics

- **Decision**: Per-route `export const metadata` (unique title/description per intent cluster, `openGraph` with a 1200×630 OG image). Per page, emit three JSON-LD blocks: `SoftwareApplication`, `ItemPage` (or `WebPage`/`ItemPage` graph), and `BreadcrumbList` (Home → Features → page). One `<h1>` (pillar headline), section `<h2>`, subpoints `<h3>`; `<main>` + `<section aria-labelledby>` landmarks.
- **Rationale**: Next App Router's Metadata API is already used in `layout.tsx`; JSON-LD via inline script in a server component is the standard Next pattern. Directly satisfies FR-050..054 and SC-004.
- **Alternatives considered**: `next-seo` — rejected: redundant with the native Metadata API; no new dependency warranted.

## R6 — Per-page final CTA (different conversion goals)

- **Decision**: Add a parameterized `FeatureFinalCTA` component (props: eyebrow, headline, body, primary `{label, href}`, secondary `{label, href}`, `swapEmphasis?` boolean, closing tagline). Artifact Enforcement & Go/No-Go: primary "Start free". Audit Trail: `swapEmphasis` so "Talk to us" is the filled primary and "Start free" is the bordered secondary.
- **Rationale**: The shipped `FinalCTA.tsx` is hardcoded (fixed copy, single CTA, `/contact` secondary) and cannot express the Audit Trail swap. A parameterized variant used by all three pages satisfies the ≥3-use rule for a shared component without touching the homepage's `FinalCTA`.
- **Alternatives considered**: Generalize the existing `FinalCTA` and reuse on the homepage too — rejected for now to avoid changing shipped homepage behavior in this feature (out of scope); the new component can later supersede it.

## R7 — Navigation current-page indicator

- **Decision**: Pass the active pathname into `Navigation` → `DesktopNav` and mark the "Features" trigger active (Orange-600) plus the matching item inside the Features mega-panel. Use Next's `usePathname()` in the client nav.
- **Rationale**: `nav-content.tsx` already defines the three feature entries with the exact hrefs and the mega-panel already renders them — only the active-state styling is missing (FR-042). Minimal, contained edit.
- **Alternatives considered**: A separate breadcrumb-only indicator — rejected: the spec specifically requires the nav active state.

## R8 — CTA / cross-link destinations that don't exist yet

- **Decision**: Render all links with their correct final hrefs (`/how-it-works`, `/contact`, `/use-cases/*`, `/platform`, signup via `${NEXT_PUBLIC_API_URL}/auth/login?screen_hint=sign-up`). Accept that some 404 today.
- **Rationale**: Spec edge case + assumption: links must resolve when those routes ship; a 404 today is expected and out of scope to fix. The signup URL pattern is already used by `FinalCTA.tsx` and `Navigation.tsx`.
- **Alternatives considered**: Placeholder `#` anchors — rejected: would have to be revisited and risks shipping dead links.

## R9 — Testing layer

- **Decision**: Add Playwright E2E in `apps/web-e2e` covering: each route returns 200 and renders; exactly one `<h1>`; heading levels don't skip; the three cross-links + CTAs point to the specified hrefs; JSON-LD blocks are present and parse; the blocked Pass button is `disabled` with an accessible tooltip; with reduced-motion emulation, content is in final state and `TextType` renders static text. Plus `tsc --noEmit` and `eslint`.
- **Rationale**: Constitution's unit/integration/immutability tiers target domain logic, which this feature has none of; the correct coverage for marketing pages is render/SEO/a11y E2E (`apps/web-e2e` already exists in the workspace).
- **Alternatives considered**: Component unit tests with Testing Library — possible but lower value than E2E for static composition; E2E better verifies SEO/landmarks/reduced-motion end-to-end.

## R10 — Print-to-PDF "certified document" (Audit Trail §4)

- **Decision**: The print-preview is a **marketing fragment** (a styled depiction of a print layout in a plain-sheet frame), not a functioning print stylesheet for these pages. Geist Mono-dense, plain white sheet, page-edge shadow, partial second-page hint. No `@media print` rules required for the marketing page itself.
- **Rationale**: The actual print-to-PDF capability lives in the product (`apps/app`), out of scope here; the page only needs to *show* what that document looks like (FR-036). Honesty note clarifies launch = browser print-to-PDF, with dedicated export on the roadmap.
- **Alternatives considered**: Implementing a real print stylesheet for the marketing page — rejected: not the deliverable; would be misleading scope creep.
