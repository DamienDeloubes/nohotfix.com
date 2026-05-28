# NoHotfix — Visual Identity Concepts

**Generated:** 2026-05-27
**Status:** Concept exploration — not yet selected
**Designer:** SaaS Logo Designer agent

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Brand-500 | `#1A3FFF` | Primary — authority, enforcement, the product's voice |
| Brand-400 | `#4D6AFF` | Hover state |
| Brand-300 | `#7F97FF` | Dark mode text/mark emphasis |
| Ember-500 | `#FF6B2B` | Accent — "the hot in hotfix." The energy being prevented. |
| Ember-400 | `#FF8C57` | Dark-bg ember accent |
| Ember-300 | `#FFB08A` | Dark mode tint |
| Ink-950 | `#090B14` | Darkest background |
| Ink-900 | `#0E1221` | Primary dark surface |
| Ink-800 | `#161C32` | Card surfaces |
| Ink-700 | `#1E2644` | Elevated elements |
| Ink-600 | `#2C3760` | Borders, dividers, "Hotfix" text on light |
| Ink-400 | `#5E6E9E` | Muted text, patch rect stroke |
| Ink-200 | `#A8B4CC` | Secondary text on dark |
| Ink-50 | `#EEF0F5` | Lightest tint |

---

## Concept Files

### Concept 2: The Negation Mark (RECOMMENDED)
- `concept-2-negation-mark-24.svg` — mark only, 24px base
- `concept-2-negation-mark-48.svg` — mark only, 48px
- `concept-2-favicon-16.svg` — favicon 16px
- `concept-2-favicon-32.svg` — favicon 32px
- `concept-2-lockup-light.svg` — horizontal lockup, light bg
- `concept-2-lockup-dark.svg` — horizontal lockup, dark bg
- `concept-2-monochrome.svg` — single-color, embossing-ready

### Concept 3: The Seal
- `concept-3-seal-mark-48.svg` — mark only, 48px
- `concept-3-seal-favicon-16.svg` — favicon 16px
- `concept-3-seal-lockup-light.svg` — horizontal lockup, light bg
- `concept-3-seal-lockup-dark.svg` — horizontal lockup, dark bg
- `concept-3-seal-monochrome.svg` — single-color, embossing-ready

### Concept 4: Two-Weight Wordmark
- `concept-4-wordmark-light.svg` — wordmark only, light bg
- `concept-4-wordmark-dark.svg` — wordmark only, dark bg

---

## Typography Spec

| Role | Family | Weight | Size | Style |
|---|---|---|---|---|
| "No" in mark wordmark | Inter Variable | 800 | 18–22px | Italic |
| "hotfix" in mark wordmark | Inter Variable | 300 | 18–22px | Regular or Italic |
| Marketing display | Geist | 700 | 48px+ | Regular |
| UI / Dashboard | Inter | 400–600 | 12–16px | Regular |
| Code surfaces | Geist Mono | 400–500 | 12–14px | Regular |

---

## Recommendation

**Concept 2 (Negation Mark)** is the strongest direction.

Rationale:
1. The patch-rectangle + diagonal-bar combination encodes the brand name mechanically in the mark geometry
2. The wordmark strikethrough on "hotfix" works independently as a pure typographic identity (no mark needed at large sizes)
3. Two-tone hierarchy (Ink-400 rectangle = the old way; Brand-500 bar = the product's authority) is immediately decodable
4. Ember-500 on "No" in the lockup makes the "No" prefix carry visual weight matching its semantic weight
5. Scales cleanly: 16px favicon shows diagonal-dominant, 32px adds rectangle, 48px+ full mark
6. Monochrome version is production-ready for embossing and single-ink print
7. Enterprise buyers in fintech/healthtech will read this as "the thing that prevents the bad outcome" without the mark needing a caption
