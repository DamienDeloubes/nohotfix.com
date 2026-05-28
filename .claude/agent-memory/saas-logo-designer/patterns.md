# Logo Design Patterns

> NoHotfix's current mark/wordmark direction lives in `docs/design/brand-identity.md`
> (canonical). The logo is **not finalized** — confirm with the user before producing
> assets. The patterns below are reusable methodology for geometric stroke marks,
> independent of any specific mark.

## Reusable methodology (stroke-based marks)

### Scaling

- Stroke weight and coordinates scale by the same ratio: `factor = target_size / base_canvas_size`
- Keep a fixed stroke-weight ratio between dominant and secondary strokes (e.g. ~1.2×) so hierarchy holds at all sizes

| Target | Factor (24px base) |
| ------ | ------------------ |
| 16px   | 0.6667             |
| 24px   | 1.0                |
| 32px   | 1.3333             |
| 48px   | 2.0                |
| 64px   | 2.6667             |

### Lockup geometry (mark + wordmark)

- Mark at target height H, top offset = (canvas_height − H) / 2, gap 10px, wordmark x = left_offset + H + gap
- Wordmark baseline ≈ 62% of canvas height (optical center for mixed-weight Inter)
- Prefer `<g transform="translate(x,y) scale(f)">` over recalculating all coords

### Favicon progressive disclosure

- 16px: dominant element only
- 32px: dominant + primary secondary element
- 48px+: full mark

### SVG conventions

- Stroke-based marks: `stroke-linecap="round" stroke-linejoin="round"`, never `fill`
- Inter stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- letter-spacing in SVG: absolute px = `font-size × 0.01em` (18px → 0.18px)

## Brand colors (verify against docs/design/brand-identity.md)

- Primary Blue `#0036FF` · Dark bg `#0D0920` · Deepest bg `#080412` · White `#FFFFFF` · Light-mode text `#0F172A`
