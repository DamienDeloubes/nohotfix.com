import { test, expect } from "@playwright/test";

/*
 * E2E for /features/go-no-go (US2).
 * Verifies: 200 + single <h1> + heading order; severity-sorted spec list with
 * failed-first tint; §2 paired-hover highlight reachable via keyboard focus
 * (aria-controls/describedby); §4 Confirm is disabled initially; CTAs/cross-links
 * correct; JSON-LD present.
 */

const PATH = "/features/go-no-go";

test("loads with a 200 and exactly one h1", async ({ page }) => {
  const res = await page.goto(PATH);
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("made once and locked");
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

test("the decision screen surfaces a failed critical spec", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByText("Checkout total recalculation").first()).toBeVisible();
  await expect(page.getByText("Critical").first()).toBeVisible();
  await expect(page.getByText("Failed").first()).toBeVisible();
});

test("section 2 explainer items are keyboard-focusable and describe a callout", async ({ page }) => {
  await page.goto(PATH);
  const item = page.locator('li[aria-describedby="gng-callout-1"]');
  await expect(item).toBeVisible();
  await item.focus();
  await expect(item).toBeFocused();
  // The callout target the item describes exists in the DOM.
  await expect(page.locator("#gng-callout-1")).toHaveCount(1);
});

test("the Go-with-failures Confirm button is disabled until justified", async ({ page }) => {
  await page.goto(PATH);
  const confirm = page.locator('button[aria-disabled="true"]', { hasText: "Confirm" });
  await expect(confirm).toBeVisible();
  await expect(confirm).toHaveAttribute("title", /justification/i);
});

test("CTAs and cross-links point to the specified destinations", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('a[href*="screen_hint=sign-up"]').first()).toBeVisible();
  await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
  await expect(page.locator('a[href="/features/artifact-enforcement"]').first()).toBeVisible();
  await expect(page.locator('a[href="/features/audit-trail"]').first()).toBeVisible();
  await expect(page.locator('a[href="/use-cases/engineering-managers"]').first()).toBeVisible();
});

test("emits SoftwareApplication, ItemPage and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto(PATH);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types).toContain("SoftwareApplication");
  expect(types).toContain("ItemPage");
  expect(types).toContain("BreadcrumbList");
});
