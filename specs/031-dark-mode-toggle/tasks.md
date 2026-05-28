# Tasks: Dark Mode / Light Mode Toggle

**Input**: Design documents from `/specs/031-dark-mode-toggle/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Tests omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: CSS foundation and theme variables that all stories depend on

- [x] T001 Remove custom `@custom-variant dark (&:is(.dark *))` from `apps/app/src/app.css` line 3 — HeroUI's built-in variant from `@heroui/styles` already handles `.dark` class, `data-theme`, and `prefers-color-scheme` fallback
- [x] T002 Add missing light-mode color tokens to the `@theme` block in `apps/app/src/app.css` — add `--color-base-50` through `--color-base-500` and any other missing shades from `docs/design/brand-identity.md` that are not yet present
- [x] T003 Add semantic surface CSS variables to `apps/app/src/app.css` — define `:root` block with light-mode defaults (`--surface-page`, `--surface-card`, `--surface-elevated`, `--surface-border`, `--text-muted`, `--text-secondary`, `--text-muted`) and `.dark` override block with dark-mode values per plan.md Design Decision 5
- [x] T004 Add dark-mode overrides for the glass system variables in `apps/app/src/app.css` — move existing glass/shadow values into `.dark` selector and define light-mode equivalents in `:root` (e.g., lighter shadows, opaque borders instead of rgba white)
- [x] T005 Update `body` styles in `apps/app/src/app.css` to use semantic variables instead of hardcoded dark values — replace `background-color: var(--color-base-950)` with `background-color: var(--surface-page)` and `color: white` with `color: var(--text-muted)`
- [x] T006 Update `.header` border in `apps/app/src/app.css` from `border-bottom: 1px solid #2b2b2b` to `border-bottom: 1px solid var(--surface-border)`, and update `.settings-menu` and `.subheader` borders similarly

**Checkpoint**: CSS foundation ready — all semantic variables defined, light/dark values in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Theme context provider and FOIT prevention that MUST be complete before any UI work

**Warning**: No user story work can begin until this phase is complete

- [x] T007 Create `ThemeProvider` context and `useTheme` hook in `apps/app/src/components/ui/ThemeProvider.tsx` — implement three-state preference model (`"light"` | `"dark"` | `"system"`), localStorage read/write under key `theme-preference`, `matchMedia('(prefers-color-scheme: dark)')` listener for system mode, and `document.documentElement.classList.add/remove('dark')` toggling. Export `ThemeProvider` component and `useTheme` hook. Handle localStorage unavailability gracefully (session-only fallback).
- [x] T008 Create FOIT-prevention script at `apps/app/public/theme-init.js` — synchronous script (~150 bytes) that reads `theme-preference` from localStorage and adds `.dark` class to `<html>` if preference is `"dark"` or if preference is `"system"`/absent and `prefers-color-scheme: dark` matches. Must execute before first paint.
- [x] T009 Add `<script src="/theme-init.js"></script>` to `<head>` in `apps/app/index.html` before any other scripts — must be a blocking (non-module, non-async, non-defer) script tag to prevent FOIT
- [x] T010 Wrap the app with `ThemeProvider` in `apps/app/src/app.tsx` — add `<ThemeProvider>` inside the existing provider stack (inside `QueryClientProvider`, outside `RouterProvider` or at any level since it has no dependencies on other providers)

**Checkpoint**: Foundation ready — theme can be toggled programmatically via `useTheme().setPreference()`, correct theme applied before first paint

---

## Phase 3: User Story 1 — Automatic Theme from System Preference (Priority: P1) MVP

**Goal**: App detects OS color scheme and renders in the matching theme on first load without user action.

**Independent Test**: Toggle OS color scheme in DevTools → Rendering → Emulate `prefers-color-scheme`, reload the app. It should render in the correct theme.

### Implementation for User Story 1

- [x] T011 [US1] Migrate `AppShell.tsx` in `apps/app/src/components/layout/AppShell.tsx` — replace `bg-base-950` with `bg-[var(--surface-page)]`
- [x] T012 [P] [US1] Migrate `Header.tsx` in `apps/app/src/components/layout/Header.tsx` — update border colors and text color references to use semantic variables (e.g., `text-white` → `text-muted` where appropriate, keeping brand wordmark white in both themes if desired)
- [x] T013 [P] [US1] Migrate `Subheader.tsx` in `apps/app/src/components/layout/Subheader.tsx` — replace `border-[#2b2b2b]` with `border-[var(--surface-border)]`, update `text-white` and `text-white/50` to semantic text variables
- [x] T014 [P] [US1] Migrate `NavLink.tsx` in `apps/app/src/components/layout/NavLink.tsx` — update `hover:text-white`, `[&.active]:text-white`, and inactive color `text-inactive-link` to use semantic variables that work in both themes
- [x] T015 [P] [US1] Migrate `SettingsLink.tsx` in `apps/app/src/components/layout/SettingsLink.tsx` — same treatment as NavLink: update text colors to semantic variables
- [x] T016 [P] [US1] Migrate `UserMenu.tsx` in `apps/app/src/components/layout/UserMenu.tsx` — replace `bg-base-800` on Dropdown.Popover with `bg-[var(--surface-card)]`, `border-[var(--glass-border)]` with `border-[var(--surface-border)]`, `text-white` with `text-muted`, `text-white/80` with `text-secondary`
- [x] T017 [P] [US1] Migrate `OrgSwitcher.tsx` in `apps/app/src/components/layout/OrgSwitcher.tsx` — replace `bg-base-800` on Dropdown.Popover with `bg-[var(--surface-card)]`, update border and text colors to semantic variables, update active item `bg-base-600` to a semantic equivalent
- [x] T018 [P] [US1] Migrate `SettingsSidebar.tsx` in `apps/app/src/components/layout/SettingsSidebar.tsx` — update active item `bg-base-600` and hover `bg-[var(--glass-12)]` to semantic equivalents, update `text-white/60` and `text-white` to semantic text variables, update group label `text-slate-500` if needed for light mode contrast

**Checkpoint**: App renders correctly in both dark and light themes based on OS preference. All layout components use semantic CSS variables.

---

## Phase 4: User Story 2 — Manual Theme Toggle (Priority: P1)

**Goal**: User can click a toggle in the top nav to switch between Light, Dark, and System themes instantly.

**Independent Test**: Click the theme toggle dropdown in the Header, select each option, verify the entire UI updates immediately.

### Implementation for User Story 2

- [x] T019 [US2] Create `ThemeToggle.tsx` in `apps/app/src/components/layout/ThemeToggle.tsx` — HeroUI `Dropdown` component with three options: Sun icon + "Light", Moon icon + "Dark", Monitor icon + "System". Active option shows checkmark. Calls `useTheme().setPreference()` on selection. Icons can be simple inline SVGs (sun, moon, monitor). Accessible: `aria-label="Theme"`, keyboard navigable via HeroUI Dropdown.
- [x] T020 [US2] Add `ThemeToggle` to `Header.tsx` in `apps/app/src/components/layout/Header.tsx` — place in the right zone between the settings gear link and `UserMenu`, import and render `<ThemeToggle />`

**Checkpoint**: Theme toggle is visible and functional. Clicking any option immediately updates the UI.

---

## Phase 5: User Story 3 — Theme Preference Persistence (Priority: P1)

**Goal**: Manual theme choice survives tab/browser restarts.

**Independent Test**: Select a theme, close the tab, reopen the app — previously selected theme is restored.

### Implementation for User Story 3

_Note: Persistence is already implemented in Phase 2 (T007 — ThemeProvider writes to localStorage, T008 — theme-init.js reads from localStorage on page load). This phase validates the integration works end-to-end._

- [x] T021 [US3] Verify localStorage integration in `ThemeProvider.tsx` — ensure `setPreference()` writes to `localStorage.setItem('theme-preference', preference)` on every change, and the initial mount reads from `localStorage.getItem('theme-preference')` before falling back to system preference
- [x] T022 [US3] Verify FOIT prevention in `apps/app/public/theme-init.js` — ensure the script reads the same `theme-preference` key and applies `.dark` class consistently with ThemeProvider's logic (same key name, same resolution rules)

**Checkpoint**: Theme persists across page reloads and browser restarts. No flash of wrong theme on reload.

---

## Phase 6: User Story 4 — Reset to System Preference (Priority: P2)

**Goal**: User can select "System" to resume following OS color scheme in real time.

**Independent Test**: Select a manual theme, then select "System" from the toggle. Toggle OS preference in DevTools — app follows in real time.

### Implementation for User Story 4

_Note: The "System" option is already created in T019 (ThemeToggle) and the matchMedia listener is already implemented in T007 (ThemeProvider). This phase validates the real-time OS tracking works._

- [x] T023 [US4] Verify real-time `matchMedia` listener in `ThemeProvider.tsx` — ensure that when preference is `"system"`, the `matchMedia('(prefers-color-scheme: dark)')` change event listener is active and updates the resolved theme. When preference switches away from `"system"`, the listener must be cleaned up (removed).
- [x] T024 [US4] Verify "System" option in `ThemeToggle.tsx` clears override — selecting "System" should write `"system"` to localStorage (or remove the key entirely) and re-enable the matchMedia listener in ThemeProvider

**Checkpoint**: "System" mode tracks OS preference changes in real time. Switching between manual and system modes works correctly.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and visual refinement

- [x] T025 [P] Handle localStorage unavailability in `ThemeProvider.tsx` — wrap `localStorage.getItem`/`setItem` in try-catch. If unavailable, fall back to system preference detection only; manual selections work during the session but are not persisted.
- [x] T026 [P] Handle missing `prefers-color-scheme` support in `ThemeProvider.tsx` — if `window.matchMedia` is unavailable or returns no match, default to dark mode per spec edge case
- [x] T027 [P] Add `aria-label` and keyboard accessibility to `ThemeToggle.tsx` — verify HeroUI Dropdown provides keyboard navigation (arrow keys, Enter, Escape). Add `aria-label="Theme preference"` to the trigger button. Ensure the current selection is announced to screen readers.
- [x] T028 Review all migrated components for light-mode contrast — visually verify that text, borders, icons, and backgrounds have sufficient contrast (WCAG AA 4.5:1) in light mode. Adjust semantic variable values in `apps/app/src/app.css` if needed.
- [x] T029 Update Lordicon icon colors for theme awareness in `NavLink.tsx`, `SettingsLink.tsx`, `Subheader.tsx`, and `SettingsSidebar.tsx` — ensure icon colors use semantic variables or conditional values that work in both light and dark themes (currently hardcoded to `'white'` and `'#9c9ba0'`)
- [x] T030 Run quickstart.md validation — follow all test scenarios in `specs/031-dark-mode-toggle/quickstart.md` and verify each passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 CSS variables being in place
- **Phase 3 (US1)**: Depends on Phase 2 (ThemeProvider must exist for components to pick up theme)
- **Phase 4 (US2)**: Depends on Phase 2 (needs `useTheme` hook). Can run in parallel with Phase 3.
- **Phase 5 (US3)**: Depends on Phase 2 + Phase 4 (needs ThemeProvider + ThemeToggle to validate persistence)
- **Phase 6 (US4)**: Depends on Phase 2 + Phase 4 (needs ThemeProvider + ThemeToggle to validate system tracking)
- **Phase 7 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2. No dependencies on other stories.
- **US2 (P1)**: Can start after Phase 2. No dependencies on other stories. Can run in parallel with US1.
- **US3 (P1)**: Depends on US2 (needs the toggle to set a manual preference to test persistence).
- **US4 (P2)**: Depends on US2 (needs the toggle to select "System" option).

### Parallel Opportunities

- **Phase 1**: T001 through T006 are sequential (all modify `apps/app/src/app.css` — same file, cannot parallelize)
- **Phase 3**: T012 through T018 can all run in parallel (different component files)
- **Phase 4**: T019 and T020 are sequential (create ThemeToggle, then add to Header)
- **Phase 7**: T025, T026, T027 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all component migrations in parallel (different files):
Task: "Migrate Header.tsx to semantic variables"
Task: "Migrate Subheader.tsx to semantic variables"
Task: "Migrate NavLink.tsx to semantic variables"
Task: "Migrate SettingsLink.tsx to semantic variables"
Task: "Migrate UserMenu.tsx to semantic variables"
Task: "Migrate OrgSwitcher.tsx to semantic variables"
Task: "Migrate SettingsSidebar.tsx to semantic variables"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: CSS Setup (semantic variables)
2. Complete Phase 2: ThemeProvider + FOIT script
3. Complete Phase 3: Migrate components (US1 — system preference works)
4. Complete Phase 4: Add ThemeToggle (US2 — manual override works)
5. **STOP and VALIDATE**: Both themes render correctly, toggle works, no FOIT

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Add US1 (component migration) → System preference detection works
3. Add US2 (toggle) → Manual override works → **MVP complete**
4. Add US3 (persistence validation) → Preference survives restarts
5. Add US4 (system reset) → Real-time OS tracking validated
6. Polish → Edge cases, accessibility, contrast review

---

## Notes

- This feature is **entirely frontend** — no backend, API, database, domain error, or OTel tasks needed
- The dark theme is already the production default; the primary work is defining the light theme and the switching mechanism
- HeroUI components should automatically pick up theme changes via CSS variable inheritance — no per-component HeroUI configuration needed
- The `@heroui/styles` built-in dark variant already handles `prefers-color-scheme` at the CSS level, so the ThemeProvider's `matchMedia` listener is for the React state only (to update the toggle UI indicator)
