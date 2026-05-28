# SaaS Logo Designer — Agent Memory

## NoHotfix Brand (rebrand from NoHotfix, 2026-05-27)

Concept exploration complete. Recommended: Concept 2 (Negation Mark). No direction selected yet by user.
See: `nohotfix-brand.md` for full palette, concept rationale, and file locations.

## NoHotfix Brand (024-archive-spec branch context, legacy)

Brand assets live at: `/Users/damien/Documents/Git/Damiendeloubes/nohotfix.com/brand/logos/`
See: `patterns.md` for scaling methodology and lockup geometry used for The Strike mark.

## Key Patterns

- Stroke-based marks: always `stroke-linecap="round" stroke-linejoin="round"`, never `fill`
- Favicon progressive disclosure: 16px = dominant element only, 32px = dominant + secondary, 48px+ = full mark
- Lockup formula: mark at target height H, top offset = (canvas_height - H) / 2, gap 10px, wordmark x = left_offset + H + gap
- Wordmark baseline: optical center for mixed-weight text sits at ~62% of canvas height (y=30 on 48px canvas)
- Scale factor for coords and stroke-width is the same ratio: new_size / base_canvas_size
- SVG `<g transform="translate(x,y) scale(f)">` is cleaner than recalculating all coords for lockup marks
- Inter font stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- letter-spacing in SVG: use absolute px value matching `font-size × 0.01em` (e.g. 18px font → 0.18px spacing)
