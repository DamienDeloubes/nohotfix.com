import { test, expect } from "@playwright/test";

/*
 * SEO hardening across all three feature pages (US5).
 * Asserts per page: exactly one <h1>; <main> + every band as <section
 * aria-labelledby>; valid JSON-LD with the three required @types; a distinct
 * <title>; and that disabling images leaves the mechanic labels readable
 * (fragments are DOM, not rasters — SC-005).
 */

const PAGES = [
  "/features/artifact-enforcement",
  "/features/go-no-go",
  "/features/audit-trail",
];

test("each page has a distinct, non-duplicate <title>", async ({ page }) => {
  const titles = new Set<string>();
  for (const p of PAGES) {
    await page.goto(p);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    titles.add(title);
  }
  expect(titles.size).toBe(PAGES.length);
});

for (const p of PAGES) {
  test(`${p}: one <main>, sections are labelled, single <h1>`, async ({ page }) => {
    await page.goto(p);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    // Every content <section> is associated with a heading via aria-labelledby.
    const sections = page.locator("main section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(sections.nth(i)).toHaveAttribute("aria-labelledby", /.+/);
    }
  });

  test(`${p}: JSON-LD has SoftwareApplication, ItemPage, BreadcrumbList`, async ({ page }) => {
    await page.goto(p);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => JSON.parse(b)["@type"]);
    expect(types).toContain("SoftwareApplication");
    expect(types).toContain("ItemPage");
    expect(types).toContain("BreadcrumbList");
  });

  test(`${p}: mechanic labels are DOM text (survive images disabled)`, async ({ page }) => {
    await page.route("**/*.{png,jpg,jpeg,gif,webp,svg}", (route) => route.abort());
    await page.goto(p);
    // At least one real product-UI label is present as live text.
    const hasLabel = await page
      .getByText(/Pass|Go|Sealed|Critical|Passed|justification/i)
      .first()
      .isVisible();
    expect(hasLabel).toBe(true);
  });
}
