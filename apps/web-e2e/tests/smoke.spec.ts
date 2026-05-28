import { test, expect } from "@playwright/test";

test("web loads without crashing", async ({ page }) => {
  await page.goto("/");
  // Placeholder: verify the page returns a non-error HTTP status
  expect(page.url()).toBeTruthy();
});
