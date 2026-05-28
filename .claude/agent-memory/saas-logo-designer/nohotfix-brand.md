---
name: nohotfix-brand
description: NoHotfix logo/visual exploration — palette, concept directions, recommended mark
metadata:
  type: project
---

## NoHotfix Brand Identity (logo/visual exploration)

**Status:** Concepts generated, no direction selected yet — confirm with the user.

> **Conflict note:** This exploration (palette `#1A3FFF`, Geist display, "Negation Mark")
> differs from the canonical `docs/design/brand-identity.md` (`#0036FF`, Aeonik display,
> "Checkpoint" mark). The logo/palette direction is unresolved; the user must pick.
> Concept SVG assets were removed — nothing to load from disk.

### Recommended direction: Concept 2 — The Negation Mark

Two-element mark: rounded rectangle ("the patch" in Ink-400) + diagonal bar crossing it (Brand-500). The rectangle represents the hotfix workaround being applied; the bar is the product's enforcement crossing it out.

Wordmark: "No" Inter 800 italic Ember-500 + "hotfix" Inter 300 Ink-600 + Brand-500 strikethrough over "hotfix" text.

**Favicon progressive disclosure:**

- 16px: diagonal bar dominant, rectangle as thin support
- 32px: both elements clearly present
- 48px+: full mark with correct weight ratios

### Palette

| Token     | Hex       | Role                                      |
| --------- | --------- | ----------------------------------------- |
| Brand-500 | `#1A3FFF` | Primary — enforcement, product authority  |
| Brand-400 | `#4D6AFF` | Hover                                     |
| Brand-300 | `#7F97FF` | Dark-mode mark/text                       |
| Ember-500 | `#FF6B2B` | Accent on "No" — the heat being prevented |
| Ember-400 | `#FF8C57` | Dark-bg ember                             |
| Ink-950   | `#090B14` | Darkest bg                                |
| Ink-900   | `#0E1221` | Primary dark surface                      |
| Ink-600   | `#2C3760` | "Hotfix" text on light / borders          |
| Ink-400   | `#5E6E9E` | Patch rect stroke / muted                 |
| Ink-200   | `#A8B4CC` | Secondary text on dark                    |

**Ember rationale:** The product name contains "hot" — the accent color literalizes the heat being prevented without alarm-red connotations. Orange sits well clear of PagerDuty/Sentry/Datadog territory.

### Concept 3 — The Seal (alternative)

Filled octagon (Brand-500) + horizontal white bar cut in negative space. Strongest monochrome/embossing candidate. Institutional, compliance-adjacent shape vocabulary. Stop-sign proximity is a risk but also a feature (product blocks broken releases).

### Concept 4 — Two-Weight Wordmark (fallback/complement)

Pure type: "No" Inter 800 italic Ember-500 + "hotfix" Inter 300 italic Ink-600 + 1px Brand-500 baseline rule. No separate mark. Stripe-style approach. Use when mark isn't present (doc headers, long-form copy).

### Typography

- Wordmark "No": Inter Variable 800, italic
- Wordmark "hotfix": Inter Variable 300
- Marketing display: Geist 700 (this exploration proposes replacing Aeonik Pro)
- UI/Dashboard: Inter
- Code: Geist Mono

**Why Geist over Aeonik Pro for display:** Geist is more machine-precision than humanist. Matches engineer-respecting brand voice better than Aeonik's fashion-tech warmth.

See [[patterns]] for SVG scaling methodology.
