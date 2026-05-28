# Quickstart: App Shell & Dashboard Layout

**Branch**: `030-dashboard-layout` | **Date**: 2026-03-12

## Prerequisites

- Node.js 20+
- pnpm 9+
- `apps/app/.env.local` with `VITE_API_URL` and `VITE_WEB_URL` set

## New Dependencies (to install)

```bash
# TailwindCSS v4 + Vite plugin
pnpm --filter app add -D tailwindcss @tailwindcss/vite

# HeroUI + Framer Motion
pnpm --filter app add @heroui/react framer-motion

# Lordicon React player
pnpm --filter app add @lordicon/react

# Self-hosted fonts
pnpm --filter app add @fontsource-variable/inter @fontsource-variable/geist-mono
```

Remove unused TailwindCSS v3:
```bash
pnpm --filter app remove tailwindcss  # v3.4.17, unconfigured
```

## Development

```bash
pnpm dev --filter app
```

Open `http://localhost:5173` — the app should render with the new dark-themed layout.

## Key Files to Create

| File | Purpose |
|------|---------|
| `apps/app/src/app.css` | TailwindCSS v4 entry + brand tokens + HeroUI plugin |
| `apps/app/src/components/layout/AppShell.tsx` | Outer wrapper: TopNav + sidebar slot + content |
| `apps/app/src/components/layout/TopNav.tsx` | Fixed top navigation bar |
| `apps/app/src/components/layout/NavLink.tsx` | Reusable nav link with active state |
| `apps/app/src/components/layout/UserMenu.tsx` | Avatar + dropdown |
| `apps/app/src/components/layout/OrgSwitcher.tsx` | Org name / dropdown |
| `apps/app/src/components/layout/SettingsSidebar.tsx` | Settings contextual sidebar |
| `apps/app/src/components/layout/SidebarContext.tsx` | Context for sidebar slot pattern |
| `apps/app/src/components/ui/LordiconIcon.tsx` | Lordicon player wrapper with hover trigger |
| `apps/app/src/assets/icons/*.json` | Self-hosted Lordicon icon JSON files |

## Key Files to Modify

| File | Change |
|------|--------|
| `apps/app/vite.config.ts` | Add `@tailwindcss/vite` plugin |
| `apps/app/src/main.tsx` | Import font packages + `app.css` |
| `apps/app/src/app.tsx` | Wrap with `HeroUIProvider` |
| `apps/app/src/routes/__root.tsx` | Replace inline layout with `AppShell` |
| `apps/app/src/components/layout/Sidebar.tsx` | Remove (replaced by TopNav + contextual sidebars) |
| `apps/app/src/routes/_authenticated/$orgSlug/settings/index.tsx` | Add `SettingsSidebar` via context |

## Verification

After implementation, verify:
1. `pnpm --filter app build` succeeds
2. `pnpm --filter app typecheck` passes
3. All 5 primary nav links navigate correctly
4. Settings sidebar renders with grouped items
5. User menu opens/closes, sign out works
6. Org switcher displays correctly (static for single org, dropdown for multi)
7. Nav background transitions on scroll past 40px
8. Dark theme colors match brand-identity.md tokens
