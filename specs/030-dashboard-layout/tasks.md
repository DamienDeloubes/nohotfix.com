# Tasks: App Shell & Dashboard Layout

**Input**: Design documents from `/specs/030-dashboard-layout/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No test tasks included — not requested in feature specification. Visual verification against brand-identity.md is the primary validation method.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure TailwindCSS v4, set up fonts and HeroUI provider

- [x] T001 Remove unused TailwindCSS v3 and install TailwindCSS v4 with Vite plugin: `pnpm --filter app remove tailwindcss && pnpm --filter app add -D tailwindcss @tailwindcss/vite`
- [x] T002 Install HeroUI and Framer Motion: `pnpm --filter app add @heroui/react framer-motion`
- [x] T003 [P] Install Lordicon React player: `pnpm --filter app add @lordicon/react`
- [x] T004 [P] Install self-hosted fonts: `pnpm --filter app add @fontsource-variable/inter @fontsource-variable/geist-mono`
- [x] T005 Add `@tailwindcss/vite` plugin to `apps/app/vite.config.ts` (add `tailwindcss()` to the plugins array after `react()`)
- [x] T006 Create `apps/app/src/app.css` with TailwindCSS v4 entry (`@import "tailwindcss"`), HeroUI plugin (`@plugin "../heroui.ts"`), `@source` for HeroUI theme, `@custom-variant dark`, and full brand token set from `docs/design/brand-identity.md` inside `@theme` block (all base colors, blue scale, semantic colors, glass system, neutrals, typography, spacing, radius, shadows, animation tokens as CSS custom properties)
- [x] T007 Import font packages (`@fontsource-variable/inter`, `@fontsource-variable/geist-mono`) and `app.css` in `apps/app/src/main.tsx`
- [x] T008 Wrap app with `HeroUIProvider` in `apps/app/src/app.tsx`

**Checkpoint**: TailwindCSS v4 working, HeroUI available, fonts loaded, dark theme visible on page background

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout infrastructure that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create `apps/app/src/components/layout/SidebarContext.tsx` — React context providing `sidebarContent: ReactNode | null` and `setSidebarContent` setter. Include `SidebarProvider` wrapper and `useSidebar` hook.
- [x] T010 Create `apps/app/src/components/ui/LordiconIcon.tsx` — Wrapper component around `@lordicon/react` Player. Props: `icon` (JSON), `size` (number), `colors` (string, optional). Implements hover trigger: `onMouseEnter` → `playFromBeginning()`, state tracking to prevent re-trigger mid-animation, `onMouseLeave` resets trigger state. Export as named export.
- [x] T011 Download 12 Lordicon JSON icon files to `apps/app/src/assets/icons/` — **Top nav (7):** home.json (Dashboard), rocket.json (Runs), clipboard.json (Playbooks), book.json (Spec Library), clock.json (History), gear.json (Settings), logout.json (Sign out). **Settings sidebar (5):** sliders.json (General), users.json (Members), server.json (Environments), credit-card.json (Billing), user-gear.json (Account). Select appropriate animated icons from the Lordicon library. Icons should be line/outline style matching the brand's 2px stroke aesthetic.
- [x] T012 Create `apps/app/src/components/layout/AppShell.tsx` — Outer layout wrapper. Reads `sidebarContent` from `SidebarContext`. Renders: fixed TopNav at top (z-50), then below it a flex row with optional sidebar (if `sidebarContent` is non-null) and a scrollable main content area. Content area has a ref for scroll tracking. Apply brand background colors (`bg-base-950` for outer, `bg-base-900` for content area). Content area: consistent padding (`px-8 py-6`), `max-w-7xl` centered on wide screens, `overflow-y-auto` for independent scrolling.

**Checkpoint**: Foundation ready — AppShell renders with correct dark theme, sidebar slot functional, LordiconIcon wrapper working

---

## Phase 3: User Story 1 — Top Navigation Bar (Priority: P1) 🎯 MVP

**Goal**: Logged-in users see a fixed top navigation bar with logo, org name, 5 primary nav links with animated icons, and active state highlighting. Nav background transitions on scroll.

**Independent Test**: Log in, verify nav bar visible on all pages, click each nav link to navigate, hover icons to see animations, scroll to see glass transition.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create `apps/app/src/components/layout/NavLink.tsx` — Reusable nav link component. Props: `to` (route path), `label` (string), `icon` (JSON for LordiconIcon). Uses TanStack Router `Link` component. Determines active state by matching current route prefix against `to` prop (use `useMatchRoute()` or `useRouterState()`). Active state: `text-blue-500` text + subtle bottom indicator. Inactive: `text-white/60`. Hover: `bg-glass-12` background with `duration-fast` transition. Renders `LordiconIcon` (24px) to the left of the label. Active icon uses `colors` prop to apply `Blue-500`.
- [x] T014 [US1] Create `apps/app/src/components/layout/TopNav.tsx` — Fixed top navigation bar. Structure: full-width, `h-16`, fixed top, `z-50`. Left zone: NoHotfix wordmark text ("Release" weight 400, "Hawk" weight 700, Inter font) linking to `/:orgSlug` dashboard + OrgSwitcher component (placeholder `<span>` for now — implemented in US3). Center zone: 5 `NavLink` components (Dashboard → `/:orgSlug`, Runs → `/:orgSlug/runs`, Playbooks → `/:orgSlug/playbooks`, Spec Library → `/:orgSlug/spec-library`, History → `/:orgSlug/history`). Right zone: Settings gear `LordiconIcon` (24px, links to `/:orgSlug/settings/general`) + UserMenu component (placeholder `<div>` for now — implemented in US2). Default background: transparent. Accepts `scrolled` boolean prop to toggle frosted glass background (`rgba(13, 9, 32, 0.80)` + `backdrop-blur-[16px]` + `border-b border-glass-border`) with `transition-all duration-deliberate ease-premium`.
- [x] T015 [US1] Implement scroll detection in `apps/app/src/components/layout/AppShell.tsx` — Attach scroll event listener to content area ref. When `scrollTop > 40`, set `scrolled` state to true. Pass `scrolled` prop to `TopNav`. Use `requestAnimationFrame` for throttling.
- [x] T016 [US1] Modify `apps/app/src/routes/__root.tsx` — Remove current inline-styled flex layout and `Sidebar` import. Wrap `<Outlet />` with `<SidebarProvider>` and `<AppShell>`. The AppShell renders TopNav + content area with Outlet inside.
- [x] T017 [US1] Delete `apps/app/src/components/layout/Sidebar.tsx` — Replaced entirely by TopNav + contextual sidebars.

**Checkpoint**: Nav bar visible on all pages, 5 links work, icons animate on hover, active state highlights current page, glass effect on scroll. Org name and user menu are placeholders.

---

## Phase 4: User Story 2 — User Menu & Sign Out (Priority: P2)

**Goal**: Users can click their avatar to see a dropdown with their name, email, account settings link, and sign out button.

**Independent Test**: Click avatar, verify dropdown contents, click "Account settings" to navigate, click "Sign out" to log out.

### Implementation for User Story 2

- [x] T018 [US2] Create `apps/app/src/components/layout/UserMenu.tsx` — Avatar circle with dropdown. Avatar: HeroUI `Avatar` component showing user initials (first letter of first name + first letter of last name) on a `bg-blue-500` circle. Use HeroUI `Dropdown` + `DropdownTrigger` + `DropdownMenu` + `DropdownItem` for the menu. Dropdown content: user display name (non-interactive, `DropdownItem` with `isReadOnly`), email in muted text (`text-slate-500`), divider, "Account settings" item navigating to `/:orgSlug/settings/account`, "Sign out" item with logout icon that calls `logout()` from `apps/app/src/lib/session.ts`. Get user data from the existing auth/session context. Get `orgSlug` from TanStack Router params. Style dropdown with dark theme: `bg-base-800` background, `border-glass-border` border, `shadow-3`.
- [x] T019 [US2] Integrate `UserMenu` into `apps/app/src/components/layout/TopNav.tsx` — Replace the placeholder `<div>` in the right zone with the `<UserMenu />` component. Pass user data (name, email, first name, last name) from the session/auth context available in the component tree.

**Checkpoint**: Avatar visible in top-right, dropdown opens on click, shows name/email, "Account settings" navigates correctly, "Sign out" logs out and redirects.

---

## Phase 5: User Story 3 — Organisation Switcher (Priority: P2)

**Goal**: Single-org users see static org name; multi-org users see a dropdown to switch organisations.

**Independent Test**: With single org — verify static text. With multiple orgs — click org name, verify dropdown lists all orgs, select different org to navigate.

### Implementation for User Story 3

- [x] T020 [US3] Create `apps/app/src/components/layout/OrgSwitcher.tsx` — Renders org name next to logo in TopNav. Gets current org from `OrgContext` (via `Route.useRouteContext()` or equivalent). Gets org list from existing `useUserOrganisations` hook. Single org: render `<span>` with org name in `text-slate-400`, no dropdown indicator. Multiple orgs: render HeroUI `Dropdown` with org name + chevron icon as trigger. Dropdown lists all orgs; current org has a checkmark or `bg-base-600` highlight. Clicking a different org navigates to `/:newOrgSlug` using TanStack Router `useNavigate()`. Long org names (50+ chars) truncated with `truncate` class and `max-w-[200px]`.
- [x] T021 [US3] Integrate `OrgSwitcher` into `apps/app/src/components/layout/TopNav.tsx` — Replace the placeholder `<span>` in the left zone with `<OrgSwitcher />`.

**Checkpoint**: Org name visible next to logo. For multi-org users, dropdown opens and switching navigates to new org's dashboard.

---

## Phase 6: User Story 4 — Settings Contextual Sidebar (Priority: P3)

**Goal**: Settings pages render a contextual sidebar with grouped navigation (Organisation + Account groups).

**Independent Test**: Navigate to Settings, verify sidebar appears with correct groups and items. Click sidebar items to navigate between settings pages. Navigate away from Settings, verify sidebar disappears.

### Implementation for User Story 4

- [x] T022 [US4] Create `apps/app/src/components/layout/SettingsSidebar.tsx` — Settings-specific sidebar content. Two groups: "Organisation" label (`text-slate-500`, uppercase, `text-xs` / Body Micro) with items: General, Members, Environments, Billing. "Account" label with item: Account settings. Each item renders a `LordiconIcon` (20px) + label text. Active item: `bg-base-600` background + `text-white`. Inactive: `text-white/60`. Hover: `bg-glass-12` with `duration-fast` transition. Items link to: `/:orgSlug/settings/general`, `/:orgSlug/settings/members`, `/:orgSlug/settings/environments`, `/:orgSlug/settings/billing`, `/:orgSlug/settings/account`. Use TanStack Router `Link` for navigation. Active state determined by matching current route.
- [x] T023 [US4] Create settings layout route at `apps/app/src/routes/_authenticated/$orgSlug/settings.tsx` — TanStack Router layout route wrapping `<Outlet />`. On mount, calls `setSidebarContent(<SettingsSidebar />)` via `useSidebar()` context. On unmount (cleanup in `useEffect`), calls `setSidebarContent(null)`. This injects the sidebar into AppShell only when on settings routes.
- [x] T024 [US4] Update `apps/app/src/routes/_authenticated/$orgSlug/settings/index.tsx` — Remove the existing `<h2>Settings</h2>` heading and unstyled `<Outlet />` wrapper. The layout route (`settings.tsx`) now handles the sidebar injection, so this file should redirect to `/:orgSlug/settings/general` (existing redirect logic) and render `<Outlet />` cleanly.

**Checkpoint**: Settings pages show sidebar with grouped nav. Clicking items navigates between settings sub-pages. Non-settings pages have no sidebar — content spans full width.

---

## Phase 7: User Story 5 — Branded Visual Design (Priority: P3)

**Goal**: Apply brand identity tokens throughout all layout components. Dark-mode surfaces, glass treatments, Inter typography, branded animations.

**Independent Test**: Visually compare the rendered app against `docs/design/brand-identity.md` and `docs/design/dashboard.png`. Verify colors, typography, spacing, and animations match.

### Implementation for User Story 5

- [x] T025 [P] [US5] Apply global body styles in `apps/app/src/app.css` — Set `body` to `bg-base-950`, `font-sans` (Inter Variable), `text-white`, `antialiased`. Set `code`/`pre` to `font-mono` (Geist Mono Variable). Add global scrollbar styling for dark theme (thin, subtle).
- [x] T026 [P] [US5] Refine `apps/app/src/components/layout/TopNav.tsx` visual treatment — Ensure nav height, padding, border, and glass transition match brand spec. Bottom border in scrolled state: `border-glass-border`. Verify Inter font at correct weight for nav links (Body Base, 400 weight, 16px). Logo wordmark: "Release" Inter 400, "Hawk" Inter 700, tracking `+0.01em`.
- [x] T027 [P] [US5] Refine `apps/app/src/components/layout/SettingsSidebar.tsx` visual treatment — Sidebar background: `bg-base-800`. Width: `w-60` (240px). Full remaining height below nav. Border right: `border-r border-glass-border`. Group labels: uppercase, `text-xs`, `text-slate-500`, `tracking-wider`. Sidebar items: `rounded-md` padding, active `bg-base-600`, hover transitions.
- [x] T028 [P] [US5] Refine `apps/app/src/components/layout/AppShell.tsx` visual treatment — Ensure content area background is `bg-base-950` or `bg-base-900`. Verify padding values (`px-8 py-6`). Verify max-width constraint (`max-w-7xl mx-auto`). Ensure smooth independent scrolling of content area.
- [x] T029 [US5] Visual audit — Compare rendered layout against `docs/design/dashboard.png` reference and `docs/design/brand-identity.md` tokens. Check: base surface colors match, glass card recipes correct, shadow scale applied, border radii correct, animation curves smooth, hover states use correct easing and duration, typography weights/sizes match type scale. Fix any discrepancies found.

**Checkpoint**: App visually matches the brand identity. Dark theme with blue-violet undertones, glass effects, Inter typography, smooth animations on hover.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks across all user stories

- [x] T030 [P] Verify `pnpm --filter app build` succeeds with no TypeScript errors
- [x] T031 [P] Verify `pnpm --filter app typecheck` passes
- [x] T032 Verify layout at 1024px viewport width — no horizontal scrolling, no overlapping elements, all nav links visible, sidebar (if present) doesn't crush content area
- [x] T033 Verify layout at 2560px viewport width — content area centered with max-width, no visual breakage
- [x] T034 Clean up any remaining inline styles from modified files (`__root.tsx`, `settings/index.tsx`) — all styling should use Tailwind classes
- [x] T035 Run `quickstart.md` verification checklist (8 items)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (TopNav) must complete before US2, US3 (they integrate into TopNav)
  - US4 (Settings Sidebar) depends on SidebarContext from Phase 2 only
  - US5 (Visual Polish) should run last as it refines all components
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — Creates TopNav, modifies \_\_root.tsx
- **User Story 2 (P2)**: Depends on US1 completion — Integrates UserMenu into TopNav
- **User Story 3 (P2)**: Depends on US1 completion — Integrates OrgSwitcher into TopNav
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) — Independent sidebar work, only needs SidebarContext
- **User Story 5 (P3)**: Should run after US1-US4 are complete — Polishes all components visually

### Within Each User Story

- Component creation before integration
- Core implementation before refinement
- Story complete before moving to next priority

### Parallel Opportunities

- T001/T002 can run sequentially, then T003/T004 in parallel
- T005/T006/T007/T008 are sequential (each builds on prior)
- T009/T010/T011 in Phase 2 can run in parallel (different files)
- T013 (NavLink) can run in parallel with T014 (TopNav) start, but TopNav depends on NavLink
- US2 and US3 can run in parallel after US1 (they modify different parts of TopNav)
- US4 can start in parallel with US1 (independent sidebar work)
- T025/T026/T027/T028 in US5 can all run in parallel (different files)
- T030/T031 in Polish can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# These three tasks touch different files and can run in parallel:
Task T009: "Create SidebarContext.tsx"
Task T010: "Create LordiconIcon.tsx"
Task T011: "Download Lordicon JSON icons to assets/icons/"
```

## Parallel Example: User Story 5 (Visual Polish)

```bash
# All refinement tasks touch different component files:
Task T025: "Apply global body styles in app.css"
Task T026: "Refine TopNav.tsx visual treatment"
Task T027: "Refine SettingsSidebar.tsx visual treatment"
Task T028: "Refine AppShell.tsx visual treatment"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T008)
2. Complete Phase 2: Foundational (T009–T012)
3. Complete Phase 3: User Story 1 (T013–T017)
4. **STOP and VALIDATE**: Nav bar renders, links work, icons animate, scroll effect works
5. At this point the app has a functional top nav replacing the old sidebar

### Incremental Delivery

1. Setup + Foundational → Dark theme visible, TailwindCSS working
2. Add US1 (TopNav) → Primary navigation functional (MVP!)
3. Add US2 (UserMenu) → Sign out + account access
4. Add US3 (OrgSwitcher) → Multi-org support
5. Add US4 (SettingsSidebar) → Settings sub-navigation
6. Add US5 (Visual Polish) → Brand identity fully applied
7. Polish → Build verification, viewport testing, cleanup

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No backend changes in this feature — all tasks are frontend (apps/app)
- No new domain error codes or OTel spans needed (frontend-only feature)
- Lordicon JSON files must be downloaded from lordicon.com library during T011
- Visual verification against `docs/design/dashboard.png` and `docs/design/brand-identity.md` is the primary validation method
- Commit after each phase or logical group of tasks
