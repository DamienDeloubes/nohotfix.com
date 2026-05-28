# NoHotfix — Brand Identity (Consolidated, Final)

_Last updated: 2026-03-11_
_Status: Approved and locked. Do not re-open decided items unless user explicitly requests._
_Product renamed from NoHotfix → NoHotfix on 2026-03-11._

---

## Decisions Log

| Decision       | Approved Value              | Rationale                                                                       |
| -------------- | --------------------------- | ------------------------------------------------------------------------------- |
| Product name   | NoHotfix                    | Hawk = vigilant, precise, nothing slips through                                 |
| Tagline        | "Watch every release land." | Declarative, hawk-native, benefit-first. Locked.                                |
| Logo mark      | The Strike                  | Diagonal dominant stroke + 2 horizontal bars. Geometric, not a literal bird.    |
| Blue direction | Pure electric blue #0036FF  | "Trusted infrastructure" but electric against dark base. Not Tailwind blue-600. |
| No-Go color    | Amber #F59E0B               | Decision outcome, not system error — avoids anxiety/danger read                 |
| Go color       | Emerald #00CC80             | ToDesktop green register, clean, high contrast on dark                          |
| Illustration   | None                        | Product UI carries visual weight. No buzzword decoration.                       |
| Visual mode    | Dark-dominant               | ToDesktop-adjacent. Premium, fintech aesthetic, ecosystem-native.               |
| Reference site | todesktop.com               | Colors, glassmorphism, animations, overall aesthetic register                   |
| Display font   | Aeonik Pro                  | Marketing/hero only. Geometric, premium. Never in dashboard UI.                 |
| UI font        | Inter                       | Universal, legible, ecosystem-native                                            |
| Mono font      | Geist Mono                  | Vercel open-source. Native to developer tools.                                  |

---

## Rejected Concepts

- Logo Direction: The Gate (reads as pause button)
- Logo Direction: Cleared hexagon (hexagons overused in DevOps)
- Logo Direction: Checkmark-plane hybrid (dual reading fails at favicon scale)
- Indigo palette (user chose pure blue over indigo)
- Red for No-Go (amber selected instead — avoids alarm/danger connotation)
- Aviation/pilot metaphors (brand stays grounded, not sky-themed)
- Cartoonish hawk or bird references (never literal — hawk is personality, not mascot)
- Hawk vocabulary in UI labels or error messages (discipline enforced)

---

## Color Palette (Dark-Mode-First)

### Base / Background

```
Base-950:  #080412  hsl(255, 58%, 5%)   — deepest surface, outer page bg
Base-900:  #0D0920  hsl(250, 55%, 8%)   — primary dark bg (equiv. ToDesktop #0f071d)
Base-800:  #130F2E  hsl(248, 50%, 12%)  — sidebar, elevated surfaces
Base-700:  #1A1640  hsl(244, 47%, 17%)  — card backgrounds, secondary surfaces
Base-600:  #231E54  hsl(242, 45%, 22%)  — borders, active nav bg, subtle dividers
```

### Primary Blue

```
Blue-600:  #0028CC  hsl(228, 100%, 40%)  — pressed/active state
Blue-500:  #0036FF  hsl(226, 100%, 50%)  — PRIMARY — buttons, links, key UI elements
Blue-400:  #3361FF  hsl(226, 100%, 60%)  — hover state
Blue-300:  #6688FF  hsl(226, 100%, 70%)  — dark mode text emphasis, icon fills
Blue-200:  #99AAFF  hsl(228, 100%, 81%)  — subtle tints, secondary emphasis
Blue-100:  #E0E6FF  hsl(228, 100%, 94%)  — light mode tints, info backgrounds
```

### Semantic — Go (Emerald)

```
Go-600:  #009962  hsl(161, 100%, 30%)  — dark bg go badge pressed
Go-500:  #00CC80  hsl(161, 100%, 40%)  — primary go badge, success
Go-400:  #00E591  hsl(161, 100%, 45%)  — hover
Go-100:  #D0FAE9  hsl(155, 82%, 90%)   — light mode tint
```

### Semantic — No-Go (Amber)

```
NoGo-600:  #CC6200  hsl(35, 100%, 40%)  — dark bg no-go badge pressed
NoGo-500:  #F59E0B  hsl(37, 91%, 50%)   — primary no-go badge
NoGo-400:  #FBB73A  hsl(37, 96%, 60%)   — hover
NoGo-100:  #FEF3C7  hsl(43, 96%, 90%)   — light mode tint
```

### Semantic — Error (Red, system errors only)

```
Error-500:  #EF4444  hsl(0, 84%, 60%)   — form validation, API errors
Error-100:  #FEE2E2  hsl(0, 86%, 94%)   — error background tint
```

### Neutrals (slate-based)

```
Slate-50:   #F8FAFC  hsl(210, 40%, 98%)  — light mode page bg
Slate-100:  #F1F5F9  hsl(210, 40%, 96%)  — light mode card surface
Slate-300:  #CBD5E1  hsl(213, 27%, 84%)  — light mode borders
Slate-500:  #64748B  hsl(215, 16%, 47%)  — placeholder, disabled
Slate-600:  #475569  hsl(215, 19%, 35%)  — secondary text (light mode)
Slate-700:  #334155  hsl(215, 25%, 27%)  — secondary text (dark mode icons)
Slate-900:  #0F172A  hsl(222, 47%, 11%)  — body text (light mode)
```

### Glass / Overlay (dark mode)

```
Glass-4:   rgba(255,255,255,0.04)   — subtle card lift
Glass-8:   rgba(255,255,255,0.08)   — card background
Glass-12:  rgba(255,255,255,0.12)   — hover state on glass
Glass-20:  rgba(255,255,255,0.20)   — active state, strong highlight
Glass-Border: rgba(255,255,255,0.10) — card borders in dark mode
Glass-Border-Strong: rgba(255,255,255,0.18) — focused input borders
```

---

## Typography

### Font Stack

```
Display/Heading: 'Aeonik Pro', 'Inter', -apple-system, sans-serif
Body/UI:         'Inter', -apple-system, BlinkMacSystemFont, sans-serif
Monospace:       'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace
```

**Aeonik Pro rationale**: ToDesktop uses it for hero headings. Geometric sans with more character
than Inter at large sizes. Adds premium feel without disrupting Inter-dominant UI.
Used ONLY for marketing display text (hero h1, section headlines). Never in the dashboard.

**Geist Mono rationale**: Vercel open-source. Native to the developer ecosystem.
Used for: artifact values, run IDs, audit record timestamps, code blocks.

### Type Scale

```
Display:    Aeonik Pro 500 / 74px / line-height 84px / letter-spacing -0.03em  — hero only
H1:         Aeonik Pro 500 / 48px / line-height 52px / letter-spacing -0.025em — section heads (marketing)
H2:         Inter 600    / 36px / line-height 44px / letter-spacing -0.02em
H3:         Inter 600    / 30px / line-height 38px / letter-spacing -0.015em
H4:         Inter 600    / 24px / line-height 32px / letter-spacing -0.01em
H5:         Inter 500    / 20px / line-height 28px / letter-spacing 0
H6:         Inter 500    / 18px / line-height 26px / letter-spacing 0

Body Large:  Inter 400 / 18px / line-height 28px  — marketing prose
Body Base:   Inter 400 / 16px / line-height 24px  — default UI
Body Small:  Inter 400 / 14px / line-height 22px  — table data, metadata
Body Micro:  Inter 400 / 12px / line-height 18px  — timestamps, labels

Code/Mono:  Geist Mono 400 / 14px / line-height 22px — artifact values, IDs, audit records
Code Label: Geist Mono 500 / 12px / line-height 18px — inline code labels
```

---

## Logo: The Strike

A geometric mark built from three strokes — one dominant diagonal and two left-aligned
horizontal bars below. It reads as motion, direction, and decisiveness. It is NOT a literal
hawk. The hawk is personality, not mascot.

### Mark Construction

```
Canvas:            24x24px (SVG viewBox)
Stroke weight:     3px for diagonal / 2.5px for horizontal bars
Stroke cap:        round (stroke-linecap: round)
Color (dark bg):   #0036FF (Blue-500)
Color (light bg):  #0036FF (Blue-500)
Monochrome:        #FFFFFF on dark / #0F172A on light
```

### Stroke Geometry

```
Diagonal (dominant):
  Start: (18, 4)  →  End: (6, 18)
  Angle: ~43° from horizontal (upper-right to lower-left)
  Weight: 3px

Bar 1 (upper horizontal):
  Start: (3, 13)  →  End: (10, 13)
  Left-aligned to canvas edge, sits mid-height
  Weight: 2.5px

Bar 2 (lower horizontal):
  Start: (3, 18)  →  End: (8, 18)
  Left-aligned, shorter than Bar 1
  Weight: 2.5px
```

The diagonal reads first (dominant). The two bars below-left create tension — they are
deliberately NOT parallel to each other in vertical spacing, which avoids the hamburger-menu
read. The mark reads as a strike through + residual motion lines. Hawk-wing echo without
being literal.

### Logo Lockup (full)

```
[Strike mark]  NoHotfix
               ↑ "Release" Inter 400, 18px, letter-spacing +0.01em
                 "Hawk" Inter 700, 18px, letter-spacing +0.01em
               Mark-to-wordmark gap: 10px
```

The weight contrast between "Release" (400) and "Hawk" (700) is the typographic signature.
"Release" recedes slightly, "Hawk" lands with authority. This matches the product's personality:
the process (release) is the vehicle; the hawk (vigilance) is the guarantee.

Do NOT color-split the wordmark. Both words in the same base color (#FFFFFF on dark, #0F172A on
light). The weight contrast does the work — color splitting is a startup cliché.

### Favicon Adaptation

```
16x16: Single diagonal stroke only. Full width of canvas. #0036FF on light bg, #FFFFFF on dark.
32x32: Diagonal + Bar 1 only. Drop Bar 2 — too dense at this size.
48x48+: Full three-stroke mark.
```

### Wordmark Only (no mark)

```
"NoHotfix" — Inter 400 "Release" + Inter 700 "Hawk"
Letter-spacing: +0.01em throughout
Do not separate words with a space-weight change. Keep as one compound word.
```

### Clear Space

Minimum clear space = height of the "H" in "Hawk" on all four sides.
Never place the mark on a background lighter than Base-700 (dark mode) without switching to
the Blue-500 or Slate-900 monochrome version.

### Monochrome Versions

```
White version:   All strokes #FFFFFF — for dark backgrounds, embossed print, reversed contexts
Blue version:    All strokes #0036FF — for light backgrounds, email headers
Dark version:    All strokes #0F172A — for light print, single-color reproduction
```

---

## Hawk Brand Vocabulary

### Rules of engagement

The hawk metaphor is a personality layer, not a visual theme. It governs copy tone only.

PERMITTED:

- Hero headline copy
- Section intro lines (marketing site)
- Email subject lines
- Tagline and brand expressions

NEVER:

- UI labels (buttons, nav items, table headers)
- Error messages
- Toast notifications
- Tooltip text
- Dashboard microcopy

### Approved Anchor Phrases (locked)

```
"Watch every release land."        — primary tagline
"Sharp eyes on every release"      — secondary/section use
"Nothing slips through"            — feature emphasis
"Locked on"                        — process confirmation context
"Clear sight"                      — visibility/audit context
```

Do not generate new hawk phrases during implementation. Use from the approved list only.
If new phrases are needed, escalate to brand review.

---

## Glassmorphism System (Dark Mode)

Adopted from ToDesktop aesthetic. Rules are strict — glass is a premium effect that loses
its value when overused.

### When to use glass

- Navigation bar (fixed, transforms on scroll)
- Cards that sit on top of gradient or image backgrounds
- Modals and overlays
- Status badges on dark backgrounds
- Tooltip and popover surfaces

### When NOT to use glass

- Table rows (use solid Base-700/800 alternation)
- Form inputs (use solid Base-700 with Glass-Border)
- Error states (glass reduces readability of error color)
- Any surface where text contrast would fall below WCAG AA

### Glass card recipe (standard)

```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.1) inset,
  0 0 0 1px rgba(255, 255, 255, 0.06) inset,
  0 4px 24px rgba(0, 0, 0, 0.4);
```

### Glass card recipe (elevated / modal)

```css
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.16);
border-radius: 20px;
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.18) inset,
  0 0 0 1px rgba(255, 255, 255, 0.08) inset,
  0 8px 40px rgba(0, 0, 0, 0.5);
```

### Navigation bar (scroll-transformed)

Default state:

```css
background: transparent;
border-bottom: 1px solid transparent;
```

Scrolled state (trigger at scroll > 40px):

```css
background: rgba(13, 9, 32, 0.8);
border-bottom: 1px solid rgba(255, 255, 255, 0.08);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
```

---

## Shadow System

### Elevation scale

```css
--shadow-0: none;

--shadow-1: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.06) inset;

--shadow-2: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset;

--shadow-3: 0 8px 40px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.14) inset;

--shadow-4: 0 16px 64px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.18) inset;
```

The inset white highlight on every shadow level simulates a top-edge light source and
creates the "floating" quality that is the ToDesktop signature. Do not omit it.

---

## Border & Radius System

```css
--radius-sm: 6px /* badges, chips, small buttons */ --radius-md: 10px /* inputs, secondary buttons */ --radius-lg: 16px /* cards (standard) */ --radius-xl: 20px
  /* modals, hero cards */ --radius-2xl: 28px /* large feature cards on marketing site */ --radius-full: 9999px /* pill buttons, status indicators */;
```

### Border treatments

```
Dark mode cards:   1px solid rgba(255,255,255,0.10)
Dark mode inputs:  1px solid rgba(255,255,255,0.10)
                   Focus: 1px solid #0036FF + box-shadow: 0 0 0 3px rgba(0,54,255,0.25)
Light mode cards:  1px solid #E2E8F0 (Slate-200)
Light mode inputs: 1px solid #CBD5E1 (Slate-300)
                   Focus: 1px solid #0036FF + box-shadow: 0 0 0 3px rgba(0,54,255,0.20)
```

---

## Animation Guidelines

### Easing functions

```css
--ease-premium: cubic-bezier(0.6, 0.6, 0, 1); /* fast in, smooth out — ToDesktop signature */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* scale transforms, entrance animations */
--ease-out: cubic-bezier(0, 0, 0.2, 1); /* exits, fades */
```

### Duration scale

```css
--duration-fast: 150ms /* hover state color/opacity shifts */ --duration-standard: 300ms /* card hover, button state changes */ --duration-deliberate: 450ms
  /* panel transitions, scroll nav — ToDesktop standard */ --duration-slow: 600ms /* page-level transitions, feature reveals */;
```

### Interaction rules

**Buttons**: `transition: background-color 150ms var(--ease-premium), box-shadow 150ms var(--ease-premium), transform 100ms var(--ease-premium);`
Hover: `transform: translateY(-1px);`
Active: `transform: translateY(0px);`

**Cards**: `transition: box-shadow 300ms var(--ease-premium), border-color 300ms var(--ease-premium);`
Hover: step up one shadow level, border opacity increases to 0.18

**Glass panels entering**: `animation: fadeSlideUp 450ms var(--ease-premium);`

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### What to animate

- State transitions (pending → passing, in-progress → complete)
- Navigation hover/active states
- Card hover lift
- Modal/panel entrance/exit
- Status badge appearance (new badge: brief scale pulse via --ease-spring)
- Scroll-triggered nav transformation

### What NOT to animate

- Table row data (no animation on data load — creates instability)
- Error states (must appear immediately)
- Run immutability lock (locked run is a fact, not a transition)
- Anything that blocks user interaction

---

## Component Principles

### Primary Button

```css
background: #0036ff;
color: #ffffff;
border-radius: var(--radius-md);
padding: 10px 20px;
font: Inter 500 / 14px;
letter-spacing: 0.01em;
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.2) inset,
  0 2px 8px rgba(0, 54, 255, 0.4);

/* Hover */
background: #3361ff;
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.2) inset,
  0 4px 16px rgba(0, 54, 255, 0.5);
transform: translateY(-1px);

/* Active */
background: #0028cc;
transform: translateY(0);
box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset;
```

### Status Badges

```css
/* Go badge */
background: rgba(0, 204, 128, 0.15);
color: #00cc80;
border: 1px solid rgba(0, 204, 128, 0.25);
border-radius: var(--radius-full);
padding: 2px 10px;
font: Inter 500 / 12px;

/* No-Go badge */
background: rgba(245, 158, 11, 0.15);
color: #f59e0b;
border: 1px solid rgba(245, 158, 11, 0.25);

/* Pending badge */
background: rgba(255, 255, 255, 0.06);
color: rgba(255, 255, 255, 0.6);
border: 1px solid rgba(255, 255, 255, 0.1);

/* In-Progress badge */
background: rgba(0, 54, 255, 0.15);
color: #6688ff;
border: 1px solid rgba(0, 54, 255, 0.25);
```

---

## CSS Design Tokens (Implementation-Ready)

```css
:root {
  /* Base */
  --color-base-950: #080412;
  --color-base-900: #0d0920;
  --color-base-800: #130f2e;
  --color-base-700: #1a1640;
  --color-base-600: #231e54;

  /* Blue */
  --color-blue-600: #0028cc;
  --color-blue-500: #0036ff;
  --color-blue-400: #3361ff;
  --color-blue-300: #6688ff;
  --color-blue-200: #99aaff;
  --color-blue-100: #e0e6ff;

  /* Semantic */
  --color-go-500: #00cc80;
  --color-go-600: #009962;
  --color-nogo-500: #f59e0b;
  --color-nogo-600: #cc6200;
  --color-error-500: #ef4444;

  /* Neutrals */
  --color-slate-900: #0f172a;
  --color-slate-700: #334155;
  --color-slate-500: #64748b;
  --color-slate-300: #cbd5e1;
  --color-slate-100: #f1f5f9;
  --color-slate-50: #f8fafc;

  /* Glass */
  --glass-4: rgba(255, 255, 255, 0.04);
  --glass-8: rgba(255, 255, 255, 0.08);
  --glass-12: rgba(255, 255, 255, 0.12);
  --glass-20: rgba(255, 255, 255, 0.2);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-border-strong: rgba(255, 255, 255, 0.18);

  /* Typography */
  --font-display: 'Aeonik Pro', 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  /* Spacing (4px base unit) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.06) inset;
  --shadow-2: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset;
  --shadow-3: 0 8px 40px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.14) inset;
  --shadow-4: 0 16px 64px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.18) inset;

  /* Animation */
  --ease-premium: cubic-bezier(0.6, 0.6, 0, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-standard: 300ms;
  --duration-deliberate: 450ms;
  --duration-slow: 600ms;
}
```

---

## Brand Voice (Visual Summary)

- Precise, grounded, confident without arrogance
- No buzzwords, no AI claims, no hype language
- Speaks in engineering reality: "immutable record" not "peace of mind"
- Enforcement reframed as confidence, not restriction
- Hawk vocabulary permitted in copy, never in UI

## Iconography

- Linear style, 2px stroke, rounded caps, 24x24 grid
- Status indicators only: filled circles/badges
- No gradients on icons, no drop shadows on icons
- No illustrations — product UI is the visual language

## Photography / Imagery

- Dashboard UI screenshots are primary "imagery"
- If photography used on marketing site: dark workspace, tight crop, desaturated toward brand palette
- Never stock photography
- Prefer product screenshots with glassmorphism frame treatment over raw screenshots
