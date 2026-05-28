# Implementation Plan: Dark Mode / Light Mode Toggle

**Branch**: `031-dark-mode-toggle` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/031-dark-mode-toggle/spec.md`

## Summary

Add a light mode/dark mode toggle to the `apps/app` React SPA. The default theme follows the user's OS preference via `prefers-color-scheme`. Users can manually override to Light, Dark, or System via a dropdown in the top navigation. The preference is persisted in localStorage and applied before first paint to prevent flash of incorrect theme (FOIT).

This is a **frontend-only** feature. No backend changes, no new API endpoints, no database migrations.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Vite 6
**Primary Dependencies**: TailwindCSS 4.2, @heroui/styles (v3.0.0-beta.8), framer-motion (existing)
**Storage**: localStorage (browser-only, no database)
**Testing**: Vitest (component/hook tests), visual inspection
**Target Platform**: Desktop browsers (1024px+), Chrome 111+, Safari 16.4+, Firefox 128+
**Project Type**: React SPA (apps/app)
**Performance Goals**: No FOIT, theme switch < 200ms, LCP under 2.5s maintained
**Constraints**: Dark-mode-first (existing default), brand tokens from docs/design/brand-identity.md, HeroUI components must respect both themes
**Scale/Scope**: 1 new context/hook, 1 new UI component, 1 modified CSS file, 1 modified HTML file, 8 modified layout components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                                                                                                | Check |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| I   | **Bounded Context Integrity** — This feature is not assigned to a bounded context; it is app-shell infrastructure in `apps/app/src/`. No domain-specific logic. No cross-domain imports. Theme components import only from React and browser APIs.                                                                                       | PASS  |
| II  | **Code Quality & Simplicity** — Hexagonal Architecture maintained: theme components are pure UI with no domain logic, no HTTP calls, no repository access. Naming conventions respected (PascalCase.tsx for components, kebab-case for directories). No premature abstractions — ThemeProvider + useTheme is the minimum viable pattern. | PASS  |
| III | **Testing Discipline** — No enforcement-critical paths in this feature (no state machines, artifact gates, or immutability checks). Hook unit tests verify preference cycling and localStorage persistence. Visual compliance verified manually.                                                                                         | PASS  |
| IV  | **UX Consistency** — Layout components live in `apps/app/src/components/layout/` per constitution. No domain UI created. Query keys not applicable (no data fetching). No polling changes.                                                                                                                                               | PASS  |
| V   | **Run Immutability** — N/A. Feature does not touch run data.                                                                                                                                                                                                                                                                             | PASS  |
| VI  | **Domain Errors** — N/A. No new error paths introduced. No backend changes.                                                                                                                                                                                                                                                              | PASS  |
| VII | **Observability (OTel)** — N/A. No new service methods or API endpoints. No database queries.                                                                                                                                                                                                                                            | PASS  |

## Project Structure

### Documentation (this feature)

```text
specs/031-dark-mode-toggle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (no changes needed)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/app/
├── index.html                                    # MODIFY: add inline FOIT-prevention script
├── src/
│   ├── app.css                                   # MODIFY: add light theme CSS variables, remove custom dark variant
│   ├── app.tsx                                   # MODIFY: wrap with ThemeProvider
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                      # MODIFY: use semantic CSS variables instead of hardcoded dark colors
│   │   │   ├── Header.tsx                        # MODIFY: add ThemeToggle to right zone
│   │   │   └── ThemeToggle.tsx                   # CREATE: dropdown with Light/Dark/System options
│   │   │
│   │   └── ui/
│   │       └── ThemeProvider.tsx                  # CREATE: React context + hook for theme management
│   │
│   └── routes/
│       └── (no route changes needed)
```

**Structure Decision**: All new components live in `apps/app/src/components/layout/` (ThemeToggle — app shell UI) and `apps/app/src/components/ui/` (ThemeProvider — reusable primitive). This follows constitution Principle IV which places layout components and UI primitives in their respective directories.

## Design Decisions

### 1. HeroUI's Built-in Dark Variant

Remove the current `@custom-variant dark (&:is(.dark *))` from `app.css` line 3. HeroUI's `@heroui/styles` already ships a more capable variant that supports `.dark` class, `data-theme="dark"` attribute, AND `prefers-color-scheme` media query fallback. Removing the custom one avoids conflicts and gives us system preference detection for free in CSS.

### 2. Theme Class on `<html>`

Toggle `document.documentElement.classList.add/remove('dark')` to switch themes. This is the standard pattern that both Tailwind v4 and HeroUI expect. When `.dark` is present → dark theme. When absent → light theme (HeroUI's default).

### 3. Three-State Preference Model

The theme preference stored in localStorage is one of: `"light"`, `"dark"`, or `"system"`. The resolved theme (what actually renders) is always binary: dark or light. The resolution logic:

- `"dark"` → resolved = dark
- `"light"` → resolved = light
- `"system"` or absent → resolved = `matchMedia('(prefers-color-scheme: dark)').matches ? dark : light`

When preference is `"system"`, a `matchMedia` change listener updates the resolved theme in real time.

### 4. FOIT Prevention via Inline Script

A small blocking `<script>` in `index.html` `<head>` reads localStorage and applies the `.dark` class before React hydrates. This prevents the flash of light theme when the user prefers dark (or vice versa). The script is ~150 bytes and executes synchronously before first paint.

To work with the existing CSP plugin, the script will be placed in a separate tiny file (`public/theme-init.js`) loaded with `<script src>` rather than inline, avoiding the need for `'unsafe-inline'` in CSP. Vite serves files from `public/` as static assets at the root path.

### 5. Light Theme CSS Variables

Define a set of **semantic surface variables** in `app.css` that abstract over the raw color values:

```css
/* Light mode (default when .dark is absent) */
:root {
  --surface-page: var(--color-slate-50); /* #F8FAFC */
  --surface-card: var(--color-base-100); /* #DEDCEB */
  --surface-elevated: white;
  --surface-active: var(--color-base-200); /* #B9B5D4 — active sidebar/nav item */
  --surface-border: var(--color-base-200); /* #B9B5D4 */
  --text-muted: var(--color-slate-900); /* #0F172A */
  --text-secondary: var(--color-slate-500); /* #64748B */
  --text-muted: var(--color-base-300); /* #908ABC */

  /* Glass system — light mode (dark overlays on light bg) */
  --glass-4: rgba(0, 0, 0, 0.03);
  --glass-8: rgba(0, 0, 0, 0.05);
  --glass-12: rgba(0, 0, 0, 0.07);
  --glass-20: rgba(0, 0, 0, 0.12);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-border-strong: rgba(0, 0, 0, 0.15);
}

/* Dark mode override */
.dark {
  --surface-page: var(--color-base-950); /* #080412 */
  --surface-card: var(--color-base-800); /* #130F2E */
  --surface-elevated: var(--color-base-700); /* #1A1640 */
  --surface-active: var(--color-base-600); /* #231E54 — active sidebar/nav item */
  --surface-border: rgba(255, 255, 255, 0.1); /* glass-border equivalent */
  --text-muted: white;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Glass system — dark mode (white overlays on dark bg) */
  --glass-4: rgba(255, 255, 255, 0.04);
  --glass-8: rgba(255, 255, 255, 0.08);
  --glass-12: rgba(255, 255, 255, 0.12);
  --glass-20: rgba(255, 255, 255, 0.2);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-border-strong: rgba(255, 255, 255, 0.18);
}
```

Components use `bg-[var(--surface-page)]` or semantic Tailwind utilities mapped via `@theme`. This way, switching `.dark` on/off automatically updates all surfaces.

### 6. ThemeToggle UI Component

A small dropdown button in the Header right zone, using HeroUI's `Dropdown` component (already used by UserMenu and OrgSwitcher). Three options:

- Sun icon + "Light"
- Moon icon + "Dark"
- Monitor icon + "System"

The active option has a checkmark indicator. Clicking an option calls `setPreference()` from the `useTheme` hook.

### 7. Component Migration Strategy

Existing components use hardcoded dark-mode classes (e.g., `bg-base-950`, `text-white`, `border-[var(--glass-border)]`). These need to be migrated to use the semantic CSS variables or Tailwind dark: variants. The migration scope:

- **AppShell.tsx**: `bg-base-950` → `bg-[var(--surface-page)]`
- **Header.tsx**: border colors, text colors
- **NavLink.tsx**: active/inactive colors
- **UserMenu.tsx**: dropdown backgrounds, text colors
- **OrgSwitcher.tsx**: dropdown backgrounds, text colors
- **SettingsSidebar.tsx**: background, borders, text
- **Subheader.tsx**: text colors

This migration is incremental — components can be updated one at a time as each should independently pick up the semantic variables.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

This feature introduces no new bounded context, no new domain logic, no new error codes, and no new API endpoints. It is purely a frontend styling and theme-management feature.
