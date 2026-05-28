/**
 * E2E: Session Display (001-user-signup)
 * Tests that apps/app renders session data correctly for authenticated and
 * unauthenticated visitors without any redirect.
 *
 * To run: pnpm turbo run test:e2e --filter=@nohotfix/app-e2e
 *
 * Storage state setup (US3):
 *   Complete the signup flow via apps/web-e2e signup.spec.ts first, then
 *   save browser storage state with:
 *     PLAYWRIGHT_SAVE_AUTH=1 pnpm --filter @nohotfix/web-e2e test
 *   This writes auth.json which is referenced by PLAYWRIGHT_AUTH_FILE.
 */

import { expect, test } from '@playwright/test';

// ── US3: Returning Authenticated User ─────────────────────────────────────

test('US3: authenticated user sees their session data as JSON', async ({ browser }) => {
  test.skip(!process.env['PLAYWRIGHT_AUTH_FILE'], 'Requires pre-authenticated storage state — set PLAYWRIGHT_AUTH_FILE env var');

  const context = await browser.newContext({
    storageState: process.env['PLAYWRIGHT_AUTH_FILE'],
  });
  const page = await context.newPage();

  await page.goto('/');

  // Session data must render in a <pre> element
  const pre = page.locator('pre');
  await expect(pre).toBeVisible();

  const text = await pre.textContent();
  expect(text).not.toBe('Loading...');
  expect(text).not.toBeNull();

  // Must be parseable JSON containing an email field
  const parsed = JSON.parse(text ?? '');
  expect(parsed).toHaveProperty('email');

  // URL must remain on apps/app — no redirect
  expect(page.url()).toMatch(/localhost:5173|app\.nohotfix\.io/);

  await context.close();
});

// ── US4: Unauthenticated Visitor ──────────────────────────────────────────

test('US4: unauthenticated visitor sees null with no redirect or error', async ({ browser }) => {
  // Fresh browser context — no session cookies
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('/');

  // <pre> must be visible showing null
  const pre = page.locator('pre');
  await expect(pre).toBeVisible();

  const text = await pre.textContent();
  expect(text?.trim()).toBe('null');

  // URL must remain at / — no redirect occurred
  expect(page.url()).toMatch(/localhost:5173|app\.nohotfix\.io/);

  // No error message or login prompt
  await expect(page.locator('text=Error')).not.toBeVisible();
  await expect(page.locator('button:has-text("Login"), button:has-text("Sign in")')).not.toBeVisible();

  await context.close();
});
