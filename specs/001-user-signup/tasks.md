# Tasks: User Signup

**Input**: Design documents from `specs/001-user-signup/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: E2E tests for the signup auth flow are **constitutionally required** (Constitution §III: "Auth flows MUST have E2E coverage in `apps/web-e2e`"). Unit tests for `useSession()` are included as the hook is a new implementation with branching logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to ([US1]–[US4])

---

## Phase 1: Setup

**Purpose**: Add new environment variables required by WorkOS AuthKit and the cross-origin session endpoint.

- [x] T001 Update `.env.example` at repo root — add `WORKOS_CLIENT_ID=`, `WORKOS_API_KEY=`, `WORKOS_REDIRECT_URI=https://releasepilot.io/auth/callback`, `NEXT_PUBLIC_APP_URL=https://app.releasepilot.io`, `VITE_WEB_URL=https://releasepilot.io` with inline comments describing each

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by all four user stories. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: All four phases depend on T002–T005 completing first.

- [x] T002 Create `apps/web/src/middleware.ts` — export `authkitMiddleware()` as default from `@workos-inc/authkit-nextjs` with a matcher config that covers all paths except `_next/static`, `_next/image`, and `favicon.ico`; this enables automatic token refresh for all Next.js routes

- [x] T003 [P] Create `apps/web/src/app/api/auth/session/route.ts` — implement `GET` handler that calls `getSession()` from `@workos-inc/authkit-nextjs` and returns `NextResponse.json(session?.user ?? null)` with `Access-Control-Allow-Origin` set to `process.env.NEXT_PUBLIC_APP_URL` and `Access-Control-Allow-Credentials: true`; implement matching `OPTIONS` handler for CORS preflight with same headers and `Access-Control-Allow-Methods: GET, OPTIONS`

- [x] T004 [P] Modify `apps/app/src/lib/session.ts` — replace the stub `useSession()` function with a real implementation that uses `useQuery` from `@tanstack/react-query` with `queryKey: ['session']`, fetches `${import.meta.env.VITE_WEB_URL ?? 'https://releasepilot.io'}/api/auth/session` with `credentials: 'include'`, returns `null` on non-OK response, sets `staleTime: 5 * 60 * 1000` and `retry: false`; return type for `user` must be `unknown` (not `SessionUser`) to match verbatim render requirement

- [x] T005 Modify `apps/app/src/routes/_authenticated.tsx` — remove or disable any session-based redirect logic so the layout becomes a passthrough; this is required by FR-007/FR-009 (apps/app MUST NOT redirect unauthenticated visitors for this feature); the component should render `<Outlet />` without any `beforeLoad` guard or redirect

**Checkpoint**: Foundation ready — all auth infrastructure is wired. User story implementation can now begin.

---

## Phase 3: User Story 1 — New Visitor Completes Signup (Priority: P1) 🎯 MVP

**Goal**: Visitor clicks unstyled signup button on marketing site → WorkOS AuthKit signup flow → redirected to apps/app → sees raw user data as formatted JSON.

**Independent Test**: Visit `http://localhost:3000`, click the signup button, complete the WorkOS form, confirm you land on `http://localhost:5173` and see a `<pre>` block containing formatted JSON with the user object.

### E2E Test (constitutionally required — auth flows MUST have Playwright coverage)

- [x] T006 [US1] Create `apps/web-e2e/tests/signup.spec.ts` — Playwright test that: (1) navigates to `/`, (2) asserts an unstyled `button[type="submit"]` is visible with no `class` or `style` attributes, (3) clicks it, (4) asserts redirect to WorkOS AuthKit URL (verify URL contains `workos.com` or configured AuthKit domain), (5) stubs or skips the WorkOS form step with a test account, (6) asserts final URL is `app.releasepilot.io` or `localhost:5173`, (7) asserts a `<pre>` element on the page contains parseable JSON with an `id` or `email` field

### Implementation

- [x] T007 [P] [US1] Modify `apps/web/src/app/page.tsx` — replace placeholder content with a Server Component that: (1) defines a `handleSignUp` async function marked with `'use server'` that calls `signIn({ screenHint: 'sign-up' })` from `@workos-inc/authkit-nextjs`, (2) renders a `<form action={handleSignUp}>` containing a `<button type="submit">Sign up</button>` with **no** `className`, **no** `style` prop, and no CSS module reference — browser-default styling only

- [x] T008 [US1] Modify `apps/web/src/app/auth/callback/route.ts` — replace the entire skeleton with `export const GET = handleAuth({ returnPathname: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.releasepilot.io' })` imported from `@workos-inc/authkit-nextjs`; remove the TODO comment, the manual `code` parsing, and the hard-coded redirect

- [x] T009 [US1] Modify `apps/app/src/routes/_authenticated/index.tsx` — import `useSession` from `../../lib/session.js`; render a loading state (`<pre>Loading...</pre>`) while `isLoading` is true; render `<pre>{JSON.stringify(user, null, 2)}</pre>` once loaded; no conditional checks on `user` content — render null verbatim when no session

- [x] T010 [US1] Complete and verify E2E test `apps/web-e2e/tests/signup.spec.ts` — run `pnpm turbo run test:e2e --filter=@releasepilot/web-e2e` and confirm all assertions in T006 pass end-to-end; document any WorkOS test account setup required in a comment at the top of the spec file

**Checkpoint**: US1 fully functional. A new visitor can sign up and see their user data on apps/app.

---

## Phase 4: User Story 2 — Auth-Agnostic Marketing Site (Priority: P2)

**Goal**: A signed-in user visiting the marketing site sees the exact same page as an unauthenticated visitor — no redirect, no session-aware UI.

**Independent Test**: After signing up (US1 complete), navigate back to `http://localhost:3000` in the same browser. The page should show the same heading, tagline, and signup button — no redirect to apps/app occurs.

### Implementation

- [x] T011 [US2] Review `apps/web/src/middleware.ts` created in T002 — add an inline comment confirming that `authkitMiddleware()` does NOT redirect authenticated users at `/`; it only refreshes tokens silently; this comment serves as the explicit documentation that US2's non-redirect behaviour is the default SDK behaviour, not a custom implementation

### E2E Test

- [x] T012 [US2] Add test case to `apps/web-e2e/tests/signup.spec.ts` — after completing the signup flow (reuse session or use a pre-authenticated state), navigate back to `/` and assert: (1) the page title or heading is visible, (2) the signup `<button>` is still present, (3) the current URL has NOT changed to `app.releasepilot.io`, (4) no redirect has occurred

**Checkpoint**: US2 verified. Signed-in users visiting the marketing site see the same page as visitors.

---

## Phase 5: User Story 3 — Returning User Accesses Application Directly (Priority: P3)

**Goal**: A user with an active WorkOS session who navigates directly to apps/app sees their user data as formatted JSON without any prompt.

**Independent Test**: Sign up (or use an existing session), open `http://localhost:5173` in a fresh tab — the `<pre>` block immediately shows the user JSON without any login prompt.

### Unit Tests

- [x] T013 [US3] Create `apps/app/src/lib/session.spec.ts` — write Vitest unit test for `useSession()` authenticated case: mock `fetch` (using `vi.fn()`) to return a `Response` with `{ id: 'user_test', email: 'test@example.com' }` and status `200`; assert that `useSession()` returns `{ user: { id: 'user_test', email: 'test@example.com' }, isLoading: false, isAuthenticated: true }`

### E2E Test

- [x] T014 [US3] Create `apps/app-e2e/tests/session-display.spec.ts` — Playwright test for the authenticated case: use a pre-authenticated browser context (storage state from US1 E2E), navigate to `/`, assert `<pre>` element is visible and its text content is valid parseable JSON containing an `email` field

**Checkpoint**: US3 verified. Returning authenticated users see their data on direct app access.

---

## Phase 6: User Story 4 — Unauthenticated User Visits Application (Priority: P4)

**Goal**: A visitor with no session opens apps/app and sees `null` rendered in the `<pre>` block — no error, no redirect, no login wall.

**Independent Test**: Open `http://localhost:5173` in a private/incognito window — the `<pre>` element shows `null` and the URL does not change.

### Unit Tests

- [x] T015 [P] [US4] Add test case to `apps/app/src/lib/session.spec.ts` — unauthenticated case: mock `fetch` to return a `Response` with body `null` and status `200`; assert `useSession()` returns `{ user: null, isLoading: false, isAuthenticated: false }`. Also add a network-failure case: mock `fetch` to return a non-OK response (status `401`) and assert `useSession()` returns `{ user: null, isAuthenticated: false }`

### E2E Test

- [x] T016 [US4] Add test case to `apps/app-e2e/tests/session-display.spec.ts` — unauthenticated case: open a fresh browser context (no storage state), navigate to `/`, assert: (1) `<pre>` element is visible with text content `null`, (2) current URL is still `/` (no redirect), (3) no error message or login button is visible

**Checkpoint**: US4 verified. Unauthenticated visitors see `null` with no redirect or error.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T017 [P] Run `pnpm turbo run typecheck build` from repo root — confirm all 14 tasks in the build pipeline pass with zero TypeScript errors; resolve any type inference issues in `useSession()` return type or `handleSignUp` Server Action

- [x] T018 [P] Validate `quickstart.md` — follow all steps in `specs/001-user-signup/quickstart.md` manually; verify each step produces the described outcome; update the troubleshooting table in quickstart.md if any new failure modes are discovered

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundational) — blocks all user story phases
            ├── Phase 3 (US1 — P1) — MVP, implement first
            ├── Phase 4 (US2 — P2) — depends on Phase 3 (reuses signup E2E test)
            ├── Phase 5 (US3 — P3) — can start after Phase 2
            └── Phase 6 (US4 — P4) — can start after Phase 2
                    └── Phase 7 (Polish) — after all user stories
```

### User Story Dependencies

- **US1 (P1)**: Requires Foundational (T002–T005). No other story dependency. **Start here.**
- **US2 (P2)**: Requires Foundational + US1 (reuses signup E2E test from T006/T010). Lightweight — mostly documentation and one E2E assertion.
- **US3 (P3)**: Requires Foundational only. Implementation already done in T004+T009. Phase 5 adds unit test + E2E.
- **US4 (P4)**: Requires Foundational only. Implementation already done in T004+T009. Phase 6 adds unit test + E2E.

### Within Each Phase

- T002, T003, T004 can all run in parallel (different files, no shared dependencies)
- T007, T008, T009 (Phase 3 implementation) can all run in parallel after T005
- T013, T015 (unit tests) can run in parallel since they add to the same spec file sequentially, but test cases don't conflict
- T014, T016 (E2E tests) can run in parallel — they're in the same spec file but separate `test()` blocks

---

## Parallel Opportunities

### Phase 2 (Foundational) — all three can start at once:

```
Task: "Create apps/web/src/middleware.ts" (T002)
Task: "Create apps/web/src/app/api/auth/session/route.ts" (T003)
Task: "Modify apps/app/src/lib/session.ts" (T004)
```

### Phase 3 (US1) — after T005 completes:

```
Task: "Modify apps/web/src/app/page.tsx" (T007)
Task: "Modify apps/web/src/app/auth/callback/route.ts" (T008)
Task: "Modify apps/app/src/routes/_authenticated/index.tsx" (T009)
```

### Phase 5+6 — all after Foundational:

```
Task: "Create session.spec.ts authenticated case" (T013)
Task: "Create session-display.spec.ts authenticated E2E" (T014)
Task: "Add session.spec.ts unauthenticated case" (T015)
Task: "Add session-display.spec.ts unauthenticated E2E" (T016)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1** — add env vars
2. Complete **Phase 2** — wire authkit middleware, session endpoint, useSession hook, remove auth redirect
3. Complete **Phase 3** — signup button, callback, dashboard display, E2E test
4. **STOP and VALIDATE**: Open browser, sign up, confirm JSON appears on apps/app
5. This alone satisfies FR-001 through FR-009 and SC-001 through SC-004

### Incremental Delivery

1. Setup + Foundational → Auth infrastructure wired
2. US1 complete → **MVP: full signup flow works end-to-end** ✓
3. US2 complete → Marketing site verified as auth-agnostic ✓
4. US3 + US4 complete → App session display verified for all states ✓
5. Polish → TypeScript clean, quickstart validated

### Single-Developer Order

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
     → T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018
```

---

## Notes

- `[P]` tasks modify different files and have no incomplete task dependencies — safe to parallelize
- Each user story has its own test (E2E or unit) that verifies the story in isolation
- No backend tasks — `apps/api` is untouched
- No database migrations — `packages/db` is untouched
- The `_authenticated.tsx` passthrough (T005) is the most critical task — without it, US4 (unauthenticated visit) will silently redirect and appear broken
- WorkOS test accounts may need to be created in the WorkOS dashboard before E2E tests (T006) can run against a real signup flow
