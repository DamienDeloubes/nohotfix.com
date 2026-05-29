# SaaS Page Architect — Memory

## Project: NoHotfix.com

### Key File Locations

- Sitemap: `docs/marketing/sitemap.md`
- Positioning: `docs/marketing/positioning.md`
- Messaging: `docs/marketing/messaging.md`
- ICP: `docs/marketing/ideal-customer-profile.md`
- Brand identity: `docs/design/brand-identity.md`
- Project summary: `docs/project-summary.md`
- Page designs output: `docs/design/pages/`

### Pages Completed

- `docs/design/pages/homepage.md` — Full homepage IA (2026-05-28, v3.0)
- `docs/design/pages/features.md` — Three feature pages (Artifact Enforcement / Go/No-Go / Audit Trail), shared archetype (2026-05-29, v1.0)

### Product Core (never omit from any page design)

- **Tagline**: "Ship it once." (catch every issue before production does)
- **Core triad**: Artifact-gated execution + Go/no-go decision gate + Run immutability
- **Strongest differentiator**: The pass action is BLOCKED (not warned, not reminded — blocked) until artifacts attached
- **Second differentiator**: Run immutability — record cannot be edited after go/no-go decision
- All three pillars are on every plan including Free — never gate them in messaging

### Brand Design System v5 (see brand-identity.md v5.0 for full tokens)

- **LIGHT-FIRST** site (not dark-dominant). `#FAFAFA` page bg light / `#111110` (Dark-900) dark. The old violet base (`#0D0920`) is RETIRED.
- Design references: Cloudflare (light-first, orange-as-architecture), Linear (card discipline), Stripe (screenshot-as-argument). Todesktop is RETIRED as reference.
- Fonts: **DM Sans 700/600** (marketing H1/H2 only, 600+ weight always), **Inter** (body/UI), **Geist Mono** (product data). Aeonik Pro is RETIRED — too expensive, use DM Sans.
- Primary orange: `#EA6B04` (Orange-600) light / `#F97316` (Orange-500) dark. Primary blue `#0036FF` RETIRED.
- Go green: `#00CC80` (Go-500). No-Go: `#EAB308` (NoGo-500 yellow, NOT amber). Error/crimson: `#F43F5E` (Error-500).
- In Progress badge: Slate `#94A3B8` dark / `#475569` light. Blue in-progress is RETIRED.
- **Glass model A: nav/overlays ONLY. Cards are SOLID in both themes.** No backdrop-filter on cards.
- Light card: `#FFFFFF`, `1px solid rgba(0,0,0,0.08)`, shadow-1. Dark card: `#1E1D1B`, `1px solid rgba(255,255,255,0.09)`, mandatory inset top highlight, shadow-1.
- Ease-premium: `cubic-bezier(0.6, 0.6, 0, 1)`. Ease-page: `cubic-bezier(0.4, 0, 0.2, 1)` (section entrances).
- Nav scroll transform triggers at 40px depth → frosted glass. Section entrances: opacity 0→1 + translateY(24px→0), 400ms ease-page.

### Homepage Key Decisions (v3.0 — see homepage.md)

- Light-first warm-white canvas. No vertical gradient. Sections alternate via `--bg-section-alt`.
- Hero: centered single column; 3-tab product preview (Execute specs / Go/No-Go / Immutable record); disabled Pass button is the single most important pixel
- Pain hook: scripted full-width browser demo (4 frames), not a before/after card pair. Uses `BrowserFrame` component.
- Comparison table: 5 rows × 3 columns. NoHotfix column gets warm wash `rgba(234,107,4,0.06)`. Checkmarks spring-animate on scroll-in.
- Three guarantees bento: the one permitted bento moment on the homepage. Three equal cards.
- Who it's for: THREE persona cards (QA Teams, Eng Managers, Compliance) — 3-up grid
- Pricing summary: three tiers on homepage (Free / Growth / Scale). Growth gets warm tint `rgba(234,107,4,0.10)`.
- Final CTA warm radial: `rgba(234,107,4,0.08)` light / `rgba(249,115,22,0.10)` dark — the one sanctioned atmospheric touch.

### Feature Pages Key Decisions (v1.0 — see features.md)

- Shared archetype: declarative DM Sans 700 hero over large product-UI crop, then 3–5 bands. Screenshot is the argument.
- Artifact Enforcement: blocked Pass button + six-type panel in hero; bento for six artifact types (only bento on these pages); three-step "how enforcement works" section; active→sealed transition section.
- Go/No-Go: decision screen in hero (severity-sorted spec list + Go/No-Go buttons + justification field); annotated two-column section 2; role-gate section shows non-Admin locked view; justification overlay section.
- Audit Trail: most compliance-formal page. Sealed lock badge NEVER animates (Phase 6). Print-to-PDF shown as "certified document" in Geist Mono, plain-sheet frame (no browser chrome). Honesty note: browser print-to-PDF at launch, dedicated export is post-launch. Primary CTA "Talk to us," secondary "Start free" (reversed from other two pages).
- Callout annotations on Audit Trail sections use Slate-700 circles (not orange) — compliance-formal register.
- Cross-page navigation triangle: all three feature pages link to each other plus /how-it-works, /pricing, one /use-cases/* page each.

### Messaging Principles (voice)

- Precise, grounded, confident — no hedging, no buzzwords, no vague benefits
- Never: "streamline", "AI-powered", "revolutionary", "leverage", "solutions"
- Write to technical readers: state the mechanic, not the feeling
- Enforcement is the verb that differentiates: "blocked", "locked", "sealed", "gated"

### Personas (for page targeting)

- QA Lead: "Stop chasing testers for screenshots." — pain is enforcement, primary converter
- VP Engineering: "Know your release is ready before you ship." — pain is governance/accountability
- Compliance buyer: "Your release runs become auditable artifacts, automatically." — pain is audit evidence
- Conversion goal: Free signup (QA Lead, VP Eng) or Book demo (Compliance buyer)

### Pricing Model (for page accuracy)

- Free: 1 seat, full triad, unlimited playbooks/runs
- Growth: $29/mo early bird (→ $49 standard), up to 10 seats
- Scale: $99/mo early bird (→ $149 standard), up to 40 seats, 1-day SLA
- Enterprise: custom, 40+ seats, SSO/SAML
- Early bird = first 100 paying orgs, price locked for life via Stripe
- Free → Growth trigger: invite gate (first teammate)
- **LAUNCH HONESTY**: audit-grade PDF/JSON export is POST-LAUNCH. Scale's compliance-ops layer (viewer role, retention controls, uptime SLA) is POST-LAUNCH. At launch: browser print-to-PDF of sealed record + shareable URL. Never present post-launch items as current.

### Artifact Types (exact — for mechanic accuracy in page copy)

Six types: **file** (screenshot/video/doc/log/any, MIME-validated), **text** (free text field), **checkbox** (explicit confirmation), **url** (well-formed URL validated), **measured value** (numeric + optional threshold, threshold warns but doesn't hard-block), **structured table** (admin-defined columns: text/number/pass-fail, min row count). All must be satisfied before Pass button activates. No admin override on the pass gate.
