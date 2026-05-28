# NoHotfix — Brand Identity System

**Product**: NoHotfix
**Version**: 5.0
**Date generated**: 2026-03-10
**Updated**: 2026-05-28
**Source documents**: docs/marketing/positioning.md, docs/marketing/messaging.md, docs/product-vision.md
**Token source**: packages/design-tokens/src/tokens.css (authoritative)

---

## Brand Positioning & Voice

### Core positioning

NoHotfix is the tool that lets you catch issues before production does — so you ship it once. The brand reframes enforcement as **confidence**, not control: rigorous testing isn't bureaucracy, it's what lets you deploy and walk away.

The release gate is the wedge; the vision broadens to the QA/test tooling choice (UAT, integrations) without diluting the enforcement core — see [product-vision.md](../product-vision.md).

### Tagline

**"Ship it once."**

### Brand archetype: The Sentinel

Not the Sage (too advisory) and not the Ruler (too authoritarian). The Sentinel stands at the gate and lets through what belongs and blocks what does not. It is not punitive — it is structural. The Sentinel does not care about your feelings about the process; it cares that the process is honored. This maps precisely to NoHotfix's product logic: the gate holds, and that is the value.

### Three adjectives (in priority order)

1. **Clinically confident** — the quiet assurance of a surgeon who has done this a thousand times. Inevitability, not aggression.
2. **Structurally warm** — orange in a light context does not shout; it invites. Warmth is in the color and in plain-spoken copy, not in personality theatre.
3. **Deliberately legible** — every choice serves clarity. Not "clean" (generic) but legible: the information architecture is as deliberate as a well-engineered API contract.

### What the brand is NOT

- Playful / startup-quirky
- Enterprise-gray / corporate stuffy
- "AI-powered" anything — no buzzwords
- A character or mascot — no bird, animal, or other mascot imagery
- Hype or superlatives — no "revolutionary," "game-changing," "the only platform that"
- Alarming or "fire-everywhere" — the fire gradient belongs to the logo; it is not a decoration pattern

### NoHotfix vocabulary (use with discipline)

Brand language is anchored on one idea: catch it first, ship it once. It is never decoration.

**Approved anchor phrases:**

- "Ship it once."
- "Caught before production"
- "No surprises in prod"
- "Proof before you ship"

Use these sparingly — in hero copy, section intros, and email subject lines only. Never in UI labels, button copy, or error messages. The product language in the dashboard is purely functional.

### Value proposition statements

```
Artifact Enforcement:
"Specs don't pass until the evidence does.
Every artifact requirement is a hard gate — not a suggestion."

Go/No-Go Decision:
"One screen. One decision. Every factor visible.
When an Admin makes the call, the record is sealed."

Run Immutability:
"After the decision, nothing changes.
No edits, no overwrites. Just the record of what happened."

Audit Readiness:
"When the compliance auditor asks for evidence,
you send them the run record. That's it."

The Promise (umbrella):
"Catch it before production does.
Ship it once."
```

---

## Logo

> SVG assets produced 2026-05-28. See `brand/logos/` for the full asset set.
> React component: `apps/web/src/components/NoHotfixLogo.tsx`.

### The Fire-in-the-O Wordmark

The logo is a typographic wordmark: **"NoHotfix"** set in Inter, where the lowercase **"o" in "Hotfix" is replaced by a minimal fire glyph** rendered in the brand fire gradient (`#FF8D28 → #FF0000`). The fire literalizes "hot" in hotfix — it is the production fire the product prevents. "NoHotfix" = no fire. The logic is immediate even without explanation.

**Why this works:**

The name is the concept. The fire glyph makes the concept visible without requiring a separate mark, an icon, or an abstraction the user has to decode. It is not playful — it is literal and precise, which matches the brand voice exactly. A production fire is not a cute metaphor; it is the engineering reality the product prevents.

**Wordmark treatment:**

- **"No"**: Inter Variable 700, set solid — assertive, not a whisper. The word "No" is the product's thesis.
- **"H"**: Inter Variable 700, continuous with "otfix"
- **"ot"**: Inter Variable 700 — the "ot" preceding the fire "o" sits at normal weight, making the fire glyph the visual break
- **fire glyph (replacing "o")**: minimal flame form — a single teardrop-with-lean, approximately the cap-height of a lowercase "o" plus a small upward extension (no wider than the "o" it replaces). Gradient fill: `#FF8D28` (bottom) → `#FF0000` (top). No stroke.
- **"fix"**: Inter Variable 700, continuous with the rest

The full word reads as one unit: **No·H·ot·[fire]·fix**. Tracking: +0.01em. No letter-spacing manipulation beyond this — Inter 700 sets cleanly at default.

**The fire glyph geometry:**

A flame is drawn as a single closed SVG path. The shape:
- Base: approximately 0.6× the x-height wide, centered on the "o" slot
- Rises to approximately 1.1× cap-height total (so it extends ~0.1× cap-height above the cap line — minimal, not dramatic)
- Slight lean toward the right (~5°) — motion, not alarm
- Bottom third: rounded, slightly wider — the base of the flame
- Top: tapers to a blunt point, not a sharp spike
- No inner teardrop cutout; the gradient from warm orange to red provides the depth
- Corner metaphor: treat it like a water droplet rotated 180° and leaning — this keeps it geometric and restrained

**Canonical SVG path (20×24 local canvas — DO NOT alter):**

```
M10,24 C2,24 0,18 0,13.5 C0,8 5,3 11,0.5 C16,2 20,8 20,13.5 C20,19 16,24 10,24Z
```

Segment guide:
- `C2,24 0,18 0,13.5` — left base arc, wide rounded bottom
- `C0,8 5,3 11,0.5` — left side to tip; control at x=0 creates concave left (flame silhouette), tip at x=11 (rightward lean)
- `C16,2 20,8 20,13.5` — convex right side, dominant mass
- `C20,19 16,24 10,24` — right base arc back to start

In the wordmark at Inter 700 32px on a 240×48 canvas: `<g transform="translate(68, 12)">` with this path inside.

**Gradient specification:**

```
gradient-id: fire-gradient
type: linearGradient
x1: 50%, y1: 100% (bottom — warm orange)
x2: 50%, y2: 0%   (top — hot red)
stops:
  stop 0%:   #FF8D28
  stop 100%: #FF0000
```

**Sizing and lockup:**

| Context              | Size     | Notes                                      |
| -------------------- | -------- | ------------------------------------------ |
| Full wordmark        | 24px cap | Standard dashboard nav / marketing header  |
| Full wordmark large  | 40px cap | Marketing hero, OG images                  |
| Favicon (32×32)      | —        | Fire glyph only — see Favicon section      |
| Favicon (16×16)      | —        | Fire glyph only, simplified                |
| Email                | 20px cap | Inline PNG; keep fire glyph large enough   |

**Clear space:** minimum 1× the cap-height of the wordmark on all sides. No other elements within this zone.

**Favicon:**

The fire glyph stands alone as the favicon. At 32×32: full gradient flame, 2px breathing room on all sides. At 16×16: simplify to the core teardrop form, gradient still applied — legibility at this scale depends on the gradient providing perceived depth. Do not use the full wordmark at favicon size — the "N" alone would be read as unrelated.

**Single-color fallback:**

For contexts where gradients cannot render (engraving, embossing, single-ink print, embroidered merch):
- Fire glyph: `#E05C00` (a flat, saturated amber-orange that reads as "hot" without requiring gradient)
- Full wordmark: `#111110` (near-black) on light, `#FFFFFF` on dark
- The fire glyph in single-color uses `#E05C00` while all letterforms use the standard wordmark color

**Dark and light variants:**

| Variant             | Letterform color | Fire glyph          |
| ------------------- | ---------------- | ------------------- |
| Dark bg (primary)   | `#FFFFFF`        | `#FF8D28 → #FF0000` |
| Light bg            | `#111110`        | `#FF8D28 → #FF0000` |
| Monochrome dark     | `#FFFFFF`        | `#E05C00` (flat)    |
| Monochrome light    | `#111110`        | `#E05C00` (flat)    |

> **Light-mode fire glyph note:** The fire gradient (`#FF8D28 → #FF0000`) on a warm-white background (`#FAFAFA`) should be verified at all canonical sizes for adequate visual weight. If the warm stop (`#FF8D28`) appears washed-out against warm white, evaluate adjusting the warm stop toward `#E56000` for the light-mode-specific SVG variant. This audit is the logo designer's responsibility.

**What to avoid:**

- Do not add a separate icon mark alongside the wordmark — the fire-in-the-o IS the mark
- Do not animate the fire glyph in the nav/header — reserve animation for marketing hero moments only
- Do not scale the fire glyph taller than 1.15× cap-height — it becomes alarming rather than precise
- Do not add a glow or drop shadow to the fire glyph in UI contexts — gradient alone provides presence
- Do not use the old Checkpoint mark (checkmark + baseline) — that concept is retired

---

## Color Palette

### Design principle: Light-first + co-equal dark, orange-dominant

**v5 theme model:** Light is the default public-facing state (marketing site, pricing page, docs). Dark is the default for engineers who prefer it and for the product dashboard. OS `prefers-color-scheme` governs the initial assignment. Neither is an afterthought — both themes are fully specified.

The brand color is orange. The fire gradient (`#FF8D28 → #FF0000`) is a signature — used in the logo glyph only. For interactive UI elements (CTAs, links, focus rings), a flat primary orange is used: controlled, accessible, not "on fire."

**The old Primary Blue (`#0036FF`) is retired.** There is no residual blue in the brand.

**The old violet Base palette (`Base-50` through `Base-950`, hsl 242–250°) is retired.** Replaced by warm-neutral Surface scale (light mode) and warm near-black Dark scale (dark mode). See below.

---

### Orange Scale (both themes)

The key distinction: which stop is "primary" changes per theme. Light mode uses Orange-600 for interactive elements; dark mode uses Orange-500. Both remain in the same scale.

| Token       | Hex       | HSL                | Light mode role                                      | Dark mode role                               |
| ----------- | --------- | ------------------ | ---------------------------------------------------- | -------------------------------------------- |
| Orange-50   | `#FFF7ED` | hsl(34, 100%, 97%) | Subtle tint backgrounds                              | —                                            |
| Orange-100  | `#FFEDD5` | hsl(34, 100%, 92%) | Selected states, light info bg                       | —                                            |
| Orange-200  | `#FED7AA` | hsl(31, 97%, 83%)  | Focus ring fill, secondary tint                      | Subtle tint bg                               |
| Orange-300  | `#FDBA74` | hsl(27, 96%, 72%)  | —                                                    | Muted emphasis on dark                       |
| Orange-400  | `#FB923C` | hsl(24, 95%, 61%)  | Hero CTA hover (large scale only)                    | Hover state on dark                          |
| Orange-500  | `#F97316` | hsl(24, 95%, 53%)  | Hero CTA + logo (large scale, high contrast context) | **PRIMARY** — CTAs, links, focus rings       |
| Orange-600  | `#EA6B04` | hsl(24, 97%, 46%)  | **LIGHT PRIMARY** — default interactive color        | Pressed/active button                        |
| Orange-700  | `#C05A00` | hsl(23, 100%, 38%) | Text links, focus rings (inline body weight)         | Strong emphasis on dark bg                   |
| Orange-800  | `#9A3F05` | hsl(23, 95%, 31%)  | Dark text on Orange-100 bg; inline link AA fallback  | Dark mode pressed                            |
| Orange-900  | `#7C2D12` | hsl(20, 83%, 28%)  | Darkest tint                                         | —                                            |
| Orange-950  | `#431407` | hsl(18, 79%, 15%)  | Outermost dark tint                                  | —                                            |

**Light mode interactive orange:** `#EA6B04` (Orange-600) is the default CTA surface color. `#9A3F05` (Orange-800) is the inline link color — AA-verified on `#FAFAFA`. `#C05A00` (Orange-700) is the hover state for inline links and the focus ring color.

**Dark mode interactive orange:** `#F97316` (Orange-500) — ~7.2:1 on near-black. Warm and clear.

**Critical accessibility rule:** `#F97316` (Orange-500) is forbidden as a text or link color on any light surface. It fails AA at body-text weight on warm white. Always use Orange-700 or Orange-800 for inline links on light backgrounds.

---

### Brand Fire Gradient

The signature mark. Not a UI color — a brand expression reserved exclusively for the logo.

```css
--gradient-fire: linear-gradient(180deg, #FF0000 0%, #FF8D28 100%);
/* Note: top-to-bottom for upward flame orientation in the glyph. */
--color-fire-hot: #FF0000;
--color-fire-warm: #FF8D28;
--color-fire-flat: #E05C00; /* single-color fallback */
```

**Where to use the fire gradient:**
- The "o" glyph in the logo wordmark — always

**Where NOT to use the fire gradient:**
- Buttons, links, form inputs, focus rings — use flat Orange-500/600
- Status badges — semantic colors own that space
- Navigation or persistent chrome
- Error states — Error has its own crimson palette
- Decorative backgrounds, section accents, or hero illustrations — the fire gradient is the logo only

---

### Surface Scale — Light Theme (replaces retired violet Base palette)

Warm-neutral, hsl(35–40°, 2–8% saturation) — just warm enough to host orange, imperceptible as a distinct hue in isolation.

| Token        | Hex       | HSL                | Usage                                        |
| ------------ | --------- | ------------------ | -------------------------------------------- |
| Surface-50   | `#FAFAF8` | hsl(60, 11%, 98%)  | Page shell — absolute lightest               |
| Surface-100  | `#F5F3EF` | hsl(40, 15%, 95%)  | Page background (light mode) — note: `--bg-page` in tokens.css is `#FAFAFA`; use tokens.css as the implementation authority |
| Surface-200  | `#EDE9E2` | hsl(37, 18%, 91%)  | Section alt, section differentiator          |
| Surface-300  | `#E0DAD0` | hsl(36, 18%, 85%)  | Dividers, input backgrounds                  |
| Surface-400  | `#C8BFB0` | hsl(33, 16%, 73%)  | Stronger borders, disabled backgrounds       |
| Surface-500  | `#A89F93` | hsl(33, 11%, 62%)  | Muted text (check contrast)                  |
| Surface-600  | `#7A7166` | hsl(33, 9%, 44%)   | Secondary icon color                         |
| Surface-700  | `#555248` | hsl(36, 8%, 31%)   | Secondary text                               |
| Surface-800  | `#2E2C28` | hsl(40, 7%, 17%)   | Deep dark text utility                       |
| Surface-900  | `#1A1917` | hsl(40, 6%, 10%)   | Near-black text utility                      |

**White card surface:** `#FFFFFF` with 1px `rgba(0,0,0,0.08)` border + shadow (see elevation section). Cards sit on the warm-white page background.

---

### Dark Scale (replaces retired violet Base palette in dark mode)

Warm near-black, hsl(34–40°, 2–5% saturation). The violet undertone is gone; orange reads as warm contrast against a structurally quiet dark ground.

| Token     | Hex       | HSL               | Usage                                 |
| --------- | --------- | ----------------- | ------------------------------------- |
| Dark-50   | `#F5F4F0` | hsl(45, 14%, 95%) | Body text on dark surfaces            |
| Dark-100  | `#E8E6E1` | hsl(40, 12%, 90%) | Heading text (slightly dimmed)        |
| Dark-200  | `#C5C2BB` | hsl(40, 7%, 75%)  | Secondary text                        |
| Dark-300  | `#9CA3AF` | hsl(220, 9%, 66%) | Muted text, placeholder               |
| Dark-400  | `#6B7280` | hsl(220, 9%, 46%) | Disabled text                         |
| Dark-500  | `#374151` | hsl(215, 14%, 27%)| Borders, separators on dark bg        |
| Dark-600  | `#2A2926` | hsl(38, 4%, 15%)  | Card background (above base)          |
| Dark-700  | `#1E1D1B` | hsl(36, 4%, 11%)  | Elevated card, modal, sidebar         |
| Dark-800  | `#161513` | hsl(34, 5%, 8%)   | Section alt surface                   |
| Dark-900  | `#111110` | hsl(40, 5%, 6%)   | **Page background** — primary dark bg |
| Dark-950  | `#0A0A09` | hsl(60, 5%, 4%)   | Outermost shell, deepest bg           |

**Key dark-mode bg:** `#111110` (Dark-900). This replaces `#0D0920` (the retired violet Base-900).

---

### Semantic — Go (success)

Unchanged from v4. Green is unambiguously "go" in every culture, and `#00CC80` is perceptually distant from orange — zero collision risk.

| Token  | Hex       | HSL                 | Usage                 |
| ------ | --------- | ------------------- | --------------------- |
| Go-50  | `#E8FDF4` | hsl(155, 82%, 95%)  | Lightest tint         |
| Go-100 | `#D0FAE9` | hsl(155, 82%, 90%)  | Light mode badge bg   |
| Go-200 | `#80F0C8` | hsl(158, 80%, 72%)  | Light emphasis        |
| Go-300 | `#33E5A6` | hsl(160, 75%, 55%)  | Medium emphasis       |
| Go-400 | `#00E591` | hsl(161, 100%, 45%) | Hover                 |
| Go-500 | `#00CC80` | hsl(161, 100%, 40%) | **Primary Go** — dark badge, text |
| Go-600 | `#009962` | hsl(161, 100%, 30%) | Dark bg badge, border |
| Go-700 | `#007A4E` | hsl(161, 100%, 24%) | Light mode badge text (AA on white) |
| Go-800 | `#00523A` | hsl(161, 100%, 16%) | Dark mode emphasis    |
| Go-900 | `#002E1F` | hsl(161, 100%, 9%)  | Darkest tint          |

---

### Semantic — No-Go / Warning

**Pure yellow** `#EAB308` (hsl 45°). Sits 21° from brand orange — a strong color category boundary, unambiguous in both themes.

| Token    | Hex       | HSL               | Usage                                         |
| -------- | --------- | ----------------- | --------------------------------------------- |
| NoGo-50  | `#FEFCE8` | hsl(55, 92%, 95%) | Lightest tint                                 |
| NoGo-100 | `#FEF9C3` | hsl(55, 97%, 88%) | Light mode badge bg                           |
| NoGo-200 | `#FEF08A` | hsl(53, 98%, 77%) | Light emphasis                                |
| NoGo-300 | `#FDE047` | hsl(48, 97%, 64%) | Medium emphasis                               |
| NoGo-400 | `#FACC15` | hsl(46, 97%, 52%) | Hover                                         |
| NoGo-500 | `#EAB308` | hsl(45, 93%, 47%) | **Primary No-Go** — dark badge, text          |
| NoGo-600 | `#CA8A04` | hsl(41, 96%, 40%) | Dark bg badge, border                         |
| NoGo-700 | `#A16207` | hsl(38, 93%, 33%) | Light mode badge text (yellow fails AA on white at -500) |
| NoGo-800 | `#854D0E` | hsl(35, 81%, 29%) | Dark mode emphasis                            |
| NoGo-900 | `#713F12` | hsl(30, 73%, 26%) | Darkest tint                                  |

---

### Semantic — Error

**Cool crimson** `#F43F5E` (hsl 350°). Perceptually distinct from the fire gradient (hsl 0°) and the orange CTA (hsl 24°).

| Token     | Hex       | HSL                  | Usage                   |
| --------- | --------- | -------------------- | ----------------------- |
| Error-50  | `#FFF1F2` | hsl(356, 100%, 97%)  | Lightest tint           |
| Error-100 | `#FFE4E6` | hsl(356, 100%, 95%)  | Light mode error bg     |
| Error-200 | `#FECDD3` | hsl(354, 97%, 90%)   | Light emphasis          |
| Error-300 | `#FDA4AF` | hsl(352, 96%, 82%)   | Medium emphasis         |
| Error-400 | `#FB7185` | hsl(351, 95%, 71%)   | Hover                   |
| Error-500 | `#F43F5E` | hsl(350, 90%, 60%)   | Primary — dark error    |
| Error-600 | `#E11D48` | hsl(345, 77%, 50%)   | Light mode error text   |
| Error-700 | `#BE123C` | hsl(345, 83%, 41%)   | Strong border           |
| Error-800 | `#9F1239` | hsl(344, 80%, 35%)   | Dark emphasis           |
| Error-900 | `#881337` | hsl(343, 79%, 30%)   | Darkest tint            |

---

### Semantic color — perceptual separation summary

| Color              | Hue  | Separation from Orange-500 (hsl 24°) |
| ------------------ | ---- | ------------------------------------- |
| Brand Orange-500   | 24°  | — (reference)                         |
| Fire red (`#FF0000`) | 0° | 24° from orange                       |
| No-Go Yellow-500   | 45°  | 21° from orange                       |
| Error Crimson-500  | 350° | 26° from orange (wrapping through 0°) |
| Go Green-500       | 161° | 137° from orange                      |

---

### Neutrals (slate — scaffolding)

| Token     | Hex       | Usage                               |
| --------- | --------- | ----------------------------------- |
| Slate-900 | `#0F172A` | Body text (light mode, deep)        |
| Slate-700 | `#334155` | Secondary text, icons               |
| Slate-500 | `#64748B` | Placeholder, disabled, muted labels |
| Slate-400 | `#94A3B8` | In Progress badge text              |
| Slate-300 | `#CBD5E1` | Borders (light mode)                |
| Slate-100 | `#F1F5F9` | Light-mode utility tints            |
| Slate-50  | `#F8FAFC` | Lightest neutral tint               |

---

## Theme Model

### How the two themes work

- **`:root`** carries theme-invariant tokens (color scales, fire gradient, typography, spacing, radii, motion) plus the **light theme defaults**.
- **`.dark`** overrides the semantic surface tokens for dark mode.
- A pre-paint script sets or removes the `dark` class on `<html>` based on `prefers-color-scheme` (or localStorage override). **Light = no class.**
- Neither theme is hardcoded as default in CSS — the OS preference drives the initial assignment.

The token file lives at `packages/design-tokens/src/tokens.css` and is the single source of truth for implemented values.

### WCAG 2.1 AA — key contrast pairings

**Light theme:**

| Foreground             | Background | Ratio  | Result                                          |
| ---------------------- | ---------- | ------ | ----------------------------------------------- |
| `#EA6B04` (Orange-600) | `#FAFAFA`  | ~4.5:1 | AA pass — buttons, UI components                |
| `#9A3F05` (Orange-800) | `#FAFAFA`  | ~7.3:1 | AA pass — inline links (implementation value)   |
| `#C05A00` (Orange-700) | `#FFFFFF`  | ~5.8:1 | AA pass — links, focus rings                    |
| `#FFFFFF` on `#EA6B04` | —          | ~4.5:1 | AA pass — button labels                         |
| `#111110` (body text)  | `#FAFAFA`  | ~18:1  | AAA pass                                        |
| `#F97316` on `#FAFAFA` | —          | ~2.8:1 | **FAIL** — do not use Orange-500 for text/links on light |

**Dark theme:**

| Foreground             | Background | Ratio  | Result              |
| ---------------------- | ---------- | ------ | ------------------- |
| `#F97316` (Orange-500) | `#111110`  | ~7.2:1 | AA + AAA pass       |
| `#FFFFFF` on `#F97316` | —          | ~3.9:1 | AA pass (large/bold)|
| `#F5F4F0` (body text)  | `#111110`  | ~14.8:1| AAA pass            |
| `#EAB308` (No-Go)      | `#111110`  | ~8.1:1 | AAA pass            |
| `#00CC80` (Go)         | `#111110`  | ~8.6:1 | AAA pass            |
| `#F43F5E` (Error)      | `#111110`  | ~4.8:1 | AA pass             |

---

## HeroUI Semantic Color Mapping

Both themes are fully specified. The `secondary` slot previously mapped to the violet Base palette — it now maps to the warm-neutral Surface/Dark scales.

| HeroUI slot  | Light theme value                                     | Dark theme value                      | Notes                                                   |
| ------------ | ----------------------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| `primary`    | `#EA6B04` (Orange-600)                                | `#F97316` (Orange-500)                | Different stop per theme — per orange discussion above  |
| `secondary`  | `#7A7166` (Surface-600)                               | `rgba(255,255,255,0.08)` glass        | Neutral secondary — warm, not violet                    |
| `success`    | `#007A4E` (Go-700) on `#D0FAE9` bg                    | `#00CC80` (Go-500)                    | Light: darker stop for contrast; dark: unchanged        |
| `warning`    | `#A16207` (NoGo-700) on `#FEF9C3` bg                  | `#EAB308` (NoGo-500)                  | Light: darker (yellow fails AA on white at -500)        |
| `danger`     | `#E11D48` (Error-600) on `#FFE4E6` bg                 | `#F43F5E` (Error-500)                 | Both themes: crimson family                             |
| `default`    | `#FFFFFF` with border `rgba(0,0,0,0.08)`              | `rgba(255,255,255,0.06)` glass        | Card surface                                            |
| `background` | `#FAFAFA`                                             | `#111110` (Dark-900)                  | Replaces retired `#080412` (violet Base-950)            |
| `foreground` | `#111110`                                             | `#F5F4F0` (Dark-50)                   | Body text, inverse per theme                            |
| `content1`   | `#FFFFFF`                                             | `#1E1D1B` (Dark-700)                  | Primary content surface                                 |
| `content2`   | `#F4F4F5`                                             | `#161513` (Dark-800)                  | Secondary content surface                               |
| `content3`   | `#EDE9E2` (Surface-200)                               | `#111110` (Dark-900)                  | Tertiary content surface                                |
| `content4`   | `#E0DAD0` (Surface-300)                               | `#0A0A09` (Dark-950)                  | Quaternary content surface                              |
| `divider`    | `rgba(0,0,0,0.08)`                                    | `rgba(255,255,255,0.09)`              | Borders, separators                                     |
| `focus`      | `#EA6B04` (Orange-600)                                | `#F97316` (Orange-500)                | Focus rings match primary per theme                     |

Each semantic color (primary, secondary, success, warning, danger) is configured with the full 50–950 shade range from the brand palette, allowing HeroUI components to use all variants (e.g. `bg-primary-100`, `text-warning-300`).

Glass tokens (`glass-4`, `glass-8`, etc.) have no HeroUI equivalent and are exposed as custom CSS properties / Tailwind utilities alongside the HeroUI theme.

---

## Typography

### Display face: DM Sans

**DM Sans** (free, OFL) replaces Aeonik Pro at display/hero scale. Rationale: DM Sans is a geometric sans close in character to Aeonik Pro but free — Aeonik Pro's ~€500+ commercial license was never acquired. DM Sans at light weights reads approachable/friendly; the hard rule is **always 600+ weight with tight tracking at display scale** — heavy + tight reads architecturally precise, not soft. Never use DM Sans below 600 weight at display scale.

### Font stack

| Context                | Family     | Fallback                                      |
| ---------------------- | ---------- | --------------------------------------------- |
| Display / Marketing H1 | DM Sans    | Inter, -apple-system, sans-serif              |
| Marketing H2 + Section | DM Sans    | Inter, -apple-system, sans-serif              |
| UI / Body              | Inter      | -apple-system, BlinkMacSystemFont, sans-serif |
| Code / Artifact data   | Geist Mono | JetBrains Mono, monospace                     |

DM Sans: marketing site hero and section headings (H2 and larger) only. Never in the dashboard. Always 600+ weight with tight tracking.

**Inter** stays for all UI, body, sub-headlines, nav links, button labels, captions, and microcopy.

**Geist Mono** for code/artifact display — "certified document" quality on immutable run records.

### Type scale

| Style      | Family     | Weight | Size (rem) | Size (px) | Line-height | Letter-spacing | Usage                         |
| ---------- | ---------- | ------ | ---------- | --------- | ----------- | -------------- | ----------------------------- |
| Display    | DM Sans    | 700    | 4.625rem   | 74px      | 1.08        | -0.04em        | Hero — single large statement |
| H1 (mktg)  | DM Sans    | 600    | 3.0rem     | 48px      | 1.1         | -0.03em        | Marketing page headings       |
| H2         | DM Sans    | 600    | 2.25rem    | 36px      | 1.2         | -0.025em       | Section headings              |
| H3         | Inter      | 600    | 1.875rem   | 30px      | 1.3         | -0.02em        | Sub-sections                  |
| H4         | Inter      | 600    | 1.5rem     | 24px      | 1.35        | -0.015em       | Card headings                 |
| H5         | Inter      | 500    | 1.25rem    | 20px      | 1.4         | -0.01em        | Labels                        |
| H6         | Inter      | 500    | 1.125rem   | 18px      | 1.45        | 0              | Small labels                  |
| Body Large | Inter      | 400    | 1.125rem   | 18px      | 1.6         | 0              | Marketing prose, lead         |
| Body Base  | Inter      | 400    | 1.0rem     | 16px      | 1.5         | 0              | Default UI text               |
| Body Small | Inter      | 400    | 0.875rem   | 14px      | 1.57        | 0              | Table data, metadata          |
| Body Micro | Inter      | 400    | 0.75rem    | 12px      | 1.5         | 0              | Timestamps, badge labels      |
| Mono Base  | Geist Mono | 400    | 0.875rem   | 14px      | 1.57        | 0              | Artifact values, run IDs      |
| Mono Label | Geist Mono | 500    | 0.75rem    | 12px      | 1.5         | 0              | Inline code chips             |

**Changes from v4:** Aeonik Pro → DM Sans. Display weight 500 → 700. H1 weight 500 → 600. H2 face Inter → DM Sans (section headings now use the display face). Letter-spacing tightened across all display levels.

---

## Visual System

### Aesthetic direction: light-first, architectural

**v5 primary direction:** Clean, structured light surfaces with generous whitespace. Orange as an architectural detail — the way Cloudflare's orange functions on a white page: not a shout, an invitation. Dark mode is equally designed, using warm near-black surfaces that let orange read as warm contrast rather than competing with a purple undertone.

**Glass model A — NAV AND OVERLAYS ONLY (both themes); cards are SOLID:**

- Light mode cards: `#FFFFFF` background, 1px `rgba(0,0,0,0.08)` border, shadow only. No `backdrop-filter` on cards in light mode.
- Dark mode cards: `#1E1D1B` (solid fill), 1px `rgba(255,255,255,0.09)` border, mandatory inset top-edge highlight, shadow. No `backdrop-filter` on cards in dark mode.
- Glass (`backdrop-filter: blur`) applies ONLY to: sticky nav (both themes), dropdown menus (both themes), overlays/modals (both themes).

This is a strict rule. Glass on cards is retired. If you encounter a glass card in the codebase, flag it to the design-systems-engineer.

**The inset top-edge highlight** (`0 1px 0 rgba(255,255,255,x) inset`) is kept on all elevated dark surfaces — it is the most important single detail that makes dark surfaces feel lit, not flat. Never omit it on dark-mode elevated surfaces.

### Light mode — card and elevation recipes

All elevation in light mode is achieved with box-shadow and a 1px border. No `backdrop-filter`. No rgba background.

**Standard card (light):**

```css
background: #ffffff;
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 16px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
```

**Elevated card (light — modals, decision overlay):**

```css
background: #ffffff;
border: 1px solid rgba(0, 0, 0, 0.10);
border-radius: 20px;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 16px 40px rgba(0, 0, 0, 0.09);
```

**Shadow scale (light):**

| Level      | CSS value                                                                 | Usage                             |
| ---------- | ------------------------------------------------------------------------- | --------------------------------- |
| shadow-0   | `0 0 0 1px rgba(0,0,0,0.08)`                                             | Resting card border (no lift)     |
| shadow-1   | `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`                | Standard card at rest             |
| shadow-2   | `0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`                | Card hover lift                   |
| shadow-3   | `0 4px 16px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.09)`              | Modal, dropdown                   |
| shadow-4   | `0 8px 32px rgba(0,0,0,0.15), 0 24px 64px rgba(0,0,0,0.11)`              | Command palette, decision overlay |

### Dark mode — card and elevation recipes

Cards in dark mode use solid fills + mandatory inset highlight + shadow. No `backdrop-filter` on cards.

**Standard card (dark):**

```css
background: #1e1d1b;
border: 1px solid rgba(255, 255, 255, 0.09);
border-radius: 16px;
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.09) inset,
  0 4px 20px rgba(0, 0, 0, 0.35);
```

**Elevated card (dark — modals, command palette, decision review):**

```css
background: #2a2926;
border: 1px solid rgba(255, 255, 255, 0.14);
border-radius: 20px;
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.16) inset,
  0 8px 32px rgba(0, 0, 0, 0.45);
```

**Shadow scale (dark):**

| Level    | Value                                                              | Usage                             |
| -------- | ------------------------------------------------------------------ | --------------------------------- |
| shadow-1 | `0 1px 0 rgba(255,255,255,.09) inset, 0 4px 20px rgba(0,0,0,.35)` | Cards at rest                     |
| shadow-2 | `0 1px 0 rgba(255,255,255,.12) inset, 0 8px 28px rgba(0,0,0,.45)` | Hover lift                        |
| shadow-3 | `0 1px 0 rgba(255,255,255,.16) inset, 0 8px 32px rgba(0,0,0,.50)` | Modals                            |
| shadow-4 | `0 1px 0 rgba(255,255,255,.18) inset, 0 16px 56px rgba(0,0,0,.60)`| Command palette, decision overlay |

### Navigation (scroll transform — glass, both themes)

```css
/* Default (both themes) */
nav {
  background: transparent;
  border-bottom: 1px solid transparent;
}

/* Scrolled — light mode (trigger at 40px) */
nav.scrolled {
  background: rgba(250, 250, 250, 0.90);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrolled — dark mode (trigger at 40px) */
.dark nav.scrolled {
  background: rgba(17, 17, 16, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Glass tokens (nav/overlays — both themes)

```css
--glass-4:             rgba(255, 255, 255, 0.04);
--glass-8:             rgba(255, 255, 255, 0.08);
--glass-12:            rgba(255, 255, 255, 0.12);
--glass-20:            rgba(255, 255, 255, 0.20);
--glass-border:        rgba(255, 255, 255, 0.09);
--glass-border-strong: rgba(255, 255, 255, 0.16);
```

---

## Status Badge System — Both Themes

All badges: `border-radius: 9999px`, `padding: 2px 10px`, `font: Inter 500 / 12px`.

**Dark theme:**

```css
.badge-go {
  background: rgba(0, 204, 128, 0.14);
  color: #00cc80;
  border: 1px solid rgba(0, 204, 128, 0.24);
}
.badge-nogo {
  background: rgba(234, 179, 8, 0.14);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.24);
}
.badge-in-progress {
  background: rgba(100, 116, 139, 0.14);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.24);
}
.badge-pending {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.09);
}
.badge-skipped {
  background: rgba(100, 116, 139, 0.10);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.20);
}
```

**Light theme:**

```css
.badge-go {
  background: #d0fae9;
  color: #007a4e;
  border: 1px solid rgba(0, 153, 98, 0.30);
}
.badge-nogo {
  background: #fef9c3;
  color: #a16207;
  border: 1px solid rgba(202, 138, 4, 0.30);
}
.badge-in-progress {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid rgba(100, 116, 139, 0.30);
}
.badge-pending {
  background: #ede9e2;
  color: #7a7166;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.badge-skipped {
  background: #f5f3ef;
  color: #a89f93;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
```

**In Progress note:** Blue (`#0036FF` / `#6688FF`) is retired. In Progress uses slate (`#94A3B8` dark / `#475569` light) — neutral, functional, no collision with semantic or brand colors.

---

## CSS Token Set

The canonical token file is `packages/design-tokens/src/tokens.css`. What follows is a summary of the structure; always refer to the file for exact values.

```css
/* =========================================================================
   @nohotfix/design-tokens — Brand v5
   Theme model: :root = invariants + light defaults. .dark = dark overrides.
   Pre-paint script sets/removes `dark` class on <html> from prefers-color-scheme.
   Light = no class.
   ========================================================================= */

:root {
  /* Orange scale (50–950) */
  --color-orange-50: #fff7ed;
  --color-orange-100: #ffedd5;
  --color-orange-200: #fed7aa;
  --color-orange-300: #fdba74;
  --color-orange-400: #fb923c;
  --color-orange-500: #f97316;
  --color-orange-600: #ea6b04;
  --color-orange-700: #c05a00;
  --color-orange-800: #9a3f05;
  --color-orange-900: #7c2d12;
  --color-orange-950: #431407;

  /* Fire gradient — logo only */
  --gradient-fire: linear-gradient(180deg, #ff0000 0%, #ff8d28 100%);
  --color-fire-hot: #ff0000;
  --color-fire-warm: #ff8d28;
  --color-fire-flat: #e05c00;

  /* Semantic: Go (50–900), NoGo (50–900), Error (50–900) — see scale tables above */

  /* Typography */
  --font-display: 'DM Sans', 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  /* Spacing (4px grid) */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;
  --space-24: 96px; --space-32: 128px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --radius-xl: 20px; --radius-2xl: 28px; --radius-full: 9999px;

  /* Motion */
  --ease-premium: cubic-bezier(0.6, 0.6, 0, 1);
  --ease-page: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 150ms; --duration-standard: 300ms;
  --duration-deliberate: 400ms; --duration-slow: 600ms;

  /* ---- LIGHT THEME DEFAULTS (no .dark class) ---- */
  --bg-page: #fafafa;
  --bg-page-shell: #ffffff;
  --bg-card: #ffffff;
  --bg-card-elevated: #ffffff;
  --bg-section-alt: #f4f4f5;
  --bg-input: #ffffff;
  --bg-hover: #f4f4f5;
  --bg-active: #ececee;

  --text-primary: #111110;
  --text-secondary: #52514c;
  --text-muted: #78776f;
  --text-disabled: #a1a1aa;
  --text-inverse: #ffffff;
  --text-link: var(--color-orange-800);       /* #9A3F05 — AA on #FAFAFA */
  --text-link-hover: var(--color-orange-700); /* #C05A00 */

  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.14);
  --border-focus: var(--color-orange-600);

  --color-primary: var(--color-orange-600);       /* #EA6B04 */
  --color-primary-hover: var(--color-orange-700); /* #C05A00 */
  --color-primary-active: var(--color-orange-800);/* #9A3F05 */
  --color-primary-text: #ffffff;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
  --shadow-card-hover: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07);
  --shadow-modal: 0 4px 16px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.09);
  --shadow-overlay: 0 8px 32px rgba(0,0,0,0.15), 0 24px 64px rgba(0,0,0,0.11);

  --nav-bg: rgba(250, 250, 250, 0.90);
  --nav-border: rgba(0, 0, 0, 0.08);
  --overlay-scrim: rgba(17, 17, 16, 0.32);

  --go-surface: var(--color-go-100);
  --go-text: var(--color-go-700);
  --go-border: rgba(0, 153, 98, 0.3);
  --nogo-surface: var(--color-nogo-100);
  --nogo-text: var(--color-nogo-700);
  --nogo-border: rgba(202, 138, 4, 0.3);
  --error-surface: var(--color-error-100);
  --error-text: var(--color-error-600);
  --error-border: rgba(225, 29, 72, 0.3);
}

/* ---- DARK THEME (.dark class on <html>) ---- */
.dark {
  --bg-page: #111110;
  --bg-page-shell: #0a0a09;
  --bg-card: #1e1d1b;
  --bg-card-elevated: #2a2926;
  --bg-section-alt: #161513;
  --bg-input: #1a1917;
  --bg-hover: rgba(255, 255, 255, 0.06);
  --bg-active: rgba(255, 255, 255, 0.10);

  --text-primary: #f5f4f0;
  --text-secondary: #c5c2bb;
  --text-muted: #9ca3af;
  --text-disabled: #6b7280;
  --text-inverse: #111110;
  --text-link: var(--color-orange-500);        /* #F97316 */
  --text-link-hover: var(--color-orange-400);  /* #FB923C */

  --border-default: rgba(255, 255, 255, 0.09);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-focus: var(--color-orange-500);

  --color-primary: var(--color-orange-500);        /* #F97316 */
  --color-primary-hover: var(--color-orange-400);  /* #FB923C */
  --color-primary-active: var(--color-orange-600); /* #EA6B04 */
  --color-primary-text: #ffffff;

  --shadow-card: 0 1px 0 0 rgba(255,255,255,0.09) inset, 0 4px 20px rgba(0,0,0,0.35);
  --shadow-card-hover: 0 1px 0 0 rgba(255,255,255,0.12) inset, 0 8px 28px rgba(0,0,0,0.45);
  --shadow-modal: 0 1px 0 0 rgba(255,255,255,0.16) inset, 0 8px 32px rgba(0,0,0,0.50);
  --shadow-overlay: 0 1px 0 0 rgba(255,255,255,0.18) inset, 0 16px 56px rgba(0,0,0,0.60);

  --nav-bg: rgba(17, 17, 16, 0.85);
  --nav-border: rgba(255, 255, 255, 0.07);
  --overlay-scrim: rgba(0, 0, 0, 0.60);

  --go-surface: rgba(0, 204, 128, 0.14);
  --go-text: var(--color-go-500);
  --go-border: rgba(0, 204, 128, 0.24);
  --nogo-surface: rgba(234, 179, 8, 0.14);
  --nogo-text: var(--color-nogo-500);
  --nogo-border: rgba(234, 179, 8, 0.24);
  --error-surface: rgba(244, 63, 94, 0.14);
  --error-text: var(--color-error-500);
  --error-border: rgba(244, 63, 94, 0.24);
}
```

**Token file location:** `packages/design-tokens/src/tokens.css`

**Retired tokens (remove from globals.css and tailwind.config.ts):**
- All `--color-base-*` tokens (hsl 242–250°, the violet base)
- Any `--color-base-*` in HeroUI theme config (secondary, default, background, content1–4)
- `--shadow-1` through `--shadow-4` (v4 dark-only recipe) — replace with per-theme shadow tokens above
- `--duration-deliberate: 450ms` → updated to 400ms

---

## Spacing System

4px base grid.

| Token       | Value  | Token       | Value  |
| ----------- | ------ | ----------- | ------ |
| `--space-1` | 4px    | `--space-10`| 40px   |
| `--space-2` | 8px    | `--space-12`| 48px   |
| `--space-3` | 12px   | `--space-16`| 64px   |
| `--space-4` | 16px   | `--space-20`| 80px   |
| `--space-5` | 20px   | `--space-24`| 96px   |
| `--space-6` | 24px   | `--space-32`| 128px  |
| `--space-8` | 32px   |             |        |

**Marketing section vertical padding (desktop):** 120–160px. Sections are rooms, not a continuous scroll.

---

## Border Radius

| Token         | Value  | Usage                      |
| ------------- | ------ | -------------------------- |
| `--radius-sm` | 6px    | Badges, chips              |
| `--radius-md` | 10px   | Inputs, buttons            |
| `--radius-lg` | 16px   | Standard cards             |
| `--radius-xl` | 20px   | Modals, elevated cards     |
| `--radius-2xl`| 28px   | Marketing hero cards only  |
| `--radius-full`| 9999px| Status pills, avatar       |

---

## Animation

| Token                 | Value                               | Usage                                    |
| --------------------- | ----------------------------------- | ---------------------------------------- |
| `--ease-premium`      | `cubic-bezier(0.6, 0.6, 0, 1)`      | Dashboard state transitions — fast in, smooth out |
| `--ease-page`         | `cubic-bezier(0.4, 0, 0.2, 1)`      | Marketing section entrances — slightly softer |
| `--ease-spring`       | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge appearance, scale pops             |
| `--ease-out`          | `cubic-bezier(0, 0, 0.2, 1)`        | Exits, fades                             |
| `--duration-fast`     | 150ms                               | Hover color/opacity shifts               |
| `--duration-standard` | 300ms                               | Nav scroll-transform, card hover         |
| `--duration-deliberate`| 400ms                              | Section entrances                        |
| `--duration-slow`     | 600ms                               | Page transitions, feature reveals        |

**`--ease-page`** is the section entrance easing (marketing). **`--ease-premium`** is the dashboard interaction curve. Both are now named.

**Section entrances:** `opacity 0 → 1` + `translateY(24px) → 0`, 400ms, `--ease-page`.

**Card hover (marketing):** `translateY(0) → translateY(-4px)` + shadow deepening, 200ms, `--ease-out`.

**Do NOT animate:** lock icons, immutability indicators, pass/fail badges at rest, fire glyph in nav/header.

---

## Illustrations & Imagery

- **No illustrations.** The product UI is the visual language.
- **No photography** in the dashboard or marketing site hero/feature sections.
- Marketing site: if photography is ever used (not recommended), natural-light workspace shots — slightly warm-toned, no stock staging, no faces.
- If illustration is ever needed (404, empty state): flat, geometric, monochromatic or two-color from brand palette. No character illustrations.

**Screenshot treatment — light mode:** `border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)`.

**Screenshot treatment — dark mode:** wrap in the standard dark card recipe (solid `#1E1D1B` bg, inset highlight, blur 0 — no backdrop-filter on card).

---

## Iconography

- Linear style: 2px stroke weight, rounded caps, 24×24 grid
- Not filled (exception: status indicators use filled circles/badges — fill communicates state, not action)
- No illustrated icons, gradient icons, or isometric icons
- The fire glyph in the logo is the sole exception to the no-gradient-icons rule — it is a brand mark, not an icon in the UI icon system

---

## Data Visualization

- Use semantic colors directly: Go green, No-Go yellow, Pending slate
- Minimal chart chrome
- Prefer structured tables over charts where both would work
- The audience reads data in tables, not pie charts

---

## Design Reference

Visual direction inspired by **Cloudflare** (light-first confidence; orange as architectural detail; generous whitespace; plain-spoken technical headlines), **Linear** (card discipline — surfaces that do not call attention to themselves; the UI is the brand argument), and **Stripe** (screenshot-as-primary-brand-imagery; technical complexity communicated without dumbing down; precision copy).

| Reference    | What to borrow                                                                      | What NOT to take                                         |
| ------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Cloudflare** | Light-first with warm-white + orange; generous section whitespace; auto-dark-mode | Their specific orange (`#F48120`); illustrated iconography |
| **Linear**    | Card discipline on dark; nothing decorative; typographic precision in UI labels    | Very dark base (we are light-first); product color coding |
| **Stripe**    | Screenshots as the primary brand argument; technical precision in label copy       | Gradient/color expressiveness (too playful for our register) |
