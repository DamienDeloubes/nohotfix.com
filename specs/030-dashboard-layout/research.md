# Research: App Shell & Dashboard Layout

**Branch**: `030-dashboard-layout` | **Date**: 2026-03-12

## 1. TailwindCSS v4.2 Setup with Vite

**Decision**: Use TailwindCSS v4.2 with the `@tailwindcss/vite` plugin (CSS-first configuration).

**Rationale**: v4 eliminates `tailwind.config.js` entirely. All tokens are defined in CSS via `@theme` directive. The Vite plugin replaces PostCSS — no `postcss.config.js` needed. Automatic content detection replaces the `content: [...]` array.

**Alternatives considered**:
- TailwindCSS v3.4 (already installed but unconfigured) — Rejected: v4 is current, CSS-first config is cleaner, and HeroUI v2.8+ supports it.
- UnoCSS — Rejected: Less ecosystem support, HeroUI requires Tailwind.

**Setup**:
```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

`vite.config.ts` — add `tailwindcss()` to plugins array.

`app.css` — single entry point:
```css
@import "tailwindcss";

@theme {
  --color-base-950: #080412;
  /* ... all brand tokens ... */
}
```

**Key differences from v3**:
- No `tailwind.config.js` — use `@theme` in CSS
- No `@tailwind base/components/utilities` — use `@import "tailwindcss"`
- No `postcss.config.js` — Vite plugin handles everything
- Automatic content detection (respects `.gitignore`)
- Remove the unused `tailwindcss: ^3.4.17` from `package.json`

## 2. HeroUI Integration

**Decision**: Use `@heroui/react` (full package) with TailwindCSS v4 CSS-first configuration.

**Rationale**: HeroUI v2.8.0+ supports TailwindCSS v4 via `@plugin` directive. Provides production-ready dropdown, popover, avatar, and button components with built-in accessibility (keyboard navigation, ARIA roles, focus management). Eliminates need to build these from scratch.

**Alternatives considered**:
- shadcn/ui — Rejected: The constitution mentions shadcn/ui for `apps/app/src/components/ui/`, but HeroUI is explicitly requested in the feature description and provides a richer component set with built-in dark mode support.
- Radix UI — Rejected: Lower-level primitives requiring more styling work.
- Raw HTML + inline styles (current state) — Rejected: Not production-quality.

**Setup**:
```bash
pnpm add @heroui/react framer-motion
```

CSS integration (in `app.css`):
```css
@import "tailwindcss";
@plugin "@heroui/react";
@source '../../node_modules/@heroui/theme/dist/**/*.js';
@custom-variant dark (&:is(.dark *));
```

App wrapper:
```tsx
import { HeroUIProvider } from "@heroui/react";
// Wrap app with <HeroUIProvider>
```

**Gotcha**: The `@source` path must be relative to the CSS file location. In monorepo with CSS at `apps/app/src/app.css`, the path to `node_modules` depends on hoisting — verify at implementation time.

## 3. @lordicon/react Integration

**Decision**: Use `@lordicon/react` Player component with manual hover triggering via `onMouseEnter`.

**Rationale**: Self-hosted JSON icons avoid external CDN dependencies. The React Player component integrates naturally with React's event system. Manual hover control gives precise animation behavior (play once on enter, complete animation, re-triggerable only after mouse leave + re-enter).

**Alternatives considered**:
- `@lordicon/element` (web component) — Rejected: Has built-in `trigger="hover"` but web components in React require refs and don't integrate as cleanly.
- Lottie-react + standalone Lottie files — Rejected: Lordicon icons are optimized for their own player.
- Static SVG icons (Lucide, Heroicons) — Rejected: Feature spec explicitly requires animated Lordicon icons.

**Setup**:
```bash
pnpm add @lordicon/react
```

**Hover pattern**:
```tsx
const playerRef = useRef<Player>(null);
const [hasPlayed, setHasPlayed] = useState(false);

<div
  onMouseEnter={() => {
    if (!hasPlayed) {
      playerRef.current?.playFromBeginning();
      setHasPlayed(true);
    }
  }}
  onMouseLeave={() => setHasPlayed(false)}
>
  <Player ref={playerRef} icon={ICON_JSON} size={24} />
</div>
```

**Icon JSON files**: Download from Lordicon library during implementation. Store in `apps/app/src/assets/icons/`. Vite handles JSON imports natively.

**Key Player API**:
- `icon`: JSON object (imported)
- `size`: number (px)
- `colors`: string for multi-color (`"primary:#0036FF,secondary:#ffffff"`)
- `ref.playFromBeginning()`: programmatic play
- `onComplete`: callback when animation finishes

## 4. Font Loading

**Decision**: Use Fontsource variable font packages (self-hosted, bundled by Vite).

**Rationale**: No external network requests, no FOUT/FOIT flash, no Google Fonts tracking. Variable fonts cover all weights (100-900) in a single WOFF2 file.

**Alternatives considered**:
- Google Fonts CDN — Rejected: External dependency, privacy concerns, FOUT on first load.
- Manual WOFF2 files — Rejected: More manual setup, Fontsource handles it cleanly.

**Setup**:
```bash
pnpm add @fontsource-variable/inter @fontsource-variable/geist-mono
```

Import in `main.tsx`:
```typescript
import '@fontsource-variable/inter';
import '@fontsource-variable/geist-mono';
```

CSS theme:
```css
@theme {
  --font-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono Variable', 'JetBrains Mono', monospace;
}
```

## 5. Sidebar Slot Pattern with TanStack Router

**Decision**: Use React context to allow route layouts to inject sidebar content into the AppShell.

**Rationale**: TanStack Router's layout routes (`_authenticated/$orgSlug/settings.tsx`) wrap their child routes with `<Outlet />`. A context-based sidebar slot lets layout routes provide sidebar content without prop drilling.

**Alternatives considered**:
- Render props / slot props on AppShell — Rejected: Would require AppShell to know about all possible sidebar variants.
- React portals — Rejected: Adds complexity, breaks DOM hierarchy.
- URL-based sidebar detection (check if path contains `/settings/`) — Rejected: Fragile, couples AppShell to route structure.

**Pattern**:
```tsx
// SidebarContext: provides a setter for sidebar content
// AppShell: reads sidebar content from context, renders it if present
// Settings layout route: sets sidebar content via context on mount, clears on unmount
```

## 6. Scroll-Triggered Nav Background

**Decision**: Use a scroll event listener with `requestAnimationFrame` throttling on the content area.

**Rationale**: The top nav starts transparent and gains a frosted glass background at 40px scroll depth. Since the content area scrolls independently (not the window), the listener attaches to the content container.

**Pattern**: `useEffect` with scroll listener → state toggle → CSS class swap with `transition: all 450ms cubic-bezier(0.6, 0.6, 0, 1)`.
