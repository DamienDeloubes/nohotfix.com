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

- `docs/design/pages/homepage.md` — Full homepage IA (2026-03-10)

### Product Core (never omit from any page design)

- **Tagline**: "Ship it once." (catch every issue before production does)
- **Core triad**: Artifact-gated execution + Go/no-go decision gate + Run immutability
- **Strongest differentiator**: The pass action is BLOCKED (not warned, not reminded — blocked) until artifacts attached
- **Second differentiator**: Run immutability — record cannot be edited after go/no-go decision
- All three pillars are on every plan including Free — never gate them in messaging

### Brand Design System (see brand-identity.md for full tokens)

- Design reference: todesktop.com — dark-dominant, glassmorphism, premium micro-interactions
- Fonts: Aeonik Pro (marketing H1/H2 only, never in dashboard), Inter (body/UI), Geist Mono (code/artifacts)
- Primary blue: `#0036FF`; Go green: `#00CC80`; No-Go amber: `#F59E0B`
- Base dark surface: `#0D0920` (Base-900), outermost bg: `#080412` (Base-950)
- Glass card recipe: `bg rgba(255,255,255,0.06)`, `border rgba(255,255,255,0.10)`, `backdrop-filter blur(12px)`, inset top light `0 1px 0 rgba(255,255,255,0.10)` — never omit the inset top light
- Ease-premium: `cubic-bezier(0.6, 0.6, 0, 1)` — standard for most UI transitions
- Nav scroll transform triggers at 40px depth

### Homepage Key Decisions

- Page uses a single continuous vertical gradient (light blue-white at top → near-black at bottom) as the unifying visual device
- Hero section is LIGHT (open in the page gradient), uses dark text — inverts at the Three Guarantees section into dark mode
- Product preview (hero section) shows 3 tab states: Execute specs / Go/No-Go / Immutable record — built as a React demo component, not a screenshot
- The disabled pass button (enforcement visual) is the single most important visual element on the whole page
- Comparison table: 5 rows × 4 tools. NoHotfix column gets blue wash `rgba(0,54,255,0.06)` + checkmarks animate on scroll-in with ease-spring
- Pain Hook section uses a side-by-side contrast card (Notion checklist vs NoHotfix enforcement)
- Compliance persona intentionally NOT shown in "Who It's For" section — kept to 2 cards (QA + EM) to avoid dilution; compliance surfaced in pricing and comparison

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
- Growth: $29/mo early bird (→ $49 standard), up to 10 seats, audit export PDF/JSON
- Scale: $99/mo early bird (→ $149 standard), up to 40 seats, 1-day SLA
- Enterprise: custom, 40+ seats, SSO/SAML
- Early bird = first 100 paying orgs, price locked for life via Stripe
- Free → Growth trigger: invite gate (first teammate)
