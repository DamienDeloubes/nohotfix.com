# Implementation Plan: App Shell & Dashboard Layout

**Branch**: `030-dashboard-layout` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/030-dashboard-layout/spec.md`

## Summary

Replace the current unstyled inline-style layout in `apps/app` with a production-ready app shell following the NoHotfix brand identity. The implementation introduces TailwindCSS v4.2 (CSS-first config), HeroUI components, Lordicon animated icons, and self-hosted Inter/Geist Mono fonts. The layout switches from a persistent left sidebar to a top navigation bar with an optional contextual sidebar for Settings pages.

This is a **frontend-only** feature. No backend changes, no new API endpoints, no database migrations.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Vite 6
**Primary Dependencies**: TailwindCSS 4.2, @tailwindcss/vite, @heroui/react, framer-motion, @lordicon/react, @fontsource-variable/inter, @fontsource-variable/geist-mono
**Storage**: N/A — no database changes
**Testing**: Vitest (component tests), visual inspection against brand-identity.md
**Target Platform**: Desktop browsers (1024px+), Chrome 111+, Safari 16.4+, Firefox 128+
**Project Type**: React SPA (apps/app)
**Performance Goals**: LCP under 2.5s (constitution SLI), smooth 60fps hover animations
**Constraints**: Dark-mode-first, brand tokens from docs/design/brand-identity.md, self-hosted icons/fonts (no CDN)
**Scale/Scope**: 7 new components, 3 modified files, 1 deleted component, 1 new CSS entry file

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                                                                                               | Check |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| I   | **Bounded Context Integrity** — This feature is not assigned to a single bounded context; it is app-shell infrastructure in `apps/app/src/components/layout/`. No domain-specific logic. No cross-domain imports. Layout components import only from `@heroui/react`, `@lordicon/react`, TanStack Router, and existing app-level hooks. | PASS  |
| II  | **Code Quality & Simplicity** — Hexagonal Architecture maintained: layout components are pure UI with no domain logic, no HTTP calls, no direct repository access. Naming conventions respected (PascalCase.tsx for components, kebab-case for directories). No premature abstractions — each component serves one specific purpose.    | PASS  |
| III | **Testing Discipline** — No enforcement-critical paths in this feature (no state machines, artifact gates, or immutability checks). Component smoke tests verify rendering. Visual compliance verified manually against brand-identity.md.                                                                                              | PASS  |
| IV  | **UX Consistency** — Layout components live in `apps/app/src/components/layout/` per constitution. No domain UI created (no `packages/domains/*/ui/` changes). Query keys not applicable (no new data fetching — existing hooks already used). No polling changes.                                                                      | PASS  |
| V   | **Run Immutability** — N/A. Feature does not touch run data.                                                                                                                                                                                                                                                                            | PASS  |
| VI  | **Domain Errors** — N/A. No new error paths introduced. No backend changes. Existing `logout()` error handling in `lib/session.ts` is unchanged.                                                                                                                                                                                        | PASS  |
| VII | **Observability (OTel)** — N/A. No new service methods or API endpoints. No database queries.                                                                                                                                                                                                                                           | PASS  |

## Project Structure

### Documentation (this feature)

```text
specs/030-dashboard-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (no changes needed)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/app/
├── vite.config.ts                              # MODIFY: add @tailwindcss/vite plugin
├── src/
│   ├── main.tsx                                # MODIFY: import fonts + app.css
│   ├── app.tsx                                 # MODIFY: wrap with HeroUIProvider
│   ├── app.css                                 # CREATE: TailwindCSS v4 entry + brand tokens + HeroUI plugin
│   │
│   ├── assets/
│   │   └── icons/                              # CREATE: Lordicon JSON icon files (7 icons)
│   │       ├── home.json
│   │       ├── rocket.json
│   │       ├── clipboard.json
│   │       ├── book.json
│   │       ├── clock.json
│   │       ├── gear.json
│   │       └── logout.json
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                     # DELETE: replaced by TopNav + contextual sidebars
│   │   │   ├── AppShell.tsx                    # CREATE: outer wrapper (TopNav + sidebar slot + content)
│   │   │   ├── TopNav.tsx                      # CREATE: fixed top navigation bar
│   │   │   ├── NavLink.tsx                     # CREATE: reusable nav link with active state + icon
│   │   │   ├── UserMenu.tsx                    # CREATE: avatar + dropdown menu
│   │   │   ├── OrgSwitcher.tsx                 # CREATE: org name display / dropdown
│   │   │   ├── SettingsSidebar.tsx             # CREATE: settings contextual sidebar
│   │   │   └── SidebarContext.tsx              # CREATE: React context for sidebar slot injection
│   │   │
│   │   └── ui/
│   │       └── LordiconIcon.tsx                # CREATE: Lordicon player wrapper with hover trigger
│   │
│   └── routes/
│       ├── __root.tsx                          # MODIFY: render AppShell instead of inline flex layout
│       └── _authenticated/
│           └── $orgSlug/
│               └── settings.tsx                # CREATE: settings layout route with SettingsSidebar
```

**Structure Decision**: All new components live in `apps/app/src/components/layout/` (app-shell infrastructure) and `apps/app/src/components/ui/` (reusable primitives). This follows constitution Principle IV which places layout components in `apps/app/src/components/layout/`.

## Design Decisions

### 1. TailwindCSS v4 CSS-First Configuration

All brand tokens from `docs/design/brand-identity.md` are defined as CSS custom properties inside `@theme` in `app.css`. This maps directly to Tailwind utility classes:

- `--color-base-950: #080412` → `bg-base-950`
- `--color-blue-500: #0036FF` → `text-blue-500`
- `--font-sans: 'Inter Variable'` → `font-sans`
- `--radius-lg: 16px` → `rounded-lg`

Custom tokens for glass system, shadows, and animation curves are defined as standard CSS variables (outside `@theme`) since they use complex values not directly mappable to utilities.

### 2. HeroUI Component Usage

| Component Need        | HeroUI Component                                                 | Justification                                                        |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| User menu dropdown    | `Dropdown` + `DropdownTrigger` + `DropdownMenu` + `DropdownItem` | Built-in keyboard nav, focus trap, click-outside dismiss, Escape key |
| Org switcher dropdown | `Dropdown` (same pattern)                                        | Same accessibility benefits                                          |
| User avatar           | `Avatar`                                                         | Initials fallback, colored circle, consistent sizing                 |
| Nav buttons           | `Button` (variant="light")                                       | Consistent hover/focus states                                        |

### 3. Sidebar Slot Pattern

A `SidebarContext` provides:

- `sidebarContent: ReactNode | null` — what to render in the sidebar area
- `setSidebarContent(node: ReactNode | null)` — for route layouts to inject content

`AppShell` reads the context: if `sidebarContent` is non-null, it renders a two-column layout (sidebar + content). Otherwise, content spans full width.

Route layouts (e.g. `settings.tsx`) call `setSidebarContent(<SettingsSidebar />)` on mount and `setSidebarContent(null)` on unmount via `useEffect`.

### 4. TopNav Scroll Transform

The content area (not `window`) emits scroll events. A `useEffect` in `AppShell` attaches a scroll listener to the content container ref. When `scrollTop > 40`, a `scrolled` class is toggled on the nav element, triggering a CSS transition to frosted glass background.

### 5. Active Nav Link Detection

`NavLink` uses TanStack Router's `useMatchRoute()` to check if the current route starts with the link's `to` path. Active state applies `text-blue-500` and a subtle bottom border or background indicator.

For the Settings gear icon: active when route matches `/:orgSlug/settings/*`.

### 6. Lordicon Icon Wrapper

`LordiconIcon` component encapsulates:

- `Player` ref management
- `onMouseEnter` → `playFromBeginning()`
- State tracking to prevent re-triggering mid-animation
- `onMouseLeave` → reset trigger-ready state
- Configurable `size`, `colors`, and icon JSON prop

## Complexity Tracking

No constitution violations. No complexity justifications needed.

This feature introduces no new bounded context, no new domain logic, no new error codes, and no new API endpoints. It is purely a frontend layout and styling feature.
