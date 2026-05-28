---
name: token-wiring-patterns
description: How @nohotfix/design-tokens, app.css @theme, and component var() references interconnect in apps/app
metadata:
  type: feedback
---

## Token ownership model (v5 rebrand)

`packages/design-tokens/src/tokens.css` is the single source for all brand values.
- Imported first in `apps/app/src/main.tsx` via `import '@nohotfix/design-tokens/tokens.css'`.
- Sets `:root` (theme-invariant + LIGHT theme defaults) and `.dark` (dark overrides).
- Canonical semantic vars: `--bg-page`, `--bg-card`, `--bg-card-elevated`, `--bg-active`,
  `--text-primary`, `--text-secondary`, `--text-muted`, `--border-default`, `--border-focus`,
  `--color-primary`, `--color-primary-hover`, `--shadow-card`, `--glass-*`, `--nav-bg`, etc.

`apps/app/src/app.css` `@theme` block:
- Defines Tailwind utility color scales (orange, go, nogo, error, slate).
- Aliases app-local semantic names to tokens.css vars so Tailwind utilities work:
  `--color-surface-page: var(--bg-page)`, `--color-surface-border: var(--border-default)`, etc.
- Does NOT duplicate dark overrides — tokens.css owns `.dark` entirely.
- `body` uses `var(--bg-page)` and `var(--text-primary)` (NOT `--surface-page` or `--color-base-900`).

## Bug pattern to watch for

Old code used `--surface-page`, `--surface-card`, `--surface-border`, `--surface-active`
(set only in `.dark`, never in `:root`) while `@theme` defined `--color-surface-*`.
These two naming conventions were disconnected — components referencing the raw `--surface-*`
vars had no light-mode values. Fix: migrate components to use tokens.css canonical names
(`--bg-page`, `--bg-card`, `--bg-active`, `--border-default`) directly.

## Theme default

`ThemeProvider.tsx` `getSystemTheme()` must return `'light'` as fallback (not `'dark'`).
`theme-init.js` already follows OS preference correctly with no-class = light.

## Glass vs solid

Glass (`--glass-*`, `backdrop-filter`) is for NAV and OVERLAYS only.
Cards use solid surfaces: `--bg-card` / `--bg-card-elevated`. Never `backdrop-filter` on cards.

## Retired tokens (v5)

- `--color-base-*` (blue-violet scale) — retired, remove from all files
- `--color-blue-*` (primary blue scale) — retired, replace with `--color-orange-*` / `--color-primary`
- `#0036ff`, `#0d0920`, `bg-blue-500`, `text-base-900` — banned; grep before closing any task
