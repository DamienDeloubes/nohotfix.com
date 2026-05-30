import { test, expect } from "@playwright/test";

/*
 * E2E for /features/artifact-enforcement (US1).
 * Verifies: 200 + single <h1> + no skipped heading levels; the blocked Pass
 * button reads as blocked (aria-disabled + accessible tooltip, not a spinner);
 * the six artifact-type <h3> names are present; §3 blocked-vs-enabled both
 * render; CTAs/cross-links point to the specified hrefs; JSON-LD parses.
 */

const PATH = "/features/artifact-enforcement";

test("loads with a 200 and exactly one h1", async ({ page }) => {
  const res = await page.goto(PATH);
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("No artifact, no pass");
});

test("heading hierarchy does not skip levels", async ({ page }) => {
  await page.goto(PATH);
  const levels = await page
    .locator("h1, h2, h3")
    .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
});

test("the blocked Pass button reads as blocked, not loading", async ({ page }) => {
  await page.goto(PATH);
  const blocked = page.locator('button[aria-disabled="true"]', { hasText: "Pass" }).first();
  await expect(blocked).toBeVisible();
  // Accessible, crawlable tooltip via native title (not a CSS pseudo-element)
  await expect(blocked).toHaveAttribute("title", /attach/i);
  // No spinner/progressbar masquerading as a loading state
  await expect(blocked.locator('[role="progressbar"]')).toHaveCount(0);
});

test("all six artifact type names appear as crawlable headings", async ({ page }) => {
  await page.goto(PATH);
  for (const name of [
    "File upload",
    "Text entry",
    "Explicit confirmation",
    "URL",
    "Measured value",
    "Structured table",
  ]) {
    await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
  }
});

test("section 3 shows both a blocked and an enabled Pass button", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('button[aria-disabled="true"]', { hasText: "Pass" })).not.toHaveCount(0);
  // The enabled step-3 button is a real, non-disabled Pass button.
  const enabled = page.locator('button:not([aria-disabled="true"])', { hasText: "Pass" });
  await expect(enabled).not.toHaveCount(0);
});

test("CTAs and cross-links point to the specified destinations", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('a[href*="screen_hint=sign-up"]').first()).toBeVisible();
  await expect(page.locator('a[href="/features/go-no-go"]').first()).toBeVisible();
  await expect(page.locator('a[href="/features/audit-trail"]').first()).toBeVisible();
  await expect(page.locator('a[href="/how-it-works"]').first()).toBeVisible();
  await expect(page.locator('a[href="/use-cases/qa-teams"]').first()).toBeVisible();
  await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
});

test("emits SoftwareApplication, ItemPage and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto(PATH);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types).toContain("SoftwareApplication");
  expect(types).toContain("ItemPage");
  expect(types).toContain("BreadcrumbList");
});
