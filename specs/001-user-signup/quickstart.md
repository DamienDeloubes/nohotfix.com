# Quickstart: User Signup (001-user-signup)

**Date**: 2026-03-04

---

## Prerequisites

1. WorkOS account with an application configured:
   - Redirect URI set to `https://nohotfix.com/auth/callback` (production)
   - Redirect URI set to `http://localhost:3000/auth/callback` (local)
2. Create `apps/web/.env.local` with the following (the WorkOS SDK requires these at startup):

```bash
# apps/web/.env.local  (gitignored — do not commit)
WORKOS_CLIENT_ID=client_...
WORKOS_API_KEY=sk_...
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
WORKOS_COOKIE_PASSWORD=<random string, min 32 characters>
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

3. Create `apps/app/.env.local` with:

```bash
# apps/app/.env.local  (gitignored — do not commit)
VITE_WEB_URL=http://localhost:3000
```

> **Note**: These env files are gitignored. In CI/CD, set these as environment secrets. The `WORKOS_COOKIE_PASSWORD` must be at least 32 characters (used to encrypt session cookies).

---

## Local Development

Start both apps concurrently from the repo root:

```bash
pnpm turbo run dev --filter=@nohotfix/web --filter=@nohotfix/app
```

- `apps/web` runs on `http://localhost:3000`
- `apps/app` runs on `http://localhost:5173`

---

## Testing the Signup Flow

### Step 1 — Verify the signup button

Open `http://localhost:3000` in your browser. You should see:

- A heading: "NoHotfix"
- A tagline: "Release readiness, enforced."
- An **unstyled** "Sign up" button (browser default appearance — no custom styles)

### Step 2 — Complete signup

Click the signup button. You should be redirected to the WorkOS AuthKit-hosted signup page. Complete the form with a real or test email address.

### Step 3 — Verify redirect

After completing signup, WorkOS redirects to `http://localhost:3000/auth/callback`. The callback route exchanges the code for tokens, sets session cookies, and redirects to `http://localhost:5173`.

### Step 4 — Verify session display on apps/app

The React SPA at `http://localhost:5173` should display the full WorkOS user object as formatted JSON:

```json
{
  "id": "user_01ABC123",
  "email": "your@email.com",
  "firstName": "Your",
  "lastName": "Name",
  "profilePictureUrl": null,
  "emailVerified": true,
  "createdAt": "2026-03-04T...",
  "updatedAt": "2026-03-04T...",
  "object": "user"
}
```

### Step 5 — Verify unauthenticated state

Open `http://localhost:5173` in a private/incognito window. The page should render:

```
null
```

No error, no redirect, no login prompt.

### Step 6 — Verify auth-agnostic marketing site

Open `http://localhost:3000` after completing signup (in the same browser). The marketing site should render **identically** to how it appears for an unauthenticated visitor — same heading, same tagline, same unstyled signup button. No redirect to apps/app occurs.

---

## Running Tests

```bash
# Unit tests (session hook)
pnpm turbo run test --filter=@nohotfix/app

# E2E tests (full signup flow)
pnpm turbo run test:e2e --filter=@nohotfix/web-e2e
```

---

## Troubleshooting

| Issue                                                                      | Likely cause                                   | Fix                                                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| "Invalid redirect URI" on WorkOS hosted page                               | `WORKOS_REDIRECT_URI` mismatch                 | Ensure the value in `apps/web/.env.local` matches what's configured in the WorkOS dashboard            |
| Session endpoint returns CORS error                                        | `NEXT_PUBLIC_APP_URL` not set                  | Set `NEXT_PUBLIC_APP_URL=http://localhost:5173` in `apps/web/.env.local`                               |
| apps/app shows `Loading...` indefinitely                                   | `VITE_WEB_URL` not set or apps/web not running | Ensure both dev servers are running and `apps/app/.env.local` has `VITE_WEB_URL=http://localhost:3000` |
| Signup button has custom styles                                            | Accidental CSS applied globally                | Remove any global button styles or CSS resets that target `button` elements                            |
| `next build` fails with "WORKOS_CLIENT_ID environment variable is not set" | Missing `apps/web/.env.local`                  | Create `apps/web/.env.local` with the required WorkOS vars (see Prerequisites above)                   |
| `WORKOS_COOKIE_PASSWORD` length error                                      | Password too short                             | The cookie password must be at least 32 characters — use a long random string                          |
