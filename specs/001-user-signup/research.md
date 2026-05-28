# Research: User Signup (001-user-signup)

**Date**: 2026-03-04
**Branch**: `001-user-signup`

---

## 1. Existing Codebase State

### What already exists

| File                                           | Status      | Notes                                                                                    |
| ---------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `apps/web/src/app/auth/callback/route.ts`      | Skeleton    | Reads `code` from query param but does NOT exchange for tokens, does NOT set cookies     |
| `apps/web/src/app/page.tsx`                    | Placeholder | Plain HTML with a hardcoded link to app subdomain; no signup button                      |
| `apps/app/src/lib/session.ts`                  | Stub        | `useSession()` always returns `{ user: null, isLoading: false, isAuthenticated: false }` |
| `apps/app/src/routes/_authenticated/index.tsx` | Placeholder | Empty dashboard with no session display                                                  |
| `apps/app/src/routes/__root.tsx`               | Skeleton    | Renders Sidebar + Outlet; no session display                                             |
| `@workos-inc/authkit-nextjs`                   | Installed   | `^0.7.0` in `apps/web/package.json`; not yet used in any source file                     |

### Key gap

The WorkOS package is installed but no code calls it. Token exchange, cookie setting, and session reading are all TODO.

---

## 2. WorkOS AuthKit Next.js SDK (v0.7.x)

### Decision

Use `@workos-inc/authkit-nextjs` for all auth operations in `apps/web`. It is already declared as a dependency.

### Required environment variables (apps/web)

| Variable                          | Purpose                                                     |
| --------------------------------- | ----------------------------------------------------------- |
| `WORKOS_CLIENT_ID`                | WorkOS application client ID                                |
| `WORKOS_API_KEY`                  | WorkOS API secret key                                       |
| `WORKOS_REDIRECT_URI`             | Callback URL — must be `https://nohotfix.com/auth/callback` |
| `NEXT_PUBLIC_WORKOS_REDIRECT_URI` | Same as above if needed in client code                      |

### middleware.ts (required by authkit-nextjs for session refresh)

`@workos-inc/authkit-nextjs` requires a Next.js middleware to silently refresh the access token before it expires. Without this, sessions go stale after the initial token TTL.

```typescript
// apps/web/src/middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Callback route

Replace the skeleton with the SDK's handler. The SDK exchanges the authorization code for tokens, sets secure httpOnly cookies, and redirects back to the configured `returnPathname`.

```typescript
// apps/web/src/app/auth/callback/route.ts
import { handleAuth } from '@workos-inc/authkit-nextjs';

// After successful auth, redirect to apps/app
export const GET = handleAuth({ returnPathname: 'https://app.nohotfix.com' });
```

### Signup button in marketing page

The signup button uses a Server Action to initiate the AuthKit flow with `screenHint: 'sign-up'`, which pre-selects the sign-up tab in WorkOS AuthKit.

```tsx
// apps/web/src/app/page.tsx
import { signIn } from '@workos-inc/authkit-nextjs';

async function handleSignUp() {
  'use server';
  await signIn({ screenHint: 'sign-up' });
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

**Styling constraint**: No className, no style prop on the `<button>` — browser default appearance only.

**Rationale**: Server Actions are the idiomatic way to trigger server-side redirects from Server Components in Next.js App Router. Using a `<form>` + `<button type="submit">` with a Server Action is semantically correct and requires no client-side JavaScript.

**Alternatives considered**:

- `<a href={await getSignInUrl({ screenHint: 'sign-up' })}>` — valid but requires fetching the URL in the Server Component and passing it to the anchor. The Server Action form approach keeps the page a pure Server Component without mixing async/await at the component level.
- Client component with `onClick` — adds a Client Component boundary unnecessarily.

### Session endpoint (new, for apps/app to read)

`apps/web` must expose a route that returns the current session's user data. `apps/app` (on `app.nohotfix.com`) will call this cross-origin with `credentials: 'include'`.

```typescript
// apps/web/src/app/api/auth/session/route.ts
import { getSession } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  const user = session?.user ?? null;

  return NextResponse.json(user, {
    headers: {
      'Access-Control-Allow-Origin': 'https://app.nohotfix.com',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://app.nohotfix.com',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
```

**Rationale**: CORS with `credentials: 'include'` requires:

1. An explicit `Access-Control-Allow-Origin` (not `*`)
2. `Access-Control-Allow-Credentials: true`

In local development, the origin is `http://localhost:5173` (Vite dev server). The `NEXT_PUBLIC_APP_URL` env var controls this dynamically.

---

## 3. Session Reading in apps/app

### Decision

`useSession()` in `apps/app/src/lib/session.ts` fetches `GET /api/auth/session` from `apps/web` using cross-origin credentials. This is the pattern described in the frontend architecture doc.

### Required environment variable (apps/app)

| Variable       | Purpose                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------ |
| `VITE_WEB_URL` | Base URL of apps/web; `https://nohotfix.com` in production, `http://localhost:3000` in dev |

### Implementation

```typescript
// apps/app/src/lib/session.ts
import { useQuery } from '@tanstack/react-query';

const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'https://nohotfix.com';

export function useSession() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(`${WEB_URL}/api/auth/session`, {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return res.json() as Promise<unknown>;
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

**Note**: The return type of `user` is `unknown` because the feature requirement is to render the entire raw object verbatim. No schema parsing or field selection is applied.

**Rationale**: Using `unknown` type instead of the existing `SessionUser` interface avoids premature assumptions about the WorkOS user object shape. The spec explicitly requires rendering the entire object.

**Alternatives considered**:

- Decode the JWT access token client-side — requires the access token to be in a non-httpOnly cookie. `authkit-nextjs` uses httpOnly cookies by default. Not viable without configuration changes.
- Share cookies via parent domain `.nohotfix.com` — possible but requires configuring `authkit-nextjs` cookie domain, which is an SDK-level configuration detail better done incrementally.

---

## 4. Dashboard Route in apps/app

### Decision

Modify `apps/app/src/routes/_authenticated/index.tsx` to display session data. The `_authenticated` layout route (`_authenticated.tsx`) must not redirect for this feature — it remains a passthrough layout.

### Rationale

- The existing `_authenticated/index.tsx` registers the `/` path in the SPA — this is the correct route to populate.
- The spec requires no auth gate; `_authenticated.tsx` should not redirect to login for this feature.
- Modifying existing files is preferred over creating new routes to avoid routing conflicts.

### Index route implementation

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

---

## 5. No Backend Changes Required

- No new Fastify routes needed
- No database schema changes (no new tables, no migrations)
- No new domain packages
- The existing `SyncUserFromJWT` use case in the Identity context will automatically create user records when the SPA makes its first authenticated API request — but that is not in scope for this feature

---

## 6. Environment Variables Summary

| App        | Variable              | Value (production)                   | Value (local dev)                     |
| ---------- | --------------------- | ------------------------------------ | ------------------------------------- |
| `apps/web` | `WORKOS_CLIENT_ID`    | From WorkOS dashboard                | From WorkOS dashboard                 |
| `apps/web` | `WORKOS_API_KEY`      | From WorkOS dashboard                | From WorkOS dashboard                 |
| `apps/web` | `WORKOS_REDIRECT_URI` | `https://nohotfix.com/auth/callback` | `http://localhost:3000/auth/callback` |
| `apps/web` | `NEXT_PUBLIC_APP_URL` | `https://app.nohotfix.com`           | `http://localhost:5173`               |
| `apps/app` | `VITE_WEB_URL`        | `https://nohotfix.com`               | `http://localhost:3000`               |
