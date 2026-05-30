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
- `docs/design/pages/features/README.md` + per-page specs — Three feature pages (Artifact Enforcement / Go/No-Go / Audit Trail), shared archetype (2026-05-29, v1.1)
- `docs/design/pages/platform/use-cases/qa-teams.md` — QA Teams use-case page (2026-05-30, v1.0)
- `docs/design/pages/platform/use-cases/compliance.md` — Compliance use-case page (2026-05-30, v1.0)
- `docs/design/pages/platform/platform.md` — Platform page (2026-05-30, v1.0)
- `docs/design/pages/platform/use-cases/engineering-managers.md` — Engineering Managers use-case page (2026-05-30, v1.0)

### Use-Case Page Archetype (applies to all three /use-cases/* pages)

- **Hero**: DM Sans 700 pain statement (NOT a product screenshot). Pain inventory: 4 short lines in Inter 400 with em-dash bullets, Slate-400. Empathy first, mechanic second.
- **Core device**: matched pairs §2 — left column = pain (Slate-700 text, slightly muted), right column = mechanic (#111110 text, full weight). 24px numbered circles Orange-500, thin Slate-400 connector arrow between columns. Four pairs, one per hero pain line.
- **Paired-hover interaction** §2: hovering left column dims it Slate-500 + nudges right column translateX(4px) — physically enacts pain→resolution.
- **Product-proof band**: one product-UI fragment per page. QA Teams: spec library list + expanded artifact requirements drawer. Fragment is static, not animated.
- **Enforcement mechanic section** §4: disabled Pass button is required (same treatment as homepage/feature pages). Lock icon does NOT animate (Phase 6).
- **Adoption speed section** §5: typographic only — no screenshot. Go-500 check-circles (NOT orange) for the three claims. Reason: Go green = "yes/done" semantic; orange is reserved for CTAs.
- **Testimonial slot** §6: placeholder card with DASHED border (`1.5px dashed`). No hover lift on placeholder. Orange-500 top-edge stripe (persona accent). Never fabricate.
- **Final CTA** §7: warm radial `rgba(234,107,4,0.08)` light / `rgba(249,115,22,0.10)` dark. Same sanctioned atmospheric wash as homepage §11.
- **Persona accent colors**: QA Teams → Orange-500 `#F97316` (circles, top stripe). Eng Managers → Go-500 `#00CC80`. Compliance → Slate-400 `#94A3B8`.
- **No cross-links to sibling use-case pages** from within the page — focus the conversion path. Nav provides the route for lateral exploration.
- **Orange-per-viewport discipline** §2: if numbered circles + section pill both land in view, consider Slate-700 circles for pairs 3–4 and reserve orange for pairs 1–2 (same pattern as Go/No-Go callout annotation rule).
- **Compliance page deviations** (most formal of the three): hero has NO product screenshot (pain statement earns scroll alone); section pills use Slate-400 accent (not orange); callout circles are Slate-700 (not orange); matched-pair markers are Slate-400 dot (before) / Orange-600 dot (after) — not numbered circles; testimonial card top stripe is Slate-400; primary CTA is "Talk to us" (not "Start free"); plans section uses orange-stripe card for shipped + Slate-stripe card for roadmap items (same pattern as Platform page §3); Geist Mono presence is highest of the three pages. Lock icon NEVER animates.
- **Engineering Managers page deviations**: Hero is copy-only (no product screenshot — recognition moment first). Matched-pair markers = 8px filled Go-500 circles (not numbered orange circles — keeps orange count under max). Product-proof band §3 = go/no-go decision screen (the full decision screen, identical to features/go-no-go hero fragment but shown as full evidence, not annotated). Matched-pair rows are ruled rows (NOT cards) — no border-radius, no shadow, hairline rule between pairs. §4 is THREE EQUAL CARDS (accountability without micromanagement) — no product screenshot; copy-driven. §5 run-history table rows stagger fade with NO translateY (data tables, not marketing cards). Testimonial card uses SOLID border (not dashed) with 3px Go-500 top stripe. BOTH "Start free" AND "Talk to us" CTAs present in hero AND final CTA (dual path because VP Eng sometimes wants a conversation). Secondary CTA button in §7 uses neutral border style (NOT orange) to respect two-orange-elements-per-viewport rule.

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

### Platform Page Key Decisions (v1.0 — see docs/design/pages/platform/platform.md)

- Five sections: §1 Wedge today → §2 Thesis pyramid → §3 Where we're going → §4 Guardrail → §5 Final CTA
- **Shipped vs roadmap visual split is the page's design core**: §1–2 full-contrast orange; §3 Slate palette + dashed border + no product screenshots + future-tense "On the roadmap · not yet available" pill (Slate-400 text, not orange) + no hover lift — five simultaneous visual signals
- **Pyramid (§2)**: typographic DOM structure on `--bg-section-alt`; hairlines draw center-outward (`width: 0→full`, 300ms `--ease-out`); bands stagger-fade only (no rise — structural composition); Band A `rgba(234,107,4,0.05)` warm tint + `SHIPPED` Go-green badge; pyramid must be accessible DOM text, not raster image
- §1 recap: three compact cards (NOT bento), trailing links to `/features/*`; no product screenshots
- §4 guardrail: NO section pill, NO h2, NO card border — DM Sans 600 H2-scale statement on `--bg-section-alt`, left-aligned within centered column
- §5 CTA: TWO EQUAL-WEIGHT CTAs ("Start free" orange fill + "Talk to us" border button) — unique to this page; `/pricing` is NOT linked from within the page body

### How It Works Page Key Decisions (v1.0 — see docs/design/pages/platform/how-it-works.md)

- **Archetype**: single vertical spine — six numbered steps, one band each. Column alternation: Steps 1,2,5 are text-left/screenshot-right; Steps 3,4,6 are screenshot-left/text-right. No bento, no feature-grid detours. `--bg-section-alt` alternates every step band.
- **Spine**: left-anchored 1px rule (`rgba(0,0,0,0.10)` light / `rgba(255,255,255,0.10)` dark). Draws downward as each step enters view (`height` 0→N, 600ms `--ease-out`). 32px circle nodes Orange-600 fill + white DM Sans 700 numeral. Hidden below 768px (replaced by sticky "Step N of 6" pill at tablet, inline section-label pill at mobile).
- **Step 6 node exception**: lock icon replaces the numeral (same 32px orange circle, white Linear-style 2px stroke 16px lock). Signals the sequence has closed — earned because Step 6 is the sealed state, not an action step.
- **Orange pull-quote**: Steps 4 and 5 use a `3px solid #EA6B04` left-rule blockquote to isolate the single most important mechanic sentence. Steps 6 uses a `2px rgba(0,0,0,0.08)` neutral rule — a deliberate register shift (system guarantee, not user prompt).
- **Step 4 (blocked pass)**: page's single most important pixel. Sub-label below the disabled button is always-visible (not a hover tooltip) at `max-width: 1100px`. Spec state-machine diagram appears below the main two columns (centered, `max-width: 640px`). Disabled button has NO animation — blocked is a fact.
- **Step 6 (sealed record)**: browser-chrome-framed fragment in `--bg-section-alt`. SEALED chip in Geist Mono 500 12px Slate-500. Lock icon in run header is fully static (Phase 6). Go badge is static. Justification in Geist Mono 13px — "certified record" register. Honesty caption (Slate-500 14px, visible, not hidden): browser print-to-PDF + shareable URL at launch; dedicated export is post-launch.
- **OG image**: Step 4 blocked-pass crop, 1200×630.
- **JSON-LD**: `SoftwareApplication` + `HowTo` (optional) with six `HowToStep` items.
- **No pricing link within the step narrative** — pricing is in the final CTA only. Inserting it mid-walkthrough breaks the register.
- **Cross-links**: §2→`/features/artifact-enforcement`, §3→`/features/artifact-enforcement#artifact-types`, §5→`/features/artifact-enforcement` + `/use-cases/qa-teams`, §6→`/features/go-no-go`, §7→`/features/audit-trail`, §8→`/pricing`.

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
