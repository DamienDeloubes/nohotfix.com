---
name: project-nohotfix-website-vision
description: NoHotfix.com website design vision — dark-dominant orange/fire brand, key decisions on light/dark, gradient, flame animation, and glass restraint. Version 1.0, 2026-05-28.
metadata:
  type: project
---

The nohotfix.com marketing website design vision (v1.0, 2026-05-28) is documented in `docs/design/website-vision.md`. Key decisions locked:

**Light vs. dark**: Dark-dominant, matching the dashboard. Orange-on-`#0D0920` achieves 7.2:1 contrast. Blue era is fully retired — no residual blue anywhere.

**Page gradient**: Dark-constant descent, NOT the old light-to-dark arc. `#080412` at top (hero), breathes through `#0D0920 → #130F2E → #1A1640` in mid-sections, returns to `#080412` at close. Single CSS gradient on a fixed div.

**Fire gradient (`#FF8D28 → #FF0000`)**: Logo only + one low-opacity (≤8%) hero decorative presence behind the headline. NOT on buttons, badges, or section backgrounds. Final CTA uses flat Orange-500 radial glow, not fire gradient.

**Orange-500 (`#F97316`) application**: Buttons, active links, focus rings, section-label pills, card top-edge accents (QA Teams card), comparison table column highlight, stepper icon fills. Orange is punctuation — at most two orange elements visible simultaneously per viewport.

**Hero flame animation**: Single one-time kindling on page load — opacity/gradient-reveal from flat color to full gradient over 600ms `ease-out`, fires once per session. No looping, no hover trigger, no flickering. CSS `@keyframes` on gradient opacity. Nav chrome: static, no animation.

**Hero headline gradient**: `linear-gradient(135deg, #FFFFFF 0%, #FED7AA 60%, #F97316 100%)` — white warmingthrough orange-200 to orange-500. Same gradient bookends hero and final CTA.

**Glass recipe**: Blur pulled back to 8–12px (reduced from prior 12–20px). Reduced opacity. Inset top-edge highlight (`0 1px 0 rgba(255,255,255,x) inset`) retained — non-negotiable. Product preview outer glow: `rgba(249,115,22,0.08)` max, breathing between 0.06–0.10. No glass-on-glass layering.

**Why:** Founder brief was "clean, modern, slightly minimal. Orange." Dark dominant preserves brand identity; orange-on-dark is the brand's visual core. Restraint on glass and glow prevents the orange from reading as alarmist.

**How to apply:** Any future homepage or page design decisions should assume dark-constant background, orange-only accents, and the restrained glass system. Do not reintroduce blue in any form. Do not put the fire gradient on anything other than the logo glyph and the singular hero decorative moment.

See [[reference-nohotfix-brand]] for color tokens and full brand system.
