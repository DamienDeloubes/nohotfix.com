# Feature Specification: Dark Mode / Light Mode Toggle

**Feature Branch**: `031-dark-mode-toggle`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "I want to implement a light mode/dark mode toggle to my app. The default theme should be based on the user machine preference. The dark mode/light classes should fully utilize the tailwind theming options based on tailwind 4.2 and use css for the env variables"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Theme from System Preference (Priority: P1)

A user opens the app for the first time. The app detects their operating system's color scheme preference (dark or light) and renders the UI in the matching theme. The user sees a familiar look that matches the rest of their desktop environment without any manual action.

**Why this priority**: This is the foundational behavior. Without system preference detection, there is no intelligent default and the feature has no starting point.

**Independent Test**: Can be fully tested by toggling the OS color scheme preference and reloading the app. The app should render in the correct theme on first load.

**Acceptance Scenarios**:

1. **Given** a user has their OS set to dark mode, **When** they open the app for the first time, **Then** the app renders in the dark theme.
2. **Given** a user has their OS set to light mode, **When** they open the app for the first time, **Then** the app renders in the light theme.
3. **Given** a user has no explicit OS color scheme preference (or their OS does not support it), **When** they open the app, **Then** the app defaults to dark mode.

---

### User Story 2 - Manual Theme Toggle (Priority: P1)

A user wants to override their system preference and switch between dark and light mode manually. They locate a toggle control in the app's navigation and click it to switch themes. The entire UI updates instantly without a page reload.

**Why this priority**: Equally critical to P1 — users must be able to override the system default. Some users prefer dark mode at home and light mode at work, or vice versa.

**Independent Test**: Can be fully tested by clicking the theme toggle and verifying all UI surfaces update to the selected theme.

**Acceptance Scenarios**:

1. **Given** the app is in dark mode, **When** the user clicks the theme toggle, **Then** the app switches to light mode immediately.
2. **Given** the app is in light mode, **When** the user clicks the theme toggle, **Then** the app switches to dark mode immediately.
3. **Given** the user toggles the theme, **When** the transition occurs, **Then** there is no flash of unstyled content, layout shift, or visible flicker.

---

### User Story 3 - Theme Preference Persistence (Priority: P1)

A user manually selects a theme. They close the browser tab and later return to the app. The app remembers their manual choice and renders in the theme they previously selected, even if their OS preference has changed since.

**Why this priority**: Without persistence, the manual toggle is frustrating — users would have to re-select their preference on every visit.

**Independent Test**: Can be tested by selecting a theme, closing the tab, reopening the app, and verifying the previously selected theme is restored.

**Acceptance Scenarios**:

1. **Given** a user manually selected light mode, **When** they close and reopen the app, **Then** the app renders in light mode.
2. **Given** a user manually selected dark mode but their OS preference is light, **When** they reopen the app, **Then** the app renders in dark mode (manual choice overrides system).
3. **Given** a user has never manually selected a theme (no stored preference), **When** they open the app, **Then** the system preference is used.

---

### User Story 4 - Reset to System Preference (Priority: P2)

A user previously overrode their system preference but now wants to go back to following the OS setting automatically. They can reset their theme preference so the app resumes tracking the system color scheme.

**Why this priority**: Important for usability but not blocking — users can work around this by manually toggling to match their OS. Adds polish.

**Independent Test**: Can be tested by selecting a manual theme, then choosing "System" option, and verifying the app follows the OS preference again.

**Acceptance Scenarios**:

1. **Given** a user has a stored manual preference, **When** they select "System" from the theme options, **Then** the app reverts to following the OS color scheme.
2. **Given** the user is set to "System" mode and their OS switches from dark to light, **When** the OS change occurs, **Then** the app follows the change in real time.

---

### Edge Cases

- What happens when the user's browser does not support `prefers-color-scheme`? The app defaults to dark mode.
- What happens if localStorage is unavailable (private browsing in some browsers)? The app falls back to system preference detection only; manual selections are not persisted but still work during the session.
- What happens during the initial page load before the theme is resolved? The app must avoid a flash of incorrect theme (FOIT). The correct theme class should be applied before the first paint.
- What happens to HeroUI components when the theme changes? All HeroUI components must respect the theme class and update their styling accordingly.
- What happens to third-party or embedded content that doesn't support theming? It is left as-is; only app-owned surfaces are themed.

## Requirements *(mandatory)*

### Non-Functional Requirements (standing -- from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

*Note: This feature is frontend-only. NFR-ERR and NFR-OBS apply only if backend changes are introduced (unlikely for this feature).*

### Functional Requirements

- **FR-001**: The app MUST detect the user's operating system color scheme preference on initial load using the `prefers-color-scheme` media query.
- **FR-002**: The app MUST default to dark mode when no system preference is detectable or when the system preference is indeterminate.
- **FR-003**: The app MUST provide a visible toggle control in the top navigation bar that allows the user to switch between dark mode, light mode, and system preference.
- **FR-004**: The toggle MUST offer three states: "Light", "Dark", and "System" (follow OS preference).
- **FR-005**: When the user selects a theme manually (Light or Dark), the app MUST apply the selected theme immediately without a full page reload.
- **FR-006**: The app MUST persist the user's theme preference in browser local storage so it survives tab/browser restarts.
- **FR-007**: On app load, the app MUST check for a stored preference first. If a stored preference exists (Light or Dark), it MUST be used. If the stored preference is "System" or no preference is stored, the OS preference MUST be used.
- **FR-008**: When set to "System" mode, the app MUST respond to real-time OS preference changes (e.g., the user switches their OS from dark to light while the app is open).
- **FR-009**: The theme MUST be implemented using Tailwind CSS v4.2's CSS-first theming approach with CSS custom properties defined in the app's CSS entry file.
- **FR-010**: Dark mode and light mode MUST each define a complete set of CSS custom properties (colors, surfaces, borders, shadows) so all UI surfaces update consistently.
- **FR-011**: The dark theme MUST use the existing brand identity dark palette (Base-950 through Base-600, glass system, dark shadows) as already defined in the app.
- **FR-012**: The light theme MUST use the brand identity light palette values (Base-50 through Base-300 for surfaces, Slate-50/100 for backgrounds, Slate-900 for text).
- **FR-013**: All HeroUI components MUST respect the active theme and update their appearance accordingly when the theme changes.
- **FR-014**: The theme switch MUST NOT cause any flash of unstyled or incorrectly-themed content during initial page load.
- **FR-015**: The theme toggle control MUST be accessible via keyboard navigation and announce the current/selected state to screen readers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see the correct theme (matching their OS preference) on first visit within 100ms of first paint, with no visible flash of the wrong theme.
- **SC-002**: Theme switching via the toggle completes visually in under 200ms with no layout shift.
- **SC-003**: The user's manual theme choice persists across 100% of browser restarts (when localStorage is available).
- **SC-004**: All existing UI surfaces (navigation, sidebar, content area, cards, dropdowns, modals) correctly reflect both dark and light themes with readable contrast.
- **SC-005**: The toggle is discoverable -- users can find and use the theme switcher without instructions.
- **SC-006**: Real-time OS preference changes are reflected in the app within 1 second when set to "System" mode.

## Assumptions

- Theme preference is stored client-side only (localStorage). There is no server-side or database persistence of theme preference -- it is a per-browser setting.
- The dark theme is already the production default and fully styled. This feature adds the light theme variant and the switching mechanism.
- The brand identity document already defines light-mode color values (Base-50 through Base-300, Slate-50/100/300), so no new color design work is needed.
- HeroUI's dark mode support is compatible with Tailwind v4's class-based dark mode strategy via the existing `@custom-variant dark (&:is(.dark *))` configuration.
