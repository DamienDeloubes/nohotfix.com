/**
 * E2E: User Signup Flow (001-user-signup)
 *
 * WorkOS test account setup:
 *   1. Create a WorkOS application at https://dashboard.workos.com
 *   2. Add http://localhost:3001/auth/callback as a redirect URI
 *   3. Set WORKOS_CLIENT_ID, WORKOS_API_KEY, WORKOS_REDIRECT_URI in apps/api/.env
 *   4. Use a real email address to complete the hosted signup form
 *
 * To run: pnpm turbo run test:e2e --filter=@nohotfix/web-e2e
 */

import { expect, test } from '@playwright/test';

// ── US1: New Visitor Completes Signup ──────────────────────────────────────

test('US1: signup button links to API auth endpoint', async ({ page }) => {
  await page.goto('/');

  // Assert the signup button is present
  const link = page.locator('a[href*="/auth/login"]');
  await expect(link).toBeVisible();

  const button = link.locator('button');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Sign up');

  // Click and assert redirect to WorkOS AuthKit hosted UI
  await link.click();

  // WorkOS redirects the browser to its hosted auth domain
  await page.waitForURL(/workos\.com|authkit/, { timeout: 10_000 });
  expect(page.url()).toMatch(/workos\.com|authkit/);
});

test('US1: after signup, user lands on apps/app with session data', async ({ page }) => {
  // NOTE: This test requires completing the WorkOS signup form manually or
  // using a pre-authenticated browser context (storageState).
  // Skipped in CI unless a storageState file is provided.
  test.skip(!process.env['PLAYWRIGHT_AUTH_FILE'], 'Requires pre-authenticated storage state — set PLAYWRIGHT_AUTH_FILE env var');

  await page.goto('/');
  const link = page.locator('a[href*="/auth/login"]');
  await link.click();

  // After WorkOS signup, callback redirects to apps/app with ?token=...
  await page.waitForURL(/localhost:5173|app\.nohotfix\.io/, {
    timeout: 30_000,
  });

  // Session data should render as JSON in a <pre> element
  const pre = page.locator('pre');
  await expect(pre).toBeVisible();
  const text = await pre.textContent();
  expect(text).not.toBe('Loading...');
  const parsed = JSON.parse(text ?? '');
  expect(parsed).toHaveProperty('id');
  expect(parsed).toHaveProperty('email');
});

// ── US2: Auth-Agnostic Marketing Site ─────────────────────────────────────

test('US2: visiting marketing site shows same page regardless of auth state', async ({ browser }) => {
  // NOTE: Requires a pre-authenticated context. Skip if not available.
  test.skip(!process.env['PLAYWRIGHT_AUTH_FILE'], 'Requires pre-authenticated storage state — set PLAYWRIGHT_AUTH_FILE env var');

  const context = await browser.newContext({
    storageState: process.env['PLAYWRIGHT_AUTH_FILE'],
  });
  const page = await context.newPage();

  await page.goto('/');

  // Marketing page heading and signup link are still visible — no redirect
  await expect(page.locator('h1')).toBeVisible();
  const link = page.locator('a[href*="/auth/login"]');
  await expect(link).toBeVisible();

  // URL must remain on marketing site (no redirect to apps/app)
  expect(page.url()).not.toMatch(/localhost:5173|app\.nohotfix\.io/);

  await context.close();
});
