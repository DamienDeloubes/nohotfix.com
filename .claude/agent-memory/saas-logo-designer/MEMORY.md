# SaaS Logo Designer — Agent Memory

## NoHotfix Brand

Canonical brand spec: `docs/design/brand-identity.md`. Tagline: **"Ship it once."**

**Logo direction IS FINALIZED (2026-05-28).** Both prior explorations are superseded:
- "Checkpoint" checkmark concept → RETIRED
- "Negation Mark" (`#1A3FFF`) concept → RETIRED

**Settled direction: fire-in-the-"o" wordmark.**
The lowercase "o" in "Hotfix" is replaced by a minimal fire glyph with gradient
`#FF8D28` (bottom/warm) → `#FF0000` (top/hot). "No" and "Hotfix" are set in Inter 700
(both the same weight — "No" is a statement, not a qualifier). No separate icon mark.
Favicon: fire glyph alone. Single-color fallback: `#E05C00`.
Primary brand color: orange `#F97316`. Blue `#0036FF` fully retired.

Full logo spec is in `docs/design/brand-identity.md` under "The Fire-in-the-O Wordmark".
`nohotfix-brand.md` is historical context only — do not use its palette or concepts.

## Canonical Flame Glyph (FINAL — 2026-05-28)

Path (20×24 local canvas):
`M10,24 C2,24 0,18 0,13.5 C0,8 5,3 11,0.5 C16,2 20,8 20,13.5 C20,19 16,24 10,24Z`

Design rationale:
- Segment 1 (left base): `C2,24 0,18 0,13.5` — wide rounded bottom-left
- Segment 2 (left→tip): `C0,8 5,3 11,0.5` — concave left side (control x=0 then x=5), tip at x=11 (slight rightward lean)
- Segment 3 (tip→right): `C16,2 20,8 20,13.5` — fully convex right side (dominant mass)
- Segment 4 (right base): `C20,19 16,24 10,24` — wide rounded bottom-right

Use in wordmark: `<g transform="translate(68, 12)">` on a 240×48 canvas at Inter 700 32px.
- "NoH" at x=4 y=36; fire glyph at translate(68,12); "tfix" at x=90 y=36

**Asset files** (recreated 2026-05-28 in `brand/logos/`):
- `00-flame-glyph-ref.svg` — reference glyph, gradient fill, 20×24
- `01-wordmark-dark-bg.svg` — white letterforms, gradient flame
- `02-wordmark-light-bg.svg` — #0D0920 letterforms, gradient flame
- `03-wordmark-mono-dark.svg` — white letterforms, flat #E05C00 flame
- `04-wordmark-mono-light.svg` — #0D0920 letterforms, flat #E05C00 flame
- `05-favicon-32.svg` — flame glyph only, 32×32
- `06-favicon-16.svg` — flame glyph only, 16×16

**React component**: `apps/web/src/components/NoHotfixLogo.tsx`
Props: `variant` ("dark"|"light"), `height` (px, default 24), `id` (for unique gradient IDs).
Used in Navigation (variant="dark" height=24 id="nav") and Footer (variant="light" height=20 id="footer").

**Gradient IDs**: always namespace by context to avoid SVG defs conflicts when multiple logos inline.

## Key Patterns

- Stroke-based marks: always `stroke-linecap="round" stroke-linejoin="round"`, never `fill`
- Favicon progressive disclosure: 16px = dominant element only, 32px = dominant + secondary, 48px+ = full mark
- Fire-in-o wordmark split: text must be split into two `<text>` elements with the flame `<path>` between them — never use a single text run with a glyph substitution
- Wordmark text x-offsets at Inter 700 32px: "NoH" starts at x=4, approx width=64px → fire at x=68; "tfix" starts at x=90 (flame width 20px + 2px kern gap)
- Wordmark baseline: y=36 on 48px tall canvas (≈75% height) for Inter 700 32px
- Scale factor for coords and stroke-width is the same ratio: new_size / base_canvas_size
- SVG `<g transform="translate(x,y) scale(f)">` is cleaner than recalculating all coords for lockup marks
- Inter font stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- letter-spacing in SVG: use absolute px value matching `font-size × 0.01em` (e.g. 32px font → 0.32px spacing)
