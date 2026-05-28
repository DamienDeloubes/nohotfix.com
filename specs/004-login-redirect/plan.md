# Implementation Plan: Login Redirect

**Branch**: `004-login-redirect` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-login-redirect/spec.md`

## Summary

Add an unstyled login button to the `apps/web` marketing page that redirects authenticated users directly to the `apps/app` dashboard, or initiates the WorkOS sign-in flow for unauthenticated users. The approach leverages the existing `/auth/login` API route by adding a session-check step: if a valid refresh token cookie exists, redirect to `APP_URL` immediately; otherwise, proceed with the WorkOS authorization redirect. The marketing page simply links to the API login endpoint with `screen_hint=sign-in`.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20, Next.js 15
**Primary Dependencies**: Fastify 5, WorkOS SDK, Next.js (App Router)
**Storage**: N/A (no new data; session state lives in httpOnly cookies on the API domain)
**Testing**: Vitest (unit + integration), Playwright (E2E in `apps/web-e2e/`)
**Target Platform**: Web (desktop + mobile browsers)
**Project Type**: Web application (monorepo: `apps/api` + `apps/web` + `apps/app`)
**Performance Goals**: Login button click to dashboard redirect < 2 seconds
**Constraints**: Cross-domain cookies (API domain holds session); marketing page cannot read httpOnly cookies directly
**Scale/Scope**: 2 files modified (`apps/api/src/routes/auth.ts`, `apps/web/src/app/page.tsx`), 1 integration test, 1 E2E test

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Identity**. No new domain packages. Changes are in `apps/api` (route) and `apps/web` (marketing page). No cross-domain imports. No domain package modifications needed. | PASS |
| II | **Code Quality & Simplicity** — Minimal change: one conditional branch added to existing route handler. No new abstractions. Hexagonal architecture not impacted (no domain logic changes). Error taxonomy respected (`AuthSessionExpiredError` already exists). Named exports maintained. No tenant queries added. | PASS |
| III | **Testing Discipline** — Integration test for the session-check redirect path in `/auth/login`. E2E test for the login button flow in `apps/web-e2e/`. Auth flow is a user-critical path per constitution III. | PASS |
| IV | **UX Consistency** — No terminal states affected. No TanStack Router changes. No polling added. Button is intentionally unstyled per spec. | PASS |
| V | **Run Immutability** — Feature does not touch run data. Not applicable. | N/A |

## Project Structure

### Documentation (this feature)

```text
specs/004-login-redirect/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal — no new entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-login.md    # Updated /auth/login contract
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/api/src/
  routes/
    auth.ts              # MODIFIED: add session-check logic to GET /auth/login

apps/web/src/
  app/
    page.tsx             # MODIFIED: add unstyled login button/link

apps/web-e2e/            # NEW: E2E test for login redirect flow (if not exists)
  login-redirect.spec.ts

apps/api/src/__tests__/  # Integration test for session-check redirect
  auth-login-redirect.spec.ts
```

**Structure Decision**: This feature modifies two existing files and adds test coverage. No new packages, services, or architectural layers needed. The marketing page (`apps/web`) adds a plain anchor link. The API route (`apps/api`) gains a conditional check at the top of the `/auth/login` handler.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
