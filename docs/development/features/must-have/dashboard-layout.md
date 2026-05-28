# Feature: App Shell & Dashboard Layout

_Last updated: 2026-03-12_

## Overview

This feature establishes the styled application shell for the `apps/app` React SPA. It replaces the current unstyled layout (inline styles, basic `<ul>` sidebar) with a production-ready shell that follows the brand identity system defined in `docs/design/brand-identity.md`.

The layout uses a **top navigation bar** as the primary navigation surface, with an **optional contextual sidebar** for pages that need sub-navigation (e.g. Settings). This replaces the previous design of a persistent left sidebar for all primary navigation.

### Reference

- Layout reference: `docs/design/dashboard.png` — a dark-themed app with top navbar, contextual left sidebar, and main content area
- Brand tokens: `docs/design/brand-identity.md` — colors, typography, glass system, shadows, radii, animations

---

## What this feature covers

1. **Tailwind CSS setup** — wire up tailwindcss using version 4.2 and css variables.
1. **Hero UI** — Use HeroUI for reusable components
1. **App shell component** — the outer layout wrapper rendered by `__root.tsx`
1. **Top navigation bar** — primary navigation for the entire app
1. **Contextual sidebar** — secondary navigation rendered by specific route layouts (Settings, Playbook Editor)
1. **Content area** — the main scrollable region where page content renders
1. **Responsive foundations** — the layout should work on desktop screens (1024px+). Full mobile responsiveness is out of scope for v1 but the structure should not prevent it later.

---

## Layout structure

```
┌─────────────────────────────────────────────────────────┐
│  TopNav                                                 │
│  [Logo + Org] [Dashboard] [Runs] [Playbooks] [...]  [⚙ 👤]│
├────────────┬────────────────────────────────────────────┤
│  Sidebar   │  Content Area                              │
│  (optional)│                                            │
│            │  Page heading                              │
│  Group A   │                                            │
│   • Item   │  [page content rendered by child routes]   │
│   • Item   │                                            │
│            │                                            │
│  Group B   │                                            │
│   • Item   │                                            │
│   • Item   │                                            │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```

### TopNav (always visible)

A full-width fixed bar at the top of the viewport. Present on every authenticated page.

**Left zone:**

- Logo placeholder. "NoHotfix" wordmark is enough for now. Clicking navigates to `/:orgSlug` (dashboard).
- Organisation name, displayed next to the logo. For users in multiple orgs, this is a dropdown that opens the org switcher. For single-org users, it is static text.

**Center zone — primary navigation links:**

| Label        | Route                    | Visible to |
| ------------ | ------------------------ | ---------- |
| Dashboard    | `/:orgSlug`              | All roles  |
| Runs         | `/:orgSlug/runs`         | All roles  |
| Playbooks    | `/:orgSlug/playbooks`    | All roles  |
| Spec Library | `/:orgSlug/spec-library` | All roles  |
| History      | `/:orgSlug/history`      | All roles  |

Each nav link is paired with a Lordicon animated icon to its left. The icon plays its animation on hover (triggered via Lordicon's `hover` trigger). When not hovered, the icon rests in its static/idle frame. The active nav link's icon may use `Blue-500` coloring to match the active state.

The active link is visually highlighted (e.g. bolder text, underline, or background indicator). Active state is determined by matching the current route prefix.

**Right zone:**

- Settings gear icon (Lordicon, animated on hover) — navigates to `/:orgSlug/settings/general`
- User avatar (circle, initials-based if no profile image) with a dropdown menu:
  - User's name and email (non-interactive, display only)
  - "Account settings" — navigates to `/:orgSlug/settings/account`
  - "Sign out" — triggers logout

### Sidebar (contextual, optional)

Not all pages have a sidebar. The sidebar is rendered by specific route layout files that need sub-navigation. It sits below the top nav, left of the content area, and spans the full remaining viewport height.

**Pages with a sidebar:**

| Context                                             | Sidebar content                                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Settings (`/:orgSlug/settings/*`)                   | Grouped nav: **Organisation** (General, Members, Environments, Billing) and **Account** (Account settings)      |
| Playbook Editor (`/:orgSlug/playbooks/:playbookId`) | Section navigation list (scrollable list of playbook section names — already described in `playbook-editor.md`) |

**Pages without a sidebar:**

- Dashboard
- Runs list, Run detail, Start a run
- Playbook list, New playbook
- Spec Library, Spec detail, New spec, Edit spec
- History list, Run detail (audit view)

These pages render their content in the full width below the top nav (no sidebar column).

### Content area

The main region where child routes render their content. It scrolls independently of the top nav (which is fixed) and the sidebar (which is also fixed/sticky).

- Padding: consistent inner padding (e.g. `px-8 py-6` or similar, to be determined during implementation)
- Max width: content should have a reasonable max-width on very wide screens to maintain readability. Something like `max-w-7xl` centered, or full-width depending on the page. This can vary by page.

---

## Styling approach

### Existing Tailwind v4 + HeroUI setup

Tailwind v4 and HeroUI are already configured in the codebase:

- **`apps/app/vite.config.ts`** — `@tailwindcss/vite` plugin already registered
- **`apps/app/src/app.css`** — Tailwind v4 CSS-first config with `@import 'tailwindcss'`, `@import '@heroui/styles'`, `@theme` directive containing brand tokens, and `:root` block for glass/shadows/animations
- **`apps/app/src/main.tsx`** — imports `app.css`, plus `@fontsource-variable/inter` and `@fontsource-variable/geist-mono` (self-hosted, no CDN)
- **Layout grid** — `app.css` already defines a grid-based layout (`.layout`, `.header`, `.subheader`, `.main`) and a settings variant (`.layout-settings`)

### What needs to change in `app.css`

The `@theme` block currently has the original partial color scales. It needs to be expanded with the full 50-900 scales from the updated `brand-identity.md` to ensure HeroUI components can use all shade variants (e.g. `bg-primary-100`, `text-success-300`).

**Colors to add to `@theme`:**

- **Base**: add `--color-base-50` through `--color-base-500` (lighter shades for HeroUI `default`/`secondary` slots)
- **Blue**: add `--color-blue-50`, `--color-blue-700`, `--color-blue-800`, `--color-blue-900`
- **Go**: add `--color-go-50`, `--color-go-200`, `--color-go-300`, `--color-go-700`, `--color-go-800`, `--color-go-900`
- **NoGo**: add `--color-nogo-50`, `--color-nogo-200`, `--color-nogo-300`, `--color-nogo-700`, `--color-nogo-800`, `--color-nogo-900`
- **Error**: add `--color-error-50`, `--color-error-200` through `--color-error-400`, `--color-error-600` through `--color-error-900`

All hex values are defined in the updated `docs/design/brand-identity.md` CSS Token Set.

**HeroUI theme mapping** also needs to be configured so HeroUI components use the brand colors. This is done via the HeroUI plugin configuration — either through a `hero.ts` plugin file referenced with `@plugin './hero.ts'` or by overriding HeroUI's CSS variables directly in `app.css`. The mapping is:

| HeroUI semantic slot  | Brand palette             | DEFAULT value         |
| --------------------- | ------------------------- | --------------------- |
| `primary`             | Blue                      | Blue-500 (`#0036FF`)  |
| `secondary`           | Base                      | Base-500 (`#4A4280`)  |
| `success`             | Go                        | Go-500 (`#00CC80`)    |
| `warning`             | NoGo                      | NoGo-500 (`#F59E0B`)  |
| `danger`              | Error                     | Error-500 (`#EF4444`) |
| `default`             | Base                      | Base-700 (`#1A1640`)  |
| `background`          | Base-950                  | `#080412`             |
| `foreground`          | White                     | `#FFFFFF`             |
| `content1`-`content4` | Base-900 through Base-600 | Layered dark surfaces |
| `focus`               | Blue-500                  | `#0036FF`             |

See `docs/design/brand-identity.md` > "HeroUI Semantic Color Mapping" for the full reference.

**Dependencies to install:**

- `@lordicon/react` — animated icon player
- `framer-motion` — required peer dependency of HeroUI (if not already installed)

### Visual treatment

The layout should follow the brand identity's dark-mode-first approach:

- **TopNav**: `Base-800` background or glass treatment with subtle bottom border (`glass-border`). Fixed at top with `z-50`.
- **Sidebar**: `Base-800` or `Base-900` background. Active item uses `Base-600` background. Group labels use `Slate-500` color, uppercase, `Body Micro` size.
- **Content area**: `Base-950` or `Base-900` background.
- **Active nav link**: highlighted with `Blue-500` text or a subtle indicator.
- **Hover states**: use `glass-12` or `Base-700` backgrounds with `duration-fast` transitions.
- **Borders**: `glass-border` (`rgba(255,255,255,0.10)`) between nav and content, between sidebar and content.

### Iconography — Lordicon animated icons

All navigation icons use [Lordicon](https://lordicon.com/) animated icons. Lordicon provides JSON-based Lottie animations that can be controlled programmatically.

**Behaviour:**

- Icons rest in their static/idle frame by default
- On hover, the icon plays its animation once (Lordicon `hover` trigger)
- Animation plays forward on mouse enter, and always finishes its animation. The animation will only be played again once the user leaves and hovers it again
- Icons use the brand color system: `white` or `rgba(255,255,255,0.60)` at rest, `Blue-500` for the active nav item

**Integration:**

- Install @lordicon/react
- Icons are loaded as JSON files (self-hosted, not CDN) to avoid external dependencies
- Each icon is a lightweight component that wraps the Lordicon player with the hover trigger

**Icon assignments (to be finalised during implementation — pick appropriate icons from the Lordicon library):**

| Location        | Icon concept          |
| --------------- | --------------------- |
| Dashboard       | Home / grid           |
| Runs            | Play / rocket         |
| Playbooks       | Clipboard / checklist |
| Spec Library    | Book / document stack |
| History         | Clock / archive       |
| Settings (gear) | Gear / cog            |
| Sign out        | Logout / door         |

**Sidebar icons (Settings):**

- Each sidebar nav item also has a Lordicon icon to its left, same hover-to-animate behaviour
- Sidebar icons are smaller (20px) compared to top nav icons (24px)

---

## Component structure

### New components to create

| Component         | Location                                             | Purpose                                                                                   |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `AppShell`        | `apps/app/src/components/layout/AppShell.tsx`        | Outer wrapper: renders TopNav + layout grid for sidebar/content                           |
| `TopNav`          | `apps/app/src/components/layout/TopNav.tsx`          | Fixed top navigation bar                                                                  |
| `NavLink`         | `apps/app/src/components/layout/NavLink.tsx`         | Reusable nav link with active state detection                                             |
| `UserMenu`        | `apps/app/src/components/layout/UserMenu.tsx`        | Avatar + dropdown (account settings, sign out)                                            |
| `OrgSwitcher`     | `apps/app/src/components/layout/OrgSwitcher.tsx`     | Org name display / dropdown for multi-org users                                           |
| `SettingsSidebar` | `apps/app/src/components/layout/SettingsSidebar.tsx` | Sidebar nav for the settings section                                                      |
| `LordiconIcon`    | `apps/app/src/components/ui/LordiconIcon.tsx`        | Wrapper around Lordicon player: accepts icon JSON, size, colors, and trigger mode (hover) |

### Components to modify

| Component                     | Change                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sidebar.tsx`                 | Remove — primary nav moves to `TopNav`. The current sidebar with inline styles is replaced entirely.                                        |
| `__root.tsx`                  | Remove the current inline-styled flex layout. Render `AppShell` which uses the existing CSS grid (`.layout`, `.header`, etc. in `app.css`). |
| `_authenticated/$orgSlug.tsx` | May need to pass org context to `TopNav` for the org switcher                                                                               |

### Route layouts that render a sidebar

Settings pages should get a layout route (e.g. `_authenticated/$orgSlug/settings.tsx`) that wraps `<Outlet />` with the `SettingsSidebar`. The `AppShell` component should accept an optional sidebar slot or use a composition pattern (e.g. React context or a slot prop) so route layouts can inject their sidebar content.

---

## Org switcher behaviour

- **Single org**: org name displayed as static text next to the logo. No dropdown.
- **Multiple orgs**: org name is clickable. Opens a dropdown listing all orgs the user belongs to. The current org is visually indicated (checkmark or highlighted). Clicking a different org navigates to `/:newOrgSlug` (dashboard of the selected org).
- The org list comes from the existing `useUserOrganisations` hook.

---

## User menu behaviour

- Clicking the avatar opens a dropdown menu anchored to the top-right.
- The dropdown shows:
  - User's display name (non-interactive)
  - User's email (non-interactive, muted text)
  - Divider
  - "Account settings" link → `/:orgSlug/settings/account`
  - "Sign out" button → triggers `logout()` from `lib/session.ts`
- The dropdown closes on click outside or on Escape key.
- No profile image upload in v1 — the avatar shows the user's initials (first letter of first name + first letter of last name) on a colored circle.
