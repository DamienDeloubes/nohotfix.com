# Testing — NoHotfix

TRIGGER: When writing, modifying, or debugging tests across any package or app in the repository.

## Framework & Tools

| Tool                      | Version | Purpose                                 |
| ------------------------- | ------- | --------------------------------------- |
| Vitest                    | 2.1.8   | Unit + integration tests                |
| Playwright                | 1.49.1  | E2E browser tests                       |
| @testing-library/react    | 16.3.2  | React component/hook testing            |
| @testing-library/jest-dom | 6.9.1   | DOM assertions                          |
| jsdom                     | 25.0.1  | Browser DOM environment for React tests |

## Test Commands

```bash
pnpm test                    # turbo run test (all packages)
pnpm test:e2e                # turbo run test:e2e (Playwright)
pnpm --filter app test       # vitest in apps/app only
pnpm --filter api test       # vitest in apps/api only
```

All vitest scripts use `vitest run --passWithNoTests` — zero tests = success.

## Vitest Configuration Per Package

| Package              | Config             | Environment            | File Pattern             |
| -------------------- | ------------------ | ---------------------- | ------------------------ |
| `apps/api`           | `vitest.config.ts` | `node`                 | `src/**/*.spec.ts`       |
| `apps/app`           | `vitest.config.ts` | `jsdom` + React plugin | `src/**/*.spec.{ts,tsx}` |
| `packages/domains/*` | `vitest.config.ts` | `node`                 | `src/**/*.test.ts`       |

Note the naming split: `.spec.ts` for apps, `.test.ts` for domain packages.

## Test File Locations

```
apps/api/src/routes/auth.spec.ts                    # Fastify route tests
apps/app/src/lib/session.spec.ts                     # Session/token management tests
packages/api-client/src/__tests__/client.test.ts     # ApiClient unit tests

packages/domains/identity/src/entities/__tests__/
  display-name.test.ts
  email.test.ts
  membership.test.ts
  organisation.test.ts
  organisation-name.test.ts
  role.test.ts
  user.test.ts
  workos-user-id.test.ts

apps/app-e2e/tests/smoke.spec.ts                    # E2E smoke
apps/app-e2e/tests/session-display.spec.ts           # E2E session flows
apps/web-e2e/tests/smoke.spec.ts                     # E2E smoke
apps/web-e2e/tests/signup.spec.ts                    # E2E signup flow
```

## Test Categories & Patterns

### 1. Domain Unit Tests (pure, no mocks)

Test entities and value objects directly. No HTTP, no DB, no mocking required.

```typescript
// packages/domains/identity/src/entities/__tests__/email.test.ts
import { describe, expect, it } from 'vitest';

import { Email } from '../email.js';

describe('Email', () => {
  it('creates a valid email', () => {
    const email = Email.create('user@example.com');
    expect(email.value).toBe('user@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => Email.create('not-an-email')).toThrow();
  });
});
```

**Rules**:

- Test both happy path and validation errors
- Test immutability (methods return new instances)
- Test equality and string conversion
- No mocks — these are pure functions

### 2. Fastify Route Tests (mocked dependencies)

Use `app.inject()` with a `buildApp()` helper that creates a decorated Fastify instance.

```typescript
// apps/api/src/routes/auth.spec.ts
import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function buildApp(overrides = {}) {
  const app = Fastify();
  // Decorate with mocked config, workos, db, etc.
  app.decorate('workos', { userManagement: { revokeSession: vi.fn() } });
  app.decorate('config', { APP_URL: 'http://localhost:5173' });
  // Register routes under test
  return app;
}

describe('POST /auth/logout', () => {
  it('clears cookies and returns ok', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'POST', url: '/auth/logout' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});
```

**Rules**:

- Create a fresh `buildApp()` per describe block or use `beforeEach`
- Mock external dependencies (WorkOS, DB repos) with `vi.fn()`
- Test HTTP status codes, response bodies, cookie handling
- Test error cases (invalid input, auth failures)

### 3. Session / Token Management Tests

Test modules with module-level state (like `session.ts` which caches tokens) by resetting modules between tests:

```typescript
// apps/app/src/lib/session.spec.ts
import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getAccessToken as getAccessTokenFn, logout as logoutFn } from './session.js';

let logout: typeof logoutFn;
let getAccessToken: typeof getAccessTokenFn;

describe('logout', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    const mod = await import('./session.js');
    logout = mod.logout;
    getAccessToken = mod.getAccessToken;
  });

  it('calls POST /auth/logout with credentials include', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    // ... test assertions
  });
});
```

**Rules**:

- `vi.resetModules()` before reimporting modules with module-level state
- `vi.stubGlobal('fetch', ...)` for mocking fetch
- Fresh `QueryClient` per test (no cache bleed)
- Test loading, success, error, and retry states

### 4. E2E Tests (Playwright)

User-centric flows with requirement traceability (US1, US2, etc.).

```typescript
// apps/app-e2e/tests/smoke.spec.ts
import { expect, test } from '@playwright/test';

test('loads the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
```

**Configuration**:

- `apps/app-e2e`: port 5173 (Vite dev server)
- `apps/web-e2e`: port 3000 (Next.js dev server)
- HTML reporter, trace on first retry
- Retries: 0 local, 2 on CI
- Auto-launches dev server with reuse

## Mocking Patterns

| Pattern                        | Usage                                       |
| ------------------------------ | ------------------------------------------- |
| `vi.fn()`                      | Function mocks (spies with return values)   |
| `vi.fn().mockResolvedValue(x)` | Async function mocks                        |
| `vi.fn().mockReturnValue(x)`   | Sync function mocks                         |
| `vi.stubGlobal('fetch', mock)` | Global fetch mock                           |
| `vi.spyOn(obj, 'method')`      | Spy on existing methods                     |
| `vi.resetModules()`            | Reset module cache (for modules with state) |
| `vi.mock('./path.js')`         | Module-level mocking                        |

No external mocking libraries — use Vitest's built-in `vi.*` API exclusively.

## Assertion Style

```typescript
// Value assertions
expect(result).toBe(value);
expect(result).toEqual(obj);
expect(result).toBeNull();
expect(result).toBeInstanceOf(Date);
expect(result).toHaveProperty('field');

// Error assertions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('message');

// Mock assertions
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledWith(arg1, arg2);

// Playwright assertions
await expect(element).toBeVisible();
await expect(element).toHaveText('text');
```

## Test Writing Guidelines

1. **Domain tests are pure** — no mocks, no HTTP, no DB. Test entities and value objects directly.
2. **Route tests mock dependencies** — create a `buildApp()` helper, mock repos/services via `vi.fn()`.
3. **Hook tests need QueryClient wrapper** — always create fresh per test to avoid cache bleed.
4. **Reset module state** — use `vi.resetModules()` when testing modules with top-level variables (e.g., `session.ts` caches tokens).
5. **Test the contract, not the implementation** — assert on outputs and side effects, not internal calls.
6. **No shared fixture library exists yet** — create test data inline per test file. If you need a builder, create it as a local helper in the test file.
7. **Use `.js` extensions** in dynamic imports inside tests: `await import('./session.js')`.

## CI Integration

- `.github/workflows/ci.yml` runs `pnpm turbo run test` on every PR + push
- Turbo task: `test` depends on `^build` (build packages first)
- E2E tests (`test:e2e`) are NOT in CI currently (require manual auth state)
- `--passWithNoTests` ensures packages without tests still pass
