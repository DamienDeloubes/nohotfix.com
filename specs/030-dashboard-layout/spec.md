# Feature Specification: App Shell & Dashboard Layout

**Feature Branch**: `030-dashboard-layout`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Style the logged-in user areas with a production-ready app shell following the brand identity system, replacing the current unstyled inline-style layout."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Navigate the app using the top navigation bar (Priority: P1)

A logged-in user lands on any page and sees a fixed top navigation bar with the NoHotfix logo, their organisation name, and primary navigation links (Dashboard, Runs, Playbooks, Spec Library, History). The user clicks any nav link and is taken to the corresponding page. The active page is visually highlighted. Navigation icons animate on hover.

**Why this priority**: The top nav is the primary navigation surface for the entire application. Without it, users cannot move between sections. This replaces the current unstyled sidebar-based navigation.

**Independent Test**: Can be fully tested by logging in and clicking each navigation link — the user can reach every major section of the app and always knows where they are.

**Acceptance Scenarios**:

1. **Given** a logged-in user on any page, **When** they look at the top of the screen, **Then** they see a fixed navigation bar with the NoHotfix logo, organisation name, and five primary navigation links with icons.
2. **Given** a logged-in user on the Dashboard page, **When** they look at the "Dashboard" nav link, **Then** it is visually highlighted as the active link (distinct color and/or indicator).
3. **Given** a logged-in user hovering over a nav link, **When** the mouse enters the link area, **Then** the Lordicon icon plays its animation once; the animation completes fully even if the mouse leaves before it finishes.
4. **Given** a logged-in user on the Runs page, **When** they click "Playbooks" in the top nav, **Then** they are navigated to the Playbooks list page.
5. **Given** a logged-in user on any page, **When** they scroll the content area down past 40px, **Then** the top nav transitions to a frosted glass background with a subtle bottom border.

---

### User Story 2 - Access user menu and sign out (Priority: P2)

A logged-in user clicks their avatar in the top-right corner of the navigation bar. A dropdown menu appears showing their name, email, a link to account settings, and a sign-out button. The user can sign out from any page.

**Why this priority**: Account access and sign-out are essential for every authenticated session. This is the second most important navigation element after primary nav links.

**Independent Test**: Can be fully tested by clicking the avatar icon, verifying the dropdown contents, navigating to account settings, and signing out.

**Acceptance Scenarios**:

1. **Given** a logged-in user on any page, **When** they click their avatar circle in the top-right, **Then** a dropdown menu appears showing their display name (non-interactive), email (muted text), a divider, an "Account settings" link, and a "Sign out" button.
2. **Given** the user menu is open, **When** the user clicks "Account settings", **Then** they are navigated to the account settings page.
3. **Given** the user menu is open, **When** the user clicks "Sign out", **Then** they are logged out and redirected to the login page.
4. **Given** the user menu is open, **When** the user clicks outside the menu or presses Escape, **Then** the menu closes.
5. **Given** a user with no profile image, **When** the avatar is rendered, **Then** it shows a circle with the user's initials (first letter of first name + first letter of last name) on a colored background.

---

### User Story 3 - Switch between organisations (Priority: P2)

A user who belongs to multiple organisations sees their current organisation name next to the logo. They click it and a dropdown appears listing all their organisations. Selecting a different organisation navigates them to that organisation's dashboard.

**Why this priority**: Multi-org users need to switch context without logging out. This is critical for users managing multiple teams but is P2 because most early users will have a single org.

**Independent Test**: Can be tested by having a user with multiple org memberships click the org name and switch between orgs.

**Acceptance Scenarios**:

1. **Given** a user who belongs to one organisation, **When** they look at the top nav, **Then** they see their organisation name displayed as static text next to the logo (no dropdown indicator).
2. **Given** a user who belongs to multiple organisations, **When** they look at the top nav, **Then** they see their current organisation name as a clickable element with a dropdown indicator.
3. **Given** a multi-org user clicks the org name, **When** the dropdown opens, **Then** it lists all organisations they belong to, with the current one visually indicated (checkmark or highlight).
4. **Given** the org switcher is open, **When** the user clicks a different organisation, **Then** they are navigated to that organisation's dashboard page.

---

### User Story 4 - Navigate settings with a contextual sidebar (Priority: P3)

A user navigates to the Settings section. A contextual sidebar appears on the left, below the top nav, showing grouped navigation: Organisation (General, Members, Environments, Billing) and Account (Account settings). The user can navigate between settings sub-pages using the sidebar.

**Why this priority**: Settings sub-navigation is important but used less frequently than primary navigation. It validates the contextual sidebar pattern that will also be used for the Playbook Editor.

**Independent Test**: Can be tested by navigating to Settings and clicking through each sidebar link to verify the correct page loads.

**Acceptance Scenarios**:

1. **Given** a logged-in user clicks the Settings gear icon in the top nav, **When** the settings page loads, **Then** a sidebar appears on the left below the top nav with grouped navigation items.
2. **Given** a user is on the Settings page, **When** they look at the sidebar, **Then** they see two groups: "Organisation" (General, Members, Environments, Billing) and "Account" (Account settings), each with Lordicon icons.
3. **Given** a user is on Settings > General, **When** they click "Members" in the sidebar, **Then** the content area updates to show the Members page; the "Members" sidebar link is highlighted as active.
4. **Given** a user navigates to a non-settings page (e.g. Dashboard), **When** the page loads, **Then** no sidebar is displayed; the content area spans the full width below the top nav.

---

### User Story 5 - Experience the branded visual design (Priority: P3)

A logged-in user experiences the application with the brand identity applied: dark-mode surfaces with blue-violet undertones, glass card treatments, Inter typography, branded color tokens, and smooth hover/transition animations. The visual quality communicates professionalism and trust.

**Why this priority**: Visual polish is what transforms a functional prototype into a product users trust. While the app works without styling, the brand experience is essential before any user-facing launch.

**Independent Test**: Can be tested by visually inspecting the application against the brand identity document, verifying colors, typography, spacing, and animations match the design tokens.

**Acceptance Scenarios**:

1. **Given** a logged-in user on any page, **When** they view the app, **Then** the page background uses the brand's dark base surface colors (deep blue-violet tones).
2. **Given** a logged-in user hovers over an interactive element, **When** the hover animation plays, **Then** transitions use the brand's easing curves and duration tokens (smooth, not jarring).
3. **Given** a logged-in user views any text in the application, **When** they inspect the typography, **Then** it uses the Inter font family at the correct weights and sizes from the brand type scale.

---

### Edge Cases

- What happens when a user's name is empty or missing? The avatar should fall back to a generic icon or single-letter initial.
- What happens when the organisation name is very long (50+ characters)? It should be truncated with an ellipsis in the top nav to prevent layout overflow.
- What happens when a user has no organisations? This should not occur in normal flow (signup creates an org), but if it does, the user should see a meaningful empty state rather than a broken layout.
- What happens when the user resizes the browser to exactly 1024px width? The layout should still be fully functional with no horizontal scrolling or overlapping elements.
- What happens when a nav link's route is not yet implemented? The link should still navigate to the route, which renders its own placeholder/empty state. The nav should not break.

## Requirements _(mandatory)_

### Non-Functional Requirements (standing — from constitution)

- **NFR-ERR**: All new error paths MUST use `DOMAIN_CATEGORY_SPECIFIC` error codes registered in `packages/shared/src/errors/codes.ts`. Domain error classes MUST be created in `packages/domains/<ctx>/src/errors/`. Ad-hoc string errors are forbidden.
- **NFR-OBS**: All new service methods MUST emit OTel spans with domain-relevant attributes. DB queries exceeding 100ms MUST emit a span annotation. Follow existing span naming patterns from `SnapshotService`, `ArtifactGateService`, and `DecisionService`.

### Functional Requirements

- **FR-001**: The application MUST render a fixed top navigation bar on every authenticated page, containing the logo, organisation name, primary navigation links, a settings icon, and a user avatar.
- **FR-002**: The top navigation bar MUST display five primary navigation links: Dashboard, Runs, Playbooks, Spec Library, and History, each with an animated Lordicon icon.
- **FR-003**: The active navigation link MUST be visually distinguished from inactive links (e.g. highlighted text color, background indicator, or underline).
- **FR-004**: Each Lordicon icon MUST play its animation on mouse hover and always complete the full animation cycle before becoming re-triggerable.
- **FR-005**: The top navigation bar MUST transition to a frosted glass background when the user scrolls past 40px, using a smooth animation.
- **FR-006**: The user avatar MUST display the user's initials (first letter of first name + first letter of last name) in a colored circle when no profile image is available.
- **FR-007**: Clicking the user avatar MUST open a dropdown menu containing the user's name (display only), email (muted, display only), an "Account settings" link, and a "Sign out" button.
- **FR-008**: The user menu dropdown MUST close when the user clicks outside it or presses the Escape key.
- **FR-009**: Clicking "Sign out" in the user menu MUST log the user out and redirect them to the login page.
- **FR-010**: For users belonging to a single organisation, the organisation name MUST be displayed as static text next to the logo.
- **FR-011**: For users belonging to multiple organisations, the organisation name MUST be a clickable dropdown that lists all organisations the user belongs to, with the current organisation visually indicated.
- **FR-012**: Selecting a different organisation from the switcher MUST navigate the user to the dashboard of the selected organisation.
- **FR-013**: Settings pages MUST render a contextual sidebar below the top nav with grouped navigation: Organisation (General, Members, Environments, Billing) and Account (Account settings).
- **FR-014**: Sidebar navigation items MUST include Lordicon icons (smaller than top nav icons) with the same hover-to-animate behaviour.
- **FR-015**: Pages without contextual sub-navigation (Dashboard, Runs list, Playbook list, Spec Library, History, etc.) MUST render their content in the full width below the top nav, with no sidebar.
- **FR-016**: The content area MUST scroll independently of the fixed top nav and fixed/sticky sidebar.
- **FR-017**: The content area MUST have consistent inner padding and a reasonable maximum width on wide screens to maintain readability.
- **FR-018**: The application MUST apply the brand identity's dark-mode color palette, typography (Inter), spacing tokens, border radii, shadow scale, and animation curves throughout all layout components.
- **FR-019**: The layout MUST be fully functional on desktop screens 1024px and wider, with no horizontal scrolling or overlapping elements.
- **FR-020**: Long organisation names (50+ characters) MUST be truncated with an ellipsis to prevent layout overflow in the top nav.
- **FR-021**: Lordicon icons MUST be self-hosted (loaded as JSON files), not loaded from an external CDN.
- **FR-022**: The settings gear icon in the top nav MUST navigate to the General settings page and MUST animate on hover.
- **FR-023**: The app shell MUST support an optional sidebar slot so that specific route layouts (Settings, Playbook Editor) can inject their own sidebar content without affecting other pages.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can navigate to any primary section (Dashboard, Runs, Playbooks, Spec Library, History) within a single click from any page.
- **SC-002**: Users can identify which page they are currently on by visual active-state indicators in under 1 second.
- **SC-003**: Users can sign out from any page within 2 clicks (avatar click + sign out click).
- **SC-004**: Multi-org users can switch organisations within 3 clicks (org name click + select org).
- **SC-005**: The layout renders without visual breakage on all viewport widths from 1024px to 2560px.
- **SC-006**: All hover animations complete smoothly without visible frame drops or layout shifts.
- **SC-007**: 100% of brand identity color tokens, typography, and spacing values are correctly applied across all layout components (verifiable against brand-identity.md).
- **SC-008**: The settings contextual sidebar correctly highlights the active sub-page and enables navigation between all settings pages.

## Assumptions

- The existing `useUserOrganisations` hook provides the list of organisations the user belongs to, including org name and slug.
- The existing session/auth context provides the user's display name, email, first name, and last name for the avatar and user menu.
- Lordicon JSON icon files will be selected and downloaded during implementation from the Lordicon library.
- The Playbook Editor sidebar (mentioned as another contextual sidebar user) is out of scope for this feature — only the Settings sidebar is implemented here. The sidebar slot pattern established here will be reused by the Playbook Editor feature later.
- No backend API changes are required for this feature — all data needed (user info, org list, nav routes) is already available on the frontend.
- HeroUI component library will be integrated as part of this feature for reusable UI primitives (dropdowns, buttons, etc.).
- Tailwind CSS v4.2 will be set up from scratch since the current installation (v3.4) is unconfigured and unused.
