# Tasks: Login Redirect

**Input**: Design documents from `/specs/004-login-redirect/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, contracts/auth-login.md

**Tests**: Included — auth flows are user-critical paths per constitution III (E2E required).

**Organization**: Tasks grouped by user story. US1 and US2 share the same route handler modification but are tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — project structure, dependencies, and auth infrastructure already exist.

*Skipped — all infrastructure is in place.*

---

## Phase 2: Foundational

**Purpose**: No foundational work needed — `/auth/login` route, cookie handling, and WorkOS SDK integration already exist.

*Skipped — no blocking prerequisites.*

---

## Phase 3: User Story 1 & 2 - Session-Aware Login Redirect (Priority: P1) 🎯 MVP

**Goal**: When a user clicks the login button, check for an existing valid session via the refresh token cookie. If valid, redirect to `APP_URL`. If not, fall through to WorkOS sign-in flow (existing behavior). This single code change satisfies both US1 (authenticated redirect) and US2 (unauthenticated sign-in fallthrough).

**Independent Test**: Click login button with and without an active session; verify authenticated users land on dashboard directly and unauthenticated users see WorkOS sign-in.

### Implementation

- [x] T001 [US1] [US2] Add session-check logic to GET /auth/login handler in apps/api/src/routes/auth.ts — before the existing WorkOS redirect, read the `__rp_refresh` signed cookie; if valid, attempt `authenticateWithRefreshToken()`; on success, update cookies and redirect to `config.APP_URL`; on failure, clear cookies and fall through to existing WorkOS redirect. Follow the contract in specs/004-login-redirect/contracts/auth-login.md.

### Tests

- [x] T002 [US1] [US2] Write integration tests for session-check redirect in apps/api/src/routes/auth.spec.ts (added to existing test file) — test cases: (1) valid refresh cookie → 302 redirect to APP_URL with updated cookies, (2) no cookie → 302 redirect to WorkOS authorization URL, (3) expired/revoked refresh token → cookies cleared + 302 to WorkOS, (4) tampered cookie signature → cookies cleared + 302 to WorkOS.

**Checkpoint**: At this point, the API route handles both authenticated and unauthenticated login flows correctly. Can be verified via direct HTTP requests to `GET /auth/login` with and without cookies.

---

## Phase 4: User Story 3 - Unstyled Login Button on Marketing Page (Priority: P2)

**Goal**: Add an unstyled login anchor link to the marketing page that points to the API login endpoint with `screen_hint=sign-in`.

**Independent Test**: Visit the marketing page and verify the "Log in" link is visible, unstyled, and links to the correct URL.

### Implementation

- [x] T003 [US3] Add unstyled login anchor to apps/web/src/app/page.tsx — add a plain `<a>` tag (no `<button>` wrapper, no CSS classes) with `href="${API_URL}/auth/login?screen_hint=sign-in"` and text "Log in". Place it adjacent to the existing "Sign up" button in the page layout (above the fold / header area). Ensure it is keyboard-focusable and screen-reader friendly by default.

**Checkpoint**: Marketing page shows both "Sign up" (styled button) and "Log in" (unstyled link). Clicking "Log in" navigates to the API login route.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: E2E validation of the full flow across marketing site and API.

- [x] T004 Write E2E test for login redirect flow in apps/web-e2e/tests/login-redirect.spec.ts — test the full browser flow: (1) visit marketing page, verify "Log in" link is visible and unstyled, (2) click "Log in" without session → verify redirect to WorkOS sign-in, (3) after authentication → verify arrival at APP_URL dashboard.
- [ ] T005 Run quickstart.md manual validation — verify both flows (authenticated + unauthenticated) work end-to-end per specs/004-login-redirect/quickstart.md.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 3 (US1+US2)**: No dependencies — can start immediately
- **Phase 4 (US3)**: No dependencies on Phase 3 — can run in parallel
- **Phase 5 (Polish)**: Depends on Phase 3 and Phase 4 completion

### User Story Dependencies

- **US1+US2 (P1)**: Independent — API route change only
- **US3 (P2)**: Independent — marketing page change only. Can be implemented in parallel with US1+US2 since they modify different files.

### Parallel Opportunities

- T001 and T003 can run in parallel (different apps, different files)
- T002 depends on T001 (tests the code T001 introduces)
- T004 depends on both T001 and T003 (E2E tests the full flow)

---

## Parallel Example

```bash
# These can run in parallel (different files):
Task T001: "Add session-check logic in apps/api/src/routes/auth.ts"
Task T003: "Add unstyled login anchor in apps/web/src/app/page.tsx"

# Then sequentially:
Task T002: "Integration tests in apps/api/src/__tests__/auth-login-redirect.spec.ts"
Task T004: "E2E test in apps/web-e2e/login-redirect.spec.ts"
Task T005: "Manual quickstart validation"
```

---

## Implementation Strategy

### MVP First (US1+US2)

1. Complete T001: Session-check logic in auth route
2. Complete T002: Integration tests
3. **STOP and VALIDATE**: Test via direct HTTP requests
4. Deploy if ready — login redirect works even without the marketing page button (can test via direct URL)

### Full Delivery

1. T001 + T003 in parallel → Core functionality complete
2. T002 → Integration tests pass
3. T004 → E2E tests pass
4. T005 → Manual validation

---

## Notes

- Total tasks: 5
- US1+US2 tasks: 2 (T001, T002)
- US3 tasks: 1 (T003)
- Cross-cutting: 2 (T004, T005)
- Parallel opportunities: T001 ∥ T003
- This is a minimal-change feature: 2 existing files modified, 2 test files created
