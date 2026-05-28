# Logo Design Patterns

## The Strike Mark — NoHotfix (canonical reference)

### Base geometry (24x24 canvas)

- Dominant diagonal: (18,4) → (6,18), stroke-width 3, round caps
- Upper bar: (3,13) → (10,13), stroke-width 2.5, round caps
- Lower bar: (3,18) → (8,18), stroke-width 2.5, round caps
- Stroke weight ratio: dominant = 1.2× bars (3 vs 2.5) — maintains hierarchy at all sizes

### Scaling table

| Target | Factor | Diagonal SW | Bar SW |
| ------ | ------ | ----------- | ------ |
| 16px   | 0.6667 | 2           | —      |
| 24px   | 1.0    | 3           | 2.5    |
| 32px   | 1.3333 | 4           | 3.5    |
| 48px   | 2.0    | 6           | 5      |
| 64px   | 2.6667 | 8           | 6.5    |

### Lockup geometry (240×48 canvas, mark at 28px)

- Mark scale factor: 28/24 = 1.1667
- Mark transform: `translate(10, 10) scale(1.1667)` — 10px left margin, 10px top margin
- Mark occupies x: 10 → 38 (28px wide)
- Gap: 10px
- Wordmark x: 48px
- Wordmark baseline y: 30px (62.5% of 48px canvas height — optical center for 18px Inter)

### Brand colors

- Primary Blue: #0036FF
- Dark bg (Base-900): #0D0920
- Deepest bg (Base-950): #080412
- White: #FFFFFF
- Light mode text (Slate-900): #0F172A

### Favicon progressive disclosure

- 16x16: diagonal stroke only (blue on white)
- 32x32: diagonal + upper horizontal bar (drop lower bar)
- 48x48+: all three strokes

### Wordmark spec

- "Release" Inter 400 + "Hawk" Inter 700
- Both 18px, letter-spacing +0.01em (= 0.18px absolute in SVG)
- No color split — weight contrast only
- Same color as mark stroke in each variant
