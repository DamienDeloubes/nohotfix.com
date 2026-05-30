import { test, expect } from "@playwright/test";

/*
 * E2E for cross-page navigation + nav active state (US4).
 * Scoped to the pages live at this phase (Artifact Enforcement + Go/No-Go).
 * Asserts: the "Features" nav trigger is active on each, the matching mega-panel
 * item is active, the AE<->GNG cross-links resolve, and each page links to
 * /how-it-works, /pricing, and its persona /use-cases/* page.
 * (Full three-way triangle closure is asserted in features-audit-trail.spec.ts.)
 */

const PAGES = [
  { path: "/features/artifact-enforcement", persona: "/use-cases/qa-teams", other: "/features/go-no-go" },
  { path: "/features/go-no-go", persona: "/use-cases/engineering-managers", other: "/features/artifact-enforcement" },
];

for (const p of PAGES) {
  test(`${p.path}: Features nav trigger shows the active state`, async ({ page }) => {
    await page.goto(p.path);
    const trigger = page.getByRole("button", { name: /Features/ });
    await expect(trigger).toHaveAttribute("aria-current", "page");
  });

  test(`${p.path}: the matching Features mega-panel item is active`, async ({ page }) => {
    await page.goto(p.path);
    await page.getByRole("button", { name: /Features/ }).hover();
    const activeItem = page.locator(`a[href="${p.path}"][aria-current="page"]`);
    await expect(activeItem.first()).toBeVisible();
  });

  test(`${p.path}: links to the other feature page, how-it-works, pricing, and its persona`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.locator(`a[href="${p.other}"]`).first()).toBeVisible();
    await expect(page.locator('a[href="/how-it-works"]').first()).toBeVisible();
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
    await expect(page.locator(`a[href="${p.persona}"]`).first()).toBeVisible();
  });
}
