# NoHotfix — Brand Identity System

**Product**: NoHotfix
**Date generated**: 2026-03-10
**Updated**: 2026-03-11 (rebrand from NoHotfix)
**Source documents**: docs/design/brand-identity.md (original), docs/marketing/positioning.md, docs/marketing/messaging.md

Version 2.0

---

## Brand Positioning & Voice

### Core positioning

NoHotfix is the tool that lets you ship without the doubt. The brand reframes enforcement as **confidence**, not control.

### Tagline

**"Watch every release land."**

### Personality traits (in priority order)

1. **Precise** — every word earns its place. No filler. No vague promises.
2. **Grounded** — speaks in the language of engineering reality, not marketing fantasy.
3. **Watchful** — always observing. Nothing escapes the audit trail. Sharp eyes on every release.
4. **Vigilant** — not passive watching but active, consequential scrutiny. The enforcement is the product.
5. **Quietly opinionated** — the product has a strong point of view about how releases should work.

### What the brand is NOT

- Playful / startup-quirky
- Enterprise-gray / corporate stuffy
- "AI-powered" anything — no buzzwords
- Cartoonish or decorative bird references — no feathers, no talons as gimmicks, no puns
- Hawk vocabulary used as decoration rather than reinforcement

### Hawk vocabulary (permitted with discipline)

Hawk-adjacent language is allowed when it reinforces precision and scrutiny. It is never decoration.

**Approved anchor phrases:**

- "Sharp eyes on every release"
- "Nothing slips through"
- "Locked on"
- "Clear sight"
- "Watch every release land"

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
```

---

## Logo

### The Strike

A geometric, angular mark — three strokes that together suggest a descending strike: decisive, directional, precise. Not a literal hawk. Not a bird silhouette. An abstraction that reads as motion, precision, and clarity.

**Concept:**

The mark is built from two primary elements:

1. **A dominant diagonal stroke** — angled approximately 40–45° from upper-right to lower-left, weight 3px, rounded caps. This is the primary "strike" vector: the hawk mid-dive, or equivalently, a release descending cleanly into production. Length: ~22px in the standard 32px canvas.

2. **Two secondary horizontal bars** — left-aligned, stacked below and slightly right of where the diagonal ends. Bar 1: ~14px wide. Bar 2: ~9px wide. Both 2.5px stroke, rounded caps. These read as the landing point — what the diagonal is aimed at. They also preserve a "completion / checklist" association without being literal steps.

**Execution rules:**

- Canvas: 32×32px standard, 16×16px favicon, 64×64px high-res
- Stroke weight: 3px diagonal (primary), 2.5px horizontal bars (secondary)
- All strokes: rounded caps (2px radius)
- Diagonal angle: 40–45° (upper-right to lower-left)
- The diagonal terminates approximately 6px above the first horizontal bar — a gap that creates visual separation between the strike vector and the landing
- Color: `#0036FF` (Primary Blue) on dark, `#0D0920` (Base-900) on light
- The two horizontal bars are left-aligned to each other; the diagonal's lower terminus aligns approximately with the left edge of Bar 1

**Wordmark:**

- "Release" in Inter 400, "Hawk" in Inter 700
- Set beside the mark with 10px gap between mark and wordmark
- Tracking: +0.01em
- Wordmark baseline aligns with the center of the mark

**Favicon (16×16):**

- Single diagonal stroke (primary only), 2px weight, angled 40–45°
- Plus one short horizontal bar below and left — 2px weight, ~7px wide
- Or use a filled simplified chevron pointing lower-left

**Associations:** precision targeting, decisive action, a release that lands cleanly, the moment between decision and deployment.

**What to avoid:**

- Do not add a beak, eye, wing curves, or any organic forms
- Do not make the diagonal too steep (>55°) — it reads as a slash, not a strike
- Do not make the horizontal bars centered — left-alignment is the structural anchor
- Never use a gradient fill on the mark

---

## Color Palette

Dark-mode-first. The base has a blue-violet undertone throughout.

### Base surfaces

Blue-violet undertone throughout. Full 50-900 + 950 scale for HeroUI compatibility.

| Token    | Hex       | HSL                | Usage                                |
| -------- | --------- | ------------------ | ------------------------------------ |
| Base-50  | `#F0EFF5` | hsl(250, 20%, 95%) | Lightest tint (light mode bg)        |
| Base-100 | `#DEDCEB` | hsl(248, 22%, 89%) | Light mode card surface              |
| Base-200 | `#B9B5D4` | hsl(246, 24%, 77%) | Light mode borders                   |
| Base-300 | `#908ABC` | hsl(244, 26%, 64%) | Muted text (light mode)              |
| Base-400 | `#6B62A3` | hsl(242, 28%, 51%) | Secondary text                       |
| Base-500 | `#4A4280` | hsl(242, 32%, 38%) | Tertiary elements                    |
| Base-600 | `#231E54` | hsl(242, 45%, 22%) | Active nav bg, strong borders        |
| Base-700 | `#1A1640` | hsl(244, 47%, 17%) | Card backgrounds, secondary surfaces |
| Base-800 | `#130F2E` | hsl(248, 50%, 12%) | Sidebar, elevated surfaces           |
| Base-900 | `#0D0920` | hsl(250, 55%, 8%)  | Primary dark surface                 |
| Base-950 | `#080412` | hsl(255, 58%, 5%)  | Outermost bg, page shell             |

### Primary Blue

Full 50-900 scale. The primary action color.

| Token    | Hex       | HSL                 | Usage                                         |
| -------- | --------- | ------------------- | --------------------------------------------- |
| Blue-50  | `#F0F3FF` | hsl(228, 100%, 97%) | Subtle tint backgrounds                       |
| Blue-100 | `#E0E6FF` | hsl(228, 100%, 94%) | Light mode info backgrounds                   |
| Blue-200 | `#99AAFF` | hsl(228, 100%, 81%) | Secondary emphasis, tints                     |
| Blue-300 | `#6688FF` | hsl(226, 100%, 70%) | Dark mode text emphasis, icon fills           |
| Blue-400 | `#3361FF` | hsl(226, 100%, 60%) | Hover state                                   |
| Blue-500 | `#0036FF` | hsl(226, 100%, 50%) | **PRIMARY** — CTAs, active links, focus rings |
| Blue-600 | `#0028CC` | hsl(228, 100%, 40%) | Pressed/active button                         |
| Blue-700 | `#001F99` | hsl(228, 100%, 30%) | Strong emphasis on light bg                   |
| Blue-800 | `#001566` | hsl(228, 100%, 20%) | Dark mode pressed                             |
| Blue-900 | `#000A33` | hsl(228, 100%, 10%) | Darkest tint                                  |

### Semantic — Go (success)

Full 50-900 scale. Maps to HeroUI `success`.

| Token  | Hex       | HSL                 | Usage                 |
| ------ | --------- | ------------------- | --------------------- |
| Go-50  | `#E8FDF4` | hsl(155, 82%, 95%)  | Lightest tint         |
| Go-100 | `#D0FAE9` | hsl(155, 82%, 90%)  | Light mode tint       |
| Go-200 | `#80F0C8` | hsl(158, 80%, 72%)  | Light emphasis        |
| Go-300 | `#33E5A6` | hsl(160, 75%, 55%)  | Medium emphasis       |
| Go-400 | `#00E591` | hsl(161, 100%, 45%) | Hover                 |
| Go-500 | `#00CC80` | hsl(161, 100%, 40%) | Primary Go badge      |
| Go-600 | `#009962` | hsl(161, 100%, 30%) | Dark bg badge, border |
| Go-700 | `#007A4E` | hsl(161, 100%, 24%) | Strong border         |
| Go-800 | `#00523A` | hsl(161, 100%, 16%) | Dark mode emphasis    |
| Go-900 | `#002E1F` | hsl(161, 100%, 9%)  | Darkest tint          |

### Semantic — No-Go / Warning (Amber, not Red)

Full 50-900 scale. Maps to HeroUI `warning`. No-Go is a decision outcome, not an error. Amber signals judgment, not system failure.

| Token    | Hex       | HSL                | Usage                 |
| -------- | --------- | ------------------ | --------------------- |
| NoGo-50  | `#FFFBEB` | hsl(43, 100%, 96%) | Lightest tint         |
| NoGo-100 | `#FEF3C7` | hsl(43, 96%, 90%)  | Light mode tint       |
| NoGo-200 | `#FDE68A` | hsl(43, 96%, 77%)  | Light emphasis        |
| NoGo-300 | `#FCD34D` | hsl(40, 96%, 65%)  | Medium emphasis       |
| NoGo-400 | `#FBB73A` | hsl(37, 96%, 60%)  | Hover                 |
| NoGo-500 | `#F59E0B` | hsl(37, 91%, 50%)  | Primary No-Go badge   |
| NoGo-600 | `#CC6200` | hsl(35, 100%, 40%) | Dark bg badge, border |
| NoGo-700 | `#A34E00` | hsl(33, 100%, 32%) | Strong border         |
| NoGo-800 | `#7A3A00` | hsl(30, 100%, 24%) | Dark mode emphasis    |
| NoGo-900 | `#522800` | hsl(28, 100%, 16%) | Darkest tint          |

### Semantic — Error (system errors only)

Full 50-900 scale. Maps to HeroUI `danger`. Used for form validation and API errors — never for decision outcomes.

| Token     | Hex       | HSL              | Usage                   |
| --------- | --------- | ---------------- | ----------------------- |
| Error-50  | `#FEF2F2` | hsl(0, 86%, 97%) | Lightest tint           |
| Error-100 | `#FEE2E2` | hsl(0, 93%, 94%) | Error background tint   |
| Error-200 | `#FECACA` | hsl(0, 96%, 89%) | Light emphasis          |
| Error-300 | `#FCA5A5` | hsl(0, 94%, 82%) | Medium emphasis         |
| Error-400 | `#F87171` | hsl(0, 91%, 71%) | Hover                   |
| Error-500 | `#EF4444` | hsl(0, 84%, 60%) | Primary error indicator |
| Error-600 | `#DC2626` | hsl(0, 72%, 51%) | Pressed/strong error    |
| Error-700 | `#B91C1C` | hsl(0, 74%, 42%) | Strong border           |
| Error-800 | `#991B1B` | hsl(0, 69%, 35%) | Dark emphasis           |
| Error-900 | `#7F1D1D` | hsl(0, 63%, 31%) | Darkest tint            |

### Neutrals (slate-based)

| Token     | Hex       | Usage                               |
| --------- | --------- | ----------------------------------- |
| Slate-900 | `#0F172A` | Body text (light mode)              |
| Slate-700 | `#334155` | Secondary text, icons               |
| Slate-500 | `#64748B` | Placeholder, disabled, muted labels |
| Slate-300 | `#CBD5E1` | Borders (light mode)                |
| Slate-100 | `#F1F5F9` | Card surface (light mode)           |
| Slate-50  | `#F8FAFC` | Page background (light mode)        |

### Glass system (dark mode only)

| Token               | Value                    | Usage                    |
| ------------------- | ------------------------ | ------------------------ |
| glass-4             | `rgba(255,255,255,0.04)` | Subtle card lift         |
| glass-8             | `rgba(255,255,255,0.08)` | Standard card bg         |
| glass-12            | `rgba(255,255,255,0.12)` | Hover state on glass     |
| glass-20            | `rgba(255,255,255,0.20)` | Active, strong highlight |
| glass-border        | `rgba(255,255,255,0.10)` | Card borders             |
| glass-border-strong | `rgba(255,255,255,0.18)` | Focused inputs, emphasis |

---

## HeroUI Semantic Color Mapping

The brand palette maps to HeroUI's semantic color system as follows. This mapping is configured in the HeroUI plugin (`hero.ts`).

| HeroUI slot  | Brand palette | DEFAULT                  | Foreground | Notes                              |
| ------------ | ------------- | ------------------------ | ---------- | ---------------------------------- |
| `primary`    | Blue          | `#0036FF` (Blue-500)     | `#FFFFFF`  | CTAs, active links, focus rings    |
| `secondary`  | Base          | `#4A4280` (Base-500)     | `#FFFFFF`  | Muted actions, secondary buttons   |
| `success`    | Go            | `#00CC80` (Go-500)       | `#000000`  | Go decisions, success states       |
| `warning`    | NoGo          | `#F59E0B` (NoGo-500)     | `#000000`  | No-Go decisions, caution           |
| `danger`     | Error         | `#EF4444` (Error-500)    | `#FFFFFF`  | System errors, destructive actions |
| `default`    | Base          | `#1A1640` (Base-700)     | `#FFFFFF`  | Default component surfaces         |
| `background` | —             | `#080412` (Base-950)     | `#FFFFFF`  | Page background (dark mode)        |
| `foreground` | —             | `#FFFFFF`                | —          | Primary text (dark mode)           |
| `content1`   | Base          | `#0D0920` (Base-900)     | `#FFFFFF`  | Primary content surface            |
| `content2`   | Base          | `#130F2E` (Base-800)     | `#FFFFFF`  | Secondary content surface          |
| `content3`   | Base          | `#1A1640` (Base-700)     | `#FFFFFF`  | Tertiary content surface           |
| `content4`   | Base          | `#231E54` (Base-600)     | `#FFFFFF`  | Quaternary content surface         |
| `divider`    | Glass         | `rgba(255,255,255,0.10)` | —          | Borders, separators                |
| `focus`      | Blue          | `#0036FF` (Blue-500)     | —          | Focus rings                        |

Each semantic color (primary, secondary, success, warning, danger) is configured with the full 50-900 shade range from the brand palette, allowing HeroUI components to use all variants (e.g. `bg-primary-100`, `text-muted-300`).

Glass tokens (`glass-4`, `glass-8`, etc.) have no HeroUI equivalent and are exposed as custom CSS properties / Tailwind utilities alongside the HeroUI theme.

---

## Typography

### Font stack

| Context                | Family     | Fallback                                      |
| ---------------------- | ---------- | --------------------------------------------- |
| Display / Marketing H1 | Aeonik Pro | Inter, -apple-system, sans-serif              |
| UI / Body              | Inter      | -apple-system, BlinkMacSystemFont, sans-serif |
| Code / Artifact data   | Geist Mono | JetBrains Mono, monospace                     |

**Aeonik Pro** is used exclusively for the marketing site's hero and section headings. Never in the dashboard. Never below 36px.

**Geist Mono** for code/artifact display — creates a "certified document" quality on immutable run records.

### Type scale

| Style      | Family     | Weight | Size | Line height | Letter spacing | Usage                    |
| ---------- | ---------- | ------ | ---- | ----------- | -------------- | ------------------------ |
| Display    | Aeonik Pro | 500    | 74px | 84px        | -0.03em        | Hero only                |
| H1 (mktg)  | Aeonik Pro | 500    | 48px | 52px        | -0.025em       | Marketing headings       |
| H2         | Inter      | 600    | 36px | 44px        | -0.020em       | Section headings         |
| H3         | Inter      | 600    | 30px | 38px        | -0.015em       | Sub-sections             |
| H4         | Inter      | 600    | 24px | 32px        | -0.010em       | Card headings            |
| H5         | Inter      | 500    | 20px | 28px        | 0              | Labels                   |
| H6         | Inter      | 500    | 18px | 26px        | 0              | Small labels             |
| Body Large | Inter      | 400    | 18px | 28px        | —              | Marketing prose          |
| Body Base  | Inter      | 400    | 16px | 24px        | —              | Default UI text          |
| Body Small | Inter      | 400    | 14px | 22px        | —              | Table data, metadata     |
| Body Micro | Inter      | 400    | 12px | 18px        | —              | Timestamps, badge labels |
| Mono Base  | Geist Mono | 400    | 14px | 22px        | —              | Artifact values, run IDs |
| Mono Label | Geist Mono | 500    | 12px | 18px        | —              | Inline code chips        |

---

## Visual System

### Glass card recipes

**Standard card** (dashboard surfaces):

```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
backdrop-filter: blur(12px);
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.1) inset,
  0 0 0 1px rgba(255, 255, 255, 0.06) inset,
  0 4px 24px rgba(0, 0, 0, 0.4);
```

**Elevated card** (modals, command palette, decision review):

```css
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.16);
border-radius: 20px;
backdrop-filter: blur(20px);
box-shadow:
  0 1px 0 0 rgba(255, 255, 255, 0.18) inset,
  0 0 0 1px rgba(255, 255, 255, 0.08) inset,
  0 8px 40px rgba(0, 0, 0, 0.5);
```

The inset `0 1px 0` white highlight simulates a top-edge light source. Never omit it.

Glass is **not used** on table rows, error states, or dense data surfaces. Use solid `Base-800` / `Base-700` for those.

### Navigation (scroll transform)

```css
/* Default */
nav {
  background: transparent;
  border-bottom: 1px solid transparent;
}

/* Scrolled — trigger at 40px scroll depth */
nav.scrolled {
  background: rgba(13, 9, 32, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  transition: all 450ms cubic-bezier(0.6, 0.6, 0, 1);
}
```

### Shadow scale

| Level    | Value                                                              | Usage                             |
| -------- | ------------------------------------------------------------------ | --------------------------------- |
| shadow-1 | `0 1px 3px rgba(0,0,0,.30), 0 1px 0 rgba(255,255,255,.06) inset`   | Cards at rest                     |
| shadow-2 | `0 4px 16px rgba(0,0,0,.40), 0 1px 0 rgba(255,255,255,.10) inset`  | Hover lift                        |
| shadow-3 | `0 8px 40px rgba(0,0,0,.50), 0 1px 0 rgba(255,255,255,.14) inset`  | Modals                            |
| shadow-4 | `0 16px 64px rgba(0,0,0,.60), 0 1px 0 rgba(255,255,255,.18) inset` | Command palette, decision overlay |

### Border radius

| Token       | Value  | Usage                     |
| ----------- | ------ | ------------------------- |
| radius-sm   | 6px    | Badges, chips             |
| radius-md   | 10px   | Inputs, buttons           |
| radius-lg   | 16px   | Standard cards            |
| radius-xl   | 20px   | Modals, elevated cards    |
| radius-2xl  | 28px   | Marketing hero cards only |
| radius-full | 9999px | Status pills, avatar      |

### Animation

| Token               | Value                               | Usage                             |
| ------------------- | ----------------------------------- | --------------------------------- |
| ease-premium        | `cubic-bezier(0.6, 0.6, 0, 1)`      | Standard — fast in, smooth out    |
| ease-spring         | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge appearance, scale pops      |
| ease-out            | `cubic-bezier(0, 0, 0.2, 1)`        | Exits, fades                      |
| duration-fast       | 150ms                               | Opacity/color hover shifts        |
| duration-standard   | 300ms                               | Card hover, dropdown              |
| duration-deliberate | 450ms                               | Panel transitions, nav transform  |
| duration-slow       | 600ms                               | Page transitions, feature reveals |

**Animate:** state transitions, hover lifts, panel entrances, nav scroll transform, badge appearance.

**Do NOT animate:** table row data, error state appearance, the immutability lock (it is a fact, not a transition).

---

## Status Badge System

```css
/* Go */
.badge-go {
  background: rgba(0, 204, 128, 0.15);
  color: #00cc80;
  border: 1px solid rgba(0, 204, 128, 0.25);
}

/* No-Go */
.badge-nogo {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

/* In Progress */
.badge-in-progress {
  background: rgba(0, 54, 255, 0.15);
  color: #6688ff;
  border: 1px solid rgba(0, 54, 255, 0.25);
}

/* Pending */
.badge-pending {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Skipped */
.badge-skipped {
  background: rgba(100, 116, 139, 0.15);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.25);
}
```

All badges: `border-radius: 9999px`, `padding: 2px 10px`, `font: Inter 500 / 12px`.

---

## CSS Token Set

```css
:root {
  /* Base (blue-violet undertone) */
  --color-base-50: #f0eff5;
  --color-base-100: #dedceb;
  --color-base-200: #b9b5d4;
  --color-base-300: #908abc;
  --color-base-400: #6b62a3;
  --color-base-500: #4a4280;
  --color-base-600: #231e54;
  --color-base-700: #1a1640;
  --color-base-800: #130f2e;
  --color-base-900: #0d0920;
  --color-base-950: #080412;

  /* Blue (primary) */
  --color-blue-50: #f0f3ff;
  --color-blue-100: #e0e6ff;
  --color-blue-200: #99aaff;
  --color-blue-300: #6688ff;
  --color-blue-400: #3361ff;
  --color-blue-500: #0036ff;
  --color-blue-600: #0028cc;
  --color-blue-700: #001f99;
  --color-blue-800: #001566;
  --color-blue-900: #000a33;

  /* Go (success) */
  --color-go-50: #e8fdf4;
  --color-go-100: #d0fae9;
  --color-go-200: #80f0c8;
  --color-go-300: #33e5a6;
  --color-go-400: #00e591;
  --color-go-500: #00cc80;
  --color-go-600: #009962;
  --color-go-700: #007a4e;
  --color-go-800: #00523a;
  --color-go-900: #002e1f;

  /* NoGo (warning) */
  --color-nogo-50: #fffbeb;
  --color-nogo-100: #fef3c7;
  --color-nogo-200: #fde68a;
  --color-nogo-300: #fcd34d;
  --color-nogo-400: #fbb73a;
  --color-nogo-500: #f59e0b;
  --color-nogo-600: #cc6200;
  --color-nogo-700: #a34e00;
  --color-nogo-800: #7a3a00;
  --color-nogo-900: #522800;

  /* Error (danger) */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;

  /* Neutrals */
  --color-slate-900: #0f172a;
  --color-slate-700: #334155;
  --color-slate-500: #64748b;
  --color-slate-300: #cbd5e1;
  --color-slate-100: #f1f5f9;
  --color-slate-50: #f8fafc;

  /* Glass (dark mode only — no HeroUI equivalent, custom utilities) */
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

  /* Spacing (4px grid) */
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

## Illustrations & Imagery

- **No illustrations.** The product UI is the visual language.
- **No photography** in the dashboard.
- Marketing site: if photography is ever used, dark workspace shots only — tight crop, desaturated toward brand palette.
- If illustration is ever needed (404, empty state): flat, geometric, monochromatic or two-color from brand palette. No character illustrations.

---

## Iconography

- Linear style: 2px stroke weight, rounded caps, 24x24 grid
- Not filled (exception: status indicators use filled circles/badges — fill communicates state, not action)
- No illustrated icons, gradient icons, or isometric icons

---

## Data Visualization

- Use semantic colors directly: Go green, No-Go amber, Pending slate
- Minimal chart chrome
- Prefer structured tables over charts where both would work
- The audience reads data in tables, not pie charts

---

## Design reference

Visual direction inspired by [todesktop.com](https://www.todesktop.com/) — dark-dominant, glassmorphism with inset lighting, premium micro-interactions, sophisticated color restraint.
