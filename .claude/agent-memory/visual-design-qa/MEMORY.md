# Visual Design QA — Memory Index

## Source of truth

The standard you audit against is canonical in the repo, NOT here. Read it fresh each review:

- Spec: `docs/design/brand-identity.md` (Color Palette, HeroUI Semantic Color Mapping, Type scale,
  Glass card recipes, Shadow scale, Border radius, Animation, Status Badge System, CSS Token Set).
- Voice/tone: `docs/marketing/positioning.md`, `docs/marketing/messaging.md`.
- Surfaces to review: `apps/web` (marketing), `apps/app` (dashboard), React Email templates.

Never copy brand values into memory — they go stale. Record only recurring *defect patterns* and *where* they appear.

## Recurring defect patterns (v5 rebrand audit)

- [recurring-defects.md](recurring-defects.md) — Scaffold route pages (apps/app/src/routes/) use dozens of hardcoded Tailwind-gray hex values and #2563eb blue (retired). Highest-probability location for off-brand color.
- [recurring-defects.md](recurring-defects.md) — ConfirmDialog is fully hardcoded with retired blue default button; no dark mode; off-token radius.
- [recurring-defects.md](recurring-defects.md) — AppButton ghost variant: text-white/60 on glass-4 background = near-invisible on light mode (WCAG fail).
- [recurring-defects.md](recurring-defects.md) — AppButton uses rounded-sm (6px) instead of spec --radius-md (10px) for buttons.
- [recurring-defects.md](recurring-defects.md) — Footer logo always renders light variant; invisible wordmark in dark mode.
- [recurring-defects.md](recurring-defects.md) — FinalCTA h2 uses font-bold (700) at H1 size; spec requires font-semibold (600).
- [recurring-defects.md](recurring-defects.md) — apps/app @theme omits --ease-page token; dashboard cannot use ease-page utilities.
- [recurring-defects.md](recurring-defects.md) — color-primary used as decorative eyebrow text in marketing; semantic mismatch (should be CTA/button color).
