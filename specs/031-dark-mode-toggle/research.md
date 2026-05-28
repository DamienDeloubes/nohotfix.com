# Research: Dark Mode / Light Mode Toggle

**Branch**: `031-dark-mode-toggle` | **Date**: 2026-03-13

## 1. Tailwind CSS v4.2 Dark Mode Strategy

### Decision: Use HeroUI's built-in `@custom-variant dark` instead of the current custom one

**Rationale**: The `@heroui/styles` package (v3.0.0-beta.8) ships its own `@custom-variant dark` definition in `@heroui/styles/dist/variants/index.css` that is more capable than the current one in `app.css`:

```css
/* HeroUI's built-in variant (from @heroui/styles) */
@custom-variant dark {
  &:is(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:not(:is(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *)) & { @slot; }
  }
}
```

This supports:
- `.dark` class on an ancestor (explicit toggle)
- `data-theme="dark"` attribute (explicit toggle)
- `prefers-color-scheme: dark` media query (system preference fallback)

The current `app.css` line 3 has a simpler variant:
```css
@custom-variant dark (&:is(.dark *));
```

This should be **removed** to let HeroUI's variant take precedence. HeroUI's variant already handles the system preference fallback, which aligns perfectly with the "System" mode in the spec.

**Alternatives considered**:
- Keep custom variant and override HeroUI's: Rejected — would duplicate logic and miss `data-theme` and `prefers-color-scheme` support.
- Use `@media (prefers-color-scheme)` only: Rejected — doesn't support manual toggling.

## 2. HeroUI Theme Integration

### Decision: Toggle `.dark` class on `<html>` element; no HeroUIProvider needed for theming

**Rationale**: HeroUI v3 (beta 8) has zero built-in theme management in `HeroUIProvider`. The provider only handles router integration, animation settings, and locale. Theme switching is entirely CSS-driven:
- Add `class="dark"` to `<html>` → dark mode activates
- Remove `class="dark"` from `<html>` → light mode activates (HeroUI defaults to light)

HeroUI's CSS variables are defined in two selector blocks:
- `:root, .light, .default, [data-theme="light"], [data-theme="default"]` → light palette
- `.dark, [data-theme="dark"]` → dark palette

No additional HeroUI configuration is needed.

**Alternatives considered**:
- `next-themes` library: Rejected — designed for Next.js, not a plain React SPA.
- `use-dark-mode` npm package: Rejected — adds unnecessary dependency for a simple feature.

## 3. Theme State Management

### Decision: Custom React context + hook with localStorage persistence

**Rationale**: The feature needs three states (Light, Dark, System) with localStorage persistence and real-time OS change tracking. This is simple enough for a custom implementation:

1. **ThemeProvider** (React context) wraps the app at the root level.
2. **useTheme** hook exposes `theme` (current resolved theme), `preference` (stored preference: "light" | "dark" | "system"), and `setPreference()`.
3. On mount, read preference from `localStorage`. If "system" or absent, attach a `matchMedia` listener for `prefers-color-scheme`.
4. Toggle `document.documentElement.classList` to add/remove `dark` class.

**Alternatives considered**:
- Zustand store: Rejected — overkill for a single boolean + preference string.
- Global state in TanStack Router context: Rejected — theme is app-global, not route-scoped.

## 4. Flash of Incorrect Theme (FOIT) Prevention

### Decision: Inline script in `index.html` to apply theme class before React hydrates

**Rationale**: React renders asynchronously. If the theme class is only applied after React mounts, users will see a flash of the wrong theme. The standard solution is a blocking `<script>` in `<head>` that reads localStorage and applies the class synchronously:

```html
<script>
  (function() {
    var pref = localStorage.getItem('theme-preference');
    var dark = pref === 'dark' || (!pref || pref === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  })();
</script>
```

This runs before first paint, preventing FOIT. The Vite CSP plugin already modifies `index.html` — a similar approach can inject this script, or it can be added directly to `index.html`.

**Note**: The existing CSP includes `script-src 'self' 'unsafe-eval'`. An inline script requires either `'unsafe-inline'` or a nonce/hash. Since the script is static and small, adding its SHA-256 hash to the CSP or using `'unsafe-inline'` (already implicitly covered by `'unsafe-eval'` in dev) is the pragmatic approach. Alternatively, the script can be extracted to a small `.js` file loaded synchronously.

**Alternatives considered**:
- CSS-only with `prefers-color-scheme` media queries: Only works for "System" mode; doesn't support manual toggle persistence.
- Cookie-based SSR hint: Not applicable — this is a client-rendered SPA.

## 5. Light Theme CSS Token Design

### Decision: Define light theme as CSS variable overrides scoped to `:root` (when `.dark` is absent)

**Rationale**: The current `app.css` defines all tokens as the dark theme. For light mode, we need an inverted set. The approach:

1. **Dark theme tokens remain the defaults** in `:root` and `@theme` (current state).
2. **Light theme tokens** are defined as overrides when `.dark` is NOT present on `<html>`.

Actually, since HeroUI's pattern treats `:root` as light mode and `.dark` as dark mode override, we should **restructure**:
- Move current dark tokens into a `.dark` selector block
- Define light tokens as the `:root` defaults
- OR keep the current dark-first approach and define light mode in a `:root:not(.dark)` block

Given the app is dark-first and the majority of development has been dark-only, the least disruptive approach is:
- Keep `@theme` tokens as-is (they map to Tailwind utilities and are theme-neutral where possible)
- Define **semantic surface variables** (backgrounds, borders, text) in `:root` as CSS custom properties
- Override those semantic variables in `.dark`
- Use these semantic variables in components instead of direct color references

**Light mode surface mapping** (from brand-identity.md):
- Page background: `Base-50` (#F0EFF5) or `Slate-50` (#F8FAFC)
- Card/content surface: `Base-100` (#DEDCEB) or `Slate-100` (#F1F5F9)
- Borders: `Base-200` (#B9B5D4) or `Slate-300` (#CBD5E1)
- Primary text: `Slate-900` (#0F172A)
- Muted text: `Base-300` (#908ABC) or `Slate-500` (#64748B)

## 6. Toggle UI Placement

### Decision: Place toggle in the Header right zone, between settings gear and UserMenu

**Rationale**: The spec says "top navigation bar." The Header's right zone already has the settings gear and UserMenu. A small icon button (sun/moon) fits naturally between them. This follows the convention of most web apps (VS Code, GitHub, Discord) that place theme toggles in the top-right area.

The toggle should cycle through: System → Light → Dark → System. A dropdown with three explicit options is cleaner than a cycle button for discoverability.

**Alternatives considered**:
- Inside UserMenu dropdown: Less discoverable — users expect quick access.
- In Settings page only: Too hidden for a frequently-toggled preference.
- Floating button: Doesn't match the brand's minimal, precise aesthetic.
