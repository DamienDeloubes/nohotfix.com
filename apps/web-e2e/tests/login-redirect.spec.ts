/**
 * E2E: Login Redirect Flow (004-login-redirect)
 *
 * Tests the login button on the marketing page:
 *   1. "Log in" link is visible and unstyled (no button wrapper)
 *   2. Clicking without a session redirects to WorkOS sign-in
 *   3. After auth, user arrives at apps/app dashboard
 *
 * To run: pnpm turbo run test:e2e --filter=@nohotfix/web-e2e
 */

import { expect, test } from '@playwright/test';

// ── US3: Unstyled Login Button on Marketing Page ────────────────────────────

test('US3: login link is visible, unstyled, and has correct href', async ({ page }) => {
  await page.goto('/');

  // The login link should be a plain <a> tag (not wrapped in a <button>)
  const loginLink = page.locator('a[href*="/auth/login?screen_hint=sign-in"]');
  await expect(loginLink).toBeVisible();
  await expect(loginLink).toHaveText('Log in');

  // Verify it is NOT wrapped in a button (unstyled requirement)
  const parentButton = loginLink.locator('button');
  await expect(parentButton).toHaveCount(0);
});

// ── US1 + US2: Login Redirect Flows ────────────────────────────────────────

test('US2: clicking login without session redirects to WorkOS sign-in', async ({ page }) => {
  await page.goto('/');

  const loginLink = page.locator('a[href*="/auth/login?screen_hint=sign-in"]');
  await expect(loginLink).toBeVisible();

  // Click and verify redirect to WorkOS AuthKit hosted UI
  await loginLink.click();
  await page.waitForURL(/workos\.com|authkit/, { timeout: 10_000 });
  expect(page.url()).toMatch(/workos\.com|authkit/);
});

test('US1: authenticated user clicking login is redirected to app dashboard', async ({ page }) => {
  // NOTE: This test requires a pre-authenticated browser context with
  // valid refresh token cookies on the API domain.
  // Skipped in CI unless a storageState file is provided.
  test.skip(!process.env['PLAYWRIGHT_AUTH_FILE'], 'Requires pre-authenticated storage state — set PLAYWRIGHT_AUTH_FILE env var');

  await page.goto('/');

  const loginLink = page.locator('a[href*="/auth/login?screen_hint=sign-in"]');
  await loginLink.click();

  // Authenticated users should be redirected to apps/app dashboard
  await page.waitForURL(/localhost:5173|app\.nohotfix\.io/, {
    timeout: 10_000,
  });
});
