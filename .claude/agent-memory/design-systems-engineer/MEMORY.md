# Design Systems Engineer — Memory Index

## Source of truth

Brand/design-system values are canonical in the repo, NOT here. Read them fresh each time:

- Spec: `docs/design/brand-identity.md` (esp. "CSS Token Set", "HeroUI Semantic Color Mapping",
  "Type scale", "Glass card recipes", "Shadow scale", "Border radius", "Status Badge System").
- Shared token package: `packages/design-tokens/src/tokens.css` (`:root` + `.dark`).
- App tokens: `apps/app/src/app.css` (`@theme` aliases), `apps/app/src/main.tsx` (imports order).
- Web tokens: `apps/web/tailwind.config.ts`, `apps/web/src/app/globals.css`.
- Logo component: `apps/web/src/components/NoHotfixLogo.tsx`.

Never copy brand values into memory — they go stale. Record only *where* things live and *how* they're wired.

## Topic files

- [tokens.md](tokens.md) — token ownership model, wiring pattern, glass/solid rules, retired tokens, common bug patterns.
- [feedback_storybook_pnpm.md](feedback_storybook_pnpm.md) — pnpm hoisting fix: always add `"storybook"` as direct dep alongside `@storybook/react-vite`.

## apps/web wiring notes (v5 rebrand)

`packages/design-tokens/tokens.css` is imported in `apps/web/src/app/layout.tsx` via
`import '@nohotfix/design-tokens/tokens.css'` (Next.js allows global CSS import in root layout).
The pre-paint dark-mode script is an inline `<script>` in the `<head>` (not a separate file like apps/app).
Font wiring: `DM_Sans`, `Inter`, `Geist_Mono` loaded via `next/font/google`, variables `--font-display`, `--font-body`, `--font-mono`.

**Pre-existing build blocker:** `apps/web` had a failing build (`pnpm --filter web build`) before v5 work,
caused by TS2742 on unrelated files (`(legal)/privacy/page.tsx`, etc.) — @types/react version mismatch.
Not introduced by design-systems work. Confirmed clean: same error set before and after rebrand changes.

## apps/storybook (Storybook 8.x)

Path: `apps/storybook/`. Runs on port 6006. Command: `pnpm --filter storybook dev`.
Stack: Storybook 8.x + `@storybook/react-vite` + React 19 + Tailwind v4 + `@nohotfix/design-tokens`.
CSS entry: `src/styles.css` — imports tailwindcss, tokens.css, all three fontsource packages.
Theme toolbar: global `theme` with light/dark values; decorator toggles `dark` class on `<html>` and story wrapper.
Stories: Foundations (Colors, Typography, Spacing, Radius, Elevation, Motion) + Components (Button, Card, Badge, Input) + Introduction.mdx.
