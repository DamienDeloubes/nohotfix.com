---
name: reference-nohotfix-brand
description: NoHotfix brand identity reference — color palette, typography, logo, semantic colors, glass system. Canonical source: docs/design/brand-identity.md v4.0 (2026-05-28).
metadata:
  type: reference
---

Full brand identity lives in `docs/design/brand-identity.md` (v4.0, 2026-05-28).

**Quick reference — most-used tokens:**

| Token | Value | Usage |
|---|---|---|
| Orange-500 | `#F97316` | PRIMARY — buttons, links, focus rings |
| Orange-400 | `#FB923C` | Hover state on orange buttons |
| Orange-600 | `#EA6C04` | Pressed/active button |
| Base-950 | `#080412` | Page shell background |
| Base-900 | `#0D0920` | Primary dark surface |
| Base-800 | `#130F2E` | Elevated surfaces, sidebar |
| Base-700 | `#1A1640` | Card backgrounds |
| Go-500 | `#00CC80` | Success, Go decisions |
| NoGo-500 | `#EAB308` | Warning, No-Go (pure yellow — NOT amber) |
| Error-500 | `#F43F5E` | System errors (rose-crimson — NOT warm red) |
| Slate-400 | `#94A3B8` | In Progress badge, muted text |
| Fire warm | `#FF8D28` | Bottom of fire gradient (logo only) |
| Fire hot | `#FF0000` | Top of fire gradient (logo only) |

**Typography:**
- Display/Hero headings: Aeonik Pro 500 (74px hero, 48px section heads) — marketing site ONLY, never dashboard
- UI/Body: Inter
- Code/Artifacts: Geist Mono

**Logo:** "NoHotfix" Inter 700 wordmark — lowercase "o" in "Hotfix" replaced by fire glyph (SVG path, gradient `#FF8D28 → #FF0000`). Production SVGs: `brand/logos/`. React component: `apps/web/src/components/NoHotfixLogo.tsx`.

**Key constraints:**
- Blue `#0036FF` is FULLY RETIRED — no residual blue anywhere
- Fire gradient for logo + rare hero decorative only (max 8% opacity decorative)
- No-Go is YELLOW `#EAB308` (not amber) — 21° hue separation from brand orange
- Error is CRIMSON `#F43F5E` (not warm red) — separate from fire gradient red
- In Progress badge: Slate `#94A3B8` (not blue)
- Flame animation in nav: BANNED. Hero entrance only: one-time 600ms kindling.

**Glass system (dark mode only):**
- Standard card: `rgba(255,255,255,0.05)` bg, `rgba(255,255,255,0.09)` border, `blur(8px)`, inset `0 1px 0 rgba(255,255,255,0.09)`
- Always include inset top-edge highlight — never omit
- No glass-on-glass layering

**Design references:**
- Linear: card discipline on dark surfaces
- ToDesktop: inset lighting, product UI as the hero visual
- Vercel (dark): typography hierarchy on dark
- Railway: dark B2B marketing site
- Stripe: precision copy voice
