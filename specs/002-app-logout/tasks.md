# Tasks: App Logout

**Input**: Design documents from `/specs/002-app-logout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit test for `logout()` function included (per plan.md Constitution Check III).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Environment Configuration)

**Purpose**: Add the `VITE_WEB_URL` environment variable needed for post-logout redirect

- [x] T001 [P] Add `VITE_WEB_URL=http://localhost:3000` to `apps/app/.env.local`
- [x] T002 [P] Add `VITE_WEB_URL=http://localhost:3000` with documentation comment to `apps/app/.env.example`

**Checkpoint**: Environment configured — `import.meta.env.VITE_WEB_URL` resolves in apps/app

---

## Phase 2: User Story 1 - Authenticated User Logs Out (Priority: P1) MVP

**Goal**: An authenticated user clicks a logout button, the WorkOS session is terminated (refresh cookie cleared via existing API endpoint), the in-memory token and query cache are cleared, and the user is redirected to the `apps/web` landing page.

**Independent Test**: Log in, click the logout button, verify redirect to `apps/web` landing page. Navigate back to `apps/app` — verify session is gone.

### Tests for User Story 1

- [x] T003 [US1] Write unit test for `logout()` function in `apps/app/src/lib/session.spec.ts` — verify: (1) `POST /auth/logout` called with `credentials: 'include'`, (2) in-memory `accessToken` set to `null` (verify via `getAccessToken()` returning null), (3) TanStack QueryClient `.clear()` called, (4) `window.location.replace()` called with `VITE_WEB_URL` value, (5) local cleanup proceeds even if fetch throws (network failure edge case)

### Implementation for User Story 1

- [x] T004 [US1] Add exported `logout(queryClient: QueryClient)` function to `apps/app/src/lib/session.ts` — fire-and-forget `POST {API_URL}/auth/logout` with `credentials: 'include'` in try/catch (ignore errors), set module-level `accessToken = null`, call `queryClient.clear()`, then `window.location.replace(import.meta.env.VITE_WEB_URL ?? 'https://releasepilot.io')`
- [x] T005 [US1] Add an unstyled logout button to `apps/app/src/components/layout/Sidebar.tsx` — import `logout` from `session.ts`, get `queryClient` via `useQueryClient()` from `@tanstack/react-query`, wire `onClick` to call `logout(queryClient)`. Button text: "Log out"

**Checkpoint**: User Story 1 fully functional — clicking the sidebar button logs user out and redirects to apps/web

---

## Phase 3: User Story 2 - Logout Button Visibility and Accessibility (Priority: P2)

**Goal**: The logout button is positioned at the bottom of the sidebar so it is consistently visible on every page and accessible via keyboard navigation.

**Independent Test**: Navigate to any page in apps/app, verify the logout button is visible at the bottom of the sidebar without scrolling. Tab to the button using keyboard and activate with Enter/Space.

**Depends on**: Phase 2 (US1) — the button and `logout()` function must exist first

### Implementation for User Story 2

- [x] T006 [US2] Update `apps/app/src/components/layout/Sidebar.tsx` layout to use flexbox column with `justify-content: space-between` so the logout button is anchored at the bottom of the sidebar while navigation content sits at the top. Ensure the sidebar has `display: flex`, `flex-direction: column`, `height: 100vh`
- [x] T007 [US2] Verify keyboard accessibility in `apps/app/src/components/layout/Sidebar.tsx` — ensure the logout button is a native `<button>` element (inherently focusable and activatable via Enter/Space), not a `<div>` or `<span>` with click handler

**Checkpoint**: Logout button is persistently visible at the sidebar bottom on all pages, keyboard-navigable

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Verify build passes and feature works end-to-end

- [x] T008 Run `pnpm --filter app test` to verify unit tests pass
- [x] T009 Run `pnpm turbo run build typecheck` to verify no type errors or build failures introduced
- [ ] T010 Run quickstart.md manual validation: log in → click "Log out" → verify redirect to apps/web landing page → navigate back to apps/app → verify unauthenticated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (Phase 1) for `VITE_WEB_URL` env var
- **User Story 2 (Phase 3)**: Depends on User Story 1 (Phase 2) — button must exist before positioning
- **Polish (Phase 4)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 — refines the button placement and accessibility that US1 created

### Within Each User Story

- Tests written FIRST, verified to FAIL before implementation (T003 before T004-T005)
- `logout()` function (T004) before button wiring (T005) — function must exist to import
- US2 layout refinement (T006) after US1 button exists (T005)

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- Within US1: T004 and T005 are sequential (T005 imports from T004)
- Within US2: T006 and T007 are sequential (T007 validates T006's output)

---

## Parallel Example: Phase 1 Setup

```bash
# Launch both env file updates in parallel:
Task: "Add VITE_WEB_URL to apps/app/.env.local"
Task: "Add VITE_WEB_URL to apps/app/.env.example"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (env vars)
2. Complete Phase 2: User Story 1 (logout function + button)
3. **STOP and VALIDATE**: Test logout flow manually
4. Deploy/demo if ready — users can log out

### Incremental Delivery

1. Add Setup → env configured
2. Add User Story 1 → functional logout → Deploy/Demo (MVP!)
3. Add User Story 2 → polished button placement → Deploy/Demo
4. Polish → build verified, tests green

---

## Notes

- The `POST /auth/logout` API endpoint already exists in `apps/api/src/routes/auth.ts:107-110` — no backend work needed
- `logout()` is fire-and-forget on the API call — always proceeds with local cleanup even on network failure
- Use `window.location.replace()` (not `.href`) to prevent back-button returning to unauthenticated app
- Button is intentionally unstyled per plan summary — styling will come with future sidebar navigation work
- Total files modified: 3 (`session.ts`, `Sidebar.tsx`, `.env.local`) + 1 updated (`.env.example`)
