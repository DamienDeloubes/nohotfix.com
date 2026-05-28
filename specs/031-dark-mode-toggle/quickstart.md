# Quickstart: Dark Mode / Light Mode Toggle

**Branch**: `031-dark-mode-toggle` | **Date**: 2026-03-13

## Prerequisites

- Node.js 20+, pnpm 9+
- The app dev server running: `pnpm --filter app dev`

## No New Dependencies

All required packages are already installed:
- `tailwindcss` 4.2 — CSS-first configuration with `@theme`
- `@heroui/styles` — includes built-in dark variant with `prefers-color-scheme` fallback
- `@heroui/react` — Dropdown component for the toggle UI

## Development

1. **Start the app**:
   ```bash
   pnpm --filter app dev
   ```

2. **Test system preference detection**:
   - Open Chrome DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme`
   - Toggle between `dark` and `light`
   - The app should follow the OS preference when no manual override is set

3. **Test manual toggle**:
   - Click the theme toggle button in the top navigation bar
   - Select Light, Dark, or System
   - Verify the UI updates immediately

4. **Test persistence**:
   - Select a theme manually
   - Close and reopen the tab
   - The previously selected theme should be restored

5. **Test FOIT prevention**:
   - Set preference to "dark", reload the page
   - There should be no flash of light theme before dark renders
   - Repeat in reverse (set "light", reload)

## Key Files

| File | Purpose |
|------|---------|
| `apps/app/src/app.css` | Light/dark CSS variables, semantic surface tokens |
| `apps/app/src/components/ui/ThemeProvider.tsx` | React context + `useTheme` hook |
| `apps/app/src/components/layout/ThemeToggle.tsx` | Dropdown toggle UI in header |
| `apps/app/src/components/layout/Header.tsx` | Modified to include ThemeToggle |
| `apps/app/index.html` | FOIT-prevention script |

## Testing

```bash
pnpm --filter app test
```

Unit tests for the `useTheme` hook verify:
- Default preference is "system"
- Setting preference updates localStorage
- Resolved theme follows system preference when set to "system"
- Resolved theme overrides system preference when set to "light" or "dark"
