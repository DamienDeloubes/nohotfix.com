# Implementation Plan: App Logout

**Branch**: `002-app-logout` | **Date**: 2026-03-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-app-logout/spec.md`

## Summary

Add an unstyled logout button to the `apps/app` sidebar that calls the existing `POST /auth/logout` endpoint on `apps/api` to clear the refresh cookie, clears the in-memory access token, invalidates the TanStack Query session cache, and redirects the user to the `apps/web` landing page. A new `VITE_WEB_URL` env var provides the redirect target.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20
**Primary Dependencies**: TanStack Router, TanStack Query, Fastify 5 (existing `POST /auth/logout` route)
**Storage**: N/A (no new data; clears existing cookie + in-memory token)
**Testing**: Vitest (unit for logout function), Playwright (E2E for logout flow)
**Target Platform**: Browser SPA (`apps/app`) + Fastify API (`apps/api`)
**Project Type**: Web application (monorepo: SPA + API + marketing site)
**Performance Goals**: Logout completes (clear + redirect) within 3 seconds (SC-004)
**Constraints**: Cross-origin cookie clearing requires `credentials: 'include'`; redirect target is a different origin (`apps/web`)
**Scale/Scope**: Single button + one exported function + env var addition

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                                                                                                                                                                                                                                                           | Check |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| I   | **Bounded Context Integrity** — Feature is in the **Identity** context. No new domain package logic needed; logout is a client-side session teardown + existing API route call. No cross-domain imports.                                                                                            | PASS  |
| II  | **Code Quality & Simplicity** — No new abstractions. `logout()` is a single exported function in `session.ts`. Named exports used. No HTTP status codes in domain logic. Error taxonomy not affected (no new error codes).                                                                          | PASS  |
| III | **Testing Discipline** — Unit test for `logout()` function (verifies token cleared, API called, cache invalidated). E2E test for logout flow (click button → redirected to landing page).                                                                                                           | PASS  |
| IV  | **UX Consistency** — Logout button in Sidebar (layout component in `apps/app/src/components/layout/`). This is a layout concern, not domain UI, so it lives in `apps/app` — consistent with constitution rule that layout components live in `apps/app/src/components/layout/`. No polling changes. | PASS  |
| V   | **Run Immutability** — Feature does not touch run data. N/A.                                                                                                                                                                                                                                        | PASS  |

## Project Structure

### Documentation (this feature)

```text
specs/002-app-logout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal — no new entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── logout-api.md    # Existing POST /auth/logout contract
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/app/
├── src/
│   ├── lib/
│   │   └── session.ts          # ADD: logout() export
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.tsx     # MODIFY: add logout button
│   └── routes/                 # No changes
├── .env.local                  # ADD: VITE_WEB_URL
└── .env.example                # ADD: VITE_WEB_URL

apps/api/
└── src/
    └── routes/
        └── auth.ts             # NO CHANGES (POST /auth/logout already exists)
```

**Structure Decision**: This feature modifies only `apps/app` (SPA) — adding a `logout()` function to the existing session module and a button to the existing Sidebar layout component. The API endpoint already exists. No new packages or domain modules needed.

## Complexity Tracking

> No violations. Feature is minimal and fits cleanly within existing architecture.
