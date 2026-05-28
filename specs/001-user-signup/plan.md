# Implementation Plan: User Signup

**Branch**: `001-user-signup` | **Date**: 2026-03-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-user-signup/spec.md`

---

## Summary

Wire the existing `@workos-inc/authkit-nextjs` package (already installed) into `apps/web` to provide:

1. An **unstyled signup button** on the marketing site landing page that redirects to WorkOS AuthKit with `screenHint: 'sign-up'`
2. A **working callback route** (`/auth/callback`) that exchanges the WorkOS authorization code for tokens, sets session cookies, and redirects to `apps/app`
3. A **session endpoint** (`GET /api/auth/session`) on `apps/web` that `apps/app` can call cross-origin to read the current user object

In `apps/app`, the existing stub `useSession()` hook is wired to fetch from the session endpoint. The dashboard route renders the full raw user data object as formatted JSON — or `null` when no session is present. No auth gate, no redirect.

**No backend changes. No database migrations. No new domain packages.**

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20
**Primary Dependencies**:

- `apps/web`: Next.js 15 (App Router), `@workos-inc/authkit-nextjs@^0.7.0` (already installed)
- `apps/app`: React 18+, Vite, TanStack Router, TanStack Query v5

**Storage**: N/A — no database schema changes
**Testing**: Vitest (unit, `apps/app`), Playwright (E2E, `apps/web-e2e`)
**Target Platform**: Browser; Vercel (`nohotfix.com` for `apps/web`, `app.nohotfix.com` for `apps/app`)
**Project Type**: Web application — Next.js marketing + React SPA
**Performance Goals**: User data visible on `apps/app` within 3 seconds of page load (SC-004)
**Constraints**: Signup button MUST carry no custom styles; `apps/app` MUST NOT redirect on missing session
**Scale/Scope**: 5 files modified/created across two apps; 1 new env var per app; 0 new packages

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design._

| #   | Principle                                                                                                                                                | Check    | Notes                                                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I   | **Bounded Context Integrity** — Feature assigned to Identity context; no cross-domain imports; no new domain packages; consumer rules respected          | ✅       | Feature is purely frontend. `apps/web` and `apps/app` are thin-shell apps, not domain packages. No domain package is modified. Identity context owns signup/session conceptually but no domain package logic is introduced.    |
| II  | **Code Quality & Simplicity** — Hexagonal Architecture maintained; named exports; TypeScript strict; no unnecessary abstractions                         | ✅       | `useSession()` is a single-responsibility hook. The session endpoint is a thin 10-line route handler. No helpers, no utilities, no premature abstractions. No HTTP status codes in domain logic (no domain logic exists here). |
| III | **Testing Discipline** — E2E coverage for auth flows (constitution: "Auth flows MUST have E2E coverage in `apps/web-e2e`"); unit test for `useSession()` | ✅       | E2E test planned for full signup flow. Unit test planned for `useSession()` with mocked `fetch`. No state machine logic to test (WorkOS owns state).                                                                           |
| IV  | **UX Consistency** — No polling for session (not a run view); no `beforeLoad` auth guard (spec FR-009 explicitly forbids it); unstyled button            | ✅       | Session is fetched once on mount with `staleTime: 5 min` — no polling. No `beforeLoad` guard added to the dashboard route for this feature. Unstyled button confirmed.                                                         |
| V   | **Run Immutability** — Feature does not touch run data                                                                                                   | ✅ (N/A) | No run tables, no execution context, no immutability guard needed.                                                                                                                                                             |

**Gate: PASS.** No violations requiring justification.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-user-signup/
├── plan.md              # This file
├── research.md          # Phase 0 output — WorkOS SDK patterns, session architecture
├── data-model.md        # Phase 1 output — session object shape, no DB changes
├── quickstart.md        # Phase 1 output — local setup + manual test steps
├── contracts/
│   └── session.md       # GET /api/auth/session contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (created by /speckit.specify)
└── tasks.md             # Phase 2 output (created by /speckit.tasks, not this command)
```

### Source Code — Files Touched

```text
apps/web/
├── src/
│   ├── middleware.ts                          # NEW — authkitMiddleware() for session refresh
│   ├── app/
│   │   ├── page.tsx                           # MODIFY — add unstyled signup button
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts                   # MODIFY — implement handleAuth() + redirect to apps/app
│   │   └── api/
│   │       └── auth/
│   │           └── session/
│   │               └── route.ts               # NEW — returns WorkOS user object with CORS headers

apps/app/
├── src/
│   ├── lib/
│   │   └── session.ts                         # MODIFY — implement useSession() with cross-origin fetch
│   └── routes/
│       └── _authenticated/
│           └── index.tsx                      # MODIFY — render user data as formatted JSON
```

**No changes to**:

- `apps/api/` — no backend changes
- `packages/domains/` — no domain package changes
- `packages/db/` — no schema changes
- `packages/shared/` — no shared type changes

**Structure Decision**: Two-app web application (Next.js marketing + React SPA). All changes are confined to thin-shell files in `apps/web` and `apps/app`. The Hexagonal Architecture is unaffected — there is no domain logic in this feature.

---

## Phase 0: Research (Complete)

See `research.md` for full findings. Summary of decisions:

| Unknown                            | Decision                                                                                    | Rationale                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| WorkOS AuthKit SDK version and API | Use `@workos-inc/authkit-nextjs@^0.7.0` as-is; it is already installed                      | Declared in `apps/web/package.json`; no version change needed                                  |
| Signup button mechanism            | Next.js Server Action calling `signIn({ screenHint: 'sign-up' })` in a `<form>`             | Idiomatic App Router pattern; no client JS; naturally unstyled `<button>`                      |
| Callback implementation            | `handleAuth()` from SDK, with redirect to `https://app.nohotfix.com` after success          | SDK handles token exchange, cookie setting, and state validation                               |
| Session middleware                 | `authkitMiddleware()` in `apps/web/src/middleware.ts`                                       | Required for automatic token refresh; without it sessions expire silently                      |
| Session reading in `apps/app`      | Cross-origin `fetch` to `GET /api/auth/session` with `credentials: 'include'`               | httpOnly cookies prevent client-side token reading; session endpoint is the documented pattern |
| CORS requirement                   | `Access-Control-Allow-Origin: https://app.nohotfix.com` + `Allow-Credentials: true`         | Explicit origin required when `credentials: 'include'` is used                                 |
| `useSession()` return type         | `unknown` for `user` field                                                                  | Spec requires rendering the entire raw object; no field selection                              |
| Dashboard display                  | Modify `_authenticated/index.tsx`; `_authenticated.tsx` remains a passthrough (no redirect) | Avoids routing conflicts; existing route structure is preserved                                |

---

## Phase 1: Design (Complete)

### apps/web — middleware.ts (new)

```typescript
// apps/web/src/middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### apps/web — page.tsx (modify)

Add unstyled signup button using a Server Action. The page remains a Server Component.

```tsx
// apps/web/src/app/page.tsx
// Note: v0.7.0 exports getSignUpUrl (not signIn) — use getSignUpUrl + redirect
import { getSignUpUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

async function handleSignUp() {
  'use server';
  const url = await getSignUpUrl();
  redirect(url);
}

export default function HomePage() {
  return (
    <main>
      <h1>NoHotfix</h1>
      <p>Release readiness, enforced.</p>
      <form action={handleSignUp}>
        <button type="submit">Sign up</button>
      </form>
    </main>
  );
}
```

**Constraint enforced**: No `className`, no `style` prop, no CSS module on the `<button>`.

### apps/web — auth/callback/route.ts (modify)

Replace the skeleton with the SDK handler. Redirect to `apps/app` after success.

```typescript
// apps/web/src/app/auth/callback/route.ts
// Note: returnPathname only accepts a path, NOT a full URL. For cross-domain redirect
// to apps/app, we copy session cookies from handleAuth's response onto our own redirect.
import { handleAuth } from '@workos-inc/authkit-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authResponse = await handleAuth()(request);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.nohotfix.com';
    const redirectResponse = NextResponse.redirect(appUrl);
    authResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### apps/web — api/auth/session/route.ts (new)

```typescript
// apps/web/src/app/api/auth/session/route.ts
// Note: v0.7.0 exports getUser (not getSession). The try-catch handles the case
// where WorkOS env vars are not set (e.g., during next build page data collection).
import { getUser } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.nohotfix.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': APP_URL,
  'Access-Control-Allow-Credentials': 'true',
};

export async function GET(): Promise<NextResponse> {
  try {
    const { user } = await getUser();
    return NextResponse.json(user ?? null, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(null, { headers: CORS_HEADERS });
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
```

### apps/app — lib/session.ts (modify)

Replace the stub with a real TanStack Query hook.

```typescript
// apps/app/src/lib/session.ts
import { useQuery } from '@tanstack/react-query';

const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'https://nohotfix.com';

export function useSession() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<unknown> => {
      const res = await fetch(`${WEB_URL}/api/auth/session`, {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: user !== null && user !== undefined,
  };
}
```

### apps/app — routes/\_authenticated/index.tsx (modify)

```tsx
// apps/app/src/routes/_authenticated/index.tsx
import { createFileRoute } from '@tanstack/react-router';

import { useSession } from '../../lib/session.js';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

### Environment Variables Required

New variables to add to `.env.example`:

```bash
# apps/web — WorkOS AuthKit integration
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_REDIRECT_URI=https://nohotfix.com/auth/callback
NEXT_PUBLIC_APP_URL=https://app.nohotfix.com

# apps/app — Cross-origin session fetch
VITE_WEB_URL=https://nohotfix.com
```

---

## Post-Design Constitution Check

| #   | Principle                 | Check    | Notes                                                                                                                                                         |
| --- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I   | Bounded Context Integrity | ✅       | No domain packages modified. No cross-domain imports introduced.                                                                                              |
| II  | Code Quality & Simplicity | ✅       | All changes are minimal. The session endpoint is 12 lines. `useSession()` is a straightforward `useQuery` hook. No helpers created. Named exports throughout. |
| III | Testing Discipline        | ✅       | Unit test for `useSession()` (mocked fetch). E2E for signup flow (Playwright in `apps/web-e2e`).                                                              |
| IV  | UX Consistency            | ✅       | No polling. No `beforeLoad` guard. Unstyled button. Loading state (`<pre>Loading...</pre>`) present.                                                          |
| V   | Run Immutability          | ✅ (N/A) | Feature does not touch run data.                                                                                                                              |

**Gate: PASS.**
