---
name: brand-v4-decisions
description: Key brand decisions from v4.0 identity overhaul (2026-05-28) — orange pivot, semantic palette resolution, logo settled, glass discipline
metadata:
  type: project
---

## Brand v4.0 — Decision Log (2026-05-28)

### Trigger
Founder directive: orange is the brand color; logo is the wordmark "NoHotfix" with the "o"
in "Hotfix" replaced by a minimal fire glyph, gradient `#FF8D28 → #FF0000`. This supersedes
both the blue `#0036FF` "Checkpoint" direction and the `#1A3FFF` "Negation Mark" exploration.

### Decision 1 — Primary UI orange: `#F97316` (not the fire gradient)

The fire gradient is a brand signature, not an interactive color. Using a gradient on buttons
and focus rings creates ambiguity with the logo mark and is technically fragile (gradients on
borders require workarounds). `#F97316` (Tailwind orange-500, hsl 24°, 95% saturation) is the
flat action color: ~7.2:1 on `#0D0920`, passes WCAG AA/AAA for normal text. White on
`#F97316` is ~3.8:1 — passes AA for UI components (3:1 threshold).

**Why:** Gradient vs. flat separation keeps the logo mark special and avoids CSS-gradient button
complexity. `#F97316` is warm and energetic without being alarmist.

### Decision 2 — No-Go shifted amber→yellow: `#EAB308` (hsl 45°)

Previous No-Go was `#F59E0B` (hsl 37°). Brand orange CTA is hsl 24°. Gap was only 13° — too
close for reliable badge-vs-brand-color discrimination, especially at 12px badge font size.
Shifted to pure yellow `#EAB308` (hsl 45°, Tailwind yellow-500). Gap from brand orange: 21°.
Yellow retains "caution/judgment" semantics while occupying a distinct color category.

**Light-mode note:** NoGo-500 `#EAB308` is ~2.4:1 on white — does not pass AA. Use NoGo-700
`#A16207` for badge text on light backgrounds.

**Why:** In a product where Go/No-Go is a safety-critical business decision, color ambiguity
between brand orange and No-Go is not a cosmetic issue — it's a trust issue.

### Decision 3 — Error shifted warm-red→cool-crimson: `#F43F5E` (hsl 350°)

Previous Error was `#EF4444` (hsl 0°, warm red). Fire gradient ends at `#FF0000` (hsl 0°).
Form validation errors and the logo flame shared the same hue family — a user could not
distinguish "error state" from "brand signature" by color alone. Shifted to rose-crimson scale
(Tailwind rose), with DEFAULT `#F43F5E` (hsl 350°). Gap from fire red: 10° into blue-red
direction — clearly distinct, still universally reads as error.

**Why:** Brand fire mark must not be confused with system errors. Error crimson also reads as
slightly more urgent/cooler than warm red, which strengthens the "system problem, take action"
signal.

### Decision 4 — Blue `#0036FF` fully retired

No residual blue anywhere in the brand. The "In Progress" badge — previously the only remaining
blue UI element — moved to Slate-400 `#94A3B8`. Slate is neutral, functional, and avoids all
semantic/brand collisions. HeroUI `focus` slot remapped from blue to `#F97316` orange.

**Why:** An orphaned accent color from a superseded brand direction creates visual noise and
dilutes the orange primary. Clean retirement.

### Decision 5 — Dark-dominant kept; glass intensity reduced

The "slightly minimal" founder direction was interpreted as: keep dark-first (orange-on-dark is
dramatically better than orange-on-light for a governance tool), but pull glass recipes back.
- Standard card blur: 12px → 8px
- Elevated card blur: 20px → 12px
- Glass bg opacity: ~30% reduction
- Shadow spread: tightened at each level
- Inset top-edge highlight (`0 1px 0`) retained — it is the most important single glassmorphism
  detail, do not remove it

**Why:** Minimal = signal over chrome. The enforcement data and orange CTAs should be the visual
center, not the glass effects. Reference: Linear's card discipline applied to dark surfaces.

### Decision 6 — Logo wordmark treatment

"No" Inter 700 + "Hotfix" Inter 700 (both 700, not the previous No-400/Hotfix-700 split).
Equal weight because "No" is the product's thesis — it should not be whispered. The fire glyph
is the weight variation: it replaces the "o" and provides the visual break through color/gradient,
not through typeface contrast.

Fire glyph geometry: teardrop with rightward lean (~5°), base ~0.6× x-height wide, total height
~1.1× cap-height. Gradient: `#FF8D28` bottom → `#FF0000` top. No stroke, no glow in UI contexts.
Favicon: fire glyph alone. Single-color fallback: `#E05C00`.

**Why:** "No" at 400 weight reads as a qualifier on "Hotfix" — as if the product is apologetic
about its own name. At 700, "No" is a statement. The fire glyph provides sufficient visual
differentiation without needing weight contrast in the letterforms.

See [[brand-identity]] (docs/design/brand-identity.md) for full spec.
