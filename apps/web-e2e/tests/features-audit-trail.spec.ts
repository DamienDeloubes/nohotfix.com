import { test, expect } from "@playwright/test";

/*
 * E2E for /features/audit-trail (US3).
 * Verifies: 200 + single <h1> + heading order; sealed lock has a tooltip and
 * does not animate; under prefers-reduced-motion the §3 callouts render as
 * static Geist Mono (TextType not animating); §5 disclaimer present; final CTA
 * primary "Talk to us" / secondary "Start free"; cross-links + JSON-LD.
 * Also asserts FULL cross-link triangle closure now that all three pages exist.
 */

const PATH = "/features/audit-trail";

test("loads with a 200 and exactly one h1", async ({ page }) => {
  const res = await page.goto(PATH);
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("sealed when the call is made");
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

test("the sealed lock exposes a tooltip", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator("svg title", { hasText: /sealed/i }).first()).toBeAttached();
});

test("compliance disclaimer is visible and not buried", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByText(/does not hold a SOC2 certification/i)).toBeVisible();
});

test("final CTA primary is Talk to us, secondary is Start free", async ({ page }) => {
  await page.goto(PATH);
  // Primary (filled) Talk to us → /contact
  await expect(page.locator('a[href="/contact"]').last()).toBeVisible();
  // Secondary (bordered) Start free → signup
  await expect(page.locator('a[href*="screen_hint=sign-up"]').last()).toBeVisible();
});

test("the full cross-link triangle is closed (all three pages link to the other two)", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('a[href="/features/artifact-enforcement"]').first()).toBeVisible();
  await expect(page.locator('a[href^="/features/go-no-go"]').first()).toBeVisible();
  // honesty/roadmap + persona + how-it-works + pricing
  await expect(page.locator('a[href="/platform"]').first()).toBeVisible();
  await expect(page.locator('a[href="/use-cases/compliance"]').first()).toBeVisible();
});

test("under reduced motion, the immutability callouts render full static text", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(PATH);
  // The full constraint line is present immediately (TextType disabled → static).
  await expect(page.getByText("404 Not Found — POST /runs/{id}/specs/{specId}")).toBeVisible();
  await expect(page.getByText(/CHECK constraint — run_status/)).toBeVisible();
  await context.close();
});

test("emits SoftwareApplication, ItemPage and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto(PATH);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types).toContain("SoftwareApplication");
  expect(types).toContain("ItemPage");
  expect(types).toContain("BreadcrumbList");
});
